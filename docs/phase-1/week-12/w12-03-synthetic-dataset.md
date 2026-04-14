# Synthetic Dataset Spec — Week 12 Confirmation
> **Tags:** `[Data]` `[Build]` `[Tech]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 12
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Confirmation checklist cho synthetic dataset trước MVP demo. Full spec: `synthetic-data-plan.md` (Week 3 Task 4).

---

## 1. DATASET REQUIREMENTS

| Parameter | Target | Source |
|----------|--------|--------|
| Records | 10,000 | synthetic-data-plan.md §3 |
| Default rate | 4-6% (target 5%) | synthetic-data-plan.md §4 |
| CIC coverage | 82% (18% thin file) | feature-availability-matrix.md |
| Existing customer rate | 55% | synthetic-data-plan.md §4.2 |
| Age distribution | Truncated normal, mean=32, std=8, min=21, max=65 | synthetic-data-plan.md §4.1 |
| CCCD prefix | **"SYN"** + 9 digits | Mandatory — prevent confusion with real data |
| File header | "SYNTHETIC DATA — NOT REAL CUSTOMERS" | Mandatory — PDPD protection |
| Formats | CSV + JSON | Both required for flexibility |

---

## 2. GENERATION CHECKLIST

| # | Item | Status | Action if ❌ |
|---|------|--------|-------------|
| 1 | 10,000 records generated? | ❓ | Run generation script per synthetic-data-plan.md |
| 2 | CCCD prefix "SYN" on all records? | ❓ | Verify: `grep -v "SYN" data.csv | wc -l` should be 0 (header only) |
| 3 | File header "SYNTHETIC DATA"? | ❓ | Verify: `head -1 data.csv` |
| 4 | Default rate 4-6%? | ❓ | Verify: count `default_flag=1` ÷ total |
| 5 | CIC coverage ~82%? | ❓ | Verify: count `cic_score > 0` ÷ total |
| 6 | Age min ≥ 21, max ≤ 65? | ❓ | Verify: `min(age)`, `max(age)` |
| 7 | Income distribution realistic? | ❓ | Verify: mean ~15-20M, no negatives, no > 200M |
| 8 | DTI calculated correctly? | ❓ | Verify: `dti = cic_total_debt / monthly_income` |
| 9 | Employer type distribution? | ❓ | SOE 30%, FDI 25%, Private 25%, SME 15%, Startup 5% |
| 10 | Gender distribution? | ❓ | ~50/50 (±5%) |
| 11 | Province distribution? | ❓ | HCM 35%, HN 25%, Other 40% |
| 12 | Correlation pairs correct (9 pairs)? | ❓ | Income↔CIC, Age↔Employment, DTI↔default, etc. |
| 13 | Edge cases included (10 types)? | ❓ | Thin file, max DPD, very young, very old, max DTI, etc. |
| 14 | No real PII in any field? | ❓ | Manual spot check 20 random records |
| 15 | CSV + JSON formats available? | ❓ | Both files exist and parseable |

---

## 3. DEMO SCENARIO TEST RECORDS

Pre-create 3 specific records for demo scenarios (demo-script.md):

| Scenario | Record ID | Key attributes | Expected AI output |
|---------|----------|---------------|-------------------|
| **A: Happy path** | SYN-DEMO-001 | CIC 740, DTI 22%, 36M employment, eKYC 0.96 | Score ≥0.82, State 1 |
| **B: Borderline** | SYN-DEMO-002 | CIC 650, DTI 42%, 8M employment, 2 inquiries | Score ~0.52, State 2 |
| **C: Fraud** | SYN-DEMO-003 | Face match 0.58, velocity 3, thin file, income 30M | Fraud ≥0.70, State 3 |

---

## 4. GENERATION PROMPT (cho Claude Code / Script)

```
Tạo synthetic dataset 10,000 records cho AI-CRDS demo
theo schema và distributions trong synthetic-data-plan.md.

Requirements:
- Default rate: 5% (±1%)
- CIC coverage: 82%
- Existing customer rate: 55%
- Age: truncated normal, mean=32, std=8, min=21, max=65
- CCCD: prefix "SYN" + 9 random digits
- File header row 1: "SYNTHETIC DATA — NOT REAL CUSTOMERS"
- Include 3 pre-defined demo records (SYN-DEMO-001/002/003)
- Include 10 edge case records
- Run 15 validation checks
- Output: CSV + JSON
- Save to: data/synthetic/ai-crds-synthetic-10k-v1.0.csv

Validation must pass ALL 15 checks before dataset accepted.
```

---

## 5. AFTER GENERATION — Load into Supabase

```sql
-- Load CSV into Supabase applications table
-- Use Supabase Dashboard → Table Editor → Import CSV
-- OR use psql COPY command:

\COPY applications FROM 'ai-crds-synthetic-10k-v1.0.csv'
WITH (FORMAT csv, HEADER true);

-- Verify load
SELECT COUNT(*) FROM applications;  -- Should be 10,000
SELECT COUNT(*) FROM applications WHERE cccd NOT LIKE 'SYN%';  -- Should be 0
```

---

## Tracking

- [ ] Dataset generated (10K records)?
- [ ] All 15 validation checks pass?
- [ ] 3 demo records (SYN-DEMO-001/002/003) included?
- [ ] Loaded into Supabase?
- [ ] Record count verified (10,000)?
- [ ] No real PII confirmed?