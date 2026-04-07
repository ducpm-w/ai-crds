# Guardrail Definitions — AI-CRDS
> **Tags:** `[Risk]` `[Governance]` `[Compliance]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 7
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Define hard guardrails: metric boundaries mà AI-CRDS KHÔNG ĐƯỢC vượt. Guardrails khác targets — targets là goals (có thể miss), guardrails là ceilings/floors (violate = immediate action).

---

## 1. GUARDRAIL TYPES

| Type | Mô tả | Violate = |
|------|-------|----------|
| **Hard guardrail** 🔴 | Regulatory hoặc existential constraint. Violate = compliance failure hoặc unacceptable bank risk. | Immediate action. Có thể pause AI system. |
| **Soft guardrail** 🟡 | Operational boundary. Violate = investigate + plan fix within timeframe. | Investigation within 1 week. Fix within 1 month. |
| **Monitor** 🟢 | Informational. Track trend. No automatic action, nhưng sustained deviation = investigate. | Note in monthly report. Investigate if sustained 2+ months. |

---

## 2. FULL GUARDRAIL TABLE

### 2.1 Risk Guardrails

| ID | Guardrail | Metric | Hard limit | Soft limit | Current baseline | Owner | Violation action |
|----|----------|--------|-----------|-----------|-----------------|-------|-----------------|
| **G-R1** | **NPL ceiling** | L2-R1 NPL rate | 🔴 **≤ 4.0%** (absolute max) | 🟡 ≤ 3.5% (current baseline) | 3.5% | Risk Manager | 🔴 Hard: Tighten TH_high +0.05 immediately (Risk Manager authority). Review all recent approvals. 🟡 Soft: Investigate root cause within 1 week. |
| **G-R2** | **Fraud ceiling** | L2-R2 Fraud rate | 🔴 **≤ 1.5%** | 🟡 ≤ 0.8% (current baseline) | 0.8% | Head of Fraud | 🔴 Hard: Tighten TH_fraud -0.05. Emergency fraud review. 🟡 Soft: Investigate — model issue? New attack vector? |
| **G-R3** | **EL per app ceiling** | L2-R3 Expected Loss | 🔴 **≤ 2.0M VND** | 🟡 ≤ 1.225M (current) | 1.225M | Risk Manager | 🔴 Hard: Threshold review + possible pause AI for new segment. |
| **G-R4** | **Single-name exposure** | Max CC limit issued via AI-CRDS | 🔴 **≤ 200M VND** per applicant (or Bank X policy max) | N/A | ❓ Cần confirm | Risk Committee | 🔴 Hard: Applications > limit → must go to Committee (State 4). AI cannot recommend limit above this. |
| **G-R5** | **Fraud spike** | L2-R2 vs rolling 30-day average | 🔴 **> 2× rolling 30-day average** | 🟡 > 1.5× rolling 30-day average | 0.8% | Head of Fraud + Risk Manager | 🔴 Hard: Tighten TH_fraud_elevated by -0.05 immediately. Alert Fraud team. Investigate: new attack vector? Model degradation? Data breach? Emergency fraud review of recent approvals. 🟡 Soft: Investigate pattern. Monitor daily for 1 week. |

### 2.2 Business Guardrails

| ID | Guardrail | Metric | Hard limit | Soft limit | Current baseline | Owner | Violation action |
|----|----------|--------|-----------|-----------|-----------------|-------|-----------------|
| **G-B1** | **Approval rate floor** | L2-B1 | 🔴 **≥ 45%** | 🟡 ≥ 55% | ~60% | Head of Cards | 🔴 Hard: Threshold too high → lower TH_high (Risk Committee emergency). AI rejecting too much. 🟡 Soft: Investigate — model issue? Applicant quality change? |
| **G-B2** | **Approval rate ceiling** | L2-B1 | 🔴 **≤ 75%** | 🟡 ≤ 65% | ~60% | Risk Manager | 🔴 Hard: Threshold too low → raise TH_high. Approving too much. 🟡 Soft: Check NPL trend — if NPL stable, may be OK. |
| **G-B3** | **Time-to-decision ceiling** | L2-B2 (P95) | 🔴 **≤ 72h** (P95) | 🟡 ≤ 24h (P95) | 24-48h (manual) | Ops Manager | 🔴 Hard: System failure or massive backlog. Activate contingency. 🟡 Soft: Capacity issue — add CO hours or adjust threshold. |

### 2.3 Operations Guardrails

| ID | Guardrail | Metric | Hard limit | Soft limit | Current baseline | Owner | Violation action |
|----|----------|--------|-----------|-----------|-----------------|-------|-----------------|
| **G-O1** | **Override rate ceiling** | L3-W2 | 🔴 **≤ 60%** sustained 2 weeks | 🟡 ≤ 30% | ❓ No baseline (new) | PM + Risk | 🔴 Hard: Model fundamentally misaligned with CO judgment. Pause AI recommendations. Investigate model vs CO. 🟡 Soft: Training issue or model calibration needed. |
| **G-O2** | **Override rate floor** | L3-W2 | 🔴 **≥ 2%** sustained 1 month | N/A | N/A | PM + Risk | 🔴 Hard: CO may be rubber-stamping (not actually reviewing). Mandatory CO review audit. Reduce batch size. |
| **G-O3** | **SLA compliance floor** | L2-O3 | 🔴 **≥ 75%** | 🟡 ≥ 90% | ❓ | Ops Manager | 🔴 Hard: Systemic SLA failure. Add capacity or adjust SLA targets. 🟡 Soft: Investigate bottleneck (specific state? specific CO? system issue?). |
| **G-O4** | **System availability** | Uptime | 🔴 **≥ 99.0%** (during business hours) | 🟡 ≥ 99.5% | N/A | IT | 🔴 Hard: Activate manual fallback (100% as-is flow). Fix system. 🟡 Soft: Investigate + fix within maintenance window. |
| **G-O5** | **Scoring API performance** | API latency + error rate | 🔴 **Latency > 30 giây OR error rate > 1%** | 🟡 Latency > 10 giây OR error rate > 0.5% | N/A | IT + DS | 🔴 Hard: **Fallback to manual** — all cases route to State 2/4 (full review). IT incident response. SLA clock paused for affected applications. 🟡 Soft: DS investigate model serving. IT check infra. Fix within 24h. |

### 2.4 Compliance Guardrails

| ID | Guardrail | Metric | Hard limit | Soft limit | Owner | Violation action |
|----|----------|--------|-----------|-----------|-------|-----------------|
| **G-C1** | **Audit trail completeness** | L3-C1 | 🔴 **= 100%** | N/A | Compliance | 🔴 **ZERO TOLERANCE.** Any decision without complete audit trail = system bug. Halt processing until fixed. SBV inspection risk. |
| **G-C2** | **Adverse action compliance** | L3-C2 | 🔴 **= 100%** | N/A | Compliance | 🔴 **ZERO TOLERANCE.** Every rejection must have adverse action notice. NĐ 356 + Luật AI requirement. |
| **G-C3** | **AI label compliance** | L3-C3 | 🔴 **= 100%** | N/A | Compliance | 🔴 **ZERO TOLERANCE.** Every AI-involved decision must display AI label. Luật AI 134/2025. |
| **G-C4** | **Gender bias** | L3-C4 | 🔴 **≤ 8pp** gap | 🟡 ≤ 5pp gap | ❓ | Compliance + Risk | 🔴 Hard: Investigate immediately. May need to remove/adjust features. Report to Risk Committee. 🟡 Soft: Monitor + investigate. |
| **G-C5** | **Geography bias** | L3-C5 | 🔴 **≤ 12pp** gap | 🟡 ≤ 8pp gap | ❓ | Compliance + Risk | Same as G-C4. Note: geography gap may reflect real risk difference — must distinguish bias from risk. |
| **G-C6** | **Age bias** | L3-C6 | 🔴 **≤ 15pp** gap | 🟡 ≤ 10pp gap | ❓ | Compliance + Risk | Same as G-C4. Age IS legitimate risk factor — wider range allowed. |
| **G-C7** | **Customer data deletion SLA** | Deletion request processing | 🔴 **≤ 30 calendar days** | 🟡 ≤ 15 calendar days | N/A | DPO | 🔴 Hard: NĐ 356 violation. Prioritize immediately. 🟡 Soft: Process improvement needed. |

### 2.5 Model Guardrails

| ID | Guardrail | Metric | Hard limit | Soft limit | Owner | Violation action |
|----|----------|--------|-----------|-----------|-------|-----------------|
| **G-M1** | **Model drift** | L3-M7 PSI | 🔴 **≤ 0.25** | 🟡 ≤ 0.10 | Data Science | 🔴 Hard: Model output unreliable. Trigger emergency retrain. Consider pause if > 0.30. 🟡 Soft: Schedule retrain within 1 month. |
| **G-M2** | **Model accuracy floor** | L3-M3 AUC | 🔴 **≥ 0.65** | 🟡 ≥ 0.75 | Data Science | 🔴 Hard: Model worse than basic scorecard. Pause AI, retrain. 🟡 Soft: Investigate features, retrain. |
| **G-M3** | **Confidence distribution** | L3-M1 mean confidence | 🔴 **≥ 0.55** | 🟡 ≥ 0.65 | Data Science | 🔴 Hard: Model very uncertain across population. Feature issue or data issue. 🟡 Soft: Investigate data quality, feature availability. |

---

## 3. GUARDRAIL MONITORING DASHBOARD

```
╔══════════════════════════════════════════════════════════════╗
║              AI-CRDS GUARDRAIL DASHBOARD                     ║
║              Last updated: [timestamp]                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  RISK                          STATUS                        ║
║  G-R1 NPL rate     3.2%       [████████░░] ✅ < 3.5% soft   ║
║  G-R2 Fraud rate   0.6%       [████░░░░░░] ✅ < 0.8% soft   ║
║  G-R3 EL/app       1.05M      [██████░░░░] ✅ < 1.225M soft ║
║  G-R5 Fraud spike   1.1x      [████░░░░░░] ✅ < 1.5x soft   ║
║                                                              ║
║  BUSINESS                                                    ║
║  G-B1 Approval     61%        [██████░░░░] ✅ > 55% soft     ║
║  G-B2 Approval     61%        [██████░░░░] ✅ < 65% soft     ║
║  G-B3 TTD (P95)    6h         [██░░░░░░░░] ✅ < 24h soft     ║
║                                                              ║
║  OPERATIONS                                                  ║
║  G-O1 Override      18%       [████░░░░░░] ✅ < 30% soft     ║
║  G-O3 SLA compl.    92%       [█████████░] ✅ > 90% soft     ║
║  G-O4 Uptime        99.8%     [██████████] ✅ > 99.5% soft   ║
║  G-O5 API latency   2.1s      [█░░░░░░░░░] ✅ < 10s soft     ║
║  G-O5 Error rate    0.1%      [█░░░░░░░░░] ✅ < 0.5% soft    ║
║                                                              ║
║  COMPLIANCE                                                  ║
║  G-C1 Audit trail   100%      [██████████] ✅ = 100% hard    ║
║  G-C2 Adverse act.  100%      [██████████] ✅ = 100% hard    ║
║  G-C3 AI label      100%      [██████████] ✅ = 100% hard    ║
║  G-C4 Gender gap    3pp       [███░░░░░░░] ✅ < 5pp soft     ║
║                                                              ║
║  MODEL                                                       ║
║  G-M1 PSI           0.07      [████░░░░░░] ✅ < 0.10 soft    ║
║  G-M2 AUC           0.78      [████████░░] ✅ > 0.75 soft    ║
║                                                              ║
║  ⚠️ WARNINGS: 0    🔴 VIOLATIONS: 0                         ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 4. VIOLATION RESPONSE PROTOCOL

