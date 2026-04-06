# Decision State Spec — AI-CRDS
> **Tags:** `[Product]` `[Architecture]` `[Workflow]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 5
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Chi tiết hóa decision-architecture.md: as-is flow, to-be flow, state transition diagram, SLA table, exception handling. Document này là spec cho development team (Week 12 MVP) và CO training (Week 34).

---

## 1. AS-IS FLOW — Quy trình hiện tại tại Bank X (Generic NHTM VN)

**⚠️ Chưa validate với Bank X.** Flow dưới đây là generic cho NHTM VN có CC origination. Cần shadow Credit Officers ít nhất 1 ngày trước khi finalize (Week 8).

```
┌─────────────────────────────────────────────────────────────────┐
│                    AS-IS: CC ORIGINATION FLOW                   │
│                    (100% Manual / Semi-manual)                   │
└─────────────────────────────────────────────────────────────────┘

Khách nộp hồ sơ (branch / online / app)
        │
        ▼
┌───────────────────┐
│ 1. TIẾP NHẬN      │  Back-office / Sales nhập data vào CBS
│    (5-15 phút)    │  Scan/upload documents
│                   │  Assign to CO queue
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 2. eKYC CHECK     │  Đối chiếu CCCD, sinh trắc học (TT 45)
│    (2-5 phút)     │  ⚠️ Nhiều bank vẫn manual verify
│                   │  → Fail: request retry hoặc branch visit
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 3. CIC QUERY      │  CO hoặc system query CIC
│    (5-30 phút)    │  ⚠️ API: 5-30 giây
│                   │  ⚠️ Manual portal: 1-5 phút
│                   │  ⚠️ Một số bank batch query cuối ngày
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 4. CO REVIEW      │  Credit Officer xem xét toàn bộ:
│    (20-45 phút)   │  - Application form
│                   │  - CIC report
│                   │  - Income documents
│                   │  - Employer verification (gọi điện?)
│                   │  - Internal policy check
│                   │  - Kinh nghiệm cá nhân / "gut feeling"
└───────┬───────────┘
        │
        ├─── Trong thẩm quyền CO ───┐
        │                            │
        ▼                            ▼
┌──────────────┐             ┌──────────────┐
│ 5a. APPROVE  │             │ 5b. REJECT   │
│ CO ký        │             │ CO ký        │
│ Set limit    │             │ Lý do chung  │
│              │             │ chung        │
└──────┬───────┘             └──────┬───────┘
       │                            │
       ▼                            ▼
  Issue CC                  Thông báo khách
  Notify khách              (thường chung chung:
                            "không đủ điều kiện")
        │
        ├─── Vượt thẩm quyền CO ───┐
        │                           │
        ▼                           │
┌──────────────┐                    │
│ 5c. ESCALATE │                    │
│ → Supervisor │                    │
│ → Committee  │                    │
│ (1-3 ngày)   │                    │
└──────────────┘                    │
                                    │
┌───────────────────┐               │
│ 6. AUDIT LOG      │◄──────────────┘
│ Manual entry      │
│ CBS ghi nhận      │
│ ⚠️ Thiếu detail  │
│ ⚠️ Không replay  │
└───────────────────┘
```

### As-Is Pain Points

| # | Pain point | Impact | Evidence |
|---|-----------|--------|---------|
| P1 | **Inconsistency** — mỗi CO có criteria khác nhau | Good applicants bị reject bởi CO strict, bad applicants được approve bởi CO lenient | ❓ Cần validate (CO interviews Week 9) |
| P2 | **Slow** — 20-45 phút/hồ sơ manual review | Customer wait time 1-3 ngày. Churn nếu competitor nhanh hơn. | Industry observation |
| P3 | **CIC bottleneck** — manual query hoặc batch delay | Decision delay. Stale data nếu batch cuối ngày. | ❓ Cần confirm CIC integration method |
| P4 | **No explainability** — rejection reason vague | Customer không hiểu tại sao bị reject. Không comply NĐ 356 right to explanation. | Industry standard VN |
| P5 | **Audit trail weak** — manual log, thiếu fields | Không replay được quyết định. SBV audit risk. | ❓ Cần confirm Bank X audit format |
| P6 | **No fraud scoring** — eKYC pass/fail only | Sophisticated fraud (synthetic ID, document forge) lọt qua | Industry observation |
| P7 | **Capacity limited** — CO team = bottleneck | Peak periods (Tết, campaign): queue backlog. Hire more CO = cost. | Damage model T4 |

---

## 2. TO-BE FLOW — Quy trình với AI-CRDS

```
┌─────────────────────────────────────────────────────────────────┐
│                    TO-BE: CC ORIGINATION WITH AI-CRDS            │
│                    (AI-assisted, Human-in-the-loop)              │
└─────────────────────────────────────────────────────────────────┘

