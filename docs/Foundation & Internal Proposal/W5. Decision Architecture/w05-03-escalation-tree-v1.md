# Escalation Tree — AI-CRDS
> **Tags:** `[Product]` `[Governance]` `[Workflow]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 5
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Define rõ: ai xử lý gì, khi nào escalate, escalate cho ai, SLA mỗi cấp. Dùng cho CO training (Week 34), UI design (Week 9), và incident response (Week 14).

---

## 1. ESCALATION HIERARCHY — 4 Levels

```
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 4 — RISK MANAGER / HEAD OF CARDS                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ LEVEL 3 — CREDIT COMMITTEE                              │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ LEVEL 2 — SENIOR CO / FRAUD ANALYST                 │ │ │
│ │ │ ┌─────────────────────────────────────────────────┐ │ │ │
│ │ │ │ LEVEL 1 — JUNIOR / MID CO                       │ │ │ │
│ │ │ │                                                 │ │ │ │
│ │ │ │  Day-to-day decisions                           │ │ │ │
│ │ │ │  S1 batch confirm + S2 standard review          │ │ │ │
│ │ │ └─────────────────────────────────────────────────┘ │ │ │
│ │ │  Complex cases + Fraud                               │ │ │
│ │ │  S3 fraud review + S4 escalated from L1              │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │  Policy exceptions + Large limits + VIP                  │ │
│ │  Limit > threshold + Override disputes                   │ │
│ └─────────────────────────────────────────────────────────┘ │
│  System-level: threshold changes, model issues, compliance   │
│  Không xử lý individual cases thường ngày                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. LEVEL 1 — JUNIOR / MID CREDIT OFFICER

### Scope

| Attribute | Detail |
|-----------|--------|
| **Handles** | State 1 (batch confirm) + State 2 (standard review) |
| **Authority** | Approve/reject applications with limit ≤ standard policy max (❓ cần confirm, ước tính ≤ 100M VND) |
| **Volume** | ~70-80% of all applications |
| **Team size** | 3-4 FTE (ước tính từ capacity model) |

### Escalate TO Level 2 khi

| # | Trigger | Type | Detection | SLA before escalate |
|---|---------|------|----------|-------------------|
| E1.1 | **SLA expired** — State 1 quá 4h hoặc State 2 quá 8h | Auto | System SLA monitor | Immediate (auto) |
| E1.2 | **CO uncertain** — không confident đủ để quyết định | Manual | CO tự nhận | Anytime |
| E1.3 | **Policy question** — case không rõ có thuộc policy không | Manual | CO review | Anytime |
| E1.4 | **Override AI approve → reject** — CO muốn reject case AI recommend approve | Manual | CO action | Anytime |
| E1.5 | **Conflicting signals** — AI score says approve nhưng CO thấy red flag | Manual | CO judgment | Anytime |
| E1.6 | **Limit request > CO authority** — applicant request limit vượt CO authority | Auto | System check | Immediate |
| E1.7 | **Fraud flag ELEVATED** — system auto-route, không qua L1 | Auto | Fraud model | Immediate (bypass L1) |

### L1 CO Escalation UI

```
CO đang review hồ sơ State 2
    │
    ├── [✓ Approve] — trong thẩm quyền → ký, done
    ├── [✗ Reject] — trong thẩm quyền → ký, adverse action, done
    │
    └── [↑ Escalate to Senior CO]
        │
        ├── Chọn lý do (dropdown, bắt buộc):
        │   ├── "Uncertain — cần senior opinion"
        │   ├── "Policy question — case ngoài policy rõ ràng"
        │   ├── "Override AI — muốn reject nhưng AI recommend approve"
        │   ├── "Conflicting signals — AI vs CO assessment khác nhau"
        │   ├── "Limit exceeds authority"
        │   └── "Other — [free text bắt buộc]"
        │
        ├── Ghi note (free text, optional nhưng recommended):
        │   "Applicant income declared 80M nhưng employer là startup 6 tháng tuổi..."
        │
        └── Submit → Route to Level 2 queue
            CO nhận confirmation: "Escalated to Senior CO. Ticket #ESC-2026-001"
```

---

## 3. LEVEL 2 — SENIOR CO / FRAUD ANALYST

### Scope

