# Impact & ROI — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

> Số liệu trong tài liệu là giả định lập kế hoạch dựa trên benchmark thị trường, sẽ được thay bằng dữ liệu thực của Bank X khi có.

## 1. Lợi ích dự kiến: 26.64 tỷ VND/năm

AI-CRDS giảm thiệt hại ở cả 4 tầng của damage model. Các mức giảm dưới đây là kịch bản cơ sở (base case):

| Tầng thiệt hại | Hiện tại/năm | Mức giảm | Tiết kiệm/năm | Cơ chế |
|----------------|--------------|----------|---------------|--------|
| T1: Tổn thất tín dụng (NPL) | 26.46 tỷ | -20% | 5.29 tỷ | AI scoring chính xác hơn review thủ công, giảm phê duyệt nhầm hồ sơ xấu |
| T2: Tổn thất gian lận | 14.4 tỷ | -30% | 4.32 tỷ | Lớp phát hiện gian lận bằng AI (hiện chưa có), kết hợp velocity, thiết bị, eKYC, bất thường CIC |
| T3: Chi phí cơ hội (từ chối nhầm) | 51.84 tỷ | -30% | 15.55 tỷ | AI giảm tỷ lệ từ chối nhầm, khách hàng tốt được phê duyệt |
| T4: Chi phí vận hành | 2.95 tỷ | -50% | 1.48 tỷ | Nhu cầu CO từ 10 FTE xuống 4.3 FTE, review theo lô 3-5 phút thay vì 35 phút |
| **Tổng** | **95.65 tỷ** | | **26.64 tỷ** | |

Tổng thiệt hại baseline dùng nhất quán 95.65 tỷ/năm (làm tròn khoảng 96 tỷ/năm).

### Nguồn tiết kiệm lớn nhất: T3 Chi phí cơ hội (15.55 tỷ/năm)

Thiệt hại lớn nhất của Bank X không phải nợ xấu mà là từ chối nhầm khách hàng tốt. Mỗi khách hàng tốt bị từ chối làm mất 36M VND giá trị vòng đời (lãi, phí, interchange trong 3 năm). Tỷ lệ chi phí FP/FN là 29.4:1.

AI scoring nhất quán, không phụ thuộc cá nhân CO, nên tỷ lệ từ chối nhầm giảm từ 10% xuống khoảng 7%, tương ứng 15.55 tỷ/năm doanh thu thu hồi.

---

## 2. Đầu tư

### Giải ngân theo giai đoạn

| Giai đoạn | Ngân sách | Thời gian | Điều kiện |
|-----------|-----------|-----------|-----------|
| Giai đoạn 0 (đề xuất phê duyệt) | 365M VND | 8 tuần | Phê duyệt ngay, rủi ro rất thấp |
| Giai đoạn 1 | 1.32 tỷ | 16 tuần | Chỉ khi Giai đoạn 0 đạt |
| Giai đoạn 2 | 2-4 tỷ/năm | Liên tục | Chỉ khi Giai đoạn 1 đạt |

### Chi tiết ngân sách Giai đoạn 0 (365M VND)

| Hạng mục | Chi phí | Ghi chú |
|----------|---------|---------|
| Senior Data Scientist (hợp đồng, 8 tuần) | 160M | Dẫn dắt phát triển mô hình |
| Quản lý dự án (nội bộ, 50%) | 72M | Nhân sự hiện hữu |
| Hạ tầng (cloud, công cụ phát triển) | 48M | Cloud trong nước, PostgreSQL, monitoring |
| Hỗ trợ tích hợp IT (nội bộ, 20%) | 45M | Đánh giá CBS/CIC/eKYC |
| Dự phòng (10%) | 40M | |
| **Tổng** | **365M** | 2.8 FTE-equivalent, 8 tuần |

### Mức thiệt hại tối đa

Nếu Giai đoạn 0 không đạt, dự án dừng và chi phí đã chi là 365M VND:

- Bằng 0.38% thiệt hại hằng năm (95.65 tỷ).
- Bằng 1.4% mức tiết kiệm hằng năm nếu thành công (26.64 tỷ).
- Tương đương khoảng 1.5 ngày thiệt hại hiện tại.

---

## 3. Phân tích ROI

### Thời điểm hòa vốn

| Kịch bản | Hòa vốn | Giả định |
|----------|---------|----------|
| Lạc quan | Tháng 6 | Mức giảm nhanh hơn base 30-40% |
| Cơ sở | Tháng 11 | Mức giảm như dự kiến (T1 -20%, T2 -30%, T3 -30%, T4 -50%) |
| Thận trọng | Tháng 22 | Mức giảm bằng 50% base case |

### NPV và IRR (3 năm, chiết khấu 12%)

| Chỉ số | Giá trị | Ghi chú |
|--------|---------|---------|
| NPV | +33.56 tỷ VND | Dương ở mọi kịch bản (kịch bản thận trọng nhất +10.5 tỷ) |
| IRR | 142% | Cao hơn nhiều so với chi phí vốn của Bank X |
| Thời gian hoàn vốn | 11 tháng (base) | Nhanh hơn dự án IT thông thường (18-24 tháng) |

### Các kịch bản "ngay cả khi"

