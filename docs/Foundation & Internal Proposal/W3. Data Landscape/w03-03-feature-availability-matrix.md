# Feature Availability Matrix — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) · **Khách hàng:** Bank X

---

## Mục đích

Ánh xạ từng biến số cần cho mô hình chấm điểm và phát hiện gian lận của AI-CRDS sang mức sẵn sàng, nguồn, chất lượng và ưu tiên. Ma trận là căn cứ cho quyết định thiết kế mô hình: biến nào dùng ngay, biến nào cần xử lý, biến nào loại bỏ.

**Lưu ý về số liệu:** Điểm chất lượng và tỷ lệ độ phủ là ước tính từ `w03-02-data-quality-scorecard`, được dùng làm giả định lập kế hoạch cho Bank X và sẽ được thay bằng số liệu đo trên dữ liệu thực khi có.

**Mức sẵn sàng:**
- Sẵn sàng: dùng được ngay
- Cần xử lý: có nhưng cần thêm công việc (làm sạch, API, quyền truy cập)

**Chất lượng** (theo `w03-02-data-quality-scorecard`):
- Cao (từ 3,5): đáng tin cậy, dùng cho mô hình
- Trung bình (2,5 đến 3,4): dùng được sau khi làm sạch hoặc bổ sung
- Thấp (dưới 2,5): cần xử lý trước khi dùng

**Ưu tiên:**
- Bắt buộc: mô hình không chạy được nếu thiếu
- Nên có: cải thiện mô hình đáng kể
- Có thì tốt: cải thiện biên, có thể bỏ

---

## NHÓM 1 — ĐỊNH DANH VÀ KYC

| # | Biến | Mức sẵn sàng | Nguồn | Chất lượng | Ưu tiên | Độ trễ | Ghi chú |
|---|------|-------------|------|-----------|---------|--------|--------|
| 1.1 | **CCCD verified** | Sẵn sàng | Nhà cung cấp eKYC (VNPT/FPT/VNG) | Cao (4,5) | Bắt buộc | Real-time | TT 45/2025 yêu cầu đối chiếu sinh trắc khi phát hành thẻ. Đầu ra: đạt/không đạt kèm điểm tin cậy. AI-CRDS nhận kết quả, không lưu dữ liệu sinh trắc gốc. |
| 1.2 | **Age** | Sẵn sàng | CBS (DOB) / OCR eKYC | Cao (4,5) | Bắt buộc | Real-time | DOB từ CBS hoặc OCR CCCD, đối chiếu hai nguồn. Mô hình dùng tuổi (số), không dùng DOB trực tiếp. |
| 1.3 | **Gender** | Sẵn sàng | CBS / eKYC | Cao | Chỉ giám sát thiên lệch | Real-time | Không dùng làm biến chấm điểm. Chỉ dùng để giám sát thiên lệch (Luật AI 134/2025 Điều 4: không phân biệt đối xử): ghi nhận giới tính, theo dõi tỷ lệ phê duyệt theo giới, cảnh báo khi chênh lệch vượt ngưỡng. |
| 1.4 | **Address (province/city)** | Cần xử lý | CBS | Trung bình (2,6) | Nên có | Cũ | Văn bản tự do trong CBS nên cần pipeline geocoding để rút trích tỉnh/thành. Độ chính xác cấp tỉnh khoảng 80%, cấp quận khoảng 60%; nhiều khách không cập nhật khi chuyển nhà. Cần xây dựng pipeline chuẩn hóa địa chỉ. |
| 1.5 | **Phone verified** | Sẵn sàng | eKYC và kiểm tra theo TT 45/2025 | Cao (4,5) | Bắt buộc | Real-time | TT 45/2025 yêu cầu xác minh số điện thoại chính chủ; nhà cung cấp eKYC thực hiện. Đầu ra: đã xác minh/chưa xác minh. |

Tóm tắt nhóm 1: 4/5 biến sẵn sàng; địa chỉ cần pipeline geocoding. Nhóm này chủ yếu phục vụ xác minh danh tính và cổng chặn gian lận, không phải biến chấm điểm cốt lõi.

---

## NHÓM 2 — NĂNG LỰC TÀI CHÍNH

