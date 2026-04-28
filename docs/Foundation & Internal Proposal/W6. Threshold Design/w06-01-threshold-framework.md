# Threshold Framework — AI-CRDS
> **Tags:** `[Product]` `[Risk]` `[Model Design]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 6
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Trả lời 4 câu hỏi:
1. Tại sao TH_high = 0.75, không phải 0.70 hay 0.80?
2. Nếu tăng TH_high → approval rate giảm bao nhiêu?
3. Nếu giảm TH_high → NPL tăng bao nhiêu?
4. Optimal threshold ở đâu để balance FP vs FN cost?

Document này là spec cho Risk Committee approval. **PM propose, Risk Committee approve.**

---

## 1. THRESHOLD INVENTORY

### 1.1 All Thresholds in AI-CRDS

| # | Threshold | Symbol | Proposed Value | Controls what | State routing |
|---|----------|--------|---------------|-------------|--------------|
| TH1 | **Score high** | `TH_high` | 0.75 | Score trên này + confidence > 0.85 → auto-route approve queue | → State 1 |
| TH2 | **Score low** | `TH_low` | 0.35 | Score dưới này → AI leans toward reject (nhưng CO vẫn quyết định) | → State 2 (reject recommendation) |
| TH3 | **Fraud elevated** | `TH_fraud_elevated` | 0.40 | Fraud score trên này → priority fraud review | → State 3 |
| TH4 | **Fraud high** | `TH_fraud_high` | 0.70 | Fraud score trên này → near-certain fraud, highest priority | → State 3 (top of queue) |
| TH5 | **Confidence minimum** | `TH_confidence` | 0.60 | Confidence dưới này → AI uncertain, escalate | → State 4 |
| TH6 | **Dead zone** | `TH_dead_zone` | ±0.02 | Score within dead zone of TH_high → escalate thay vì ép decision | → State 4 |

### 1.2 Threshold Interaction

```
AI Risk Score (0.0 = high risk, 1.0 = low risk)
│
│  0.0          TH_low        TH_high-dz  TH_high  TH_high+dz        1.0
│   ├────────────┼───────────────┼──────────┼──────────┼──────────────┤
│   │            │               │          │          │              │
│   │  AI leans  │   Standard    │  DEAD    │  Auto-   │   Auto-      │
│   │  reject    │   Review      │  ZONE    │  route   │   route      │
│   │  (State 2) │   (State 2)   │ (State 4)│  approve │   approve    │
│   │            │               │          │ (State 1)│  (State 1)   │
│   │            │               │          │          │              │
│   0.00        0.35            0.73       0.75       0.77           1.00
│
│   IF confidence < 0.60 at ANY score → State 4 (Escalate)
│   IF fraud_score > 0.40 at ANY score → State 3 (Fraud)

Fraud Score (0.0 = clean, 1.0 = certain fraud)
│
│  0.0    TH_fraud_elevated   TH_fraud_high                         1.0
│   ├──────────┼───────────────┼──────────────────────────────────────┤
│   │          │               │                                      │
│   │  CLEAR   │   ELEVATED    │              HIGH                    │
│   │  (pass)  │   (State 3)   │           (State 3 priority)        │
│   │          │               │                                      │
│   0.00      0.40            0.70                                   1.00
```

---

## 2. COST-OF-ERROR FRAMEWORK

### 2.1 Error Costs (từ damage-model.md v1.0)

| Error type | Cost per error | How calculated | Source |
|-----------|---------------|---------------|--------|
| **False Positive (FP)** — reject good applicant | **36M VND** | LTV lost = 8M/năm × 3 years + acquisition cost | Damage model T3, assumptions A14-A15 |
| **False Negative (FN)** — approve bad applicant | **1.225M VND** | Expected Loss = PD × LGD × EAD = 3.5% × 70% × 50M | Damage model T1, assumptions A7-A9 |
| **Fraud miss** | **50M VND** | Full limit loss (100% LGD, 100% PD) | Damage model T2, assumption A12 |
| **Fraud false alarm** | **36M VND** | Same as FP (good applicant flagged as fraud → lost) + customer experience damage | Damage model T3 + qualitative |

### 2.2 Asymmetric Cost Ratio

```
FP cost / FN cost = 36M / 1.225M = 29.4x

