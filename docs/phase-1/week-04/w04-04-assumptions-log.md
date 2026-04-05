# Assumptions Log — AI-CRDS
> **Tags:** `[Business]` `[Risk]` `[Governance]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 4
> **Version:** v1.0
> **Ngày:** 02/04/2026

---

## Mục đích

Track mọi assumption dùng trong damage model, break-even analysis, và budget estimate. Mỗi assumption có source, confidence, và plan validate. Khi có số thực → update log này + recalculate tất cả models.

**Nguyên tắc:** Không bịa số. Số không verify được phải có nguồn + confidence level + validation plan.

---

## 1. MASTER ASSUMPTIONS TABLE

### 1.1 Bank X Operating Metrics

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Validate với ai | Validate khi nào | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|-----------------|----------------|
| A1 | CC applications/tháng | 3,000 | Damage model (all tiers), Break-even | Ước tính mid-size NHTM VN. Range: 1,500-5,000. | ❓ **Low** | Head of Cards / Business team | Week 8 | 🔴 High — scales linearly across all tiers |
| A2 | Approval rate hiện tại | 60% | Damage T1-T3, Break-even | Industry average VN CC. Range: 50-70%. | ❓ **Low** | Head of Cards / Credit team | Week 8 | 🟡 Medium — affects approved volume |
| A3 | Average CC limit (salaried) | 50M VND | Damage T1-T2, Break-even | 2-3x monthly income. Avg salaried income ~20M declared → limit 40-60M. | 🟡 **Medium** | Product team / Head of Cards | Week 8 | 🔴 High — multiplier in EL and fraud loss |
| A4 | Average outstanding balance | 25M VND (~50% utilization) | Damage T1 | Industry avg utilization ~40-60%. | 🟡 **Medium** | Finance team | Week 8 | 🟡 Medium |
| A5 | CO team size | 10-12 | Damage T4, Budget | Estimated from A1 ÷ CO capacity. | ❓ **Low** | HR / Ops Manager | Week 8 | 🟡 Medium — affects ops cost |
| A6 | CO capacity (apps/ngày) | 10-15 full reviews | Damage T4 | 35 min/review × 6 productive hours. | 🟡 **Medium** | Credit Officers (interview) | Week 9 | 🟢 Low |

### 1.2 Credit Risk Parameters

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Validate với ai | Validate khi nào | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|-----------------|----------------|
| A7 | **CC NPL rate tại Bank X** | 3.5% | Damage T1 (core) | FiinRatings 2024: system-wide on-balance NPL 1.69%, gross 3.36%. CC-specific higher. VPBank 5.7%, VCB 0.7% (Statista 2023). S&P 06/2025: NPL incl. SML ~2%. | 🟡 **Medium** | Risk Manager / Finance | Week 8 | 🔴 **Very High** — directly scales T1 |
| A8 | **LGD (CC unsecured)** | 70% | Damage T1 (core) | Industry benchmark CC unsecured. VN recovery rate ~20-30% (enforcement yếu cho consumer debt). Range: 60-80%. | 🟡 **Medium** | Risk Manager | Week 13 | 🔴 High — multiplier in EL |
| A9 | **EAD assumption** | Full limit (50M) | Damage T1 worst case | Worst case: defaulter max out limit before default. Conservative: use outstanding balance (25M). | 🟡 **Medium** | Risk team | Week 13 | 🟡 Medium |
| A10 | Default definition | DPD 90+ | Damage T1 | Basel II standard. Nhưng bank có thể dùng DPD 60+ hoặc write-off. | ✅ **High** | Risk Manager | Week 8 | 🟢 Low — Basel standard widely adopted |

### 1.3 Fraud Parameters

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Validate với ai | Validate khi nào | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|-----------------|----------------|
| A11 | **Fraud rate at CC origination** | 0.8% | Damage T2 | Visa VN Q2 2025: fraud rate giảm, dưới trung bình SEA. 93% fraud từ online. Origination fraud < transaction fraud. Range: 0.3-1.5%. | 🟡 **Medium** | Fraud/Risk team | Week 8 | 🔴 High — directly scales T2 |
| A12 | Loss per fraud case | 100% of limit (50M) | Damage T2 | Fraud = full limit maxed, zero recovery. | ✅ **High** | N/A — worst case by design | N/A | 🟢 Low — conservative by design |

### 1.4 Opportunity Cost Parameters

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Validate với ai | Validate khi nào | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|-----------------|----------------|
| A13 | **False rejection rate** | 10% of rejections | Damage T3 | Industry estimate. Rất khó measure trực tiếp — rejected applicants không có outcome data (reject inference problem). Range: 5-15%. | ❓ **Low — assumption yếu nhất** | Credit Officers (interview), Head of Cards | Week 9 (CO interviews) | 🔴 **Highest impact** — T3 = 54% of total damage. Swing ±20 tỷ/năm. |
| A14 | CC Lifetime Value (LTV) | 36M VND / 3 years | Damage T3, Break-even | Revenue/card/year: interest income (revolvers ~10-15M) + annual fee (500K-1.5M) + interchange (1-3M). Blended ~8M/năm × 3 years × discount. | 🟡 **Medium** | Finance / Product team | Week 8 | 🔴 High — multiplier in T3 |
| A15 | Average CC lifespan | 3 years | Damage T3 | Industry average. Range: 2-5 years. Churn rate CC VN chưa có public data. | ❓ **Low** | Product team | Week 13 | 🟡 Medium |
| A16 | CC interest rate | 24-36% p.a. | LTV calculation | VN CC standard revolving rate. | ✅ **High** | Product team | Week 8 | 🟢 Low — public knowledge |
| A17 | Annual fee per card | 500K VND (avg) | LTV calculation | Range 300K-1.5M tùy hạng thẻ. | 🟡 **Medium** | Product team | Week 8 | 🟢 Low |

### 1.5 Operational Cost Parameters

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Validate với ai | Validate khi nào | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|-----------------|----------------|
| A18 | **CO all-in cost/tháng** | 18M VND | Damage T4, Budget | Salary guides 2025: credit specialist 10-20M. + BHXH (~23%) + overhead (office, equipment). All-in: 15-25M. | 🟡 **Medium** | HR / Finance | Week 8 | 🟡 Medium |
| A19 | Review time per application | 35 phút (full review) | Damage T4 | Ước tính: documentation review (10 min) + CIC check (5 min) + analysis (10 min) + decision + logging (10 min). | ❓ **Low** | Credit Officers (observe/interview) | Week 9 | 🟡 Medium |
| A20 | CO productive hours/ngày | 6 giờ (75% efficiency) | Damage T4 | Standard office: 8h - meetings - breaks - admin = ~6h productive. | 🟡 **Medium** | Ops Manager | Week 8 | 🟢 Low |

### 1.6 AI Performance Assumptions

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Validate với ai | Validate khi nào | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|-----------------|----------------|
| A21 | **AI NPL reduction** | -20% (3.5% → 2.8%) | Break-even B1 | Academic literature: AI scoring improves Gini 10-30% over traditional scorecard. -20% NPL reduction = conservative for well-implemented AI. Range: -10% to -40%. | ❓ **Low** | N/A — validate by shadow testing | Week 40 (post-shadow test) | 🔴 High — 5.29 tỷ/năm saving at stake |
| A22 | **AI fraud detection improvement** | +30% detection rate | Break-even B2 | Dependent on eKYC integration + AI fraud model quality. Rule-based → ML typically +20-50% improvement. | ❓ **Low** | N/A — validate by shadow testing | Week 40 | 🟡 Medium — 4.32 tỷ/năm at stake |
| A23 | **AI false reject reduction** | -30% | Break-even B3 | AI more consistent than manual → fewer random rejections. But: ML can introduce new biases. -30% = moderate estimate. | ❓ **Low — hardest to prove** | N/A — validate by shadow + limited deployment | Week 43 (post-limited deployment) | 🔴 **Highest impact** — 15.55 tỷ/năm at stake |
| A24 | **Auto-review rate** | 50% of applications | Break-even B4 | Dependent on threshold setting + CO trust. Start conservative (30%) → ramp to 50-70%. | ❓ **Low** | Risk Committee (threshold approval) | Week 41 (limited deployment) | 🟡 Medium — 1.48 tỷ/năm at stake |
| A25 | Benefit ramp-up schedule | 0%→30%→60%→85% over 12M | Break-even | Typical AI deployment in banking. Shadow 3M (0%) → limited 3M (30%) → expanding 3M (60%) → full 3M (85%). | 🟡 **Medium** | Track actual ramp | Ongoing post-deploy | 🟡 Medium — affects break-even month |

### 1.7 Cost & Financial Assumptions

| # | Assumption | Value | Dùng ở đâu | Source | Confidence | Validate với ai | Validate khi nào | Impact nếu sai |
|---|-----------|-------|-----------|--------|-----------|----------------|-----------------|----------------|
| A26 | Build cost (total) | 6.7 tỷ VND (base) | Budget v0, Break-even | Decomposed: ML dev 3 tỷ + backend 1.5 tỷ + frontend 800M + infra 600M + PM 800M. Based on VN market rates. | 🟡 **Medium** | CTO / IT Manager | Week 8 | 🟡 Medium — ±2 tỷ range |
| A27 | Annual run cost | 2.05 tỷ VND (base) | Budget v0, Break-even | Cloud 600M + CIC 300M + eKYC 150M + maintenance 800M + compliance 200M. | 🟡 **Medium** | CTO / Finance | Week 8 | 🟡 Medium |
| A28 | **CIC API cost per query** | ~10K VND | Budget v0 | ❓ **Chưa verify.** Phí CIC khác nhau giữa các bank (tùy agreement). Có thể 5K-20K/query. | ❓ **Low** | IT / CIC contact | Week 8 | 🟡 Medium — 300M/năm at stake |
| A29 | ML Engineer salary (senior) | 40-70M/tháng | Budget v0 | Adecco 2025, Reeracoen 2025. AI/ML = premium. HCM/HN. | ✅ **High** | HR | Week 5 | 🟢 Low |
| A30 | Discount rate (NPV) | 12% per annum | Break-even NPV | VN risk-free ~5% + equity risk premium ~7%. Standard corporate project evaluation. | ✅ **High** | CFO | Week 8 | 🟢 Low — NPV not very sensitive |

---

## 2. ASSUMPTION RISK MATRIX

```
                        IMPACT ON NPV
                   Low (<3 tỷ)    High (>5 tỷ)
                 ┌──────────────┬──────────────┐
    High         │              │  A7 (NPL)    │
    Confidence   │  A10,A12,    │  A8 (LGD)    │
    (✅)         │  A16,A29,A30 │              │
                 ├──────────────┼──────────────┤
    Medium       │  A4,A6,A9,   │  A3 (limit)  │
    Confidence   │  A17,A18,A20 │  A14 (LTV)   │
    (🟡)         │  A25,A26,A27 │  A11 (fraud) │
                 ├──────────────┼──────────────┤
    Low          │  A5,A15,A19  │  A1 (volume) │
    Confidence   │  A24,A28     │  A2 (approv) │
    (❓)         │              │  A13 (FP)  ← │ BIGGEST RISK
                 │              │  A21-A23     │
                 └──────────────┴──────────────┘
