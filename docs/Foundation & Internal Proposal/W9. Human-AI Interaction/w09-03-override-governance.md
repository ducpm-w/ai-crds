# Override Governance — AI-CRDS
> **Tags:** `[Governance]` `[Risk]` `[Compliance]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 9
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Define override rights, escalation rules, monitoring, và feedback loop. Cần Compliance + Risk Manager review trước khi finalize.

---

## 1. OVERRIDE RIGHTS — Who Can Override What

### 1.1 Core Policy

**Mọi CO có quyền override AI recommendation.** AI là decision support, không phải decision maker (Luật AI 134/2025 Điều 4, Luật TCTD 2024). Override = CO exercising their professional judgment.

**Override PHẢI được log** — reason category (dropdown) + detail (free text, min 20 chars) = mandatory cho mọi override. Không có exception.

### 1.2 Override Authority Matrix

| Override type | Who can do | Supervisor approval? | Condition |
|-------------|-----------|---------------------|----------|
| **Confirm AI approve** (S1 batch) | Any CO | ❌ No | Agreement, not override |
| **Reject when AI recommends approve** | Any CO | ⚠️ **Notify supervisor** (not block) | Log reason. Supervisor reviews within 24h. |
| **Approve when AI recommends review** (S2) | Any CO | ❌ No | Normal — CO reviewed and decided. Within authority limit. |
| **Reject when AI recommends review** (S2) | Any CO | ❌ No | Normal review outcome. |
| **Approve when AI recommends reject** | Any CO within authority | ✅ **Yes — supervisor co-sign required** | High-risk override. Supervisor must review and co-sign within 4h. |
| **Approve above CO authority limit** | Senior CO / Committee | ✅ Yes — per standard bank hierarchy | Not AI-specific — existing bank policy. |
| **Approve when fraud flag > 0.3** (not cleared) | ❌ **NOT ALLOWED** for standard CO | Fraud team must clear first | Fraud flag must be resolved before credit decision. Route to State 3 first. |
| **Clear fraud flag** | Fraud Analyst / Senior CO (fraud-trained) only | ❌ No (within fraud authority) | Log EDD checklist completion. |

### 1.3 Override Reason Categories

| Code | Category | When to use | Example |
|------|---------|------------|---------|
| `REL` | Relationship knowledge | CO knows customer personally, has info AI doesn't have | "Khách VIP 5 năm, income verify qua payroll, situation temporary" |
| `INC` | Income verification | CO verified income through additional means | "Bank statement confirms 25M/month despite declared 18M" |
| `EMP` | Employer verification | CO verified employer legitimacy/stability | "Employer is government agency — stable despite CIC inquiries" |
| `TMP` | Temporary situation | DPD/NPL due to temporary event, customer recovered | "DPD 30 due to hospitalization 6M ago, fully recovered, paying on time since" |
| `ERR` | AI error suspected | CO believes AI output is incorrect (data issue, model bug) | "AI score 0.45 but all indicators positive — possible data input error" |
| `POL` | Policy concern | Case falls outside standard policy, needs judgment | "Limit request 80M for income 15M — high DTI but employer FDI with bonus structure" |
| `OTH` | Other | None of above | Free text mandatory (min 50 chars for OTH) |

---

## 2. SUPERVISOR ESCALATION

### 2.1 When Supervisor Approval Required

| Trigger | Supervisor action | SLA | Rationale |
|---------|------------------|-----|----------|
| CO override-to-approve khi AI recommends REJECT | Co-sign approval | 4 giờ | High-risk: AI said no but CO says yes. Need second opinion. |
| CO approve with limit > 50% of CO authority | Co-sign | 4 giờ | Large exposure. Existing bank policy, not AI-specific. |
| CO approve khi fraud score 0.2-0.3 (not elevated, but nonzero) | Review + co-sign | 4 giờ | Borderline fraud signal. Conservative approach. |
| Pattern: CO override rate > 2x team average (sustained 2 weeks) | Review CO performance | 1 week | Possible training gap or possible CO has legitimate additional info. |

### 2.2 Supervisor Override Review Process

```
CO submits override (approve when AI says reject)
    │
    ├── System: auto-notify Supervisor (push + email)
    │   Include: Application summary, AI recommendation,
    │   CO override reason, customer profile
    │
    ├── Supervisor reviews within 4h:
    │   ├── [✓ Approve override] → Decision final. Log supervisor co-sign.
    │   ├── [✗ Reject override] → Revert to AI recommendation.
    │   │   CO notified. Application re-queued for different CO or Senior CO.
    │   └── [↑ Escalate] → To Committee. Complex case.
    │
    └── If Supervisor no action within 4h:
        → Auto-escalate to next senior level.
        → SLA breach logged.
