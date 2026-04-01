# Synthetic Data Plan — AI-CRDS
> **Tags:** `[Data]` `[Architecture]` `[MVP]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 3
> **Version:** v1.0
> **Ngày:** 27/03/2026

---

## Mục đích

Week 12 MVP cần demo end-to-end: application input → AI score + explanation → decision recommendation → audit log. Không được dùng real customer data (Luật BVDLCN 91/2025, NĐ 356/2025). Cần synthetic data strategy ngay để:
1. MVP Week 12 có data demo realistic
2. Pipeline code viết trên synthetic data có thể reuse khi chuyển sang real data
3. Không vi phạm PDPD

---

## 1. Approach Decision

### 1.1 Ba phương án

| Phương án | Mô tả | Ưu điểm | Nhược điểm | Phù hợp khi |
|----------|-------|---------|-----------|-------------|
| **A. Fully synthetic** | Generate từ scratch dựa trên statistical distributions VN | Không dính PDPD. Có thể tạo ngay không cần bank data. Control hoàn toàn class balance, edge cases. | Có thể miss real-world correlations. Feature interactions không realistic bằng real data. | Chưa có access bank data. MVP demo. |
| **B. Anonymized real data** | Mask PII từ real data, giữ nguyên patterns + correlations | Giữ real-world correlations. Model train trên data này sẽ gần production hơn. | Cần access real data trước. Anonymization phải đảm bảo irreversible (re-identification risk). Vẫn có thể coi là DLCN nếu pseudonymized. | Có access real data + Compliance approve. |
| **C. Hybrid** | Schema + distributions từ real data, values generated synthetic | Balance giữa realism và privacy. Feature correlations gần reality hơn A. | Cần ít nhất aggregate statistics từ bank (mean, std, distribution shape). | Có aggregate stats nhưng không có raw data. |

### 1.2 Quyết định

**Phương án A (Fully Synthetic) cho MVP Week 12.**

Lý do:
- Chưa có access bank data tại thời điểm Week 3
- MVP mục tiêu là demo end-to-end flow, không phải model accuracy
- Không cần Compliance approval
- Có thể bắt đầu ngay
- Code/pipeline viết cho synthetic sẽ reuse 100% khi chuyển sang real data (chỉ đổi data source)

**Chuyển sang Phương án C (Hybrid) khi:**
- Có aggregate statistics từ bank partner (mean income, default rate, age distribution)
- Target: Week 17-20 khi có bank partner data access

**Chuyển sang Phương án B (Anonymized real) khi:**
- Có DPIA approved + Compliance sign-off
- Target: Week 27+ (production model training)

---

## 2. Data Schema — Mirror Real Bank Structure

### 2.1 Schema design principles

1. **Field names phải match** target bank CBS/CIC format → khi đổi sang real data chỉ đổi source, không đổi code
2. **Data types phải match** (string, float, int, date, categorical)
3. **Value ranges phải realistic** cho VN market
4. **Relationships giữa fields phải logical** (income ↔ debt ↔ DTI, age ↔ employment tenure)

### 2.2 Application Record Schema

```python
# Schema definition — mỗi record = 1 CC application
APPLICATION_SCHEMA = {
    # === IDENTITY & KYC (Nhóm 1) ===
    "application_id":       str,    # "APP-2026-000001"
    "apply_date":           date,   # "2026-01-15"
    "channel":              str,    # "online" | "branch" | "mobile_app"
    "cccd_number":          str,    # 12 digits (synthetic, KHÔNG dùng real CCCD)
    "full_name":            str,    # Synthetic Vietnamese name
    "date_of_birth":        date,   # "1990-05-20"
    "age":                  int,    # Derived from DOB
    "gender":               str,    # "M" | "F" (bias monitoring only)
    "province":             str,    # "Hà Nội" | "TP.HCM" | "Đà Nẵng" | ...
    "district":             str,    # "Cầu Giấy" | "Quận 1" | ...
    "phone_verified":       bool,   # True/False
    "ekyc_result":          str,    # "pass" | "fail"
    "ekyc_confidence":      float,  # 0.0 - 1.0
    "ekyc_face_match":      float,  # 0.0 - 1.0
    "ekyc_liveness":        bool,   # True/False
    "doc_authentic":        bool,   # True/False

    # === FINANCIAL CAPACITY (Nhóm 2) ===
    "monthly_income_declared": float,  # VND (millions)
    "income_verified":      bool,      # True if payroll detected
    "monthly_income_verified": float,  # VND (millions), null if not verified
    "income_source":        str,       # "salaried" | "self_employed" | "freelance"
    "employer_name":        str,       # Synthetic employer
    "employer_type":        str,       # "SOE" | "FDI" | "large_private" | "SME" | "startup"
    "employment_months":    int,       # Months at current employer
    "existing_bank_customer": bool,    # True/False

    # === CIC DATA (Nhóm 3) ===
    "has_cic_record":       bool,   # True/False (thin file if False)
    "cic_score":            int,    # 300-850 (null if no CIC)
    "cic_total_debt":       float,  # VND (millions)
    "cic_num_active_loans": int,    # 0-10+
    "cic_max_dpd_12m":      int,    # 0, 30, 60, 90, 120+
    "cic_max_debt_group":   int,    # 1-5
    "cic_inquiries_6m":     int,    # 0-20+
    "cic_credit_history_months": int, # 0-240+

    # === BEHAVIORAL — Existing customers only (Nhóm 4) ===
    "relationship_months":  int,    # 0 if new-to-bank
    "avg_balance_3m":       float,  # VND (millions), null if new
    "avg_txn_volume_3m":    float,  # VND (millions), null if new
    "salary_deposit_months": int,   # 0 if not detected or new
    "num_bank_products":    int,    # 0 if new-to-bank

    # === DERIVED ===
    "dti_declared":         float,  # cic_total_debt / monthly_income_declared
    "dti_verified":         float,  # cic_total_debt / monthly_income_verified (null if unverified)

    # === LABEL (target variable) ===
    "approved":             bool,   # True/False (historical decision)
    "default_flag":         int,    # 0 = good, 1 = default (DPD 90+ within 12 months)
    "dpd_max_12m":          int,    # Actual max DPD in 12 months post-approval
}
```

### 2.3 Audit Trail Record Schema (cho demo)

```python
AUDIT_SCHEMA = {
    "decision_id":          str,    # "DEC-2026-000001"
    "application_id":       str,    # FK to application
    "timestamp":            datetime,
    "model_version":        str,    # "v0.1.0-synthetic"
    "threshold_version":    str,    # "TH-2026-Q1-DEMO"
    "ai_risk_score":        float,  # 0.0 - 1.0
    "ai_fraud_flag":        bool,
    "ai_fraud_score":       float,  # 0.0 - 1.0
    "ai_confidence":        float,  # 0.0 - 1.0
    "ai_recommendation":    str,    # "APPROVE" | "REJECT" | "REVIEW" | "ESCALATE"
    "ai_explanation":       list,   # ["CIC score > 650", "DTI < 40%", ...]
    "human_decision":       str,    # "APPROVE" | "REJECT"
    "human_user_id":        str,    # "CO-DEMO-001"
    "override_flag":        bool,
    "override_reason":      str,    # null if no override
    "adverse_action_sent":  bool,   # True if rejected
    "ai_label":             str,    # "Quyết định được hỗ trợ bởi AI" (Luật AI 134/2025)
}
```

---

## 3. Data Size & Distribution

### 3.1 Size tiers

| Tier | Records | Use case | Generation time |
|------|---------|---------|----------------|
| **Minimum viable** | 1,000 | Quick demo, UI testing | < 1 phút |
| **Recommended** | 10,000 | Model training (logistic regression), statistical significance | < 5 phút |
| **Ideal** | 50,000 | Gradient boosting training, segment analysis | < 15 phút |

**MVP Week 12: 10,000 records.** Đủ train logistic regression baseline + demo credible.

### 3.2 Class distribution

| Label | % | Count (10K) | Rationale |
|-------|---|-------------|-----------|
| **Good (default_flag=0)** | 94-96% | ~9,500 | CC default rate VN ước tính 3-6%. Lấy 5% trung bình. |
| **Bad (default_flag=1)** | 4-6% | ~500 | Realistic class imbalance. Model cần handle. |

### 3.3 Feature distributions — VN Market

Dựa trên: GSO VN statistics, World Bank data, CIC conference (02/2026), industry knowledge.

#### Demographics

| Feature | Distribution | Parameters | Source/Rationale |
|---------|-------------|-----------|-----------------|
| **Age** | Truncated normal | mean=32, std=8, min=21, max=65 | VN median age ~31. CC salaried: skew toward 25-40. Min 21 (legal working age + buffer). |
| **Gender** | Bernoulli | P(M)=0.52, P(F)=0.48 | VN gender ratio ~1.04 M:F. Banking workforce balanced. |
| **Province** | Categorical weighted | HCM 35%, Hanoi 25%, Danang 8%, other urban 20%, rural 12% | CC penetration concentrated in HCM/HN. |
| **Channel** | Categorical | online 50%, mobile_app 30%, branch 20% | Digital bank trend VN 2025-2026. |

#### Financial Capacity

| Feature | Distribution | Parameters | Source/Rationale |
|---------|-------------|-----------|-----------------|
| **Monthly income (declared)** | Log-normal | median=15M VND, mean=20M, std=12M. Range 5M-150M. | GSO: average salary VN 2025 ~8-10M. CC salaried segment higher. Self-reported → inflate 20-30%. |
| **Income verified** | Bernoulli | P(verified)=0.40 | Ước tính 40% applicants nhận lương qua bank đang apply. |
| **Income verified amount** | 0.7-0.85 × declared | Actual lower than declared | Self-reported inflation ~15-30%. |
| **Employer type** | Categorical weighted | SOE 15%, FDI 25%, large_private 30%, SME 20%, startup 10% | CC salaried: bias toward formal employment. |
| **Employment months** | Exponential | mean=36, min=3, max=360 | Median ~2 years at current employer. Long tail cho senior. |
| **Existing customer** | Bernoulli | P(existing)=0.55 | Ước tính ~55% CC applicants đã có TK tại bank. |

#### CIC Data

| Feature | Distribution | Parameters | Source/Rationale |
|---------|-------------|-----------|-----------------|
| **Has CIC record** | Bernoulli | P(has)=0.82 | CIC coverage 71% dân số trưởng thành. CC salaried segment cao hơn: ~82%. |
| **CIC Score** | Normal (truncated) | mean=620, std=100, min=300, max=850 | CIC score range. Mean ~620 cho CC applicant population. |
| **Total debt** | Log-normal | median=50M, mean=120M VND | Bao gồm mortgage, personal loan, CC existing. Range 0-2B. |
| **Num active loans** | Poisson | lambda=1.5 | Trung bình 1-2 khoản vay active. |
| **Max DPD 12M** | Categorical weighted | 0: 75%, 30: 12%, 60: 6%, 90+: 7% | Phần lớn on-time. 7% có DPD 90+ match default rate. |
| **Inquiries 6M** | Poisson | lambda=2 | Trung bình 2 inquiries/6 tháng. |
| **Credit history months** | Exponential | mean=48, min=0, max=240 | Trung bình 4 năm credit history. |

#### Behavioral (existing customers only)

| Feature | Distribution | Condition | Parameters |
|---------|-------------|----------|-----------|
| **Relationship months** | Exponential | existing=True | mean=30, min=1, max=180 |
| **Avg balance 3M** | Log-normal | existing=True | median=20M, mean=45M VND |
| **Salary deposit months** | Uniform-ish | existing=True AND verified=True | 3-60 months |
| **Num bank products** | Poisson+1 | existing=True | lambda=1.2 (1-5 products) |

### 3.4 Feature correlations — quan trọng cho realism

Synthetic data phải preserve correlations, không generate independent:

| Correlation | Direction | Strength | Logic |
|------------|----------|---------|-------|
| Income ↔ CIC Score | Positive | Medium | Higher income → better repayment → higher CIC |
| Income ↔ Employer type | Structured | Strong | FDI/SOE → higher income. SME/startup → lower. |
| Age ↔ Employment months | Positive | Medium | Older → longer employment (capped at current job) |
| Age ↔ Credit history months | Positive | Strong | Older → longer credit history |
| CIC Score ↔ Default | Strong negative | Very strong | Lower CIC → higher default probability |
| DPD history ↔ Default | Strong positive | Very strong | Past DPD → future default |
| DTI ↔ Default | Positive | Medium | Higher DTI → higher default |
| Inquiries ↔ Default | Positive | Weak-Medium | More inquiries → credit hunger → higher default |
| Existing customer ↔ Default | Negative | Weak | Existing customers slightly lower default (relationship) |

**Implementation:** Generate features in dependency order, not independently. See Section 4.3.

### 3.5 Edge cases phải include

MVP demo phải có edge cases để show AI-CRDS handles them:

| # | Edge case | Records | Purpose |
|---|----------|---------|---------|
| 1 | **Thin file** (no CIC record) | ~1,800 (18%) | Demo thin-file handling → route to manual |
| 2 | **Very high DTI** (> 60%) | ~300 | Demo auto-reject or escalate |
| 3 | **Recent NPL** (debt group 3-5 trong 12M) | ~200 | Demo reject + adverse action notice |
| 4 | **eKYC fail** | ~50 | Demo fraud gate → auto-reject |
| 5 | **Very young** (age 21-23) | ~500 | Demo age-risk factor |
| 6 | **Very high income + bad CIC** | ~100 | Demo override scenario (CO override AI) |
| 7 | **Zero income declared** | ~20 | Demo data validation → need-more-info |
| 8 | **Duplicate CCCD** (same person, multiple apps) | ~30 | Demo fraud detection: application velocity |
| 9 | **Perfect applicant** (high income, high CIC, zero debt) | ~200 | Demo auto-approve path |
| 10 | **Borderline** (score near threshold) | ~500 | Demo manual review queue |

---

## 4. Tools & Implementation

### 4.1 Tool selection

| Tool | Mô tả | Dùng cho | Install |
|------|-------|---------|---------|
| **Python (core)** | Generation script | Orchestration | Built-in |
| **Faker** | Fake names, addresses, phone numbers | Vietnamese PII | `pip install faker` |
| **NumPy** | Statistical distributions | Feature generation | `pip install numpy` |
| **Pandas** | Data manipulation, export | Schema, CSV output | `pip install pandas` |
| **SDV** (Synthetic Data Vault) | Optional: advanced correlation modeling | Nếu cần complex correlations | `pip install sdv` |

**MVP approach: Python + Faker + NumPy + Pandas.** SDV chỉ dùng nếu correlation modeling bằng manual code không đủ realistic.

### 4.2 Vietnamese locale data

Faker cần Vietnamese locale cho realistic names/addresses:

```python
from faker import Faker
fake = Faker('vi_VN')