```

**Top 5 riskiest assumptions** (low confidence + high impact):

| Rank | # | Assumption | Value | NPV swing if wrong | Validation plan |
|------|---|-----------|-------|-------------------|----------------|
| **1** | A13 | False rejection rate | 10% | ±20 tỷ | CO interviews Week 9 → shadow test comparison Week 40 |
| **2** | A23 | AI false reject reduction | -30% | ±13 tỷ | Shadow testing Week 37-40 → limited deployment Week 41-43 |
| **3** | A21 | AI NPL reduction | -20% | ±9 tỷ | Shadow testing → 90-day post-deploy measurement |
| **4** | A1 | CC applications/tháng | 3,000 | ±8 tỷ | Head of Cards meeting Week 8 |
| **5** | A22 | AI fraud detection +30% | +30% | ±7 tỷ | Shadow testing Week 37-40 |

---

## 3. SENSITIVITY TABLE — "What If" Analysis

### Nếu assumption sai, damage model thay đổi bao nhiêu?

| Scenario | Assumptions changed | Total damage/năm | AI saving/năm | NPV 3-year | Break-even |
|---------|-------------------|-----------------|-------------|-----------|-----------|
| **Base case** | All at base value | 95.65 tỷ | 26.64 tỷ | +33.56 tỷ | Month 11 |
| NPL thực = 2% (tốt hơn) | A7: 3.5% → 2% | 81.5 tỷ | 23.6 tỷ | +28.0 tỷ | Month 12 |
| NPL thực = 5.5% (tệ hơn) | A7: 3.5% → 5.5% | 115.8 tỷ | 31.4 tỷ | +42.5 tỷ | Month 9 |
| False reject = 5% (ít hơn) | A13: 10% → 5% | 69.8 tỷ | 18.5 tỷ | +18.2 tỷ | Month 15 |
| False reject = 0% (không có) | A13: 10% → 0% | 43.8 tỷ | 11.1 tỷ | +10.5 tỷ | Month 18 |
| Volume = 1,500/tháng | A1: 3,000 → 1,500 | 47.8 tỷ | 13.3 tỷ | +12.8 tỷ | Month 16 |
| Volume = 5,000/tháng | A1: 3,000 → 5,000 | 159.4 tỷ | 44.4 tỷ | +67.0 tỷ | Month 7 |
| AI chỉ giảm NPL, không gì khác | A22-24: 0 | N/A | 5.29 tỷ | +2.1 tỷ | Month 20 |
| **Worst worst case** | A13=0%, AI chỉ giảm NPL 10% | N/A | 2.65 tỷ | **-4.2 tỷ** | **Không hòa vốn** |

**Insight:** NPV chỉ negative khi CẢ false reject benefit = 0 VÀ AI improvement rất nhỏ (chỉ -10% NPL). Scenario này unlikely nhưng possible nếu model quality kém hoặc CO không trust AI.

**→ Mitigation:** Shadow testing (Week 37-40) sẽ validate A21-A24 trước khi commit Phase 1 budget. Nếu shadow test cho thấy AI không improve → kill project, sunk cost = 365M (Phase 0 only).

---

## 4. VALIDATION TIMELINE

```
WEEK  4   5   6   7   8   9  10  11  12  13 ... 37  38  39  40  41  42  43
      │   │   │   │   │   │   │   │   │   │       │   │   │   │   │   │   │
      │   │   │   │   │   │   │   │   │   │       │   │   │   │   │   │   │
 A29 ─┤   │   │   │   │   │   │   │   │   │       │   │   │   │   │   │   │
 (HR) ▼   │   │   │   │   │   │   │   │   │       │   │   │   │   │   │   │
          │   │   │   │   │   │   │   │   │       │   │   │   │   │   │   │
 A1-A9 ───┼───┼───┼───┤   │   │   │   │   │       │   │   │   │   │   │   │
 A11,A14 ─┼───┼───┼───┤   │   │   │   │   │       │   │   │   │   │   │   │
 A16-A18 ─┼───┼───┼───┤   │   │   │   │   │       │   │   │   │   │   │   │
 A26-A28  │   │   │   ▼   │   │   │   │   │       │   │   │   │   │   │   │
 (Bank IT/Finance)    │   │   │   │   │   │       │   │   │   │   │   │   │
                      │   │   │   │   │   │       │   │   │   │   │   │   │
 A13,A19 ─────────────┤   │   │   │   │   │       │   │   │   │   │   │   │
 (CO interviews)      ▼   │   │   │   │   │       │   │   │   │   │   │   │
                           │   │   │   │   │       │   │   │   │   │   │   │
 A8,A15 ──────────────────────────────┤   │       │   │   │   │   │   │   │
 (Risk Manager deep-dive)            ▼   │       │   │   │   │   │   │   │
                                          │       │   │   │   │   │   │   │
 A21-A22 ─────────────────────────────────┼───────┼───┼───┼───┤   │   │   │
 (Shadow testing results)                 │       │   │   │   ▼   │   │   │
                                          │       │               │   │   │
 A23-A24 ─────────────────────────────────┼───────┼───────────────┼───┼───┤
 (Limited deployment results)             │       │               │   │   ▼
                                          │       │               │   │
                              PROPOSAL ───┤       │  RECALCULATE ─┤   │
                              (Week 11)   ▼       │  ALL MODELS   ▼   │
                                                  │                   │
                                    SHADOW ────────┤  DEPLOY ─────────┤
                                    START          ▼  DECISION        ▼
