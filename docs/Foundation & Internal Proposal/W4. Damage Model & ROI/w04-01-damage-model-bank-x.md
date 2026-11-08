# Damage Model & Break-even Analysis — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## Mục đích

Chuyển rủi ro tín dụng thẻ tại Bank X thành bảng thiệt hại đo được bằng tiền. Tài liệu phục vụ:
1. Đề xuất nội bộ gửi C-level (w11-04-impact-and-roi)
2. Tính ROI cho khoản đầu tư AI-CRDS
3. Thiết kế ngưỡng quyết định, cân bằng chi phí của quyết định sai (w06-02-cost-of-error-table)

**Lưu ý về số liệu:** Số liệu trong tài liệu là giả định lập kế hoạch, xây dựng từ nguồn công khai (xem mục Nguồn tham khảo). Các số này sẽ được thay bằng dữ liệu thực của Bank X khi có.

---

## Baseline Assumptions — Hồ sơ Bank X

Hồ sơ dưới đây mô tả Bank X là ngân hàng thương mại cỡ trung, phân khúc thẻ tín dụng cho khách hàng hưởng lương.

| Parameter | Value | Source / Assumption |
|----------|-------|-------------------|
| CC applications/tháng | 3,000 | Giả định cho ngân hàng cỡ trung. Khoảng: 1,500-5,000. |
| Approval rate hiện tại | 55-65% | Trung bình ngành tại Việt Nam. |
| Applications approved/tháng | ~1,800 | 3,000 × 60% |
| Average CC limit (salaried) | 50M VND (~$2,000) | 2-3 lần thu nhập hàng tháng. Thu nhập khai báo trung bình ~20M → hạn mức 40-60M. |
| Average outstanding balance | 25M VND | ~50% mức sử dụng hạn mức (trung bình ngành). |
| CC NPL rate (on-balance sheet) | 3.5% | NPL toàn hệ thống VN ~2%, riêng thẻ tín dụng cao hơn. Khoảng: 2-6%. VPBank 5.7%, VCB 0.7% (Statista/Mirae Asset 2023). |
| CC interest rate | 24-36% p.a. | Mức chuẩn thẻ tín dụng VN. Lãi revolving ~2-3%/tháng. |
| Annual fee per card | 300K-1.5M VND | Tùy hạng thẻ. Trung bình ~500K. |
| Interchange fee | 1.5-2.5% per transaction | MDR chia sẻ giữa issuer và acquirer. |
| Credit Officer salary (all-in) | 18M VND/tháng | Lương 12-15M + BHXH + chi phí chung. Khoảng: 15-25M all-in. |
| CO capacity | ~15-20 applications/ngày | Thẩm định đầy đủ: 30-45 phút/hồ sơ. Thẩm định nhanh: 10-15 phút. |
| CO team size | 8-12 người | Cho 3,000 hồ sơ/tháng với ~15 hồ sơ/ngày/người × 22 ngày. |

---

## TIER 1 — CREDIT LOSS (NPL)

### 1.1 Expected Loss Formula

```
Expected Loss = PD × LGD × EAD

PD  = Probability of Default = 3.5% (baseline)
LGD = Loss Given Default = 70% (CC unsecured, VN recovery ~20-30%)
EAD = Exposure at Default = 50M VND (hạn mức trung bình, trường hợp xấu nhất: sử dụng hết hạn mức khi vỡ nợ)
```

### 1.2 Expected Loss — Per Application

| Scenario | PD | LGD | EAD | EL per approved app | Basis |
|---------|------|------|------|-------------------|-------|
| Conservative | 2.5% | 60% | 40M | 600K VND | Kịch bản tốt: sàng lọc tốt, kinh tế ổn định. Mức NPL tương đương VCB. |
| Base case | 3.5% | 70% | 50M | 1.225M VND | Trung bình ngành thẻ tín dụng VN, ngân hàng cỡ trung. |
| Worst case | 6.0% | 80% | 60M | 2.88M VND | Kinh tế suy giảm, sàng lọc lỏng. Mức NPL tương đương VPBank. |

### 1.3 Expected Loss — Per Tháng & Per Năm

| Scenario | EL/app | Apps approved/tháng | EL/tháng | EL/năm |
|---------|--------|-------------------|------------|----------|
| Conservative | 600K | 1,800 | 1.08 tỷ VND | 12.96 tỷ VND |
| Base case | 1.225M | 1,800 | 2.205 tỷ VND | 26.46 tỷ VND |
| Worst case | 2.88M | 1,800 | 5.184 tỷ VND | 62.21 tỷ VND |

### 1.4 AI Impact — Khi AI giảm NPL

