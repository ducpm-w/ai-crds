# Decision Architecture & States — AI-CRDS
> **Tags:** `[Product]` `[Architecture]` `[Risk]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 5
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Thiết kế cấu trúc quyết định cho AI-CRDS: 5 decision states, entry/exit conditions, ownership, SLA, escalation, audit. Document này là blueprint cho UI design (Week 9) và workflow implementation (Week 12 MVP).

**Nguyên tắc bất biến:**
- AI là decision support — Credit Officer ký quyết định cuối cùng (Luật TCTD 2024, Luật AI 134/2025 Điều 4)
- AI KHÔNG ép quyết định khi data thiếu (State 5)
- Mọi quyết định phải traceable (TT 13/2018, audit trail ≥24 fields)
- Khách hàng có quyền opt-out AI scoring → 100% manual (NĐ 356/2025 Điều 9)
- Output phải ghi nhãn "hỗ trợ bởi AI" (Luật AI 134/2025)

---

## DECISION FLOW — TỔNG QUAN

```
                        Hồ sơ CC Application vào
                                │
                    ┌───────────┴───────────┐
                    │   PRE-SCREENING GATE  │
                    │   (data validation +  │
                    │    eKYC + fraud check) │
                    └───────────┬───────────┘
                                │
                    ┌───── eKYC FAIL? ─────┐
                    │         YES          NO
                    ▼                      │
              ┌──────────┐                 │
              │ STATE 5  │                 │
              │ NEED     │                 │
              │ MORE     │                 │
              │ INFO     │                 │
              └──────────┘                 │
                                           │
                    ┌──── FRAUD FLAG? ─────┤
                    │   ELEVATED/HIGH      │ CLEAR
                    ▼                      │
              ┌──────────┐                 │
              │ STATE 3  │                 │
              │ PRIORITY │                 │
              │ REVIEW   │                 │
              │ (Fraud)  │                 │
              └──────────┘                 │
                                           │
                    ┌──── AI CONFIDENCE? ──┤
                    │      LOW             │  MEDIUM/HIGH
                    ▼                      │
              ┌──────────┐                 │
              │ STATE 4  │                 │
              │ ESCALATE │      ┌──────────┴──────────┐
              └──────────┘      │                     │
                           Score > TH_high       TH_low < Score ≤ TH_high
                                │                     │
                                ▼                     ▼
                          ┌──────────┐          ┌──────────┐
                          │ STATE 1  │          │ STATE 2  │
                          │ AUTO-    │          │ STANDARD │
                          │ ROUTE    │          │ REVIEW   │
                          │ APPROVE  │          │          │
                          └──────────┘          └──────────┘
