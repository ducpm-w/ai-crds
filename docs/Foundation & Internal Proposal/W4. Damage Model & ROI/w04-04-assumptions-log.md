# Assumptions Log — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## Mục đích

Ghi nhận toàn bộ giả định dùng trong damage model, break-even analysis và budget estimate. Mỗi giả định có nguồn, mức độ tin cậy và cách kiểm chứng. Khi có số liệu thực của Bank X, log này được cập nhật và các mô hình được tính lại.

Số liệu trong tài liệu là giả định lập kế hoạch; mỗi giả định ghi rõ nguồn và mức tin cậy.

---

## 1. MASTER ASSUMPTIONS TABLE

### 1.1 Bank X Operating Metrics

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Cách kiểm chứng | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|----------------|
| A1 | CC applications/tháng | 3,000 | Damage model (mọi tier), Break-even | Ước tính ngân hàng thương mại cỡ trung VN. Khoảng: 1,500-5,000. | Thấp | Số liệu của Khối Thẻ/Kinh doanh | Cao: tác động tuyến tính lên mọi tier |
| A2 | Approval rate hiện tại | 60% | Damage T1-T3, Break-even | Trung bình ngành thẻ tín dụng VN. Khoảng: 50-70%. | Thấp | Số liệu của Khối Thẻ/Tín dụng | Trung bình: ảnh hưởng khối lượng hồ sơ phê duyệt |
| A3 | Average CC limit (salaried) | 50M VND | Damage T1-T2, Break-even | 2-3 lần thu nhập hàng tháng. Thu nhập khai báo trung bình ~20M → hạn mức 40-60M. | Trung bình | Số liệu sản phẩm của Khối Thẻ | Cao: hệ số nhân trong EL và fraud loss |
| A4 | Average outstanding balance | 25M VND (~50% sử dụng) | Damage T1 | Mức sử dụng hạn mức trung bình ngành ~40-60%. | Trung bình | Số liệu của Khối Tài chính | Trung bình |
| A5 | CO team size | 10-12 | Damage T4, Budget | Ước tính từ A1 ÷ năng lực xử lý của CO. | Thấp | Số liệu nhân sự / Vận hành | Trung bình: ảnh hưởng ops cost |
| A6 | CO capacity (apps/ngày) | 10-15 thẩm định đầy đủ | Damage T4 | 35 phút/hồ sơ × 6 giờ làm việc hiệu quả. | Trung bình | Phỏng vấn Credit Officer | Thấp |

### 1.2 Credit Risk Parameters

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Cách kiểm chứng | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|----------------|
| A7 | CC NPL rate tại Bank X | 3.5% | Damage T1 (cốt lõi) | FiinRatings 2024: NPL on-balance toàn hệ thống 1.69%, gross 3.36%. Riêng thẻ tín dụng cao hơn. VPBank 5.7%, VCB 0.7% (Statista 2023). S&P 06/2025: NPL gồm SML ~2%. | Trung bình | Số liệu của Khối Rủi ro / Tài chính | Rất cao: tác động trực tiếp lên T1 |
| A8 | LGD (CC unsecured) | 70% | Damage T1 (cốt lõi) | Chuẩn ngành thẻ tín dụng không tài sản bảo đảm. Tỷ lệ thu hồi tại VN ~20-30% (thi hành án yếu với nợ tiêu dùng). Khoảng: 60-80%. | Trung bình | Dữ liệu thu hồi nợ của Khối Rủi ro | Cao: hệ số nhân trong EL |
| A9 | EAD assumption | Toàn bộ hạn mức (50M) | Damage T1 worst case | Trường hợp xấu nhất: khách hàng vỡ nợ đã sử dụng hết hạn mức. Phương án thận trọng thay thế: dùng dư nợ (25M). | Trung bình | Dữ liệu của Khối Rủi ro | Trung bình |
| A10 | Default definition | DPD 90+ | Damage T1 | Chuẩn Basel II. Ngân hàng có thể dùng DPD 60+ hoặc write-off. | Cao | Chính sách của Khối Rủi ro | Thấp: chuẩn Basel được áp dụng rộng rãi |

