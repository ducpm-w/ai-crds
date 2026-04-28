# Damage Model & Break-even Analysis — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Biến rủi ro credit tại Bank X thành bảng thiệt hại đo được bằng tiền. Phục vụ:
1. Internal proposal C-level (Week 11)
2. ROI calculation cho AI-CRDS investment
3. Threshold design (Week 6) — trade-off giữa FP cost và FN cost

**⚠️ Disclaimer:** Tất cả số liệu là ước tính dựa trên nguồn công khai (xem Section 7). Khi có số nội bộ Bank X → thay thế ngay. Không bịa — ghi rõ source + assumption.

---

## Baseline Assumptions — "Bank X" Profile

Dựa trên target bank profile (medium-sized commercial bank, CC salaried segment):

| Parameter | Value | Source / Assumption |
|----------|-------|-------------------|
| CC applications/tháng | 3,000 | Ước tính mid-size bank. Range: 1,500-5,000. ❓ Cần validate. |
| Approval rate hiện tại | 55-65% | Industry average VN. ❓ Cần validate. |
| Applications approved/tháng | ~1,800 | 3,000 × 60% |
| Average CC limit (salaried) | 50M VND (~$2,000) | 2-3x monthly income. Salaried avg income ~20M declared → limit 40-60M. |
| Average outstanding balance | 25M VND | ~50% utilization (industry avg). |
| CC NPL rate (on-balance sheet) | 3.5% | VN system-wide NPL ~2%. CC-specific higher. Range: 2-6%. VPBank 5.7%, VCB 0.7% (Statista/Mirae Asset 2023). |
| CC interest rate | 24-36% p.a. | VN CC standard. Revolving rate ~2-3%/tháng. |
| Annual fee per card | 300K-1.5M VND | Tùy hạng thẻ. Average ~500K. |
| Interchange fee | 1.5-2.5% per transaction | MDR chia sẻ issuer/acquirer. |
| Credit Officer salary (all-in) | 18M VND/tháng | Salary 12-15M + BHXH + overhead. Range: 15-25M all-in. |
| CO capacity | ~15-20 applications/ngày | Full review: 30-45 phút/hồ sơ. Quick review: 10-15 phút. |
| CO team size | 8-12 người | Cho 3,000 apps/tháng at ~15 apps/ngày/người × 22 ngày. |

---

## TIER 1 — CREDIT LOSS (NPL)

### 1.1 Expected Loss Formula

```
Expected Loss = PD × LGD × EAD

PD  = Probability of Default = 3.5% (baseline)
LGD = Loss Given Default = 70% (CC unsecured, VN recovery ~20-30%)
EAD = Exposure at Default = 50M VND (average limit, worst case: full utilization at default)
```

### 1.2 Expected Loss — Per Application

| Scenario | PD | LGD | EAD | EL per approved app | Basis |
|---------|------|------|------|-------------------|-------|
| **Conservative** | 2.5% | 60% | 40M | **600K VND** | Best-case: good screening, economy stable. VCB-level NPL. |
| **Base case** | 3.5% | 70% | 50M | **1.225M VND** | Industry average VN CC. Mid-size bank typical. |
| **Worst case** | 6.0% | 80% | 60M | **2.88M VND** | Economy downturn, loose screening. VPBank-level NPL. |

### 1.3 Expected Loss — Per Tháng & Per Năm

| Scenario | EL/app | Apps approved/tháng | **EL/tháng** | **EL/năm** |
|---------|--------|-------------------|------------|----------|
| **Conservative** | 600K | 1,800 | **1.08 tỷ VND** | **12.96 tỷ VND** |
| **Base case** | 1.225M | 1,800 | **2.205 tỷ VND** | **26.46 tỷ VND** |
| **Worst case** | 2.88M | 1,800 | **5.184 tỷ VND** | **62.21 tỷ VND** |

### 1.4 AI Impact — Nếu AI giảm NPL

| NPL reduction | EL/năm (base) | Saving/năm | Assumption |
|-------------- |--------------|-----------|-----------|
| -10% (3.5% → 3.15%) | 23.81 tỷ | **2.65 tỷ VND** | Conservative AI impact |
| -20% (3.5% → 2.8%) | 21.17 tỷ | **5.29 tỷ VND** | Moderate AI impact |
| -30% (3.5% → 2.45%) | 18.52 tỷ | **7.94 tỷ VND** | Aggressive AI impact |