→ Rejecting 1 good customer costs BANK 29.4x more than approving 1 bad customer.
→ Threshold should BIAS TOWARD APPROVAL (accept slightly more risk to not lose good customers).
```

**Nhưng:** Fraud miss cost (50M) >> FP cost (36M) >> FN cost (1.225M). Fraud threshold phải CONSERVATIVE (reject khi nghi ngờ).

### 2.3 Optimization Objective

```
Minimize:  Total Cost = FP_cost × FP_count + FN_cost × FN_count + Fraud_miss_cost × Fraud_miss_count

Subject to:
  (1) NPL_new ≤ NPL_current          (không làm NPL tệ hơn)
  (2) Approval_rate ≥ Floor            (business minimum — ❓ cần confirm, ước tính ≥ 50%)
  (3) Bias_metric ≤ Threshold          (Luật AI 134/2025: không phân biệt đối xử)
  (4) Human_review_rate ≥ SBV_minimum  (CO phải ký mọi quyết định — 100%)
```

---

## 3. THRESHOLD SENSITIVITY ANALYSIS

### 3.1 TH_high Sensitivity — Tại sao 0.75?

**Giả định:** Score distribution tuân theo logistic model (synthetic, chưa có real data). Distribution ước tính:

| Score range | % Applications | Risk profile | Proposed routing |
|------------|---------------|-------------|-----------------|
| 0.90-1.00 | ~10% | Very low risk | State 1 (auto-route approve) |
| 0.80-0.90 | ~15% | Low risk | State 1 |
| 0.75-0.80 | ~12% | Low-medium risk | State 1 (borderline — dead zone captures ±0.02) |
| 0.60-0.75 | ~25% | Medium risk | State 2 (standard review) |
| 0.35-0.60 | ~20% | Medium-high risk | State 2 (standard review, AI may lean reject) |
| 0.20-0.35 | ~10% | High risk | State 2 (AI recommends reject) |
| 0.00-0.20 | ~8% | Very high risk / thin file / anomaly | State 2 (reject recommendation) hoặc State 4 |

**⚠️ Distribution trên là ước tính synthetic.** Real distribution khác — chỉ biết sau khi train model trên real data. Mọi phân tích dưới đây mang tính illustrative.

### 3.2 TH_high: What If Analysis

| TH_high | State 1 (auto-route) | State 2 (review) | Estimated approval rate | NPL impact | Cost impact |
|---------|---------------------|-----------------|----------------------|-----------|-------------|
| **0.65** | ~62% | ~30% | ~70% (high) | 🔴 NPL tăng ~15-25% (more risky apps auto-routed, CO batch review miss) | FN cost ↑↑, FP cost ↓ |
| **0.70** | ~50% | ~42% | ~65% | 🟡 NPL tăng ~5-10% | FN cost ↑, FP cost ↓ |
| **0.75** ← proposed | ~37% | ~55% | ~60% | 🟢 NPL ≈ baseline hoặc giảm nhẹ | **Balanced** |
| **0.80** | ~25% | ~67% | ~57% | 🟢 NPL giảm ~5-10% | FN cost ↓, FP cost ↑ |
| **0.85** | ~15% | ~77% | ~53% | 🟢 NPL giảm ~10-15% (nhưng gần hết capacity saving) | FN cost ↓↓, FP cost ↑↑, ops cost ↑ |

### 3.3 Cost Simulation — TH_high Impact (Base: 3,000 apps/tháng)

| TH_high | FP cases/tháng | FP cost/năm | FN cases/tháng | FN cost/năm | Ops saving/năm | **Net annual cost** |
|---------|---------------|------------|---------------|------------|---------------|-------------------|
| 0.65 | 80 (-40) | 34.56 tỷ (-17.28) | 75 (+12) | 27.56 tỷ (+1.10) | 1.92 tỷ (+0.44) | **60.20 tỷ** |
| 0.70 | 95 (-25) | 41.04 tỷ (-10.80) | 70 (+7) | 25.73 tỷ (+0.27) | 1.65 tỷ (+0.17) | **65.12 tỷ** |
| **0.75** | **120 (base)** | **51.84 tỷ** | **63 (base)** | **26.46 tỷ** | **1.48 tỷ** | **76.82 tỷ** |
| 0.80 | 140 (+20) | 60.48 tỷ (+8.64) | 57 (-6) | 23.81 tỷ (-2.65) | 1.15 tỷ (-0.33) | **83.14 tỷ** |
| 0.85 | 165 (+45) | 71.28 tỷ (+19.44) | 52 (-11) | 21.65 tỷ (-4.81) | 0.72 tỷ (-0.76) | **91.21 tỷ** |

> **Note:** TH_high = 0.65 có net cost thấp hơn trên paper (60.20 tỷ vs 76.82 tỷ tại 0.75) nhưng **vi phạm NPL constraint** (NPL tăng 15-25% so với baseline) → Risk Committee sẽ không approve. 0.75 là lowest threshold không vi phạm NPL constraint (NPL ≈ baseline hoặc giảm nhẹ). Net cost tại 0.75 cao hơn vì FP cost cao — nhưng đây là "cost of safety" mà Risk Committee chấp nhận.

**Observation:** TH_high = 0.75 không phải absolute minimum cost. Nhưng:
- **0.65-0.70:** NPL tăng → Risk Committee sẽ không approve
- **0.80-0.85:** Ops saving giảm, FP cost tăng đáng kể, CO vẫn review gần hết
- **0.75:** Balance — NPL ≈ baseline, meaningful ops saving (37% auto-route), FP/FN cost cân bằng

### 3.4 Justification: Tại sao 0.75?

| Criterion | 0.70 | **0.75** | 0.80 |
|----------|------|------|------|
| NPL constraint (≤ baseline) | ⚠️ May violate | ✅ Meets | ✅ Meets |
| Approval rate (≥ 50%) | ✅ 65% | ✅ 60% | ✅ 57% |
| Auto-route rate (operational value) | 50% (very high, risky) | **37% (meaningful but safe)** | 25% (limited benefit) |
| FP/FN cost balance | FN cost ↑ | **Balanced** | FP cost ↑ |
| CO trust | ⚠️ Too many auto-routed → CO may stop reviewing carefully | ✅ Manageable batch size | ✅ But limited time saving |
| **Conservative start** | Too aggressive for v1 | **✅ Prudent for first deployment** | Too conservative |

**Kết luận:** 0.75 là starting point prudent cho first deployment. Không phải optimal — optimize sau khi có shadow testing data (Week 37-40). Risk Committee có thể adjust ±0.05 dựa trên risk appetite.

---

## 4. TH_LOW SENSITIVITY

### 4.1 TH_low: What If Analysis

| TH_low | Below TH_low (AI leans reject) | Impact |
|--------|-------------------------------|--------|
| **0.25** | ~12% apps | ⚠️ Quá ít reject recommendation → CO mất thời gian review cases clearly bad |
| **0.35** ← proposed | ~18% apps | ✅ Balance — AI flag clear reject cases, CO review medium zone |
| **0.45** | ~30% apps | ⚠️ Quá nhiều reject recommendation → miss borderline good applicants |

**Lưu ý:** TH_low không auto-reject. AI chỉ recommend reject — CO vẫn ký quyết định cuối cùng. TH_low chỉ ảnh hưởng AI recommendation display cho CO.

### 4.2 Justification: Tại sao 0.35?

- Score < 0.35 nghĩa là: CIC score thấp + DPD history + high DTI + multiple inquiries + thin/no CIC. Combined signals = very high risk.
- ~18% applications = ~540/tháng. Reasonable volume cho CO to review with reject recommendation.
- CO vẫn override nếu có information AI không có (relationship knowledge, verified income).
- **Conservative:** Prefer false alarm (flag good applicant as risky) over miss (let bad applicant through without flag).

---

## 5. FRAUD THRESHOLD SENSITIVITY

### 5.1 Fraud Threshold Cost Analysis

| Error | Cost | Direction |
|-------|------|----------|
| **Fraud miss** (fraud score < TH → not flagged) | 50M VND per case | → Lower threshold catches more fraud |
| **Fraud false alarm** (legit flagged as fraud) | 36M VND (LTV) + customer experience damage + review cost | → Higher threshold fewer false alarms |

**Asymmetric:** Fraud miss (50M) > Fraud false alarm (36M) → **threshold should err on catching more fraud** (lower TH_fraud_elevated).

### 5.2 TH_fraud_elevated: What If

| TH_fraud_elevated | Flagged for fraud review/tháng | True fraud caught | False alarms | Net cost impact |
|-------------------|------------------------------|-------------------|-------------|----------------|
| 0.30 | ~200 (6.7%) | ~24 (most) | ~176 | False alarm cost high but catches ~95% fraud |
| **0.40** ← proposed | ~100 (3.3%) | ~22 | ~78 | **Balance — catches ~90% fraud, manageable false alarms** |
| 0.50 | ~60 (2%) | ~18 | ~42 | Miss ~25% fraud, saves review time |

### 5.3 Justification: TH_fraud_elevated = 0.40, TH_fraud_high = 0.70

- **0.40 (elevated):** Catch ~90% of origination fraud. ~100 cases/tháng for fraud review = manageable (1 fraud analyst). False alarms review = 78 cases × 45 min = 58.5 hours/tháng ≈ 0.3 FTE.
- **0.70 (high):** Near-certain fraud. Auto-top-of-queue. Expected: ~10-15 cases/tháng. Very few false alarms. Trigger SIMO evaluation.
- **Fraud thresholds are MORE conservative than credit thresholds** because: (a) fraud cost per case > credit loss per case, (b) fraud = intentional → fraudster will try again, (c) regulatory obligation (TT 45/2025 SIMO reporting).

---

## 6. CONFIDENCE THRESHOLD

### 6.1 TH_confidence = 0.60 Justification

| Confidence level | Meaning | Action |
|-----------------|---------|--------|
| > 0.85 | Model very confident | Allow State 1 (auto-route approve) if score also passes |
| 0.60 - 0.85 | Model moderately confident | State 2 (CO full review). AI recommendation informative but not conclusive. |
| **< 0.60** | Model uncertain | **State 4 (Escalate).** AI doesn't know → don't pretend. Senior CO decide. |

**Tại sao 0.60?**
- < 0.60 confidence nghĩa là model ensemble disagrees, hoặc input features sparse/unusual.
- Ước tính ~5-10% applications will have confidence < 0.60 (edge cases, thin files with unusual patterns, new data patterns).
- **Principle: AI KHÔNG ép quyết định khi uncertain.** Luật AI 134/2025 Điều 4: human oversight. Low confidence = signal for human to take over.

---

## 7. DEAD ZONE DESIGN

### 7.1 Dead Zone = ±0.02 around TH_high

```
Score: ──────────[0.73]────[0.75]────[0.77]──────────
                  │    DEAD ZONE    │
                  │   → State 4     │
                  │   (Escalate)    │