| Attribute | Detail |
|-----------|--------|
| **Handles** | State 3 (fraud priority) + State 4 (escalated from L1/AI) + Override review |
| **Authority** | Approve/reject limit ≤ elevated threshold (❓ ước tính ≤ 200M VND). Approve policy exceptions within pre-approved framework. Clear/confirm fraud. |
| **Volume** | ~15-25% of all applications (S3 + S4 + escalations from L1) |
| **Team size** | 1-2 Senior CO + 0.5-1 Fraud Analyst |

### Receives escalation FROM Level 1 khi

Tất cả triggers E1.1-E1.7 ở trên.

### Escalate TO Level 3 khi

| # | Trigger | Type | Detection | SLA before escalate |
|---|---------|------|----------|-------------------|
| E2.1 | **SLA expired** — State 3 quá 4h, State 4 quá 24h | Auto | System | Immediate (auto) |
| E2.2 | **Limit > Senior CO authority** — ước tính > 200M VND | Auto | System check | Immediate |
| E2.3 | **Policy exception** — case ngoài pre-approved exception framework | Manual | Senior CO judgment | Anytime |
| E2.4 | **VIP / relationship customer** — cần committee awareness | Manual | VIP flag hoặc Senior CO judgment | Anytime |
| E2.5 | **Override dispute** — L1 CO và Senior CO disagree về decision | Manual | Discussion outcome | After review |
| E2.6 | **Fraud — inconclusive + high value** — fraud investigation chưa kết luận, limit cao | Manual | Fraud Analyst judgment | After EDD |
| E2.7 | **Staff application** — conflict of interest cases | Auto/Manual | Staff flag | Immediate |
| E2.8 | **Repeat escalation** — same applicant/pattern escalated ≥2 lần | Auto | System pattern detect | After 2nd escalation |

### Escalate TO Level 4 (Risk Manager) khi — Fraud-specific

| # | Trigger | Type | Tại sao Risk Manager? |
|---|---------|------|---------------------|
| E2.F1 | **Fraud ring suspected** — pattern: multiple applications, same device/address, coordinated | Manual | System-level threat, not individual case |
| E2.F2 | **Fraud detection model failure** — model miss nhiều fraud cases (post-hoc discovery) | Manual | Model issue → needs retraining/threshold change |
| E2.F3 | **Data breach suspected** — applicant data leaked, mass identity fraud | Manual | Incident response protocol |
| E2.F4 | **SIMO report needed** — TT 45/2025 mandatory reporting | Auto/Manual | Regulatory compliance |

---

## 4. LEVEL 3 — CREDIT COMMITTEE

### Scope

| Attribute | Detail |
|-----------|--------|
| **Handles** | Large limit approvals, VIP cases, policy exceptions, override disputes |
| **Authority** | Approve/reject all limits. Set/change policy exceptions. Override any lower-level decision. |
| **Composition** | ❓ Cần confirm — typically: Head of Cards (chair) + Risk Manager + 1-2 Senior COs. Quorum: ≥3 members. |
| **Meeting cadence** | ❓ Cần confirm — weekly fixed meeting + ad-hoc for urgent cases |
| **Volume** | ~2-5% of applications (only elevated cases) |

### Receives escalation FROM Level 2 khi

Triggers E2.1-E2.8 ở trên.

### Escalate TO Level 4 khi

| # | Trigger | Type | Detection |
|---|---------|------|----------|
| E3.1 | **SLA expired** — Committee quá 48h | Auto | System |
| E3.2 | **Committee disagree** — no consensus after deliberation | Manual | Committee process |
| E3.3 | **Threshold change request** — committee believes AI threshold should change | Manual | Committee deliberation |
| E3.4 | **Systemic pattern** — committee notices recurring issue (ví dụ: AI consistently wrong on certain segment) | Manual | Pattern observation |
| E3.5 | **Regulatory concern** — case raises SBV / Luật AI compliance question | Manual | Committee assessment |

### Committee Decision Process