| # | Biến | Mức sẵn sàng | Nguồn | Chất lượng | Ưu tiên | Độ trễ | Ghi chú |
|---|------|-------------|------|-----------|---------|--------|--------|
| 2.1 | **Monthly income (declared)** | Cần xử lý | Hồ sơ đăng ký | Thấp (2,5) | Bắt buộc | T+0 (tại thời điểm đăng ký) | Điểm yếu lớn nhất. Khách thường khai cao hơn thực tế 20-50%, không tự cập nhật. Cần đối chiếu dữ liệu lương (2.2) hoặc sao kê; không dùng thu nhập khai báo làm biến duy nhất cho khả năng trả nợ. |
| 2.2 | **Income verified (payroll)** | Cần xử lý | Lịch sử giao dịch CBS | Cao (3,6) khi có | Bắt buộc | T+1 | Nguồn tốt nhất để xác minh thu nhập. Nhận diện mẫu lương trong giao dịch CBS (số tiền lặp lại hằng tháng, từ khóa "lương/salary"). Giới hạn: chỉ có với khách hiện hữu nhận lương qua Bank X (khoảng 35-50% hồ sơ). Cần xây dựng thuật toán nhận diện lương (NLP trên nội dung giao dịch). |
| 2.3 | **Income source type** | Cần xử lý | Hồ sơ đăng ký và CBS | Trung bình | Nên có | T+0 | Làm công ăn lương / Tự doanh / Tự do / Hưu trí, do khách tự khai. Với phân khúc có lương, hầu hết là làm công ăn lương. Đối chiếu: nếu khai "làm công ăn lương" nhưng CBS không có khoản tiền vào định kỳ thì gắn cờ. |
| 2.4 | **Employment duration** | Cần xử lý | Hồ sơ đăng ký | Thấp (2,1) | Nên có | T+0 (cũ) | Do khách tự khai, rất khó xác minh; chưa có API BHXH. Biện pháp: đối chiếu độ dài lịch sử lương (nếu có): số tháng có lương chuyển vào là mức tối thiểu của thời gian làm việc. Nếu không xác minh được thì giảm trọng số. |
| 2.5 | **Employer type/size** | Cần xử lý | Hồ sơ đăng ký | Thấp (2,2) | Nên có | T+0 (cũ) | Văn bản tự do ("Cty ABC") nên cần chuẩn hóa bằng NLP. Phân loại: SOE / FDI / Tư nhân lớn / SME / Startup / Khác. Tra cứu ĐKKD (dangkykinhdoanh.gov.vn) có thể xác minh doanh nghiệp tồn tại nhưng chưa có API chính thức. Cần pipeline chuẩn hóa nhà tuyển dụng. |
| 2.6 | **Existing debt obligations** | Sẵn sàng | CIC API | Cao (3,6) | Bắt buộc | T+7-14 | Tổng dư nợ hiện tại tại mọi tổ chức tín dụng; CIC là nguồn gốc duy nhất. Độ trễ 1-2 tuần nên khách có thể vừa trả hoặc vừa vay thêm mà CIC chưa cập nhật. |
| 2.7 | **Debt-to-Income ratio** | Cần xử lý | Phái sinh (2.6 / 2.1 hoặc 2.2) | Trung bình (3,0) | Bắt buộc | Phái sinh | Chỉ tốt bằng đầu vào yếu nhất. DTI = tổng nợ / thu nhập tháng. Dùng thu nhập khai báo (2.1) thì kém tin cậy; dùng thu nhập từ dữ liệu lương (2.2) thì đáng tin. Thiết kế 2 biến thể: `dti_declared` và `dti_verified`, ưu tiên `dti_verified`. |

Tóm tắt nhóm 2: 1/7 biến sẵn sàng ngay (dư nợ hiện tại). Xác minh thu nhập là hạng mục lớn nhất; thu nhập tự khai (điểm 2,5) là mắt xích yếu nhất của toàn bộ bộ biến, nên xác minh qua dữ liệu lương là hạng mục bắt buộc xây dựng.

---

## NHÓM 3 — LỊCH SỬ TÍN DỤNG