```

**Purpose:** Applicant scoring exactly at 0.75 could be State 1 or State 2 depending on tiny model variance. Dead zone prevents "coin flip" routing for borderline cases.

**Impact:** ~4% applications (ước tính) land in dead zone → route to State 4 (Senior CO). Extra 120 cases/tháng cho Senior CO. Acceptable workload.

**±0.02 justification:**
- ±0.01: Quá hẹp — miss many borderline cases. Model variance alone can shift 0.01.
- **±0.02:** Capture meaningful borderline zone. ~4% volume.
- ±0.05: Quá rộng — 10%+ apps to State 4, overwhelm Senior CO.

---

## 8. THRESHOLD GOVERNANCE

### 8.1 Roles

| Role | Responsibility |
|------|---------------|
| **PM + Data Scientist** | Propose threshold values based on data analysis. Run sensitivity analysis. Present to Risk Committee. |
| **Risk Committee** | **APPROVE** all threshold values. Challenge assumptions. Set constraints (NPL ceiling, approval floor). Quarterly review. |
| **Risk Manager** | Emergency threshold changes (within ±0.05). Must report to Committee next meeting. |
| **CO team** | Provide feedback on operational impact of thresholds (queue size, review time). |

### 8.2 Approval Process

```
NORMAL THRESHOLD CHANGE
────────────────────────
PM + DS analyze data (1-2 weeks)
    │
    ▼
