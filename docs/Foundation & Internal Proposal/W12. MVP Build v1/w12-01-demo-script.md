# Demo Script — AI-CRDS MVP v1
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## Mục đích

Kịch bản demo nội bộ cho AI-CRDS MVP v1 tại Bank X, gồm 3 tình huống, tổng thời lượng 15-20 phút. Đối tượng tham dự: Credit Officer, Risk Manager, Head of Cards, CTO.

Toàn bộ dữ liệu trong buổi demo là dữ liệu tổng hợp (synthetic), không phải khách hàng thật của Bank X.

---

## 0. Chuẩn bị và mở đầu (2 phút)

### Chuẩn bị trước buổi demo

- Hệ thống đang chạy, đã nạp 10.000 bản ghi dữ liệu tổng hợp.
- 3 hồ sơ kiểm thử (tình huống A, B, C) đã được tạo sẵn.
- Trình duyệt đặt zoom 125% để đọc được trên máy chiếu.
- Có sẵn bộ ảnh chụp màn hình dự phòng cho trường hợp demo trực tiếp gặp sự cố.
- Hiển thị watermark "SYNTHETIC DATA — DEMO ONLY" trên mọi màn hình.

### Lời mở đầu

```
"Cảm ơn mọi người đã dành thời gian. Hôm nay tôi trình bày AI-CRDS,
hệ thống hỗ trợ quyết định tín dụng thẻ tín dụng tại Bank X.

Ba điều cần lưu ý trước khi bắt đầu:
1. Dữ liệu hoàn toàn là dữ liệu tổng hợp, không phải khách hàng thật.
2. Hệ thống chỉ hỗ trợ; Credit Officer vẫn ký quyết định cuối cùng.
3. Đây là bản MVP nhằm trình bày luồng xử lý end-to-end, chưa phải bản vận hành.

Buổi demo gồm 3 tình huống:
A. Hồ sơ tốt: điểm cao, xác nhận theo lô (3-5 phút thay vì 35 phút).
B. Hồ sơ biên: có giải thích, Credit Officer thẩm định đầy đủ, từ chối và phát hành thông báo từ chối.
C. Hồ sơ có tín hiệu gian lận: hệ thống cảnh báo và chuyển xử lý ưu tiên.

Mỗi tình huống khoảng 5-7 phút. Mời đặt câu hỏi sau mỗi tình huống hoặc cuối buổi."
```

---

## 1. Tình huống A: Hồ sơ tốt (State 1: Duyệt theo lô)

### Dữ liệu hồ sơ

| Trường | Giá trị | Ghi chú |
|-------|---------|---------|
| Họ tên | SYN-Nguyễn Văn An | Tiền tố dữ liệu tổng hợp |
| CCCD | SYN-079123456 | Dữ liệu tổng hợp |
| Tuổi | 35 | Độ tuổi thu nhập ổn định |
| Thu nhập | 25 triệu/tháng | Trên mức trung bình |
| Đơn vị công tác | FPT Software (FDI) | Ổn định, dễ xác minh |
| Thời gian làm việc | 36 tháng | Thâm niên dài |
| Điểm CIC | 740 | Cao |
| DTI | 22% | Thấp |
| Lịch sử quá hạn (DPD) | 0 | Sạch |
| eKYC | Đạt (0,96) | Độ tin cậy cao |

### Diễn biến demo (5-7 phút)

