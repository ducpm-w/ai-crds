# Approval Rate Curve — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Visualize trade-off: threshold ↔ approval rate ↔ NPL ↔ revenue. Risk Committee dùng document này để chọn threshold operating point.

**⚠️ Tất cả số liệu dựa trên assumed score distribution (synthetic).** Real curve chỉ biết sau khi train model trên real data + shadow testing. Document này illustrate concept + framework cho decision-making.

---

## 1. THRESHOLD ↔ STATE DISTRIBUTION TABLE

### 1.1 Main Operating Table

| TH_high | % State 1 (Auto-route) | % State 2 (Standard) | % State 3 (Fraud) | % State 4 (Escalate) | % State 5 (Need-info) | Est. Overall Approval Rate | Est. NPL |
|---------|----------------------|--------------------|--------------------|---------------------|---------------------|--------------------------|---------|
| **0.55** | 68% | 14% | 3% | 7% | 8% | ~72% | 🔴 4.5-5.5% (+30-60%) |
| **0.60** | 62% | 20% | 3% | 7% | 8% | ~68% | 🔴 4.0-4.8% (+15-35%) |
| **0.65** | 55% | 27% | 3% | 7% | 8% | ~65% | 🟡 3.7-4.2% (+5-20%) |
| **0.70** | 47% | 35% | 3% | 7% | 8% | ~63% | 🟡 3.3-3.8% (-5 to +10%) |
| **0.75** ← proposed | **37%** | **45%** | **3%** | **7%** | **8%** | **~60%** | 🟢 **3.0-3.5% (≈baseline)** |
| **0.80** | 25% | 57% | 3% | 7% | 8% | ~57% | 🟢 2.7-3.2% (-5 to -15%) |
| **0.85** | 15% | 67% | 3% | 7% | 8% | ~53% | 🟢 2.5-3.0% (-10 to -20%) |
| **0.90** | 8% | 74% | 3% | 7% | 8% | ~50% | 🟢 2.3-2.8% (-15 to -25%) |

**Note:** State 3 (Fraud 3%), State 4 (Escalate 7%), State 5 (Need-info 8%) ít bị ảnh hưởng bởi TH_high — chúng triggered bởi fraud score, confidence, và data completeness, không phải credit risk score.

### 1.2 Approval Rate Curve (ASCII visualization)

```
Estimated Overall Approval Rate vs TH_high

75% ┤ •
    │   •
70% ┤     •
    │       •
65% ┤         •
    │           •
60% ┤             ● ← TH_high = 0.75 (proposed)
    │               •
55% ┤                 •
    │                   •
50% ┤                     •
    │
45% ┤
    ├──┬──┬──┬──┬──┬──┬──┬──┤
   0.55 0.60 0.65 0.70 0.75 0.80 0.85 0.90
                  TH_high
```

```
Estimated NPL Rate vs TH_high

5.5% ┤ •
     │
5.0% ┤   •
     │
4.5% ┤
     │     •
4.0% ┤       •
     │                                        ← NPL ceiling (current = 3.5%)
3.5% ┤ ─ ─ ─ ─ •─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
     │           ● ← TH_high = 0.75
3.0% ┤             •
     │               •
2.5% ┤                 •
     │                   •
2.0% ┤
     ├──┬──┬──┬──┬──┬──┬──┬──┤
    0.55 0.60 0.65 0.70 0.75 0.80 0.85 0.90
                   TH_high
```

---

## 2. FINANCIAL IMPACT TABLE

### 2.1 Revenue & Cost per Threshold

Base: 3,000 apps/tháng. Costs from damage-model.md + cost-of-error-table.md.

