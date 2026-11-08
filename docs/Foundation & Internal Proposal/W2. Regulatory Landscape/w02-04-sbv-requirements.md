# SBV Requirements — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) · **Khách hàng:** Bank X

---

## Mục đích

Tài liệu tổng hợp bốn nhóm yêu cầu của Ngân hàng Nhà nước (NHNN/SBV) ảnh hưởng đến thiết kế AI-CRDS, cùng khung pháp lý về AI của Luật Trí tuệ nhân tạo 134/2025/QH15. Đây là các yêu cầu bắt buộc: không tuân thủ thì không thể triển khai.

Từ 01/03/2026, Luật AI 134/2025 có hiệu lực. Nhiều yêu cầu trước đây là thông lệ của NHNN (giám sát của con người, giám sát thiên lệch, trách nhiệm giải trình) nay là yêu cầu của luật (xem mục 5).

Việt Nam chưa có văn bản riêng của NHNN quy định về AI trong tài chính; NHNN sẽ ban hành thông tư riêng theo yêu cầu của Luật AI. Các yêu cầu dưới đây được tổng hợp từ Luật AI 134/2025, Luật TCTD 2024, TT 13/2018, NĐ 94/2025, Luật BVDLCN 2025 và NĐ 356/2025. Chi tiết từng văn bản xem w02-01-regulatory-mapping.

---

## 1. Human-in-the-Loop: AI Không Phải Bên Ra Quyết Định Cuối Cùng

### 1.1 Cơ sở pháp lý

| Văn bản | Yêu cầu liên quan |
|---------|-------------------|
| Luật TCTD 32/2024/QH15 | Điều 102, 103: TCTD có quy trình thẩm định, đánh giá rủi ro trước khi cấp tín dụng. Quyết định cấp tín dụng là của TCTD (con người đại diện tổ chức), không phải của hệ thống tự động. |
| TT 13/2018/TT-NHNN | Mô hình 3 tuyến phòng thủ: tuyến 1 vận hành (gồm quyết định tín dụng của cán bộ tín dụng), tuyến 2 giám sát, tuyến 3 kiểm toán. Hệ thống AI thuộc tuyến 1 và không thay thế con người. |
| NĐ 356/2025 Điều 9 | Chủ thể dữ liệu có quyền phản đối xử lý tự động và yêu cầu con người xem xét với quyết định ảnh hưởng đáng kể. Quyết định tín dụng là quyết định ảnh hưởng đáng kể. |
| Luật AI 134/2025 Điều 4 | AI phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người. |
| Thực tiễn NHNN | NHNN chưa ban hành văn bản cho phép AI thay thế con người trong quyết định tín dụng. Human-in-the-loop là yêu cầu mặc định. |

### 1.2 Nguyên tắc thiết kế

> AI-CRDS là hệ thống hỗ trợ quyết định. AI đưa ra khuyến nghị (phê duyệt, từ chối, leo thang) kèm giải thích. Cán bộ tín dụng là người ký quyết định cuối cùng. AI không tự phê duyệt hoặc tự từ chối khi không có sự giám sát của con người.

Nguyên tắc này được áp dụng trong mọi tài liệu và thiết kế của dự án.

### 1.3 Luồng quyết định

```
Hồ sơ vào
    │
    ▼
AI-CRDS scoring + fraud detection
    │
    ├─── Độ tin cậy cao, khuyến nghị PHÊ DUYỆT (score > threshold_high)
    │    │
    │    ▼
    │    Chuyển vào hàng đợi của Cán bộ tín dụng
    │    với nhãn "AI khuyến nghị: PHÊ DUYỆT"
    │    │
    │    ▼
    │    Cán bộ tín dụng xem xét (có thể xem xét theo lô)
    │    ├── Đồng ý → Phê duyệt (CBTD ký) → Audit log
    │    └── Không đồng ý → Override → Ghi lý do → Leo thang nếu cần
    │
    ├─── Độ tin cậy trung bình (threshold_low < score < threshold_high)
    │    │
    │    ▼
    │    Chuyển vào hàng đợi của Cán bộ tín dụng
    │    với nhãn "AI khuyến nghị: CẦN XEM XÉT"
    │    + 3 yếu tố rủi ro chính
    │    + Tham chiếu hồ sơ tương tự
    │    │
    │    ▼
    │    Cán bộ tín dụng xem xét đầy đủ
    │    ├── Phê duyệt (CBTD ký) → Audit log
    │    ├── Từ chối (CBTD ký) → Thông báo từ chối → Audit log
    │    └── Leo thang lên cấp cao hoặc Hội đồng
    │
    ├─── Độ tin cậy cao, khuyến nghị TỪ CHỐI (score < threshold_low)
    │    │
    │    ▼
    │    Chuyển vào hàng đợi của Cán bộ tín dụng
    │    với nhãn "AI khuyến nghị: TỪ CHỐI"
    │    + 3 lý do từ chối chính
    │    │
    │    ▼
    │    Cán bộ tín dụng xem xét
    │    ├── Đồng ý từ chối → Thông báo từ chối → Audit log
    │    └── Override → Phê duyệt (CBTD ký) → Ghi lý do → Giám sát viên rà soát
    │
    └─── Độ tin cậy thấp / Bất thường / Cần thêm thông tin
         │
         ▼
         Chuyển cho Cán bộ tín dụng cấp cao
         với nhãn "AI: KHÔNG THỂ XÁC ĐỊNH"
         + Giải thích lý do không chắc chắn
         │
         ▼
         Cấp cao xem xét / Hội đồng / Yêu cầu bổ sung hồ sơ
```

