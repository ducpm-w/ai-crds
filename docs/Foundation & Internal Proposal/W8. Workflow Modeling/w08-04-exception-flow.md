# Exception Flow — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Mô tả chi tiết 6 loại ngoại lệ của AI-CRDS tại Bank X, cách xử lý và yêu cầu ghi audit. Tài liệu mở rộng Mục 5 (ngoại lệ hệ thống và nghiệp vụ) của `w05-02-decision-state-spec.md`.

Các tần suất, thời gian và ngưỡng trong tài liệu là giả định lập kế hoạch, sẽ được điều chỉnh theo dữ liệu vận hành thực của Bank X.

---

## 1. TỔNG HỢP NGOẠI LỆ

| Mã | Ngoại lệ | Điều kiện kích hoạt | Mức nghiêm trọng | Tần suất (ước tính) | Ảnh hưởng trạng thái | Cách phục hồi |
|----|---------|---------------------|------------------|---------------------|----------------------|---------------|
| EX-1 | CIC timeout/không khả dụng | CIC API lỗi sau các lần thử lại | Trung bình | ~2-5% lượt truy vấn (bảo trì CIC, sự cố mạng) | Chuyển State 5 | Tự động thử lại và truy vấn thủ công dự phòng |
| EX-2 | Nhà cung cấp eKYC ngừng hoạt động | eKYC API lỗi sau các lần thử lại | Trung bình | ~1-3% lượt gọi (bảo trì nhà cung cấp) | Chuyển State 5 | Khách thử lại và xác minh tại chi nhánh |
| EX-3 | CBS không truy cập được | CBS API timeout/lỗi | Cao | Hiếm (~0,1%) nhưng ảnh hưởng mọi hồ sơ | Chuyển State 4 (mọi hồ sơ) | Xử lý sự cố của IT |
| EX-4 | Lỗi/timeout mô hình AI | Mô hình chấm điểm thất bại | Cao | Hiếm (~0,05%) | Chuyển State 4 | Chuyển sang xử lý thủ công |
| EX-5 | Hồ sơ trùng | Cùng CCCD và sản phẩm trong 30 ngày | Trung bình | ~1-3% hồ sơ | Chuyển State 3 hoặc gộp hồ sơ | CO thẩm định |
| EX-6 | Khách từ chối AI | Khách yêu cầu thẩm định thủ công | Thấp | ~2-5% hồ sơ (ước tính) | Chuyển State 2 (100% thủ công) | Xử lý bình thường |

---

## 2. CHI TIẾT TỪNG NGOẠI LỆ

### EX-1: CIC timeout / không khả dụng

```
Khởi tạo gọi CIC API
    │
    ├── Lần 1: timeout (30 giây) hoặc phản hồi lỗi
    │   → Chờ 10 giây
    │
    ├── Lần 2: timeout hoặc lỗi
    │   → Chờ 20 giây
    │
    ├── Lần 3: timeout hoặc lỗi
    │   → CIC được xác định KHÔNG KHẢ DỤNG
    │
    ▼
┌─────────────────────────────────────┐
│ CHUYỂN STATE 5 (Need-More-Info)     │
│                                     │
│ Cờ: CIC_UNAVAILABLE                 │
│ Đồng hồ SLA: TIẾP TỤC (không dừng)  │
│                                     │
│ Hành động song song:                │
│ ├── Tự động thử lại CIC mỗi 30 phút │
│ │   (tối đa 4 lần = 2 giờ)          │
│ │                                   │
│ ├── Nếu thử lại thành công:         │
│ │   → Quay lại Stage 3              │
│ │   → Tiếp tục chấm điểm bình thường│
│ │                                   │
│ ├── Nếu mọi lần thử lại thất bại:   │
│ │   → Thông báo CO: "CIC unavailable"│
│ │   → CO truy vấn CIC thủ công qua  │
│ │     web portal                    │
│ │   → CO nhập dữ liệu CIC           │
│ │   → Tiếp tục chấm điểm với dữ liệu│
│ │     CIC nhập thủ công             │
│ │                                   │
│ └── Nếu CIC ngừng > 4 giờ:          │
│     → Leo thang lên IT và cấp trên  │
│     → Không xử lý hồ sơ khi thiếu   │
│       CIC (CIC là dữ liệu bắt buộc) │
│     → Hồ sơ chờ trong hàng đợi đến  │
│       khi CIC phục hồi              │
└─────────────────────────────────────┘
```

