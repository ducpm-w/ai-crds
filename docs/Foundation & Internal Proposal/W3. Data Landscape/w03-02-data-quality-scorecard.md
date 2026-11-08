# Data Quality Scorecard — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) · **Khách hàng:** Bank X

---

## Mục đích

Đánh giá chất lượng dữ liệu đầu vào của AI-CRDS tại Bank X theo 5 tiêu chí, làm căn cứ chọn biến cho mô hình và xác định các hạng mục cải thiện dữ liệu.

**Lưu ý về số liệu:** Điểm và tỷ lệ trong tài liệu là ước tính dựa trên nguồn công khai và thực tiễn ngành ngân hàng Việt Nam, được dùng làm giả định lập kế hoạch cho Bank X. Các giá trị sẽ được thay bằng kết quả đo trên dữ liệu thực của Bank X khi có.

---

## 1. Năm tiêu chí đánh giá

| # | Tiêu chí | Mô tả | Thang điểm |
|---|---------|-------|-----------|
| 1 | **Completeness** | Tỷ lệ bản ghi có giá trị (không rỗng) | 1 (≤50%) đến 5 (≥98%) |
| 2 | **Accuracy** | Tỷ lệ giá trị đúng so với thực tế hoặc nguồn gốc | 1 (≤60%) đến 5 (≥98%) |
| 3 | **Consistency** | Tỷ lệ giá trị nhất quán giữa các hệ thống (CBS, CIC, eKYC) | 1 (≤60%) đến 5 (≥95%) |
| 4 | **Timeliness** | Độ mới của dữ liệu (thời gian thực đến T+30) | 1 (T+30 trở lên) đến 5 (thời gian thực) |
| 5 | **Uniqueness** | Tỷ lệ bản ghi không trùng | 1 (≤80%) đến 5 (≥99%) |

Điểm tổng hợp của mỗi biến là trung bình các tiêu chí.

| Mức | Điểm | Cách sử dụng |
|-----|------|-------------|
| Dùng được | từ 3,5 | Dùng cho mô hình |
| Dùng có điều kiện | 2,5 đến 3,4 | Dùng được sau khi làm sạch hoặc bổ sung |
| Chưa dùng được | dưới 2,5 | Cần xử lý khoảng trống dữ liệu trước |

---

## 2. Nguồn tham chiếu

| # | Nguồn | Nội dung | Thời điểm |
|---|-------|---------|-----------|
| 1 | CIC Conference 02/2026 (vietnam.vn) | CSDL CIC có khoảng 55 triệu chủ thể dữ liệu, bao phủ 71% dân số trưởng thành; Host-to-Host khoảng 95%; 106 triệu báo cáo năm 2025 | 02/2026 |
| 2 | Cambridge Legal Research (2023) | CIC có 30,8 triệu cá nhân có lịch sử tín dụng, 670 nghìn doanh nghiệp, hơn 1.200 tổ chức tín dụng; FE Credit có 14 triệu khách hàng | 2023 |
| 3 | Hướng dẫn SeaBank/CIC (2025) | Điểm CIC cập nhật mỗi 1-2 tuần; nợ xấu được giữ tối thiểu 5 năm | 2025 |
| 4 | Báo cáo Basel II của Vietcombank/VietinBank | 86% ngân hàng thương mại áp dụng TT 41; mô hình ba tuyến đã kiện toàn | 2022 |
| 5 | Thực tiễn ngân hàng Việt Nam | Thu nhập tự khai, địa chỉ tự do, chuyển đổi CMND sang CCCD, mức độ áp dụng ngân hàng số | Tổng hợp |

---

## 3. Đánh giá biến cốt lõi

