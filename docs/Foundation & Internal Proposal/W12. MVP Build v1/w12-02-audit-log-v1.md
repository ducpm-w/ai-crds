# Audit Log Schema — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Define audit trail schema: 28 fields, immutable, SBV inspection ready. Bắt buộc cho mọi decision trong AI-CRDS (Luật AI 134/2025, SBV TT 13, NĐ 356).

---

## 1. AUDIT RECORD SCHEMA

### 1.1 Full Schema (28 fields)

```python
AUDIT_RECORD = {
    # === IDENTITY (4 fields) ===
    "decision_id":           str,    # "DEC-2026-04-000001" (PK, auto-generated)
    "application_id":        str,    # "APP-2026-04-000001" (FK to applications)
    "customer_id":           str,    # Pseudonymized hash (NOT raw CCCD)
    "tenant_id":             str,    # "BANK-X" (multi-tenant ready for future SaaS)

    # === TIMING (5 fields) ===
    "application_received":  datetime,  # When app entered system
    "scoring_started":       datetime,  # When AI scoring began
    "scoring_completed":     datetime,  # When AI scoring finished
    "co_review_started":     datetime,  # When CO opened review screen
    "decision_timestamp":    datetime,  # When CO signed decision (FINAL)

    # === AI OUTPUT (8 fields) ===
    "model_version":         str,    # "v0.1.0-synthetic" (traceability)
    "threshold_version":     str,    # "TH-2026-Q1-v1" (which thresholds applied)
    "ai_risk_score":         float,  # 0.0-1.0 (credit risk)
    "ai_fraud_score":        float,  # 0.0-1.0 (fraud risk)
    "ai_confidence":         float,  # 0.0-1.0 (model confidence)
    "ai_recommendation":     str,    # APPROVE / REVIEW / ESCALATE / NEED_MORE_INFO
    "ai_explanation":        list,   # ["DTI 42% (borderline)", "Employment 8M", ...]
    "state_routed_to":       str,    # STATE_1 / STATE_2 / STATE_3 / STATE_4 / STATE_5

    # === HUMAN DECISION (6 fields) ===
    "co_id":                 str,    # "CO-001" (pseudonymized CO identifier)
    "human_decision":        str,    # APPROVE / REJECT / REJECT_FRAUD / ESCALATE / NEED_MORE_INFO
    "approved_limit":        int,    # VND (null nếu rejected). Ví dụ: 50000000
    "co_review_seconds":     int,    # Actual review time (measured by UI)
    "override_flag":         bool,   # True nếu CO decision ≠ AI recommendation
    "override_reason_cat":   str,    # REL / INC / EMP / TMP / ERR / POL / OTH (null nếu no override)
    "override_reason_text":  str,    # Free text (null nếu no override, min 20 chars nếu có)

    # === COMPLIANCE (5 fields) ===
    "adverse_action_id":     str,    # "AAN-2026-04-000001" (null nếu approved)
    "ai_label_displayed":    bool,   # True nếu AI label shown (Luật AI 134/2025)
    "opt_out_ai":            bool,   # True nếu customer opted out of AI
    "batch_review_flag":     bool,   # True nếu reviewed as part of batch (State 1)
    "batch_id":              str,    # "BATCH-2026-04-001" (null nếu individual review)
}
```

### 1.2 Field Categories

| Category | Fields | Purpose |
|---------|--------|---------|
| **Identity** | 4 | Traceability: which application, which customer, which tenant |
| **Timing** | 5 | Timeline reconstruction: how long each step took |
| **AI Output** | 8 | What AI said: score, confidence, explanation, routing |
| **Human Decision** | 6 | What CO decided: approve/reject, override, time spent |
| **Compliance** | 5 | Regulatory proof: AI label, opt-out, adverse action, batch |

---

## 2. DATABASE IMPLEMENTATION

### 2.1 PostgreSQL DDL (MVP)

