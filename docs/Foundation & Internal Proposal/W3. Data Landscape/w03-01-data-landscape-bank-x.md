# Data Landscape Assessment — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) · **Khách hàng:** Bank X

---

## Mục đích

Tài liệu mô tả toàn bộ nguồn dữ liệu mà AI-CRDS sử dụng cho chấm điểm tín dụng thẻ (CC origination scoring) và phát hiện gian lận tại Bank X, kèm đánh giá mức sẵn sàng, chất lượng và khoảng trống của từng nguồn.

**Ký hiệu mức sẵn sàng:**
- Sẵn sàng: có thể sử dụng ngay
- Cần xử lý: có nhưng cần thêm công việc (API, quyền truy cập, định dạng, làm sạch)
- Không có: nguồn chưa tồn tại, cần phương án thay thế

**Lưu ý về số liệu:** Thông tin hệ thống và các tỷ lệ (độ phủ, thời gian phản hồi, chi phí) trong tài liệu là giả định lập kế hoạch dựa trên thực tiễn ngân hàng thương mại Việt Nam. Các giá trị này sẽ được thay bằng số liệu thực của Bank X khi có.

---

## PHẦN A — NGUỒN DỮ LIỆU NỘI BỘ

### 1. Core Banking System (CBS)

| Mục | Nội dung |
|-----|---------|
| **Loại hệ thống** | Core banking thương mại của Bank X. Các nền tảng phổ biến tại Việt Nam gồm Temenos T24, Oracle Flexcube, FIS Profile, Infosys Finacle. |
| **Dữ liệu trong CBS** | Hồ sơ khách hàng (nhân khẩu học, KYC), lịch sử tài khoản, sản phẩm đang sử dụng (tiết kiệm, vay, thẻ), lịch sử giao dịch, thời gian quan hệ, xếp hạng nội bộ |
| **Mức sẵn sàng** | Cần xử lý. CBS là nguồn dữ liệu gốc về khách hàng; chất lượng dữ liệu và cách truy cập khác nhau theo từng trường. |

#### 1.1 Các trường dữ liệu từ CBS

| # | Trường dữ liệu | Mô tả | Dùng cho | Mức sẵn sàng | Lưu ý chất lượng |
|---|---------------|-------|---------|-------------|-----------------|
| 1 | Customer ID | Mã định danh khách hàng trong CBS | Đối chiếu, loại trùng | Sẵn sàng | Có thể trùng nếu lịch sử có sáp nhập hồ sơ |
| 2 | Full name | Họ tên khách hàng | Đối chiếu CIC, eKYC | Sẵn sàng | Không nhất quán dấu (Nguyễn / Nguyen) |
| 3 | CCCD/CMND | Số căn cước | Khóa chính, tra cứu CIC, eKYC | Sẵn sàng | Một số hồ sơ còn CMND 9 số chưa cập nhật CCCD 12 số |
| 4 | Date of birth | Ngày sinh | Biến tuổi, kiểm tra gian lận | Sẵn sàng | Định dạng không đồng nhất (DD/MM/YYYY và YYYY-MM-DD) |
| 5 | Gender | Giới tính | Chỉ dùng giám sát thiên lệch, không dùng chấm điểm | Sẵn sàng | |
| 6 | Address | Địa chỉ | Biến địa lý, kiểm tra gian lận | Cần xử lý | Văn bản tự do, chưa chuẩn hóa; cần phân tách và geocoding |
| 7 | Phone number | Số điện thoại | Liên hệ, xác minh SIM (TT 45) | Sẵn sàng | Có thể lỗi thời nếu khách đổi số |
| 8 | Email | Email | Liên hệ | Cần xử lý | Độ phủ thấp (khoảng 40-60% khách hàng có email) |
| 9 | Employer / occupation | Nơi làm việc | Biến ổn định việc làm | Cần xử lý | Thường không cập nhật khi đổi việc; do khách tự khai |
| 10 | Monthly income | Thu nhập khai báo | Biến chấm điểm cốt lõi | Cần xử lý | Khai tại thời điểm mở tài khoản, không tự cập nhật; cần đối chiếu sao kê lương |
| 11 | Existing products | Danh sách sản phẩm đang có | Tín hiệu quan hệ khách hàng | Sẵn sàng | |
| 12 | Account open date | Ngày mở tài khoản | Biến thời gian quan hệ | Sẵn sàng | |
| 13 | Account balance history | Lịch sử số dư | Xác minh thu nhập, độ ổn định | Cần xử lý | Cần tổng hợp (trung bình, nhỏ nhất, lớn nhất, độ lệch chuẩn) do khối lượng lớn |
| 14 | Transaction history | Lịch sử giao dịch | Chấm điểm hành vi, xác minh thu nhập | Cần xử lý | Khối lượng lớn, cần feature engineering; là dữ liệu cá nhân nhạy cảm theo NĐ 356, cần sự đồng ý riêng |
| 15 | Internal risk rating | Xếp hạng rủi ro nội bộ | Biến đầu vào nếu có | Cần xử lý | Định dạng phụ thuộc chính sách nội bộ |
| 16 | Previous CC history | Lịch sử thẻ tín dụng cũ | Hành vi trả nợ | Cần xử lý | Chỉ áp dụng cho khách hàng đã có thẻ |