### 1.4 Quy tắc quản trị

| Quy tắc | Mô tả | Phụ trách |
|---------|-------|----------|
| R1 | Mọi quyết định tín dụng có chữ ký số của cán bộ tín dụng hoặc cấp trên. Khuyến nghị của AI không phải là quyết định. | Giám đốc Quản lý rủi ro |
| R2 | "Tự động phê duyệt" thực chất là "AI khuyến nghị phê duyệt và cán bộ tín dụng xác nhận theo lô". Cán bộ tín dụng vẫn ký, quy trình nhanh hơn. Số hồ sơ tối đa mỗi lô do Hội đồng rủi ro quyết định. | Hội đồng rủi ro |
| R3 | Override AI phải ghi lý do. Override phê duyệt khi AI khuyến nghị từ chối cần giám sát viên xác nhận. | Cán bộ tín dụng, giám sát viên |
| R4 | Độ tin cậy dưới threshold_low hoặc thiếu dữ liệu thì AI không đưa ra khuyến nghị và chuyển thẳng cho con người. AI không ép quyết định khi không đủ dữ liệu. | Product (thiết kế) |
| R5 | Khách hàng có quyền từ chối chấm điểm bằng AI, hồ sơ xử lý 100% thủ công theo NĐ 356 Điều 9. | Compliance |
| R6 | Ngưỡng (tự động phê duyệt, xem xét, tự động từ chối) do Hội đồng rủi ro phê duyệt, rà soát ít nhất mỗi quý hoặc khi mô hình thay đổi. | Hội đồng rủi ro |

### 1.5 Các điều bị cấm

| # | Điều cấm | Lý do |
|---|---------|-------|
| 1 | AI tự phê duyệt khi không có cán bộ tín dụng ký | Trái Luật TCTD: quyết định tín dụng thuộc về TCTD |
| 2 | AI tự từ chối khi không có cán bộ tín dụng xem xét | Trái NĐ 356: chủ thể có quyền yêu cầu con người xem xét |
| 3 | AI tự thay đổi ngưỡng khi không có Hội đồng rủi ro phê duyệt | Trái TT 13: quản lý rủi ro phải có giám sát cấp cao |
| 4 | Ép AI quyết định khi thiếu dữ liệu (không có trạng thái "cần thêm thông tin") | Thiết kế sai: AI phải có quyền từ chối đưa khuyến nghị |
| 5 | Gỡ bỏ tùy chọn override của cán bộ tín dụng | Trái nguyên tắc human-in-the-loop |

---

## 2. Thẩm Định Mô Hình Độc Lập Trước Khi Triển Khai

### 2.1 Cơ sở pháp lý

| Văn bản | Yêu cầu liên quan |
|---------|-------------------|
| TT 13/2018 | Mô hình 3 tuyến: tuyến 2 (Quản lý rủi ro, thẩm định mô hình) giám sát và thẩm định mô hình trước khi đưa vào sử dụng. Thông tư thay thế có thể bổ sung yêu cầu quản lý rủi ro mô hình (MRM). |
| TT 41/2016 (Basel II) | Trụ cột II (ICAAP) yêu cầu đánh giá nội bộ mức đủ vốn; mô hình tín dụng phải được thẩm định. |
| Thực tiễn NHNN | Khi thanh tra, kiểm tra, NHNN có thể yêu cầu xem tài liệu thẩm định mô hình. Thiếu tài liệu mô hình là một phát hiện kiểm tra. |
| NĐ 94/2025 (Sandbox) | Hồ sơ sandbox yêu cầu kế hoạch thử nghiệm và quản lý rủi ro, bao gồm kế hoạch thẩm định mô hình. |

### 2.2 Yêu cầu thẩm định mô hình

AI-CRDS cung cấp đủ tài liệu để bộ phận Quản lý rủi ro và Thẩm định mô hình của Bank X xem xét trước khi đưa vào vận hành.

#### A. Model Card

| Mục | Nội dung |
|-----|---------|
| Mục đích | Hỗ trợ quyết định cấp thẻ tín dụng cho khách hàng cá nhân hưởng lương: chấm điểm và phát hiện gian lận |
| Phạm vi sử dụng | Chỉ hỗ trợ quyết định. Đầu vào: dữ liệu hồ sơ, CIC, eKYC. Đầu ra: điểm rủi ro, cờ gian lận, giải thích, khuyến nghị |
| Dữ liệu huấn luyện | Nguồn, quy mô, khoảng thời gian, độ phủ phân khúc, thiên lệch đã biết; ghi rõ nếu là dữ liệu tổng hợp |
| Danh sách đặc trưng | Các đặc trưng và thứ hạng quan trọng; ghi rõ các đặc trưng không dùng (giới tính, dân tộc) |
| Kiến trúc | Loại mô hình (hồi quy logistic, gradient boosting, ensemble) và mức độ phức tạp |
| Chỉ số hiệu năng | AUC, Gini, KS, precision, recall theo phân khúc, trên dữ liệu kiểm thử và dữ liệu thẩm định |
| Hiệu chuẩn | Điểm so với tỷ lệ vỡ nợ thực tế; đường hiệu chuẩn |
| Giới hạn đã biết | Phân khúc hiệu năng kém, khoảng trống dữ liệu, điều kiện mô hình xử lý chưa tốt |
| Thiết lập ngưỡng | Ngưỡng tự động phê duyệt, xem xét, từ chối; đường tỷ lệ phê duyệt; tác động NPL theo ngưỡng |
| Đánh giá thiên lệch | Chỉ số công bằng theo thuộc tính nhạy cảm (giới tính, địa bàn); phân tích tác động không cân xứng |
| Lịch sử cập nhật | Nhật ký phiên bản, thay đổi theo phiên bản, kết quả thẩm định theo phiên bản |