# Vietnamese names
fake.name()           # "Nguyễn Văn An"
fake.first_name()     # "An"
fake.last_name()      # "Nguyễn"

# Vietnamese addresses
fake.city()           # "Hà Nội"
fake.address()        # "123 Phố Huế, Hai Bà Trưng, Hà Nội"

# Phone (VN format)
fake.phone_number()   # "0912345678"
```

### 4.3 Generation logic — Dependency-aware

```python
# PSEUDOCODE — Generation order matters for correlations

for i in range(N_RECORDS):
    # Step 1: Demographics (independent)
    age = generate_age()                    # truncated normal
    gender = generate_gender()              # bernoulli
    province = generate_province()          # weighted categorical

    # Step 2: Employment (depends on age)
    employer_type = generate_employer_type()
    employment_months = generate_employment(age)  # capped by age
    income_declared = generate_income(employer_type, age)  # conditioned

    # Step 3: Banking relationship (partially independent)
    existing_customer = generate_existing(province)  # urban → higher
    income_verified = existing_customer and random() < 0.7
    income_actual = income_declared * uniform(0.70, 0.85) if income_verified

    # Step 4: CIC data (depends on age, income)
    has_cic = generate_cic_flag(age)  # older → more likely
    if has_cic:
        cic_score = generate_cic_score(income_declared, age)  # correlated
        cic_debt = generate_debt(income_declared)
        cic_dpd = generate_dpd(cic_score)  # lower score → more DPD
        # ... other CIC features
    else:
        # thin file: all CIC features = null

    # Step 5: Behavioral (only if existing customer)
    if existing_customer:
        avg_balance = generate_balance(income_actual or income_declared)
        # ... other behavioral features

    # Step 6: Derived features
    dti_declared = cic_debt / income_declared if income_declared > 0
    dti_verified = cic_debt / income_actual if income_verified

    # Step 7: Target label (depends on risk factors)
    default_probability = calculate_default_prob(
        cic_score, cic_dpd, dti, age, employment_months
    )
    default_flag = bernoulli(default_probability)

    # Step 8: eKYC (mostly pass, small fail rate)
    ekyc_result = generate_ekyc(include_fraud_cases=(i in fraud_indices))