#### 1.2 Phương thức truy cập

| Phương thức | Mô tả | Độ trễ | Mức sẵn sàng |
|------------|-------|--------|-------------|
| **Real-time API** | REST/SOAP API truy vấn CBS qua ESB hoặc API Gateway | Mili-giây đến giây | Sẵn sàng theo thiết kế |
| **Direct DB query** | Truy vấn trực tiếp cơ sở dữ liệu CBS | Giây | Không khuyến nghị cho môi trường vận hành vì ảnh hưởng hiệu năng CBS |
| **Batch export** | Xuất file hằng ngày hoặc hằng tuần | T+1 hoặc chậm hơn | Sẵn sàng, phù hợp dữ liệu lịch sử |
| **Data warehouse** | Truy vấn từ DWH hoặc data lake | Phút đến giờ | Sẵn sàng, phù hợp dữ liệu lịch sử |

**Phương án áp dụng cho AI-CRDS:** Real-time API cho các trường cần ngay tại thời điểm chấm điểm (hồ sơ khách hàng, sản phẩm đang có). Batch hoặc DWH cho dữ liệu lịch sử (lịch sử giao dịch, lịch sử số dư).

#### 1.3 Giả định thiết kế cho Bank X

- CBS cung cấp API qua lớp ESB/API Gateway cho các trường hồ sơ khách hàng.
- Dữ liệu lịch sử được lấy qua DWH hoặc batch export hằng ngày.
- Các vấn đề chất lượng đã biết (định dạng ngày, dấu tiếng Việt, địa chỉ tự do, CMND cũ) được xử lý trong lớp tiền xử lý của AI-CRDS.

---

### 2. Tích hợp CIC (Trung tâm Thông tin Tín dụng Quốc gia)

| Mục | Nội dung |
|-----|---------|
| **Tổ chức** | CIC, trực thuộc NHNN |
| **Vai trò** | Cung cấp lịch sử tín dụng, điểm tín dụng và dư nợ hiện tại của khách hàng tại tất cả tổ chức tín dụng |
| **Bắt buộc** | SBV yêu cầu tổ chức tín dụng tra cứu CIC trước khi cấp tín dụng |
| **Mức sẵn sàng** | Sẵn sàng. Mọi ngân hàng thương mại đều có kết nối CIC. |

#### 2.1 Các trường dữ liệu từ CIC

| # | Trường dữ liệu | Mô tả | Dùng cho | Chất lượng |
|---|---------------|-------|---------|-----------|
| 1 | CIC Score | Điểm tín dụng CIC | Biến chấm điểm cốt lõi | Chuẩn hóa |
| 2 | Credit history | Lịch sử vay và trả nợ tại tất cả tổ chức tín dụng | Biến chấm điểm cốt lõi | Tốt |
| 3 | Outstanding debt | Tổng dư nợ hiện tại | Tính DTI | Tốt |
| 4 | Number of credit facilities | Số khoản vay đang có | Kiểm tra mức nợ quá mức | Tốt |
| 5 | Delinquency history | Lịch sử chậm trả (DPD 30/60/90+) | Biến chấm điểm cốt lõi | Tốt |
| 6 | Number of inquiries | Số lần bị tra cứu CIC gần đây | Tín hiệu nhu cầu vay gấp | Tốt |
| 7 | Credit card utilization | Tỷ lệ sử dụng hạn mức thẻ hiện tại | Tín hiệu rủi ro | Có thể trễ T+1 |
| 8 | Group debt | Nợ liên đới (bảo lãnh) | Nghĩa vụ ẩn | Độ phủ chưa đầy đủ |