| Kịch bản | NPV | Vẫn dương? |
|----------|-----|------------|
| Chỉ giảm NPL, không giảm gian lận hay từ chối nhầm | +10.5 tỷ | Có |
| Giảm NPL và gian lận, không giảm từ chối nhầm | +16.8 tỷ | Có |
| Mức giảm chỉ bằng 50% mục tiêu | +14.2 tỷ | Có |
| Giai đoạn 0 không đạt, dừng sau 365M | -365M | Mức thiệt hại tối đa |

NPV dương trong mọi kịch bản, trừ trường hợp dừng hoàn toàn sau Giai đoạn 0.

---

## 4. Tác động vận hành

### Năng lực CO

| Chỉ số | Trước | Sau | Thay đổi |
|--------|-------|-----|----------|
| Số CO cần thiết (FTE) | 10 | 4.3 | -56% |
| Thời gian review mỗi hồ sơ (trung bình) | 30 phút | 15 phút | -50% |
| Thời gian review nhóm duyệt tự động | 30 phút | 3-5 phút | -85% |
| Thời gian ra quyết định | 1-7 ngày | Dưới 1 ngày | -80% |
| Tỷ lệ review thủ công | 100% | 55% | -45% |

Năng lực CO được giải phóng (56%) không đồng nghĩa với cắt giảm nhân sự. Các hướng sử dụng:

- Chuyển CO sang công việc giá trị cao hơn (thu hồi nợ, quan hệ khách hàng, thẩm định hồ sơ phức tạp).
- Xử lý volume tăng mà không cần tuyển thêm.
- Giảm làm thêm giờ và áp lực công việc, cải thiện giữ chân nhân sự.

### Trải nghiệm khách hàng

| Chỉ số | Trước | Sau | Tác động |
|--------|-------|-----|----------|
| Từ nộp hồ sơ đến quyết định | 1-7 ngày | Dưới 1 ngày | Cạnh tranh được với fintech |
| Thông báo từ chối | "Không đủ điều kiện" (chung chung) | 3 lý do cụ thể kèm quyền của khách hàng | Phù hợp NĐ 356, giảm khiếu nại |
| Tùy chọn xem xét bởi con người | Không có | Có khi khách yêu cầu | Tăng niềm tin, phù hợp Luật AI |
| Bảo vệ khách hàng khỏi gian lận | Chỉ eKYC | AI đa tín hiệu | Bảo vệ tốt hơn |

### Mức độ sẵn sàng tuân thủ

| Yêu cầu | Trước | Sau |
|---------|-------|-----|
| Audit trail | Khoảng 5-8 trường, thủ công | 24 trường, tự động, bất biến |
| Khả năng giải thích | Không có | 3 yếu tố chính, ngôn ngữ dễ hiểu |
| Gắn nhãn AI (Luật AI) | Không áp dụng | "Hỗ trợ bởi AI" trên mọi kết quả |
| Giám sát thiên lệch | Không có | Theo dõi theo giới tính, địa lý, độ tuổi |
| Thanh tra SBV | Đáp ứng một phần | Truy vết đầy đủ trong dưới 15 phút |

---

## 5. Độ nhạy: 5 giả định chính

| Mã | Giả định | Giá trị base | Nếu lệch ±20% | Tác động đến tiết kiệm/năm | Độ tin cậy |
|----|----------|--------------|---------------|----------------------------|------------|
| A13 | Tỷ lệ từ chối nhầm | 10% | 8-12% | ±6.22 tỷ | Thấp, được kiểm chứng ở Giai đoạn 0 |
| A22 | Mức cải thiện phát hiện gian lận | -30% | -24% đến -36% | ±1.73 tỷ | Trung bình |
| A21 | Mức giảm NPL nhờ AI | -20% | -16% đến -24% | ±2.12 tỷ | Trung bình |
| A1 | Volume hồ sơ thẻ | 3,000/tháng | 2,400-3,600 | ±5.33 tỷ | Thấp, được thay bằng dữ liệu thực của Bank X |
| A14 | LTV mỗi thẻ | 36M | 29M-43M | ±4.67 tỷ | Trung bình |

Biện pháp giảm thiểu: shadow testing 4 tuần trên dữ liệu thực ở Giai đoạn 0 kiểm chứng các giả định này trước khi giải ngân ngân sách Giai đoạn 1.

---

## 6. So sánh AI-CRDS với các phương án khác

| Tiêu chí | AI-CRDS (nội bộ) | FICO | Vendor trong nước | Giữ nguyên hiện trạng |
|----------|------------------|------|-------------------|-----------------------|
| TCO 3 năm | 8-14 tỷ | 18-27 tỷ | 14-20 tỷ | 0 (nhưng thiệt hại 96 tỷ/năm) |
| IP | 100% Bank X | Vendor sở hữu | Vendor sở hữu | Không áp dụng |
| Thời gian triển khai | 8-12 tháng | 4-8 tháng | 6-10 tháng | Không áp dụng |
| Phù hợp quy định Việt Nam | Thiết kế riêng cho Việt Nam | Cần điều chỉnh | Một phần | Chưa đáp ứng |
| Truy cập dữ liệu | Toàn bộ CBS/CIC | Hạn chế | Hạn chế | Toàn bộ |
| Tùy biến | Toàn quyền | Theo lộ trình vendor | Một phần | Không áp dụng |
| Khả năng mở rộng | Phân khúc mới, cảnh báo sớm | Tính phí theo module | Tính phí theo module | Không áp dụng |
