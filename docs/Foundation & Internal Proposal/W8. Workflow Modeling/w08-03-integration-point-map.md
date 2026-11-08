# Integration Point Map — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Mô tả từng điểm tích hợp mà AI-CRDS cần với các hệ thống của Bank X. Với mỗi điểm tích hợp, tài liệu nêu mục đích, phương thức, yêu cầu, đơn vị phụ trách, rủi ro và lộ trình triển khai.

Phương thức tích hợp được chọn theo thực tiễn phổ biến tại các ngân hàng thương mại Việt Nam; thông số kỹ thuật, chi phí và khối lượng là giả định lập kế hoạch, sẽ được điều chỉnh theo hiện trạng hạ tầng thực của Bank X.

---

## 1. TỔNG QUAN TÍCH HỢP

```
                    ┌──────────────────────┐
                    │      AI-CRDS         │
                    │   Application Core   │
                    └──────────┬───────────┘
                               │
        ┌────────┬─────────┬───┼───┬──────────┬──────────┐
        │        │         │   │   │          │          │
        ▼        ▼         ▼   │   ▼          ▼          ▼
   ┌────────┐┌────────┐┌──────┴─┐┌────────┐┌────────┐┌────────┐
   │  INT-1 ││  INT-2 ││ INT-3  ││ INT-4  ││ INT-5  ││ INT-6  │
   │  CBS   ││  CIC   ││ eKYC   ││ SIMO   ││ Audit  ││ Notify │
   │        ││ Bureau ││Provider││        ││ Trail  ││ System │
   └────────┘└────────┘└────────┘└────────┘└────────┘└────────┘
    Hồ sơ      Lịch sử   Xác thực   Blacklist  Nhật ký    Thông báo
    khách hàng tín dụng  danh tính  gian lận   quyết định khách hàng
    + sản phẩm + điểm    + sinh     liên ngân  bất biến
                         trắc       hàng
```

---

## 2. CHI TIẾT TỪNG ĐIỂM TÍCH HỢP

### INT-1: Core Banking System (CBS)

| Thuộc tính | Mô tả |
|-----------|-------|
| Mục đích | Hồ sơ khách hàng, sản phẩm hiện hữu, lịch sử giao dịch, thông tin quan hệ, số dư tài khoản |
| Dữ liệu cần | Nhân khẩu học (họ tên, ngày sinh, CCCD, địa chỉ, điện thoại), sản phẩm hiện hữu, ngày mở tài khoản, lịch sử giao dịch (khách hiện hữu), lương chuyển vào, xếp hạng rủi ro nội bộ. Danh sách đầy đủ tại `w03-03-feature-availability-matrix.md` (Nhóm 1, 2, 4). |
| Phương thức | REST API qua ESB/API Gateway (ưu tiên). Phương án thay thế: truy vấn trực tiếp DB (ảnh hưởng hiệu năng CBS, chỉ dùng khi bắt buộc), export batch sang DWH/data lake (dữ liệu có độ trễ), hoặc kết hợp API cho trường thời gian thực và DWH cho dữ liệu lịch sử. |
| Yêu cầu độ trễ | ≤ 5 giây cho tra cứu hồ sơ; ≤ 30 giây cho tổng hợp lịch sử giao dịch |
| Định dạng dữ liệu | JSON (ưu tiên), mã hóa UTF-8 cho tiếng Việt |
| Xác thực | API key, OAuth hoặc chứng thư số theo chuẩn bảo mật của Bank X |
| Hướng dữ liệu | Đọc (chấm điểm) và ghi (kết quả quyết định, hạn mức, kích hoạt phát hành thẻ) |
| Khối lượng | ~3.000 lượt đọc mỗi tháng (chấm điểm) và ~1.800 lượt ghi mỗi tháng (hồ sơ duyệt) |
| Vai trò với MVP | MVP sử dụng dữ liệu tổng hợp nên không cần CBS. Môi trường production bắt buộc có CBS để chấm điểm. |
| Đơn vị phụ trách | Đội IT Bank X (quản trị CBS) |
| Rủi ro | (1) Nếu CBS chưa có API, cần xây adapter. (2) Truy vấn trực tiếp DB ảnh hưởng hiệu năng CBS. (3) Định dạng dữ liệu không đồng nhất giữa các phiên bản CBS. (4) Cửa sổ bảo trì CBS làm AI-CRDS tạm ngừng. |
| Lộ trình | Chốt phương thức ở giai đoạn thiết kế; xây dựng tích hợp ở giai đoạn phát triển; kiểm thử trước khi chạy shadow. |