#### 2.2 Chi tiết tích hợp

| Mục | Nội dung |
|-----|---------|
| **Phương thức** | Web Service API tự động |
| **Thời gian phản hồi** | 5-30 giây qua API |
| **Độ phủ** | Khoảng 70-80% hồ sơ đăng ký có dữ liệu CIC (giả định). Khách hàng chưa từng vay không có dữ liệu, thuộc nhóm "thin file". |
| **Tần suất cập nhật** | Tổ chức tín dụng báo cáo CIC hằng tháng hoặc hằng ngày; dữ liệu có thể trễ 1-30 ngày. |
| **Chi phí** | Mỗi lượt tra cứu CIC có phí; chi phí được tính trong ngân sách vận hành (xem W4). |
| **Dự phòng** | Tự động thử lại tối đa 3 lần khi CIC phản hồi chậm; nếu vẫn lỗi, hồ sơ chuyển thẩm định thủ công kèm cờ "CIC unavailable". |

#### 2.3 Xử lý hồ sơ "Thin File"

Khách hàng không có dữ liệu CIC (ước tính 20-30% hồ sơ, là giả định lập kế hoạch):

| Tình huống | Cách xử lý |
|-----------|-----------|
| Chưa từng vay | Chấm điểm bằng dữ liệu thay thế: việc làm, thu nhập, lịch sử giao dịch tại ngân hàng (nếu là khách hàng hiện hữu) |
| Mới đến Việt Nam | Rất hiếm với phân khúc có lương; chuyển thẩm định thủ công |
| Dữ liệu CIC cũ (trên 6 tháng) | Gắn cờ cho cán bộ tín dụng; giảm trọng số điểm CIC trong mô hình |
| CIC timeout hoặc lỗi | Thử lại 3 lần; nếu vẫn lỗi, chuyển thẩm định thủ công kèm cờ "CIC unavailable" |

---

### 3. Hệ thống eKYC

| Mục | Nội dung |
|-----|---------|
| **Chức năng** | Xác minh danh tính khách hàng: đối chiếu CCCD, sinh trắc học khuôn mặt, nhận diện người thật (liveness) |
| **Cơ sở pháp lý** | TT 45/2025 yêu cầu đối chiếu sinh trắc khi phát hành thẻ; kênh số được xác thực sinh trắc trực tuyến. |
| **Mức sẵn sàng** | Sẵn sàng. eKYC bắt buộc theo TT 45 nên mọi ngân hàng đều triển khai. |

#### 3.1 Kết quả đầu ra của eKYC

| # | Trường | Mô tả | Dùng cho |
|---|-------|-------|---------|
| 1 | Identity verification result | Đạt / Không đạt | Điều kiện cửa (không đạt thì từ chối hoặc thẩm định thủ công) |
| 2 | Confidence score | 0-100% | Tín hiệu rủi ro gian lận |
| 3 | Liveness detection result | Đạt / Không đạt | Chống giả mạo |
| 4 | CCCD data extraction | OCR từ ảnh CCCD: tên, số CCCD, ngày sinh | Tự điền hồ sơ, đối chiếu CBS |
| 5 | Face match score | Đối chiếu khuôn mặt với ảnh CCCD | Phát hiện gian lận |
| 6 | Document authenticity | Thật / Giả / Nghi ngờ | Gian lận giấy tờ |

#### 3.2 Nhà cung cấp eKYC trên thị trường

| Nhà cung cấp | Đặc điểm |
|-------------|---------|
| VNPT | Kết nối trực tiếp cơ sở dữ liệu quốc gia của Bộ Công an; độ chính xác cao |
| FPT.AI | Phổ biến tại các ngân hàng |
| VNG / Zalo AI | Đang mở rộng, gắn với hệ sinh thái Zalo |
| Napas eKYC | Mới, liên kết với hạ tầng thanh toán quốc gia |
| Tự xây dựng | Một số ngân hàng lớn tự xây; kiểm soát tốt nhưng chi phí cao |

#### 3.3 Thiết kế tích hợp eKYC với AI-CRDS