| Thuộc tính | Giá trị |
|-----------|---------|
| Cấu hình thử lại | 3 lần, mỗi lần timeout 30 giây; backoff 10 giây, 20 giây |
| Tự động thử lại | Mỗi 30 phút, tối đa 4 lần, tổng 2 giờ |
| Dự phòng thủ công | CO truy vấn CIC qua web portal, mất 1-5 phút |
| Audit log | `exception_type: "CIC_UNAVAILABLE"`, `retry_count: 3`, `auto_retry_count: X`, `resolution: "auto_recovered" / "manual_cic" / "queued"` |
| Guardrail | Nếu CIC không khả dụng > 4 giờ, kích hoạt guardrail G-O4 (tính sẵn sàng của hệ thống) |
| Nguyên tắc | Không duyệt hồ sơ khi thiếu CIC. CIC là đặc trưng bắt buộc (Tier 1) nên không thể chấm điểm khi thiếu. Cần phân biệt khách thin-file (không có bản ghi CIC, dùng mô hình thin-file) với sự cố CIC ngừng hoạt động (lỗi hệ thống). |

### EX-2: Nhà cung cấp eKYC ngừng hoạt động

```
Khởi tạo gọi eKYC API
    │
    ├── Lần 1: timeout (15 giây) hoặc lỗi
    │   → Chờ 5 giây
    │
    ├── Lần 2: timeout hoặc lỗi
    │   → eKYC được xác định NGỪNG HOẠT ĐỘNG
    │
    ▼
┌─────────────────────────────────────┐
│ CHUYỂN STATE 5 (Need-More-Info)     │
│                                     │
│ Cờ: EKYC_PROVIDER_DOWN              │
│                                     │
│ Thông báo cho khách:                │
│ "Hệ thống xác minh danh tính đang  │
│  bảo trì. Vui lòng thử lại sau     │
│  30 phút hoặc đến chi nhánh."      │
│                                     │
│ ├── Tự động thử lại: mỗi 15 phút × 8│
│ │   (tổng 2 giờ)                    │
│ │                                   │
│ ├── Nếu thử lại thành công:         │
│ │   → Thông báo khách: "thử lại ngay"│
│ │   → Khách gửi eKYC lại            │
│ │   → Tiếp tục pipeline             │
│ │                                   │
│ ├── Dự phòng tại chi nhánh:         │
│ │   → Khách đến chi nhánh           │
│ │   → Xác minh danh tính thủ công   │
│ │     (CCCD gốc và đối chiếu ảnh)   │
│ │   → Nhân viên nhập kết quả xác    │
│ │     minh: đạt/không đạt           │
│ │   → Tiếp tục pipeline             │
│ │                                   │
│ └── Nếu khách không hành động 14 ngày│
│     → Hồ sơ HẾT HẠN                 │
└─────────────────────────────────────┘
```

| Thuộc tính | Giá trị |
|-----------|---------|
| Cấu hình thử lại | 2 lần, mỗi lần timeout 15 giây |
| Tự động thử lại | Mỗi 15 phút, tối đa 8 lần, tổng 2 giờ |
| Dự phòng tại chi nhánh | Nhân viên chi nhánh xác minh danh tính thủ công. Mức bảo mật thấp hơn eKYC sinh trắc học nên chỉ áp dụng như phương án dự phòng tạm thời cho ngoại lệ. |
| Audit log | `exception_type: "EKYC_PROVIDER_DOWN"`, `resolution: "auto_recovered" / "branch_manual" / "expired"`, `manual_verify_staff_id` (nếu xác minh tại chi nhánh) |
| Thông tư 45/2025 | TT 45 yêu cầu xác thực sinh trắc học. Phương án xác minh thủ công tại chi nhánh được thực hiện theo quy trình xác minh danh tính của Bank X và ghi nhận đầy đủ nhân viên, thời điểm và kết quả trong audit trail. |

### EX-3: CBS không truy cập được

