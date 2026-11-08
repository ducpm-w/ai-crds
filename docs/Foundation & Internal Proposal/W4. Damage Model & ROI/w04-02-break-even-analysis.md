# Break-even Analysis — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## Mục đích

Trả lời 3 câu hỏi của C-level:
1. AI-CRDS tốn bao nhiêu?
2. Tiết kiệm bao nhiêu?
3. Bao lâu hòa vốn?

Phân tích dựa trên damage model (w04-01-damage-model-bank-x). Số liệu trong tài liệu là giả định lập kế hoạch, sẽ được thay bằng dữ liệu thực của Bank X khi có.

---

## 1. COST SIDE — Chi phí AI-CRDS

### 1.1 Build Cost (một lần, Year 1)

| # | Hạng mục | Low | Base | High | Ghi chú |
|---|---------|-----|------|------|---------|
| C1 | AI/ML Development | 1.5 tỷ | 3 tỷ | 5 tỷ | 1-2 ML engineers × 12 tháng. Phát triển model, feature engineering, kiểm thử. Tự phát triển: thấp hơn. Thuê vendor: cao hơn. |
| C2 | Backend/Integration | 800M | 1.5 tỷ | 3 tỷ | Tích hợp CIC API, CBS connector, eKYC, audit trail, API gateway. 1-2 backend devs × 8-12 tháng. |
| C3 | Frontend/UX | 400M | 800M | 1.5 tỷ | Giao diện review cho Credit Officer, dashboard, admin panel. 1 frontend dev × 6-10 tháng. |
| C4 | Infrastructure setup | 300M | 600M | 1.2 tỷ | Cloud VN (Viettel/FPT Cloud), CI/CD pipeline, monitoring, môi trường staging. |
| C5 | Project Management | 400M | 800M | 1.2 tỷ | Quản lý dự án toàn thời gian. Scrum ceremonies, quản lý stakeholder, tài liệu. |
| | Subtotal Build | 3.4 tỷ | 6.7 tỷ | 11.9 tỷ | |

### 1.2 Run Cost (định kỳ, mỗi năm)

| # | Hạng mục | Low/năm | Base/năm | High/năm | Ghi chú |
|---|---------|---------|---------|---------|---------|
| R1 | Cloud hosting | 300M | 600M | 1.2 tỷ | Cloud VN (GPU inference, DB, storage, networking). Tăng theo khối lượng. |
| R2 | CIC API queries (incremental) | 100M | 300M | 600M | ~3,000 queries/tháng × ~10K VND/query. Phần chi phí tăng thêm so với chi phí CIC hiện có. |
| R3 | eKYC cost (incremental) | 50M | 150M | 300M | Số lượt gọi eKYC tăng thêm cho pipeline AI. Phần lớn đã có sẵn. |
| R4 | Model monitoring & maintenance | 200M | 400M | 800M | Phát hiện drift, huấn luyện lại hàng quý, báo cáo hiệu năng. 0.5 ML engineer thường trực. |
| R5 | System maintenance | 200M | 400M | 700M | Sửa lỗi, vá bảo mật, cập nhật thư viện. 0.5 backend dev thường trực. |
| R6 | SBV reporting & compliance | 100M | 200M | 400M | Báo cáo quý, cập nhật DPIA, hỗ trợ kiểm toán, tuân thủ Luật AI 134/2025. |
| | Subtotal Run/năm | 950M | 2.05 tỷ | 4 tỷ | |

### 1.3 People Cost (Year 1, nhân sự chuyên trách)