AI-CRDS không lưu dữ liệu sinh trắc học gốc. Hệ thống chỉ nhận kết quả từ nhà cung cấp eKYC:

```
eKYC Provider
    |
    |  [Dữ liệu sinh trắc gốc được xử lý tại nhà cung cấp eKYC]
    |
    v
AI-CRDS nhận:
- identity_verified: true/false
- confidence_score: 0.95
- liveness_passed: true/false
- face_match_score: 0.92
- document_authentic: true/false
- extracted_data: {name, cccd, dob} (chỉ để đối chiếu)
```

**Lý do:** Nguyên tắc tối thiểu hóa dữ liệu (Luật BVDLCN). AI-CRDS không cần dữ liệu sinh trắc gốc để chấm điểm; kết quả đạt/không đạt kèm điểm tin cậy là đủ cho lớp phát hiện gian lận.

---

### 4. Hệ thống chấm điểm hiện có

| Mục | Nội dung |
|-----|---------|
| **Loại** | Hệ thống chấm điểm hiện hữu của Bank X, một trong các dạng: (a) bộ quy tắc if-then, (b) scorecard thống kê, (c) giải pháp vendor (FICO, Experian), (d) mô hình ML nội bộ, (e) thẩm định thủ công hoàn toàn |
| **Mức sẵn sàng** | Cần xử lý. Cách tích hợp phụ thuộc loại hệ thống hiện có. |

#### 4.1 Chiến lược theo từng loại hệ thống

| Loại hệ thống | Tác động lên AI-CRDS | Chiến lược |
|--------------|---------------------|-----------|
| **(a) Scorecard trưởng thành** | Có chuẩn so sánh và dữ liệu hiệu năng lịch sử; dễ triển khai Champion-Challenger | AI-CRDS chạy song song (shadow mode) và so sánh với scorecard hiện tại |
| **(b) Bộ quy tắc đơn giản** | Có đường cơ sở nhưng chưa có mô hình thống kê | AI-CRDS thay thế bộ quy tắc; dùng dữ liệu lịch sử để huấn luyện |
| **(c) Giải pháp vendor** | Cần hiểu định dạng đầu ra của vendor, tránh phụ thuộc | AI-CRDS bổ trợ, chưa thay thế ngay |
| **(d) Chưa có chấm điểm** | Không có chuẩn so sánh, không có dữ liệu hiệu năng; bài toán khởi tạo | Dùng dữ liệu tổng hợp hoặc chuẩn ngành; triển khai thận trọng theo giai đoạn |

#### 4.2 Thông tin cần thu thập từ hệ thống chấm điểm hiện có

| Nhóm thông tin | Nội dung |
|---------------|---------|
| Mô hình | Loại mô hình, danh sách biến đang dùng, đơn vị phát triển, lần cập nhật gần nhất |
| Đầu ra | Dải điểm, các nhóm quyết định |
| Hiệu năng | Gini, KS, AUC; tỷ lệ phê duyệt; NPL theo vintage; tỷ lệ override của cán bộ tín dụng |

---

### 5. Dữ liệu tín dụng lịch sử

| Mục | Nội dung |
|-----|---------|
| **Vai trò** | Dữ liệu huấn luyện cho mô hình ML; là yếu tố quyết định chất lượng mô hình |
| **Mức sẵn sàng** | Cần xử lý. Độ sâu dữ liệu phụ thuộc quy mô danh mục thẻ của Bank X. |

#### 5.1 Yêu cầu dữ liệu cho huấn luyện mô hình

| Yêu cầu | Tối thiểu | Lý tưởng | Lý do |
|---------|----------|---------|-------|
| **Độ sâu vintage** | 2 năm | 5 năm trở lên | Cần ít nhất một chu kỳ tín dụng đầy đủ; 5 năm trở lên bao phủ các chu kỳ kinh tế (như COVID) |
| **Kích thước mẫu** | 10.000 bản ghi có nhãn | 50.000 trở lên | Logistic regression: 10.000 là đủ. Gradient boosting: 50.000 trở lên tốt hơn. Deep learning: 100.000 trở lên. |
| **Định nghĩa default** | DPD 90+ | Theo Basel II | DPD 90+ là chuẩn phổ biến |
| **Chất lượng nhãn** | Nhị phân Default / Non-default | Thêm write-off, tỷ lệ thu hồi | Nhãn nhị phân là tối thiểu; thêm các mức DPD 30/60/90/write-off sẽ tốt hơn |
| **Mất cân bằng lớp** | Tỷ lệ default 2-8% (đặc trưng thẻ tín dụng) | Không áp dụng | Tỷ lệ default thẻ tại Việt Nam ước tính 3-6%; xử lý bằng SMOTE, undersampling hoặc cost-sensitive learning |
| **Độ đầy đủ biến** | Trên 80% giá trị không rỗng với biến cốt lõi | Trên 95% | Thiếu trên 20% thì biến có thể không dùng được |

