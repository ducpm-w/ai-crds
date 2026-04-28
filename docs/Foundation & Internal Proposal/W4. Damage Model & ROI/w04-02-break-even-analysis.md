# Break-even Analysis — AI-CRDS
> **Tags:** `[Business]` `[Finance]` `[C-Level]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 4
> **Version:** v1.0
> **Ngày:** 02/04/2026

---

## Mục đích

Trả lời 3 câu hỏi C-level:
1. AI-CRDS tốn bao nhiêu?
2. Tiết kiệm bao nhiêu?
3. Bao lâu hòa vốn?

Dựa trên damage model v1.0 (xem `damage-model.md`). Tất cả số liệu là ước tính — khi có internal data Bank X → replace.

---

## 1. COST SIDE — AI-CRDS Tốn Bao Nhiêu?

### 1.1 Build Cost (one-time, Year 1)

| # | Hạng mục | Low | Base | High | Ghi chú |
|---|---------|-----|------|------|---------|
| C1 | **AI/ML Development** | 1.5 tỷ | 3 tỷ | 5 tỷ | 1-2 ML engineers × 12 tháng. Model development, feature engineering, testing. In-house: lower. Vendor: higher. |
| C2 | **Backend/Integration** | 800M | 1.5 tỷ | 3 tỷ | CIC API integration, CBS connector, eKYC integration, audit trail, API gateway. 1-2 backend devs × 8-12 tháng. |
| C3 | **Frontend/UX** | 400M | 800M | 1.5 tỷ | Credit Officer review UI, dashboard, admin panel. 1 frontend dev × 6-10 tháng. |
| C4 | **Infrastructure setup** | 300M | 600M | 1.2 tỷ | VN cloud setup (Viettel/FPT Cloud), CI/CD pipeline, monitoring, staging environment. |
| C5 | **Project Management** | 400M | 800M | 1.2 tỷ | AI-Native PM full-time. Scrum ceremonies, stakeholder management, documentation. |
| | **Subtotal Build** | **3.4 tỷ** | **6.7 tỷ** | **11.9 tỷ** | |

### 1.2 Run Cost (recurring, per year)

| # | Hạng mục | Low/năm | Base/năm | High/năm | Ghi chú |
|---|---------|---------|---------|---------|---------|
| R1 | **Cloud hosting** | 300M | 600M | 1.2 tỷ | VN cloud (GPU inference, DB, storage, networking). Scale với volume. |
| R2 | **CIC API queries (incremental)** | 100M | 300M | 600M | ~3,000 queries/tháng × ~10K VND/query. Incremental over existing CIC cost. ❓ Phí thực tế cần confirm. |
| R3 | **eKYC cost (incremental)** | 50M | 150M | 300M | Incremental eKYC calls cho AI pipeline. Phần lớn đã có sẵn. |
| R4 | **Model monitoring & maintenance** | 200M | 400M | 800M | Drift detection, retraining quarterly, performance reports. 0.5 ML engineer ongoing. |
| R5 | **System maintenance** | 200M | 400M | 700M | Bug fixes, security patches, dependency updates. 0.5 backend dev ongoing. |
| R6 | **SBV reporting & compliance** | 100M | 200M | 400M | Quarterly reports, DPIA updates, audit support, Luật AI 134/2025 compliance. |
| | **Subtotal Run/năm** | **950M** | **2.05 tỷ** | **4 tỷ** | |

### 1.3 People Cost (Year 1, dedicated)

| # | Role | FTE | Monthly all-in | Annual | Ghi chú |
|---|------|-----|---------------|--------|---------|
| P1 | AI-Native PM | 1.0 | 35-50M | 420-600M | Senior PM with AI/banking domain |
| P2 | ML Engineer (senior) | 1.0 | 40-70M | 480-840M | Model development, MLOps |
| P3 | ML Engineer (mid) | 0.5-1.0 | 25-45M | 150-540M | Feature engineering, testing |
| P4 | Backend Developer | 1.0 | 30-50M | 360-600M | Integration, API, audit trail |
| P5 | Frontend Developer | 0.5 | 25-40M | 150-240M | CO review UI |
| P6 | Data Engineer | 0.5 | 30-45M | 180-270M | Data pipeline, ETL, quality |
| P7 | IT Support (bank side) | 0.3 | 20-30M | 72-108M | CBS/CIC integration support |
| | **Subtotal People/năm** | **~4.5 FTE** | | **1.81-3.20 tỷ** | |

**Lưu ý:** People cost có thể overlap với Build cost (C1-C5) — không double-count. Bảng 1.3 là breakdown chi tiết của nhân sự nằm trong C1-C5.

### 1.4 Compliance Cost (Year 1)

| # | Hạng mục | Low | Base | High | Ghi chú |
|---|---------|-----|------|------|---------|
| L1 | **DPIA preparation** | 100M | 200M | 400M | Legal counsel + internal effort. Mẫu 10 NĐ 356. |
| L2 | **Legal review (contracts, liability)** | 100M | 200M | 400M | Vendor-bank agreement, liability allocation (Luật AI 134/2025). |
| L3 | **Compliance audit** | 50M | 100M | 200M | Internal audit review trước deployment. |
| L4 | **DPO support** | 50M | 100M | 200M | DPO time allocation hoặc outsource. NĐ 356 requirement. |
| L5 | **Training & change management** | 100M | 200M | 400M | CO training (10-15 sessions), user guides, FAQ. |
| L6 | **Sandbox application (nếu có)** | 0 | 100M | 200M | Hồ sơ NĐ 94/2025. Optional. |
| | **Subtotal Compliance** | **400M** | **900M** | **1.8 tỷ** | |

### 1.5 TOTAL COST SUMMARY

| Cost category | Year 1 | Year 2 | Year 3 |
|--------------|--------|--------|--------|
| | Low / Base / High | Low / Base / High | Low / Base / High |
| **Build (one-time)** | 3.4 / 6.7 / 11.9 | 0 / 0 / 0 | 0 / 0 / 0 |
| **Run (recurring)** | 0.95 / 2.05 / 4.0 | 0.95 / 2.05 / 4.0 | 1.05 / 2.25 / 4.4 |
| **Compliance (Year 1 heavy)** | 0.4 / 0.9 / 1.8 | 0.15 / 0.3 / 0.6 | 0.15 / 0.3 / 0.6 |
| **TOTAL** | **4.75 / 9.65 / 17.7** | **1.1 / 2.35 / 4.6** | **1.2 / 2.55 / 5.0** |

**Base case 3-year total cost: 9.65 + 2.35 + 2.55 = 14.55 tỷ VND**

---

## 2. BENEFIT SIDE — AI-CRDS Tiết Kiệm Bao Nhiêu?

Từ damage model v1.0, 4 benefit streams:

### 2.1 Benefit Streams — 3 Scenarios

| # | Benefit stream | Conservative | Base | Optimistic | Basis |
|---|---------------|-------------|------|-----------|-------|
| B1 | **Giảm NPL (credit loss)** | 2.65 tỷ | 5.29 tỷ | 7.94 tỷ | NPL reduction: -10% / -20% / -30%. Base case: 3.5% → 2.8% NPL. |
| B2 | **Giảm fraud loss** | 2.88 tỷ | 4.32 tỷ | 8.64 tỷ | Fraud detection: +20% / +30% / +60%. eKYC + AI fraud layer. |
| B3 | **Giảm opportunity cost (reject nhầm)** | 10.37 tỷ | 15.55 tỷ | 25.92 tỷ | False reject: -20% / -30% / -50%. More good customers approved. |
| B4 | **Giảm ops cost (manual review)** | 0.89 tỷ | 1.48 tỷ | 2.36 tỷ | Auto-review: 30% / 50% / 70%. CO time freed up. |
| | **TOTAL BENEFIT/năm** | **16.79 tỷ** | **26.64 tỷ** | **44.86 tỷ** | |

### 2.2 Benefit Ramp-up — Không đạt 100% từ ngày 1

AI-CRDS không deliver full benefit ngay. Ramp-up schedule:

| Period | % Full Benefit | Lý do |
|--------|---------------|-------|
| Month 1-3 (shadow testing) | 0% | AI chạy song song, chưa ảnh hưởng quyết định |
| Month 4-6 (limited deployment) | 30% | AI recommend cho subset applications, CO vẫn review tất cả |
| Month 7-9 (expanding) | 60% | AI cover phần lớn applications, CO batch-review high-confidence |
| Month 10-12 (full deployment) | 85% | Full deployment, ongoing calibration |
| Year 2+ | 100% | Stable operation, model improvements |

### 2.3 Adjusted Annual Benefits (with ramp-up)

| Scenario | Raw benefit/năm | Year 1 (ramp-up avg ~44%) | Year 2 (100%) | Year 3 (110% — model improvement) |
|---------|----------------|--------------------------|--------------|----------------------------------|
| Conservative | 16.79 tỷ | **7.39 tỷ** | **16.79 tỷ** | **18.47 tỷ** |
| Base | 26.64 tỷ | **11.72 tỷ** | **26.64 tỷ** | **29.30 tỷ** |
| Optimistic | 44.86 tỷ | **19.74 tỷ** | **44.86 tỷ** | **49.35 tỷ** |

---

## 3. BREAK-EVEN ANALYSIS

### 3.1 Break-even Calculation

```
Break-even month = Total cost / Monthly net benefit