Khách nộp hồ sơ (online / app / branch)
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ STAGE 1: DATA COLLECTION & VALIDATION (Automated)   │
│ Time: 1-5 giây                                       │
│                                                      │
│ ├── Application data ingestion (from form/app)       │
│ ├── Data validation (required fields, format check)  │
│ ├── Duplicate check (same CCCD last 30 days?)        │
│ └── Customer opt-out AI check                        │
│     → Nếu opt-out: route 100% manual (as-is flow)   │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ STAGE 2: IDENTITY & FRAUD GATE (Parallel, 5-30 giây)│
│                                                      │
│ ├── eKYC verification (CCCD + biometric + liveness)  │
│ ├── CIC API query (automated, real-time)             │
│ ├── Blacklist check (internal + SIMO)                │
│ ├── Device fingerprint (online channel)              │
│ └── Application velocity check                       │
│                                                      │
│ OUTPUT:                                              │
│ ├── ekyc_result: pass/fail + confidence              │
│ ├── cic_data: score, debt, DPD, inquiries            │
│ ├── fraud_score: 0.0-1.0                             │
│ └── data_completeness: % required fields             │
└───────────────────────┬─────────────────────────────┘
                        │
          ┌─────────────┼──────────────┐
          │             │              │
     eKYC FAIL    DATA MISSING    ALL PASS
     OR CIC DOWN  OR INCOMPLETE       │
          │             │              │
          ▼             ▼              ▼
     ┌────────┐  ┌────────────┐       │
     │STATE 5 │  │  STATE 5   │       │
     │NEED    │  │  NEED      │       │
     │MORE    │  │  MORE      │       │
     │INFO    │  │  INFO      │       │
     └────────┘  └────────────┘       │
                                      │
                        ┌─────────────┤
                   FRAUD FLAG?        │
                   ELEVATED/HIGH      │ CLEAR
                        │             │
                        ▼             │
                   ┌────────┐         │
                   │STATE 3 │         │
                   │PRIORITY│         │
                   │REVIEW  │         │
                   └────────┘         │
                                      │
                                      ▼
┌─────────────────────────────────────────────────────┐
│ STAGE 3: AI SCORING (2-5 giây)                       │
│                                                      │
│ ├── Feature engineering (from CBS + CIC + eKYC)      │
│ ├── Credit scoring model inference                   │
│ ├── Confidence calculation                           │
│ ├── Explanation generation (top factors)              │
│ └── AI label: "hỗ trợ bởi hệ thống AI"              │
│                                                      │
│ OUTPUT:                                              │
│ ├── risk_score: 0.0-1.0                              │
│ ├── confidence: 0.0-1.0                              │
│ ├── recommendation: APPROVE/REVIEW/REJECT/ESCALATE   │
│ ├── explanation: [top 3-5 factors]                   │
│ └── segment: existing_customer / new_to_bank         │
└───────────────────────┬─────────────────────────────┘
                        │
          ┌─────────────┼──────────────┐──────────┐
          │             │              │          │
    Confidence LOW  Score review   Score HIGH  Score LOW
    OR anomaly      band           + conf HIGH + conf MED+
          │             │              │          │
          ▼             ▼              ▼          │
     ┌────────┐  ┌────────────┐  ┌────────┐     │
     │STATE 4 │  │  STATE 2   │  │STATE 1 │     │
     │ESCALATE│  │  STANDARD  │  │AUTO-   │     │
     │        │  │  REVIEW    │  │ROUTE   │     │
     └────────┘  └────────────┘  │APPROVE │     │
                                 └────────┘     │
                                                │
                        Score LOW + confidence MED+ + fraud CLEAR
                        (AI recommends reject nhưng cần CO confirm)
                                                │
                                                ▼
                                         ┌────────────┐
                                         │  STATE 2   │
                                         │  STANDARD  │
                                         │  REVIEW    │
                                         │  (reject   │
                                         │  recommend)│
                                         └────────────┘
                                                │