```

---

## STATE 1: AUTO-ROUTE TO APPROVE QUEUE

### Definition

AI confidence HIGH + risk score above high threshold + fraud flag CLEAR. Route to CO batch review queue for streamlined confirmation. **CO vẫn ký — không phải auto-approve.**

### Specification

| Attribute | Detail |
|-----------|--------|
| **State name** | `AUTO_ROUTE_APPROVE` |
| **UI label** | "AI Recommends: APPROVE — Batch Review" |
| **AI label (Luật AI)** | "Quyết định này được hỗ trợ bởi hệ thống trí tuệ nhân tạo" |

### Entry Conditions (ALL phải TRUE)

| # | Condition | Threshold | Source |
|---|----------|----------|--------|
| 1.1 | AI risk score | > `threshold_high` (ví dụ: > 0.75 trên thang 0-1 = low risk) | AI scoring model |
| 1.2 | AI confidence level | > 0.85 | Model confidence output |
| 1.3 | Fraud flag | CLEAR (fraud score < 0.2) | Fraud detection model |
| 1.4 | eKYC result | PASS | eKYC provider |
| 1.5 | CIC record | EXISTS (không phải thin file) | CIC API |
| 1.6 | Data completeness | ≥ 90% required fields populated | Data validation |
| 1.7 | No policy exception | Không trigger bất kỳ policy rule nào (ví dụ: limit > policy max) | Rules engine |
| 1.8 | Customer opt-out AI | FALSE (khách không yêu cầu manual) | Application flag |

### Exit Conditions

| Exit | Condition | Next State | Action |
|------|----------|-----------|--------|
| **Approved** | CO batch-confirm (ký chấp thuận) | → APPROVED (terminal) | Issue CC, log audit, send confirmation |
| **Override to Reject** | CO không đồng ý, override reject | → REJECTED (terminal) | Log override reason (bắt buộc), adverse action notice, supervisor notification |
| **Override to Review** | CO muốn review kỹ hơn | → STATE 2 (Standard Review) | Log reason, reassign |
| **SLA Expired** | Quá 4 giờ không action | → Escalate to Supervisor | Auto-escalation alert |

### Owner & SLA

| Role | Responsibility | SLA |
|------|---------------|-----|
| **Credit Officer (CO)** | Batch-review và confirm/override | **4 giờ** từ khi vào queue |
| **Supervisor** | Escalation nếu SLA miss | 2 giờ sau escalation |

### CO Workflow

```
CO mở Batch Review Queue
    │
    ├── Xem danh sách hồ sơ AI recommend APPROVE
    │   Mỗi hồ sơ show:
    │   ├── Applicant summary (tên, tuổi, thu nhập, employer)
    │   ├── AI Risk Score: 0.82 (LOW RISK)
    │   ├── AI Confidence: 0.91
    │   ├── Top 3 positive factors:
    │   │   ├── "CIC Score 720 — top 20%"
    │   │   ├── "DTI 25% — below threshold"
    │   │   └── "Employment 3+ years — stable"
    │   ├── CIC summary (score, existing debt, DPD)
    │   └── eKYC: PASS (confidence 0.96)
    │
    ├── CO action per hồ sơ:
    │   ├── [✓ Confirm] → Approve (3-5 phút/hồ sơ)
    │   ├── [✗ Override] → Reject (phải nhập lý do)
    │   └── [→ Review] → Route to Standard Review
    │
    └── Batch confirm: CO có thể select nhiều hồ sơ → confirm all
        (Giới hạn batch: max X hồ sơ/lần — Risk Committee quyết định X)
```

**Time saving:** 35 phút (full review) → 3-5 phút (batch confirm) = **~85% time reduction** per application.

### Audit Requirements

| Field | Required? | Example |
|-------|----------|---------|
| All 24 audit fields (sbv-requirements.md) | ✅ Yes | — |
| `state` | ✅ | `"AUTO_ROUTE_APPROVE"` |
| `batch_review_flag` | ✅ | `true` |
| `batch_id` | ✅ (nếu batch confirm) | `"BATCH-2026-04-001"` |
| `co_review_time_seconds` | ✅ | `180` (3 phút) |
| `ai_label_displayed` | ✅ | `true` (Luật AI 134/2025) |

---

## STATE 2: STANDARD REVIEW

### Definition

AI confidence MEDIUM hoặc risk score trong review band. Fraud flag CLEAR. Route to CO individual review queue cho full assessment.

### Specification

| Attribute | Detail |
|-----------|--------|
| **State name** | `STANDARD_REVIEW` |
| **UI label** | "AI Recommends: REVIEW NEEDED" |

### Entry Conditions (ANY triggers)

| # | Condition | Threshold | Source |
|---|----------|----------|--------|
| 2.1 | AI risk score trong review band | `threshold_low` < score ≤ `threshold_high` | AI scoring model |
| 2.2 | AI confidence level medium | 0.6 ≤ confidence ≤ 0.85 | Model confidence |
| 2.3 | Fraud flag CLEAR nhưng score borderline | fraud score 0.2-0.4 | Fraud model |
| 2.4 | Override từ State 1 | CO chuyển từ batch review sang full review | CO action |
| 2.5 | Thin file nhưng có CBS behavioral data | has_cic = false BUT existing_customer = true | Data check |
| 2.6 | Customer opt-out AI | TRUE (khách yêu cầu manual review) | Application flag |

### Exit Conditions

| Exit | Condition | Next State | Action |
|------|----------|-----------|--------|
| **Approved** | CO approve sau full review (ký) | → APPROVED (terminal) | Issue CC, log audit |
| **Rejected** | CO reject (ký) | → REJECTED (terminal) | Adverse action notice (top 3 reasons), log audit |
| **Escalate** | CO không confident, cần senior opinion | → STATE 4 (Escalate) | Log reason, reassign to Senior CO |
| **Need More Info** | CO cần thêm documents | → STATE 5 | Request docs from customer |
| **SLA Expired** | Quá 8 giờ | → Escalate to Supervisor | Auto-escalation |

### Owner & SLA

| Role | Responsibility | SLA |
|------|---------------|-----|
| **Credit Officer (CO)** | Full individual review | **8 giờ** (1 business day) |
| **Supervisor** | Escalation nếu SLA miss | 4 giờ sau escalation |

### CO Workflow

```
CO mở Individual Review Queue
    │
    ├── Xem hồ sơ chi tiết:
    │   ├── Applicant full profile
    │   ├── AI Risk Score: 0.52 (MEDIUM RISK)
    │   ├── AI Confidence: 0.72
    │   ├── AI Recommendation: "REVIEW NEEDED"
    │   ├── Top 3 risk factors:
    │   │   ├── "DTI 42% — approaching threshold"
    │   │   ├── "Employment 8 months — relatively new"
    │   │   └── "2 CIC inquiries in last 3 months"
    │   ├── Top 3 positive factors:
    │   │   ├── "CIC Score 650 — adequate"
    │   │   ├── "No DPD history"
    │   │   └── "Existing customer 2 years"
    │   ├── CIC full report
    │   ├── Bank transaction summary (nếu existing)
    │   ├── eKYC details
    │   └── Similar cases reference (historical)
    │
    ├── CO assessment:
    │   ├── Review CIC report in detail
    │   ├── Verify income (payroll if available)
    │   ├── Check employer legitimacy
    │   ├── Assess overall risk
    │   └── Make decision
    │
    └── CO action:
        ├── [✓ Approve] → ký, set limit
        ├── [✗ Reject] → ký, chọn rejection reasons, trigger adverse action
        ├── [↑ Escalate] → chọn lý do, route to Senior CO
        └── [? Need More Info] → chọn documents cần, notify customer