Monthly net benefit = (Annual benefit × ramp-up%) / 12 - Monthly run cost
```

### 3.2 Cumulative Cash Flow — Base Case

| Month | Cumulative Cost | Cumulative Benefit | **Net** | Note |
|-------|---------------|-------------------|---------|------|
| 0 | -6.7 tỷ (build) | 0 | **-6.7 tỷ** | Build complete, deploy |
| 1-3 | -7.21 tỷ | 0 | **-7.21 tỷ** | Shadow testing, 0% benefit |
| 4-6 | -7.72 tỷ | +2.0 tỷ | **-5.72 tỷ** | Limited deployment, 30% benefit |
| 7-9 | -8.23 tỷ | +6.0 tỷ | **-2.23 tỷ** | Expanding, 60% benefit |
| 10 | -8.40 tỷ | +7.88 tỷ | **-0.52 tỷ** | 85% benefit |
| **11** | **-8.57 tỷ** | **9.77 tỷ** | **+1.20 tỷ** | **☑️ BREAK-EVEN** |
| 12 | -8.74 tỷ | +11.72 tỷ | **+2.98 tỷ** | Year 1 close |
| 24 | -11.09 tỷ | +38.36 tỷ | **+27.27 tỷ** | Year 2 close |
| 36 | -13.64 tỷ | +67.66 tỷ | **+54.02 tỷ** | Year 3 close |

### 3.3 Break-even Month — 3 Scenarios

| Scenario | Total Investment Y1 | Benefit Y1 (ramped) | **Break-even month** |
|---------|-------------------|--------------------|--------------------|
| **Optimistic** (low cost, high benefit) | 4.75 tỷ | 19.74 tỷ | **Month 6** |
| **Base** | 9.65 tỷ | 11.72 tỷ | **Month 11** |
| **Conservative** (high cost, low benefit) | 17.7 tỷ | 7.39 tỷ | **Month 22** |

### 3.4 Break-even Chart (text representation)

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
    
    ▼ Build cost     ═══ Shadow testing     ╱ Benefit ramp-up
                     Break-even ≈ Month 11 ☑️
```

