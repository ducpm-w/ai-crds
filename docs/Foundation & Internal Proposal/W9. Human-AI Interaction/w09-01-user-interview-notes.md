# User Interview Notes — Credit Officers
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Tài liệu mô tả phương pháp phỏng vấn Credit Officer (CO) của Bank X và cách kết quả phỏng vấn được đưa vào thiết kế giao diện, quy tắc override và cơ chế hiệu chỉnh niềm tin. Nhóm phỏng vấn gồm 3-5 người, thực hiện trước khi chốt thiết kế.

---

## 1. Bộ Câu Hỏi Phỏng Vấn

### Mở đầu (5 phút)

```
"Cảm ơn anh/chị đã dành thời gian. Tôi đang nghiên cứu quy trình
xét duyệt thẻ tín dụng để cải thiện công cụ hỗ trợ cho Credit
Officer. Không có câu trả lời đúng hay sai, tôi muốn hiểu quy trình
làm việc thực tế của anh/chị. Tôi xin phép ghi chú trong buổi trao đổi."
```

### Q1 — Quy trình làm việc hiện tại (10 phút)

```
"Anh/chị mô tả giúp một ngày làm việc bình thường, từ lúc nhận
hồ sơ đến lúc ký quyết định?"

Câu hỏi gợi mở:
- Mỗi ngày xử lý bao nhiêu hồ sơ?
- Sử dụng những công cụ nào? CBS, Excel, cổng CIC?
- Mỗi hồ sơ mất bao lâu?
- Bước nào mất nhiều thời gian nhất?
- Bước nào lặp lại nhiều nhất?
```

Điểm cần quan sát: số bước thực tế so với quy trình trên giấy, việc chuyển đổi giữa các công cụ, các cách làm tắt.

### Q2 — Cách ra quyết định (10 phút)

```
"Khi nhìn vào một hồ sơ, anh/chị dựa vào yếu tố nào đầu tiên để
quyết định duyệt hay từ chối? Ba yếu tố quan trọng nhất là gì?"

Câu hỏi gợi mở:
- Điểm CIC quan trọng đến mức nào?
- Thu nhập hay DTI quan trọng hơn?
- Nơi làm việc có ảnh hưởng không?
- Có dấu hiệu cảnh báo khiến anh/chị từ chối ngay không?
- Có dấu hiệu tích cực khiến anh/chị yên tâm ngay không?
```

Điểm cần quan sát: mô hình tư duy của CO, các quy tắc không thành văn.

### Q3 — Khó khăn trong công việc (10 phút)

```
"Loại hồ sơ nào khó quyết định nhất? Vì sao? Thường mất bao lâu?"

Câu hỏi gợi mở:
- Ví dụ cụ thể về một hồ sơ khó gần đây?
- Khi không chắc chắn, anh/chị trao đổi với ai?
- Có quy trình chuyển cấp chính thức không?
- Có hồ sơ nào anh/chị muốn quyết định khác đi không?
```

Điểm cần quan sát: các trường hợp biên, các trường hợp CO cần thêm thông tin.

### Q4 — Mức độ tin tưởng hệ thống AI (5 phút)

```
"Nếu có một hệ thống đưa ra điểm từ 0-100 kèm lý do, anh/chị sẽ
sử dụng như thế nào? Điều gì khiến anh/chị tin hoặc không tin?"

Câu hỏi gợi mở:
- Anh/chị muốn thấy thông tin gì trên màn hình?
- Hệ thống đề xuất duyệt, anh/chị có duyệt theo không? Vì sao?
- Hệ thống đề xuất từ chối, anh/chị có từ chối theo không?
- Nếu hệ thống sai một lần, anh/chị có tiếp tục dùng không?
```

Điểm cần quan sát: các điểm e ngại, điều kiện để tin tưởng, yếu tố khiến CO ngừng sử dụng.

### Q5 — Override (5 phút)

```
"Có khi nào anh/chị muốn thay đổi quyết định mà hệ thống đề xuất
không? Ví dụ hệ thống đề xuất duyệt nhưng anh/chị muốn từ chối?"

Câu hỏi gợi mở:
- Bao lâu xảy ra một lần?
- Lý do phổ biến nhất là gì?
- Khi thay đổi quyết định, ai cần được biết?
- Anh/chị có ngại thay đổi quyết định không? Vì sao?
```

Điểm cần quan sát: tần suất, lý do, cảm nhận về thẩm quyền, mức độ e ngại hậu quả.

### Kết thúc (5 phút)