---

## TIER 2 — FRAUD LOSS

### 2.1 Fraud tại origination

Fraud tại CC origination = applicant dùng identity giả / documents giả để mở CC rồi rút tiền.

| Parameter | Value | Source |
|----------|-------|-------|
| Fraud rate tại origination | 0.5-1.5% applications | Visa VN (Q2 2025): VN fraud rate đang giảm, dưới trung bình SEA. 93% fraud từ online/cross-border. Origination fraud thấp hơn transaction fraud. |
| Loss per fraud case | 100% of limit | Fraud = full limit maxed out, không trả. LGD = 100%. |
| Average limit (fraud case) | 50M VND | Fraudsters thường target limit cao. |

### 2.2 Fraud Loss — 3 Scenarios

| Scenario | Fraud rate | Volume/tháng | Loss/case | **Loss/tháng** | **Loss/năm** |
|---------|-----------|-------------|----------|-------------|-----------|
| **Conservative** | 0.3% | 9 cases | 50M | **450M VND** | **5.4 tỷ VND** |
| **Base case** | 0.8% | 24 cases | 50M | **1.2 tỷ VND** | **14.4 tỷ VND** |
| **Worst case** | 1.5% | 45 cases | 50M | **2.25 tỷ VND** | **27 tỷ VND** |

### 2.3 AI Impact — Nếu AI fraud detection cải thiện

| Detection improvement | Fraud loss/năm (base) | Saving/năm |
|---------------------|---------------------|-----------|
| Detect thêm 20% fraud | 11.52 tỷ | **2.88 tỷ VND** |
| Detect thêm 40% fraud | 8.64 tỷ | **5.76 tỷ VND** |
| Detect thêm 60% fraud | 5.76 tỷ | **8.64 tỷ VND** |

---

## TIER 3 — OPPORTUNITY COST (Reject nhầm)

### 3.1 False Positive = Good applicant bị reject

| Parameter | Value | Source / Assumption |
|----------|-------|-------------------|
| False rejection rate hiện tại | 8-15% of total rejections | Ước tính: trong 40% bị reject (~1,200/tháng), 8-15% thực ra là good applicant. Manual screening có bias + inconsistency. |
| Good applicants bị reject / tháng | 96-180 người | 1,200 × 8-15% |
| CC Lifetime Value (LTV) | 5-15M VND/năm/thẻ | Revenue per CC: interest (nếu revolve) + annual fee + interchange. Revolving customers: 10-15M/năm. Transactor: 2-5M/năm. Blended: ~8M. |
| Average CC lifespan | 3-5 năm | Industry average. |
| Lifetime revenue per card | 24-60M VND | 8M/năm × 3-5 năm. |

### 3.2 Opportunity Cost — 3 Scenarios

| Scenario | False reject rate | Falsely rejected/tháng | LTV/card | **Opportunity cost/năm** |
|---------|------------------|----------------------|---------|----------------------|
| **Conservative** | 5% | 60 | 24M | **17.28 tỷ VND** |
| **Base case** | 10% | 120 | 36M | **51.84 tỷ VND** |
| **Worst case** | 15% | 180 | 48M | **103.68 tỷ VND** |

### 3.3 AI Impact — Nếu AI giảm false rejection

| False reject reduction | Recovered customers/năm | Revenue recovered/năm |
|----------------------|----------------------|---------------------|
| -20% (10% → 8%) | 288 | **10.37 tỷ VND** |
| -40% (10% → 6%) | 576 | **20.74 tỷ VND** |
| -50% (10% → 5%) | 720 | **25.92 tỷ VND** |

---

## TIER 4 — OPERATIONAL COST (Manual Review)

### 4.1 Manual Review Economics

| Parameter | Value | Calculation |
|----------|-------|-----------|
| CO all-in cost/tháng | 18M VND | Salary + BHXH + overhead |
| CO working days/tháng | 22 | |
| CO working hours/ngày | 8 | |
| CO productive hours/ngày | 6 | 75% efficiency (meetings, breaks, admin) |
| Review time/application | 35 phút | Full review: documentation, CIC check, decision, logging |
| Applications/CO/ngày | ~10 full reviews | 6h × 60min / 35min |
| Applications/tháng (team) | 2,200 | 10 × 22 × 10 CO |
| **Cost per manual review** | **~82K VND** | 18M / 22 / 10 |

### 4.2 Operational Cost — 3 Scenarios