---

## 4. NPV & IRR ANALYSIS

### 4.1 Assumptions

| Parameter | Value | Basis |
|----------|-------|-------|
| Discount rate | 12% per annum | VN risk-free rate (~5%) + equity risk premium (~7%). Conservative for internal project. |
| Horizon | 3 years | Standard for internal IT investment evaluation. |
| Terminal value | Not included | Conservative — no value beyond Year 3. |

### 4.2 NPV Calculation — Base Case

| Year | Net Cash Flow | Discount Factor (12%) | Present Value |
|------|-------------|---------------------|--------------|
| Year 0 (build) | -6.70 tỷ | 1.000 | -6.70 tỷ |
| Year 1 (run + benefit ramped) | +2.07 tỷ | 0.893 | +1.85 tỷ |
| Year 2 | +24.29 tỷ | 0.797 | +19.36 tỷ |
| Year 3 | +26.75 tỷ | 0.712 | +19.05 tỷ |
| **NPV** | | | **+33.56 tỷ VND** |

### 4.3 NPV — 3 Scenarios

| Scenario | NPV (3-year) | IRR | Verdict |
|---------|-------------|-----|---------|
| Conservative | +12.8 tỷ | 68% | ✅ Strong positive |
| **Base** | **+33.56 tỷ** | **142%** | **✅ Very strong** |
| Optimistic | +72.4 tỷ | 285% | ✅ Exceptional |

**Kết luận:** NPV positive trong cả 3 scenarios. IRR >> discount rate (12%). Đầu tư AI-CRDS justified từ góc nhìn tài chính.

### 4.4 Sensitivity Analysis — Biến nào ảnh hưởng NPV nhiều nhất?