### INT-2: CIC Bureau

| Thuộc tính | Mô tả |
|-----------|-------|
| Mục đích | Lịch sử tín dụng, CIC score, dư nợ, lịch sử DPD, số lần truy vấn, phân nhóm nợ |
| Dữ liệu cần | Theo `w03-03-feature-availability-matrix.md` Nhóm 3: CIC Score, tổng dư nợ, số khoản vay đang hoạt động, DPD tối đa 12 tháng, lịch sử nợ xấu, số lần truy vấn 6 tháng, độ dài lịch sử tín dụng |
| Phương thức | Host-to-Host API (H2H), theo CIC conference 02/2026 khoảng 95% ngân hàng đã kết nối H2H. Phương án dự phòng: truy vấn qua web portal do CO thực hiện. |
| Độ trễ | H2H API: 5-30 giây; portal: 1-5 phút |
| Cơ chế thử lại | 3 lần thử, mỗi lần timeout 30 giây. Nếu thất bại, định tuyến sang State 5 ("CIC không khả dụng"). Tự động thử lại mỗi 30 phút, tối đa 4 lần. Nếu CIC vẫn ngừng, CO truy vấn thủ công qua portal. |
| Chi phí | Phí theo lượt truy vấn, giả định 5-20 nghìn VND mỗi lượt; ngân sách tính theo ~3.000 lượt mỗi tháng. |
| Định dạng dữ liệu | Phản hồi dạng cấu trúc (XML/JSON) được parser của AI-CRDS chuyển thành các trường chuẩn |
| Vai trò với MVP | MVP dùng dữ liệu CIC tổng hợp. Môi trường production bắt buộc có CIC. |
| Đơn vị phụ trách | Đội IT Bank X và đầu mối quan hệ với CIC |
| Rủi ro | (1) CIC ngừng hoạt động làm nghẽn hàng đợi; cần cơ chế thử lại và dự phòng. (2) Độ trễ cập nhật dữ liệu CIC (1-2 tuần) khiến mô hình chấm điểm trên dữ liệu hơi cũ. (3) Chi phí truy vấn tăng theo khối lượng. (4) Thay đổi định dạng CIC đòi hỏi cập nhật parser. |
| Lộ trình | Chốt phương thức ở giai đoạn thiết kế; xây dựng tích hợp ở giai đoạn phát triển. |

### INT-3: eKYC Provider

