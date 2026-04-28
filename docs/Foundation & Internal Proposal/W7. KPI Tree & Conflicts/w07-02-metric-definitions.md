# Metric Definitions — AI-CRDS
> **Tags:** `[Product]` `[Data]` `[Governance]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 7
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Định nghĩa chính xác từng metric: formula, data source, measurement window, caveats. Đảm bảo Business, Risk, và Compliance đo cùng 1 thứ khi nói cùng 1 tên.

---

## 1. NORTH STAR

### RARPA — Risk-Adjusted Revenue per Application

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `(CC_Revenue_12M - Credit_Loss_12M - Fraud_Loss_12M - Ops_Cost_12M) ÷ Total_Applications_12M` |
| **CC_Revenue** | Interest income (revolving balance × rate) + Annual fee + Interchange fee (issuer share). Source: CBS P&L per CC product. |
| **Credit_Loss** | Write-offs + Provisions for CC portfolio originated in measurement period. Source: Finance/Risk ledger. |
| **Fraud_Loss** | Confirmed origination fraud × full limit. Source: Fraud database. |
| **Ops_Cost** | CO salary (allocated to CC origination) + System cost (AI-CRDS infra). Source: Finance. |
| **Total_Applications** | Count of CC applications received (all channels). Source: Application system. |
| **Window** | Rolling 12 months. Report monthly. First meaningful reading: 12 months post-deployment. |
| **Caveat** | Credit loss has 90+ day lag (DPD 90 definition). RARPA at Month 6 will undercount losses. True RARPA requires 12-month vintage maturity. |
| **Unit** | VND per application |

---

## 2. LEVEL 2 — PRIMARY METRICS

### L2-B1: Approval Rate

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `Approved_Applications ÷ Total_Applications × 100%` |
| **Numerator** | Count of applications with terminal state = APPROVED. Include all channels. |
| **Denominator** | Count of all applications received. Include APPROVED + REJECTED + REJECTED_FRAUD + EXPIRED + WITHDRAWN. |
| **Exclude** | Duplicate applications (same CCCD within 30 days → count once). Test/internal applications. |
| **Window** | Weekly rolling. Report weekly. |
| **Segment** | Report overall + by channel (online/branch/app) + by customer type (existing/new-to-bank). |
| **Caveat** | Approval rate alone does NOT indicate quality. Rising approval rate + rising NPL = bad. Rising approval rate + stable NPL = good. Always read with L2-R1. |

### L2-B2: Time-to-Decision

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `Median(Decision_Timestamp - Application_Received_Timestamp)` |
| **Clock starts** | Application_Received_Timestamp = when system receives complete application (all required fields). |
| **Clock stops** | Decision_Timestamp = when CO signs final decision (approve/reject). |
| **Clock pauses** | When in State 5 (Need-More-Info). Customer wait time excluded. |
| **Window** | Weekly rolling. Report weekly. |
| **Report** | Median (not mean — outliers distort mean). Also report P75 and P95. |
| **Segment** | By state: S1 target ≤ 4h, S2 target ≤ 8h, S3 target ≤ 4h, S4 target ≤ 24h. |
| **Owner** | Ops Manager |
| **Data source** | AI-CRDS audit trail (application_received_timestamp, decision_timestamp) |
| **Target** | Median ≤ 4h (overall). P95 ≤ 24h. |
| **Unit** | Hours |

### L2-B3: Volume Issued per Month

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `Count(Applications where terminal_state = APPROVED AND card_issued = TRUE)` |
| **Numerator** | Applications with terminal state APPROVED AND card_issued flag = TRUE |
| **Denominator** | N/A (count metric) |
| **Window** | Calendar month. Report monthly. |
| **Owner** | Head of Cards |
| **Data source** | CBS (card issuance records) + AI-CRDS audit trail |
| **Target** | ≥ 1,800/tháng (maintain current) |
| **Caveat** | Approved ≠ Issued. Customer may not activate card. Track both. |

### L2-R1: NPL Rate

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `Outstanding_DPD90+ ÷ Total_CC_Outstanding × 100%` |
| **Numerator** | Sum of outstanding balance where DPD ≥ 90 days, for CC portfolio originated via AI-CRDS. |
| **Denominator** | Total outstanding CC balance for AI-CRDS originated portfolio. |
| **Default definition** | DPD 90+ (align Basel II). ❓ Confirm Bank X uses same definition. |
| **Window** | Monthly snapshot. Report monthly. |
| **Lag** | **90+ day measurement lag.** Application approved today → earliest NPL signal = 90 days later. Full vintage maturity: 12 months. |
| **Segment** | By vintage month (approval cohort). By AI score band at approval. By state at approval (S1 vs S2). |
| **Owner** | Risk Manager |
| **Data source** | Core Banking System → DPD tracking. Filter: originated via AI-CRDS. |
| **Target** | ≤ 3.5% (current baseline). Stretch: ≤ 2.8% (-20%). |
| **Caveat** | First 3 months post-deployment: NPL data NOT yet available for AI-CRDS cohort. Use DPD 30+ as early warning. |

### L2-R2: Fraud Rate at Origination

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `Confirmed_Origination_Fraud ÷ Total_Applications × 100%` |
| **Numerator** | Count of applications where post-approval investigation confirms identity fraud, document fraud, or application fraud. |
| **Denominator** | Total applications (same as L2-B1 denominator). |
| **Window** | Monthly rolling. Report monthly. |
| **Detection lag** | Fraud discovery may take 1-6 months. Some fraud only detected when customer disputes charges or account goes to collections. |

### L2-R3: Expected Loss per Approved Application

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `(Total_Credit_Loss_12M + Total_Fraud_Loss_12M) ÷ Approved_Applications_12M` |
| **Numerator** | Total credit write-offs + confirmed fraud losses, for AI-CRDS originated CC portfolio, trailing 12 months |
| **Denominator** | Count of applications approved via AI-CRDS in same 12-month period |
| **Window** | Rolling 12 months. Monthly report. |
| **Owner** | Risk Manager |
| **Data source** | Finance ledger (write-offs, provisions) + Fraud database + AI-CRDS audit trail |
| **Target** | ≤ 1.225M VND (current EL). Stretch: ≤ 1.0M VND. |
| **Unit** | VND per approved application |

### L2-O1: Manual Review Rate

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `(State2 + State3 + State4) volume ÷ Total_Applications × 100%` |
| **Numerator** | Count of applications routed to State 2, 3, or 4 (requiring individual CO review) |
| **Denominator** | Total applications received |
| **"Manual"** | Any application requiring CO individual review (not batch confirm). State 1 batch confirm = NOT manual. |
| **Window** | Weekly rolling. |
| **Owner** | Ops Manager |
| **Data source** | AI-CRDS routing log (state assignments) |
| **Target** | ≤ 55% (≥ 45% auto-route to State 1) |

### L2-O2: CO Capacity Utilization

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `Actual_CO_Review_Hours ÷ Available_CO_Hours × 100%` |
| **Numerator** | Sum of `co_review_time_seconds` from audit trail ÷ 3600. |
| **Denominator** | CO_Count × Working_Days × Productive_Hours_Per_Day (6h). |
| **Window** | Weekly. |
| **Owner** | Ops Manager |
| **Data source** | AI-CRDS audit trail (review time) + HR (CO headcount, working days) |
| **Target** | 70-80%. Below 60% = overstaffed. Above 90% = overloaded, SLA risk. |

### L2-O3: SLA Compliance Rate

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `On_Time_Decisions ÷ Total_Decisions × 100%` |
| **Numerator** | Count of decisions made within SLA per state (S1: 4h, S2: 8h, S3: 4h, S4: 24h) |
| **Denominator** | Total decisions across all states |
| **On-time** | Decision made within SLA per state. |
| **Window** | Weekly. |
| **Owner** | Ops Manager |
| **Data source** | AI-CRDS audit trail (state entry timestamp, decision timestamp) |
| **Target** | ≥ 90% (all states weighted) |
| **Segment** | By state. Overall = weighted by state volume. |

---

## 4. ALERT THRESHOLDS — Escalation Ladder per Metric

Mỗi metric có 3-level alert: Warning → Review → Emergency.

| Metric | ✅ Normal | ⚠️ Warning (→ Owner review) | 🟡 Review (→ Risk Manager + PM) | 🔴 Emergency (→ Risk Committee) |
|--------|----------|----------------------------|--------------------------------|--------------------------------|
| **L2-B1 Approval rate** | 55-65% | < 55% hoặc > 65% | < 50% hoặc > 70% | < 45% hoặc > 75% |
| **L2-B2 Time-to-decision (P95)** | ≤ 24h | > 24h | > 48h | > 72h |
| **L2-B3 Volume issued** | ≥ 1,800/tháng | < 1,500 (-17%) | < 1,200 (-33%) | < 900 (-50%) |
| **L2-R1 NPL rate** | ≤ 3.0% | **+50 bps above baseline** (3.5% → 4.0%) | **+100 bps** (3.5% → 4.5%) | **+200 bps** (3.5% → 5.5%) → **Emergency stop** |
| **L2-R2 Fraud rate** | ≤ 0.56% | +30 bps (0.8% → 1.1%) | +60 bps (0.8% → 1.4%) | > 1.5% → Emergency fraud review |
| **L2-R3 EL per app** | ≤ 1.0M | > 1.225M (baseline) | > 1.5M (+22%) | > 2.0M (+63%) → Threshold review |
| **L2-O1 Manual review rate** | ≤ 55% | > 60% | > 70% | > 80% (AI barely adding value) |
| **L2-O2 CO utilization** | 70-80% | > 85% hoặc < 60% | > 90% | > 95% → Capacity emergency |
| **L2-O3 SLA compliance** | ≥ 90% | < 90% | < 80% | < 75% → Process failure |
| **L3-W2 Override rate** | 10-20% | > 30% hoặc < 5% | > 40% hoặc < 3% | > 60% hoặc < 2% |
| **L3-M7 PSI (drift)** | < 0.10 | > 0.10 | > 0.20 | > 0.25 → Retrain |
| **L3-C4 Gender gap** | ≤ 5pp | > 5pp | > 8pp | > 12pp → Luật AI investigation |

### Alert Response Protocol

```
⚠️ WARNING:   Owner receives dashboard alert → investigate within 48h
🟡 REVIEW:    Risk Manager + PM notified → root cause analysis within 1 week
🔴 EMERGENCY: Risk Committee convened → response within 4h
              Possible actions: tighten/loosen threshold, pause AI, retrain model