### 4.1 Severity Levels

| Level | Trigger | Response time | Responder |
|-------|---------|-------------|----------|
| **SEV-1** (Critical) | Any 🔴 hard guardrail violated | **≤ 4 hours** | Risk Manager + PM + IT. May pause AI. |
| **SEV-2** (High) | Any 🟡 soft guardrail violated | **≤ 24 hours** (investigate) | PM + relevant owner. Fix within 1 month. |
| **SEV-3** (Monitor) | Metric trending toward guardrail (within 20% of limit) | **≤ 1 week** (analyze trend) | PM + DS. Report at next review meeting. |

### 4.2 SEV-1 Response Playbook

```
🔴 HARD GUARDRAIL VIOLATED
    │
    ├── T+0: Automated alert → Risk Manager + PM + IT + Compliance
    │
    ├── T+1h: War room (virtual)
    │   ├── Confirm violation (not data error)
    │   ├── Assess scope (how many applications affected?)
    │   ├── Decide: pause AI or targeted fix?
    │   └── Assign owner + ETA
    │
    ├── T+4h: First response deployed
    │   ├── If G-C1/C2/C3 (compliance): PAUSE processing until fixed
    │   ├── If G-R1/R2 (risk): Tighten threshold (Risk Manager ±0.05)
    │   ├── If G-R5 (fraud spike): Tighten TH_fraud -0.05. Alert Fraud team. Review recent approvals for fraud patterns.
    │   ├── If G-B1 (approval too low): Lower threshold
    │   ├── If G-M1/M2 (model): Fallback to previous model version or manual
    │   ├── If G-O4 (system down): Activate manual fallback
    │   └── If G-O5 (API latency/error): Fallback to manual — all cases State 2/4. SLA clock paused. IT incident response.
    │
    ├── T+24h: Root cause analysis started
    │
    ├── T+1 week: RCA complete + permanent fix plan
    │
    └── T+1 month: Permanent fix deployed + post-mortem documented
```

