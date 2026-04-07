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
| **Unit** | Hours |

### L2-B3: Volume Issued per Month

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `Count(Applications where terminal_state = APPROVED AND card_issued = TRUE)` |
| **Window** | Calendar month. Report monthly. |
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
| **Window** | Rolling 12 months. Monthly report. |
| **Unit** | VND per approved application |

### L2-O1: Manual Review Rate

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `(State2 + State3 + State4) volume ÷ Total_Applications × 100%` |
| **"Manual"** | Any application requiring CO individual review (not batch confirm). State 1 batch confirm = NOT manual. |
| **Window** | Weekly rolling. |

### L2-O2: CO Capacity Utilization

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `Actual_CO_Review_Hours ÷ Available_CO_Hours × 100%` |
| **Available** | CO_Count × Working_Days × Productive_Hours_Per_Day (6h). |
| **Actual** | Sum of `co_review_time_seconds` from audit trail ÷ 3600. |
| **Window** | Weekly. |
| **Target range** | 70-80%. Below 60% = overstaffed. Above 90% = overloaded, SLA risk. |

### L2-O3: SLA Compliance Rate

| Attribute | Definition |
|-----------|-----------|
| **Formula** | `On_Time_Decisions ÷ Total_Decisions × 100%` |
| **On-time** | Decision made within SLA per state (S1: 4h, S2: 8h, S3: 4h, S4: 24h). |
| **Window** | Weekly. |
| **Segment** | By state. Overall = weighted by state volume. |

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