| # | Biến | Mức sẵn sàng | Nguồn | Chất lượng | Ưu tiên | Độ trễ | Ghi chú |
|---|------|-------------|------|-----------|---------|--------|--------|
| 3.1 | **CIC Score** | Sẵn sàng | CIC API | Cao (3,8) | Bắt buộc | T+7-14 | Biến dự báo mạnh nhất về rủi ro tín dụng. Khoảng 71% dân số trưởng thành có dữ liệu CIC; với phân khúc thẻ có lương ước tính 80-85%. Khoảng 15-20% thin file cần mô hình chấm điểm thay thế. |
| 3.2 | **Number of existing credit products** | Sẵn sàng | CIC API | Cao (3,8) | Bắt buộc | T+7-14 | Số khoản vay/thẻ đang hoạt động. Tín hiệu nợ quá mức: gồm vay cá nhân, thẻ, thế chấp, vay ô tô và khác. |
| 3.3 | **Payment history (on-time/late)** | Sẵn sàng | CIC API | Cao (3,8) | Bắt buộc | T+7-14 | Lịch sử DPD: 0 / 30 / 60 / 90+. Biến phái sinh: DPD lớn nhất 12 tháng, số lần DPD 30+ trong 24 tháng, DPD hiện tại. Chỉ báo rủi ro tín dụng quan trọng nhất. |
| 3.4 | **NPL history** | Sẵn sàng | CIC API | Cao (3,8) | Bắt buộc | T+7-14 | Nhóm nợ CIC từ 1 (đủ tiêu chuẩn) đến 5 (có khả năng mất vốn). Từng có nợ nhóm 3-5 là tín hiệu xấu; CIC giữ nợ xấu tối thiểu 5 năm. Biến phái sinh: nhóm nợ cao nhất từ trước đến nay, nhóm nợ cao nhất trong 24 tháng. |
| 3.5 | **Number of inquiries (6M)** | Sẵn sàng | CIC API | Cao (4,1) | Bắt buộc | T+1-7 | Số lần bị tra cứu CIC trong 6 tháng. Tín hiệu nhu cầu vay gấp: nhiều lần tra cứu thường đi cùng rủi ro cao hơn. Độ chính xác rất cao vì tự ghi nhận. |
| 3.6 | **Length of credit history** | Sẵn sàng | CIC API | Cao (3,8) | Nên có | T+7-14 | Thời gian từ khoản vay đầu tiên đến nay; lịch sử dài cung cấp nhiều dữ liệu hơn cho dự báo. Biến phái sinh: số tháng từ khoản tín dụng đầu tiên. |

Tóm tắt nhóm 3: 6/6 biến sẵn sàng. CIC là nguồn đáng tin cậy nhất và là nền tảng của mô hình chấm điểm tín dụng. Giới hạn duy nhất là độ phủ CIC (thin file khoảng 15-20% với phân khúc thẻ có lương).

---

## NHÓM 4 — HÀNH VI (chỉ khách hàng hiện hữu)

| # | Biến | Mức sẵn sàng | Nguồn | Chất lượng | Ưu tiên | Độ trễ | Ghi chú |
|---|------|-------------|------|-----------|---------|--------|--------|
| 4.1 | **Avg monthly transaction volume** | Cần xử lý | Lịch sử giao dịch CBS | Cao (3,8) khi có | Nên có | T+1 | Tổng giá trị giao dịch hằng tháng (tiền vào và ra), đại diện mức hoạt động và thu nhập. Chỉ có với khách hiện hữu; khách mới bằng 0. Cần tổng hợp từ giao dịch gốc do khối lượng lớn. NĐ 356: giao dịch ngân hàng là dữ liệu cá nhân nhạy cảm nên cần sự đồng ý riêng. |
| 4.2 | **Salary deposit history** | Cần xử lý | Lịch sử giao dịch CBS | Cao (3,6) khi có | Nên có | T+1 | Nhận diện khoản tiền vào định kỳ hằng tháng, số tiền ổn định (±10%), từ khóa ("lương", "salary", tên nhà tuyển dụng). Đầu ra: `has_salary_deposit` (boolean), `salary_amount` (số), `salary_months` (đếm). Chỉ khoảng 35-50% hồ sơ; rất giá trị khi có vì là nguồn xác minh thu nhập tốt nhất. |
| 4.3 | **Account balance patterns** | Cần xử lý | Dữ liệu tài khoản CBS | Cao (3,8) khi có | Nên có | T+1 | Số dư trung bình 3 tháng, số dư nhỏ nhất 3 tháng, độ biến động (độ lệch chuẩn), mẫu số dư cuối tháng. Đại diện kỷ luật tiết kiệm và ổn định tài chính. Chỉ có với khách hiện hữu. |
| 4.4 | **Product usage breadth** | Sẵn sàng (khách hiện hữu) | CBS | Cao (4,3) khi có | Có thì tốt | Real-time | Số sản phẩm đang dùng: tiết kiệm, tiền gửi có kỳ hạn, bảo hiểm, đầu tư, internet banking, mobile banking. Nhiều sản phẩm phản ánh quan hệ sâu và rủi ro thấp hơn. Chỉ có ý nghĩa với khách hiện hữu. |