#### B. Quy trình thẩm định

| Bước | Bên thực hiện | Nội dung | Thời điểm |
|------|--------------|---------|-----------|
| 1. Lập tài liệu mô hình | Nhà cung cấp AI-CRDS (Product và nhóm Data Science) | Chuẩn bị Model Card và toàn bộ nội dung trên | Trước thí điểm |
| 2. Thẩm định độc lập | Bộ phận Quản lý rủi ro/Thẩm định mô hình của Bank X | Xem xét Model Card, kiểm thử trên dữ liệu của Bank X, phản biện giả định, kiểm tra thiên lệch | Trước khi triển khai production |
| 3. Báo cáo thẩm định | Bộ phận Quản lý rủi ro/Thẩm định mô hình của Bank X | Kết luận: chấp thuận, chấp thuận có điều kiện, hoặc không chấp thuận. Điều kiện phải xử lý trước khi triển khai | Trước phê duyệt của Hội đồng rủi ro |
| 4. Phê duyệt của Hội đồng rủi ro | Hội đồng rủi ro Bank X | Ký duyệt cuối cùng dựa trên báo cáo thẩm định | Trước khi triển khai |
| 5. Giám sát liên tục | Phối hợp (nhà cung cấp và Quản lý rủi ro Bank X) | Giám sát hiệu năng, phát hiện lệch dữ liệu, thẩm định lại định kỳ (hằng năm hoặc khi cập nhật mô hình) | Sau khi triển khai |

#### C. Tài liệu Bank X nhận từ nhà cung cấp AI-CRDS

| # | Tài liệu | Mục đích | Bên chuẩn bị |
|---|---------|---------|-------------|
| 1 | Model Card đầy đủ | Thẩm định | Nhà cung cấp AI-CRDS |
| 2 | Từ điển đặc trưng | Hiểu mọi đặc trưng, nguồn và logic | Nhà cung cấp AI-CRDS |
| 3 | Mô tả dữ liệu huấn luyện | Đánh giá chất lượng và tính đại diện | Nhà cung cấp AI-CRDS |
| 4 | Báo cáo hiệu năng theo phân khúc | Đánh giá độ chính xác | Nhà cung cấp AI-CRDS |
| 5 | Báo cáo đánh giá thiên lệch | Đánh giá tính công bằng | Nhà cung cấp AI-CRDS |
| 6 | Phân tích độ nhạy của ngưỡng | Đánh giá tác động khi thay đổi ngưỡng | Nhà cung cấp AI-CRDS |
| 7 | Kế hoạch giám sát | Phát hiện lệch dữ liệu và ngưỡng cảnh báo | Nhà cung cấp AI-CRDS và Quản lý rủi ro Bank X |
| 8 | Kế hoạch ứng phó sự cố | Xử lý khi mô hình lỗi | Phối hợp |

---

## 3. Audit và Báo Cáo: Mọi Quyết Định Phải Truy Vết Được

### 3.1 Cơ sở pháp lý

| Văn bản | Yêu cầu liên quan |
|---------|-------------------|
| TT 13/2018 Điều 5 | Hệ thống KSNB bảo đảm thông tin tài chính và quản lý trung thực, hợp lý, đầy đủ và kịp thời. Mọi quyết định tín dụng truy vết được. |
| Luật TCTD 2024 | TCTD chịu thanh tra, giám sát của NHNN; cung cấp hồ sơ, tài liệu khi NHNN yêu cầu. |
| Luật BVDLCN 2025 và NĐ 356 | Audit trail cho xử lý DLCN; khả năng tái hiện quyết định tự động. |
| TT 45/2025 | Báo cáo gian lận qua hệ thống SIMO. |

### 3.2 Lược đồ audit trail (tối thiểu 20 trường)

Mọi quyết định tín dụng qua AI-CRDS ghi đầy đủ các trường sau:

| # | Trường | Mô tả | Ví dụ | Mục đích |
|---|-------|-------|-------|---------|
| 1 | `decision_id` | Mã duy nhất cho mỗi quyết định | `DEC-2026-0001` | Truy xuất |
| 2 | `application_id` | Mã hồ sơ | `APP-2026-0001` | Liên kết hồ sơ |
| 3 | `applicant_id_hash` | Mã băm CCCD (không lưu bản rõ) | `sha256:abc...` | Quyền riêng tư và truy xuất |
| 4 | `timestamp` | Thời điểm AI chấm điểm | `2026-03-25T10:30:00+07:00` | Dòng thời gian |
| 5 | `model_version` | Phiên bản mô hình đang chạy | `v1.2.3` | Tái hiện quyết định |
| 6 | `threshold_version` | Phiên bản ngưỡng đang áp dụng | `TH-2026-Q1` | Tái hiện quyết định |
| 7 | `input_features` | Snapshot đặc trưng đầu vào của mô hình | `{age: 30, income: 25M, cic_score: 680, ...}` | Tái hiện và giải thích |
| 8 | `cic_data_snapshot` | Dữ liệu CIC tại thời điểm truy vấn | `{cic_score: 680, existing_debt: 50M, ...}` | Tái hiện |
| 9 | `ekyc_result` | Kết quả eKYC (đạt/không đạt/độ tin cậy) | `{status: "pass", confidence: 0.98}` | Kiểm toán gian lận |
| 10 | `ai_risk_score` | Điểm rủi ro AI trả về | `0.72` | Kiểm toán |
| 11 | `ai_fraud_flag` | Cờ gian lận AI trả về | `{flag: false, fraud_score: 0.05}` | Kiểm toán |
| 12 | `ai_confidence` | Mức độ tin cậy | `0.89` | Kiểm toán |
| 13 | `ai_recommendation` | Khuyến nghị của AI | `APPROVE` / `REJECT` / `REVIEW` / `ESCALATE` | Kiểm toán |
| 14 | `ai_explanation` | Các lý do chính của khuyến nghị | `["CIC score > 650", "DTI < 40%", "Employment > 2y"]` | Giải thích và thông báo từ chối |
| 15 | `human_decision` | Quyết định của cán bộ tín dụng | `APPROVE` / `REJECT` | Quyết định cuối cùng |
| 16 | `human_user_id` | Mã người quyết định | `CO-001` | Trách nhiệm |
| 17 | `override_flag` | Cán bộ tín dụng có override AI không | `true` / `false` | Giám sát |
| 18 | `override_reason` | Lý do override (bắt buộc nếu override=true) | `"Khách VIP, quan hệ 5 năm"` | Kiểm toán |
| 19 | `decision_timestamp` | Thời điểm cán bộ tín dụng quyết định | `2026-03-25T11:15:00+07:00` | Theo dõi SLA |
| 20 | `adverse_action_sent` | Đã gửi thông báo từ chối chưa (nếu từ chối) | `true` / `false` kèm `timestamp` | Tuân thủ |
| 21 | `escalation_flag` | Có leo thang không | `true` / `false` | Quy trình |
| 22 | `escalation_to` | Leo thang cho ai | `SENIOR-001` / `COMMITTEE` | Quy trình |
| 23 | `tenant_id` | Mã đơn vị (kiến trúc đa tenant) | `BANK-X` | Cô lập dữ liệu |
| 24 | `data_consent_id` | Mã bản ghi đồng ý của khách | `CONSENT-2026-0001` | Tuân thủ PDPD |

### 3.3 Yêu cầu đối với audit

| Yêu cầu | Mô tả | Triển khai |
|---------|-------|-----------|
| Bất biến | Audit log không được sửa hoặc xóa sau khi ghi | Lưu trữ chỉ ghi thêm (append-only); chuỗi băm hoặc cơ sở dữ liệu ghi một lần |
| Tái hiện quyết định | Từ `decision_id` tái hiện chính xác quyết định: cùng đầu vào, cùng phiên bản mô hình, cùng ngưỡng cho cùng kết quả | Lưu snapshot `input_features`, phiên bản mô hình và ngưỡng; kiểm thử tái hiện hằng tháng |
| Xuất dữ liệu theo yêu cầu của NHNN | NHNN có thể yêu cầu xem bất kỳ quyết định nào, bất kỳ lúc nào | API xuất dữ liệu: lọc theo khoảng thời gian, khách hàng, loại quyết định; định dạng CSV hoặc báo cáo có cấu trúc; thời gian xuất dưới 15 phút |
| Thời hạn lưu | Thời gian giữ audit log | Theo hồ sơ tín dụng: 5 đến 10 năm (xem w02-03-pdpd-impact-bank-x mục 4.4) |
| Phát hiện can thiệp | Phát hiện audit log bị sửa | Chuỗi băm, checksum hoặc kiểm tra toàn vẹn theo cơ chế tương tự blockchain |
| Kiểm soát truy cập | Ai được xem audit log | Phân tầng: cán bộ tín dụng xem hồ sơ mình xử lý; Quản lý rủi ro và Kiểm toán nội bộ xem tất cả; NHNN xem tất cả khi yêu cầu |

### 3.4 Kịch bản thanh tra của NHNN

Đoàn thanh tra NHNN hỏi:

> "Cho tôi xem quyết định cấp thẻ tín dụng cho khách hàng CCCD xxx trong tháng 2/2026. Ai quyết định? Dựa trên dữ liệu gì? AI khuyến nghị gì? Nếu AI khuyến nghị khác quyết định của con người thì vì sao?"

AI-CRDS trả lời trong vòng 15 phút:

| Bước | Hành động | Thời gian |
|------|----------|----------|
| 1 | Tìm bản ghi quyết định theo mã băm khách hàng và khoảng thời gian | Dưới 1 phút |
| 2 | Xuất bản ghi audit đầy đủ (24 trường) | Dưới 1 phút |
| 3 | Trình bày khuyến nghị của AI, giải thích và quyết định của con người | Có sẵn trong bản ghi |
| 4 | Nếu có override, trình bày lý do override | Có sẵn trong bản ghi |
| 5 | Tái hiện: chạy lại đúng phiên bản mô hình, phiên bản ngưỡng và đầu vào, xác nhận cùng kết quả | Dưới 5 phút |
| 6 | Xuất báo cáo theo định dạng cho NHNN | Dưới 5 phút |