| Thuộc tính | Mô tả |
|-----------|-------|
| Mục đích | Xác thực danh tính: kiểm tra CCCD, face match, liveness, tính xác thực của giấy tờ |
| Dữ liệu cần | Kết quả eKYC (đạt/không đạt), confidence score, face match score, kết quả liveness, tính xác thực giấy tờ, dữ liệu CCCD trích xuất (họ tên, ngày sinh, số CCCD) để đối chiếu |
| AI-CRDS lưu trữ | Chỉ lưu kết quả, không lưu dữ liệu sinh trắc học gốc (tối thiểu hóa dữ liệu theo BVDLCN). |
| Phương thức | REST API (chuẩn chung của các nhà cung cấp eKYC) |
| Nhà cung cấp | Nhà cung cấp eKYC Bank X đang sử dụng cho các sản phẩm khác (nhóm ứng viên phổ biến: VNPT, FPT.AI, VNG/Zalo AI, Napas eKYC hoặc giải pháp in-house) |
| Thông tư 45/2025 | Bắt buộc xác thực sinh trắc học khi phát hành thẻ tín dụng; nhà cung cấp phải tuân thủ. |
| Độ trễ | 5-15 giây (điển hình) |
| Cơ chế thử lại | 2 lần thử; nếu thất bại, định tuyến sang State 5 (khách thử lại sau 30 phút hoặc đến chi nhánh). |
| Vai trò với MVP | MVP giả lập phản hồi eKYC. Môi trường production bắt buộc có eKYC. |
| Đơn vị phụ trách | Đội IT Bank X và nhà cung cấp eKYC |
| Rủi ro | (1) Nhà cung cấp ngừng hoạt động làm hàng đợi State 5 tăng. (2) Đổi nhà cung cấp đòi hỏi đổi adapter API. (3) Độ chính xác khác nhau giữa các nhà cung cấp. |
| Lộ trình | Chốt nhà cung cấp và định dạng API ở giai đoạn thiết kế; xây dựng tích hợp ở giai đoạn phát triển. |

### INT-4: SIMO (Thông tư 45/2025 — blacklist gian lận)

| Thuộc tính | Mô tả |
|-----------|-------|
| Mục đích | Kiểm tra người nộp hồ sơ với blacklist gian lận liên ngân hàng (SIMO) và báo cáo các trường hợp gian lận đã xác nhận |
| Dữ liệu cần | Đọc: kết quả kiểm tra blacklist theo CCCD/số điện thoại (trùng khớp / không). Ghi: báo cáo gian lận cho các trường hợp đã xác nhận. |
| Phương thức | Truy vấn API theo thời gian thực cho từng hồ sơ (ưu tiên). Phương án thay thế: tải file blacklist hằng ngày để kiểm tra nội bộ, hoặc kết nối qua đầu mối trung gian NAPAS/SBV. |
| Thông tư 45/2025 | Bắt buộc tổ chức tín dụng tham gia hệ thống báo cáo gian lận liên ngân hàng. |
| Độ trễ | API: < 5 giây; batch: T+1 |
| Vai trò với MVP | MVP vận hành chỉ với blacklist nội bộ; SIMO được bổ sung ở giai đoạn sau MVP. |
| Đơn vị phụ trách | Đội Tuân thủ và đội IT Bank X |
| Rủi ro | (1) Nếu SIMO chưa được tích hợp tại Bank X, cần xây mới. (2) Rủi ro pháp lý nếu không tích hợp theo yêu cầu TT 45. (3) Định dạng và giao thức SIMO có thể thay đổi. |
| Lộ trình | Tích hợp ở giai đoạn sau MVP, trước khi vận hành production. |

### INT-5: Audit Trail Database