### 1.3 Fraud Parameters

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Cách kiểm chứng | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|----------------|
| A11 | Fraud rate at CC origination | 0.8% | Damage T2 | Visa VN Q2 2025: tỷ lệ fraud giảm, dưới trung bình SEA. 93% fraud từ online. Fraud tại origination thấp hơn fraud giao dịch. Khoảng: 0.3-1.5%. | Trung bình | Dữ liệu của đội Fraud/Rủi ro | Cao: tác động trực tiếp lên T2 |
| A12 | Loss per fraud case | 100% hạn mức (50M) | Damage T2 | Fraud rút hết hạn mức, không thu hồi được. | Cao | Không áp dụng: trường hợp xấu nhất theo thiết kế | Thấp: thận trọng theo thiết kế |

### 1.4 Opportunity Cost Parameters

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Cách kiểm chứng | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|----------------|
| A13 | False rejection rate | 10% hồ sơ bị từ chối | Damage T3 | Ước tính ngành. Khó đo trực tiếp vì hồ sơ bị từ chối không có dữ liệu kết quả (reject inference). Khoảng: 5-15%. | Thấp (giả định yếu nhất) | Phỏng vấn Credit Officer, Khối Thẻ; đối chiếu kết quả shadow testing | Cao nhất: T3 chiếm 54% tổng thiệt hại. Dao động ±20 tỷ/năm. |
| A14 | CC Lifetime Value (LTV) | 36M VND / 3 năm | Damage T3, Break-even | Doanh thu mỗi thẻ mỗi năm: lãi (khách revolve ~10-15M) + phí thường niên (500K-1.5M) + interchange (1-3M). Trung bình ~8M/năm × 3 năm, có chiết khấu. | Trung bình | Số liệu của Khối Tài chính / Sản phẩm | Cao: hệ số nhân trong T3 |
| A15 | Average CC lifespan | 3 năm | Damage T3 | Trung bình ngành. Khoảng: 2-5 năm. Tỷ lệ churn thẻ tín dụng tại VN chưa có số liệu công khai. | Thấp | Số liệu của Khối Sản phẩm | Trung bình |
| A16 | CC interest rate | 24-36% p.a. | Tính LTV | Lãi suất revolving chuẩn thẻ tín dụng VN. | Cao | Biểu phí sản phẩm của Khối Thẻ | Thấp: thông tin công khai |
| A17 | Annual fee per card | 500K VND (trung bình) | Tính LTV | Khoảng 300K-1.5M tùy hạng thẻ. | Trung bình | Biểu phí sản phẩm của Khối Thẻ | Thấp |

### 1.5 Operational Cost Parameters

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Cách kiểm chứng | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|----------------|
| A18 | CO all-in cost/tháng | 18M VND | Damage T4, Budget | Salary guide 2025: chuyên viên tín dụng 10-20M, cộng BHXH (~23%) và chi phí chung (văn phòng, thiết bị). All-in: 15-25M. | Trung bình | Số liệu của Khối Nhân sự / Tài chính | Trung bình |
| A19 | Review time per application | 35 phút (thẩm định đầy đủ) | Damage T4 | Ước tính: xem hồ sơ (10 phút) + tra cứu CIC (5 phút) + phân tích (10 phút) + quyết định và ghi nhận (10 phút). | Thấp | Quan sát/phỏng vấn Credit Officer | Trung bình |
| A20 | CO productive hours/ngày | 6 giờ (hiệu suất 75%) | Damage T4 | Văn phòng chuẩn: 8 giờ trừ họp, nghỉ, hành chính còn ~6 giờ hiệu quả. | Trung bình | Số liệu của Khối Vận hành | Thấp |