```
Khởi tạo gọi CBS API (đọc dữ liệu khách hàng)
    │
    ├── Lần 1: timeout (10 giây) hoặc lỗi
    │   → Chờ 5 giây
    │
    ├── Lần 2: timeout hoặc lỗi
    │   → Chờ 10 giây
    │
    ├── Lần 3: timeout hoặc lỗi
    │   → CBS được xác định KHÔNG TRUY CẬP ĐƯỢC
    │
    ▼
┌─────────────────────────────────────┐
│ MỨC NGHIÊM TRỌNG: CAO               │
│                                     │
│ CBS không truy cập được = KHÔNG thể │
│ xử lý BẤT KỲ hồ sơ nào (thiếu dữ    │
│ liệu khách hàng)                    │
│                                     │
│ Hành động tức thời:                 │
│ ├── MỌI hồ sơ mới → State 4         │
│ │   (Escalate — xử lý thủ công)     │
│ ├── Kích hoạt xử lý sự cố của IT    │
│ ├── Cảnh báo Ops Manager và IT      │
│ │   Manager                         │
│ ├── Đồng hồ SLA: TẠM DỪNG cho các   │
│ │   hồ sơ bị ảnh hưởng              │
│ └── Dashboard: trạng thái hệ thống =│
│     "CBS UNREACHABLE — manual mode" │
│                                     │
│ CO trong thời gian CBS ngừng:       │
│ ├── VẪN truy cập được CIC (riêng)   │
│ ├── VẪN thực hiện được eKYC (riêng) │
│ ├── KHÔNG truy cập được hồ sơ khách │
│ ├── KHÔNG kiểm tra được sản phẩm    │
│ │   hiện hữu                        │
│ └── Chỉ xử lý với dữ liệu hiện có   │
│     → CO cấp cao thẩm định thủ công │
│       toàn diện                     │
│                                     │
│ Phục hồi:                           │
│ ├── CBS phục hồi → tự động tiếp tục │
│ ├── Xử lý lại các hồ sơ trong hàng  │
│ │   đợi                             │
│ └── Báo cáo sau sự cố trong 24 giờ  │
└─────────────────────────────────────┘
```

| Thuộc tính | Giá trị |
|-----------|---------|
| Mức nghiêm trọng | Cao: ảnh hưởng toàn bộ hồ sơ |
| Cấu hình thử lại | 3 lần, mỗi lần timeout 10 giây; backoff 5 giây, 10 giây |
| Dự phòng | CO cấp cao xử lý thủ công với dữ liệu giới hạn. Không tự động định tuyến (State 1) trong thời gian sự cố. |
| Audit log | `exception_type: "CBS_UNREACHABLE"`, `outage_start`, `outage_end`, `applications_affected_count`, `resolution: "auto_recovered" / "manual_processed"` |
| Guardrail | Kích hoạt G-O4 (tính sẵn sàng hệ thống ≥ 99%). Nếu sự cố > 1 giờ, thông báo Ops Manager và CTO. |
| Sau sự cố | Phân tích nguyên nhân gốc trong 24 giờ. Báo cáo Risk Committee nếu sự cố > 2 giờ. |

### EX-4: Lỗi / timeout mô hình AI

```
Gọi mô hình chấm điểm AI
    │
    ├── Mô hình phản hồi > 30 giây (timeout)
    │   HOẶC
    ├── Mô hình trả lỗi / null / đầu ra không hợp lệ
    │   HOẶC
    ├── Mô hình trả điểm ngoài khoảng cho phép (< 0 hoặc > 1)
    │
    ▼
┌─────────────────────────────────────┐
│ CHUYỂN STATE 4 (Escalate)           │
│ KHÔNG chuyển State 2                │
│                                     │
│ Lý do chọn State 4 thay vì State 2: │
│ State 2 hiển thị khuyến nghị của AI │
│ nhưng khi AI lỗi thì không có khuyến│
│ nghị để hiển thị; CO sẽ thấy panel  │
│ AI trống gây nhầm lẫn. State 4 = CO │
│ cấp cao thẩm định toàn diện thủ công│
│ KHÔNG có đầu ra AI.                 │
│                                     │
│ Song song:                          │
│ ├── Cảnh báo IT: ghi nhận lỗi mô hình│
│ ├── Thông báo đội DS                │
│ ├── Nếu tỷ lệ lỗi > 1% (G-O5):      │
│ │   → Mọi hồ sơ → State 4           │
│ │   → Chế độ thủ công đến khi khắc  │
│ │     phục                          │
│ │                                   │
│ └── CO thấy:                        │
│     "AI scoring unavailable.        │
│      Full manual review required."  │
│     CO có: dữ liệu CIC, eKYC, hồ sơ │
│     khách hàng, tất cả trừ điểm AI. │
└─────────────────────────────────────┘
```