```sql
-- AI-CRDS Audit Trail — Append-Only
-- MVP: PostgreSQL 15+
-- CRITICAL: No UPDATE, No DELETE permissions

CREATE TABLE audit_log (
    -- IDENTITY
    decision_id          VARCHAR(30) PRIMARY KEY,
    application_id       VARCHAR(30) NOT NULL,
    customer_id          VARCHAR(64) NOT NULL,  -- SHA256 pseudonymized
    tenant_id            VARCHAR(20) NOT NULL DEFAULT 'BANK-X',

    -- TIMING
    application_received TIMESTAMPTZ NOT NULL,
    scoring_started      TIMESTAMPTZ,
    scoring_completed    TIMESTAMPTZ,
    co_review_started    TIMESTAMPTZ,
    decision_timestamp   TIMESTAMPTZ NOT NULL,

    -- AI OUTPUT
    model_version        VARCHAR(30) NOT NULL,
    threshold_version    VARCHAR(30) NOT NULL,
    ai_risk_score        NUMERIC(4,3),       -- 0.000-1.000
    ai_fraud_score       NUMERIC(4,3),
    ai_confidence        NUMERIC(4,3),
    ai_recommendation    VARCHAR(20),         -- APPROVE/REVIEW/ESCALATE/NEED_MORE_INFO
    ai_explanation       JSONB,               -- ["reason1", "reason2", "reason3"]
    state_routed_to      VARCHAR(10),         -- STATE_1 through STATE_5

    -- HUMAN DECISION
    co_id                VARCHAR(20) NOT NULL,
    human_decision       VARCHAR(20) NOT NULL, -- APPROVE/REJECT/REJECT_FRAUD/ESCALATE/NEED_MORE_INFO
    approved_limit       INTEGER,              -- VND, null if rejected
    co_review_seconds    INTEGER,
    override_flag        BOOLEAN NOT NULL DEFAULT FALSE,
    override_reason_cat  VARCHAR(5),           -- REL/INC/EMP/TMP/ERR/POL/OTH
    override_reason_text TEXT,

    -- COMPLIANCE
    adverse_action_id    VARCHAR(30),          -- null if approved
    ai_label_displayed   BOOLEAN NOT NULL DEFAULT TRUE,
    opt_out_ai           BOOLEAN NOT NULL DEFAULT FALSE,
    batch_review_flag    BOOLEAN NOT NULL DEFAULT FALSE,
    batch_id             VARCHAR(30),

    -- IMMUTABILITY
    record_hash          VARCHAR(64) NOT NULL, -- SHA256 of all fields above
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- NO updated_at — append-only
);

-- INDEXES for common queries
CREATE INDEX idx_audit_application ON audit_log(application_id);
CREATE INDEX idx_audit_customer ON audit_log(customer_id);
CREATE INDEX idx_audit_decision_time ON audit_log(decision_timestamp);
CREATE INDEX idx_audit_co ON audit_log(co_id);
CREATE INDEX idx_audit_state ON audit_log(state_routed_to);
CREATE INDEX idx_audit_override ON audit_log(override_flag) WHERE override_flag = TRUE;

-- IMMUTABILITY ENFORCEMENT
REVOKE UPDATE ON audit_log FROM PUBLIC;
REVOKE DELETE ON audit_log FROM PUBLIC;
REVOKE TRUNCATE ON audit_log FROM PUBLIC;

-- Only the application service account can INSERT
GRANT INSERT ON audit_log TO aicrds_app;
GRANT SELECT ON audit_log TO aicrds_app;
GRANT SELECT ON audit_log TO aicrds_readonly;  -- For CO, auditors, dashboard
```

### 2.2 Record Hash Calculation

```python
import hashlib
import json

def calculate_record_hash(record: dict) -> str:
    """
    SHA256 hash of all audit fields (excluding record_hash and created_at).
    Used to detect tampering. If any field modified → hash mismatch.
    """
    # Remove meta fields
    hashable = {k: v for k, v in record.items()
                if k not in ('record_hash', 'created_at')}

    # Deterministic JSON serialization
    canonical = json.dumps(hashable, sort_keys=True, default=str)

    return hashlib.sha256(canonical.encode('utf-8')).hexdigest()
```