```
Committee receives escalated case
    │
    ├── Case presented by Senior CO (5 min)
    │   ├── Applicant profile summary
    │   ├── AI recommendation + score + explanation
    │   ├── CO assessment + escalation reason
    │   └── Recommendation from Senior CO
    │
    ├── Committee review (10-20 min)
    │   ├── CIC data review
    │   ├── Risk assessment
    │   ├── Policy compliance check
    │   └── Discussion
    │
    └── Committee decision (vote)
        ├── [✓ Approve] — with/without conditions
        │   Conditions ví dụ: lower limit, shorter review cycle, additional monitoring
        ├── [✗ Reject] — with documented reasons
        └── [↩ Return to L2] — need more info
        
    All decisions logged with:
    ├── committee_members_present: ["HoC-001", "RM-001", "SCO-001"]
    ├── vote_outcome: "approve_with_conditions" 
    ├── conditions: "limit_cap_150M, review_after_6M"
    └── dissenting_opinion: null / "RM disagrees, notes..."
```

---

## 5. LEVEL 4 — RISK MANAGER / HEAD OF CARDS

### Scope

| Attribute | Detail |
|-----------|--------|
| **Handles** | System-level issues ONLY — threshold changes, model concerns, compliance escalations, strategic decisions |
| **KHÔNG handles** | Individual application decisions (trừ khi committee escalate) |
| **Authority** | Approve threshold changes, mandate model retraining, pause/resume AI system, escalate to C-level |

### Receives escalation FROM Level 3 / Direct system alerts

| # | Trigger | Type | Action |
|---|---------|------|--------|
| E4.1 | **Threshold change request** từ Committee | From L3 | Review data → approve/reject threshold change → notify all levels |
| E4.2 | **Model performance concern** — drift detected, accuracy drop | Auto (monitoring) | Trigger model review → retrain if needed → champion-challenger |
| E4.3 | **Compliance escalation** — SBV inquiry, Luật AI concern, DPIA issue | From L3 / Compliance | Coordinate with Compliance Officer + Legal |
| E4.4 | **Fraud ring / systemic fraud** | From L2 | Activate incident response → coordinate with IT, Fraud, Legal |
| E4.5 | **Override rate anomaly** — CO override rate > 60% sustained | Auto (monitoring) | Investigate: model issue or CO training issue? |
| E4.6 | **SLA breach rate > 10%** sustained 2+ weeks | Auto (dashboard) | Investigate: capacity issue? Process issue? System issue? |
| E4.7 | **Customer complaint — AI bias** | From Compliance | Investigate bias in model → audit specific segment → remediate |
| E4.8 | **System-wide AI pause** — critical model failure | Auto / Manual | Fallback to 100% manual (as-is flow) → fix → resume |

### L4 Actions

| Action | When | Process | Approval needed |
|--------|------|---------|----------------|
| **Adjust threshold** | Override rate high, NPL changing, business strategy shift | Analyze data → propose new threshold → test on historical data → approve → deploy | Risk Manager sign-off |
| **Mandate model retrain** | Drift detected, accuracy drop, new data available | Trigger ML team → retrain → validate → champion-challenger → promote | Risk Manager + Committee |
| **Pause AI system** | Critical failure, compliance blocking issue | Switch to 100% manual fallback → investigate → fix → resume | Risk Manager (can act alone for safety) |
| **Escalate to C-level** | Budget issue, strategic pivot, regulatory enforcement | Prepare brief → present to C-level | N/A (informational) |

---

## 6. AUTO-ESCALATION TRIGGERS (System-Generated)

### 6.1 From AI Model — Direct state routing

| # | Trigger | Threshold | Target | Lý do |
|---|---------|----------|--------|-------|
| A1 | **AI confidence very low** | confidence < 0.3 | → State 4 (Escalate) | Model cực kỳ uncertain — không nên để L1 xử lý |
| A2 | **Fraud score very high** | fraud_score > 0.8 | → State 3 (Priority Fraud) | Near-certain fraud — priority review |
| A3 | **Fraud score elevated** | 0.4 ≤ fraud_score < 0.8 | → State 3 (Priority Fraud) | Significant fraud signal |
| A4 | **Data anomaly** | Statistical outlier ≥2 features | → State 4 (Escalate) | Edge case — model may not handle well |
| A5 | **CIC unavailable** | 3 retries failed | → State 5 (Need-More-Info) | Cannot score without CIC — wait and retry |
| A6 | **Duplicate application** | Same CCCD within 30 days | → State 3 (Priority Fraud) | Potential fraud or duplicate |
| A7 | **eKYC fail** | ekyc_result = "fail" | → State 5 (Need-More-Info) | Cannot verify identity |
| A8 | **Blacklist match** | CCCD/phone on blacklist | → State 3 (Priority Fraud) + flag "BLACKLIST" | Known bad actor |