#### 5.2 Khung đánh giá chất lượng dữ liệu

| # | Tiêu chí | Câu hỏi đánh giá |
|---|---------|-----------------|
| 1 | **Completeness** | Bao nhiêu phần trăm bản ghi có đủ biến cốt lõi? |
| 2 | **Accuracy** | Dữ liệu có khớp với nguồn gốc (CIC, eKYC) không? |
| 3 | **Consistency** | Định dạng có nhất quán giữa các năm không (ngày, tiền tệ, mã hóa)? |
| 4 | **Timeliness** | Tần suất cập nhật và tỷ lệ dữ liệu cũ? |
| 5 | **Uniqueness** | Có bản ghi trùng, khách hàng trùng không? |
| 6 | **Validity** | Giá trị có nằm trong khoảng hợp lệ không? Có ngoại lệ không? |

Ngưỡng sử dụng cho huấn luyện mô hình: điểm tổng hợp từ 3,5/5 trở lên. Kết quả đánh giá chi tiết xem tại `w03-02-data-quality-scorecard`.

#### 5.3 Giả định thiết kế cho Bank X

- Bank X có tối thiểu 2 năm dữ liệu thẻ tín dụng, gồm cả hồ sơ được duyệt và bị từ chối.
- Định nghĩa default áp dụng là DPD 90+.
- Với hồ sơ bị từ chối, áp dụng kỹ thuật reject inference để giảm thiên lệch do chỉ huấn luyện trên hồ sơ được duyệt.
- Dữ liệu được lưu tại CBS và DWH, xuất được dưới dạng file có cấu trúc.

---

## PHẦN B — NGUỒN DỮ LIỆU BÊN NGOÀI

### 6. Dữ liệu CIC (góc nhìn bên ngoài)

Chi tiết xem Mục 2. Tóm tắt:

| Mục | Nội dung |
|-----|---------|
| **Loại điểm** | CIC Score, Credit History Report, Debt Summary Report |
| **Độ sâu lịch sử** | Tối đa 5 năm, tùy dữ liệu sẵn có |
| **Tần suất cập nhật** | Tổ chức tín dụng báo cáo hằng tháng hoặc hằng ngày; dữ liệu có thể trễ 1-30 ngày |
| **Mức sẵn sàng** | Sẵn sàng; bắt buộc với mọi tổ chức tín dụng. Qua API hoặc cổng tra cứu. |
| **Giới hạn** | Chỉ bao phủ tín dụng chính thức; không bao phủ cho vay phi chính thức, mua trước trả sau |

---

### 7. Dữ liệu cơ quan nhà nước

| # | Nguồn | Cơ quan | Nội dung | Dùng cho | Mức sẵn sàng | Ghi chú |
|---|------|--------|---------|---------|-------------|--------|
| 7.1 | **Xác minh CCCD** | Bộ Công an | Đối chiếu CCCD qua cơ sở dữ liệu quốc gia về dân cư | Xác minh danh tính, phát hiện gian lận | Cần xử lý. Thực hiện qua nhà cung cấp eKYC (VNPT kết nối trực tiếp). Ngân hàng không truy vấn trực tiếp. | Đã bao gồm trong eKYC (Mục 3) |
| 7.2 | **Dữ liệu thuế** | Tổng cục Thuế | Thuế TNCN, thu nhập khai thuế | Xác minh thu nhập | Không có. Tổ chức tín dụng không truy vấn trực tiếp; khách hàng có thể cung cấp tờ khai. | Chỉ dùng thủ công khi khách cung cấp |
| 7.3 | **Bảo hiểm xã hội** | BHXH Việt Nam | Đóng BHXH, xác minh việc làm và thu nhập | Xác minh việc làm, đối chiếu thu nhập | Hạn chế. Ứng dụng VssID cho tra cứu cá nhân; chưa có API cho tổ chức tín dụng. Có thể lấy qua sự đồng ý của khách hàng. | Nguồn tiềm năng cho các phiên bản sau |
| 7.4 | **Đăng ký kinh doanh** | Sở KH&ĐT | Đăng ký doanh nghiệp | Xác minh nơi làm việc tồn tại | Cần xử lý. Tra cứu trực tuyến tại dangkykinhdoanh.gov.vn, chưa có API chính thức. | Dùng cho kiểm tra gian lận |
| 7.5 | **Hồ sơ tòa án** | Tòa án | Bản án, quyết định thi hành án | Rủi ro pháp lý, gian lận | Không có API. Tra cứu thủ công tại congbobanan.toaan.gov.vn; độ phủ thấp. | Không phù hợp chấm điểm tự động |