| TH_high | Approved/tháng | Revenue/năm (LTV) | FN cost/năm (NPL) | FP cost/năm (reject good) | Ops cost/năm | **Net Revenue Impact** | vs Baseline |
|---------|---------------|-------------------|-------------------|--------------------------|-------------|----------------------|-------------|
| **0.55** | ~2,160 | 77.8 tỷ | 38.9 tỷ | 24.2 tỷ | 1.3 tỷ | **13.4 tỷ** | ⚠️ More revenue but NPL explodes |
| **0.60** | ~2,040 | 73.4 tỷ | 34.6 tỷ | 29.4 tỷ | 1.5 tỷ | **7.9 tỷ** | 🟡 Marginal vs risk |
| **0.65** | ~1,950 | 70.2 tỷ | 31.5 tỷ | 34.6 tỷ | 1.7 tỷ | **2.4 tỷ** | 🟡 Approaching neutral |
| **0.70** | ~1,890 | 68.0 tỷ | 28.8 tỷ | 39.7 tỷ | 1.8 tỷ | **-2.3 tỷ** | Baseline zone |
| **0.75** ← | **~1,800** | **64.8 tỷ** | **26.5 tỷ** | **51.8 tỷ** | **2.1 tỷ** | **-15.6 tỷ** | **Baseline** |
| **0.80** | ~1,710 | 61.6 tỷ | 22.7 tỷ | 60.5 tỷ | 2.6 tỷ | **-24.2 tỷ** | ↓ Revenue declines faster |
| **0.85** | ~1,590 | 57.2 tỷ | 19.5 tỷ | 71.3 tỷ | 2.8 tỷ | **-36.4 tỷ** | ↓ Over-conservative |
| **0.90** | ~1,500 | 54.0 tỷ | 17.0 tỷ | 79.1 tỷ | 2.9 tỷ | **-45.0 tỷ** | ↓ Severe revenue loss |

### 2.2 Net Revenue Impact Curve

```
Net Revenue Impact (tỷ VND/năm) vs TH_high
Higher = better for bank

+15 ┤ •
    │
+10 ┤   •                    Revenue zone
    │                         (more customers)
 +5 ┤     •
    │
  0 ┤ ═══════•════════════════════════════════  break-even line
    │           •
 -5 ┤
    │
-15 ┤             ● ← 0.75 (proposed)        Risk-managed zone
    │                                          (fewer losses)
-25 ┤               •
    │
-35 ┤                 •
    │
-45 ┤                   •
    ├──┬──┬──┬──┬──┬──┬──┬──┤
   0.55 0.60 0.65 0.70 0.75 0.80 0.85 0.90
```

**Observation:** Net revenue impact improves as TH_high decreases (approve more → more revenue). Nhưng NPL constraint (≤ 3.5%) limits how low TH_high can go.

---

## 3. CO CAPACITY IMPACT

### 3.1 CO Workload per Threshold

| TH_high | State 1 volume/tháng | State 1 time (batch 4 min) | State 2 volume/tháng | State 2 time (full 25 min) | **Total CO hours/tháng** | **FTE needed** | Capacity saving vs 100% manual |
|---------|---------------------|--------------------------|---------------------|--------------------------|------------------------|---------------|-------------------------------|
| 0.55 | 2,040 | 136h | 420 | 175h | **486h** | **2.8** | 72% |
| 0.60 | 1,860 | 124h | 600 | 250h | **549h** | **3.1** | 68% |
| 0.65 | 1,650 | 110h | 810 | 338h | **623h** | **3.6** | 64% |
| 0.70 | 1,410 | 94h | 1,050 | 438h | **707h** | **4.0** | 59% |
| **0.75** | **1,110** | **74h** | **1,350** | **563h** | **812h** | **4.6** | **53%** |
| 0.80 | 750 | 50h | 1,710 | 713h | **938h** | **5.4** | 46% |
| 0.85 | 450 | 30h | 2,010 | 838h | **1,043h** | **6.0** | 40% |
| 0.90 | 240 | 16h | 2,220 | 925h | **1,116h** | **6.4** | 36% |

**Note:** State 3/4/5 hours (~175h) constant across all TH_high values. Included in total but not shown per column.

### 3.2 CO Capacity Curve

```
FTE Needed vs TH_high

10.0 ┤ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  100% manual (10 FTE)
     │
 8.0 ┤
     │
 6.0 ┤                             •    •
     │                       •
 4.6 ┤                 ● ← 0.75 (53% saving)
     │           •
 4.0 ┤     •
     │ •
 2.8 ┤•
     ├──┬──┬──┬──┬──┬──┬──┬──┤
    0.55 0.60 0.65 0.70 0.75 0.80 0.85 0.90
```

**Diminishing returns:** Going from 0.75 → 0.55 saves only 1.8 FTE more (4.6 → 2.8) but increases NPL significantly. Going from 0.75 → 0.90 adds 1.8 FTE (4.6 → 6.4) with moderate NPL improvement.

---