### 6.2 From SLA Monitor — Time-based escalation

| # | Trigger | Condition | From | To | Action |
|---|---------|----------|------|-----|--------|
| T1 | S1 warning | 75% of 4h = 3h elapsed | L1 CO | L1 CO + Supervisor alert | Yellow alert in dashboard |
| T2 | S1 breach | 4h elapsed, no action | L1 CO | → Supervisor (L2) | Auto-reassign + email alert |
| T3 | S2 warning | 75% of 8h = 6h elapsed | L1 CO | L1 CO + Supervisor alert | Yellow alert |
| T4 | S2 breach | 8h elapsed | L1 CO | → Supervisor (L2) | Auto-reassign |
| T5 | S3 warning | 75% of 4h = 3h elapsed | L2 Fraud | L2 + Head of Fraud alert | Yellow alert |
| T6 | S3 breach | 4h elapsed | L2 Fraud | → Head of Fraud (L4) | Auto-reassign + priority alert |
| T7 | S4 warning | 75% of 24h = 18h elapsed | L2 Senior CO | L2 + Committee alert | Yellow alert |
| T8 | S4 breach | 24h elapsed | L2 Senior CO | → Committee (L3) | Auto-escalate |
| T9 | Committee breach | 48h elapsed | L3 Committee | → Head of Cards (L4) | Priority alert |
| T10 | S5 customer expire | 14 calendar days, no response | Customer | → System (auto-expire) | Close application |

### 6.3 From Monitoring Dashboard — Pattern-based escalation

| # | Trigger | Threshold | To | Action |
|---|---------|----------|-----|--------|
| M1 | **Override rate spike** | > 50% in 1 week (any state) | → L4 Risk Manager | Investigate model/CO alignment |
| M2 | **SLA breach rate** | > 10% in 1 week | → L4 Risk Manager | Capacity or process issue |
| M3 | **Fraud spike** | State 3 volume > 2x normal | → L4 Risk Manager + Head of Fraud | Potential fraud attack |
| M4 | **Model drift alert** | PSI > 0.2 hoặc KS shift > 0.05 | → L4 Risk Manager + ML team | Model degradation |
| M5 | **Approval rate shift** | Approval rate change > 5pp in 1 week | → L4 Risk Manager | Threshold issue or external change |
| M6 | **Customer complaint spike** | > 5 complaints about AI decision in 1 week | → L4 + Compliance | Potential bias or system issue |

---

## 7. CO-TRIGGERED ESCALATION RULES

### 7.1 Override Escalation Matrix

| CO Action | AI Recommendation | Escalation needed? | Rule |
|----------|------------------|-------------------|------|
| CO approve | AI: APPROVE (State 1) | ❌ No | Normal confirm |
| CO approve | AI: REVIEW (State 2) | ❌ No | CO reviewed and approved — normal |
| CO reject | AI: APPROVE (State 1) | ⚠️ **Yes — notify Supervisor** | Unusual override. Log reason mandatory. Supervisor reviews within 24h. Nếu pattern (>3 overrides/tuần từ 1 CO) → L4 investigate. |
| CO reject | AI: REVIEW (State 2) | ❌ No | CO reviewed and rejected — normal |
| CO approve | AI: ESCALATE (State 4) | ⚠️ **Yes — Senior CO co-sign** | Case was escalated for reason. L1 CO cannot single-handedly approve — needs Senior CO co-sign. |
| CO approve | AI: REJECT recommendation | ⚠️ **Yes — Senior CO co-sign** | Override reject → approve is high-risk. Needs L2 confirmation. |

### 7.2 Customer Complaint Escalation

```
Customer complaint about AI decision received
    │
    ├── Complaint type: "Tại sao tôi bị từ chối?"
    │   → Standard response: adverse action notice (already sent)
    │   → If customer requests human review → Route to State 2 (full review by different CO)
    │   → SLA: 5 business days
    │
    ├── Complaint type: "AI bias / phân biệt đối xử"
    │   → Immediate escalate to L4 (Risk Manager + Compliance)
    │   → Audit specific case + segment analysis
    │   → SLA: 10 business days
    │   → May trigger Luật AI 134/2025 compliance review
    │
    └── Complaint type: "Dữ liệu sai / AI dùng data sai"
        → Route to L2 (Senior CO) → verify data sources
        → If data error confirmed → re-score with corrected data
        → SLA: 5 business days
        → Log data quality issue for ML team
```