### 3.5 Nghĩa vụ báo cáo

| Báo cáo | Gửi cho | Tần suất | Nội dung | Kích hoạt |
|---------|--------|----------|---------|----------|
| Audit quyết định tín dụng | NHNN | Theo yêu cầu | Audit trail đầy đủ của từng quyết định | Yêu cầu của NHNN |
| Báo cáo gian lận SIMO | NHNN qua SIMO | Định kỳ (TT 45/2025) | Các trường hợp gian lận đã phát hiện và biện pháp xử lý | Theo lịch của TT 45 |
| Báo cáo hiệu năng mô hình | Hội đồng rủi ro Bank X | Hằng quý | AUC, tỷ lệ phê duyệt, NPL theo vintage, tỷ lệ override, chỉ số lệch dữ liệu | Theo lịch |
| Báo cáo sự cố | NHNN và Ban điều hành Bank X | Trong 24 giờ kể từ sự cố | Lỗi mô hình nghiêm trọng, vi phạm dữ liệu, lỗi hệ thống | Khi có sự cố |
| Cập nhật DPIA | A05 (Bộ Công an) | Khi thay đổi xử lý | DPIA cập nhật theo NĐ 356 | Khi thay đổi xử lý |

---

## 4. Sandbox: NĐ 94/2025

### 4.1 Tổng quan NĐ 94/2025

| Mục | Nội dung |
|-----|---------|
| Tên | NĐ 94/2025/NĐ-CP: cơ chế thử nghiệm có kiểm soát (Regulatory Sandbox) trong lĩnh vực ngân hàng |
| Hiệu lực | 01/07/2025 |
| 3 lĩnh vực | (1) Chấm điểm tín dụng (use case cốt lõi của AI-CRDS), (2) Open API, (3) Cho vay ngang hàng (P2P) |
| Thời gian thử nghiệm | Tối đa 2 năm, có thể gia hạn |
| Giám sát | NHNN |
| Sau sandbox | Kết quả là cơ sở hoàn thiện khung pháp lý; thử nghiệm thành công được ưu tiên trong cấp phép |

### 4.2 Hai lộ trình tuân thủ

AI-CRDS hỗ trợ hai lộ trình tùy việc Bank X có tham gia sandbox hay không.

#### Lộ trình A: Bank X tham gia sandbox (NĐ 94)

```
Bank X nộp hồ sơ sandbox cho NHNN
    │
    ├── Hồ sơ gồm: kế hoạch thử nghiệm, quản lý rủi ro, nhân sự, pháp lý
    │   Nhà cung cấp AI-CRDS hỗ trợ chuẩn bị tài liệu kỹ thuật
    │
    ▼
NHNN xem xét (có thể kiểm tra tại chỗ)
    │
    ▼
Cấp Giấy chứng nhận tham gia
    │
    ▼
Bắt đầu thử nghiệm trong 90 ngày
    │
    ├── Phạm vi giới hạn (1 dòng sản phẩm, một nhóm khách hàng)
    ├── Báo cáo tiến độ cho NHNN
    ├── Tuân thủ giới hạn vận hành
    │
    ▼
Kết thúc sandbox (tối đa 2 năm)
    │
    ├── Thành công → Ưu tiên cấp phép / triển khai đầy đủ
    └── Không thành công → Dừng và tổng kết bài học
```

Ưu điểm:
- Khung pháp lý rõ ràng, NHNN biết và giám sát.
- Ưu tiên cấp phép sau sandbox.
- Rủi ro pháp lý thấp hơn lộ trình B.
- Giá trị truyền thông: ngân hàng tiên phong tham gia sandbox chấm điểm tín dụng.

Hạn chế:
- Thời gian nộp hồ sơ và phê duyệt khoảng 3 đến 6 tháng.
- Phạm vi giới hạn trong sandbox.
- Có nghĩa vụ báo cáo cho NHNN.

#### Lộ trình B: Tuân thủ tiêu chuẩn (không qua sandbox)

```
Bank X triển khai AI-CRDS như giải pháp của nhà cung cấp
    │
    ├── Tuân thủ toàn bộ văn bản hiện hành:
    │   TT 13 (KSNB), Luật TCTD (thẩm định), Luật BVDLCN + NĐ 356 (DPIA),
    │   TT 41 (Basel II), TT 45 (thẻ), Luật AI 134/2025
    │
    ├── Thẩm định mô hình bởi bộ phận Quản lý rủi ro của Bank X
    ├── Phê duyệt của Hội đồng rủi ro
    ├── DPIA nộp A05
    │
    ▼
Triển khai production
    │
    ├── Tuân thủ liên tục: audit, báo cáo, giám sát
    └── Thanh tra thường kỳ của NHNN
```

Ưu điểm:
- Nhanh hơn do không chờ phê duyệt sandbox.
- Không bị giới hạn phạm vi sandbox.
- Phù hợp quy trình quản lý nhà cung cấp thông thường của ngân hàng.

Hạn chế:
- Không có cơ chế bảo vệ pháp lý của sandbox.
- Không có ưu tiên cấp phép sau sandbox.

### 4.3 Hướng tiếp cận