| # | Biến | Nguồn | Completeness | Accuracy | Consistency | Timeliness | Điểm | Mức | Giải thích |
|---|------|------|-------------|----------|-------------|-----------|------|-----|-----------|
| F1 | Age (DOB) | CBS | ~98% (4,5) | ~95% (4,5), đối chiếu CCCD | ~90% (4) | Real-time (5) | 4,5 | Dùng được | DOB là trường bắt buộc khi mở tài khoản. Độ chính xác cao nhờ CCCD/eKYC. Vấn đề nhất quán: định dạng ngày khác nhau giữa các hệ thống. |
| F2 | Monthly income (declared) | Hồ sơ đăng ký | ~95% (4,5) | ~60% (2), tự khai và thường khai cao | ~50% (1,5), chênh 20-50% so với thực tế | T+0 khi khai (5), nhanh lỗi thời (2) | 2,5 | Có điều kiện | Điểm yếu lớn nhất. Khách thường khai cao hơn thực tế 20-50%, không tự cập nhật khi đổi lương. Cần đối chiếu dữ liệu lương hoặc sao kê. |
| F3 | Income verified (payroll) | Giao dịch CBS | ~35-50% (2), chỉ khách hiện hữu nhận lương qua Bank X | ~90% (4,5) | ~85% (4) | T+1 (4) | 3,6 | Dùng được (khi có) | Nguồn tốt nhất để xác minh thu nhập, nhưng độ phủ thấp. Khách mới của Bank X không có dữ liệu này. |
| F4 | Employment tenure | Hồ sơ đăng ký | ~90% (4) | ~50% (1,5), khó xác minh | ~40% (1) | T+0 khi khai (5), lỗi thời (2) | 2,1 | Chưa dùng được | Khách có thể khai kéo dài thời gian làm việc; chưa có API xác minh BHXH. Cần kết hợp dữ liệu lương để đối chiếu. |
| F5 | Employer type | Hồ sơ đăng ký | ~85% (3,5) | ~60% (2), văn bản tự do | ~50% (1,5), không khớp ĐKKD | T+0 (5), lỗi thời (2) | 2,2 | Chưa dùng được | Nhập tự do ("Cty ABC", "Công ty TNHH ABC"). Cần chuẩn hóa bằng NLP và tra cứu ĐKKD; phân loại SOE, FDI, tư nhân thực hiện thủ công. |
| F6 | CIC Score | CIC API | ~71% (3) | ~90% (4,5) | ~95% (4,5) | T+7-14 (3) | 3,8 | Dùng được | Nguồn đáng tin cậy nhất về rủi ro tín dụng. Giới hạn: 29% dân số trưởng thành chưa có dữ liệu CIC (thin file); với phân khúc thẻ có lương, độ phủ ước tính 80-85%. |
| F7 | Total outstanding debt | CIC | ~71% (3) | ~85% (4) | ~90% (4,5) | T+7-14 (3) | 3,6 | Dùng được | Độ trễ 1-2 tuần nên có thể chưa phản ánh khoản vừa trả hoặc vừa vay thêm. Chấp nhận được cho chấm điểm, cần ghi nhận giới hạn này. |
| F8 | DTI ratio | Phái sinh (F7/F2) | Không áp dụng | Phụ thuộc F2 và F7 | Không áp dụng | Không áp dụng | ~3,0 (trung bình F2 và F7) | Có điều kiện | Chỉ tốt bằng đầu vào yếu nhất. Khi có thu nhập từ dữ liệu lương (F3), DTI đáng tin hơn nhiều. |
| F9 | Number of active loans | CIC | ~71% (3) | ~90% (4,5) | ~95% (4,5) | T+7-14 (3) | 3,8 | Dùng được | Tương tự F6. |
| F10 | Max DPD 12M | CIC | ~71% (3) | ~90% (4,5) | ~95% (4,5) | T+7-14 (3) | 3,8 | Dùng được | Biến quan trọng nhất cho dự báo default; độ chính xác cao vì do ngân hàng báo cáo trực tiếp. |
| F11 | CIC inquiries 6M | CIC | ~71% (3) | ~95% (4,5) | ~98% (5) | T+1-7 (4) | 4,1 | Dùng được | Tín hiệu nhu cầu vay gấp. Độ chính xác rất cao vì hệ thống tự ghi nhận. |
| F12 | Relationship tenure | CBS | ~40-60% (2), chỉ khách hiện hữu | ~98% (5) | ~98% (5) | Real-time (5) | 4,3 (khi có) | Dùng được (khi có) | Rất chính xác với khách hiện hữu; khách mới không có dữ liệu nên mô hình cần xử lý giá trị thiếu. |

## 4. Đánh giá biến bổ trợ và biến gian lận