---

### 8. Dữ liệu thay thế (Alternative Data)

| # | Nguồn | Nội dung | Dùng cho | Mức sẵn sàng | Chất lượng | Vấn đề pháp lý |
|---|------|---------|---------|-------------|-----------|---------------|
| 8.1 | **Dữ liệu viễn thông** | Mẫu gọi/SMS, dữ liệu sử dụng, nạp tiền, loại hợp đồng | Đại diện rủi ro tín dụng cho khách thin file | Không có trực tiếp. Các nhà mạng chưa có thỏa thuận chia sẻ dữ liệu chuẩn cho chấm điểm tín dụng. | Nhiễu, có rủi ro quyền riêng tư | NĐ 356: dữ liệu viễn thông là nhạy cảm; cần sự đồng ý riêng. Cơ chế sandbox theo NĐ 94 có thể cho phép. |
| 8.2 | **Thanh toán tiện ích** | Lịch sử thanh toán điện, nước, internet | Đại diện kỷ luật thanh toán | Không có. Các đơn vị cung cấp chưa có API cho tổ chức tín dụng. | Độ phủ thấp | Cần sự đồng ý |
| 8.3 | **Thương mại điện tử** | Lịch sử mua hàng, tỷ lệ hoàn trả, mẫu chi tiêu | Tín hiệu hành vi | Không có. Các sàn không chia sẻ dữ liệu với ngân hàng. | Chưa đánh giá | Rủi ro quyền riêng tư lớn |
| 8.4 | **Mạng xã hội** | Hồ sơ, kết nối, hoạt động | Phát hiện gian lận, xác minh danh tính | Không sử dụng | Không áp dụng | NĐ 356: dữ liệu hành vi trực tuyến là nhạy cảm. Luật AI 134/2025: không phân biệt đối xử. Chấm điểm bằng mạng xã hội có rủi ro thiên lệch rất cao. |
| 8.5 | **Dữ liệu thiết bị/trình duyệt** | Device fingerprint, IP, vị trí | Phát hiện gian lận (không dùng chấm điểm) | Cần xử lý. Thu thập được khi khách đăng ký trực tuyến. | Đạt yêu cầu cho gian lận | Chỉ dùng cho phát hiện gian lận, không dùng chấm điểm tín dụng; cần sự đồng ý |
| 8.6 | **Dữ liệu lương** | Sao kê lương tại ngân hàng (khách hàng hiện hữu nhận lương qua Bank X) | Xác minh thu nhập, nguồn tốt nhất | Có điều kiện. Chỉ có khi khách nhận lương qua Bank X. | Rất tốt | Là dữ liệu nội bộ với khách hàng hiện hữu; có giá trị cao với phân khúc có lương |

**Kết luận về dữ liệu thay thế:** Phần lớn nguồn chưa sẵn sàng hoặc có rủi ro pháp lý và chất lượng. AI-CRDS phiên bản đầu tập trung vào dữ liệu truyền thống (CBS, CIC, eKYC và dữ liệu lương khi có). Dữ liệu thay thế chỉ được xem xét khi mô hình phiên bản đầu đã chứng minh hiệu quả và có khung sandbox phù hợp.

---

## PHẦN C — MA TRẬN BIẾN SỐ

Tổng hợp biến số cho chấm điểm cấp thẻ tín dụng phân khúc có lương. Ma trận đầy đủ xem tại `w03-03-feature-availability-matrix`.