| Thuộc tính | Giá trị |
|-----------|---------|
| Timeout | 30 giây (suy luận mô hình thường mất 2-5 giây; 30 giây là ngưỡng rộng rãi) |
| Loại lỗi | Timeout, HTTP 5xx, phản hồi null, đầu ra không hợp lệ (điểm ngoài [0,1]), sai phiên bản mô hình |
| Dự phòng | State 4 (CO cấp cao xử lý thủ công), không dùng State 2 vì không có đầu ra AI để hiển thị |
| Audit log | `exception_type: "MODEL_ERROR"`, `error_detail: "timeout" / "http_500" / "null_response" / "invalid_score"`, `model_version`, `latency_ms` |
| Guardrail | G-O5: tỷ lệ lỗi > 1% thì chuyển TOÀN BỘ hồ sơ sang State 4. G-M2: nếu lỗi kéo dài thì rollback mô hình về phiên bản trước. |
| Tác động với khách | Khách không nhận thấy AI lỗi; CO xử lý thủ công. Thời gian có thể lâu hơn (SLA State 4: 24 giờ thay vì State 1: 4 giờ). |

### EX-5: Hồ sơ trùng

```
Nhận hồ sơ
    │
    ├── Hệ thống kiểm tra: cùng CCCD + cùng sản phẩm CC
    │   trong 30 ngày lịch?
    │
    ├── CÓ — PHÁT HIỆN TRÙNG
    │
    ▼
┌─────────────────────────────────────┐
│ CỜ: DUPLICATE_APPLICATION           │
│                                     │
│ Các tình huống:                     │
│                                     │
│ A) Hồ sơ trước ĐANG XỬ LÝ           │
│    (State 1/2/3/4/5):               │
│    → Chặn hồ sơ mới                 │
│    → Thông báo khách: "Bạn đã có    │
│      hồ sơ đang xử lý."             │
│    → Hiển thị trạng thái hồ sơ hiện │
│      hữu                            │
│                                     │
│ B) Hồ sơ trước đã BỊ TỪ CHỐI:       │
│    → Kiểm tra quy tắc nộp lại:      │
│      - Từ chối thông thường: 90 ngày│
│        (`w05-04-adverse-action-flow.md`)│
│      - Từ chối do gian lận: 12 tháng│
│    → Nếu còn trong thời hạn chờ:    │
│      Chặn, thông báo lý do và ngày  │
│    → Nếu quá thời hạn:              │
│      Cho phép nộp như hồ sơ mới     │
│                                     │
│ C) Hồ sơ trước đã ĐƯỢC DUYỆT:       │
│    → Chặn: khách đã có sản phẩm CC  │
│      này                            │
│    → Trừ khi: yêu cầu nâng cấp /    │
│      thay thẻ → chuyển luồng riêng  │
│                                     │
│ D) Hồ sơ trước HẾT HẠN / RÚT LẠI:   │
│    → Cho phép nộp như hồ sơ mới     │
│    → Gắn cờ cho CO: "Hồ sơ trước    │
│      hết hạn/rút lại [ngày]"        │
│                                     │
│ E) Cùng CCCD, KHÁC sản phẩm:        │
│    → KHÔNG phải trùng. Xử lý bình   │
│      thường.                        │
│    → Gắn cờ: "Khách có hồ sơ đang   │
│      chờ cho [sản phẩm khác]"       │
│                                     │
│ F) Cùng thiết bị/IP, KHÁC CCCD      │
│    (trong 24 giờ):                  │
│    → Nghi ngờ nhóm gian lận         │
│    → Chuyển State 3                 │
│    → Cờ gian lận: APPLICATION_VELOCITY│
└─────────────────────────────────────┘
```

| Thuộc tính | Giá trị |
|-----------|---------|
| Phát hiện | Tự động: tra cứu CCCD, loại sản phẩm và khoảng thời gian trên cơ sở dữ liệu hồ sơ |
| Tình huống A | Chặn ngay. Khách xem trạng thái hồ sơ hiện hữu. Không cần CO can thiệp. |
| Tình huống B | Kiểm tra chính sách nộp lại (90 ngày với từ chối thông thường, 12 tháng với gian lận), hệ thống tự thực thi. |
| Tình huống F | Tín hiệu gian lận, chuyển State 3; khác với trùng hồ sơ thông thường. |
| Audit log | `exception_type: "DUPLICATE_APPLICATION"`, `previous_app_id`, `previous_app_status`, `scenario: "A" / "B" / "C" / "D" / "E" / "F"`, `action: "blocked" / "allowed" / "fraud_flagged"` |