```
BƯỚC 1: Nhập hồ sơ (/apply)
"Đây là form nhập hồ sơ. Khi vận hành, dữ liệu được điền tự động từ form
online hoặc do chi nhánh nhập. Trong demo này tôi nhập thủ công."
- Điền các trường thông tin
- Chọn "Submit Application"
- Hệ thống hiển thị "Hồ sơ đang được xử lý..."

BƯỚC 2: Kết quả chấm điểm (/score/[id])
"Trong vòng 30 giây, hệ thống đã:
- Truy vấn CIC (mô phỏng): điểm 740
- Chạy eKYC (mô phỏng): đạt
- Tính điểm rủi ro: 0,82
- Tính độ tin cậy: 91%
- Định tuyến sang State 1 (Duyệt theo lô)"

Màn hình hiển thị:
- Risk Score: 0,82 (rủi ro thấp), thang màu xanh
- Confidence: 91%, thanh màu xanh
- Fraud Score: 0,05 (không có dấu hiệu), màu xanh
- State: BATCH REVIEW (State 1)
- Đề xuất của hệ thống: APPROVE
- Ba yếu tố tích cực hàng đầu: CIC 740, DTI 22%, thâm niên 3 năm
- Nhãn: "Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo"

"Nhãn này là yêu cầu bắt buộc theo Luật AI 134/2025."

BƯỚC 3: Hàng đợi duyệt theo lô (/review/batch)
"Đây là hàng đợi của Credit Officer, gồm 12 hồ sơ được hệ thống đề xuất phê duyệt.
Credit Officer xem tóm tắt, có thể mở chi tiết rồi xác nhận."

- Hiển thị hàng đợi 12 hồ sơ
- Mở chi tiết 1-2 hồ sơ
- Chọn 4 hồ sơ (gồm Nguyễn Văn An)
- Chọn "Confirm Selected (4)"
- "4 hồ sơ đã được phê duyệt."

"Thời gian xử lý 4 hồ sơ là 3-5 phút. Quy trình hiện tại: 35 phút x 4 = 140 phút,
tức giảm khoảng 85% thời gian thẩm định cho nhóm hồ sơ độ tin cậy cao."

BƯỚC 4: Nhật ký kiểm toán (/audit)
"Mọi quyết định được ghi nhận tự động với 28 trường thông tin."

- Mở bản ghi của Nguyễn Văn An
- Chỉ ra: decision_id, model_version, ai_risk_score, human_decision,
  co_review_seconds, ai_label_displayed, batch_review_flag
- "NHNN có thể kiểm tra bất kỳ quyết định nào với đầy đủ thông tin."
```

### Thông điệp chính

```
"State 1 chiếm khoảng 35-45% khối lượng hồ sơ. Thời gian xử lý giảm từ 35 phút
thủ công xuống 3-5 phút xác nhận theo lô. Credit Officer vẫn xem xét và xác nhận;
hệ thống chỉ sàng lọc sơ bộ và định tuyến. Đây là nguồn tiết kiệm vận hành lớn nhất."
```

Tỷ trọng State 1 và mức giảm thời gian là giả định lập kế hoạch, sẽ được thay bằng số đo thực tế của Bank X khi có dữ liệu.

---

## 2. Tình huống B: Hồ sơ biên (State 2: Thẩm định riêng lẻ, từ chối)

### Dữ liệu hồ sơ

| Trường | Giá trị | Ghi chú |
|-------|---------|---------|
| Họ tên | SYN-Phạm Thị Bình | Dữ liệu tổng hợp |
| CCCD | SYN-024987654 | Dữ liệu tổng hợp |
| Tuổi | 29 | Trẻ |
| Thu nhập | 18 triệu/tháng | Trung bình |
| Đơn vị công tác | Công ty ABC (SME) | Mức ổn định thấp hơn |
| Thời gian làm việc | 8 tháng | Ngắn |
| Điểm CIC | 650 | Đạt nhưng không mạnh |
| DTI | 42% | Cao ở mức biên |
| Lịch sử quá hạn (DPD) | 0 | Sạch |
| Số lần truy vấn tín dụng 6 tháng | 2 | Nhiều truy vấn gần đây |
| eKYC | Đạt (0,91) | Chấp nhận được |

### Diễn biến demo (5-7 phút)