| # | Role | FTE | Monthly all-in | Annual | Ghi chú |
|---|------|-----|---------------|--------|---------|
| P1 | Project Manager | 1.0 | 35-50M | 420-600M | Quản lý dự án cấp cao, có kinh nghiệm AI/ngân hàng |
| P2 | ML Engineer (senior) | 1.0 | 40-70M | 480-840M | Phát triển model, MLOps |
| P3 | ML Engineer (mid) | 0.5-1.0 | 25-45M | 150-540M | Feature engineering, kiểm thử |
| P4 | Backend Developer | 1.0 | 30-50M | 360-600M | Tích hợp, API, audit trail |
| P5 | Frontend Developer | 0.5 | 25-40M | 150-240M | Giao diện review cho CO |
| P6 | Data Engineer | 0.5 | 30-45M | 180-270M | Data pipeline, ETL, chất lượng dữ liệu |
| P7 | IT Support (phía Bank X) | 0.3 | 20-30M | 72-108M | Hỗ trợ tích hợp CBS/CIC |
| | Subtotal People/năm | ~4.5 FTE | | 1.81-3.20 tỷ | |

Chi phí nhân sự trong bảng 1.3 là bản chi tiết của phần nhân sự nằm trong C1-C5, không cộng thêm vào tổng để tránh tính trùng.

### 1.4 Compliance Cost (Year 1)

| # | Hạng mục | Low | Base | High | Ghi chú |
|---|---------|-----|------|------|---------|
| L1 | DPIA preparation | 100M | 200M | 400M | Tư vấn pháp lý + nỗ lực nội bộ. Mẫu 10 NĐ 356. |
| L2 | Legal review (contracts, liability) | 100M | 200M | 400M | Hợp đồng vendor-ngân hàng, phân bổ trách nhiệm (Luật AI 134/2025). |
| L3 | Compliance audit | 50M | 100M | 200M | Kiểm toán nội bộ trước khi triển khai. |
| L4 | DPO support | 50M | 100M | 200M | Phân bổ thời gian DPO hoặc thuê ngoài. Theo yêu cầu NĐ 356. |
| L5 | Training & change management | 100M | 200M | 400M | Đào tạo CO (10-15 buổi), hướng dẫn sử dụng, FAQ. |
| L6 | Sandbox application | 0 | 100M | 200M | Hồ sơ theo NĐ 94/2025. Hạng mục tùy chọn. |
| | Subtotal Compliance | 400M | 900M | 1.8 tỷ | |

### 1.5 TOTAL COST SUMMARY

| Cost category | Year 1 | Year 2 | Year 3 |
|--------------|--------|--------|--------|
| | Low / Base / High | Low / Base / High | Low / Base / High |
| Build (một lần) | 3.4 / 6.7 / 11.9 | 0 / 0 / 0 | 0 / 0 / 0 |
| Run (định kỳ) | 0.95 / 2.05 / 4.0 | 0.95 / 2.05 / 4.0 | 1.05 / 2.25 / 4.4 |
| Compliance (tập trung ở Year 1) | 0.4 / 0.9 / 1.8 | 0.15 / 0.3 / 0.6 | 0.15 / 0.3 / 0.6 |
| TOTAL | 4.75 / 9.65 / 17.7 | 1.1 / 2.35 / 4.6 | 1.2 / 2.55 / 5.0 |

Tổng chi phí 3 năm ở kịch bản cơ sở: 9.65 + 2.35 + 2.55 = 14.55 tỷ VND.

---

## 2. BENEFIT SIDE — AI-CRDS tiết kiệm bao nhiêu

Từ damage model, có 4 nguồn lợi ích:

### 2.1 Benefit Streams — 3 Scenarios

| # | Benefit stream | Conservative | Base | Optimistic | Basis |
|---|---------------|-------------|------|-----------|-------|
| B1 | Giảm NPL (credit loss) | 2.65 tỷ | 5.29 tỷ | 7.94 tỷ | NPL giảm -10% / -20% / -30%. Kịch bản cơ sở: NPL 3.5% → 2.8%. |
| B2 | Giảm fraud loss | 2.88 tỷ | 4.32 tỷ | 8.64 tỷ | Phát hiện fraud +20% / +30% / +60%. Lớp eKYC + AI fraud. |
| B3 | Giảm opportunity cost (từ chối nhầm) | 10.37 tỷ | 15.55 tỷ | 25.92 tỷ | Từ chối nhầm giảm -20% / -30% / -50%. Phê duyệt thêm khách hàng tốt. |
| B4 | Giảm ops cost (thẩm định thủ công) | 0.89 tỷ | 1.48 tỷ | 2.36 tỷ | Auto-review 30% / 50% / 70%. Giải phóng thời gian CO. |
| | TOTAL BENEFIT/năm | 16.79 tỷ | 26.64 tỷ | 44.86 tỷ | |