## 4. SWEET SPOT ANALYSIS — Where Should We Operate?

### 4.1 Multi-Criteria Decision Matrix

| TH_high | NPL constraint (≤3.5%) | Approval rate (≥50%) | CO saving (meaningful) | FP/FN cost balance | CO trust (not too much auto) | **Overall** |
|---------|----------------------|---------------------|----------------------|-------------------|----------------------------|-----------|
| 0.55 | ❌ Violates | ✅ 72% | ✅ 72% saving | ❌ FN explodes | ❌ CO may rubber-stamp | ❌ |
| 0.60 | ❌ Likely violates | ✅ 68% | ✅ 68% saving | ⚠️ FN high | ⚠️ Too much auto | ❌ |
| 0.65 | ⚠️ Borderline | ✅ 65% | ✅ 64% saving | ⚠️ FN elevated | ⚠️ High auto rate | ⚠️ |
| 0.70 | ✅ Likely meets | ✅ 63% | ✅ 59% saving | ✅ Acceptable | ⚠️ Somewhat high | 🟡 |
| **0.75** | **✅ Meets** | **✅ 60%** | **✅ 53% saving** | **✅ Balanced** | **✅ Manageable** | **✅ Recommended** |
| 0.80 | ✅ Beats | ✅ 57% | 🟡 46% saving | ⚠️ FP rising | ✅ Conservative | 🟡 |
| 0.85 | ✅ Well below | ✅ 53% | 🟡 40% saving | ❌ FP too high | ✅ Very conservative | ⚠️ |
| 0.90 | ✅ Minimal NPL | ⚠️ 50% borderline | ❌ 36% (limited) | ❌ FP dominates | ✅ Ultra conservative | ❌ |

### 4.2 Feasible Range

```
TH_high feasible range: [0.70 — 0.80]
                              │
                    0.70 ─────┤ More aggressive (lower NPL headroom)
                              │
                    0.75 ─────● Recommended starting point
                              │
                    0.80 ─────┤ More conservative (less operational benefit)
                              │

Below 0.70: NPL constraint violated or borderline → Risk Committee unlikely to approve
Above 0.80: Insufficient operational benefit → Head of Cards unlikely to support
```

### 4.3 Starting Point Recommendation

**TH_high = 0.75 cho first deployment (Week 37+).** Rationale:

| Factor | Evidence |
|--------|---------|
| **NPL safe** | 3.0-3.5% = at or below current baseline. Constraint satisfied. |
| **Approval rate adequate** | 60% = within industry range (55-65% for VN CC salaried). |
| **Ops benefit meaningful** | 53% CO capacity reduction (10 FTE → 4.6 FTE). |
| **Room to adjust** | 0.75 → 0.70 if NPL headroom allows (approved by Risk Committee). 0.75 → 0.80 if NPL spikes post-deploy. |
| **CO trust buildable** | 37% auto-route = CO still reviews majority. Trust builds gradually → can increase auto-route later. |
| **Conservative for v1** | Better to start safe, prove value, then optimize. Easier to lower threshold (approve more) than raise it (reject more customers who were getting approved). |

### 4.4 Post-Shadow Testing Optimization Path

```
Week 37-40 (Shadow):  Observe actual score distribution → calibrate
Week 41-43 (Limited):  Deploy at TH_high = 0.75 → measure real FP/FN/NPL
Week 44+   (Tuning):   
    │
    ├── IF NPL < 3.0% (headroom) AND FP rate > 8%:
    │   → Propose TH_high = 0.72 to Risk Committee (approve more)
    │
    ├── IF NPL > 3.5% (exceeded):
    │   → Propose TH_high = 0.78 to Risk Committee (tighten)
    │
    └── IF NPL ≈ 3.5% (at ceiling):
        → Maintain TH_high = 0.75 (operating at constraint)
```

---

## 5. RISK COMMITTEE DECISION AID

### 5.1 Three Scenarios for Committee

| Option | TH_high | Style | Approval Rate | NPL | CO FTE | Annual FP+FN Cost | Recommendation |
|--------|---------|-------|-------------|-----|--------|-------------------|---------------|
| **A: Aggressive** | 0.70 | "Grow revenue, accept risk" | 63% | 3.3-3.8% | 4.0 | 68.5 tỷ | Risk appetite high, NPL headroom exists |
| **B: Balanced** ← | 0.75 | "Prove safety first" | 60% | 3.0-3.5% | 4.6 | 78.3 tỷ | **Recommended for v1** |
| **C: Conservative** | 0.80 | "Minimize risk, show control" | 57% | 2.7-3.2% | 5.4 | 83.2 tỷ | Risk appetite low, regulator scrutiny high |