### EX-6: Khách từ chối AI

```
Khách điền hồ sơ CC
    │
    ├── Màn hình đồng ý hiển thị:
    │   "Hồ sơ sẽ được xử lý có hỗ trợ AI.
    │    Quý khách có muốn xử lý hoàn toàn
    │    bởi nhân viên không?"
    │
    │   [Đồng ý AI]  [Yêu cầu thủ công]
    │
    ├── Khách chọn "Yêu cầu thủ công"
    │
    ▼
┌─────────────────────────────────────┐
│ CỜ: OPT_OUT_AI = TRUE               │
│                                     │
│ Xử lý:                              │
│ ├── Bỏ qua hoàn toàn AI scoring     │
│ │   (bỏ qua Stage 3)                │
│ ├── eKYC và CIC vẫn chạy (không phải│
│ │   AI)                             │
│ ├── Chuyển thẳng State 2            │
│ │   (Standard Review — thủ công đầy │
│ │   đủ)                             │
│ ├── CO thấy: "Customer opted out of │
│ │   AI scoring. Full manual review  │
│ │   required."                      │
│ ├── CO thẩm định theo luồng as-is   │
│ │   (20-35 phút, như trước khi có AI)│
│ └── Nếu từ chối:                    │
│     → Thông báo từ chối KHÔNG kèm   │
│       nhãn AI (AI không tham gia)   │
│     → Khách vẫn có quyền khiếu nại  │
│       qua các kênh thông thường     │
│                                     │
│ Tuân thủ:                           │
│ NĐ 356/2025 Điều 9: quyền từ chối   │
│ quyết định tự động được tôn trọng.  │
└─────────────────────────────────────┘
```

| Thuộc tính | Giá trị |
|-----------|---------|
| Điều kiện kích hoạt | Khách chọn rõ ràng trên form đồng ý |
| Tác động | Hồ sơ xử lý 100% thủ công. Không có AI scoring, không khuyến nghị AI, không nhãn AI. |
| Trải nghiệm của CO | Giống luồng as-is. Không hiển thị panel AI. Thẩm định thủ công đầy đủ. |
| Tác động thời gian | 20-35 phút (thủ công đầy đủ) so với khoảng 3-5 phút (xác nhận theo lô State 1), chậm hơn do khách lựa chọn. |
| Giám sát | L3-C7 (tỷ lệ opt-out), mục tiêu < 5%. Nếu > 10%, rà soát nguyên nhân: khách chưa tin AI hoặc nội dung form đồng ý chưa rõ. |
| Audit log | `opt_out_ai: true`, `opt_out_timestamp`, `opt_out_reason: null` (không yêu cầu khách nêu lý do). Các trường audit liên quan AI để null. |
| Nộp lại | Nếu bị từ chối và khách nộp lại, khách có thể chọn khác (đồng ý AI) ở lần sau. |

---

## 3. MA TRẬN XỬ LÝ NGOẠI LỆ

| Ngoại lệ | Phát hiện | Tự động xử lý | CO can thiệp | IT can thiệp | Tác động SLA |
|---------|----------|---------------|--------------|--------------|--------------|
| EX-1 CIC ngừng | API lỗi sau 3 lần thử lại | Có: tự động thử lại 2 giờ | Truy vấn CIC thủ công nếu tự động thất bại | Điều tra nếu > 4 giờ | SLA tiếp tục |
| EX-2 eKYC ngừng | API lỗi sau 2 lần thử lại | Có: tự động thử lại 2 giờ | Không | Điều tra nếu > 2 giờ | SLA tạm dừng (phụ thuộc khách) |
| EX-3 CBS ngừng | API lỗi sau 3 lần thử lại | Không | Có: chế độ thủ công (toàn bộ S4) | Có: xử lý sự cố | SLA tạm dừng với hồ sơ bị ảnh hưởng |
| EX-4 Lỗi mô hình | Timeout/lỗi/đầu ra không hợp lệ | Có: tự động chuyển S4 | Có: CO cấp cao thủ công | Có: DS và IT điều tra | SLA = S4 (24 giờ) |
| EX-5 Trùng hồ sơ | Khớp CCCD và sản phẩm | Có: tự chặn (A, B, C) hoặc tự cho phép (D, E) | CO thẩm định tình huống F (gian lận) | Không | Không áp dụng (bị chặn) hoặc bình thường |
| EX-6 Từ chối AI | Lựa chọn của khách | Có: tự động chuyển S2 | Có: thẩm định thủ công đầy đủ | Không | SLA S2 bình thường |