| Thuộc tính | Mô tả |
|-----------|-------|
| Mục đích | Nhật ký bất biến của mọi quyết định, phục vụ thanh tra SBV, kiểm toán nội bộ và cải tiến mô hình |
| Trường dữ liệu | ≥ 24 trường mỗi quyết định (`w02-04-sbv-requirements.md` Mục 3): application_id, customer_id (giả danh khi báo cáo), decision_id, timestamp, model_version, threshold_version, AI score, fraud score, confidence, recommendation, explanation, human_decision, CO_id, override_flag, override_reason, state, SLA compliance, adverse_action_id, channels, v.v. |
| Phương thức | API ghi nội bộ vào cơ sở dữ liệu audit riêng (không dùng CBS), thiết kế append-only và bất biến |
| Tính bất biến | Yêu cầu bắt buộc: bản ghi đã ghi không thể sửa hoặc xóa. Thực hiện bằng thiết kế cơ sở dữ liệu append-only hoặc lưu trữ write-once. |
| Lưu trữ | 5-10 năm theo trạng thái cuối (`w05-01-decision-architecture.md`, mục Terminal States). Phân tầng: dữ liệu gốc, giả danh, ẩn danh. |
| Truy vấn | Thanh tra SBV: truy xuất toàn bộ vết quyết định trong 15 phút. Tái hiện: dựng lại quyết định với cùng đầu vào, mô hình và ngưỡng cho cùng đầu ra. |
| Khối lượng | ~3.000 lượt ghi mỗi tháng; dung lượng ~5-10 KB/bản ghi, tương đương ~180-360 MB mỗi năm. |
| Hiện trạng | Hạ tầng mới do đội AI-CRDS xây dựng. |
| Vai trò với MVP | Bắt buộc: audit trail là yêu cầu cốt lõi (SBV, Luật AI 134/2025). MVP dùng cơ sở dữ liệu đơn giản (PostgreSQL); production dùng kho lưu trữ bất biến được gia cố. |
| Đơn vị phụ trách | Đội phát triển AI-CRDS và đội IT Bank X |
| Rủi ro | (1) Ghi DB thất bại sẽ dừng xử lý quyết định (guardrail G-C1, không dung sai). (2) Dung lượng tăng trong 10 năm cần chiến lược lưu trữ lâu dài. (3) Giả danh hóa phải triển khai đúng: đảo ngược được với người có thẩm quyền, không đảo ngược được với bên ngoài. |
| Lộ trình | Thiết kế ở giai đoạn thiết kế; xây dựng bản MVP; gia cố cho production ở giai đoạn chuẩn bị vận hành. |

### INT-6: Notification System

| Thuộc tính | Mô tả |
|-----------|-------|
| Mục đích | Thông báo cho khách: xác nhận duyệt, từ chối (adverse action), yêu cầu bổ sung giấy tờ, phát hành thẻ |
| Kênh | (a) Push notification trên app. (b) SMS (kênh dự phòng, mọi khách đều có điện thoại). (c) Email (độ phủ khoảng 40-60%). (d) Thư tại chi nhánh (hồ sơ nộp tại chi nhánh). |
| Phương thức | Tái sử dụng hệ thống thông báo hiện có của Bank X (SMS gateway, dịch vụ push). Nếu hệ thống hiện có không hỗ trợ thông báo adverse action có cấu trúc, xây dịch vụ thông báo riêng. |
| Điều kiện kích hoạt | Có quyết định (duyệt/từ chối), yêu cầu giấy tờ (State 5), phát hành thẻ (sau duyệt), xác nhận tiếp nhận khiếu nại. |
| Nội dung | Mẫu thông báo từ chối (`w05-04-adverse-action-flow.md`): 3 lý do chính, nhãn AI, quyền của khách và thông tin liên hệ. |
| Thông tư 45/2025 | SMS Unicode tiếng Việt chứa khoảng 70 ký tự mỗi tin (không phải 160); mẫu phải vừa khung này hoặc dẫn liên kết tới thông báo đầy đủ. |
| Vai trò với MVP | MVP hiển thị mẫu thông báo trên màn hình. Môi trường production bắt buộc có hệ thống thông báo. |
| Đơn vị phụ trách | Đội IT Bank X (hạ tầng thông báo) và đội AI-CRDS (mẫu nội dung) |
| Rủi ro | (1) SMS gateway giới hạn tốc độ vào cao điểm. (2) Push notification cần cập nhật app của ngân hàng. (3) Vấn đề deliverability của email. |
| Lộ trình | Chốt khả năng hệ thống ở giai đoạn thiết kế; tích hợp ở giai đoạn phát triển sau. |

---

## 3. TỔNG HỢP TRẠNG THÁI TÍCH HỢP