```
"Nếu có thể thay đổi một điều trong quy trình hiện tại, anh/chị sẽ
thay đổi điều gì?"
"Cảm ơn anh/chị. Tôi có thể trao đổi thêm khi cần không?"
```

---

## 2. Tổ Chức Phỏng Vấn

| Hạng mục | Nội dung |
|----------|---------|
| Đối tượng | 3-5 Credit Officer của Bank X: 1-2 CO cấp junior, 1-2 CO cấp senior, 1 Fraud Analyst |
| Thời lượng | 30-45 phút mỗi buổi, trao đổi không chính thức |
| Địa điểm | Khu vực làm việc của CO hoặc phòng họp tại Bank X |
| Ghi nhận | Ghi chú tay, không ghi âm hoặc quay hình; ghi nguyên văn các câu trích dẫn có giá trị |
| Đồng ý tham gia | Xin phép bằng lời; thông tin cá nhân được ẩn danh |
| Khuyến khích | Không cần, do phỏng vấn nội bộ |

### Cơ cấu người tham gia

| # | Vai trò |
|---|--------|
| 1 | CO cấp junior hoặc middle |
| 2 | CO cấp junior hoặc middle |
| 3 | CO cấp senior |
| 4 | CO cấp senior hoặc Supervisor |
| 5 | Fraud Analyst |

---

## 3. Mẫu Ghi Chép Mỗi Buổi Phỏng Vấn

| Thuộc tính | Nội dung |
|-----------|---------|
| Vai trò | Credit Officer / Senior CO / Fraud Analyst |
| Kinh nghiệm | Số năm làm việc |
| Ngày phỏng vấn | DD/MM/YYYY |
| Thời lượng | Số phút |

Mỗi buổi phỏng vấn được ghi theo các mục sau:

1. Quy trình làm việc (Q1)
2. Ba yếu tố quyết định hàng đầu (Q2)
3. Các khó khăn chính (Q3)
4. Tín hiệu tin tưởng và e ngại (Q4)
5. Hành vi override (Q5)
6. Trích dẫn nguyên văn
7. Điểm khác với giả định thiết kế ban đầu
8. Hàm ý thiết kế

---

## 4. Tổng Hợp Kết Quả

Kết quả của các buổi phỏng vấn được tổng hợp theo bốn bảng dưới đây và là đầu vào cho các tài liệu thiết kế liên quan.

### 4.1 Mẫu hành vi chung

| Mẫu hành vi | Số CO đề cập | Hàm ý thiết kế |
|-------------|-------------|----------------|
| Mô tả mẫu hành vi | Số CO / tổng số CO | Thay đổi tương ứng trong giao diện hoặc quy trình |

### 4.2 Yếu tố quyết định phổ biến

| Thứ hạng | Yếu tố | Số CO đề cập | Đối chiếu với w03-03-feature-availability-matrix |
|---------|--------|-------------|---------------------------------------------------|
| 1 | Yếu tố được nhắc nhiều nhất | Số CO / tổng số CO | Có sẵn dữ liệu hay không |
| 2 | Yếu tố thứ hai | Số CO / tổng số CO | Có sẵn dữ liệu hay không |
| 3 | Yếu tố thứ ba | Số CO / tổng số CO | Có sẵn dữ liệu hay không |

### 4.3 Điều kiện để CO tin tưởng hệ thống

| Điều kiện | Số CO đề cập | Cách đáp ứng |
|----------|-------------|--------------|
| Mô tả điều kiện | Số CO / tổng số CO | Tính năng hoặc quy trình tương ứng |

### 4.4 Mẫu hành vi override

| Loại override | Tần suất theo ước tính của CO | Lý do | Phản hồi thiết kế |
|--------------|-------------------------------|-------|-------------------|
| Override sang duyệt hoặc từ chối | Mức độ thường xuyên | Lý do phổ biến | Cơ chế xử lý trong w09-03-override-governance |

---

## 5. Ứng Dụng Kết Quả

| Nhóm kết quả | Tài liệu sử dụng |
|-------------|------------------|
| Quy trình làm việc thực tế | w08-01-workflow-as-is |
| Hàm ý về giao diện | w09-02-ux-wireframes-v1 |
| Mẫu hành vi override và lý do | w09-03-override-governance |
| Điều kiện tin tưởng và e ngại | w09-05-trust-calibration-guide |
| Trích dẫn nguyên văn của CO | w11-03-proposed-solution |

Phỏng vấn được thực hiện trước khi chốt thiết kế giao diện để các quyết định thiết kế dựa trên cách làm việc thực tế của CO.