```
BƯỚC 1: Kết quả chấm điểm
- Risk Score: 0,52 (trung bình), thang màu vàng
- Confidence: 72%, thanh màu vàng
- State: STANDARD REVIEW (State 2)
- Đề xuất của hệ thống: REVIEW NEEDED

BƯỚC 2: Màn hình thẩm định riêng lẻ (/review/[id])
"Đây là màn hình Credit Officer dùng cho State 2, thẩm định đầy đủ."

Bố cục hai cột:
CỘT TRÁI (Bảng hệ thống):
- Risk Score: 0,52 (trung bình)
- Confidence: 72%
- Ba yếu tố rủi ro hàng đầu:
  1. DTI 42% (mức biên)
  2. Thời gian làm việc 8 tháng (ngắn)
  3. 2 truy vấn tín dụng trong 6 tháng (nhiều truy vấn gần đây)
- Ba yếu tố tích cực hàng đầu:
  1. CIC 650 (đạt)
  2. Không có lịch sử quá hạn
  3. eKYC đã xác minh

CỘT PHẢI (Dữ liệu khách hàng):
- Thông tin nhân khẩu, thu nhập, đơn vị công tác
- Tóm tắt báo cáo CIC
- Chi tiết eKYC

"Hệ thống không kết luận 'từ chối'. Hệ thống đề xuất 'cần thẩm định' và giải thích lý do.
Credit Officer thấy cả yếu tố rủi ro lẫn yếu tố tích cực, và là người quyết định."

BƯỚC 3: Quyết định của Credit Officer: từ chối
"Trong demo này, Credit Officer từ chối vì DTI 42% và thời gian làm việc 8 tháng."

- Chọn "REJECT"
- Hệ thống tự động tạo thông báo từ chối gửi khách hàng

BƯỚC 4: Thông báo từ chối
"Khi từ chối, hệ thống tự động tạo thông báo cho khách hàng."

Nội dung thông báo:
- Tiêu đề: "CHƯA ĐÁP ỨNG ĐIỀU KIỆN PHÁT HÀNH THẺ"
- Lý do:
  1. Tỷ lệ nghĩa vụ nợ hiện tại so với thu nhập vượt mức cho phép
  2. Thời gian làm việc tại đơn vị hiện tại chưa đủ yêu cầu
  3. Số lượng yêu cầu vay vốn gần đây cao bất thường
- Quyền của khách hàng: kiểm tra CIC, yêu cầu con người xem xét lại, khiếu nại, nộp hồ sơ lại
- Nhãn: "Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo"
- Hotline và email tiếp nhận khiếu nại

"Ba lý do được diễn đạt rõ ràng, không dùng câu chung chung 'không đủ điều kiện'.
Khách hàng hiểu lý do bị từ chối. Nội dung này đáp ứng NĐ 356 và Luật AI 134/2025."
```

### Thông điệp chính

```
"Hệ thống giải thích lý do, Credit Officer ra quyết định trên cơ sở đầy đủ thông tin,
khách hàng hiểu vì sao hồ sơ bị từ chối. Quy trình hiện tại: Credit Officer kiểm tra
hơn 10 trường dữ liệu trong 35 phút và lý do từ chối chỉ là 'không đủ điều kiện'.
Với AI-CRDS: ba yếu tố rủi ro và ba yếu tố tích cực hàng đầu được làm nổi bật,
Credit Officer tập trung thẩm định, thông báo từ chối được tạo tự động."
```

---

## 3. Tình huống C: Phát hiện gian lận (State 3)

### Dữ liệu hồ sơ

| Trường | Giá trị | Ghi chú |
|-------|---------|---------|
| Họ tên | SYN-Trần Văn Cường | Dữ liệu tổng hợp |
| CCCD | SYN-036111222 | Dữ liệu tổng hợp |
| Tuổi | 28 | Trẻ |
| Thu nhập | 30 triệu/tháng | Cao bất thường so với hồ sơ |
| Đơn vị công tác | "Tập đoàn XYZ" | Không xác minh được |
| Thời gian làm việc | 24 tháng | Khai báo 2 năm |
| eKYC | Face match 0,58 (thấp) | Khả năng giả mạo danh tính |
| Tần suất nộp hồ sơ | 3 hồ sơ cùng thiết bị trong 24 giờ | Tín hiệu gian lận |
| CIC | Không có dữ liệu (thin file) | Không có lịch sử tín dụng |

