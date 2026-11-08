# UX Wireframes — CO Review Interface
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Wireframe mức low-fidelity (dạng text/ASCII) cho 3 màn hình chính của giao diện xét duyệt dành cho Credit Officer (CO) của Bank X, kèm các quyết định thiết kế. Thiết kế chi tiết đến từng pixel được thực hiện trên cơ sở các wireframe này.

Số liệu, tên khách hàng và ngưỡng hiển thị trong wireframe là dữ liệu minh họa và giả định thiết kế; sẽ được thay bằng dữ liệu thực của Bank X khi có.

**Nguyên tắc thiết kế:**
1. AI giải thích, CO quyết định: bảng AI mang tính cung cấp thông tin, không áp đặt.
2. Không ẩn thông tin: CO thấy đầy đủ dữ liệu hồ sơ và lập luận của AI.
3. Override luôn dễ truy cập, không cần nhiều thao tác.
4. Nhãn theo Luật AI 134/2025 hiển thị rõ ràng.
5. Tốc độ: duyệt hàng loạt phải nhanh, duyệt từng hồ sơ phải đầy đủ.

---

## SCREEN 1 — BATCH REVIEW QUEUE (State 1)

### Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│ AI-CRDS — Batch Review Queue                       CO: NVA  │
│ (i) Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 12 hồ sơ chờ xác nhận — AI đề xuất: APPROVE                 │
│                                                             │
│ ┌─ Filter: [Tất cả ▼] Sort: [Score cao→thấp ▼] Search: [___]│
│ │                                                           │
│ │ [_] # │ Họ tên      │ Score │ Conf │ Top Factor    │ Limit│
│ │ ────────────────────────────────────────────────────────── │
│ │ [x] 1 │ Nguyễn V.A  │ 0.88  │ 94%  │ CIC 740, DTI 22%│ 50M│
│ │ [x] 2 │ Trần T.B    │ 0.84  │ 91%  │ 5yr employ, CIC 710│ 40M│
│ │ [x] 3 │ Lê V.C      │ 0.82  │ 89%  │ CIC 720, exist 3yr │ 60M│
│ │ [_] 4 │ Phạm T.D    │ 0.79  │ 87%  │ 3yr employ, DTI 28%│ 50M│
│ │ [x] 5 │ Hoàng V.E   │ 0.78  │ 86%  │ CIC 690, exist 5yr │ 40M│
│ │ ... (7 hồ sơ khác)                                        │
│ │                                                           │
│ │ Click vào dòng để mở rộng chi tiết (bên dưới)             │
│ └───────────────────────────────────────────────────────────│
│                                                             │
│ ── Chi tiết mở rộng (dòng 4 — Phạm T.D) ─────────────────── │
│ │ Age: 29 │ Income: 22M │ Employer: FPT (FDI) │ 8M employ │
│ │ CIC: 680 │ Debt: 85M │ DTI: 28% │ DPD: 0 │ Inquiries: 1│
│ │ eKYC: PASS (0.96) │ Fraud: CLEAR (0.08)                 │
│ │ AI giải thích: CIC đạt, việc làm ổn định, DTI thấp       │
│ └───────────────────────────────────────────────────────── │
│                                                             │
│ Đã chọn: 4/12                                               │
│ [Xác nhận hồ sơ đã chọn (4)] [Override] [Chuyển sang Review]│
│                                                             │
│ Giới hạn: tối đa 10 hồ sơ mỗi lần xác nhận (chính sách      │
│ Risk Committee)                                             │
└─────────────────────────────────────────────────────────────┘
```

### Quyết định thiết kế

| Câu hỏi | Quyết định | Lý do |
|---------|-----------|-------|
| Số hồ sơ mỗi trang | 10-15 hồ sơ, có phân trang | Trên 15 hồ sơ, CO dễ mệt khi cuộn và có nguy cơ xác nhận máy móc. |
| Số hồ sơ tối đa mỗi lần xác nhận | Tối đa 10 hồ sơ | Theo chính sách của Risk Committee (guardrail G-O2); buộc CO xử lý theo từng nhóm vừa phải. |
| Sắp xếp và lọc | Sắp xếp theo score, confidence, hạn mức, ngày; lọc theo khoảng hạn mức và khoảng score | CO có thể ưu tiên xem các hồ sơ hạn mức cao nhất, là nhóm rủi ro lớn nhất. |
| Mở rộng dòng | Click vào dòng để mở rộng tại chỗ, không chuyển trang; hiển thị thông tin nhân khẩu, tóm tắt CIC và giải thích của AI | Tốc độ: CO không phải rời khỏi danh sách. |
| Override một hồ sơ | Bỏ chọn khỏi lô, nhấn "Override" để mở cửa sổ override (Screen 3) | Ít thao tác nhất. Override cần dễ thực hiện để không làm CO ngại khi cần dùng. |
| Chọn tất cả | Không có nút "chọn tất cả" | Ngăn việc xác nhận máy móc; CO phải đánh dấu từng dòng, bảo đảm có ít nhất một thao tác cho mỗi hồ sơ. |
| Vị trí nhãn AI | Cố định ở đầu màn hình, không đặt theo từng dòng | Luật AI 134/2025 yêu cầu hiển thị rõ; ở đầu màn hình thì luôn nhìn thấy mà không cần cuộn. |
| Theo dõi thời gian | Bộ đếm ẩn `co_review_time_seconds`, bắt đầu khi màn hình tải và dừng khi nhấn xác nhận; theo từng hồ sơ là thời gian giữa lúc mở rộng và lúc thu gọn hoặc chuyển hồ sơ | Phục vụ chỉ số thời gian duyệt trung bình (L3-W6). CO không thấy bộ đếm để tránh áp lực dẫn tới quyết định kém hơn. |

---

## SCREEN 2 — INDIVIDUAL REVIEW (State 2)

### Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│ AI-CRDS — Standard Review                             CO: NVA  │
│ (i) Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo       │
│ Hồ sơ: APP-2026-04-001 │ Phạm Thị D │ Nộp: 09/04/2026         │
│ SLA: ██████░░░░ còn 4h/8h                                      │
├──────────────────────────┬──────────────────────────────────────┤
│                          │                                      │
│ ┌── AI ASSESSMENT ─────┐ │ ┌── APPLICANT PROFILE ────────────┐ │
│ │                      │ │ │                                  │ │
│ │ Risk Score: 0.52     │ │ │ Tuổi: 32    Giới tính: Nữ        │ │
│ │ ████████░░ MEDIUM    │ │ │ Thu nhập: 18M (khai báo)         │ │
│ │                      │ │ │ Thu nhập đã xác minh: 15M (payroll)│ │
│ │ Confidence: 72%      │ │ │ Employer: Công ty ABC (SOE)     │ │
│ │ ████████░░           │ │ │ Thời gian làm việc: 8 tháng      │ │
│ │                      │ │ │ Địa chỉ: Quận 1, TP.HCM         │ │
│ │ Đề xuất:             │ │ │                                  │ │
│ │ CẦN REVIEW           │ │ │ Khách hàng hiện hữu: 2 năm      │ │
│ │                      │ │ │ Sản phẩm: Savings, Debit card    │ │
│ │ Fraud: CLEAR (0.12)  │ │ │ Số dư bình quân 3 tháng: 25M     │ │
│ ├──────────────────────┤ │ └──────────────────────────────────┘ │
│ │                      │ │                                      │
│ │ 3 YẾU TỐ RỦI RO      │ │ ┌── CIC REPORT ──────────────────┐ │
│ │ 1. DTI 42% (sát ngưỡng)│ │ │ CIC Score: 650                  │ │
│ │ 2. Làm việc 8 tháng  │ │ │ Dư nợ: 120M                     │ │
│ │ 3. 2 truy vấn/6 tháng│ │ │ Khoản vay đang hoạt động: 3     │ │
│ │                      │ │ │ DPD tối đa 12 tháng: 0          │ │
│ │ 3 YẾU TỐ TÍCH CỰC    │ │ │ DPD tối đa từ trước đến nay: 0  │ │
│ │ 1. CIC 650 (đạt)     │ │ │ Truy vấn 6 tháng: 2             │ │
│ │ 2. Không có DPD      │ │ │ Nhóm nợ: 1 (đủ tiêu chuẩn)      │ │
│ │ 3. Khách hiện hữu 2 năm│ │ │ Lịch sử tín dụng: 48 tháng      │ │
│ │                      │ │ │ [Xem đầy đủ báo cáo CIC]        │ │
│ └──────────────────────┘ │ └──────────────────────────────────┘ │
│                          │                                      │
│ ┌── SIMILAR CASES ─────┐ │ ┌── eKYC DETAILS ────────────────┐ │
│ │ Hồ sơ có đặc điểm    │ │ │ Danh tính: PASS                 │ │
│ │ tương tự (6 tháng):  │ │ │ Khớp khuôn mặt: 0.94            │ │
│ │ 23 hồ sơ → 87% tốt   │ │ │ Liveness: PASS                  │ │
│ │ 3 hồ sơ → vỡ nợ      │ │ │ Giấy tờ: xác thực               │ │
│ │ [Xem chi tiết]       │ │ │ CCCD: đã xác minh               │ │
│ └──────────────────────┘ │ └──────────────────────────────────┘ │
│                          │                                      │
├──────────────────────────┴──────────────────────────────────────┤
│                                                                  │
│ Ghi chú CO: [                                                  ] │
│             [  Vùng nhập tự do cho nhận định của CO            ] │
│                                                                  │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│ │ APPROVE     │ │ REJECT      │ │ ESCALATE    │ │ NEED       │ │
│ │ Hạn mức:    │ │             │ │ lên Senior  │ │ MORE INFO  │ │
│ │ [50M ▼]     │ │             │ │             │ │            │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Quyết định thiết kế

| Câu hỏi | Quyết định | Lý do |
|---------|-----------|-------|
| Bố cục | 2 cột: bảng AI (trái) và dữ liệu khách hàng (phải) | CO đối chiếu đánh giá của AI với dữ liệu gốc cạnh nhau. |
| Hiển thị điểm AI | Con số, thanh tiến độ, nhãn (LOW/MEDIUM/HIGH) và màu | CO cần đọc nhanh bằng mắt. Màu: xanh (rủi ro thấp), vàng (trung bình), đỏ (cao). |
| Hiển thị giải thích | 3 yếu tố rủi ro và 3 yếu tố tích cực, luôn hiển thị | CO có cái nhìn cân bằng, không chỉ lý do từ chối mà cả lý do có thể duyệt; hạn chế thiên kiến xác nhận. |
| Hồ sơ tương tự | Hiển thị số hồ sơ tương tự và tỷ lệ hiệu quả tốt | CO xây dựng niềm tin được hiệu chỉnh theo thời gian; "87% hồ sơ tương tự có kết quả tốt" giúp tăng độ tin cậy. Tính năng dựa trên dữ liệu lịch sử của Bank X nên triển khai theo mức sẵn có của dữ liệu. |
| Báo cáo CIC | Tóm tắt hiển thị sẵn, có liên kết xem đầy đủ | Phần lớn hồ sơ chỉ cần phần tóm tắt; báo cáo đầy đủ cách một lần nhấn. |
| Thu nhập đã xác minh | Dấu kiểm xanh kèm nhãn "(payroll)" khi đã xác minh | Phân biệt thu nhập đã xác minh với thu nhập khai báo. |
| Thanh SLA | Ở đầu màn hình, thể hiện thời gian còn lại bằng thanh tiến độ | CO nắm được áp lực thời gian mà không có đồng hồ đếm ngược gây căng thẳng. |
| Ghi chú CO | Nhập tự do, lưu cùng audit trail; bắt buộc khi từ chối (phục vụ thông báo adverse action), không bắt buộc khi duyệt | CO ghi lại lập luận; không bắt buộc khi duyệt để giữ tốc độ. |
| Nút hành động | 4 nút luôn hiển thị ở cuối màn hình, kích thước lớn | Approve có danh sách hạn mức. Reject kích hoạt quy trình adverse action. Escalate và Need More Info luôn khả dụng. |
| Hạn mức khi duyệt | Danh sách hạn mức với giá trị gợi ý do AI tính từ thu nhập và DTI, cho phép CO nhập tay | CO chấp nhận gợi ý của AI hoặc điều chỉnh. |

---

## SCREEN 3 — OVERRIDE FLOW

### Wireframe (cửa sổ hiện ra khi CO chọn hành động trái với đề xuất của AI)

```
┌─────────────────────────────────────────────────────┐
│ Override: REJECT                                    │
│ AI đề xuất: APPROVE (score 0.82, confidence 91%)    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Nhóm lý do (bắt buộc): [danh sách ▼]                │
│ ┌─────────────────────────────────────────────┐     │
│ │ ( ) Relationship knowledge — CO biết thêm   │     │
│ │     thông tin AI không có                   │     │
│ │ ( ) Income verification — thu nhập thực tế  │     │
│ │     khác với khai báo                       │     │
│ │ ( ) Employer verification — nơi làm việc có │     │
│ │     vấn đề                                  │     │
│ │ ( ) Temporary situation — DPD do tình huống │     │
│ │     tạm thời                                │     │
│ │ (o) AI error suspected — kết quả AI có vẻ sai│    │
│ │ ( ) Policy concern — hồ sơ nằm ngoài chính sách│   │
│ │ ( ) Other                                   │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ Chi tiết (bắt buộc, tối thiểu 20 ký tự):            │
│ ┌─────────────────────────────────────────────┐     │
│ │ Employer mới thành lập 3 tháng, chưa có     │     │
│ │ doanh thu. Rủi ro cao dù CIC score đạt.     │     │
│ │                                    42/20    │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ Override này được ghi vào audit trail và được       │
│ Supervisor xem xét.                                 │
│                                                     │
│ Cần Supervisor phê duyệt?                           │
│ (o) Không — thuộc thẩm quyền của tôi                │
│ ( ) Có — thông báo Supervisor (tự động nếu          │
│     hạn mức trên 50M)                               │
│                                                     │
│        [Hủy]        [Gửi Override]                  │
└─────────────────────────────────────────────────────┘
```

### Quy tắc kích hoạt cửa sổ override

| Hành động của CO | Đề xuất của AI | Hiện cửa sổ override? | Thông báo Supervisor? |
|-----------------|---------------|----------------------|----------------------|
| Approve | APPROVE (S1/S2) | Không (đồng thuận) | Không |
| Approve | REVIEW (S2) | Không (CO đã xem xét và đồng ý duyệt) | Không |
| Approve | REJECT | Có | Có (tự động) |
| Reject | REJECT | Không (đồng thuận) | Không |
| Reject | APPROVE (S1) | Có | Có (thông báo) |
| Reject | REVIEW (S2) | Không (CO đã xem xét, từ chối là kết quả bình thường) | Không |
| Escalate | Bất kỳ | Không (lý do chuyển cấp được nhập trong quy trình escalate) | Tự động (chuyển lên Senior) |

---

## 4. CÁC THÀNH PHẦN GIAO DIỆN BỔ SUNG

### 4.1 Chỉ báo độ tin cậy của AI

```
Kiểu hiển thị:

HIGH (>85%):     ██████████ 92%  [xanh]  "AI có độ tin cậy cao"
MEDIUM (60-85%): ████████░░ 72%  [vàng]  "AI có độ tin cậy trung bình"
LOW (<60%):      ████░░░░░░ 45%  [đỏ]    "AI chưa chắc chắn — nên chuyển Senior review"
```

### 4.2 Banner cảnh báo gian lận (State 3)

```
┌─────────────────────────────────────────────────────┐
│ PHÁT HIỆN TÍN HIỆU GIAN LẬN — Cần xử lý ưu tiên     │
│                                                     │
│ Fraud Score: 0.65 (ELEVATED)                        │
│ Nguyên nhân kích hoạt:                              │
│ ├── Điểm khớp khuôn mặt: 0.58 (dưới ngưỡng)         │
│ ├── Tần suất nộp hồ sơ: 3 hồ sơ cùng thiết bị/24h   │
│ └── Employer không có trong đăng ký kinh doanh      │
│                                                     │
│ Danh mục EDD: [Bắt đầu thẩm định tăng cường]        │
└─────────────────────────────────────────────────────┘
```

### 4.3 State 5 — Màn hình yêu cầu bổ sung thông tin

```
┌─────────────────────────────────────────────────────┐
│ Yêu cầu bổ sung thông tin                           │
│                                                     │
│ Hồ sơ cần bổ sung:                                  │
│ [x] Sao kê ngân hàng (3 tháng)                      │
│ [x] Hợp đồng lao động                               │
│ [_] Tờ khai thuế                                    │
│ [_] Hóa đơn tiện ích (xác minh địa chỉ)             │
│ [_] Khác: [________________]                        │
│                                                     │
│ Nội dung gửi khách hàng:                            │
│ ┌─────────────────────────────────────────────┐     │
│ │ [Tự động tạo từ các mục đã chọn]            │     │
│ │ "Để hoàn tất xét duyệt, vui lòng bổ sung:   │     │
│ │  - Sao kê ngân hàng 3 tháng gần nhất        │     │
│ │  - Hợp đồng lao động"                       │     │
│ │                              [Sửa nội dung] │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ Hạn bổ sung: 14 ngày (23/04/2026)                   │
│                                                     │
│ Gửi qua: [x] App  [x] SMS  [x] Email                │
│                                                     │
│        [Hủy]        [Gửi yêu cầu]                   │
└─────────────────────────────────────────────────────┘
```

---

## 5. QUY ĐỊNH HỆ THỐNG THIẾT KẾ

| Thành phần | Quy định |
|-----------|---------|
| Màu sắc | Rủi ro: xanh (#22C55E), vàng (#EAB308), đỏ (#EF4444); màu thương hiệu của Bank X cho khung giao diện |
| Kiểu chữ | Font hỗ trợ tiếng Việt (Inter, Noto Sans); số điểm dùng font monospace |
| Nhãn AI | Thanh cố định ở đầu màn hình: "Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo", nền xanh nhạt, không thể đóng |
| Khả năng tiếp cận | Phù hợp người mù màu (thêm biểu tượng bên cạnh màu); hiển thị đúng dấu tiếng Việt; cỡ chữ nội dung từ 14px |
| Responsive | Ưu tiên desktop vì CO làm việc trên máy tính; hỗ trợ tablet ở mức bổ sung; mobile chỉ xem dashboard |

---

## 6. LƯU Ý THIẾT KẾ

1. Wireframe ở mức low-fidelity; bản thiết kế chi tiết có thể điều chỉnh theo kết quả phỏng vấn trong w09-01-user-interview-notes.
2. Việc không có nút "chọn tất cả" trong duyệt hàng loạt là biện pháp chủ động chống xác nhận máy móc.
3. Bảng hồ sơ tương tự (Screen 2) cần dữ liệu lịch sử và tìm kiếm theo mức độ tương đồng; được triển khai ở mức bổ sung cho MVP.
4. Tài liệu liên quan: w05-01-decision-architecture (định tuyến trạng thái), w09-03-override-governance (quy tắc override), w05-04-adverse-action-flow (quy trình từ chối), w09-05-trust-calibration-guide (thiết kế niềm tin).