### 2.3 Hash Chain (Production Enhancement)

```python
# MVP: Individual record hash only
# Production: Hash chain (each record references previous hash)

def calculate_chain_hash(record: dict, previous_hash: str) -> str:
    """
    Hash chain: hash(current_fields + previous_record_hash).
    If ANY previous record modified → all subsequent hashes break.
    Detects retroactive tampering.
    """
    record_hash = calculate_record_hash(record)
    chain_input = f"{previous_hash}:{record_hash}"
    return hashlib.sha256(chain_input.encode('utf-8')).hexdigest()
```

---

## 3. WRITE API

### 3.1 Insert Audit Record

```python
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AuditRecord(BaseModel):
    application_id: str
    customer_id: str        # Already pseudonymized by caller
    # ... all 28 fields ...

@router.post("/audit/log")
async def create_audit_record(record: AuditRecord):
    """
    Append audit record. NEVER update or delete.
    Returns decision_id for reference.
    """
    # Generate decision_id
    decision_id = generate_decision_id()  # "DEC-2026-04-000001"

    # Calculate hash
    record_dict = record.dict()
    record_dict['decision_id'] = decision_id
    record_hash = calculate_record_hash(record_dict)

    # Insert (append-only — DB enforces no UPDATE/DELETE)
    await db.execute(
        "INSERT INTO audit_log (...) VALUES (...)",
        {**record_dict, 'record_hash': record_hash}
    )

    return {"decision_id": decision_id, "record_hash": record_hash}
```

### 3.2 Write Failure = HALT

```python
# CRITICAL: If audit write fails → decision is INVALID
# Guardrail G-C1: 100% audit trail completeness, zero tolerance

try:
    audit_result = await create_audit_record(record)
except Exception as e:
    # DO NOT proceed with decision
    # Log error, alert IT
    raise AuditWriteError(
        "CRITICAL: Audit write failed. Decision NOT recorded. "
        "Application held until audit trail restored."
    )
```

---

## 4. READ API (SBV Inspection)

### 4.1 Single Decision Lookup

```sql
-- SBV asks: "Show me decision DEC-2026-04-000042"
SELECT * FROM audit_log WHERE decision_id = 'DEC-2026-04-000042';

-- Response time target: <1 second
-- Must return: all 28 fields + hash + created_at
```

### 4.2 Application History

```sql
-- SBV asks: "Show all decisions for application APP-2026-04-000042"
-- (may have multiple if re-reviewed, escalated, etc.)
SELECT * FROM audit_log
WHERE application_id = 'APP-2026-04-000042'
ORDER BY decision_timestamp;
```

### 4.3 CO Activity Report

```sql
-- Risk Manager asks: "Show all CO-003 decisions this month"
SELECT co_id,
       COUNT(*) as total_decisions,
       COUNT(*) FILTER (WHERE human_decision = 'APPROVE') as approvals,
       COUNT(*) FILTER (WHERE human_decision = 'REJECT') as rejections,
       COUNT(*) FILTER (WHERE override_flag = TRUE) as overrides,
       AVG(co_review_seconds) as avg_review_time
FROM audit_log
WHERE co_id = 'CO-003'
  AND decision_timestamp >= '2026-04-01'
GROUP BY co_id;
```

### 4.4 Override Analysis

```sql
-- DS team asks: "All overrides this month, with reasons"
SELECT decision_id, application_id, ai_recommendation, human_decision,
       override_reason_cat, override_reason_text, co_id
FROM audit_log
WHERE override_flag = TRUE
  AND decision_timestamp >= '2026-04-01'
ORDER BY decision_timestamp DESC;
```

### 4.5 Hash Integrity Check