### Diễn biến demo (5-7 phút)

```
BƯỚC 1: Kết quả chấm điểm
- Risk Score: 0,38 (rủi ro cao), thang màu đỏ
- Fraud Score: 0,71 (ở mức cao), cảnh báo đỏ
- State: PRIORITY FRAUD REVIEW (State 3), huy hiệu đỏ
- Banner "PHÁT HIỆN TÍN HIỆU GIAN LẬN"

BƯỚC 2: Màn hình thẩm định gian lận
"State 3 là luồng thẩm định gian lận ưu tiên, do chuyên viên phòng chống gian lận
hoặc Credit Officer cấp cao xử lý."

Giao diện riêng cho gian lận:
- Các tín hiệu gian lận được phát hiện:
  - Điểm face match: 0,58 (dưới ngưỡng 0,80)
  - Tần suất nộp hồ sơ: 3 hồ sơ cùng thiết bị trong 24 giờ
  - Đơn vị công tác: không tìm thấy trong dữ liệu đăng ký kinh doanh
  - Thu nhập: 30 triệu mâu thuẫn với hồ sơ không có dữ liệu CIC
- Hành động đề xuất: Thẩm định tăng cường (Enhanced Due Diligence)
- Có sẵn danh mục kiểm tra EDD

"Hệ thống phát hiện 4 tín hiệu gian lận mà quy trình hiện tại có thể bỏ sót.
eKYC chỉ trả kết quả đạt hoặc không đạt; AI-CRDS đối chiếu nhiều tín hiệu cùng lúc."

BƯỚC 3: Quyết định: từ chối do gian lận
- Chọn "REJECT — Fraud Confirmed"
- Nhật ký kiểm toán ghi fraud_decision = true
- Cờ báo cáo SIMO được ghi nhận
- Danh sách đen nội bộ được cập nhật

BƯỚC 4: Thông báo từ chối (mẫu dành cho gian lận)
Nội dung mẫu:
- "Không thể hoàn tất xác minh thông tin cá nhân theo quy định"
- Không nêu chi tiết các tín hiệu gian lận
- Hướng dẫn khách hàng đến chi nhánh nếu muốn xác minh lại

"Lưu ý: thông báo gửi khách hàng không nêu 'nghi ngờ gian lận', chỉ nêu
'không thể xác minh'. Cách này bảo vệ Bank X khỏi rủi ro pháp lý về danh dự
và không cho đối tượng gian lận biết cách hệ thống phát hiện."
```

### Thông điệp chính

```
"Hiện tại Bank X chỉ có kết quả eKYC đạt/không đạt, chưa có lớp chấm điểm gian lận.
AI-CRDS bổ sung phát hiện gian lận đa tín hiệu:
- Bất thường điểm face match
- Tần suất nộp hồ sơ
- Xác minh đơn vị công tác
- Mâu thuẫn giữa thu nhập và hồ sơ

Tỷ lệ gian lận khoảng 0,8% x 3.000 hồ sơ/tháng = 24 trường hợp/tháng x 50 triệu
= 14,4 tỷ đồng/năm. Phát hiện thêm 30% giúp giảm thiệt hại khoảng 4,32 tỷ đồng/năm."
```

Các số liệu trên (tỷ lệ gian lận, số hồ sơ mỗi tháng, hạn mức trung bình, mức cải thiện 30%) là giả định lập kế hoạch, sẽ được thay bằng dữ liệu thực của Bank X khi có.

---

## 4. Kết thúc (2 phút)