```

---

## 3. OVERRIDE MONITORING

### 3.1 Metrics Tracked

| Metric | Granularity | Frequency | Alert threshold |
|--------|-----------|----------|----------------|
| **Override rate (overall)** | Team-level | Weekly | > 30% → investigate. > 60% → guardrail G-O1. |
| **Override rate (per CO)** | Individual CO | Monthly | > 2x team average → Supervisor review |
| **Override direction** | Override-to-approve vs override-to-reject | Monthly | > 80% one direction → investigate |
| **Override-to-approve NPL** | Cohort: overridden approvals | Quarterly (90-day lag) | NPL of overridden > 2x NPL of AI-recommended → CO training needed |
| **Override reason distribution** | By reason category | Monthly | > 50% "Other" → reason categories insufficient, add new ones |
| **Override + default** | CO overrides AI reject → customer defaults | Quarterly | Tracked per CO. Systematic bad overrides → training + possible authority reduction. |

### 3.2 Override Dashboard (Supervisor View)

```
┌─────────────────────────────────────────────────────────┐
│ OVERRIDE MONITORING — April 2026                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Team Override Rate: 16% (target: 10-20%)    ✅ Healthy   │
│                                                         │
│ By Direction:                                           │
│ Override-to-approve: 62% ████████████░░░░░░             │
│ Override-to-reject:  38% ████████░░░░░░░░░░             │
│                                                         │
│ By CO:                                                  │
│ CO-001 (Nguyễn A): 12% ████░░░░░░  ✅                   │
│ CO-002 (Trần B):   18% ██████░░░░  ✅                   │
│ CO-003 (Lê C):     35% ████████████ ⚠️ HIGH             │
│ CO-004 (Phạm D):    4% ██░░░░░░░░  ⚠️ LOW (rubber?)    │
│                                                         │
│ Override Outcomes (last 90 days):                        │
│ Override-to-approve → default: 8% (vs AI-approve: 3%)   │
│ → CO overrides performing worse than AI ⚠️               │
│                                                         │
│ Top Override Reasons:                                   │
│ 1. Relationship knowledge (35%)                         │
│ 2. Income verification (25%)                            │
│ 3. Temporary situation (20%)                            │
│ 4. AI error suspected (12%)                             │
│ 5. Other (8%)                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 4. FEEDBACK LOOP — Overrides → Model Improvement

### 4.1 Override as Training Signal

```
Override data collected
    │
    ├── Short-term (weekly):
    │   PM + DS review override patterns:
    │   - Which features do COs disagree on most?
    │   - Are there systematic overrides? (same type repeatedly)
    │   - Any new data CO uses that model doesn't have?
    │
    ├── Medium-term (monthly):
    │   DS analyze:
    │   - Override-to-approve cohort: what % default?
    │   - If CO overrides perform BETTER → model missing something
    │     → investigate: add new feature? Adjust threshold?
    │   - If CO overrides perform WORSE → CO training issue
    │     → provide feedback to CO
    │
    └── Long-term (quarterly):
        Model retrain cycle:
        - Override data feeds into retraining dataset
        - Override reasons → potential new features
        - Systematic overrides → threshold recalibration signal
        - Report to Risk Committee: "Override analysis Q2 2026"
```

### 4.2 Specific Feedback Actions

| Override pattern | Signal | Action |
|-----------------|--------|--------|
| Many overrides on "employer type" | Model underweights employer stability | DS: investigate adding employer age/revenue as feature |
| Many overrides on "temporary DPD" | Model penalizes past DPD too heavily for recovered cases | DS: add "DPD recency" feature (recent vs old DPD) |
| Many "AI error suspected" | Model output inconsistent with input | DS: debug specific cases. Possible data pipeline issue. |
| CO overrides consistently outperform AI | CO has info AI doesn't | PM: interview CO → what info? → can it become a feature? |
| CO overrides consistently underperform AI | CO judgment biased or outdated | Training: show CO outcomes data. Calibrate trust. |

---

## 5. ANTI-GAMING RULES

| Risk | Detection | Prevention |
|------|----------|-----------|
| CO always overrides to approve (boost approval numbers) | Override-to-approve rate > 80% for individual CO | Monitor per-CO override direction. Flag > 80% one direction. |
| CO never overrides (rubber-stamping AI) | Override rate < 3% AND review time < 2 min | Spot audit. Check co_review_time_seconds. Rubber-stamping alert (metric-definitions.md L3-W2). |
| CO overrides only for "friends/VIPs" | Override-to-approve concentrated on specific customer segment or relationship | Monitor: override rate by customer type. Flag if override rate for "VIP/relationship" > 3x other segments. |
| CO and Supervisor collude on overrides | Both always co-sign without real review | Quarterly: random audit of supervisor co-signed overrides by Internal Audit. |

---

## Tracking

- [ ] Override policy reviewed with Compliance?
- [ ] Supervisor escalation triggers reviewed with Risk Manager?
- [ ] Override reason categories validated with CO (from interviews)?
- [ ] Anti-gaming rules reviewed with Internal Audit?
- [ ] Feedback loop process reviewed with DS team?
- [ ] Override monitoring dashboard spec shared with dev team?

---

## Ghi Chú

1. **"Override is a right, not a violation."** Frame carefully in CO training. Override = CO adding value. Not = CO defying system.
2. **Override-to-approve when AI says reject is highest-risk** → requires supervisor co-sign. This may slow down some approvals by 4h. Acceptable trade-off for risk control.
3. **Per-CO override tracking** may feel like surveillance. Frame: "performance data to help you improve, not to punish." Show CO their override outcomes (good and bad) as learning tool.
4. **Cross-reference:** decision-architecture.md (override section), metric-definitions.md (L3-W2 override rate), guardrail-definitions.md (G-O1, G-O2 override guardrails), trust-calibration-guide.md (calibrated trust zone), escalation-tree.md (L1→L2 escalation triggers).