```

### 4.4 Default probability model

Synthetic default label phải realistic — dựa trên known risk factors:

```python
def calculate_default_prob(cic_score, max_dpd_12m, dti, age, emp_months):
    """
    Simplified logistic model for synthetic default probability.
    NOT a real scoring model — chỉ để generate realistic labels.
    """
    base_logit = -3.0  # base default rate ~5%

    # CIC score effect (strongest predictor)
    if cic_score is not None:
        cic_effect = -0.008 * (cic_score - 600)  # higher score → lower risk
    else:
        cic_effect = 0.5  # thin file → higher base risk

    # DPD history (second strongest)
    dpd_effect = {0: 0, 30: 0.8, 60: 1.5, 90: 2.5}.get(max_dpd_12m, 3.0)

    # DTI effect
    dti_effect = max(0, (dti - 0.4)) * 3.0 if dti else 0.3

    # Age effect (U-shaped: young and old = higher risk)
    age_effect = 0.3 if age < 25 else (-0.2 if 30 <= age <= 45 else 0.1)

    # Employment stability
    emp_effect = -0.01 * min(emp_months, 60)  # longer = lower risk, capped

    logit = base_logit + cic_effect + dpd_effect + dti_effect + age_effect + emp_effect
    probability = 1 / (1 + exp(-logit))

    return probability