### 2.2 Benefit Ramp-up

AI-CRDS không đạt toàn bộ lợi ích ngay từ ngày đầu. Lịch tăng dần như sau:

| Period | % Full Benefit | Lý do |
|--------|---------------|-------|
| Tháng 1-3 (shadow testing) | 0% | AI chạy song song, chưa ảnh hưởng quyết định |
| Tháng 4-6 (limited deployment) | 30% | AI đề xuất cho một nhóm hồ sơ, CO vẫn review tất cả |
| Tháng 7-9 (expanding) | 60% | AI bao phủ phần lớn hồ sơ, CO xác nhận theo lô các hồ sơ độ tin cậy cao |
| Tháng 10-12 (full deployment) | 85% | Triển khai toàn bộ, tiếp tục hiệu chỉnh |
| Year 2+ | 100% | Vận hành ổn định, model được cải tiến |

### 2.3 Adjusted Annual Benefits (có ramp-up)

| Scenario | Raw benefit/năm | Year 1 (ramp-up trung bình ~44%) | Year 2 (100%) | Year 3 (110% — model cải tiến) |
|---------|----------------|--------------------------|--------------|----------------------------------|
| Conservative | 16.79 tỷ | 7.39 tỷ | 16.79 tỷ | 18.47 tỷ |
| Base | 26.64 tỷ | 11.72 tỷ | 26.64 tỷ | 29.30 tỷ |
| Optimistic | 44.86 tỷ | 19.74 tỷ | 44.86 tỷ | 49.35 tỷ |

---

## 3. BREAK-EVEN ANALYSIS

### 3.1 Break-even Calculation

```
Break-even month = Total cost / Monthly net benefit

Monthly net benefit = (Annual benefit × ramp-up%) / 12 - Monthly run cost
```

### 3.2 Cumulative Cash Flow — Base Case

| Month | Cumulative Cost | Cumulative Benefit | Net | Note |
|-------|---------------|-------------------|---------|------|
| 0 | -6.7 tỷ (build) | 0 | -6.7 tỷ | Hoàn tất build, triển khai |
| 1-3 | -7.21 tỷ | 0 | -7.21 tỷ | Shadow testing, lợi ích 0% |
| 4-6 | -7.72 tỷ | +2.0 tỷ | -5.72 tỷ | Limited deployment, lợi ích 30% |
| 7-9 | -8.23 tỷ | +6.0 tỷ | -2.23 tỷ | Mở rộng, lợi ích 60% |
| 10 | -8.40 tỷ | +7.88 tỷ | -0.52 tỷ | Lợi ích 85% |
| 11 | -8.57 tỷ | +9.77 tỷ | +1.20 tỷ | Hòa vốn |
| 12 | -8.74 tỷ | +11.72 tỷ | +2.98 tỷ | Kết thúc Year 1 |
| 24 | -11.09 tỷ | +38.36 tỷ | +27.27 tỷ | Kết thúc Year 2 |
| 36 | -13.64 tỷ | +67.66 tỷ | +54.02 tỷ | Kết thúc Year 3 |

### 3.3 Break-even Month — 3 Scenarios