Prepare threshold proposal
├── Current threshold + performance data
├── Proposed new threshold + justification
├── Sensitivity analysis (FP/FN/cost impact)
├── Bias check (approval rate by gender, geography, age)
└── Recommendation
    │
    ▼
Risk Committee review (scheduled quarterly)
├── Review proposal
├── Challenge assumptions
├── Request additional analysis (nếu cần)
└── Decision: Approve / Reject / Modify
    │
    ▼
If approved:
├── Deploy new threshold
├── Monitor 2 weeks intensive
├── Report back to Committee
└── Log change in threshold_change_log
```

```
EMERGENCY THRESHOLD CHANGE
──────────────────────────
Trigger: NPL spike, fraud wave, model drift, regulatory event
    │
    ▼
Risk Manager can approve within ±0.05
├── Document justification
├── Deploy immediately
├── Notify Committee within 24h
└── Present at next Committee meeting for ratification
    │
    ▼
If change > ±0.05:
├── Convene emergency Committee meeting
├── Cannot deploy without Committee approval
└── Exception: Risk Manager can PAUSE AI system entirely
    (fallback to 100% manual) without Committee approval
```

### 8.3 Review Cadence

| Trigger | Review type | Who |
|---------|-----------|-----|
| **Quarterly** (scheduled) | Full threshold review: all 6 thresholds | Risk Committee |
| **Model retrain** | Mandatory review (model output distribution may shift) | Risk Committee |
| **NPL spike > 20%** vs baseline | Emergency review | Risk Manager → Committee |
| **Override rate > 50%** sustained 2 weeks | Investigation + possible adjustment | PM + DS → Risk Manager |
| **Approval rate shift > 5pp** | Investigation | PM + DS → Risk Manager |
| **Regulatory change** (new SBV circular, Luật AI update) | Compliance review + threshold assessment | Compliance → Risk Committee |

### 8.4 Threshold Change Log Schema

```python
THRESHOLD_CHANGE_LOG = {
    "change_id":        str,    # "TC-2026-Q2-001"
    "threshold_name":   str,    # "TH_high"
    "old_value":        float,  # 0.75
    "new_value":        float,  # 0.73
    "change_type":      str,    # "normal" | "emergency"
    "justification":    str,    # "Shadow testing showed optimal at 0.73..."
    "approved_by":      str,    # "Risk Committee" | "Risk Manager (emergency)"
    "approval_date":    date,
    "deploy_date":      date,
    "proposer":         str,    # "PM + DS"
    "sensitivity_doc":  str,    # Link to analysis document
    "monitoring_period": int,   # Days of intensive monitoring post-change
    "rollback_plan":    str,    # "Revert to 0.75 if NPL increases >10%"
}
```

---

## 9. BIAS MONITORING AT THRESHOLD

### 9.1 Why Bias Matters at Threshold

Threshold interacts with protected attributes. Example: if model systematically scores women lower → lower approval rate for women at same TH_high. Luật AI 134/2025 Điều 4: "không thiên lệch, không phân biệt đối xử."

### 9.2 Bias Checks per Threshold Review

| Check | Metric | Acceptable range | Action if violated |
|-------|--------|-----------------|-------------------|
| **Gender parity** | Approval rate gap M vs F | ≤ 5 percentage points | Investigate model features. Adjust if bias confirmed. |
| **Geography parity** | Approval rate gap urban vs rural (top 5 provinces) | ≤ 8 percentage points | Investigate. Geography bias may reflect real risk difference — but must justify. |
| **Age parity** | Approval rate gap per age band (21-30, 31-40, 41-50, 51+) | ≤ 10 percentage points (age is legitimate risk factor, wider range allowed) | Investigate if > 10pp. Age IS a legitimate credit risk factor — but extreme disparity needs review. |

### 9.3 Protected Attribute Monitoring Protocol

```
Every threshold review:
    │
    ├── Step 1: Calculate approval rate per protected attribute at current threshold
    │
    ├── Step 2: Simulate approval rate at proposed new threshold per attribute
    │
    ├── Step 3: Compare: does new threshold disproportionately impact any group?
    │   ├── If within acceptable range → proceed
    │   └── If outside range → STOP. Investigate before proceeding.
    │
    └── Step 4: Document bias check results in threshold proposal