```

---

## 5. Validation — Synthetic Data Sanity Checks

### 5.1 Automated checks (phải pass trước khi dùng)

| # | Check | Expected | Fail action |
|---|-------|---------|-------------|
| 1 | **Default rate** | 4-6% | Adjust base_logit |
| 2 | **Age range** | 21-65, mean ~32 | Regenerate |
| 3 | **Income range** | 5M-150M VND, median ~15M | Adjust distribution |
| 4 | **CIC Score range** | 300-850, mean ~620 | Adjust distribution |
| 5 | **CIC coverage** | ~82% has_cic=True | Adjust probability |
| 6 | **Existing customer rate** | ~55% | Adjust probability |
| 7 | **DTI range** | 0-200%, median ~30% | Check income/debt distributions |
| 8 | **No null in required fields** | 0 nulls cho ID, name, DOB, CCCD | Fix generation |
| 9 | **Nulls correct for thin file** | CIC fields null when has_cic=False | Fix conditional logic |
| 10 | **Nulls correct for new customer** | Behavioral fields null when existing=False | Fix conditional logic |
| 11 | **Correlation direction** | CIC score ↔ default: negative | Check generation logic |
| 12 | **No real CCCD** | All CCCD synthetic (not matching real format fully) | Prefix with "SYN-" |
| 13 | **Edge cases present** | All 10 edge cases from 3.5 represented | Check counts |
| 14 | **Unique application_id** | 100% unique | Fix ID generation |
| 15 | **Employment months ≤ (age-18)*12** | Logical consistency | Cap employment |

### 5.2 Visual checks (manual review)

| # | Check | Method | Pass criteria |
|---|-------|--------|-------------|
| 1 | **Income distribution** | Histogram | Right-skewed, no spikes at round numbers |
| 2 | **Age distribution** | Histogram | Bell curve centered ~32, no values <21 or >65 |
| 3 | **CIC Score vs Default** | Scatter/box plot | Clear negative relationship |
| 4 | **DTI vs Default** | Box plot | Higher DTI in default group |
| 5 | **Feature correlation heatmap** | Heatmap | Expected correlations visible (Section 3.4) |
| 6 | **Sample records** | Print 20 random records | "Nhìn realistic không?" — human gut check |

### 5.3 Validation script outline

```python
def validate_synthetic_data(df):
    """Run all sanity checks. Return pass/fail per check."""
    results = {}

    # Check 1: Default rate
    default_rate = df['default_flag'].mean()
    results['default_rate'] = {
        'value': f"{default_rate:.2%}",
        'pass': 0.03 <= default_rate <= 0.07,
        'expected': '4-6%'
    }

    # Check 2: Age range
    results['age_range'] = {
        'value': f"{df['age'].min()}-{df['age'].max()}, mean={df['age'].mean():.1f}",
        'pass': df['age'].min() >= 21 and df['age'].max() <= 65,
        'expected': '21-65'
    }

    # ... (15 checks total)

    # Print report
    for check, result in results.items():
        status = "✅ PASS" if result['pass'] else "❌ FAIL"
        print(f"{status} | {check}: {result['value']} (expected: {result['expected']})")

    return all(r['pass'] for r in results.values())