Bank X lựa chọn lộ trình dựa trên mục tiêu triển khai: Lộ trình A phù hợp khi Bank X ưu tiên quan hệ với cơ quan quản lý và sự công nhận chính thức của NHNN; Lộ trình B phù hợp khi ưu tiên tốc độ triển khai, và Bank X vẫn có thể tham gia sandbox sau đó.

AI-CRDS chuẩn bị bộ tài liệu đủ cho cả hai lộ trình: hồ sơ sandbox và tuân thủ tiêu chuẩn.

### 4.4 Hồ sơ sandbox (nếu Bank X chọn Lộ trình A)

Hồ sơ nộp NHNN gồm (Điều 8 đến 10 NĐ 94):

| # | Tài liệu | Bên chuẩn bị |
|---|---------|-------------|
| 1 | Đơn đề nghị tham gia | Bank X |
| 2 | Mô tả giải pháp chấm điểm tín dụng (AI-CRDS) | Nhà cung cấp AI-CRDS và Bank X |
| 3 | Kế hoạch thử nghiệm (phạm vi, tiến độ, chỉ số, tiêu chí kết thúc) | Phối hợp |
| 4 | Kế hoạch quản lý rủi ro | Phối hợp |
| 5 | Nhân sự (trình độ, kinh nghiệm của lãnh đạo, không tiền án) | Bank X và nhà cung cấp AI-CRDS |
| 6 | Hệ thống CNTT (đặt tại Việt Nam, bảo mật, quyền riêng tư, duy trì hoạt động liên tục) | Nhà cung cấp AI-CRDS và CNTT Bank X |
| 7 | Giấy tờ pháp lý thành lập | Bank X và nhà cung cấp AI-CRDS |
| 8 | Quy trình bảo vệ khách hàng | Phối hợp |

---

## 5. Luật Trí tuệ nhân tạo 134/2025/QH15: Khung Pháp Lý AI Đầu Tiên Của Việt Nam

### 5.1 Tổng quan

| Mục | Nội dung |
|-----|---------|
| Tên | Luật Trí tuệ nhân tạo số 134/2025/QH15 |
| Ban hành | 10/12/2025 (Quốc hội khóa XV, kỳ họp thứ 10) |
| Hiệu lực | 01/03/2026 |
| Ý nghĩa | Luật AI đầu tiên của Việt Nam, tạo khung pháp lý toàn diện cho AI từ nghiên cứu, phát triển đến triển khai và sử dụng. Áp dụng cho mọi tổ chức, cá nhân Việt Nam và nước ngoài có hoạt động AI tại Việt Nam |

### 5.2 Nguyên tắc cốt lõi (Điều 4) và tác động đến AI-CRDS

| # | Nguyên tắc | Nội dung (tóm tắt) | Tác động đến AI-CRDS |
|---|-----------|-------------------|----------------------|
| 1 | Con người là trung tâm | Lấy con người làm trung tâm; bảo đảm quyền con người, quyền riêng tư | Quyết định tín dụng ảnh hưởng quyền tiếp cận tài chính nên cần đặc biệt thận trọng |
| 2 | AI không thay thế con người | AI phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người | Human-in-the-loop là yêu cầu của luật; cán bộ tín dụng ký mọi quyết định |
| 3 | Giám sát của con người | Duy trì kiểm soát và khả năng can thiệp của con người đối với mọi quyết định và hành vi của hệ thống AI | Tùy chọn override của cán bộ tín dụng là bắt buộc; hệ thống có cơ chế dừng khẩn cấp (kill switch) |
| 4 | Công bằng, không phân biệt | Bảo đảm công bằng, minh bạch, không thiên lệch, không phân biệt đối xử | Giám sát thiên lệch là yêu cầu của luật; giám sát giới tính, địa bàn, dân tộc |
| 5 | Minh bạch | Bảo đảm công bằng, minh bạch | Module giải thích là bắt buộc; khách hàng hiểu được lý do bị từ chối |
| 6 | Trách nhiệm giải trình | Thực hiện trách nhiệm giải trình về các quyết định và hệ quả của hệ thống AI | Audit trail, tài liệu mô hình và khả năng tái hiện quyết định là bắt buộc |
| 7 | Kiểm tra, giám sát | Khả năng kiểm tra và giám sát quá trình phát triển và vận hành hệ thống AI | Cơ quan quản lý (NHNN, Bộ KH&CN) có quyền kiểm tra AI-CRDS; Model Card và audit trail luôn sẵn sàng |

### 5.3 Phân loại rủi ro (Điều 9): AI-CRDS thuộc nhóm rủi ro cao

| Mức | Mô tả | AI-CRDS |
|-----|-------|---------|
| Rủi ro cao | Hệ thống AI ảnh hưởng đáng kể đến quyền, lợi ích hợp pháp của cá nhân, tổ chức; danh mục cụ thể do Thủ tướng ban hành | Thuộc nhóm này: chấm điểm tín dụng ảnh hưởng trực tiếp đến khả năng tiếp cận tài chính |
| Rủi ro trung bình | Mức ảnh hưởng vừa phải | Không áp dụng |
| Rủi ro thấp | Không thuộc hai nhóm trên | Không áp dụng |

Hệ quả đối với hệ thống AI rủi ro cao:
- Nghĩa vụ nặng hơn: đánh giá tác động, ghi nhãn, giám sát liên tục.
- Có thể phải đăng ký trên Cổng thông tin điện tử một cửa về AI và Cơ sở dữ liệu quốc gia về hệ thống AI do Bộ KH&CN quản lý.
- Trách nhiệm bồi thường khi AI gây thiệt hại.