```sql
-- Internal audit: verify no records tampered
-- Application recalculates hash for each record, compares with stored hash
SELECT decision_id, record_hash,
       -- Application calculates expected_hash from fields
       CASE WHEN record_hash = expected_hash THEN 'VALID' ELSE '⚠️ TAMPERED' END
FROM audit_log
WHERE decision_timestamp >= '2026-04-01';
```

---

## 5. PSEUDONYMIZATION

### 5.1 Customer ID Pseudonymization

```python
import hashlib

def pseudonymize_customer(cccd: str, salt: str) -> str:
    """
    CCCD → SHA256 hash with salt.
    Reversible ONLY by authorized system with salt.
    Used in audit_log.customer_id.
    """
    return hashlib.sha256(f"{salt}:{cccd}".encode()).hexdigest()

# Salt stored in HSM / Vault — not in code
# Only DPO + authorized personnel can reverse
```

### 5.2 CO ID Pseudonymization

```python
# CO ID in audit = "CO-001", "CO-002" etc.
# Mapping CO-001 → real name stored separately
# Audit log does NOT contain CO real names
# Mapping accessible by: Supervisor, Risk Manager, Internal Audit
```

---

## 6. RETENTION & LIFECYCLE

Aligned with decision-architecture.md terminal state retention:

| Terminal State | Audit Record Retention | PII Tier | Justification |
|---------------|----------------------|---------|--------------|
| APPROVED | Contract duration + 5 năm | Tầng 2 (pseudonymized) | SBV audit + dispute resolution |
| REJECTED | 5 năm | Tầng 2 (pseudonymized) after 1 năm Tầng 1 deletion | Complaint handling + regulatory |
| REJECTED_FRAUD | 10 năm | Tầng 2 (pseudonymized) | SIMO + law enforcement cooperation |
| EXPIRED | 1 năm | Tầng 3 (anonymized) after 30 ngày Tầng 1 deletion | Minimal retention |
| WITHDRAWN | 6 tháng | Tầng 3 (anonymized) after 30 ngày Tầng 1 deletion | Minimal retention |

---

## 7. MVP vs PRODUCTION

| Feature | MVP (Week 12) | Production (Week 37+) |
|---------|-------------|---------------------|
| Database | PostgreSQL single instance | PostgreSQL replicated + read replicas |
| Immutability | REVOKE UPDATE/DELETE | REVOKE + hash chain + WAL archiving |
| Hash | Individual record hash (SHA256) | Hash chain (each record links to previous) |
| Pseudonymization | Simple SHA256 + hardcoded salt | HSM-managed salt + rotation |
| Backup | Manual export | Automated daily, encrypted, offsite |
| Retention | Manual cleanup | Automated per terminal state lifecycle |
| Access control | Single app user | RBAC (insert/select/admin roles) |
| Monitoring | Manual query | Grafana dashboard + alerts |

---

## Tracking

- [ ] Audit log table created in PostgreSQL/Supabase?
- [ ] REVOKE UPDATE/DELETE applied?
- [ ] Record hash calculation working?
- [ ] Write API returns decision_id?
- [ ] Write failure → HALT decision (tested)?
- [ ] SBV inspection queries working (<1 second)?
- [ ] Pseudonymization of customer_id working?
- [ ] All 28 fields populated in demo scenarios?

---

## Ghi Chú

1. **28 fields, not 24** — expanded from sbv-requirements.md (24) to include batch_review_flag, batch_id, approved_limit, tenant_id. More fields = more traceability.
2. **record_hash is critical** — mỗi record tự verify integrity. Nếu bất kỳ field nào bị sửa → hash mismatch → tampering detected.
3. **Pseudonymization = reversible** (with salt). Khác anonymization (irreversible). Audit trail cần pseudonymized (not anonymous) vì SBV cần trace back to specific customer if inspected.
4. **Cross-reference:** sbv-requirements.md (SBV audit requirements), pdpd-impact-assessment.md (data lifecycle), decision-architecture.md (terminal states + retention), security-policy-alignment.md (access control).