| Scenario | Apps/tháng | CO team size | Review time | Cost/review | **Ops cost/tháng** | **Ops cost/năm** |
|---------|-----------|------------|-----------|-----------|-----------------|---------------|
| **Conservative** | 2,000 | 8 | 25 min | 60K | **120M VND** | **1.44 tỷ VND** |
| **Base case** | 3,000 | 12 | 35 min | 82K | **246M VND** | **2.95 tỷ VND** |
| **Worst case** | 5,000 | 18 | 40 min | 90K | **450M VND** | **5.4 tỷ VND** |

### 4.3 AI Impact — Nếu AI giảm manual review volume

AI auto-approve high-confidence cases → CO chỉ review medium/low confidence + overrides.

| Auto-approve rate | Manual reviews/tháng (base) | CO team needed | **Ops saving/năm** |
|-----------------|--------------------------|---------------|------------------|
| 30% auto | 2,100 | 9 (-3) | **0.89 tỷ VND** |
| 50% auto | 1,500 | 7 (-5) | **1.48 tỷ VND** |
| 70% auto | 900 | 4 (-8) | **2.36 tỷ VND** |

**Lưu ý:** "Auto-approve" = AI recommend + CO batch-confirm (human-in-the-loop vẫn giữ, Luật AI 134/2025). CO time giảm từ 35 phút → 3-5 phút per batch-confirm.

---

## TỔNG HỢP — TOTAL DAMAGE & AI SAVINGS

### Total Annual Damage (Cost of Inaction)

| Tier | Conservative | Base case | Worst case |
|------|-------------|----------|-----------|
| **T1: Credit Loss** | 12.96 tỷ | 26.46 tỷ | 62.21 tỷ |
| **T2: Fraud Loss** | 5.4 tỷ | 14.4 tỷ | 27 tỷ |
| **T3: Opportunity Cost** | 17.28 tỷ | 51.84 tỷ | 103.68 tỷ |
| **T4: Ops Cost** | 1.44 tỷ | 2.95 tỷ | 5.4 tỷ |
| **TOTAL** | **37.08 tỷ** | **95.65 tỷ** | **198.29 tỷ** |

**Base case: Bank X đang "mất" ~95.65 tỷ VND/năm** từ credit loss, fraud, missed revenue, và operational inefficiency ở CC origination channel.

### Total AI Savings (Conservative AI Impact)

| Tier | AI improvement | Annual saving |
|------|---------------|-------------|
| **T1** | NPL giảm 20% | 5.29 tỷ |
| **T2** | Fraud detect +30% | 4.32 tỷ |
| **T3** | False reject giảm 30% | 15.55 tỷ |
| **T4** | Auto-review 50% | 1.48 tỷ |
| **TOTAL SAVING** | | **26.64 tỷ VND/năm** |

---

## BREAK-EVEN ANALYSIS

### AI-CRDS Investment Estimate (Year 1)

| Cost item | Low | Medium | High | Note |
|----------|-----|--------|------|------|
| AI-CRDS development (in-house) | 2 tỷ | 4 tỷ | 7 tỷ | 2-3 ML engineers + infra + PM |
| Infrastructure (cloud VN) | 500M | 1 tỷ | 2 tỷ | Viettel/FPT Cloud, GPU nếu cần |
| CIC API cost (incremental) | 200M | 500M | 1 tỷ | Per-query fee × volume |
| Integration (CBS, eKYC) | 500M | 1 tỷ | 2 tỷ | IT team effort |
| Compliance (DPIA, legal, DPO) | 300M | 500M | 1 tỷ | Legal counsel, DPIA, audit |
| Training & change management | 200M | 400M | 700M | CO training, documentation |
| Ongoing ops (Year 1) | 1 tỷ | 2 tỷ | 3 tỷ | Monitoring, maintenance, model refresh |
| **TOTAL Year 1** | **4.7 tỷ** | **9.4 tỷ** | **16.7 tỷ** | |

### Break-even Timeline

| Scenario | Investment | AI saving/năm | **Break-even** |
|---------|-----------|-------------|-------------|
| Optimistic | 4.7 tỷ | 26.64 tỷ | **~2.1 tháng** |
| Base | 9.4 tỷ | 26.64 tỷ | **~4.2 tháng** |
| Conservative | 16.7 tỷ | 26.64 tỷ | **~7.5 tháng** |