### 5.4 Nghĩa vụ ghi nhãn AI

| Điểm ghi nhãn | Cách triển khai |
|---------------|----------------|
| Quyết định tín dụng có sự tham gia của AI | Thông báo từ chối và thư phê duyệt ghi rõ: "Quyết định này được hỗ trợ bởi hệ thống trí tuệ nhân tạo. Quyết định cuối cùng do cán bộ tín dụng đưa ra." |
| Hiển thị điểm AI cho cán bộ tín dụng | Giao diện hiển thị: "Khuyến nghị của AI, hỗ trợ bởi hệ thống AI, không phải quyết định cuối cùng" |
| Truyền thông với khách hàng | Văn bản đồng ý nêu rõ: "Hồ sơ sẽ được xử lý có hỗ trợ của hệ thống trí tuệ nhân tạo" |

### 5.5 Trách nhiệm bồi thường

Luật quy định trách nhiệm bồi thường khi AI gây thiệt hại. Phân định trách nhiệm giữa Bank X và nhà cung cấp AI-CRDS được quy định trong điều khoản phân bổ trách nhiệm của hợp đồng:

| Tình huống | Bên chịu trách nhiệm | Ghi chú |
|-----------|---------------------|---------|
| AI từ chối nhầm, khách mất cơ hội tín dụng | Bank X, là bên ra quyết định tín dụng; nhà cung cấp chịu trách nhiệm đối với lỗi hệ thống của mô hình | Quy định trong điều khoản phân bổ trách nhiệm của hợp đồng |
| AI phê duyệt nhầm, Bank X tổn thất | Bank X chịu trách nhiệm chính do cán bộ tín dụng đã ký; nhà cung cấp chịu trách nhiệm nếu mô hình lỗi hệ thống | Có human-in-the-loop |
| AI thiên lệch, phân biệt đối xử có hệ thống | Cả hai: Bank X (triển khai) và nhà cung cấp (thiết kế) | Giám sát thiên lệch và kiểm toán định kỳ giảm thiểu rủi ro |
| Lộ lọt dữ liệu qua hệ thống AI | Bên kiểm soát DLCN (Bank X) và bên xử lý (nhà cung cấp) | Theo Luật BVDLCN 2025 |

### 5.6 Quy định chi tiết của các bộ, ngành

Kế hoạch triển khai Luật AI (baochinhphu.vn, 03/2026) nêu: năm 2026 và các năm tiếp theo, bộ, cơ quan ngang bộ quy định chi tiết yêu cầu về an toàn, quản lý rủi ro và điều kiện triển khai đối với ứng dụng AI trong ngành, lĩnh vực quản lý.

NHNN sẽ ban hành thông tư riêng về AI trong ngân hàng. Nội dung dự kiến (theo dự thảo đã lấy ý kiến, nguồn vietnamlawmagazine.vn và DataGuidance) và mức độ sẵn sàng của AI-CRDS:

| Yêu cầu dự kiến | Tác động đến AI-CRDS | Mức độ sẵn sàng |
|-----------------|---------------------|----------------|
| Thông báo trước cho khách khi dùng AI | Văn bản đồng ý và ghi nhãn | Đã thiết kế (mục 5.4) |
| Quyền khiếu nại đối với quyết định AI | Luồng xử lý khiếu nại | Đã thiết kế (w02-03-pdpd-impact-bank-x, quyền số 9) |
| Human-in-the-loop bắt buộc | Cán bộ tín dụng ký mọi quyết định | Đã thiết kế (mục 1) |
| Đăng ký, thông báo hệ thống AI với NHNN | Hồ sơ đăng ký AI-CRDS | Chuẩn bị theo định dạng khi thông tư ban hành |
| Báo cáo sự cố AI | Luồng báo cáo sự cố | Đã thiết kế (mục 3.5) |

AI-CRDS được thiết kế theo các yêu cầu dự kiến này để đáp ứng sẵn khi thông tư chính thức ban hành.

### 5.7 So sánh trước và sau Luật AI 134/2025

| Yêu cầu | Trước 01/03/2026 | Từ 01/03/2026 | Tác động |
|---------|-----------------|---------------|---------|
| Giám sát của con người | Thông lệ NHNN và Luật TCTD (ngầm định) | Luật AI Điều 4 (quy định rõ): duy trì kiểm soát và can thiệp của con người | Từ thông lệ thành yêu cầu của luật |
| Giám sát thiên lệch | Thông lệ tốt, chưa bắt buộc | Luật AI Điều 4: không thiên lệch, không phân biệt đối xử | Từ tùy chọn thành bắt buộc |
| Khả năng giải thích | NĐ 356 Điều 9 (cho DLCN) | Luật AI Điều 4: minh bạch và trách nhiệm giải trình | Mở rộng cho toàn bộ quyết định AI |
| Ghi nhãn AI | Chưa có | Luật AI: bắt buộc ghi nhãn | Yêu cầu mới |
| Phân loại rủi ro | Chưa có | Luật AI Điều 9: 3 mức rủi ro | Yêu cầu mới; AI-CRDS thuộc nhóm rủi ro cao |
| Trách nhiệm bồi thường | Theo Bộ luật Dân sự chung | Luật AI: quy định riêng cho AI | Yêu cầu mới; cần khung phân bổ trách nhiệm |
| Đăng ký AI | Chưa có | Luật AI: Cơ sở dữ liệu quốc gia về AI và Cổng một cửa | Yêu cầu mới; thực hiện theo nghị định hướng dẫn |