| Mã | Tích hợp | Cần cho MVP | Cần cho production | Rủi ro lớn nhất |
|----|---------|------------|--------------------|-----------------|
| INT-1 | CBS | Không (dữ liệu tổng hợp) | Có | Chưa có API sẵn |
| INT-2 | CIC | Không (dữ liệu tổng hợp) | Có | Ngừng hoạt động và chi phí |
| INT-3 | eKYC | Một phần (giả lập) | Có | Phụ thuộc nhà cung cấp |
| INT-4 | SIMO | Không | Có (theo TT 45) | Có thể chưa được tích hợp |
| INT-5 | Audit Trail | Có (DB đơn giản) | Có | Thiết kế tính bất biến |
| INT-6 | Notification | Không | Có | Hỗ trợ mẫu thông báo |

### Thứ tự triển khai cho production

```
INT-1 (CBS)      ─── Chốt phương thức API ở giai đoạn thiết kế ─── Xây dựng ở giai đoạn phát triển
INT-2 (CIC)      ─── Chốt trạng thái H2H ở giai đoạn thiết kế ──── Xây dựng ở giai đoạn phát triển
INT-5 (Audit)    ─── Thiết kế ở giai đoạn thiết kế ─────────────── Xây dựng bản MVP
INT-3 (eKYC)     ─── Chốt nhà cung cấp ở giai đoạn thiết kế ────── Xây dựng ở giai đoạn phát triển
INT-4 (SIMO)     ─── Chốt trạng thái ở giai đoạn thiết kế ──────── Xây dựng ở giai đoạn sau MVP
INT-6 (Notify)   ─── Chốt khả năng hệ thống ở giai đoạn thiết kế ─ Xây dựng ở giai đoạn sau MVP
```

---

## 4. YÊU CẦU HẠ TẦNG VÀ VẬN HÀNH CHUNG

| Hạng mục | Yêu cầu | Lý do |
|---------|---------|------|
| Kiến trúc CBS | Xác định loại CBS và khả năng cung cấp API | Quyết định toàn bộ kiến trúc tích hợp |
| CIC H2H | Kết nối H2H hoạt động cho truy vấn thời gian thực | Điều kiện của chấm điểm thời gian thực |
| eKYC | Tài liệu API của nhà cung cấp và quyền truy cập cho AI-CRDS | Cần cho lớp phát hiện gian lận |
| SIMO | Kết nối theo yêu cầu TT 45/2025 | Tuân thủ quy định |
| Hạ tầng thông báo | Tái sử dụng khi hỗ trợ mẫu có cấu trúc, nếu không thì xây mới | Tối ưu chi phí tích hợp |
| Mạng và firewall | Cấu hình đáp ứng độ trễ API và yêu cầu VPN | Bảo đảm hiệu năng và an toàn |
| Môi trường phát triển | Sandbox/staging dành cho AI-CRDS | Phát triển và kiểm thử độc lập với production |
| Cửa sổ bảo trì và SLA | Lịch bảo trì và cam kết SLA của các hệ thống tích hợp | Lập kế hoạch tính sẵn sàng của AI-CRDS |

---

## 5. NHẬN ĐỊNH CHUNG

1. INT-1 (CBS) là tích hợp có rủi ro cao nhất. Nếu CBS chưa có API, cần xây adapter hoặc dùng DWH, kéo dài tiến độ khoảng 4-8 tuần.
2. INT-5 (Audit Trail) là tích hợp duy nhất đội AI-CRDS xây dựng từ đầu; các tích hợp còn lại kết nối với hệ thống sẵn có của Bank X.
3. MVP chỉ cần INT-5 hoạt động thật; các tích hợp khác dùng dữ liệu tổng hợp. Production cần đủ cả 6 tích hợp.

---

## 6. THAM CHIẾU

- `w03-01-data-landscape-bank-x.md`: nguồn dữ liệu.
- `w03-03-feature-availability-matrix.md`: trường dữ liệu theo từng tích hợp.
- `w02-04-sbv-requirements.md`: đặc tả audit trail.
- `w08-02-workflow-to-be.md`: bối cảnh tích hợp trong luồng vận hành.