---

## 4. NGOẠI LỆ ĐỒNG THỜI

Khi nhiều ngoại lệ xảy ra cùng lúc:

| Tổ hợp | Cách xử lý | Mức ưu tiên |
|--------|-----------|-------------|
| EX-3 (CBS) và EX-1 (CIC) | Cả hai ngừng hoạt động, về thực chất không có dữ liệu. Xếp hàng đợi toàn bộ hồ sơ; kích hoạt xử lý khẩn của IT. | Cao nhất: sự cố kép |
| EX-4 (Mô hình) và EX-1 (CIC) | Không có điểm AI và dữ liệu CIC: chuyển State 4 với dữ liệu rất hạn chế. CO cấp cao quyết định chỉ với eKYC và hồ sơ đăng ký. | Cao |
| EX-1 (CIC) và EX-5 (Trùng hồ sơ) | Kiểm tra trùng vẫn hoạt động (cơ sở dữ liệu nội bộ). CIC ngừng được xử lý riêng. | Trung bình: xử lý độc lập |
| EX-2 (eKYC) và EX-6 (Từ chối AI) | Khách đã từ chối AI. eKYC vẫn cần để xác thực danh tính (TT 45). Dùng dự phòng tại chi nhánh cho eKYC. | Trung bình |
| EX-4 (Mô hình) và đột biến khối lượng (dịp Tết) | Mô hình timeout do tải. Mở rộng hạ tầng suy luận. Nếu không mở rộng kịp, tăng tạm thời SLA State 4 theo phê duyệt khẩn của Risk Committee. | Trung bình |

---

## 5. DASHBOARD GIÁM SÁT NGOẠI LỆ

| Chỉ số | Bình thường | Cảnh báo | Nghiêm trọng |
|--------|------------|----------|--------------|
| Tỷ lệ thử lại CIC (EX-1) | < 2% | 2-5% | > 5%: dịch vụ CIC suy giảm |
| Tỷ lệ thử lại eKYC (EX-2) | < 1% | 1-3% | > 3%: sự cố nhà cung cấp |
| Tỷ lệ lỗi CBS (EX-3) | < 0,1% | 0,1-0,5% | > 0,5%: sự cố IT |
| Tỷ lệ lỗi mô hình (EX-4) | < 0,05% | 0,05-0,5% | > 1%: kích hoạt guardrail G-O5 |
| Tỷ lệ trùng hồ sơ (EX-5) | 1-3% | > 5% | > 8%: có thể có sự cố hệ thống |
| Tỷ lệ opt-out (EX-6) | < 5% | 5-10% | > 10%: vấn đề niềm tin |

---

## 6. NHẬN ĐỊNH CHUNG

1. EX-3 (CBS không truy cập được) là ngoại lệ nghiêm trọng nhất vì ảnh hưởng toàn bộ hồ sơ; các ngoại lệ khác chỉ ảnh hưởng từng hồ sơ riêng lẻ.
2. Nguyên tắc "không duyệt khi thiếu CIC" (EX-1): CIC là dữ liệu bắt buộc. Khách thin-file không có bản ghi CIC là trường hợp hợp lệ và được chấm điểm theo mô hình khác; CIC ngừng hoạt động là sự cố hệ thống, không phải đặc điểm của khách.
3. Tỷ lệ opt-out (EX-6) kỳ vọng dưới 5%. Nếu vượt 10%, cần rà soát nội dung form đồng ý và mức độ tin cậy của khách đối với quyết định có AI.

---

## 7. THAM CHIẾU

- `w05-02-decision-state-spec.md` mục 5: ngoại lệ hệ thống và nghiệp vụ.
- `w08-03-integration-point-map.md`: rủi ro tích hợp.
- `w07-04-guardrail-definitions.md`: điều kiện kích hoạt G-O4, G-O5.
- `w08-02-workflow-to-be.md`: xử lý ngoại lệ ở Stage 2.