| # | Biến | Nguồn | Completeness | Accuracy | Consistency | Timeliness | Điểm | Mức | Giải thích |
|---|------|------|-------------|----------|-------------|-----------|------|-----|-----------|
| F13 | Avg balance 3M | CBS | ~40-60% (2) | ~95% (4,5) | ~95% (4,5) | T+1 (4) | 3,8 (khi có) | Dùng được (khi có) | Đại diện thu nhập và độ ổn định tài chính; chỉ có với khách hiện hữu. |
| F14 | Salary credit frequency | Giao dịch CBS | ~30-45% (1,5) | ~90% (4,5) | ~90% (4,5) | T+1 (4) | 3,6 (khi có) | Dùng được (khi có) | Cần nhận diện mẫu: từ khóa "lương" trong nội dung giao dịch, số tiền lặp lại hằng tháng. Nhiễu do thưởng lẫn vào. |
| F15 | Number of existing products | CBS | ~40-60% (2) | ~98% (5) | ~98% (5) | Real-time (5) | 4,3 (khi có) | Dùng được (khi có) | Dữ liệu hệ thống, rất chính xác. |
| F16 | CC utilization | CBS/CIC | ~20-30% (1) | ~85% (4) | ~80% (3,5) | T+1-14 (3) | 2,9 (khi có) | Có điều kiện | Chỉ áp dụng cho khách đã có thẻ; mức sử dụng tại CBS có thể khác CIC do độ trễ. |
| F17 | Geography | Địa chỉ CBS | ~85% (3,5) | ~70% (3) | ~60% (2) | Cũ (2) | 2,6 | Có điều kiện | Địa chỉ tự do là điểm khó lớn. Cần pipeline geocoding. Cấp tỉnh/thành đạt yêu cầu; cấp quận/huyện còn rủi ro. |
| F20 | eKYC confidence | eKYC | ~95% (4,5) | ~85% (4) | ~90% (4,5) | Real-time (5) | 4,5 | Dùng được | Đầu ra eKYC mới, theo thời gian thực, chất lượng cao; độ phủ cao do bắt buộc theo TT 45/2025. |
| F21 | Face match score | eKYC | ~95% (4,5) | ~80% (3,5) | ~90% (4,5) | Real-time (5) | 4,1 | Dùng được | Phù hợp phát hiện gian lận. Ảnh chất lượng kém hoặc người cao tuổi có tỷ lệ khớp thấp hơn. |

## 5. Tổng hợp theo nhóm biến

| Nhóm | Số biến | Điểm trung bình | Đánh giá |
|------|--------|----------------|---------|
| **Từ CIC** (F6, F7, F9, F10, F11) | 5 | 3,8 | Nhóm đáng tin cậy nhất. Giới hạn chính: độ phủ 71% (thin file). |
| **Nhân khẩu học CBS** (F1, F12, F15) | 3 | 4,4 (khi có) | Độ chính xác rất cao với khách hiện hữu. |
| **Hành vi CBS** (F3, F13, F14) | 3 | 3,7 (khi có) | Tốt nhưng chỉ cho khách hiện hữu nhận lương qua Bank X. |
| **Tự khai** (F2, F4, F5) | 3 | 2,3 | Nhóm yếu nhất: thu nhập khai cao, việc làm khó xác minh, nhà tuyển dụng chưa chuẩn hóa. |
| **eKYC** (F20, F21) | 2 | 4,3 | Mới, thời gian thực, chất lượng cao. |
| **Phái sinh** (F8 DTI, F16 CC utilization, F17 Geography) | 3 | 2,8 | Phụ thuộc chất lượng đầu vào. DTI chỉ tốt khi có thu nhập từ dữ liệu lương. |

### Bản đồ nhiệt tổng hợp

```
                  Completeness  Accuracy  Consistency  Timeliness  Tổng
CIC features      71%           90%       95%          T+14        3,8
CBS demographics  40-98%        95%       95%          RT          4,4*
CBS behavioral    35-50%        90%       85%          T+1         3,7*
Self-reported     85-95%        55%       45%          Cũ          2,3
eKYC              95%           82%       90%          RT          4,3

* Với khách hiện hữu. Khách mới của Bank X có độ đầy đủ bằng 0%.
RT = Real-time
```

Nhận xét chính:
1. Completeness là điểm nghẽn chính của dữ liệu CBS (chỉ khách hiện hữu) và CIC (độ phủ 71%).
2. Accuracy thấp nhất ở dữ liệu tự khai: thu nhập, thời gian làm việc, loại nhà tuyển dụng.
3. Timeliness tốt nhất ở eKYC (thời gian thực) và CBS (thời gian thực hoặc T+1); CIC trễ 1-2 tuần.
4. Consistency tốt nhất khi dữ liệu từ một nguồn duy nhất (CIC, eKYC); đối chiếu giữa các hệ thống (CBS và CIC) còn khó khăn.

---

## 6. Phân tầng biến và khuyến nghị

### 6.1 Phân tầng theo chất lượng

| Tầng | Biến | Điểm trung bình | Khuyến nghị |
|------|------|----------------|------------|
| **Tầng 1 — Cốt lõi, đáng tin cậy** | CIC Score, lịch sử DPD, số khoản vay, số lần tra cứu, điểm eKYC | 3,8-4,3 | Dùng cho mọi hồ sơ có dữ liệu CIC, trọng số cao |
| **Tầng 2 — Tốt khi có** | Tuổi, thời gian quan hệ, số dư trung bình, lương chuyển vào, số sản phẩm | 3,6-4,4 | Dùng cho khách hiện hữu; xử lý giá trị thiếu với khách mới |
| **Tầng 3 — Dùng thận trọng** | Thu nhập khai báo, DTI, địa lý, mức sử dụng thẻ | 2,5-3,0 | Cần làm sạch và đối chiếu chéo; giảm trọng số khi chưa xác minh thu nhập |
| **Tầng 4 — Chưa tin cậy** | Thời gian làm việc, loại nhà tuyển dụng | 2,1-2,2 | Cần bổ sung dữ liệu (xác minh BHXH, tra cứu ĐKKD) trước khi dùng; có thể loại nếu không cải thiện mô hình đáng kể |