| NPL reduction | EL/năm (base) | Saving/năm | Assumption |
|-------------- |--------------|-----------|-----------|
| -10% (3.5% → 3.15%) | 23.81 tỷ | 2.65 tỷ VND | Tác động AI thận trọng |
| -20% (3.5% → 2.8%) | 21.17 tỷ | 5.29 tỷ VND | Tác động AI trung bình |
| -30% (3.5% → 2.45%) | 18.52 tỷ | 7.94 tỷ VND | Tác động AI tích cực |

---

## TIER 2 — FRAUD LOSS

### 2.1 Fraud tại origination

Fraud tại khâu mở thẻ là trường hợp người nộp hồ sơ dùng danh tính hoặc giấy tờ giả để mở thẻ rồi rút tiền.

| Parameter | Value | Source |
|----------|-------|-------|
| Fraud rate tại origination | 0.5-1.5% applications | Visa VN (Q2 2025): tỷ lệ fraud tại VN đang giảm, dưới trung bình SEA. 93% fraud đến từ online/cross-border. Fraud tại origination thấp hơn fraud giao dịch. |
| Loss per fraud case | 100% of limit | Fraud rút hết hạn mức và không hoàn trả. LGD = 100%. |
| Average limit (fraud case) | 50M VND | Đối tượng gian lận thường nhắm hạn mức cao. |

### 2.2 Fraud Loss — 3 Scenarios

| Scenario | Fraud rate | Volume/tháng | Loss/case | Loss/tháng | Loss/năm |
|---------|-----------|-------------|----------|-------------|-----------|
| Conservative | 0.3% | 9 cases | 50M | 450M VND | 5.4 tỷ VND |
| Base case | 0.8% | 24 cases | 50M | 1.2 tỷ VND | 14.4 tỷ VND |
| Worst case | 1.5% | 45 cases | 50M | 2.25 tỷ VND | 27 tỷ VND |

### 2.3 AI Impact — Khi AI cải thiện phát hiện fraud

| Detection improvement | Fraud loss/năm (base) | Saving/năm |
|---------------------|---------------------|-----------|
| Phát hiện thêm 20% fraud | 11.52 tỷ | 2.88 tỷ VND |
| Phát hiện thêm 40% fraud | 8.64 tỷ | 5.76 tỷ VND |
| Phát hiện thêm 60% fraud | 5.76 tỷ | 8.64 tỷ VND |

---

## TIER 3 — OPPORTUNITY COST (Từ chối nhầm)

### 3.1 False Positive: khách hàng tốt bị từ chối

| Parameter | Value | Source / Assumption |
|----------|-------|-------------------|
| False rejection rate hiện tại | 8-15% of total rejections | Ước tính: trong 40% hồ sơ bị từ chối (~1,200/tháng), 8-15% thực tế là khách hàng tốt. Thẩm định thủ công có thiên lệch và thiếu nhất quán. |
| Good applicants bị từ chối/tháng | 96-180 người | 1,200 × 8-15% |
| CC Lifetime Value (LTV) | 5-15M VND/năm/thẻ | Doanh thu mỗi thẻ gồm lãi (nếu revolve), phí thường niên và interchange. Khách revolving: 10-15M/năm. Khách chỉ thanh toán (transactor): 2-5M/năm. Trung bình: ~8M. |
| Average CC lifespan | 3-5 năm | Trung bình ngành. |
| Lifetime revenue per card | 24-60M VND | 8M/năm × 3-5 năm. |

### 3.2 Opportunity Cost — 3 Scenarios

| Scenario | False reject rate | Falsely rejected/tháng | LTV/card | Opportunity cost/năm |
|---------|------------------|----------------------|---------|----------------------|
| Conservative | 5% | 60 | 24M | 17.28 tỷ VND |
| Base case | 10% | 120 | 36M | 51.84 tỷ VND |
| Worst case | 15% | 180 | 48M | 103.68 tỷ VND |

### 3.3 AI Impact — Khi AI giảm từ chối nhầm

| False reject reduction | Recovered customers/năm | Revenue recovered/năm |
|----------------------|----------------------|---------------------|
| -20% (10% → 8%) | 288 | 10.37 tỷ VND |
| -40% (10% → 6%) | 576 | 20.74 tỷ VND |
| -50% (10% → 5%) | 720 | 25.92 tỷ VND |

---

## TIER 4 — OPERATIONAL COST (Thẩm định thủ công)

### 4.1 Manual Review Economics