```

---

## 10. IMPLEMENTATION NOTES FOR MVP (Week 12)

### 10.1 MVP Thresholds

| Threshold | MVP value | Rationale |
|----------|----------|-----------|
| TH_high | 0.75 | Conservative start |
| TH_low | 0.35 | Conservative |
| TH_fraud_elevated | 0.40 | Prioritize catching fraud |
| TH_fraud_high | 0.70 | High confidence fraud |
| TH_confidence | 0.60 | Don't guess when uncertain |
| Dead zone | ±0.02 | Capture borderline |

### 10.2 MVP vs Production Thresholds

| Aspect | MVP (Week 12) | Production (Week 37+) |
|--------|-------------|---------------------|
| **Data** | Synthetic | Real |
| **Calibration** | Based on assumed distributions | Based on actual score distribution |
| **Validation** | Sanity checks | Statistical validation (Gini, KS, AUC) |
| **Threshold tuning** | Manual, placeholder values | Data-driven, sensitivity analysis on real data |
| **Risk Committee approval** | Concept approval (acknowledging placeholders) | Formal approval with real data evidence |

### 10.3 Post-Shadow Testing Threshold Calibration (Week 40)

```
Shadow testing data (4 weeks) provides:
    │
    ├── Actual score distribution → recalculate TH_high/TH_low
    ├── AI vs manual comparison → validate FP/FN rates
    ├── Actual fraud detection → recalibrate TH_fraud
    ├── Confidence distribution → validate TH_confidence
    └── Bias metrics → check gender/geography/age parity
    │
    ▼