### 6.2 Các hạng mục cải thiện chất lượng dữ liệu

| # | Hạng mục | Ưu tiên | Tác động | Nỗ lực |
|---|---------|---------|---------|--------|
| 1 | **Xác minh thu nhập qua dữ liệu lương**: nhận diện lương chuyển vào trong giao dịch CBS của khách hiện hữu | Cao | Độ chính xác thu nhập từ 60% lên 90% | Trung bình (nhận diện mẫu bằng NLP) |
| 2 | **Chuẩn hóa địa chỉ**: pipeline geocoding (văn bản tự do thành tỉnh/quận/phường) | Trung bình | Chất lượng biến địa lý từ 2,6 lên 4,0 | Trung bình (API geocoding bên thứ ba) |
| 3 | **Chuẩn hóa nhà tuyển dụng**: NLP và tra cứu ĐKKD | Trung bình | Độ chính xác từ 60% lên 80% | Cao (ĐKKD không có API) |
| 4 | **Chiến lược thin file**: mô hình thay thế cho hồ sơ không có CIC | Cao | Độ phủ từ 71% lên trên 90% | Cao (mô hình riêng) |
| 5 | **Giám sát độ mới dữ liệu**: cảnh báo tự động khi dữ liệu cũ vượt ngưỡng | Trung bình | Phát hiện dữ liệu cũ trước khi ảnh hưởng mô hình | Thấp (script giám sát) |
| 6 | **Phát hiện trùng lặp**: loại trùng khách hàng qua quá trình chuyển CMND sang CCCD | Trung bình | Uniqueness đạt trên 99% | Trung bình |
| 7 | **Đối soát chéo hệ thống**: khớp tên và ngày sinh giữa CBS và CIC | Thấp | Cải thiện consistency | Thấp (thuật toán khớp) |

### 6.3 Tác động đến thiết kế mô hình

| Phát hiện về chất lượng | Quyết định thiết kế mô hình |
|------------------------|----------------------------|
| Thu nhập tự khai không đáng tin (điểm 2,5) | Không dùng thu nhập khai báo làm biến duy nhất cho khả năng trả nợ; giảm trọng số khi chưa xác minh bằng dữ liệu lương; tạo cờ `income_verified`. |
| Độ phủ CIC 71% (thin file khoảng 29%) | Thiết kế 2 mô hình: (a) mô hình đầy đủ cho hồ sơ có CIC; (b) mô hình thin file dùng dữ liệu hành vi CBS và eKYC. |
| Dữ liệu hành vi CBS chỉ có với khách hiện hữu | Phân tích mức quan trọng biến tách riêng khách hiện hữu và khách mới; mô hình không phụ thuộc quá mức vào dữ liệu hành vi CBS. |
| Loại nhà tuyển dụng chưa chuẩn hóa (điểm 2,2) | Gom nhóm thô (SOE/FDI/Tư nhân/Khác) thay vì dùng tên; loại bỏ nếu đóng góp biên thấp. |
| Dữ liệu CIC trễ 1-2 tuần | Ghi rõ trong tài liệu mô hình: điểm tính tại thời điểm T nhưng dữ liệu CIC có thể cũ đến T-14 ngày; không tuyên bố chấm điểm thời gian thực. |
| eKYC chất lượng cao nhưng chỉ có kết quả đạt/không đạt kèm điểm | Dùng trực tiếp điểm eKYC cho mô hình gian lận; không cần dữ liệu sinh trắc gốc, phù hợp nguyên tắc tối thiểu hóa dữ liệu (PDPD). |

---

## 7. Phạm vi áp dụng

1. Các giá trị là ước tính; chất lượng dữ liệu thực tế phụ thuộc hệ thống của Bank X.
2. Độ phủ CIC 71% là số liệu toàn dân; với phân khúc thẻ có lương, độ phủ ước tính 80-85% do nhóm này đã có quan hệ tín dụng.
3. Dải điểm CIC được ghi nhận khác nhau tùy sản phẩm và nguồn (150-750 hoặc 300-850); mô hình chuẩn hóa điểm theo dải của sản phẩm CIC mà Bank X sử dụng.
4. Chất lượng dữ liệu tự khai (thu nhập, việc làm) là đặc điểm chung của ngân hàng Việt Nam; AI-CRDS được thiết kế để vận hành trong giới hạn này.
5. Tham chiếu: `w03-01-data-landscape-bank-x` (chi tiết nguồn dữ liệu), `w02-03-pdpd-impact-bank-x` (yêu cầu bảo vệ dữ liệu).