| Parameter | Value | Calculation |
|----------|-------|-----------|
| CO all-in cost/tháng | 18M VND | Lương + BHXH + chi phí chung |
| CO working days/tháng | 22 | |
| CO working hours/ngày | 8 | |
| CO productive hours/ngày | 6 | Hiệu suất 75% (họp, nghỉ, hành chính) |
| Review time/application | 35 phút | Thẩm định đầy đủ: hồ sơ, tra cứu CIC, quyết định, ghi nhận |
| Applications/CO/ngày | ~10 full reviews | 6h × 60 phút / 35 phút |
| Applications/tháng (team) | 2,200 | 10 × 22 × 10 CO |
| Cost per manual review | ~82K VND | 18M / 22 / 10 |

### 4.2 Operational Cost — 3 Scenarios

| Scenario | Apps/tháng | CO team size | Review time | Cost/review | Ops cost/tháng | Ops cost/năm |
|---------|-----------|------------|-----------|-----------|-----------------|---------------|
| Conservative | 2,000 | 8 | 25 phút | 60K | 120M VND | 1.44 tỷ VND |
| Base case | 3,000 | 12 | 35 phút | 82K | 246M VND | 2.95 tỷ VND |
| Worst case | 5,000 | 18 | 40 phút | 90K | 450M VND | 5.4 tỷ VND |

### 4.3 AI Impact — Khi AI giảm khối lượng thẩm định thủ công

AI đề xuất phê duyệt các hồ sơ có độ tin cậy cao; Credit Officer chỉ thẩm định các hồ sơ độ tin cậy trung bình/thấp và các trường hợp override.

| Auto-approve rate | Manual reviews/tháng (base) | CO team needed | Ops saving/năm |
|-----------------|--------------------------|---------------|------------------|
| 30% auto | 2,100 | 9 (-3) | 0.89 tỷ VND |
| 50% auto | 1,500 | 7 (-5) | 1.48 tỷ VND |
| 70% auto | 900 | 4 (-8) | 2.36 tỷ VND |

"Auto-approve" nghĩa là AI đề xuất và Credit Officer xác nhận theo lô; con người vẫn giữ vai trò quyết định theo Luật AI 134/2025. Thời gian xử lý của Credit Officer giảm từ 35 phút xuống 3-5 phút cho mỗi lần xác nhận theo lô.

---

## TỔNG HỢP — TOTAL DAMAGE & AI SAVINGS

### Total Annual Damage (chi phí khi không hành động)

| Tier | Conservative | Base case | Worst case |
|------|-------------|----------|-----------|
| T1: Credit Loss | 12.96 tỷ | 26.46 tỷ | 62.21 tỷ |
| T2: Fraud Loss | 5.4 tỷ | 14.4 tỷ | 27 tỷ |
| T3: Opportunity Cost | 17.28 tỷ | 51.84 tỷ | 103.68 tỷ |
| T4: Ops Cost | 1.44 tỷ | 2.95 tỷ | 5.4 tỷ |
| TOTAL | 37.08 tỷ | 95.65 tỷ | 198.29 tỷ |

Ở kịch bản cơ sở, Bank X thiệt hại khoảng 95.65 tỷ VND/năm tại kênh mở thẻ tín dụng do tổn thất tín dụng, fraud, doanh thu bị bỏ lỡ và chi phí vận hành chưa tối ưu.

### Total AI Savings (tác động AI thận trọng)

| Tier | AI improvement | Annual saving |
|------|---------------|-------------|
| T1 | NPL giảm 20% | 5.29 tỷ |
| T2 | Phát hiện fraud +30% | 4.32 tỷ |
| T3 | Từ chối nhầm giảm 30% | 15.55 tỷ |
| T4 | Auto-review 50% | 1.48 tỷ |
| TOTAL SAVING | | 26.64 tỷ VND/năm |

---

## BREAK-EVEN ANALYSIS

### AI-CRDS Investment Estimate (Year 1)

| Cost item | Low | Medium | High | Note |
|----------|-----|--------|------|------|
| AI-CRDS development (in-house) | 2 tỷ | 4 tỷ | 7 tỷ | 2-3 ML engineers + hạ tầng + quản lý dự án |
| Infrastructure (cloud VN) | 500M | 1 tỷ | 2 tỷ | Viettel/FPT Cloud, GPU nếu cần |
| CIC API cost (incremental) | 200M | 500M | 1 tỷ | Phí mỗi truy vấn × khối lượng |
| Integration (CBS, eKYC) | 500M | 1 tỷ | 2 tỷ | Nỗ lực của đội IT |
| Compliance (DPIA, legal, DPO) | 300M | 500M | 1 tỷ | Tư vấn pháp lý, DPIA, kiểm toán |
| Training & change management | 200M | 400M | 700M | Đào tạo CO, tài liệu |
| Ongoing ops (Year 1) | 1 tỷ | 2 tỷ | 3 tỷ | Giám sát, bảo trì, làm mới model |
| TOTAL Year 1 | 4.7 tỷ | 9.4 tỷ | 16.7 tỷ | |