```
"Tóm tắt 3 tình huống:

A. Hồ sơ tốt: từ 35 phút thủ công xuống 3-5 phút xác nhận theo lô, tiết kiệm khoảng 85% thời gian.
B. Hồ sơ biên: hệ thống giải thích, Credit Officer thẩm định đầy đủ thông tin,
   thông báo từ chối được tạo tự động.
C. Gian lận: hệ thống phát hiện đa tín hiệu, chặn ngay tại khâu tiếp nhận, trước khi thẻ được phát hành.

Trong cả ba tình huống:
- Credit Officer vẫn ký quyết định cuối cùng.
- Nhật ký kiểm toán 28 trường, sẵn sàng cho thanh tra NHNN.
- Nhãn AI được hiển thị theo Luật AI 134/2025.
- Dữ liệu 100% là dữ liệu tổng hợp, chỉ dùng cho MVP demo.

Mời mọi người dùng thử hệ thống và góp ý."
```

---

## 5. Câu hỏi thường gặp

| # | Câu hỏi | Trả lời |
|---|--------|---------|
| 1 | "Điểm số dựa trên cơ sở nào?" | "MVP dùng chấm điểm theo luật (điểm CIC, DTI, thâm niên, lịch sử quá hạn). Bản vận hành dùng mô hình học máy (từ hồi quy logistic đến gradient boosting) huấn luyện trên dữ liệu thực của Bank X." |
| 2 | "Độ chính xác là bao nhiêu?" | "MVP chạy trên dữ liệu tổng hợp nên chỉ số độ chính xác chưa có ý nghĩa. Giai đoạn shadow testing trên dữ liệu thực thuộc Phase 0 sẽ cho con số thật. Mục tiêu là mức đồng thuận với Credit Officer từ 70% trở lên." |
| 3 | "Nếu hệ thống đề xuất sai thì sao?" | "Credit Officer luôn có quyền ghi đè. Mọi lần ghi đè được ghi nhận và theo dõi. Nếu hệ thống sai có hệ thống, mô hình được huấn luyện lại. Rào chắn an toàn: NPL tăng 200 bps thì dừng khẩn cấp." |
| 4 | "Credit Officer có bị thay thế không?" | "Không. Credit Officer ký mọi quyết định. Hệ thống xử lý hồ sơ thường quy (theo lô), Credit Officer tập trung vào hồ sơ phức tạp, nơi chuyên môn có giá trị cao hơn." |
| 5 | "Khi nào dùng dữ liệu thật?" | "Sau khi Phase 0 được phê duyệt, hồ sơ đánh giá tác động xử lý dữ liệu cá nhân (DPIA) được nộp và việc tích hợp với hệ thống CNTT hoàn tất. Mốc thời gian cụ thể nằm trong lộ trình triển khai tại w11-06-implementation-roadmap.md." |
| 6 | "Ngân sách bao nhiêu?" | "Phase 0: 365 triệu đồng, 8 tuần. Chi tiết trong w11-06-implementation-roadmap.md." |
| 7 | "Tại sao không mua giải pháp của nhà cung cấp?" | "Tự xây dựng giúp Bank X sở hữu 100% tài sản trí tuệ, chi phí 3 năm thấp hơn khoảng 40-50%, phù hợp quy định Việt Nam và tận dụng dữ liệu CBS/CIC nội bộ." |

Các con số về ngân sách và chênh lệch chi phí là ước tính lập kế hoạch, sẽ được cập nhật theo số liệu thực của Bank X.

---

## 6. Phương án dự phòng khi demo trực tiếp gặp sự cố

| Sự cố | Phương án dự phòng |
|-------|--------------------|
| Hệ thống ngừng hoạt động | Chuyển sang bộ ảnh chụp màn hình đã chuẩn bị cho cả 3 tình huống |
| Lỗi bộ chấm điểm | Hiển thị kết quả cố định từ dữ liệu kiểm thử đã nạp sẵn |
| Giao diện lỗi | Trình bày theo bản wireframe (w09-02-ux-wireframes-v1.md) |
| Dữ liệu không tải được | Demo với 1 bản ghi nạp sẵn cho mỗi tình huống |
| Sự cố máy chiếu | Chia sẻ màn hình qua Zoom hoặc Teams (có sẵn liên kết) |

Nguyên tắc: nếu demo trực tiếp lỗi quá 2 phút thì chuyển sang phương án dự phòng, không xử lý lỗi trước người xem.