Tóm tắt nhóm 4: không có biến nào dùng được cho khách chưa có quan hệ với Bank X. Với khách hiện hữu, cả 4 biến đều dùng được sau khi xử lý. Nhóm này tạo lợi thế lớn cho chấm điểm khách hiện hữu nhưng mô hình không phụ thuộc quá mức do độ phủ thấp (khoảng 40-60% hồ sơ).

Thiết kế hai luồng chấm điểm:
- **Luồng A (khách hiện hữu):** mô hình đầy đủ gồm nhóm 1, 2, 3 và 4.
- **Luồng B (khách mới):** mô hình rút gọn gồm nhóm 1, 2 và 3.

---

## NHÓM 5 — TÍN HIỆU GIAN LẬN

| # | Biến | Mức sẵn sàng | Nguồn | Chất lượng | Ưu tiên | Độ trễ | Ghi chú |
|---|------|-------------|------|-----------|---------|--------|--------|
| 5.1 | **Device fingerprint** | Cần xử lý | Kênh đăng ký trực tuyến | Trung bình | Nên có | Real-time | Dấu vân tay trình duyệt/thiết bị khi đăng ký trực tuyến. Phát hiện: cùng một thiết bị nộp nhiều hồ sơ, thiết bị gian lận đã biết. Chỉ có ở kênh trực tuyến (không có ở quầy). Triển khai SDK fingerprinting (FingerprintJS hoặc tương đương). NĐ 356: cần sự đồng ý với dữ liệu thiết bị. |
| 5.2 | **Application velocity** | Cần xử lý | Hệ thống hồ sơ và lượt tra cứu CIC | Cao | Bắt buộc | Real-time / T+1-7 | Hai tín hiệu: (a) cùng thiết bị/IP nộp nhiều hồ sơ trong X giờ (thời gian thực, cần device fingerprint); (b) số lần tra cứu CIC tăng đột biến (T+1-7). Tốc độ nộp cao thường là gian lận hoặc nhu cầu vay gấp. Biến: `apps_same_device_24h`, `cic_inquiries_30d`. |
| 5.3 | **Blacklist check** | Cần xử lý | Blacklist nội bộ Bank X và SIMO (TT 45/2025) | Cao | Bắt buộc | Theo thiết kế tích hợp | (a) Blacklist nội bộ: danh sách khách hàng bị chặn trước đó, tích hợp qua API nội bộ. (b) SIMO: hệ thống báo cáo gian lận liên ngân hàng theo TT 45/2025, tích hợp theo thời gian thực. |
| 5.4 | **Document authenticity score** | Sẵn sàng | Nhà cung cấp eKYC | Cao (4,1) | Bắt buộc | Real-time | Đầu ra eKYC: giấy tờ thật/giả/nghi ngờ. Phát hiện: CCCD chỉnh sửa, CCCD photocopy, CCCD hết hạn. VNPT kết nối Bộ Công an nên độ chính xác cao. |
| 5.5 | **Biometric liveness check** | Sẵn sàng | Nhà cung cấp eKYC | Cao (4,5) | Bắt buộc | Real-time | Đầu ra eKYC: liveness đạt/không đạt. Phát hiện tấn công bằng ảnh, phát lại video, mặt nạ. TT 45/2025 bắt buộc. AI-CRDS nhận kết quả đạt/không đạt, không lưu dữ liệu sinh trắc. |
| 5.6 | **Name/DOB cross-check** | Cần xử lý | CBS, eKYC và CIC | Cao | Nên có | Real-time | Đối chiếu tên và ngày sinh giữa 3 hệ thống; không khớp là tín hiệu gian lận danh tính. Thách thức: dấu tiếng Việt ("Nguyễn" và "Nguyen"), tên thường gọi và tên pháp lý. Cần thuật toán fuzzy matching. |
| 5.7 | **IP geolocation** | Cần xử lý | Kênh đăng ký trực tuyến | Trung bình | Có thì tốt | Real-time | IP quy ra vị trí gần đúng. Tín hiệu: vị trí IP khác địa chỉ khai báo thì gắn cờ (không tự động từ chối). Người dùng VPN có nguy cơ báo sai. Chỉ ở kênh trực tuyến. |