Recalibrate ALL thresholds → present to Risk Committee → deploy for limited deployment
```

---

## Tracking — Tự hỏi cuối tuần

- [ ] Risk Manager đã review threshold approach chưa? (Không cần approve values — approve framework)
- [ ] Asymmetric cost ratio (FP 29.4x FN) — Risk Manager đồng ý FP >> FN?
- [ ] NPL constraint (NPL_new ≤ NPL_current) — Risk Committee đồng ý constraint?
- [ ] Approval rate floor (≥ 50%) — Head of Cards đồng ý?
- [ ] Bias monitoring protocol — Compliance đồng ý approach?
- [ ] Dead zone (±0.02) — quá rộng? quá hẹp? Risk Committee view?
- [ ] Emergency threshold change authority — Risk Manager OK với ±0.05 authority?

---

## Ghi Chú & Limitations

1. **Tất cả sensitivity analysis dựa trên assumed score distribution.** Real distribution chỉ biết sau khi train model trên real data. Mọi con số trong Section 3-5 là illustrative.
2. **TH_high = 0.75 là starting point, không phải optimal.** Sẽ recalibrate sau shadow testing (Week 40). Risk Committee cần approve framework (governance process) ngay, approve values (con số cụ thể) khi có real data.
3. **Bias monitoring ranges (5pp gender, 8pp geography, 10pp age) là proposed.** Chưa có regulatory standard tại VN. Dựa trên EU AI Act inspiration + Luật AI 134/2025 principle. Risk Committee + Compliance phải agree.
4. **Score interpretation (0.0 = high risk, 1.0 = low risk)** — convention có thể đảo ngược tùy model implementation. Phải consistent across all documents.
5. **Cross-reference:** damage-model.md (cost-of-error), decision-architecture.md (state routing), assumptions-log.md (A7-A13 impact), feature-availability-matrix.md (model features affect score distribution).