┌───────────────────────────────────────────────┤
│ STAGE 4: HUMAN DECISION (time varies by state)│
│                                               │
│ State 1: CO batch-confirm (3-5 min/app)       │
│ State 2: CO full review (20-35 min/app)       │
│ State 3: Senior CO/Fraud EDD (30-60 min)      │
│ State 4: Senior CO/Committee (30-60 min)      │
│                                               │
│ ALL states: CO ký quyết định cuối cùng        │
│ Override option LUÔN available                 │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ STAGE 5: POST-DECISION (Automated)                   │
│                                                      │
│ IF APPROVED:                                         │
│ ├── Issue CC instruction to Card Operations          │
│ ├── Confirmation to customer (with AI label)         │
│ ├── Audit trail entry (24 fields, immutable)         │
│ └── Start monitoring (behavioral, fraud)             │
│                                                      │
│ IF REJECTED:                                         │
│ ├── Adverse action notice (top 3 reasons)            │
│ │   "Quyết định được hỗ trợ bởi AI. Quý khách      │
│ │    có quyền yêu cầu xem xét lại bởi nhân viên."  │
│ ├── Audit trail entry (24 fields)                    │
│ ├── Customer complaint channel info                  │
│ └── PII retention timer starts                       │
│                                                      │
│ IF REJECTED_FRAUD:                                   │
│ ├── All REJECTED actions above +                     │
│ ├── SIMO report (TT 45/2025)                        │
│ ├── Internal blacklist update                        │
│ └── Law enforcement referral (nếu applicable)        │
└─────────────────────────────────────────────────────┘
```

### Improvement Summary: As-Is → To-Be

| Metric | As-Is | To-Be | Improvement |
|--------|-------|-------|------------|
| **Time-to-decision (State 1)** | 20-45 min (full review) | 3-5 min (batch confirm) | **~85% faster** |
| **Time-to-decision (overall avg)** | 25-35 min | 10-15 min (weighted avg) | **~55% faster** |
| **Consistency** | CO-dependent | AI + human = standardized baseline | **Eliminates CO variance** |
| **CIC query** | Manual/batch | Real-time API | **From hours to seconds** |
| **Fraud detection** | eKYC pass/fail only | Multi-signal AI scoring | **+30% detection** (assumption A22) |
| **Explainability** | "Không đủ điều kiện" | Top 3 factors + right to human review | **Comply NĐ 356 + Luật AI** |
| **Audit trail** | Manual, ~5 fields | Automated, 24 fields, immutable | **SBV inspection ready** |
| **CO capacity** | ~10 FTE for 3,000 apps | ~4.3 FTE | **56% reduction** |

---

## 3. STATE TRANSITION DIAGRAM

### 3.1 Complete State Machine

```
                              ┌──────────────┐
                              │  APPLICATION │
                              │   RECEIVED   │
                              └──────┬───────┘
                                     │
                              ┌──────┴───────┐
                              │ PRE-SCREENING│
                              └──────┬───────┘
                                     │
                    ┌────────────────┼──────────────────┐
                    │                │                  │
              eKYC fail         fraud flag         all clear
              CIC down          ELEVATED+               │
              data missing           │                  │
                    │                │           ┌──────┴───────┐
                    ▼                ▼           │  AI SCORING  │
              ┌──────────┐   ┌──────────┐       └──────┬───────┘
              │ STATE 5  │   │ STATE 3  │              │
              │ NEED     │   │ PRIORITY │    ┌─────────┼──────────┐─────────┐
              │ MORE     │   │ REVIEW   │    │         │          │         │
              │ INFO     │   │ (Fraud)  │  conf LOW  review    high     low score
              └────┬─────┘   └────┬─────┘  anomaly   band     score    + conf MED
                   │              │         │         │       conf HIGH    │
                   │              │         ▼         ▼         │         │
                   │              │   ┌──────────┐ ┌──────────┐ │         │
                   │              │   │ STATE 4  │ │ STATE 2  │ │         │
                   │              │   │ ESCALATE │ │ STANDARD │◄┘         │
                   │              │   └────┬─────┘ │ REVIEW   │◄──────────┘
                   │              │        │       └────┬─────┘
                   │              │        │            │
                   │    ┌─────────┤   ┌────┤       ┌───┤
                   │    │         │   │    │       │   │
                   │    ▼         ▼   ▼    ▼       ▼   ▼
                   │  clear    fraud  app  rej    app  rej
                   │    │      confm  +esc        │    │
                   │    │        │    │            │    │
                   │    ▼        ▼    ▼            ▼    ▼
                   │ ┌────┐  ┌─────┐ │         ┌────┐  │
                   │ │ S1 │  │REJCT│ │         │APPR│  │
                   │ │ or │  │FRAUD│ │         │OVED│  │
                   │ │ S2 │  └─────┘ │         └────┘  │
                   │ └────┘          │                  │
                   │                 ▼                  ▼
                   │           ┌──────────┐      ┌──────────┐
                   │           │ APPROVED │      │ REJECTED │
                   │           │ (w/cond) │      │          │
                   │           └──────────┘      └──────────┘
                   │
              ┌────┴───────────────────────┐
              │                            │
         info received              no response 14d
         eKYC retry OK              customer withdraw
              │                            │
              ▼                            ▼
        Re-enter pipeline           ┌──────────┐
        (Stage 2 → scoring)        │ EXPIRED / │
                                   │ WITHDRAWN │
                                   └──────────┘