```

---

## 6. Labeling & Watermarking — KHÔNG nhầm với real data

### 6.1 Bắt buộc trên mọi output

Mọi file synthetic data phải có:

```
# Header trong mọi CSV/JSON file
# ⚠️ SYNTHETIC DATA — NOT REAL CUSTOMERS
# Generated: 2026-03-27
# Purpose: AI-CRDS MVP Demo (Week 12)
# DO NOT use for production model training
# DO NOT share outside project team
```

### 6.2 CCCD watermarking

Synthetic CCCD KHÔNG được trùng format thật. Prefixed:

```python
# Real CCCD: 12 digits, starts with province code
# Synthetic: prefix "SYN" + 9 digits
cccd = f"SYN{fake.random_number(digits=9, fix_len=True)}"
# Example: "SYN123456789"
```

### 6.3 File naming convention

```
ai-crds-synthetic-10k-v1.0-20260327.csv     # Main dataset
ai-crds-synthetic-10k-v1.0-20260327.json     # JSON format
ai-crds-synthetic-audit-v1.0-20260327.csv    # Audit trail demo
ai-crds-synthetic-VALIDATION-20260327.html   # Validation report
```

---

## 7. Timeline & Deliverables

| Week | Deliverable | Owner |
|------|------------|-------|
| **Week 3** (now) | Synthetic data plan (this document) | Product |
| **Week 5** | Generation script v1 (1K records) + validation | Product + Dev |
| **Week 8** | Generation script v2 (10K records) + correlation tuning | Dev |
| **Week 10** | Synthetic data validated + schema confirmed with bank IT | Product + IT |
| **Week 12** | Synthetic dataset used in MVP demo | Product + Dev |
| **Week 17-20** | Hybrid dataset (synthetic + real distributions) nếu có bank stats | Dev + Data |
| **Week 27+** | Transition to anonymized real data (DPIA approved) | Dev + Compliance |

---

## 8. Real Data Transition Plan

Khi chuyển từ synthetic sang real data, cần đảm bảo:

### 8.1 Code reuse checklist

| Component | Reuse? | Changes needed |
|-----------|--------|---------------|
| Feature engineering pipeline | ✅ 100% reuse | Chỉ đổi data source (CSV → API/DB) |
| Model training code | ✅ 100% reuse | Đổi input, giữ code |
| Validation checks | ⚠️ 90% reuse | Adjust expected ranges cho real distribution |
| Audit trail schema | ✅ 100% reuse | model_version đổi từ "v0.1-synthetic" → "v1.0" |
| Demo UI | ✅ 100% reuse | Data source config change |
| Threshold logic | ⚠️ Recalibrate | Threshold cần recalibrate trên real data |

### 8.2 Prerequisites cho real data access

| # | Prerequisite | Status | Owner |
|---|-------------|--------|-------|
| 1 | DPIA approved | ❌ Chưa | Compliance |
| 2 | Consent mechanism in place | ❌ Chưa | Product + Compliance |
| 3 | Data access agreement bank ↔ vendor | ❌ Chưa | Legal |
| 4 | Anonymization pipeline built | ❌ Chưa | Dev |
| 5 | DPO assigned at bank partner | ❓ | Bank HR |
| 6 | Secure environment setup | ❌ Chưa | IT |

---

## Tracking — Tự hỏi cuối tuần

- [ ] Schema có match được với bank CBS/CIC format không? (Cần confirm với IT)
- [ ] Generation script v1 đã viết chưa? (Target: Week 5)
- [ ] Validation checks đã pass chưa? (15 checks)
- [ ] Edge cases đủ 10 loại chưa?
- [ ] Correlations realistic chưa? (CIC score ↔ default phải negative)
- [ ] Mọi file có watermark "SYNTHETIC DATA" chưa?
- [ ] CCCD prefixed "SYN" chưa? (Không trùng format thật)

---

## Ghi Chú & Limitations

1. **Synthetic data KHÔNG BAO GIỜ dùng cho production model training.** Chỉ cho demo, testing, development.
2. **Default probability model (Section 4.4) là simplified** — không phải real scorecard. Chỉ để generate realistic labels.
3. **Feature correlations là ước tính** từ industry knowledge. Real correlations có thể khác đáng kể.
4. **Vietnamese names/addresses từ Faker** — có thể có names không tự nhiên. Chấp nhận cho demo.
5. **Income distribution dựa trên GSO + ước tính** cho CC salaried segment. Real distribution tại mỗi bank khác nhau.
6. **Cross-reference:** feature-availability-matrix.md v1.1 (feature priority stack → MVP feature set), data-quality-scorecard.md (quality benchmarks), pdpd-impact-assessment.md v1.1 (PDPD compliance cho synthetic → real transition).