| Scenario | Total Investment Y1 | Benefit Y1 (ramped) | Break-even month |
|---------|-------------------|--------------------|--------------------|
| Optimistic (chi phí thấp, lợi ích cao) | 4.75 tỷ | 19.74 tỷ | Tháng 6 |
| Base | 9.65 tỷ | 11.72 tỷ | Tháng 11 |
| Conservative (chi phí cao, lợi ích thấp) | 17.7 tỷ | 7.39 tỷ | Tháng 22 |

### 3.4 Break-even Chart (dạng văn bản)

```
Cumulative Net Cash Flow (Base Case) — tỷ VND

+60 ┤                                                          ╱
+50 ┤                                                       ╱
+40 ┤                                                    ╱
+30 ┤                                                 ╱
+20 ┤                                          ╱──╱
+10 ┤                                    ╱──╱
  0 ┤─────────────────────────────╱──╱
-10 ┤    ╲──────────╱──────╱──╱
    ├────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬──→
    0    3    6    9   12   15   18   21   24   27   30   33  36
                          Month

    Build cost → Shadow testing → Benefit ramp-up
    Hòa vốn khoảng tháng 11
```

---

## 4. NPV & IRR ANALYSIS

### 4.1 Assumptions

| Parameter | Value | Basis |
|----------|-------|-------|
| Discount rate | 12% per annum | Lãi suất phi rủi ro VN (~5%) + equity risk premium (~7%). Thận trọng cho dự án nội bộ. |
| Horizon | 3 năm | Chuẩn đánh giá đầu tư IT nội bộ. |
| Terminal value | Không tính | Thận trọng: không tính giá trị sau Year 3. |

### 4.2 NPV Calculation — Base Case

| Year | Net Cash Flow | Discount Factor (12%) | Present Value |
|------|-------------|---------------------|--------------|
| Year 0 (build) | -6.70 tỷ | 1.000 | -6.70 tỷ |
| Year 1 (run + lợi ích ramp-up) | +2.07 tỷ | 0.893 | +1.85 tỷ |
| Year 2 | +24.29 tỷ | 0.797 | +19.36 tỷ |
| Year 3 | +26.75 tỷ | 0.712 | +19.05 tỷ |
| NPV | | | +33.56 tỷ VND |

### 4.3 NPV — 3 Scenarios

| Scenario | NPV (3 năm) | IRR | Đánh giá |
|---------|-------------|-----|---------|
| Conservative | +12.8 tỷ | 68% | Dương mạnh |
| Base | +33.56 tỷ | 142% | Dương rất mạnh |
| Optimistic | +72.4 tỷ | 285% | Dương vượt trội |

NPV dương ở cả 3 kịch bản và IRR cao hơn nhiều so với discount rate (12%), do đó khoản đầu tư AI-CRDS hợp lý về mặt tài chính.

### 4.4 Sensitivity Analysis — Biến nào ảnh hưởng NPV nhiều nhất

| Variable | Base value | Change | NPV impact | Mức độ nhạy |
|---------|-----------|--------|-----------|------------|
| False reject reduction (B3) | -30% | ±10pp | ±8.6 tỷ | Rất cao — động lực lợi ích lớn nhất |
| NPL reduction (B1) | -20% | ±10pp | ±4.4 tỷ | Cao |
| Fraud detection (B2) | +30% | ±10pp | ±3.6 tỷ | Cao |
| Build cost | 6.7 tỷ | ±30% | ±2.0 tỷ | Trung bình |
| Auto-review rate (B4) | 50% | ±20pp | ±1.2 tỷ | Thấp |
| Discount rate | 12% | ±3pp | ±1.5 tỷ | Thấp |
| Ramp-up speed | 44% Y1 avg | ±15pp | ±2.8 tỷ | Trung bình |

False reject reduction (B3) là yếu tố tác động lớn nhất. Nếu AI chỉ giảm từ chối nhầm 20% thay vì 30%, NPV vẫn đạt khoảng +25 tỷ. Nếu AI không giảm được từ chối nhầm, NPV vẫn đạt khoảng +10.5 tỷ nhờ tiết kiệm từ NPL và fraud. Khoản đầu tư AI-CRDS có NPV dương ngay cả khi B3 (opportunity cost) bằng 0.