```

### 3.2 Valid State Transitions

| From | To | Trigger | Who |
|------|-----|---------|-----|
| PRE-SCREENING | STATE 5 | eKYC fail / CIC down / data missing | System |
| PRE-SCREENING | STATE 3 | Fraud flag elevated/high | System |
| AI SCORING | STATE 1 | Score > TH_high + confidence > 0.85 + fraud clear | System |
| AI SCORING | STATE 2 | Score in review band OR medium confidence OR low score | System |
| AI SCORING | STATE 4 | Confidence < 0.6 OR anomaly OR policy exception | System |
| STATE 1 | APPROVED | CO batch-confirm | CO |
| STATE 1 | REJECTED | CO override reject | CO |
| STATE 1 | STATE 2 | CO wants full review | CO |
| STATE 1 | ESCALATED (Supervisor) | SLA expired (4h) | System |
| STATE 2 | APPROVED | CO approve | CO |
| STATE 2 | REJECTED | CO reject | CO |
| STATE 2 | STATE 4 | CO escalate | CO |
| STATE 2 | STATE 5 | CO needs more documents | CO |
| STATE 2 | ESCALATED (Supervisor) | SLA expired (8h) | System |
| STATE 3 | STATE 1 or 2 | Fraud cleared → **AI RE-SCORE** (fraud_flag reset CLEAR, re-run scoring model with updated data). Route by new score: State 1 if score > TH_high + confidence > 0.85, else State 2. Không dùng score cũ. | Fraud Analyst |
| STATE 3 | REJECTED_FRAUD | Fraud confirmed | Fraud Analyst |
| STATE 3 | REJECTED | Inconclusive, too risky | Fraud Analyst |
| STATE 3 | STATE 5 | Need branch visit / additional ID | Fraud Analyst |
| STATE 3 | ESCALATED (Head Fraud) | SLA expired (4h) | System |
| STATE 4 | APPROVED | Senior CO approve | Senior CO |
| STATE 4 | APPROVED (conditions) | Senior CO approve with lower limit / conditions | Senior CO |
| STATE 4 | REJECTED | Senior CO reject | Senior CO |
| STATE 4 | COMMITTEE | Beyond Senior CO authority | Senior CO |
| STATE 4 | STATE 5 | Need more documents | Senior CO |
| STATE 4 | ESCALATED (Committee) | SLA expired (24h) | System |
| STATE 5 | RE-ENTER PIPELINE | Info received, re-run scoring | System |
| STATE 5 | EXPIRED | No response 14 calendar days | System |
| STATE 5 | WITHDRAWN | Customer withdraws | Customer |
| COMMITTEE | APPROVED | Committee approve | Committee |
| COMMITTEE | REJECTED | Committee reject | Committee |
| COMMITTEE | ESCALATED (Head of Cards) | SLA expired (48h) | System |

### 3.3 Invalid Transitions (MUST NOT happen)

| Invalid transition | Why not |
|-------------------|---------|
| STATE 1 → APPROVED without CO action | Luật TCTD + Luật AI: human must sign |
| Any state → APPROVED with fraud flag HIGH | Must clear fraud first (State 3) |
| STATE 5 → APPROVED directly | Must re-enter pipeline, re-run AI scoring with new data |
| Any state → APPROVED without audit log | TT 13: every decision must be logged |
| REJECTED → APPROVED (same application) | Cannot reverse rejection. Customer must re-apply. |
| AI SCORING → APPROVED (bypass human) | Luật AI 134/2025 Điều 4: AI không thay thế con người |

### 3.4 Terminal State Data Retention

Mỗi terminal state có retention schedule khác nhau (Tiered Data Lifecycle — xung đột SBV retention vs BVDLCN deletion):

| Terminal State | Tầng 1: Raw PII | Tầng 2: Pseudonymized Audit | Tầng 3: Stats | Ref |
|---------------|----------------|----------------------------|--------------|-----|
| **APPROVED** | Giữ suốt hợp đồng CC + 1 năm | 10 năm (SBV audit) | Vĩnh viễn | pdpd-impact v1.1 §4.4 |
| **REJECTED** | Xóa sau 1 năm | 5 năm | Vĩnh viễn | |
| **REJECTED_FRAUD** | Giữ 5 năm (fraud/SIMO) | 10 năm | Vĩnh viễn | |
| **EXPIRED** | Xóa sau 90 ngày | 2 năm | Vĩnh viễn | |
| **WITHDRAWN** | Xóa sau 30 ngày (shortest — respect privacy) | 1 năm (minimum audit) | Vĩnh viễn | |

**WITHDRAWN specifics:** Pseudonymize Tầng 2 immediately (T+0). Auto-delete Tầng 1 raw PII T+30 days. Thông báo khách: "DLCN sẽ được xóa trong 30 ngày. Hồ sơ ẩn danh giữ theo yêu cầu pháp luật."

**⚠️ Retention periods = proposed. Cần confirm Compliance Officer + Legal.** Chi tiết: decision-architecture.md Terminal States section + pdpd-impact-assessment.md v1.1 Section 4.4.

---

## 4. SLA TABLE — Full Specification

### 4.1 Primary SLA

| State | Target SLA | Escalation SLA | Final deadline | Primary owner | Escalation owner |
|-------|-----------|---------------|---------------|--------------|-----------------|
| **S1** Auto-route approve | **4 giờ** | 8 giờ | 12 giờ (hard) | Junior/Mid CO | Supervisor |
| **S2** Standard review | **8 giờ** (1 BD) | 16 giờ (2 BD) | 24 giờ (hard) | CO | Supervisor |
| **S3** Priority fraud | **4 giờ** | 8 giờ | 12 giờ (hard) | Senior CO / Fraud | Head of Fraud |
| **S4** Escalate | **24 giờ** (1 BD) | 48 giờ (2 BD) | 72 giờ (hard) | Senior CO | Committee |
| **S5** Need-more-info (customer) | **14 calendar days** | N/A (auto-expire) | 14 days (hard) | Customer | N/A |
| **S5** Need-more-info (CO process after receipt) | **4 giờ** | 8 giờ | 12 giờ | CO | Supervisor |
| **COMMITTEE** | **48 giờ** (2 BD) | 72 giờ | 5 BD (hard) | Committee | Head of Cards |

### 4.2 SLA Clock Rules

| Rule | Mô tả |
|------|-------|
| **Clock starts** | When application enters state |
| **Clock pauses** | When in STATE 5 (waiting for customer). Resumes when info received. |
| **Business days** | Mon-Fri, 8:00-17:00 local time. Exclude VN public holidays. |
| **After hours** | Applications received after 17:00 → SLA clock starts 8:00 next BD. Exception: State 3 (Fraud) — SLA clock 24/7. |
| **Peak period** | Tết, campaign periods → SLA may relax 50% (Risk Committee approve). |

### 4.3 SLA Breach Handling

| Breach level | Trigger | Action | Notification |
|-------------|---------|--------|-------------|
| **Warning** | 75% of target SLA elapsed | Yellow highlight in dashboard | CO + Supervisor alert |
| **Breach** | Target SLA elapsed | Auto-escalate to next level | CO + Supervisor + Manager email |
| **Critical** | Escalation SLA elapsed | Auto-escalate to Head of unit | Manager + Head of Cards alert |
| **Hard deadline** | Final deadline elapsed | Force to top of queue + incident log | Head of Cards + Risk Manager + daily report |

### 4.4 SLA Metrics — Dashboard KPIs

| KPI | Target | Red flag |
|-----|--------|---------|
| S1 SLA compliance rate | ≥95% | <90% |
| S2 SLA compliance rate | ≥90% | <80% |
| S3 SLA compliance rate | ≥95% | <90% |
| S4 SLA compliance rate | ≥85% | <75% |
| Average time-to-decision (all states) | <4 giờ | >8 giờ |
| State 5 conversion rate (info received → decision) | ≥60% | <40% |
| State 5 expiry rate | <30% | >50% |

---

## 5. EXCEPTION HANDLING

### 5.1 System Exceptions

| Exception | Detection | Handling | State impact |
|----------|----------|---------|-------------|
| **CIC API timeout** | 3 consecutive timeouts (30s each) | Route to STATE 5 with `info_requested: "CIC unavailable, retry later"`. Auto-retry CIC every 30 min × 4. If still down → CO manual CIC query via portal. | STATE 5 |
| **eKYC provider down** | API health check fail | Queue application. Retry every 5 min. If >1 hour → route to STATE 5. | STATE 5 |
| **AI scoring model error** | Model returns error/null | Fallback: route to STATE 2 (full manual review). Log model error for debugging. | STATE 2 |
| **AI scoring model latency** | Response > 10 seconds | Timeout → fallback to STATE 2. Alert ML team. | STATE 2 |
| **Database write failure** | Audit trail write fails | HALT decision processing. Retry 3x. If fail → alert IT. Do NOT proceed without audit trail. | BLOCKED |
| **Duplicate application** | Same CCCD within 30 days | Flag as potential fraud → STATE 3. Or: merge with existing application if in STATE 5. | STATE 3 or merge |

### 5.2 Business Exceptions

| Exception | Detection | Handling | State impact |
|----------|----------|---------|-------------|
| **Customer opt-out AI** | Application flag `opt_out_ai = true` | Bypass AI scoring entirely. Route to STATE 2 (full manual review, as-is flow). Log: `ai_opted_out: true`. | STATE 2 |
| **VIP / relationship customer** | Bank internal VIP flag | Route to STATE 2 regardless of AI score. CO gets VIP context. No auto-route. | STATE 2 |
| **Staff application** | Applicant is bank employee | Route to STATE 4 (separate approval authority per bank policy). Conflict of interest check. | STATE 4 |
| **Limit > policy max** | Requested limit exceeds standard policy | Route to STATE 4 (policy exception). Needs Senior CO or Committee. | STATE 4 |
| **Campaign/promotion application** | Special product launch | May have modified thresholds (Risk Committee pre-approved). Route per campaign rules. | Per campaign |

---

## 6. COMPARISON: AS-IS vs TO-BE PER STEP

| Step | As-Is | To-Be | Change |
|------|-------|-------|--------|
| **Data collection** | Manual entry by back-office (5-15 min) | Auto-ingest from online form/app (1-5 sec) | Automated |
| **eKYC** | Semi-manual (2-5 min) | Automated parallel call (5-30 sec) | Automated |
| **CIC query** | Manual/batch (5 min - 24h) | Real-time API (5-30 sec) | Automated |
| **Risk assessment** | CO subjective review (20-45 min) | AI scoring (2-5 sec) + CO review (3-35 min depending on state) | AI + Human |
| **Fraud check** | eKYC pass/fail only | Multi-signal AI fraud scoring (parallel with CIC) | New capability |
| **Decision** | CO ký (100% cases) | CO ký (100% cases, but batch for State 1) | Same authority, less time |
| **Explanation** | None / vague | Top 3 factors + right to human review | New capability |
| **Audit trail** | Manual, ~5 fields | Automated, 24 fields, immutable | Upgraded |
| **Escalation** | Ad-hoc (CO walks to supervisor) | Structured states + SLA + auto-escalation | Formalized |
| **Customer communication** | Branch call / letter (days) | Real-time notification (app/SMS/email) | Faster |

---

## 7. VOLUME & CAPACITY PLANNING

### 7.1 Expected Volume Distribution (ước tính)

| State | % | Volume/tháng | CO Time/app | Total CO hours/tháng | FTE needed |
|-------|---|-------------|------------|---------------------|-----------|
| S1 Auto-route | 35-45% | 1,200 | 4 min | 80h | 0.5 |
| S2 Standard | 25-35% | 900 | 25 min | 375h | 2.1 |
| S3 Fraud | 2-5% | 100 | 45 min | 75h | 0.4 |
| S4 Escalate | 5-10% | 225 | 45 min | 169h | 1.0 |
| S5 Need-info (CO process) | 8-15% | 375 | 10 min | 63h | 0.4 |
| **Total** | **100%** | **3,000** | **~15 min avg** | **762h** | **4.4 FTE** |

### 7.2 Peak Capacity

| Period | Volume multiplier | Adjusted volume | FTE needed | Mitigation |
|--------|------------------|----------------|-----------|-----------|
| Normal | 1.0x | 3,000/tháng | 4.4 | Standard |
| Tết (Jan-Feb) | 1.5-2.0x | 4,500-6,000 | 6.6-8.8 | Relax SLA 50% + temp CO allocation |
| Campaign | 2.0-3.0x | 6,000-9,000 | 8.8-13.2 | Increase State 1 threshold (more auto-route) + temp staff |
| Year-end | 1.3x | 3,900 | 5.7 | Overtime |

---

## Tracking — Tự hỏi cuối tuần

- [ ] As-is flow đã validate với Credit Officers chưa? (Shadow 1 ngày trước khi finalize)
- [ ] CIC integration method confirmed? (API real-time vs manual portal?)
- [ ] SLA values đã review với Ops Manager chưa?
- [ ] Exception handling đã review với IT chưa? (CIC timeout, model error fallback)
- [ ] VIP / staff exception rules đã confirm với bank policy?
- [ ] Volume distribution (35-45% State 1) — cần shadow testing confirm

---

## Ghi Chú & Limitations

1. **As-is flow chưa validate** — generic NHTM VN. Mỗi bank khác nhau. Cần shadow CO ít nhất 1 ngày (Week 8).
2. **To-be flow assumes CIC real-time API** — nếu bank chỉ có manual portal → Stage 2 sẽ khác đáng kể. CIC step có thể thành async + STATE 5.
3. **Volume distribution là ước tính** — actual distribution phụ thuộc threshold setting (Week 6) + model quality. Conservative threshold → ít State 1, nhiều State 2.
4. **SLA "business days"** — ngân hàng VN có thể có Saturday morning working. Cần confirm.
5. **Cross-reference:** decision-architecture.md (5 states detail), damage-model.md (cost-of-error cho threshold), feature-availability-matrix.md (feature priority cho AI scoring stage).