### Break-even Timeline

| Scenario | Investment | AI saving/năm | Break-even |
|---------|-----------|-------------|-------------|
| Optimistic | 4.7 tỷ | 26.64 tỷ | ~2.1 tháng |
| Base | 9.4 tỷ | 26.64 tỷ | ~4.2 tháng |
| Conservative | 16.7 tỷ | 26.64 tỷ | ~7.5 tháng |

AI-CRDS hòa vốn trong khoảng 3-8 tháng đầu vận hành, tính từ thời điểm triển khai và không tính thời gian phát triển.

### ROI 3-Year

| | Year 1 | Year 2 | Year 3 | Cumulative |
|--|--------|--------|--------|-----------|
| Investment | 9.4 tỷ | 3 tỷ (ops) | 3 tỷ (ops) | 15.4 tỷ |
| Saving | 13.32 tỷ (6 tháng production) | 26.64 tỷ | 29.30 tỷ (+10% cải thiện) | 69.26 tỷ |
| Net | +3.92 tỷ | +23.64 tỷ | +26.30 tỷ | +53.86 tỷ |
| ROI | 42% | 788% | 877% | 350% |

---

## COST-OF-ERROR TABLE (cho thiết kế ngưỡng quyết định)

| Error type | Mô tả | Cost per error | Frequency | Annual cost (base) |
|-----------|-------|---------------|----------|------------------|
| False Negative (FN) | Phê duyệt khách hàng rủi ro | 1.225M VND (EL) | ~63/tháng (3.5% của 1,800) | 26.46 tỷ |
| False Positive (FP) | Từ chối khách hàng tốt | 36M VND (LTV mất đi) | ~120/tháng (10% từ chối nhầm) | 51.84 tỷ |
| Fraud Miss | Phê duyệt đối tượng gian lận | 50M VND (toàn bộ hạn mức) | ~24/tháng (0.8%) | 14.4 tỷ |
| Fraud False Alarm | Gắn cờ nhầm khách hàng hợp lệ là fraud | 36M VND (LTV mất đi) + ảnh hưởng trải nghiệm khách hàng | ~15/tháng (ước tính) | 6.48 tỷ |

Chi phí mỗi ca FP (36M) cao hơn nhiều so với FN (1.225M), nên ngưỡng phê duyệt thông thường thiên về chấp nhận thêm một mức rủi ro nhỏ để không mất khách hàng tốt. Chi phí Fraud Miss (50M) rất cao, nên ngưỡng fraud được thiết lập thận trọng: từ chối khi có nghi ngờ. Chi tiết xem w06-02-cost-of-error-table.

---

## Nguồn tham khảo

| # | Nguồn | Data point | Thời điểm |
|---|-------|-----------|-----------|
| 1 | Statista / Mirae Asset | Tỷ lệ NPL ngân hàng VN: VPBank 5.7%, VCB 0.7% | 11/2023 |
| 2 | FiinRatings Banking Report 2024 | NPL on-balance toàn hệ thống ~1.69% (không gồm ngân hàng kiểm soát đặc biệt), gross ~3.36% | 2024 |
| 3 | VietnamPlus / S&P | Tỷ lệ NPL gồm SML ổn định ~2%. Dự báo NIM tăng 5-10bps lên 3.5% | 06/2025 |
| 4 | Visa Vietnam / Congthuong | Tỷ lệ fraud thẻ giảm, dưới trung bình SEA. 93% fraud từ online. | Q2 2025 |
| 5 | InsightAsia | Thị trường thẻ tín dụng VN: khối lượng giao dịch $3.8B. Mức thâm nhập 14.3% dân số có tài khoản ngân hàng. | 2024 |
| 6 | FiinGroup CC Market Report | Dư nợ thẻ tín dụng mở rộng. Thẻ quốc tế tăng thị phần. | 2025 |
| 7 | Vietnam Salary Guide 2025 | Chuyên viên tín dụng 10-20M/tháng. Lương trung bình 8.2M. | 2025 |
| 8 | GSO Vietnam | Thu nhập bình quân Q1 2025: 8.3M VND/tháng, +10.1% YoY | 2025 |
| 9 | GFT / various | Mức thâm nhập thẻ tín dụng 3%. Doanh thu ngân hàng số >$1B. | 2025 |
