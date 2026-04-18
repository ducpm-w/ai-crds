# MVP Build Notes — AI-CRDS v0.1.0
> **Tags:** `[Tech]` `[Product]` `[Build]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 12
> **Version:** v0.1.0-synthetic
> **Ngày:** 09/04/2026

---

## Mục đích

Technical spec cho MVP build. Input cho Claude Code / dev team. Scope: internal demo only, synthetic data, end-to-end flow.

---

## 1. TECH STACK — MVP

| Layer | Technology | Note |
|-------|-----------|------|
| **Frontend** | Next.js 14+ (React) | CO review UI, application form, audit viewer |
| **Backend** | Next.js API routes hoặc FastAPI | Scoring engine, audit write, routing logic |
| **Database** | Supabase (PostgreSQL) | Applications, audit_log, overrides |
| **Styling** | Tailwind CSS | Dark tech aesthetic (Linear-inspired) |
| **Deployment** | Vercel (frontend) + Supabase (DB) | Demo only, no production security |
| **Data** | CSV/JSON synthetic dataset (10K) | Pre-loaded into Supabase |

---

## 2. DATABASE SCHEMA

### Table: `applications`

```sql
CREATE TABLE applications (
    id              VARCHAR(30) PRIMARY KEY,   -- "APP-2026-04-000001"
    -- Personal
    full_name       VARCHAR(100) NOT NULL,
    cccd            VARCHAR(15) NOT NULL,       -- "SYN-079123456"
    date_of_birth   DATE NOT NULL,
    gender          VARCHAR(10),
    province        VARCHAR(50),
    -- Financial
    monthly_income  INTEGER NOT NULL,           -- VND
    employer_name   VARCHAR(100),
    employer_type   VARCHAR(20),                -- SOE/FDI/PRIVATE/SME/STARTUP
    employment_months INTEGER,
    -- CIC (mock)
    cic_score       INTEGER,                    -- 300-850
    cic_total_debt  INTEGER,                    -- VND
    cic_max_dpd_12m INTEGER,                    -- Days past due
    cic_inquiries_6m INTEGER,
    cic_active_loans INTEGER,
    cic_debt_group  INTEGER,                    -- 1-5
    cic_history_months INTEGER,
    -- eKYC (mock)
    ekyc_pass       BOOLEAN DEFAULT TRUE,
    ekyc_face_match NUMERIC(3,2),               -- 0.00-1.00
    ekyc_confidence NUMERIC(3,2),
    -- Status
    status          VARCHAR(20) DEFAULT 'PENDING', -- PENDING/SCORING/ROUTED/DECIDED
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `decisions`

```sql
CREATE TABLE decisions (
    id              VARCHAR(30) PRIMARY KEY,   -- "DEC-2026-04-000001"
    application_id  VARCHAR(30) REFERENCES applications(id),
    -- AI output
    ai_risk_score   NUMERIC(4,3),
    ai_fraud_score  NUMERIC(4,3),
    ai_confidence   NUMERIC(4,3),
    ai_recommendation VARCHAR(20),
    ai_explanation  JSONB,                      -- ["reason1", "reason2", "reason3"]
    state_routed    VARCHAR(10),                -- STATE_1 through STATE_5
    -- Human decision
    co_id           VARCHAR(20),
    human_decision  VARCHAR(20),                -- APPROVE/REJECT/REJECT_FRAUD
    approved_limit  INTEGER,
    co_review_seconds INTEGER,
    -- Override
    override_flag   BOOLEAN DEFAULT FALSE,
    override_reason_cat VARCHAR(5),
    override_reason_text TEXT,
    -- Compliance
    adverse_action_id VARCHAR(30),
    ai_label_displayed BOOLEAN DEFAULT TRUE,
    opt_out_ai      BOOLEAN DEFAULT FALSE,
    batch_review    BOOLEAN DEFAULT FALSE,
    batch_id        VARCHAR(30),
    -- Meta
    model_version   VARCHAR(30) DEFAULT 'v0.1.0-synthetic',
    threshold_version VARCHAR(30) DEFAULT 'TH-2026-Q1-v1',
    record_hash     VARCHAR(64),
    decided_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `audit_log`

```sql
-- Full 28-field schema from audit-log-schema.md
-- Append-only: REVOKE UPDATE, DELETE, TRUNCATE
-- See audit-log-schema.md for complete DDL
```

---

## 3. SCORING ENGINE

### 3.1 Credit Risk Score (Rule-based MVP)

```python
def calculate_risk_score(app: dict) -> dict:
    """
    Rule-based scoring for MVP. Returns score + explanation.
    Production: replace with ML model (logistic regression → GBM).
    """
    score = 0.50  # base score
    factors = []

    # === CIC Score (strongest signal) ===
    cic = app.get('cic_score', 0)
    if cic >= 720:
        score += 0.20
        factors.append({"factor": "CIC score excellent", "value": cic, "impact": "+0.20", "direction": "positive"})
    elif cic >= 650:
        score += 0.10
        factors.append({"factor": "CIC score adequate", "value": cic, "impact": "+0.10", "direction": "positive"})
    elif cic >= 550:
        pass  # neutral
    elif cic > 0:
        score -= 0.20
        factors.append({"factor": "CIC score low", "value": cic, "impact": "-0.20", "direction": "negative"})
    else:
        score -= 0.10  # thin file
        factors.append({"factor": "No CIC record (thin file)", "value": 0, "impact": "-0.10", "direction": "negative"})

    # === DPD History ===
    dpd = app.get('cic_max_dpd_12m', 0)
    if dpd == 0:
        score += 0.10
        factors.append({"factor": "No payment delays", "value": dpd, "impact": "+0.10", "direction": "positive"})
    elif dpd >= 90:
        score -= 0.30
        factors.append({"factor": "Severe payment delays (90+ days)", "value": dpd, "impact": "-0.30", "direction": "negative"})
    elif dpd >= 30:
        score -= 0.15
        factors.append({"factor": "Payment delays in 12 months", "value": dpd, "impact": "-0.15", "direction": "negative"})

    # === DTI ===
    income = app.get('monthly_income', 1)
    debt = app.get('cic_total_debt', 0)
    dti = debt / max(income, 1) if income > 0 else 999
    if dti < 0.30:
        score += 0.10
        factors.append({"factor": "Low debt-to-income ratio", "value": f"{dti:.0%}", "impact": "+0.10", "direction": "positive"})
    elif dti > 0.50:
        score -= 0.15
        factors.append({"factor": "High debt-to-income ratio", "value": f"{dti:.0%}", "impact": "-0.15", "direction": "negative"})
    elif dti > 0.40:
        score -= 0.05
        factors.append({"factor": "Borderline debt-to-income ratio", "value": f"{dti:.0%}", "impact": "-0.05", "direction": "negative"})

    # === Employment ===
    emp = app.get('employment_months', 0)
    if emp >= 36:
        score += 0.08
        factors.append({"factor": "Long employment tenure", "value": f"{emp} months", "impact": "+0.08", "direction": "positive"})
    elif emp >= 12:
        score += 0.03
    elif emp < 6:
        score -= 0.10
        factors.append({"factor": "Short employment tenure", "value": f"{emp} months", "impact": "-0.10", "direction": "negative"})

    # === Income ===
    if income >= 25_000_000:
        score += 0.05
    elif income < 10_000_000:
        score -= 0.10
        factors.append({"factor": "Income below minimum threshold", "value": f"{income:,} VND", "impact": "-0.10", "direction": "negative"})

    # === Inquiries ===
    inq = app.get('cic_inquiries_6m', 0)
    if inq >= 4:
        score -= 0.10
        factors.append({"factor": "Multiple recent credit inquiries", "value": inq, "impact": "-0.10", "direction": "negative"})
    elif inq >= 2:
        score -= 0.03
        factors.append({"factor": "Some recent credit inquiries", "value": inq, "impact": "-0.03", "direction": "negative"})

    # === Existing Customer Bonus ===
    if app.get('is_existing_customer', False):
        score += 0.05
        factors.append({"factor": "Existing Bank X customer", "value": "Yes", "impact": "+0.05", "direction": "positive"})

    # Clamp to [0, 1]
    final_score = max(0.0, min(1.0, round(score, 3)))

    # Sort factors by absolute impact
    factors.sort(key=lambda f: abs(float(f['impact'])), reverse=True)

    # Top 3 risk + top 3 positive
    risk_factors = [f for f in factors if f['direction'] == 'negative'][:3]
    positive_factors = [f for f in factors if f['direction'] == 'positive'][:3]

    # Confidence (simplified: based on data completeness)
    data_fields = ['cic_score', 'monthly_income', 'employment_months', 'cic_max_dpd_12m', 'cic_total_debt']
    filled = sum(1 for f in data_fields if app.get(f) is not None and app.get(f) != 0)
    confidence = round(0.50 + (filled / len(data_fields)) * 0.45, 2)  # 0.50-0.95 range

    return {
        "risk_score": final_score,
        "confidence": confidence,
        "risk_factors": risk_factors,
        "positive_factors": positive_factors,
        "all_factors": factors,
    }
```

### 3.2 Fraud Score (Simplified Rule-based)

```python
def calculate_fraud_score(app: dict) -> dict:
    """
    Simplified fraud scoring for MVP.
    Production: replace with ML fraud model.
    """
    fraud_score = 0.0
    triggers = []

    # eKYC face match
    face_match = app.get('ekyc_face_match', 1.0)
    if face_match < 0.70:
        fraud_score += 0.35
        triggers.append(f"Face match low ({face_match:.2f})")
    elif face_match < 0.85:
        fraud_score += 0.15
        triggers.append(f"Face match borderline ({face_match:.2f})")

    # Application velocity (mock: random flag for demo)
    velocity = app.get('application_velocity_24h', 1)
    if velocity >= 3:
        fraud_score += 0.25
        triggers.append(f"Multiple applications ({velocity}/24h)")

    # Income-profile mismatch
    income = app.get('monthly_income', 0)
    cic_score = app.get('cic_score', 0)
    if income > 20_000_000 and cic_score == 0:  # high income + thin file
        fraud_score += 0.15
        triggers.append("High income with no credit history")

    # Employer unverifiable (mock)
    if app.get('employer_unverifiable', False):
        fraud_score += 0.15
        triggers.append("Employer not found in business registry")

    fraud_score = min(1.0, round(fraud_score, 3))

    return {
        "fraud_score": fraud_score,
        "fraud_triggers": triggers,
        "fraud_level": "HIGH" if fraud_score >= 0.70 else "ELEVATED" if fraud_score >= 0.40 else "CLEAR",
    }
```

### 3.3 State Routing

```python
def route_to_state(risk_score, fraud_score, confidence, opt_out_ai=False) -> str:
    """
    Route application to decision state based on thresholds.
    Thresholds from threshold-framework.md.
    """
    TH_HIGH = 0.75
    TH_LOW = 0.35
    TH_FRAUD_ELEVATED = 0.40
    TH_CONFIDENCE = 0.60
    DEAD_ZONE = 0.02

    # Opt-out → State 2 (manual)
    if opt_out_ai:
        return "STATE_2"

    # Fraud check first (overrides credit routing)
    if fraud_score >= TH_FRAUD_ELEVATED:
        return "STATE_3"

    # Low confidence → escalate
    if confidence < TH_CONFIDENCE:
        return "STATE_4"

    # Dead zone → escalate
    if abs(risk_score - TH_HIGH) <= DEAD_ZONE:
        return "STATE_4"

    # High score → batch approve
    if risk_score >= TH_HIGH and confidence >= 0.85:
        return "STATE_1"

    # Below TH_LOW → lean reject in State 2
    # Between TH_LOW and TH_HIGH → standard review
    return "STATE_2"
```

---

## 4. PAGES TO BUILD

### 4.1 `/apply` — Application Input Form

| Element | Detail |
|---------|--------|
| **Fields** | name, CCCD (SYN prefix), DOB, gender, province, monthly_income, employer_name, employer_type (dropdown: SOE/FDI/PRIVATE/SME), employment_months |
| **Mock fields** | CIC data (auto-populated from synthetic dataset or random generation), eKYC result (auto pass/configurable fail) |
| **Submit** | → call scoring engine → save to `applications` + `decisions` → redirect to score page |
| **Watermark** | "SYNTHETIC DATA — DEMO ONLY" on all screens |

### 4.2 `/score/[id]` — AI Scoring Result

| Element | Detail |
|---------|--------|
| **Risk score** | Gauge chart (0-1.0). Color: green (<0.35 risk) / yellow (0.35-0.75) / red (>0.75) |
| **Confidence** | Progress bar with percentage |
| **Fraud score** | Badge: CLEAR (green) / ELEVATED (orange) / HIGH (red) |
| **State badge** | STATE_1 (blue) / STATE_2 (yellow) / STATE_3 (red) / STATE_4 (purple) / STATE_5 (gray) |
| **Explanation** | Top 3 risk + Top 3 positive factors (cards/chips) |
| **AI label** | "ⓘ Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo" — light blue banner, persistent |
| **Action** | "Go to Review" button → routes to appropriate review screen |

### 4.3 `/review/batch` — Batch Review Queue (State 1)

| Element | Detail |
|---------|--------|
| **Table** | Sortable: name, score, confidence, top factor, suggested limit |
| **Selection** | Checkbox per row. NO "select all." Max 10 per confirm. |
| **Expand** | Click row → inline detail (demographics + CIC + AI explanation) |
| **Actions** | "Confirm Selected" / "Override Selected" / "Move to Review" |
| **Counter** | "Selected: X/Y" + "Max batch: 10" |
| **AI label** | Top of page, persistent |

### 4.4 `/review/[id]` — Individual Review (State 2/3/4)

| Element | Detail |
|---------|--------|
| **Layout** | 2-column: AI panel (left) + Applicant data (right) |
| **AI panel** | Score + confidence + fraud + recommendation + top 3 risk + top 3 positive |
| **Data panel** | Demographics, CIC summary, eKYC status, income details |
| **SLA bar** | Progress bar: "4h/8h remaining" (State 2) |
| **CO notes** | Free text area (optional, saved with decision) |
| **Actions** | 4 buttons: APPROVE (+ limit dropdown) / REJECT / ESCALATE / NEED MORE INFO |
| **AI label** | Persistent top banner |

### 4.5 `/override/[id]` — Override Flow (Modal)

| Element | Detail |
|---------|--------|
| **Trigger** | When CO action contradicts AI recommendation |
| **Header** | "Override: [ACTION] — AI recommended [RECOMMENDATION]" |
| **Reason dropdown** | 7 categories (REL/INC/EMP/TMP/ERR/POL/OTH) |
| **Free text** | Required, min 20 chars, character counter |
| **Supervisor flag** | Auto-checked if: approve-when-AI-says-reject OR limit > threshold |
| **Note** | "Override sẽ được log trong audit trail" |
| **Buttons** | Cancel / Submit Override |

### 4.6 `/audit` — Audit Log Viewer

| Element | Detail |
|---------|--------|
| **Table** | All decisions, paginated (20/page) |
| **Columns** | decision_id, application_id, ai_score, human_decision, state, co_id, override_flag, timestamp |
| **Filters** | Date range, state, CO, decision type (approve/reject), override only |
| **Detail** | Click row → full 28-field record view |
| **Export** | "Export CSV" button (for demo reporting) |

---

## 5. STYLING & UX

| Element | Spec |
|---------|------|
| **Theme** | Dark tech aesthetic (bg: #0A0A0A, surface: #1A1A1A, border: #2A2A2A) |
| **Accent** | Blue (#3B82F6) for primary actions. Red (#EF4444) for alerts/reject. Green (#22C55E) for approve. |
| **Font** | Inter (body), JetBrains Mono (scores/numbers) |
| **AI label** | Light blue banner (#DBEAFE bg, #1D4ED8 text), not dismissible |
| **Watermark** | "SYNTHETIC DATA — DEMO ONLY" — semi-transparent, top-right corner, every page |
| **Risk colors** | Low risk: green. Medium: yellow/amber. High: red. Matches ux-wireframes-notes.md. |

---

## 6. BUILD TIMELINE

| Day | Task | Deliverable |
|-----|------|------------|
| **1** | Database schema + Supabase setup. Load 10K synthetic data. | Tables created, data loaded |
| **2** | Scoring engine (risk + fraud + routing). Unit tests for 3 scenarios. | Scoring returns correct results |
| **3** | `/apply` form + `/score/[id]` result page. | Application → score flow works |
| **4** | `/review/batch` + `/review/[id]` screens. | CO review UIs functional |
| **5** | `/override/[id]` modal + audit log write. | Override flow + audit trail |
| **6** | `/audit` viewer + adverse action generation. AI label everywhere. | Full end-to-end flow |
| **7** | End-to-end test (3 scenarios). Screenshots. Demo rehearsal. | Demo-ready MVP |

---

## 7. TEST SCENARIOS — Must Pass

| # | Scenario | Input | Expected output | Pass? |
|---|---------|-------|-----------------|-------|
| 1 | High-score → State 1 | CIC 740, DTI 22%, 36M employment, eKYC pass | Score ≥0.75, confidence ≥0.85, State 1 | ❓ |
| 2 | Borderline → State 2 | CIC 650, DTI 42%, 8M employment | Score 0.45-0.70, State 2 | ❓ |
| 3 | Fraud signals → State 3 | Face match 0.58, velocity 3, thin file, income 30M | Fraud score ≥0.40, State 3 | ❓ |
| 4 | Low confidence → State 4 | CIC 0 (thin file), income 12M, 3M employment | Confidence <0.60, State 4 | ❓ |
| 5 | Override approve→reject | State 1 app, CO clicks Reject | Override pop-up, reason required, audit logged | ❓ |
| 6 | Adverse action generation | State 2 reject | Notice with top 3 reasons + AI label + rights | ❓ |
| 7 | Audit completeness | Any decision | 28 fields in audit_log, hash correct | ❓ |
| 8 | Batch confirm | Select 5 from State 1 queue | 5 records updated, audit logged × 5 | ❓ |

---

## Tracking

- [ ] Supabase project created?
- [ ] Synthetic data (10K) loaded into Supabase?
- [ ] Scoring engine passes 8 test scenarios?
- [ ] All 6 pages functional?
- [ ] AI label visible on EVERY screen?
- [ ] "SYNTHETIC DATA" watermark on every page?
- [ ] Audit log writes 28 fields per decision?
- [ ] Adverse action notice generates with top 3 reasons?
- [ ] Demo 3 scenarios end-to-end without errors?
- [ ] Backup screenshots captured?

---

## Ghi Chú

1. **MVP scoring = rule-based, NOT ML.** Production sẽ dùng logistic regression → gradient boosting trained trên real data. Rule-based MVP demonstrates concept + routing logic.
2. **"SYNTHETIC DATA — DEMO ONLY" watermark = mandatory.** PDPD violation nếu ai tưởng nhầm là real data.
3. **End-to-end flow > feature completeness.** Demo phải chạy từ đầu đến cuối. Từng feature có thể rough. Flow phải smooth.
4. **Cross-reference:** feature-availability-matrix.md (fields), threshold-framework.md (thresholds), ux-wireframes-notes.md (screen design), audit-log-schema.md (28 fields), adverse-action-template.md (notice templates), demo-script.md (3 scenarios).