| Variable | Base value | Change | NPV impact | Sensitivity |
|---------|-----------|--------|-----------|------------|
| **False reject reduction (B3)** | -30% | ±10pp | ±8.6 tỷ | 🔴 Rất cao — benefit driver lớn nhất |
| **NPL reduction (B1)** | -20% | ±10pp | ±4.4 tỷ | 🟡 Cao |
| **Fraud detection (B2)** | +30% | ±10pp | ±3.6 tỷ | 🟡 Cao |
| **Build cost** | 6.7 tỷ | ±30% | ±2.0 tỷ | 🟡 Trung bình |
| **Auto-review rate (B4)** | 50% | ±20pp | ±1.2 tỷ | 🟢 Thấp |
| **Discount rate** | 12% | ±3pp | ±1.5 tỷ | 🟢 Thấp |
| **Ramp-up speed** | 44% Y1 avg | ±15pp | ±2.8 tỷ | 🟡 Trung bình |

**Insight:** False reject reduction (B3) là biggest lever. Nếu AI chỉ giảm reject nhầm 20% thay vì 30% → NPV vẫn +25 tỷ (vẫn strong). Nếu AI không giảm reject nhầm gì → NPV vẫn +10.5 tỷ (vẫn positive từ NPL + fraud savings).

**→ AI-CRDS NPV positive ngay cả khi B3 (opportunity cost) = 0.** Robust investment.

---

## 5. C-LEVEL PRESENTATION — 1 Slide Summary

```
┌─────────────────────────────────────────────────────────┐
│              AI-CRDS: BUSINESS CASE SUMMARY             │
│                                                         │
│  PROBLEM: CC origination đang tốn ~96 tỷ VND/năm       │
│  ├── Credit loss (NPL):      26 tỷ  (28%)              │
│  ├── Fraud loss:              14 tỷ  (15%)              │
│  ├── Reject nhầm good cust:  52 tỷ  (54%) ← LỚN NHẤT  │
│  └── Manual review cost:       3 tỷ  (3%)               │
│                                                         │
│  SOLUTION: AI-CRDS scoring + fraud detection             │
│  ├── Investment Year 1:    ~10 tỷ VND                   │
│  ├── Ongoing cost:         ~2.5 tỷ VND/năm              │
│  └── Expected saving:      ~27 tỷ VND/năm               │
│                                                         │
│  ROI:                                                    │
│  ├── Break-even:           Month 11                      │
│  ├── NPV (3 năm):         +34 tỷ VND                   │
│  ├── IRR:                  142%                          │
│  └── 3-year net:           +54 tỷ VND                   │
│                                                         │
│  ASK: Approve Phase 0 — 8 tuần shadow testing            │
│  ├── Budget: 2 tỷ VND (build + shadow run)              │
│  └── Risk: Zero — AI chỉ observe, không quyết định      │
└─────────────────────────────────────────────────────────┘
```

---

## 6. BUILD vs BUY COMPARISON (Preview)

| Factor | Build In-house | Buy Vendor (FICO/local) |
|--------|---------------|----------------------|
| **Year 1 cost** | 9.65 tỷ (base) | 8-15 tỷ (license + integration) |
| **Ongoing cost** | 2.35 tỷ/năm | 3-6 tỷ/năm (license recurring) |
| **3-year total** | 14.55 tỷ | 17-27 tỷ |
| **Customization** | ✅ Full control | ⚠️ Limited — vendor roadmap |
| **Data ownership** | ✅ 100% internal | ⚠️ Vendor may access data |
| **Time to deploy** | 8-12 tháng | 4-8 tháng |
| **IP ownership** | ✅ Bank owns | ❌ Vendor owns |
| **Regulatory fit** | ✅ Built for VN (Luật AI, BVDLCN, SBV) | ⚠️ May need VN adaptation |
| **Model transparency** | ✅ Full explainability | ⚠️ Black box risk |
| **Scaling** | ⚠️ Need to hire | ✅ Vendor handles |

**Recommendation:** In-house build preferred cho Bank X context — regulatory compliance (Luật AI 134/2025 explainability, BVDLCN data residency) + data ownership + long-term cost advantage. Chi tiết tại Week 33 (Competitive Positioning).

---

## 7. ASSUMPTIONS LOG

Mọi assumption phải tracked. Khi có real data → update và recalculate.