Tóm tắt nhóm 5: 2/7 biến sẵn sàng ngay (tính xác thực giấy tờ, liveness). 5 biến cần triển khai thêm. Tín hiệu gian lận quan trọng nhưng nhiều biến cần xây dựng.

---

## TỔNG HỢP

### Theo mức sẵn sàng

| Mức | Số lượng | Tỷ lệ | Biến |
|-----|---------|-------|------|
| Sẵn sàng | 14 | 45% | Age, CCCD, phone, gender, dư nợ hiện tại, CIC score, số sản phẩm (CIC), lịch sử thanh toán, NPL, tra cứu, độ dài lịch sử, mức dùng sản phẩm, tính xác thực giấy tờ, liveness |
| Cần xử lý | 17 | 55% | Address, thu nhập khai báo, thu nhập xác minh, loại nguồn thu nhập, thời gian làm việc, nhà tuyển dụng, DTI, khối lượng giao dịch, lịch sử lương, mẫu số dư, device fingerprint, application velocity, blacklist/SIMO, đối chiếu tên/DOB, IP geo, xếp hạng nội bộ, lịch sử thẻ cũ |

### Theo ưu tiên

| Ưu tiên | Số lượng | Sẵn sàng | Cần xử lý |
|---------|---------|---------|----------|
| Bắt buộc | 16 | 10 | 6 |
| Nên có | 12 | 2 | 10 |
| Có thì tốt | 3 | 2 | 1 |

### Theo chất lượng (ước tính)

| Chất lượng | Số lượng | Biến |
|-----------|---------|------|
| Cao (từ 3,5) | 17 | Biến CIC (6), biến eKYC (4), nhân khẩu học CBS (3), hành vi CBS (3), tính xác thực giấy tờ |
| Trung bình (2,5-3,4) | 6 | Thu nhập khai báo, DTI, địa chỉ, device fingerprint, IP geo, CC utilization |
| Thấp (dưới 2,5) | 3 | Thời gian làm việc, loại nhà tuyển dụng, loại nguồn thu nhập (tự khai) |

---

## BẢN ĐỒ PHỤ THUỘC BIẾN

```
SCORING MODEL — Luồng biến

[Application Form]                [CIC API]                [eKYC]
- Income (declared)               - CIC Score              - CCCD verified
- Employer                        - Outstanding debt       - Liveness pass
- Employment tenure               - # active loans         - Doc authentic
- Address                         - Max DPD 12M            - Face match score
                                  - # inquiries 6M         - Confidence score
[CBS — chỉ khách hiện hữu]        - NPL history
- Age (DOB)                       - Credit length
- Relationship tenure
- Salary deposits
- Avg balance
- Txn volume
- # products
        \                |                /
         v               v               v
              +-----------------+
              |  FEATURE ENGINE |
              |  - Impute       |
              |  - Normalize    |
              |  - Bin          |
              |  - Derive (DTI) |
              +--------+--------+
                       |
          +------------+-------------+
          v            v             v
     SCORING       FRAUD         BIAS
     MODEL         MODEL         MONITOR
     Nhóm 1-4      Nhóm 5        Gender
                   + eKYC        Geography
                   + velocity    Age
          |            |             |
          v            v             v
     Risk Score    Fraud Flag    Bias Alert
     + Confidence  + Score       (khi chênh lệch)
     + Explanation
```

---

## CHIẾN LƯỢC XỬ LÝ GIÁ TRỊ THIẾU

Nhiều biến chỉ có với khách hiện hữu hoặc hồ sơ có CIC:

| Nhóm biến | Thiếu khi | Tỷ lệ (ước tính) | Chiến lược |
|-----------|----------|-----------------|-----------|
| Biến CIC (nhóm 3) | Thin file: khách chưa từng vay | 15-20% (phân khúc thẻ có lương) | Chuyển sang mô hình thin file (luồng B). Dùng dữ liệu hành vi CBS và eKYC nếu là khách hiện hữu; nếu là khách mới và thin file thì chuyển thẩm định thủ công. |
| Hành vi CBS (nhóm 4) | Khách chưa có quan hệ với Bank X | 40-60% | Mô hình không dùng biến nhóm 4 ở luồng này; dựa vào nhóm 1, 2 và 3. |
| Thu nhập từ dữ liệu lương (2.2) | Khách mới hoặc nhận lương qua ngân hàng khác | 50-65% | Dùng thu nhập khai báo (2.1) với trọng số thấp hơn; gắn cờ `income_verified = false`. |
| Thời gian làm việc (2.4) | Không khai hoặc khai sai | Khoảng 10% thiếu, khoảng 40% không chính xác | Điền trung vị nếu thiếu; giảm trọng số nếu chưa xác minh. |

Nguyên tắc: không điền giá trị thiếu cho biến CIC; nếu thiếu CIC thì chuyển sang mô hình riêng hoặc thẩm định thủ công. Điền trung vị hoặc yếu vị cho biến không trọng yếu (địa chỉ, việc làm).

---

## LỘ TRÌNH SẴN SÀNG BIẾN SỐ

### Ưu tiên 1

| # | Hạng mục | Tác động | Nỗ lực |
|---|---------|---------|--------|
| 1 | **Tích hợp CIC API** | Mở khóa nhóm 3, nền tảng của mô hình | Thấp |
| 2 | **Tích hợp nhà cung cấp eKYC và định dạng đầu ra** | Mở khóa biến gian lận nhóm 5 | Thấp |
| 3 | **Thuật toán nhận diện lương**: NLP trên nội dung giao dịch CBS | Độ chính xác xác minh thu nhập từ 60% lên 90% | Trung bình |

### Ưu tiên 2

| # | Hạng mục | Tác động | Nỗ lực |
|---|---------|---------|--------|
| 4 | **Pipeline chuẩn hóa địa chỉ**: văn bản tự do thành tỉnh/quận | Chất lượng biến địa lý từ 2,6 lên 4,0 | Trung bình |
| 5 | **Chuẩn hóa nhà tuyển dụng**: NLP và gom nhóm (SOE/FDI/Tư nhân/SME) | Chất lượng biến nhà tuyển dụng từ 2,2 lên 3,0 | Trung bình |
| 6 | **SDK device fingerprinting** cho kênh trực tuyến | Mở khóa biến gian lận 5.1, 5.2 | Trung bình |
| 7 | **Tích hợp SIMO** | Mở khóa kiểm tra blacklist 5.3 | Thấp |

### Ưu tiên 3

| # | Hạng mục | Tác động | Nỗ lực |
|---|---------|---------|--------|
| 8 | **Mô hình thin file**: chấm điểm thay thế cho khách không có CIC | Độ phủ từ 80% lên trên 95% | Cao |
| 9 | **Fuzzy matching tên/DOB**: đối chiếu CBS, eKYC và CIC | Cải thiện phát hiện gian lận | Trung bình |
| 10 | **Thiết kế chấm điểm 2 luồng**: khách hiện hữu và khách mới | Kiến trúc mô hình | Cao |

---

## Phạm vi và tuân thủ

1. Điểm chất lượng là ước tính từ `w03-02-data-quality-scorecard`.
2. Độ phủ biến hành vi (nhóm 4) phụ thuộc quy mô tập khách hàng hiện hữu của Bank X.
3. Dữ liệu thay thế (viễn thông, thương mại điện tử, mạng xã hội) đã được đánh giá tại `w03-01-data-landscape-bank-x` và không dùng cho phiên bản đầu; AI-CRDS tập trung dữ liệu truyền thống.
4. Giới tính, dân tộc, tôn giáo không dùng cho chấm điểm theo Luật AI 134/2025 Điều 4; giới tính chỉ dùng để giám sát thiên lệch.
5. Dữ liệu từ giao dịch CBS và CIC cần sự đồng ý rõ ràng của khách hàng cho mục đích chấm điểm tín dụng (xem `w02-03-pdpd-impact-bank-x`).
6. Tham chiếu: `w03-01-data-landscape-bank-x` (chi tiết nguồn dữ liệu), `w03-02-data-quality-scorecard` (đánh giá chất lượng), `w02-03-pdpd-impact-bank-x` (yêu cầu đồng ý).