---

## 8. ESCALATION FLOW DIAGRAM

```
┌──────────────────────────────────────────────────────────────┐
│                    APPLICATION ENTERS AI-CRDS                 │
└──────────────────────────┬───────────────────────────────────┘
                           │
              ┌────────────┼────────────────────┐
              │            │                    │
         AI auto-route  AI auto-route      AI auto-route
         to State 1/2   to State 3          to State 4/5
              │        (fraud A2,A3,         (A1,A4,A5,
              │         A6,A8)               A7)
              │            │                    │
              ▼            ▼                    ▼
┌───────────────┐  ┌──────────────┐    ┌──────────────┐
│   LEVEL 1     │  │   LEVEL 2    │    │   LEVEL 2    │
│   Junior CO   │  │  Fraud Team  │    │  Senior CO   │
│               │  │              │    │              │
│ S1: batch     │  │ S3: EDD      │    │ S4: full     │
│ S2: full      │  │              │    │ underwriting │
│ review        │  │              │    │              │
└───────┬───────┘  └──────┬───────┘    └──────┬───────┘
        │                 │                   │
   ┌────┤              ┌──┤                ┌──┤
   │    │              │  │                │  │
  OK  Escalate       OK  Escalate        OK  Escalate
   │  (E1.1-E1.7)    │  (E2.1-E2.8)     │  (E2.1-E2.8)
   │    │              │  │                │  │
   ▼    ▼              ▼  ▼                ▼  ▼
 Done  L2            Done  L3/L4         Done  L3
       Senior CO           Committee           Committee
        │                   │                   │
        │              ┌────┤                   │
        │              │    │                   │
        │             OK  Escalate              │
        │              │  (E3.1-E3.5)           │
        │              ▼    │                   │
        │            Done   ▼                   │
        │                  L4                   │
        │              Risk Manager             │
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                    System-level action:
                    ├── Threshold change
                    ├── Model retrain
                    ├── Pause AI
                    └── C-level brief
```

---

## 9. ESCALATION METRICS — KPIs

| KPI | Target | Warning | Critical |
|-----|--------|---------|---------|
| L1 → L2 escalation rate | 10-15% | > 20% | > 30% (L1 không confident / model issue) |
| L2 → L3 escalation rate | 2-5% of total | > 8% | > 12% |
| L3 → L4 escalation rate | < 1% of total | > 2% | > 5% (systemic issue) |
| Average escalation resolution time | < 8h (L2), < 48h (L3) | > 12h (L2), > 72h (L3) | > 24h (L2), > 5 BD (L3) |
| Override-triggered escalation rate | < 5% | > 8% | > 15% |
| SLA-triggered auto-escalation rate | < 5% | > 10% | > 15% (capacity problem) |
| Customer complaint escalation | < 2/week | > 5/week | > 10/week |

---

## Tracking — Tự hỏi cuối tuần

- [ ] Escalation levels match Bank X org structure? (❓ validate job titles, authority thresholds)
- [ ] CO authority threshold (100M / 200M) — confirm với Head of Cards?
- [ ] Committee composition + meeting cadence — confirm?
- [ ] Auto-escalation thresholds (confidence < 0.3, fraud > 0.8) — Risk Manager review?
- [ ] Override escalation rules — Compliance review?
- [ ] Customer complaint flow — align with bank's existing complaint process?

---

## Ghi Chú & Limitations

1. **Authority thresholds (100M / 200M)** là ước tính — mỗi bank khác nhau. SOE banks thường có authority thấp hơn. Private banks linh hoạt hơn.
2. **Committee composition chưa validate** — cần confirm với bank HR/governance.
3. **Auto-escalation thresholds** (confidence < 0.3, fraud > 0.8) là placeholders — tuning dựa trên shadow testing data.
4. **Override escalation "CO reject AI approve → notify Supervisor"** có thể controversial — CO có thể cảm thấy bị giám sát. Cần frame carefully trong training: "Đây là safety net, không phải đánh giá CO."
5. **Cross-reference:** decision-architecture.md (5 states detail), decision-state-spec.md (SLA, transitions), sbv-requirements.md (human-in-the-loop governance).