| # | Assumption | Value Used | Confidence | Source | Validate When |
|---|-----------|-----------|-----------|--------|--------------|
| A1 | CC applications/tháng | 3,000 | ❓ Low | Ước tính mid-size bank | Week 8 (Compliance Officer / business team) |
| A2 | Approval rate | 60% | ❓ Low | Industry average | Week 8 |
| A3 | Average CC limit | 50M VND | 🟡 Medium | 2-3x avg salaried income (~20M) | Week 8 |
| A4 | CC NPL rate | 3.5% | 🟡 Medium | FiinRatings 2024, Statista 2023. System-wide NPL ~2%, CC-specific higher. | Week 8 (internal data) |
| A5 | LGD (unsecured CC) | 70% | 🟡 Medium | Industry benchmark. VN recovery low (~20-30%). | Week 8 |
| A6 | Fraud rate at origination | 0.8% | 🟡 Medium | Visa VN Q2 2025: below SEA avg. Origination fraud < transaction fraud. | Week 8 |
| A7 | False rejection rate | 10% | ❓ Low — hardest to prove | Industry estimate. Cần CO interview. | Week 9 (CO interviews) |
| A8 | CC LTV | 36M VND / 3 years | 🟡 Medium | Interest + fee + interchange blended. | Week 8 |
| A9 | CO all-in cost | 18M/tháng | 🟡 Medium | Salary guides 2025. Credit specialist 10-20M + overhead. | Week 8 |
| A10 | AI NPL reduction | -20% | ❓ Low | Academic literature range -10% to -40%. Conservative for v1. | Post-shadow testing (Week 40) |
| A11 | AI fraud detection improvement | +30% | ❓ Low | Dependent on model quality + eKYC integration. | Post-shadow testing |
| A12 | AI false reject reduction | -30% | ❓ Low | Biggest assumption. Most impactful. Cần shadow testing proof. | Post-shadow testing |
| A13 | Auto-review rate | 50% | ❓ Low | Dependent on threshold setting + CO trust. | Post-limited deployment |
| A14 | Ramp-up schedule | 44% Y1 average | 🟡 Medium | Based on typical AI deployment ramp. | Track actual ramp |
| A15 | Discount rate | 12% | ✅ High | VN risk-free + equity premium. Standard corporate. | CFO confirm |
| A16 | ML Engineer salary (senior) | 40-70M/tháng | ✅ High | Adecco, Reeracoen salary guides 2025. AI/ML = premium. | HR confirm |

### Assumption Risk Ranking

| Risk level | Assumptions | Impact if wrong | Mitigation |
|-----------|------------|----------------|-----------|
| 🔴 High risk, high impact | A7 (false reject), A10-A13 (AI improvement) | NPV can swing ±20 tỷ | Shadow testing (Week 37-40) → replace assumptions with actuals |
| 🟡 Medium risk | A1-A4 (volume, NPL, limit), A8 (LTV) | NPV swing ±10 tỷ | Bank internal data (Week 8) |
| 🟢 Low risk | A5 (LGD), A9 (CO cost), A15-A16 (rates, salaries) | NPV swing ±3 tỷ | Industry benchmarks reliable |

---

## Tracking — Tự hỏi cuối tuần

- [ ] CFO/Finance đã review cost estimates chưa?
- [ ] Assumption yếu nhất (A7: false rejection rate) có evidence nào support?
- [ ] Break-even analysis đã incorporate vào proposal draft chưa?
- [ ] Build vs Buy comparison đã discuss với CTO chưa?
- [ ] NPV calculation đã được Finance validate methodology chưa?
- [ ] C-level 1-slide summary đã review với direct manager chưa?

---

## Ghi Chú & Limitations

1. **Tất cả số liệu là ước tính.** Confidence level ghi trong Assumptions Log. A7 (false reject rate) và A10-A13 (AI improvements) có confidence thấp nhất nhưng impact cao nhất.
2. **Benefit B3 (opportunity cost) chiếm 58% total benefit** — đây là con số lớn nhất nhưng cũng khó chứng minh nhất. C-level có thể challenge. Mitigation: "Ngay cả khi B3 = 0, NPV vẫn positive +10.5 tỷ từ NPL + fraud savings."
3. **Ramp-up schedule (44% Y1)** là conservative — nhiều AI deployments ramp nhanh hơn. Nhưng banking context (change management, CO trust building) justify slow ramp.
4. **Build vs Buy** chỉ là preview — chi tiết analysis tại Week 33 (Competitive Positioning).
5. **Investment không bao gồm:** sunk cost (PM time đã dùng cho research), opportunity cost of team not doing other projects, potential regulatory fines if things go wrong.
6. **Cross-reference:** damage-model.md (damage tiers), sbv-requirements.md (compliance cost basis), pdpd-impact-assessment.md (DPIA cost basis).