### Biến cốt lõi

| # | Biến | Nguồn | Kiểu | Mức sẵn sàng | Ưu tiên |
|---|------|------|------|-------------|---------|
| F1 | Age | CBS (DOB) | Số | Sẵn sàng | Cốt lõi |
| F2 | Monthly income (declared) | Hồ sơ đăng ký | Số | Sẵn sàng | Cốt lõi |
| F3 | Income verified (payroll) | Giao dịch CBS / bảng lương | Số | Chỉ khách hàng hiện hữu nhận lương qua Bank X | Cốt lõi khi có |
| F4 | Employment tenure | Hồ sơ đăng ký | Số (tháng) | Cần xử lý, do khách tự khai | Cốt lõi |
| F5 | Employer type | Hồ sơ đăng ký | Phân loại | Cần chuẩn hóa (SOE / FDI / Private / ...) | Cốt lõi |
| F6 | CIC Score | CIC API | Số | Sẵn sàng | Cốt lõi |
| F7 | Total outstanding debt | CIC | Số | Sẵn sàng | Cốt lõi |
| F8 | Debt-to-Income ratio | Tính toán (F7 / F2) | Số | Biến phái sinh | Cốt lõi |
| F9 | Number of active loans | CIC | Số | Sẵn sàng | Cốt lõi |
| F10 | Max DPD last 12 months | CIC | Số | Sẵn sàng | Cốt lõi |
| F11 | Number of CIC inquiries (6M) | CIC | Số | Sẵn sàng | Cốt lõi |
| F12 | Relationship tenure (bank) | CBS (ngày mở tài khoản) | Số (tháng) | Sẵn sàng với khách hiện hữu; bằng 0 với khách mới | Cốt lõi |

### Biến bổ trợ

| # | Biến | Nguồn | Kiểu | Mức sẵn sàng | Ưu tiên |
|---|------|------|------|-------------|---------|
| F13 | Average account balance (3M) | CBS | Số | Chỉ khách hàng hiện hữu | Bổ trợ |
| F14 | Salary credit frequency | Giao dịch CBS | Số | Khách hiện hữu nhận lương qua Bank X | Bổ trợ |
| F15 | Number of existing bank products | CBS | Số | Khách hàng hiện hữu | Bổ trợ |
| F16 | CC utilization (existing CC) | CBS / CIC | Phần trăm | Khi có thẻ hiện tại | Bổ trợ |
| F17 | Geography (district/city) | Địa chỉ CBS | Phân loại | Cần geocoding từ địa chỉ tự do | Bổ trợ |
| F18 | Education level | Hồ sơ đăng ký | Phân loại | Cần xử lý, nhiều trường hợp không thu thập | Bổ trợ |
| F19 | Marital status | Hồ sơ đăng ký | Phân loại | Cần xử lý, do khách tự khai | Bổ trợ |
| F20 | eKYC confidence score | Nhà cung cấp eKYC | Số | Sẵn sàng | Biến gian lận |
| F21 | eKYC face match score | Nhà cung cấp eKYC | Số | Sẵn sàng | Biến gian lận |
| F22 | Device fingerprint | Đăng ký trực tuyến | Phân loại | Chỉ kênh trực tuyến | Biến gian lận |

### Thuộc tính được bảo vệ (chỉ giám sát thiên lệch, không dùng chấm điểm)

| # | Thuộc tính | Nguồn | Mục đích giám sát |
|---|-----------|------|-------------------|
| P1 | Gender | CBS | Tỷ lệ phê duyệt ngang nhau giữa các giới |
| P2 | Geography (province) | CBS | Kiểm tra thiên lệch thành thị và nông thôn |
| P3 | Age group | CBS | Kiểm tra phân biệt đối xử theo tuổi |

---

## PHẦN D — CHIẾN LƯỢC DỮ LIỆU TỔNG HỢP

### Khi nào dùng dữ liệu tổng hợp