---

## 5. TÓM TẮT CHO C-LEVEL (1 slide)

```
┌─────────────────────────────────────────────────────────┐
│          AI-CRDS: BUSINESS CASE SUMMARY — BANK X        │
│                                                         │
│  VẤN ĐỀ: Mở thẻ tín dụng đang tốn ~96 tỷ VND/năm       │
│  ├── Credit loss (NPL):      26 tỷ  (28%)              │
│  ├── Fraud loss:              14 tỷ  (15%)              │
│  ├── Từ chối nhầm khách tốt: 52 tỷ  (54%)              │
│  └── Chi phí thẩm định thủ công: 3 tỷ  (3%)            │
│                                                         │
│  GIẢI PHÁP: AI-CRDS scoring + fraud detection            │
│  ├── Đầu tư Year 1:        ~10 tỷ VND                   │
│  ├── Chi phí vận hành:     ~2.5 tỷ VND/năm              │
│  └── Tiết kiệm kỳ vọng:    ~27 tỷ VND/năm               │
│                                                         │
│  ROI:                                                    │
│  ├── Hòa vốn:              Tháng 11                      │
│  ├── NPV (3 năm):          +34 tỷ VND                   │
│  ├── IRR:                  142%                          │
│  └── Lợi ích ròng 3 năm:   +54 tỷ VND                   │
│                                                         │
│  ĐỀ XUẤT: Phê duyệt Phase 0 — 8 tuần shadow testing      │
│  ├── Ngân sách: 365M VND (xem w04-03-budget-estimate-v0)│
│  └── Rủi ro: AI chỉ quan sát, không ra quyết định       │
└─────────────────────────────────────────────────────────┘
```

---

## 6. BUILD vs BUY COMPARISON

| Factor | Build In-house | Buy Vendor (FICO/local) |
|--------|---------------|----------------------|
| Year 1 cost | 9.65 tỷ (base) | 8-15 tỷ (license + integration) |
| Ongoing cost | 2.35 tỷ/năm | 3-6 tỷ/năm (license định kỳ) |
| 3-year total | 14.55 tỷ | 17-27 tỷ |
| Customization | Toàn quyền kiểm soát | Hạn chế theo roadmap của vendor |
| Data ownership | 100% nội bộ | Vendor có thể truy cập dữ liệu |
| Time to deploy | 8-12 tháng | 4-8 tháng |
| IP ownership | Bank X sở hữu | Vendor sở hữu |
| Regulatory fit | Thiết kế cho VN (Luật AI, BVDLCN, SBV) | Có thể cần điều chỉnh cho VN |
| Model transparency | Giải thích được đầy đủ | Rủi ro hộp đen |
| Scaling | Cần tuyển thêm người | Vendor đảm nhiệm |

Khuyến nghị: tự phát triển (in-house) phù hợp với bối cảnh Bank X nhờ tuân thủ quy định (khả năng giải thích theo Luật AI 134/2025, lưu trữ dữ liệu trong nước theo BVDLCN), quyền sở hữu dữ liệu và lợi thế chi phí dài hạn.

---

## 7. ASSUMPTIONS LOG

Các giả định chính của mô hình được ghi nhận dưới đây; danh mục đầy đủ nằm tại w04-04-assumptions-log. Khi có dữ liệu thực của Bank X, các giả định được cập nhật và mô hình được tính lại.