### 1.6 AI Performance Assumptions

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Cách kiểm chứng | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|----------------|
| A21 | AI NPL reduction | -20% (3.5% → 2.8%) | Break-even B1 | Tài liệu học thuật: AI scoring cải thiện Gini 10-30% so với scorecard truyền thống. Giảm NPL 20% là mức thận trọng cho AI triển khai tốt. Khoảng: -10% đến -40%. | Thấp | Kết quả shadow testing | Cao: 5.29 tỷ/năm |
| A22 | AI fraud detection improvement | +30% tỷ lệ phát hiện | Break-even B2 | Phụ thuộc tích hợp eKYC và chất lượng model fraud. Chuyển từ rule-based sang ML thường cải thiện +20-50%. | Thấp | Kết quả shadow testing | Trung bình: 4.32 tỷ/năm |
| A23 | AI false reject reduction | -30% | Break-even B3 | AI nhất quán hơn thủ công nên ít từ chối ngẫu nhiên hơn; tuy nhiên ML có thể tạo ra thiên lệch mới. -30% là ước tính ở mức trung bình. | Thấp (khó chứng minh nhất) | Kết quả shadow testing và limited deployment | Cao nhất: 15.55 tỷ/năm |
| A24 | Auto-review rate | 50% hồ sơ | Break-even B4 | Phụ thuộc thiết lập ngưỡng và mức độ tin tưởng của CO. Bắt đầu thận trọng (30%), tăng dần lên 50-70%. | Thấp | Phê duyệt ngưỡng của Risk Committee; kết quả limited deployment | Trung bình: 1.48 tỷ/năm |
| A25 | Benefit ramp-up schedule | 0%→30%→60%→85% trong 12 tháng | Break-even | Lộ trình triển khai AI điển hình trong ngân hàng. Shadow 3 tháng (0%) → limited 3 tháng (30%) → mở rộng 3 tháng (60%) → toàn bộ 3 tháng (85%). | Trung bình | Theo dõi ramp-up thực tế sau triển khai | Trung bình: ảnh hưởng tháng hòa vốn |

### 1.7 Cost & Financial Assumptions

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Cách kiểm chứng | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|----------------|
| A26 | Build cost (tổng) | 6.7 tỷ VND (base) | Budget v0, Break-even | Phân rã: ML dev 3 tỷ + backend 1.5 tỷ + frontend 800M + infra 600M + PM 800M. Theo mặt bằng thị trường VN. | Trung bình | Số liệu của CTO / Khối IT | Trung bình: khoảng ±2 tỷ |
| A27 | Annual run cost | 2.05 tỷ VND (base) | Budget v0, Break-even | Cloud 600M + CIC 300M + eKYC 150M + bảo trì 800M + tuân thủ 200M. | Trung bình | Số liệu của CTO / Tài chính | Trung bình |
| A28 | CIC API cost per query | ~10K VND | Budget v0 | Phí CIC khác nhau giữa các ngân hàng tùy thỏa thuận; khoảng 5K-20K/query. | Thấp | Thỏa thuận CIC hiện hành của Bank X | Trung bình: 300M/năm |
| A29 | ML Engineer salary (senior) | 40-70M/tháng | Budget v0 | Adecco 2025, Reeracoen 2025. AI/ML có mức lương cao hơn. Hà Nội/TP.HCM. | Cao | Số liệu của Khối Nhân sự | Thấp |
| A30 | Discount rate (NPV) | 12% per annum | Break-even NPV | Lãi suất phi rủi ro VN ~5% + equity risk premium ~7%. Chuẩn đánh giá dự án doanh nghiệp. | Cao | Chính sách của CFO | Thấp: NPV ít nhạy với tỷ lệ này |

---

## 2. ASSUMPTION RISK MATRIX