| Tình huống | Dùng dữ liệu tổng hợp | Cách tiếp cận |
|-----------|---------------------|--------------|
| Chưa có dữ liệu lịch sử | Có | Sinh bộ dữ liệu tổng hợp mô phỏng phân phối ngân hàng Việt Nam |
| Trình diễn, thuyết trình nội bộ | Có | Dữ liệu tổng hợp thực tế, không phải dữ liệu khách hàng thật, tuân thủ PDPD |
| Phát triển, kiểm thử mô hình | Tùy trường hợp | Ưu tiên dữ liệu thật đã ẩn danh; dùng dữ liệu tổng hợp khi chưa có |
| Huấn luyện mô hình vận hành | Không | Bắt buộc dùng dữ liệu thật đã ẩn danh hoặc giả danh hóa |

### Nguyên tắc dữ liệu tổng hợp

1. Đặc tính thống kê phải khớp thị trường Việt Nam: phân phối thu nhập, tỷ lệ default (khoảng 3-6% với thẻ), phân phối tuổi, phân phối địa lý.
2. Không dùng dữ liệu tổng hợp để huấn luyện mô hình vận hành; chỉ dùng cho trình diễn, kiểm thử và phát triển.
3. Mọi đầu ra gắn nhãn "SYNTHETIC DATA — NOT REAL CUSTOMERS".
4. Định dạng khớp dữ liệu thật để mã và pipeline tái sử dụng khi chuyển sang dữ liệu thật.

Kế hoạch chi tiết xem tại `w03-04-synthetic-data-plan`.

---

## PHẦN E — KHOẢNG TRỐNG DỮ LIỆU VÀ KHUYẾN NGHỊ

| # | Khoảng trống | Mức độ | Tác động | Biện pháp |
|---|-------------|-------|---------|----------|
| G1 | Độ sâu dữ liệu lịch sử | Cao | Không đủ dữ liệu thì mô hình kém hiệu quả | Bảo đảm tối thiểu 2 năm; nếu thiếu, bổ sung dữ liệu hoặc áp dụng transfer learning |
| G2 | Xác minh thu nhập yếu | Trung bình | Thu nhập tự khai không đáng tin | Đối chiếu dữ liệu lương (với khách hiện hữu), dư nợ CIC, số dư tài khoản |
| G3 | Địa chỉ chưa chuẩn hóa | Trung bình | Biến địa lý không dùng được | Xây dựng pipeline phân tách và geocoding địa chỉ |
| G4 | Thin file (khoảng 20-30% hồ sơ) | Cao | Không có dữ liệu CIC để chấm điểm | Mô hình thay thế cho nhóm thin file, dựa trên dữ liệu CBS và eKYC |
| G5 | Phương thức tích hợp CIC | Trung bình | Tra cứu thủ công gây nghẽn | Sử dụng API tự động |
| G6 | Reject inference | Trung bình | Thiên lệch do chỉ huấn luyện trên hồ sơ được duyệt | Áp dụng kỹ thuật reject inference và theo dõi thiên lệch |
| G7 | Dữ liệu thay thế chưa có | Thấp | Chấm điểm thin file bị hạn chế | Phiên bản đầu tập trung dữ liệu truyền thống; xem xét dữ liệu thay thế qua sandbox ở phiên bản sau |
| G8 | Chất lượng dữ liệu | Cao | Dữ liệu kém dẫn đến mô hình kém | Kiểm toán chất lượng dữ liệu trước khi huấn luyện theo khung ở Mục 5.2 |

---

## Phạm vi và tuân thủ

1. Dữ liệu thay thế (viễn thông, thương mại điện tử) chưa phù hợp để chấm điểm thẻ tín dụng tại Việt Nam; AI-CRDS tập trung dữ liệu truyền thống.
2. Dữ liệu mạng xã hội không được sử dụng do rủi ro thiên lệch, quyền riêng tư và pháp lý (NĐ 356 và Luật AI 134/2025).
3. Chất lượng dữ liệu là rủi ro lớn nhất của mô hình; kiểm toán chất lượng dữ liệu được thực hiện trước khi huấn luyện.
4. Mọi dữ liệu từ CBS, CIC và eKYC đều cần sự đồng ý của khách hàng theo quy định bảo vệ dữ liệu cá nhân (xem `w02-03-pdpd-impact-bank-x`).
5. Tham chiếu: `w02-03-pdpd-impact-bank-x` (kiểm kê dữ liệu, đồng ý), `w02-04-sbv-requirements` (nhật ký kiểm toán, yêu cầu CIC), `w02-01-regulatory-mapping` (TT 45 eKYC, NĐ 94 sandbox).