---

## 6. Tổng Hợp Danh Mục Tuân Thủ

| # | Yêu cầu | Văn bản gốc | Mức ưu tiên | Trạng thái trong thiết kế AI-CRDS |
|---|---------|------------|-------------|-----------------------------------|
| 1.1 | AI chỉ hỗ trợ quyết định, cán bộ tín dụng ký quyết định | Luật TCTD 2024 | Bắt buộc, không thỏa hiệp | Tích hợp trong thiết kế từ đầu |
| 1.2 | Quản trị xem xét theo lô (không phải tự động phê duyệt thực sự) | TT 13/2018 | Cao | Thiết kế theo luồng mục 1.3 và quy tắc R2 |
| 1.3 | Ghi bắt buộc lý do override | TT 13/2018 | Cao | Trường `override_reason` trong audit trail |
| 1.4 | Từ chối chấm điểm AI, xử lý 100% thủ công | NĐ 356/2025 | Cao | Quy tắc R5 |
| 1.5 | Ngưỡng do Hội đồng rủi ro phê duyệt | TT 13/2018 | Cao | Quy tắc R6 |
| 2.1 | Model Card (tài liệu đầy đủ) | TT 13/2018, Basel II | Trung bình | Cấu trúc tại mục 2.2.A |
| 2.2 | Thẩm định mô hình độc lập (Quản lý rủi ro Bank X) | TT 13/2018 | Cao | Quy trình tại mục 2.2.B |
| 2.3 | Hội đồng rủi ro ký duyệt | TT 13/2018 | Cao | Quy trình tại mục 2.2.B |
| 3.1 | Audit trail từ 20 trường, bất biến | TT 13/2018, Luật BVDLCN | Cao | Lược đồ tại mục 3.2 |
| 3.2 | Khả năng tái hiện quyết định | TT 13/2018 | Cao | Yêu cầu tại mục 3.3 |
| 3.3 | Xuất dữ liệu theo yêu cầu NHNN (dưới 15 phút) | Luật TCTD 2024 | Trung bình | Kịch bản tại mục 3.4 |
| 3.4 | Tương thích báo cáo gian lận SIMO | TT 45/2025 | Trung bình | Mục 3.5 |
| 3.5 | Chính sách lưu trữ | TT 13/2018, Luật BVDLCN | Trung bình | 5 đến 10 năm theo hồ sơ tín dụng |
| 4.1 | Bộ tài liệu sandbox | NĐ 94/2025 | Tùy chọn | Danh mục tại mục 4.4 |
| 4.2 | Hạ tầng CNTT đặt tại Việt Nam | NĐ 94/2025 | Có điều kiện | Kiến trúc kết hợp, DLCN lưu trong nước |
| 5.1 | Giám sát của con người theo luật (không chỉ thông lệ) | Luật AI 134/2025 Điều 4 | Bắt buộc, không thỏa hiệp | Tích hợp trong thiết kế từ đầu |
| 5.2 | Giám sát thiên lệch bắt buộc | Luật AI 134/2025 Điều 4 | Cao | Dashboard giám sát thiên lệch |
| 5.3 | Ghi nhãn AI trên mọi đầu ra | Luật AI 134/2025 | Cao | Theo mục 5.4, có ngay từ bản MVP |
| 5.4 | Trách nhiệm giải trình (audit và giải thích) | Luật AI 134/2025 Điều 4 | Cao | Audit trail và module giải thích |
| 5.5 | Phân bổ trách nhiệm giữa nhà cung cấp và Bank X | Luật AI 134/2025 | Trung bình | Điều khoản hợp đồng theo mục 5.5 |
| 5.6 | Chuẩn bị theo Danh mục AI rủi ro cao | Luật AI 134/2025 Điều 9 | Trung bình | Hồ sơ kỹ thuật cho AI rủi ro cao |
| 5.7 | Theo dõi thông tư NHNN về AI trong ngân hàng | Luật AI 134/2025 | Trung bình | Thiết kế theo yêu cầu dự kiến tại mục 5.6 |

---

## 7. Phạm Vi Áp Dụng

1. Các trạng thái và giả định về hiện trạng của Bank X trong tài liệu là giả định lập kế hoạch dựa trên thông tin công khai, được cập nhật khi có dữ liệu nội bộ của Bank X.
2. Tài liệu không thay thế tư vấn pháp lý; các nội dung về thời hạn lưu trữ, nộp DPIA cho A05, hồ sơ sandbox và phân bổ trách nhiệm được rà soát với tư vấn pháp lý của Bank X.
3. Thông tư thay thế TT 13/2018 có thể bổ sung yêu cầu quản lý rủi ro mô hình cụ thể và được cập nhật khi ban hành.
4. Nghị định hướng dẫn Luật AI và Danh mục AI rủi ro cao quyết định chi tiết nghĩa vụ đối với AI rủi ro cao; các nội dung như mức phạt, đăng ký AI được cập nhật khi các văn bản này ban hành.
5. Tham chiếu: w02-01-regulatory-mapping, w02-02-compliance-gap-analysis, w02-03-pdpd-impact-bank-x.