```

### Validation Milestones

| Milestone | Week | Assumptions validated | Action after validation |
|----------|------|---------------------|----------------------|
| **Bank IT/Finance meeting** | 8 | A1-A9, A11, A14, A16-A18, A26-A28 | Recalculate damage model + break-even + budget. Update proposal. |
| **CO interviews** | 9 | A13, A19 | Validate false rejection rate (biggest assumption). Update T3. |
| **Risk Manager deep-dive** | 13 | A8, A10, A15 | Finalize LGD, default definition. Update T1. |
| **Shadow testing results** | 40 | A21, A22 | AI vs manual accuracy comparison. Go/no-go for Phase 1. |
| **Limited deployment results** | 43 | A23, A24 | AI false reject + auto-review performance. Go/no-go for full deploy. |
| **Post-deploy 30-day** | 47 | All remaining | Full recalculation with actuals. 30-day impact report. |

---

## 5. RECALCULATION PROTOCOL

Khi assumption được validated (replaced with actual data):

### Step 1: Update Assumptions Log

```
| A7 | CC NPL rate | 3.5% → [ACTUAL] | damage-model.md | [NEW SOURCE] | ✅ High | ✓ Validated Week 8 |
```

### Step 2: Recalculate Models

| Document | Recalculate what | Priority |
|---------|-----------------|---------|
| `damage-model.md` | All 4 tiers with new inputs | 🔴 Immediate |
| `break-even-analysis.md` | NPV, IRR, break-even month | 🔴 Immediate |
| `budget-estimate-v0.md` | Cost estimates if CIC fee / salary changes | 🟡 If applicable |

### Step 3: Version Control

```
damage-model.md v1.0 (estimates) → v1.1 (partial actuals Week 8) → v2.0 (post-shadow actuals)
break-even-analysis.md v1.0 → v1.1 → v2.0
assumptions-log.md v1.0 → v1.1 → v2.0
```

### Step 4: Communicate Changes

Nếu recalculation thay đổi NPV >10% → notify direct manager + update proposal draft.

---

## 6. TRACKING — Tự hỏi cuối tuần

- [ ] Có số NPL CC nội bộ Bank X không? (A7 — ảnh hưởng lớn nhất đến T1)
- [ ] Cost per manual review application là bao nhiêu? (A18, A19)
- [ ] Average CC limit tại Bank X? (A3 — multiplier trong mọi tier)
- [ ] Current fraud loss rate CC? (A11)
- [ ] Headcount Credit team? (A5 — để tính ops cost)
- [ ] Budget approval process: ai sign, ngưỡng bao nhiêu? (Cho Phase 0 ask)
- [ ] CIC API cost per query? (A28 — unknown lớn nhất trong budget)
- [ ] False rejection rate có evidence gì support không? (A13 — assumption yếu nhất, impact cao nhất)
- [ ] Đã schedule meeting IT/Finance cho Week 8 chưa?
- [ ] Đã schedule CO interviews cho Week 9 chưa?

---

## 7. Ghi Chú & Limitations

1. **30 assumptions tracked.** 5 có confidence ❓ Low + impact 🔴 High → biggest risks.
2. **A13 (false rejection rate) là assumption yếu nhất nhưng impact cao nhất.** Swing ±20 tỷ/năm. Cần CO interviews + shadow testing evidence. C-level có thể challenge — prepare answer: "Ngay cả nếu false reject = 0, NPV vẫn positive +10.5 tỷ từ NPL + fraud savings."
3. **A21-A24 (AI improvement) không validate được trước shadow testing (Week 37-40).** Budget Phase 0 (365M) chấp nhận risk này. Nếu shadow test fail → kill project, sunk cost = 365M.
4. **Assumptions interact:** A1 (volume) scales tất cả tiers. A3 (limit) scales T1+T2. Thay đổi 1 assumption → cascade effect. Always recalculate all models cùng lúc.
5. **Cross-reference:** damage-model.md (uses A1-A24), break-even-analysis.md (uses all), budget-estimate-v0.md (uses A26-A30).