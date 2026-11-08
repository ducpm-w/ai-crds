# Synthetic Dataset Spec — AI-CRDS MVP v1
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## Mục đích

Đặc tả bộ dữ liệu tổng hợp (synthetic) dùng cho MVP demo của Bank X, gồm yêu cầu, danh mục kiểm tra chất lượng và cách nạp dữ liệu. Đặc tả chi tiết xem w03-04-synthetic-data-plan.md.

Các tham số phân phối dưới đây là giả định lập kế hoạch, mô phỏng cấu trúc dữ liệu của Bank X; chưa phải số liệu thực của Bank X.

---

## 1. Yêu cầu bộ dữ liệu

| Tham số | Mục tiêu | Nguồn |
|--------|---------|-------|
| Số bản ghi | 10.000 | w03-04-synthetic-data-plan.md, mục 3 |
| Tỷ lệ vỡ nợ | 4-6% (mục tiêu 5%) | w03-04-synthetic-data-plan.md, mục 4 |
| Độ phủ CIC | 82% (18% thin file) | w03-03-feature-availability-matrix.md |
| Tỷ lệ khách hàng hiện hữu | 55% | w03-04-synthetic-data-plan.md, mục 4.2 |
| Phân phối độ tuổi | Chuẩn cắt cụt, trung bình 32, độ lệch chuẩn 8, tối thiểu 21, tối đa 65 | w03-04-synthetic-data-plan.md, mục 4.1 |
| Tiền tố CCCD | "SYN" + 9 chữ số | Bắt buộc, tránh nhầm với dữ liệu thật |
| Tiêu đề tệp | "SYNTHETIC DATA — NOT REAL CUSTOMERS" | Bắt buộc, bảo vệ dữ liệu cá nhân |
| Định dạng | CSV và JSON | Cả hai định dạng để dùng linh hoạt |

---

## 2. Danh mục kiểm tra chất lượng

| # | Hạng mục | Cách kiểm tra |
|---|---------|---------------|
| 1 | Đủ 10.000 bản ghi | Chạy script sinh dữ liệu theo w03-04-synthetic-data-plan.md và đếm số dòng |
| 2 | Tất cả bản ghi có tiền tố CCCD "SYN" | `grep -v "SYN" data.csv \| wc -l` cho kết quả 0 (chỉ còn dòng tiêu đề) |
| 3 | Tệp có dòng tiêu đề "SYNTHETIC DATA" | `head -1 data.csv` |
| 4 | Tỷ lệ vỡ nợ trong khoảng 4-6% | Đếm `default_flag=1` chia tổng số bản ghi |
| 5 | Độ phủ CIC xấp xỉ 82% | Đếm `cic_score > 0` chia tổng số bản ghi |
| 6 | Tuổi tối thiểu từ 21, tối đa đến 65 | `min(age)`, `max(age)` |
| 7 | Phân phối thu nhập hợp lý | Trung bình khoảng 15-20 triệu, không có giá trị âm, không vượt 200 triệu |
| 8 | DTI tính đúng | `dti = cic_total_debt / monthly_income` |
| 9 | Phân phối loại hình đơn vị công tác | SOE 30%, FDI 25%, Private 25%, SME 15%, Startup 5% |
| 10 | Phân phối giới tính | Khoảng 50/50 (sai lệch trong 5%) |
| 11 | Phân phối tỉnh/thành | TP.HCM 35%, Hà Nội 25%, địa phương khác 40% |
| 12 | 9 cặp tương quan đúng chiều | Thu nhập và CIC, tuổi và thâm niên, DTI và vỡ nợ, v.v. |
| 13 | Có 10 loại trường hợp biên | Thin file, DPD cao nhất, rất trẻ, rất lớn tuổi, DTI cao nhất, v.v. |
| 14 | Không có thông tin cá nhân thật ở bất kỳ trường nào | Kiểm tra thủ công 20 bản ghi ngẫu nhiên |
| 15 | Có đủ hai định dạng CSV và JSON | Cả hai tệp tồn tại và đọc được |

Bộ dữ liệu chỉ được chấp nhận khi đạt cả 15 hạng mục.

---

## 3. Bản ghi kiểm thử cho kịch bản demo

Ba bản ghi cố định được tạo sẵn cho ba tình huống trong w12-01-demo-script.md:

| Tình huống | Mã bản ghi | Thuộc tính chính | Kết quả kỳ vọng |
|-----------|-----------|-----------------|-----------------|
| A: Hồ sơ tốt | SYN-DEMO-001 | CIC 740, DTI 22%, thâm niên 36 tháng, eKYC 0,96 | Điểm từ 0,82, State 1 |
| B: Hồ sơ biên | SYN-DEMO-002 | CIC 650, DTI 42%, thâm niên 8 tháng, 2 truy vấn tín dụng | Điểm khoảng 0,52, State 2 |
| C: Gian lận | SYN-DEMO-003 | Face match 0,58, tần suất nộp 3 hồ sơ, thin file, thu nhập 30 triệu | Fraud score từ 0,70, State 3 |

---

## 4. Tham số sinh dữ liệu

```
Sinh bộ dữ liệu tổng hợp 10.000 bản ghi cho AI-CRDS demo tại Bank X
theo schema và phân phối trong w03-04-synthetic-data-plan.md.

Yêu cầu:
- Tỷ lệ vỡ nợ: 5% (sai lệch 1%)
- Độ phủ CIC: 82%
- Tỷ lệ khách hàng hiện hữu: 55%
- Tuổi: chuẩn cắt cụt, trung bình 32, độ lệch chuẩn 8, tối thiểu 21, tối đa 65
- CCCD: tiền tố "SYN" + 9 chữ số ngẫu nhiên
- Dòng đầu tệp: "SYNTHETIC DATA — NOT REAL CUSTOMERS"
- Gồm 3 bản ghi demo định sẵn (SYN-DEMO-001/002/003)
- Gồm 10 bản ghi trường hợp biên
- Chạy 15 hạng mục kiểm tra chất lượng
- Đầu ra: CSV và JSON
- Lưu tại: data/synthetic/ai-crds-synthetic-10k-v1.0.csv
```

---

## 5. Nạp dữ liệu vào Supabase

```sql
-- Nạp CSV vào bảng applications của Supabase
-- Dùng Supabase Dashboard, mục Table Editor, chọn Import CSV
-- hoặc dùng lệnh COPY của psql:

\COPY applications FROM 'ai-crds-synthetic-10k-v1.0.csv'
WITH (FORMAT csv, HEADER true);

-- Kiểm tra sau khi nạp
SELECT COUNT(*) FROM applications;  -- Kết quả phải là 10.000
SELECT COUNT(*) FROM applications WHERE cccd NOT LIKE 'SYN%';  -- Kết quả phải là 0
```