### 5.2 One-page Decision Framework

```
┌────────────────────────────────────────────────────────┐
│         THRESHOLD DECISION FOR RISK COMMITTEE           │
│                                                         │
│  Q1: What is our NPL ceiling?                          │
│      → ≤ 3.5% (current) → Options A, B, C all work    │
│      → ≤ 3.0% (strict)  → Only B or C                 │
│                                                         │
│  Q2: What is our approval rate floor?                  │
│      → ≥ 55% → Options A, B, C all work               │
│      → ≥ 60% → Only A or B                            │
│                                                         │
│  Q3: How much operational saving do we need?           │
│      → >50% CO saving → A or B                        │
│      → >40% sufficient → A, B, or C                   │
│                                                         │
│  Q4: Risk appetite for v1 deployment?                  │
│      → "Prove safety first"    → B (0.75) ← DEFAULT   │
│      → "Grow, accept some risk" → A (0.70)            │
│      → "Ultra cautious"        → C (0.80)             │
│                                                         │
│  RECOMMENDED: B (TH_high = 0.75)                       │
│  Review after 90 days with real performance data.       │
└────────────────────────────────────────────────────────┘
```

---

## 6. IMPLEMENTATION: DYNAMIC THRESHOLD (Future)

### 6.1 Current: Fixed Threshold

Week 12-44: TH_high = fixed value (0.75), changed only by Risk Committee approval.

### 6.2 Future: Dynamic Threshold (Week 49+, Phase 4)

Sau khi system stable + đủ data → có thể implement dynamic threshold:

| Approach | Mô tả | Benefit | Risk | Prerequisite |
|---------|-------|---------|------|-------------|
| **Seasonal adjustment** | TH_high tighter during Tết (high fraud season), looser during low season | Adapt to risk cycles | Complexity. CO confusion if threshold changes often. | ≥6 months data covering seasons |
| **Portfolio-level feedback** | Auto-adjust TH_high based on rolling 30-day NPL of AI-approved cohort | Self-correcting | Lag (NPL = DPD 90 → 3 month delay). Overreaction risk. | ≥12 months outcome data |
| **Segment-specific thresholds** | Different TH_high for existing vs new-to-bank, or by employer type | Better discrimination | Complexity. Bias risk (Luật AI 134/2025). | Enough data per segment |

**⚠️ Dynamic thresholds are Phase 4+ (Week 49+).** First deployment = fixed threshold, manual adjustment by Risk Committee. Don't over-engineer v1.

---

## Tracking — Tự hỏi cuối tuần

- [ ] Risk Committee đã review approval rate curve chưa?
- [ ] NPL ceiling đã agree? (≤ 3.5% hoặc stricter?)
- [ ] Approval rate floor đã agree? (≥ 50%? ≥ 55%?)
- [ ] Head of Cards view on operational saving target? (>50% CO saving?)
- [ ] Feasible range [0.70-0.80] — Risk Committee comfortable?
- [ ] Starting point 0.75 — formal approval hoặc concept approval?

---

## Ghi Chú & Limitations

1. **Tất cả con số dựa trên assumed score distribution.** Real approval rate curve sẽ khác — shape phụ thuộc model quality + real applicant population. Document này illustrate framework, không phải precise prediction.
2. **NPL estimates per TH_high** assume linear-ish relationship — thực tế có thể non-linear (concentration of bad applicants near threshold). Shadow testing sẽ reveal actual shape.
3. **"Overall Approval Rate"** bao gồm S1 auto-route + S2 CO approve. CO approval rate trong S2 assumed ~70% (ước tính). Actual CO behavior khác → actual approval rate khác.
4. **Revenue calculation** assume all approved cards generate equal LTV — thực tế VIP cards generate more, basic cards less. Simplification cho analysis.
5. **Cross-reference:** threshold-framework.md (threshold governance), cost-of-error-table.md (FP/FN costs), damage-model.md (NPL/fraud baseline), decision-architecture.md (state definitions).