---

## 5. GUARDRAIL REVIEW CADENCE

| When | What | Who |
|------|------|-----|
| **Daily** | Dashboard check (automated alerts for violations) | System → PM |
| **Weekly** | Soft guardrail trend review | PM + DS |
| **Monthly** | Full guardrail review + bias metrics | Risk Committee |
| **Quarterly** | Guardrail limit review (should limits change?) | Risk Committee + Compliance |
| **On model retrain** | All model guardrails (G-M1/M2/M3) re-validated | DS + Risk Manager |
| **On regulatory change** | Compliance guardrails (G-C1-C7) reviewed | Compliance + Legal |

---

## 6. GUARDRAIL vs TARGET vs ALERT — Clarification

| | Target | Soft Guardrail 🟡 | Hard Guardrail 🔴 |
|--|--------|-------------------|-------------------|
| **What** | Goal to achieve | Boundary to watch | Boundary NEVER to cross |
| **Miss = ?** | OK, keep trying | Investigate + plan fix (1 month) | Immediate action (4 hours) |
| **Example NPL** | Target 2.8% | Soft ≤ 3.5% | Hard ≤ 4.0% |
| **Analogy** | "Aim for A grade" | "Don't drop below B" | "Fail = expelled" |

---

## Tracking

- [ ] Risk Manager đã approve risk guardrails (G-R1 through G-R4)?
- [ ] Head of Cards đã approve business guardrails (G-B1 through G-B3)?
- [ ] Compliance đã approve compliance guardrails (G-C1 through G-C7)?
- [ ] Bias thresholds (5pp/8pp/10pp soft, 8pp/12pp/15pp hard) — đã discuss?
- [ ] SEV-1 response playbook — đã rehearse? Who's on-call?
- [ ] Dashboard — build timeline? (Target: before shadow testing Week 37)
- [ ] Override rate guardrail (G-O1 ≤ 60%, G-O2 ≥ 2%) — Risk Manager comfortable with floor?

---

## Ghi Chú

1. **Guardrail limits are proposed** — Risk Committee must formally approve. PM proposes, Committee decides.
2. **Compliance guardrails (G-C1/C2/C3) = ZERO TOLERANCE** — no soft limit. Audit trail, adverse action, AI label must be 100%. Any failure = system bug, not acceptable deviation.
3. **Bias guardrails (G-C4/C5/C6)** — hard limits (8pp/12pp/15pp) wider than soft (5pp/8pp/10pp) intentionally. Some gap reflects real risk differences. Hard limit = "definitely bias, not just risk difference."
4. **Override rate has both ceiling AND floor** (G-O1 + G-O2). Too high = model wrong. Too low = CO rubber-stamping. Both are problems.
5. **Cross-reference:** kpi-tree.md (metric hierarchy), metric-definitions.md (how to calculate), metric-conflict-memo.md (stakeholder tensions), threshold-framework.md (threshold guardrails), sensitivity-analysis.md (what happens when guardrails violated).