**Kết luận: AI-CRDS break-even trong 3-8 tháng đầu vận hành** (sau deployment, không tính development time).

### ROI 3-Year

| | Year 1 | Year 2 | Year 3 | Cumulative |
|--|--------|--------|--------|-----------|
| **Investment** | 9.4 tỷ | 3 tỷ (ops) | 3 tỷ (ops) | 15.4 tỷ |
| **Saving** | 13.32 tỷ (6 tháng production) | 26.64 tỷ | 29.30 tỷ (+10% improvement) | 69.26 tỷ |
| **Net** | +3.92 tỷ | +23.64 tỷ | +26.30 tỷ | **+53.86 tỷ** |
| **ROI** | 42% | 788% | 877% | **350%** |

---

## COST-OF-ERROR TABLE (cho Threshold Design — Week 6)

| Error type | Mô tả | Cost per error | Frequency | Annual cost (base) |
|-----------|-------|---------------|----------|------------------|
| **False Negative (FN)** | Approve bad applicant | 1.225M VND (EL) | ~63/tháng (3.5% of 1,800) | 26.46 tỷ |
| **False Positive (FP)** | Reject good applicant | 36M VND (LTV lost) | ~120/tháng (10% false reject) | 51.84 tỷ |
| **Fraud Miss** | Approve fraudster | 50M VND (full limit) | ~24/tháng (0.8%) | 14.4 tỷ |
| **Fraud False Alarm** | Flag legit as fraud | 36M VND (LTV lost) + customer experience damage | ~15/tháng (ước tính) | 6.48 tỷ |

**Observation:** FP cost (36M) >> FN cost (1.225M) per case → **threshold nên bias toward approval** (accept slightly more risk để không mất good customers). Nhưng: fraud miss cost (50M) rất cao → **fraud threshold nên conservative** (reject khi nghi ngờ).

---

## Tracking — Tự hỏi cuối tuần

- [ ] Số liệu nội bộ Bank X đã có chưa? (NPL rate, approval rate, CC volume, CO team size)
- [ ] Assumption yếu nhất là gì? (Likely: false rejection rate — cần CO feedback)
- [ ] CFO/Finance đã review cost estimates chưa?
- [ ] Break-even analysis đã incorporate vào proposal chưa?
- [ ] Cost-of-error table đã share với Risk Manager cho threshold design chưa?

---

## Ghi Chú & Limitations

1. **Tất cả số liệu là ước tính.** Khi có internal data Bank X → replace ngay. Số thực có thể chênh 30-50%.
2. **Opportunity cost (Tier 3) là con số lớn nhất nhưng khó chứng minh nhất.** C-level có thể challenge "false reject rate 10% có evidence không?" → Cần CO interview data.
3. **AI savings assumptions (NPL -20%, fraud detect +30%, false reject -30%) là conservative** so với academic literature — nhưng realistic cho v1 deployment.
4. **LGD 70% cho CC unsecured** dựa trên industry benchmarks. VN recovery rate thấp (20-30%) do enforcement yếu cho consumer debt.
5. **Investment estimate không bao gồm:** opportunity cost của internal team time, potential regulatory fines, reputational cost.

---

## Nguồn tham khảo

| # | Nguồn | Data point | Thời điểm |
|---|-------|-----------|-----------|
| 1 | Statista / Mirae Asset | VN bank NPL ratios: VPBank 5.7%, VCB 0.7% | 11/2023 |
| 2 | FiinRatings Banking Report 2024 | System-wide on-balance NPL ~1.69% (excl. special control banks), gross ~3.36% | 2024 |
| 3 | VietnamPlus / S&P | NPL ratio including SML stable ~2%. NIM forecast +5-10bps to 3.5% | 06/2025 |
| 4 | Visa Vietnam / Congthuong | CC fraud rate declining, below SEA average. 93% fraud from online. | Q2 2025 |
| 5 | InsightAsia | VN CC market $3.8B transaction volume. Penetration 14.3% banked population. | 2024 |
| 6 | FiinGroup CC Market Report | CC outstanding expansion. International cards gaining share. | 2025 |
| 7 | Vietnam Salary Guide 2025 | Credit specialist 10-20M/month. Average salary 8.2M. | 2025 |
| 8 | GSO Vietnam | Average income Q1 2025: 8.3M VND/month, +10.1% YoY | 2025 |
| 9 | GFT / various | CC penetration 3%. Digital banking revenue >$1B. | 2025 |