```
                        IMPACT ON NPV
                   Thấp (<3 tỷ)   Cao (>5 tỷ)
                 ┌──────────────┬──────────────┐
    Tin cậy      │              │  A7 (NPL)    │
    cao          │  A10,A12,    │  A8 (LGD)    │
                 │  A16,A29,A30 │              │
                 ├──────────────┼──────────────┤
    Tin cậy      │  A4,A6,A9,   │  A3 (limit)  │
    trung bình   │  A17,A18,A20 │  A14 (LTV)   │
                 │  A25,A26,A27 │  A11 (fraud) │
                 ├──────────────┼──────────────┤
    Tin cậy      │  A5,A15,A19  │  A1 (volume) │
    thấp         │  A24,A28     │  A2 (approv) │
                 │              │  A13 (FP)    │
                 │              │  A21-A23     │
                 └──────────────┴──────────────┘
```

Năm giả định có rủi ro cao nhất (tin cậy thấp, tác động cao):

| Rank | # | Assumption | Value | NPV swing if wrong | Cách kiểm chứng |
|------|---|-----------|-------|-------------------|----------------|
| 1 | A13 | False rejection rate | 10% | ±20 tỷ | Phỏng vấn Credit Officer, đối chiếu kết quả shadow test |
| 2 | A23 | AI false reject reduction | -30% | ±13 tỷ | Shadow testing, sau đó limited deployment |
| 3 | A21 | AI NPL reduction | -20% | ±9 tỷ | Shadow testing, đo lường 90 ngày sau triển khai |
| 4 | A1 | CC applications/tháng | 3,000 | ±8 tỷ | Số liệu của Khối Thẻ |
| 5 | A22 | AI fraud detection +30% | +30% | ±7 tỷ | Shadow testing |

---

## 3. SENSITIVITY TABLE — Kịch bản thay đổi giả định

Bảng dưới đây cho thấy mức thay đổi của damage model khi một giả định lệch khỏi giá trị cơ sở.

| Scenario | Assumptions changed | Total damage/năm | AI saving/năm | NPV 3 năm | Break-even |
|---------|-------------------|-----------------|-------------|-----------|-----------|
| Base case | Tất cả ở giá trị cơ sở | 95.65 tỷ | 26.64 tỷ | +33.56 tỷ | Tháng 11 |
| NPL thực = 2% (tốt hơn) | A7: 3.5% → 2% | 81.5 tỷ | 23.6 tỷ | +28.0 tỷ | Tháng 12 |
| NPL thực = 5.5% (xấu hơn) | A7: 3.5% → 5.5% | 115.8 tỷ | 31.4 tỷ | +42.5 tỷ | Tháng 9 |
| False reject = 5% (ít hơn) | A13: 10% → 5% | 69.8 tỷ | 18.5 tỷ | +18.2 tỷ | Tháng 15 |
| False reject = 0% (không có) | A13: 10% → 0% | 43.8 tỷ | 11.1 tỷ | +10.5 tỷ | Tháng 18 |
| Volume = 1,500/tháng | A1: 3,000 → 1,500 | 47.8 tỷ | 13.3 tỷ | +12.8 tỷ | Tháng 16 |
| Volume = 5,000/tháng | A1: 3,000 → 5,000 | 159.4 tỷ | 44.4 tỷ | +67.0 tỷ | Tháng 7 |
| AI chỉ giảm NPL, không có cải thiện khác | A22-24: 0 | Không áp dụng | 5.29 tỷ | +2.1 tỷ | Tháng 20 |
| Kịch bản bất lợi nhất | A13=0%, AI chỉ giảm NPL 10% | Không áp dụng | 2.65 tỷ | -4.2 tỷ | Không hòa vốn |

NPV chỉ âm khi đồng thời lợi ích từ giảm từ chối nhầm bằng 0 và mức cải thiện của AI rất nhỏ (chỉ giảm 10% NPL). Kịch bản này khó xảy ra, chỉ có thể xuất hiện nếu chất lượng model kém hoặc CO không tin tưởng AI.