```

**Review time:** 20-35 phút per application (vs 3-5 phút cho State 1).

### Audit Requirements

| Field | Required? | Example |
|-------|----------|---------|
| All 24 audit fields | ✅ Yes | — |
| `state` | ✅ | `"STANDARD_REVIEW"` |
| `co_assessment_notes` | ✅ (free text) | `"DTI borderline nhưng income verified qua payroll"` |
| `rejection_reasons` (nếu reject) | ✅ | `["DTI > 45%", "Employment < 12 months"]` |
| `adverse_action_notice_id` (nếu reject) | ✅ | `"AAN-2026-04-001"` |
| `co_review_time_seconds` | ✅ | `1500` (25 phút) |

---

## STATE 3: PRIORITY REVIEW (Fraud Signal)

### Definition

Fraud flag ELEVATED hoặc HIGH — regardless of credit score. Route to Senior CO / Fraud team cho enhanced due diligence. Xử lý ưu tiên cao.

### Specification

| Attribute | Detail |
|-----------|--------|
| **State name** | `PRIORITY_REVIEW_FRAUD` |
| **UI label** | "⚠️ FRAUD SIGNAL — Priority Review Required" |
| **Visual indicator** | Red highlight, top of queue |

### Entry Conditions (ANY triggers)

| # | Condition | Threshold | Source |
|---|----------|----------|--------|
| 3.1 | Fraud score ELEVATED | 0.4 ≤ fraud_score < 0.7 | Fraud model |
| 3.2 | Fraud score HIGH | fraud_score ≥ 0.7 | Fraud model |
| 3.3 | eKYC face match LOW | face_match < 0.7 | eKYC provider |
| 3.4 | Document authenticity SUSPICIOUS | doc_authentic = false | eKYC provider |
| 3.5 | Application velocity flag | Same device/IP > 2 apps in 24h | Velocity check |
| 3.6 | Name/DOB mismatch | CBS ≠ eKYC ≠ CIC | Cross-check |
| 3.7 | Blacklist match | CCCD/phone on internal blacklist hoặc SIMO | Blacklist check |
| 3.8 | CIC anomaly | CIC record inconsistent (ví dụ: age 22 nhưng credit history 10 years) | Anomaly detection |

### Exit Conditions

| Exit | Condition | Next State | Action |
|------|----------|-----------|--------|
| **Cleared — Route to Scoring** | Fraud team confirms NOT fraud | → STATE 1 or 2 (based on score) | Log clearance, proceed with scoring |
| **Confirmed Fraud — Reject** | Fraud team confirms fraud | → REJECTED_FRAUD (terminal) | Block applicant, report SIMO (TT 45/2025), blacklist CCCD, law enforcement (nếu cần) |
| **Inconclusive — Reject** | Cannot determine, too risky | → REJECTED (terminal) | Adverse action notice (generic: "unable to verify identity"), blacklist for review period |
| **Need More Verification** | Cần thêm identity documents | → STATE 5 | Request: original CCCD at branch, video call verification |
| **SLA Expired** | Quá 4 giờ | → Escalate to Head of Fraud | Auto-escalation, priority alert |

### Owner & SLA

| Role | Responsibility | SLA |
|------|---------------|-----|
| **Senior CO / Fraud Analyst** | Enhanced due diligence review | **4 giờ** (priority) |
| **Head of Fraud / Risk Manager** | Escalation + final decision on ambiguous cases | 2 giờ sau escalation |

### Enhanced Due Diligence Checklist

```
Fraud Analyst receives PRIORITY REVIEW case
    │
    ├── Step 1: Review fraud signals
    │   ├── Which trigger fired? (3.1-3.8)
    │   ├── Fraud score breakdown
    │   └── Historical fraud patterns match?
    │
    ├── Step 2: Identity verification deep-dive
    │   ├── eKYC face match — review images manually
    │   ├── CCCD verification — BCA database cross-check
    │   ├── Phone verification — call applicant
    │   └── Employer verification — call employer HR
    │
    ├── Step 3: Cross-reference
    │   ├── Internal blacklist check
    │   ├── SIMO check (TT 45/2025)
    │   ├── CIC data consistency
    │   └── Application pattern analysis
    │
    └── Step 4: Decision
        ├── [✓ Clear] → Route to scoring (State 1/2)
        ├── [✗ Fraud confirmed] → Reject + SIMO report + blacklist
        ├── [? Inconclusive] → Reject (conservative)
        └── [📄 Need verification] → Request branch visit (State 5)