| # | Assumption | Value Used | Confidence | Source |
|---|-----------|-----------|-----------|--------|
| A1 | CC applications/tháng | 3,000 | Thấp | Ước tính ngân hàng cỡ trung |
| A2 | Approval rate | 60% | Thấp | Trung bình ngành |
| A3 | Average CC limit | 50M VND | Trung bình | 2-3 lần thu nhập có lương (~20M) |
| A4 | CC NPL rate | 3.5% | Trung bình | FiinRatings 2024, Statista 2023. NPL toàn hệ thống ~2%, riêng thẻ tín dụng cao hơn. |
| A5 | LGD (unsecured CC) | 70% | Trung bình | Chuẩn ngành. Thu hồi nợ tại VN thấp (~20-30%). |
| A6 | Fraud rate at origination | 0.8% | Trung bình | Visa VN Q2 2025: thấp hơn trung bình SEA. Fraud tại origination thấp hơn fraud giao dịch. |
| A7 | False rejection rate | 10% | Thấp (khó chứng minh nhất) | Ước tính ngành. |
| A8 | CC LTV | 36M VND / 3 năm | Trung bình | Lãi + phí + interchange tổng hợp. |
| A9 | CO all-in cost | 18M/tháng | Trung bình | Salary guide 2025. Chuyên viên tín dụng 10-20M + chi phí chung. |
| A10 | AI NPL reduction | -20% | Thấp | Khoảng trong tài liệu học thuật: -10% đến -40%. Thận trọng cho v1. |
| A11 | AI fraud detection improvement | +30% | Thấp | Phụ thuộc chất lượng model và tích hợp eKYC. |
| A12 | AI false reject reduction | -30% | Thấp | Giả định có tác động lớn nhất; được đo bằng shadow testing. |
| A13 | Auto-review rate | 50% | Thấp | Phụ thuộc thiết lập ngưỡng và mức độ tin tưởng của CO. |
| A14 | Ramp-up schedule | 44% Y1 trung bình | Trung bình | Theo lộ trình triển khai AI điển hình. |
| A15 | Discount rate | 12% | Cao | Lãi suất phi rủi ro VN + equity premium. Chuẩn doanh nghiệp. |
| A16 | ML Engineer salary (senior) | 40-70M/tháng | Cao | Salary guide Adecco, Reeracoen 2025. |

### Assumption Risk Ranking

| Risk level | Assumptions | Impact if wrong | Mitigation |
|-----------|------------|----------------|-----------|
| Rủi ro cao, tác động cao | A7 (false reject), A10-A13 (AI improvement) | NPV có thể dao động ±20 tỷ | Shadow testing: thay giả định bằng số liệu thực |
| Rủi ro trung bình | A1-A4 (volume, NPL, limit), A8 (LTV) | NPV dao động ±10 tỷ | Số liệu nội bộ của Bank X |
| Rủi ro thấp | A5 (LGD), A9 (CO cost), A15-A16 (lãi suất, lương) | NPV dao động ±3 tỷ | Benchmark ngành đáng tin cậy |

---

## 8. PHẠM VI VÀ LƯU Ý

1. Toàn bộ số liệu là giả định lập kế hoạch; mức độ tin cậy được ghi trong bảng giả định. Giả định A7 (false reject rate) và A10-A13 (cải thiện nhờ AI) có tin cậy thấp nhất nhưng tác động cao nhất, và được kiểm chứng bằng shadow testing.
2. Benefit B3 (opportunity cost) chiếm 58% tổng lợi ích. Ngay cả khi B3 bằng 0, NPV vẫn dương khoảng +10.5 tỷ nhờ tiết kiệm từ NPL và fraud.
3. Lịch ramp-up (44% ở Year 1) là thận trọng, phù hợp bối cảnh ngân hàng cần thời gian quản trị thay đổi và xây dựng niềm tin của Credit Officer.
4. Khoản đầu tư không bao gồm: chi phí chìm (thời gian nghiên cứu đã dùng), chi phí cơ hội của đội ngũ không thực hiện dự án khác, và khoản phạt quy định tiềm ẩn.
5. Tài liệu liên quan: w04-01-damage-model-bank-x (các tầng thiệt hại), w02-04-sbv-requirements (cơ sở chi phí tuân thủ), w02-03-pdpd-impact-bank-x (cơ sở chi phí DPIA).