Biện pháp giảm thiểu: shadow testing kiểm chứng A21-A24 trước khi cam kết ngân sách Phase 1. Nếu shadow test cho thấy AI không cải thiện, dự án dừng với chi phí đã chi là 365M (chỉ Phase 0).

---

## 4. KIỂM CHỨNG GIẢ ĐỊNH

### Các mốc kiểm chứng

| Milestone | Giả định được kiểm chứng | Hành động sau kiểm chứng |
|----------|---------------------|----------------------|
| Làm việc với Khối IT/Tài chính Bank X | A1-A9, A11, A14, A16-A18, A26-A28 | Tính lại damage model, break-even và budget. |
| Phỏng vấn Credit Officer | A13, A19 | Kiểm chứng false rejection rate (giả định lớn nhất). Cập nhật T3. |
| Làm việc sâu với Risk Manager | A8, A10, A15 | Chốt LGD và định nghĩa default. Cập nhật T1. |
| Kết quả shadow testing | A21, A22 | So sánh độ chính xác AI và thủ công. Quyết định chuyển sang Phase 1. |
| Kết quả limited deployment | A23, A24 | Đánh giá hiệu quả giảm từ chối nhầm và auto-review. Quyết định triển khai toàn bộ. |
| 30 ngày sau triển khai | Các giả định còn lại | Tính lại toàn bộ với số thực. Báo cáo tác động 30 ngày. |

---

## 5. QUY TRÌNH TÍNH LẠI

Khi một giả định được kiểm chứng và thay bằng số liệu thực:

### Bước 1: Cập nhật Assumptions Log

```
| A7 | CC NPL rate | 3.5% → [SỐ THỰC] | w04-01-damage-model-bank-x | [NGUỒN MỚI] | Cao | Đã kiểm chứng |
```

### Bước 2: Tính lại các mô hình

| Document | Tính lại nội dung | Mức ưu tiên |
|---------|-----------------|---------|
| w04-01-damage-model-bank-x | 4 tier với đầu vào mới | Ngay lập tức |
| w04-02-break-even-analysis | NPV, IRR, tháng hòa vốn | Ngay lập tức |
| w04-03-budget-estimate-v0 | Ước tính chi phí nếu phí CIC hoặc mức lương thay đổi | Nếu áp dụng |

### Bước 3: Quản lý phiên bản

```
w04-01-damage-model-bank-x v1.0 (ước tính) → v1.1 (một phần số thực) → v2.0 (số thực sau shadow testing)
w04-02-break-even-analysis v1.0 → v1.1 → v2.0
w04-04-assumptions-log v1.0 → v1.1 → v2.0
```

### Bước 4: Thông báo thay đổi

Nếu việc tính lại làm NPV thay đổi hơn 10%, thông báo cho quản lý trực tiếp và cập nhật bản đề xuất.

---

## 6. PHẠM VI VÀ LƯU Ý

1. Có 30 giả định được theo dõi; 5 giả định có tin cậy thấp và tác động cao là rủi ro lớn nhất.
2. A13 (false rejection rate) là giả định yếu nhất nhưng có tác động cao nhất, dao động ±20 tỷ/năm. Ngay cả khi false reject bằng 0, NPV vẫn dương +10.5 tỷ nhờ tiết kiệm từ NPL và fraud.
3. Các giả định A21-A24 (cải thiện nhờ AI) chỉ được kiểm chứng sau shadow testing. Ngân sách Phase 0 (365M) đã tính đến rủi ro này: nếu shadow test không đạt, dự án dừng với chi phí đã chi là 365M.
4. Các giả định tác động qua lại: A1 (volume) tác động mọi tier, A3 (limit) tác động T1 và T2. Khi thay đổi một giả định, cần tính lại toàn bộ mô hình cùng lúc.
5. Tài liệu liên quan: w04-01-damage-model-bank-x (dùng A1-A24), w04-02-break-even-analysis (dùng toàn bộ), w04-03-budget-estimate-v0 (dùng A26-A30).