```

### Audit Requirements

| Field | Required? | Example |
|-------|----------|---------|
| All 24 audit fields | ✅ | — |
| `state` | ✅ | `"PRIORITY_REVIEW_FRAUD"` |
| `fraud_triggers` | ✅ | `["face_match_low", "velocity_flag"]` |
| `fraud_score` | ✅ | `0.65` |
| `edd_checklist_completed` | ✅ | `true` |
| `fraud_analyst_id` | ✅ | `"FA-001"` |
| `fraud_decision` | ✅ | `"cleared"` / `"confirmed_fraud"` / `"inconclusive"` |
| `simo_report_filed` (nếu fraud) | ✅ | `true` + report ID |
| `blacklist_action` (nếu fraud) | ✅ | `"cccd_blacklisted"` |

---

## STATE 4: ESCALATE

### Definition

AI confidence LOW — không đủ data/model uncertainty cao. Edge case hoặc anomaly detected. Policy exception potential. Route to Senior Credit Officer cho full manual underwriting.

### Specification

| Attribute | Detail |
|-----------|--------|
| **State name** | `ESCALATE` |
| **UI label** | "AI: CANNOT DETERMINE — Senior Review Required" |

### Entry Conditions (ANY triggers)

| # | Condition | Threshold | Source |
|---|----------|----------|--------|
| 4.1 | AI confidence LOW | confidence < 0.6 | Model confidence |
| 4.2 | Model uncertainty high | prediction variance > threshold | Model ensemble disagreement |
| 4.3 | Edge case / anomaly | Statistical outlier on ≥2 features | Anomaly detection |
| 4.4 | Policy exception potential | Limit request > standard policy BUT applicant profile strong | Rules engine |
| 4.5 | Score exactly at threshold | score = threshold_high ± 0.02 (dead zone) | Scoring model |
| 4.6 | Conflicting signals | High income + bad CIC, OR low income + excellent CIC | Feature contradiction |
| 4.7 | CO escalation from State 2 | CO không confident đủ | CO action |

### Exit Conditions

| Exit | Condition | Next State | Action |
|------|----------|-----------|--------|
| **Approved** | Senior CO approve (ký) | → APPROVED (terminal) | Issue CC, log audit, note exception nếu có |
| **Approved with conditions** | Approve với limit thấp hơn hoặc conditions | → APPROVED (terminal) | Log conditions (ví dụ: limit 30M thay vì 50M) |
| **Rejected** | Senior CO reject (ký) | → REJECTED (terminal) | Adverse action notice, log audit |
| **Committee Review** | Cần committee decision (limit > authority) | → COMMITTEE (sub-state) | Schedule committee meeting |
| **Need More Info** | Cần thêm documents | → STATE 5 | Request docs |
| **SLA Expired** | Quá 24 giờ | → Escalate to Committee | Auto-escalation |

### Owner & SLA

| Role | Responsibility | SLA |
|------|---------------|-----|
| **Senior Credit Officer** | Full manual underwriting + decision | **24 giờ** (1 business day) |
| **Credit Committee** | Cases beyond Senior CO authority | 48 giờ (2 business days) |

### Audit Requirements

| Field | Required? | Example |
|-------|----------|---------|
| All 24 audit fields | ✅ | — |
| `state` | ✅ | `"ESCALATE"` |
| `escalation_trigger` | ✅ | `"low_confidence"` / `"anomaly"` / `"policy_exception"` |
| `escalation_from` | ✅ | `"STATE_2"` hoặc `"AI_DIRECT"` |
| `senior_co_id` | ✅ | `"SCO-001"` |
| `senior_co_notes` | ✅ | `"Applicant is edge case: high income contractor, new CIC..."` |
| `conditions_applied` (nếu có) | ✅ | `"limit_reduced_to_30M"` |
| `committee_required` | ✅ | `true` / `false` |

---

## STATE 5: NEED-MORE-INFO

### Definition

Data missing, inconsistent, hoặc verification failed. AI KHÔNG ép quyết định khi data thiếu. Hồ sơ pause, request thêm documents từ customer. Clock stops cho SLA.

### Specification

| Attribute | Detail |
|-----------|--------|
| **State name** | `NEED_MORE_INFO` |
| **UI label** | "Pending — Additional Information Required" |

### Entry Conditions (ANY triggers)

| # | Condition | Threshold | Source |
|---|----------|----------|--------|
| 5.1 | eKYC fail | ekyc_result = "fail" (liveness fail, doc unreadable) | eKYC provider |
| 5.2 | CIC unavailable | CIC API timeout sau 3 retries | CIC API |
| 5.3 | Required data missing | Income = 0, employer = blank, hoặc >2 required fields null | Data validation |
| 5.4 | Data inconsistency | Name mismatch CBS ↔ eKYC nhưng NOT fraud level (typo, nickname) | Cross-check |
| 5.5 | Income unverifiable | Declared income > 100M nhưng employer unknown, no payroll | Validation rules |
| 5.6 | CO request from State 2/4 | CO cần thêm documents (bank statement, tax return, employer letter) | CO action |
| 5.7 | Fraud team request from State 3 | Need branch visit for identity verification | Fraud analyst action |

### Exit Conditions

| Exit | Condition | Next State | Action |
|------|----------|-----------|--------|
| **Info received — Resume** | Customer provides requested documents | → Re-enter pipeline (State 1/2/3/4 based on new data) | Re-run AI scoring with new data, restart SLA |
| **Customer no response** | Quá 14 ngày không nhận documents | → EXPIRED (terminal) | Close application, notify customer, log audit |
| **Customer withdraws** | Customer chủ động rút hồ sơ | → WITHDRAWN (terminal) | Log audit |
| **eKYC retry success** | Customer retry eKYC thành công | → Re-enter pipeline | Re-run scoring |

### Owner & SLA

| Role | Responsibility | SLA |
|------|---------------|-----|
| **System (automated)** | Send document request to customer | Immediate |
| **Customer** | Provide requested documents | **14 calendar days** |
| **CO / Back-office** | Review received documents, trigger re-scoring | 4 giờ after receipt |
| **System** | Auto-expire after 14 days | Automated |

### Audit Requirements

| Field | Required? | Example |
|-------|----------|---------|
| All 24 audit fields | ✅ | — |
| `state` | ✅ | `"NEED_MORE_INFO"` |
| `info_requested` | ✅ | `["bank_statement_3m", "employer_letter"]` |
| `request_sent_timestamp` | ✅ | `"2026-04-09T10:00:00+07:00"` |
| `info_received_timestamp` | ✅ (khi nhận) | `"2026-04-12T14:30:00+07:00"` |
| `days_pending` | ✅ | `3` |
| `expiry_date` | ✅ | `"2026-04-23"` (14 days) |
| `exit_reason` | ✅ | `"info_received"` / `"expired"` / `"withdrawn"` |

---

## TERMINAL STATES

| State | Mô tả | Post-action |
|-------|-------|------------|
| **APPROVED** | CC issued | Issue card, set limit, start monitoring, send confirmation + AI label |
| **REJECTED** | Application denied | Adverse action notice (top 3 reasons, Luật AI 134/2025 explainability), retain audit record (5-10 năm per SBV), inform right to complaint |
| **REJECTED_FRAUD** | Fraud confirmed | Reject + SIMO report (TT 45/2025) + blacklist + law enforcement referral (nếu applicable) |
| **EXPIRED** | Customer didn't respond in 14 days | Close, notify, archive |
| **WITHDRAWN** | Customer withdrew | Close, archive, delete PII per BVDLCN schedule |

---

## THRESHOLD FRAMEWORK

### Threshold Parameters

| Parameter | Symbol | Initial Value (ước tính) | Who approves | Review cadence |
|----------|--------|------------------------|-------------|---------------|
| High threshold (auto-route approve) | `TH_high` | 0.75 | Risk Committee | Quarterly hoặc khi model update |
| Low threshold (auto-route reject consideration) | `TH_low` | 0.35 | Risk Committee | Quarterly |
| Fraud elevated threshold | `TH_fraud_elevated` | 0.4 | Risk Committee | Quarterly |
| Fraud high threshold | `TH_fraud_high` | 0.7 | Risk Committee | Quarterly |
| Confidence threshold (escalate) | `TH_confidence` | 0.6 | Risk Committee | Quarterly |
| Dead zone (borderline, → escalate) | `TH_dead_zone` | ±0.02 around TH_high | Risk Committee | Quarterly |

**⚠️ PM KHÔNG được tự quyết threshold.** Risk Committee approve tất cả thresholds. Xem Week 6 (Threshold Design) cho sensitivity analysis.

### Expected Volume Distribution (ước tính)

| State | % Applications | Volume/tháng (3,000 apps) | CO Time/app | Total CO Time/tháng |
|-------|---------------|--------------------------|------------|-------------------|
| State 1 (Auto-route approve) | 35-45% | ~1,200 | 3-5 min | 80 giờ |
| State 2 (Standard review) | 25-35% | ~900 | 25 min | 375 giờ |
| State 3 (Priority fraud) | 2-5% | ~100 | 45 min | 75 giờ |
| State 4 (Escalate) | 5-10% | ~225 | 45 min | 169 giờ |
| State 5 (Need more info) | 8-15% | ~375 | 10 min (process docs) | 63 giờ |
| **Total** | **100%** | **3,000** | | **762 giờ** (~4.3 FTE) |

**So với hiện tại (100% manual):** 3,000 × 35 min = 1,750 giờ (~10 FTE). **AI saves ~56% CO capacity** (10 FTE → 4.3 FTE).

---

## OVERRIDE GOVERNANCE

### Override Types

| Type | Mô tả | Approval required | Monitoring |
|------|-------|-------------------|-----------|
| **CO override approve** (AI said REVIEW/REJECT → CO approve) | CO believe applicant is good despite AI flag | Standard CO authority cho limit ≤ policy max. Supervisor approval cho limit > authority. | Override rate monitored monthly. >60% → model recalibrate. |
| **CO override reject** (AI said APPROVE → CO reject) | CO believe applicant is risky despite AI approve | CO authority. No additional approval. | Monitor để detect CO bias or training gaps. |
| **Threshold exception** | Approve applicant below TH_low with justification | Senior CO + Supervisor dual sign-off | Case-by-case. Logged separately. |

### Override Logging (Bắt buộc)

```
override_record = {
    "override_id":       "OVR-2026-04-001",
    "application_id":    "APP-2026-000123",
    "ai_recommendation": "REJECT",
    "co_decision":       "APPROVE",
    "override_type":     "co_override_approve",
    "reason_category":   "relationship_knowledge",    // dropdown
    "reason_detail":     "Khách VIP 5 năm, income verify qua payroll, DTI borderline but stable",  // free text, bắt buộc
    "co_id":             "CO-001",
    "supervisor_id":     null,    // null nếu không cần supervisor
    "timestamp":         "2026-04-09T14:30:00+07:00"
}
```

### Override Reason Categories (Dropdown)

| Category | Mô tả |
|---------|-------|
| `relationship_knowledge` | CO biết khách lâu năm, có thông tin AI không có |
| `income_verification` | CO verify income bằng cách khác (bank statement, tax return) |
| `employer_verification` | CO verify employer trực tiếp |
| `temporary_situation` | Khách có DPD nhưng do tình huống tạm thời (bệnh, mất việc tạm) |
| `policy_exception` | Case ngoài policy nhưng có justification |
| `ai_error_suspected` | CO nghi model output sai (data input error, model bug) |
| `other` | Khác — phải ghi detail |

---

## SLA SUMMARY

| State | SLA | Escalation if miss | Priority level |
|-------|-----|-------------------|---------------|
| State 1 (Auto-route) | 4 giờ | → Supervisor | Normal |
| State 2 (Standard) | 8 giờ (1 BD) | → Supervisor | Normal |
| State 3 (Fraud) | 4 giờ | → Head of Fraud | **High** |
| State 4 (Escalate) | 24 giờ (1 BD) | → Committee | Normal |
| State 5 (Need info) | 14 calendar days (customer) + 4 giờ (CO process) | → Auto-expire (customer) / Supervisor (CO) | Low |

**SLA tracking:** Dashboard show real-time: # applications per state, avg time in state, SLA breach rate. Alert khi SLA breach > 10% trong 1 tuần.

---

## Tracking — Tự hỏi cuối tuần

- [ ] 5 states đã được review với Credit Officers chưa? (As-is flow match?)
- [ ] Threshold values (TH_high, TH_low) đã discuss với Risk Manager chưa?
- [ ] SLA values realistic với CO capacity hiện tại không?
- [ ] Override governance đã review với Compliance chưa?
- [ ] Batch review limit (max X hồ sơ/batch) đã discuss với Risk Committee chưa?
- [ ] Volume distribution (35-45% State 1) có hợp lý không? Cần shadow testing confirm.

---

## Ghi Chú & Limitations

1. **Threshold values (0.75, 0.35, etc.) là placeholders.** Cần tuning dựa trên shadow testing data. Xem Week 6 (Threshold Design).
2. **Volume distribution (35-45% auto-route) là ước tính.** Actual distribution phụ thuộc model quality + threshold setting. Conservative threshold → ít State 1, nhiều State 2.
3. **SLA chưa validated với bank ops team.** 4 giờ cho State 1 có thể quá tight nếu CO overloaded. 8 giờ cho State 2 có thể quá loose nếu customer expects same-day.
4. **Dead zone (±0.02) cần tuning.** Quá nhỏ → ít escalation, miss edge cases. Quá lớn → quá nhiều escalation, CO overload.
5. **State 3 (Fraud) SLA 4 giờ** — aggressive. Fraud cases cần fast resolution nhưng thorough review. Cần confirm với Fraud team capacity.
6. **Cross-reference:** sbv-requirements.md (human-in-the-loop, audit trail), damage-model.md (cost-of-error table for threshold design), feature-availability-matrix.md (feature priority stack for AI model design).