```

### NPL Alert Example (most critical metric)

```
NPL RATE ESCALATION LADDER

Baseline: 3.5%

    3.5% ── Normal operation
    │
    4.0% ── ⚠️ WARNING (+50 bps)
    │       → Risk Manager reviews monthly NPL report
    │       → Check: is increase from AI cohort or legacy?
    │       → Check: DPD 30+ trend (leading indicator)
    │
    4.5% ── 🟡 REVIEW (+100 bps)
    │       → Threshold review triggered
    │       → Vintage analysis: which approval month cohort is worse?
    │       → Consider: tighten TH_high by +0.03-0.05
    │
    5.5% ── 🔴 EMERGENCY (+200 bps)
            → Risk Committee emergency meeting
            → Pause State 1 (auto-route) → all cases to State 2 (full review)
            → Root cause analysis: model failure? External shock? Data issue?
            → Resume only after Committee approval
```

---

## 3. LEVEL 3 — DIAGNOSTIC METRICS (Key Definitions)

### L3-M2: Gini Coefficient

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `2 × AUC - 1` (derived from AUC-ROC) |
| **Interpretation** | 0 = random model. 1 = perfect. VN banking typical: 0.30-0.50 for logistic regression, 0.45-0.65 for gradient boosting. |
| **When** | Only meaningful with real data + actual default outcomes (90+ day lag). Synthetic data Gini = not representative. |

### L3-M7: PSI (Population Stability Index)

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `Σ (Actual_% - Expected_%) × ln(Actual_% / Expected_%)` across score bins |
| **Expected** | Score distribution at model training time (development sample). |
| **Actual** | Current score distribution (production scoring). |
| **Interpretation** | < 0.10: stable. 0.10-0.20: moderate shift, investigate. > 0.20: significant drift, retrain. |

### L3-W2: Override Rate

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `Overrides ÷ Total_CO_Decisions × 100%` |
| **Override** | CO decision ≠ AI recommendation. Includes: CO approve when AI recommends reject/review, CO reject when AI recommends approve. |
| **Segment** | By direction (override-to-approve vs override-to-reject). By CO (individual CO override patterns). |
| **Interpretation** | 10-20% = healthy (CO adds value). > 30% = model-CO misalignment (investigate). < 5% = CO may be rubber-stamping (investigate). |

**Rubber-stamping detection:**
- Override rate < 5% **AND** avg `co_review_time_seconds` < 120 giây (2 phút) for State 1 batch confirm → **ALERT: CO batch-confirming without actually reviewing.**
- Action: Spot audit 10 random batch confirmations per week. Check: did CO open applicant detail? Did CO view CIC summary? Or just click "confirm all" immediately?
- If confirmed rubber-stamping → (a) Mandatory CO training refresh. (b) Reduce max batch size. (c) Consider requiring CO to click into each record before confirm enabled (UI guardrail).

---

## Tracking

- [ ] Finance đã confirm RARPA formula feasible (data available)?
- [ ] Risk Manager đã confirm NPL definition (DPD 90+)?
- [ ] Ops Manager đã confirm SLA measurement approach?
- [ ] All metric data sources identified và accessible?

---

## Ghi Chú

1. **Metric definitions MUST be agreed** before measurement starts. Changing definitions mid-project → incomparable data.
2. **NPL 90-day lag** = biggest limitation. First 3 months post-deploy → monitor DPD 30+ as early proxy.
3. **Cross-reference:** kpi-tree.md (hierarchy), metric-conflict-memo.md (tensions between metrics), guardrail-definitions.md (acceptable ranges).