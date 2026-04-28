# Sensitivity Analysis — AI-CRDS Threshold Scenarios
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Trả lời: "Nếu threshold sai, business impact là bao nhiêu?" Mỗi scenario có: quantified impact, probability, detection lag, recovery time. Dùng cho C-level proposal (Week 11) — show chúng ta đã anticipate risks.

---

## 1. FOUR THRESHOLD ERROR SCENARIOS

### Overview

| Scenario | Error | Direction | Core risk |
|---------|-------|----------|----------|
| **A** | TH_high quá cao (0.85 thay vì 0.75) | Over-conservative | Revenue loss — reject quá nhiều good customers |
| **B** | TH_high quá thấp (0.65 thay vì 0.75) | Over-aggressive | Credit loss — approve quá nhiều bad customers |
| **C** | TH_fraud quá sensitive (0.30 thay vì 0.40) | Over-catching | Customer experience damage — flag quá nhiều legit customers |
| **D** | TH_fraud quá lax (0.60 thay vì 0.40) | Under-catching | Fraud loss — miss fraud cases |

---

## 2. SCENARIO A — TH_HIGH QUÁ CAO (0.85 thay vì 0.75)

### What happens

```
TH_high = 0.85 (should be 0.75)
    │
    ├── State 1 (auto-route): 37% → 15% (-22pp)
    │   → 660 fewer apps/tháng in batch queue
    │
    ├── State 2 (full review): 45% → 67% (+22pp)
    │   → 660 more apps/tháng need full CO review
    │
    ├── CO overload: 4.6 FTE → 6.0 FTE needed (+1.4 FTE)
    │   → If team not scaled: SLA miss, queue backlog
    │
    ├── More CO fatigue → more inconsistent decisions
    │   → Some good applicants rejected by tired/rushed CO
    │
    └── Approval rate: 60% → ~53% (-7pp)
        → ~250 fewer approvals/tháng
        → Revenue loss
```

### Quantified Impact

| Metric | At TH=0.75 (correct) | At TH=0.85 (too high) | Delta | Annual impact |
|--------|---------------------|---------------------|-------|-------------|
| State 1 volume/tháng | 1,110 | 450 | -660 | |
| State 2 volume/tháng | 1,350 | 2,010 | +660 | |
| CO FTE needed | 4.6 | 6.0 | +1.4 | +302M VND (salary cost) |
| Approval rate | 60% | 53% | -7pp | |
| Approved cards/tháng | 1,800 | 1,590 | -210 | |
| **Revenue lost** (LTV per card) | — | — | 210 × 36M | **-90.7 tỷ VND/năm** |
| NPL rate | 3.0-3.5% | 2.5-3.0% | -0.5pp | +10.1 tỷ NPL saving |
| **Net impact** | | | | **-80.6 tỷ VND/năm** |

### Risk Assessment

| Attribute | Value |
|-----------|-------|
| **Probability of error** | 🟡 Medium (20-30%). Risk Committee may choose 0.80-0.85 if very risk-averse or after NPL spike scare. |
| **Detection lag** | **2-4 weeks.** Visible quickly: approval rate drops, State 2 queue grows, SLA breach rate rises. Dashboard metrics will flag. |
| **Business detection signals** | Approval rate < 55%. SLA breach > 15%. CO overtime requests. Head of Cards complaint about "too few approvals." |
| **Recovery time** | **1-2 weeks.** Lower TH_high back to 0.75. Risk Committee emergency approval (±0.05 authority). Effect immediate after deploy. |
| **Severity** | 🔴 **High.** Revenue impact (-80.6 tỷ/năm) far exceeds NPL saving (+10.1 tỷ). Net negative. |

### Mitigation

| # | Action | When |
|---|--------|------|
| 1 | Approval rate floor alarm: < 55% → auto-alert Risk Manager | Dashboard (always on) |
| 2 | SLA breach rate alarm: > 10% → investigate threshold | Dashboard (always on) |
| 3 | Quarterly threshold review mandatory | Governance process |
| 4 | Emergency threshold change: Risk Manager can lower ±0.05 within 24h | Governance process |

---

## 3. SCENARIO B — TH_HIGH QUÁ THẤP (0.65 thay vì 0.75)

### What happens

```
TH_high = 0.65 (should be 0.75)
    │
    ├── State 1 (auto-route): 37% → 55% (+18pp)
    │   → 540 more apps/tháng in batch queue
    │
    ├── Batch queue includes riskier applicants
    │   → CO batch-confirm in 3-5 min → may not catch risky ones
    │   → "Rubber stamp" risk: CO trusts AI too much for borderline cases
    │
    ├── NPL rate: 3.0-3.5% → 3.7-4.2% (+0.5-1.0pp)
    │   → More defaults 3-12 months later
    │
    └── Approval rate: 60% → ~65% (+5pp)
        → More revenue short-term
        → More losses medium-term
```

### Quantified Impact

| Metric | At TH=0.75 (correct) | At TH=0.65 (too low) | Delta | Annual impact |
|--------|---------------------|---------------------|-------|-------------|
| State 1 volume/tháng | 1,110 | 1,650 | +540 | |
| Approval rate | 60% | 65% | +5pp | |
| Approved cards/tháng | 1,800 | 1,950 | +150 | |
| Revenue gained | — | — | 150 × 36M LTV | +64.8 tỷ (short-term) |
| NPL rate | 3.0-3.5% | 3.7-4.2% | +0.5-1.0pp | |
| Additional defaults/tháng | 63 | 78 (+15) | +15 | |
| **Additional credit loss** | — | — | 15 × 1.225M × 12 | **-22.1 tỷ VND/năm** |
| CO cost saving | 2.95 tỷ | 2.32 tỷ | -0.63 tỷ | +0.63 tỷ saving |
| **Net short-term** (Year 1) | | | | **+43.3 tỷ** (looks good) |
| **Net medium-term** (Year 2-3, NPL catches up) | | | | **-22.1 tỷ/năm** (bad) |

### The Trap: Short-term Gain, Medium-term Pain

```
Year 1:  Revenue ↑ (+64.8 tỷ) > Credit loss ↑ (+22.1 tỷ)  → Looks GOOD
Year 2:  Revenue stable. Credit losses compound.            → Starts HURTING
Year 3:  NPL spike visible. Regulator attention.            → PROBLEM

⚠️ This is the classic "easy credit" trap.
   Revenue appears immediately. Losses appear 6-18 months later.
```

### Risk Assessment

| Attribute | Value |
|-----------|-------|
| **Probability of error** | 🟡 Medium (20-30%). Head of Cards may push for lower threshold ("approve more, grow portfolio"). Business pressure. |
| **Detection lag** | **🔴 3-12 months.** This is the dangerous one. Revenue increase visible immediately (approval rate up). NPL increase visible only after 90+ days (DPD 90 definition). Full impact: 6-12 months. |
| **Business detection signals** | NPL trending up (monthly monitoring). DPD 30+ trending up (early warning, 1-3 months). Override rate dropping (CO rubber-stamping). Vintage analysis shows newer cohorts worse. |
| **Recovery time** | **3-6 months.** Raise TH_high back → stops new bad approvals. But existing bad loans take 6-12 months to fully manifest as NPL. Portfolio damage already done for approved cohort. |
| **Severity** | 🔴 **High.** Delayed detection + slow recovery = most dangerous scenario. Potential regulatory scrutiny if NPL spikes visibly. |

### Mitigation

| # | Action | When |
|---|--------|------|
| 1 | **Early warning: DPD 30+ monitoring** by approval cohort (monthly vintage) | Monthly from Week 45+ |
| 2 | NPL trend alarm: NPL > 3.5% (baseline) → auto-alert Risk Manager | Monthly |
| 3 | **Batch review guardrail:** Cap batch size (max X per confirm action) → force CO to actually look | Design (Week 9) |
| 4 | CO training: "Batch confirm ≠ auto-approve. You are still liable." | Training (Week 34) |
| 5 | TH_high floor: Risk Committee sets minimum TH_high (e.g., ≥ 0.70) | Governance |
| 6 | Quarterly vintage analysis: compare NPL by TH_high at time of approval | Analytics (Week 47+) |

---

## 4. SCENARIO C — TH_FRAUD QUÁ SENSITIVE (0.30 thay vì 0.40)

### What happens

```
TH_fraud_elevated = 0.30 (should be 0.40)
    │
    ├── State 3 (fraud review): 100 → 200 cases/tháng (+100)
    │   → 100 additional false alarms/tháng
    │
    ├── Fraud team overload: 0.4 FTE → 0.8 FTE needed
    │   → If not scaled: SLA breach on State 3 (4h SLA)
    │   → Real fraud cases delayed because queue congested
    │
    ├── Good customers flagged as fraud:
    │   → 100 × 40M = 4.0 tỷ/năm additional false alarm cost
    │   → Customer experience: accused of fraud → angry → churn → WOM damage
    │
    └── Marginal fraud caught: ~2 additional/tháng
        → 2 × 50M × 12 = 1.2 tỷ/năm fraud saved
```

### Quantified Impact

| Metric | At TH=0.40 (correct) | At TH=0.30 (too sensitive) | Delta | Annual impact |
|--------|---------------------|--------------------------|-------|-------------|
| State 3 volume/tháng | 100 | 200 | +100 | |
| True fraud caught/tháng | 22 | 24 | +2 | +1.2 tỷ saved |
| False alarms/tháng | 78 | 176 | +98 | |
| **False alarm cost** | 3.74 tỷ/năm | 8.45 tỷ/năm | — | **-4.70 tỷ/năm** |
| Fraud team FTE | 0.4 | 0.8 | +0.4 | -86M VND (salary) |
| Customer complaints (fraud flag) | ~10/tháng | ~25/tháng | +15 | Reputation damage (unquantified) |
| **Net impact** | | | | **-3.6 tỷ VND/năm** |

### Risk Assessment

| Attribute | Value |
|-----------|-------|
| **Probability of error** | 🟡 Medium (15-25%). After a fraud incident, knee-jerk reaction to tighten fraud threshold. "Better safe than sorry." |
| **Detection lag** | **1-2 weeks.** Quick to detect: State 3 queue doubles, false alarm rate spikes, customer complaints increase, fraud team overtime. |
| **Business detection signals** | State 3 volume > 2x normal. Fraud false alarm rate > 70%. Customer complaints about "identity verification issues." |
| **Recovery time** | **1-2 days.** Raise TH_fraud back to 0.40. Immediate effect. No lingering damage (unlike NPL scenarios). |
| **Severity** | 🟡 **Medium.** Financial impact (-3.6 tỷ) moderate. Main risk: customer experience damage and fraud team burnout. Easily reversible. |

### Mitigation

| # | Action | When |
|---|--------|------|
| 1 | State 3 volume alarm: > 150% normal → investigate | Dashboard |
| 2 | False alarm rate monitoring: > 80% → threshold too low | Monthly |
| 3 | Customer complaint tracking: fraud-related complaints > 20/month → review | Monthly |
| 4 | Fraud team capacity planning: if State 3 > X → temp allocation | Ops |

---

## 5. SCENARIO D — TH_FRAUD QUÁ LAX (0.60 thay vì 0.40)

### What happens

```
TH_fraud_elevated = 0.60 (should be 0.40)
    │
    ├── State 3 (fraud review): 100 → 40 cases/tháng (-60)
    │   → Many fraud cases NOT flagged for priority review
    │   → Fraud cases mixed into State 1/2 → CO batch/standard review
    │   → CO unlikely to catch sophisticated fraud in normal review
    │
    ├── Fraud slip-through: 
    │   → 24 fraud/tháng (base) → only 12 caught by fraud team
    │   → 12 additional fraud cases lọt qua scoring → approved
    │
    └── Impact:
        → 12 × 50M = 600M/tháng additional fraud loss
        → SIMO reporting failures (TT 45/2025 compliance risk)
        → Fraudsters learn system is weak → share method → more fraud
```

### Quantified Impact

| Metric | At TH=0.40 (correct) | At TH=0.60 (too lax) | Delta | Annual impact |
|--------|---------------------|---------------------|-------|-------------|
| State 3 volume/tháng | 100 | 40 | -60 | |
| Fraud caught by fraud team | 22/tháng | 12/tháng | -10 | |
| **Additional fraud slip-through** | 2/tháng (base miss) | 12/tháng | +10 | |
| **Additional fraud loss** | — | — | 10 × 50M × 12 | **-6.0 tỷ VND/năm** |
| Fraud team cost saving | — | — | -0.3 FTE | +65M (negligible) |
| SIMO compliance risk | Low | 🔴 High | — | Regulatory fine risk (unknown) |
| Fraud ring formation risk | Low | 🔴 High | — | Exponential loss if unchecked |
| **Net impact** | | | | **-6.0 tỷ VND/năm + regulatory + exponential risk** |

### The Compounding Problem

```
Month 1-3:  10 extra fraud/month slip through → 1.5 tỷ loss
Month 4-6:  Fraudsters share method → 15 extra → 2.25 tỷ
Month 7-12: Fraud ring forms → 25+ extra → exponential growth
            + SIMO non-compliance → SBV inquiry
            + Media coverage risk if systematic fraud discovered

⚠️ Fraud compounds. Credit loss is linear. Fraud is exponential if unchecked.
```

### Risk Assessment

| Attribute | Value |
|-----------|-------|
| **Probability of error** | 🟢 Low (10-15%). Unlikely — fraud threshold usually set conservatively. But possible if: (a) false alarm complaints pressure team to relax, (b) cost-cutting reduces fraud team → raise threshold to reduce queue. |
| **Detection lag** | **🔴 1-3 months.** Fraud losses appear gradually. Individual cases look like credit losses (default), not fraud, until pattern emerges. Fraud team may not notice they're catching fewer cases (reduced volume could look like "fraud is decreasing"). |
| **Business detection signals** | State 3 volume unexpectedly low. Post-approval fraud discovery rate increasing. Charge-off patterns inconsistent with credit risk (full limit maxed immediately → classic fraud pattern). SIMO reports decreasing despite stable environment. |
| **Recovery time** | **1-2 days** to fix threshold. **3-6 months** to recover: (a) identify which approved applicants were fraud, (b) block accounts, (c) recover funds (unlikely for CC), (d) file SIMO reports retroactively, (e) address regulatory inquiry. |
| **Severity** | 🔴 **Very High.** Financial loss + regulatory risk + reputation + exponential compounding. Most dangerous fraud scenario. |

### Mitigation

| # | Action | When |
|---|--------|------|
| 1 | **Fraud detection rate monitoring:** if State 3 → confirmed fraud ratio changes significantly → investigate threshold | Monthly |
| 2 | **Post-approval fraud detection:** monitor for fraud patterns in approved accounts (full limit usage in first month, unusual transaction patterns) | Ongoing (Week 45+) |
| 3 | **SIMO reporting reconciliation:** SIMO reports filed vs fraud detected — any gap? | Monthly |
| 4 | **TH_fraud ceiling:** Risk Committee sets maximum TH_fraud (e.g., ≤ 0.50) — cannot relax beyond this | Governance |
| 5 | **Fraud team independence:** fraud threshold changes require Fraud team + Risk Manager dual approval — not just PM/business | Governance |

---

## 6. SCENARIO COMPARISON MATRIX

| | **A: TH_high too HIGH** | **B: TH_high too LOW** | **C: TH_fraud too SENSITIVE** | **D: TH_fraud too LAX** |
|--|----------------------|---------------------|---------------------------|---------------------|
| **Annual cost** | -80.6 tỷ (revenue loss) | -22.1 tỷ (credit loss, delayed) | -3.6 tỷ (false alarms) | -6.0 tỷ + exponential |
| **Probability** | 🟡 20-30% | 🟡 20-30% | 🟡 15-25% | 🟢 10-15% |
| **Detection lag** | 2-4 weeks (fast) | 🔴 3-12 months (slow!) | 1-2 weeks (fast) | 🔴 1-3 months (slow) |
| **Recovery time** | 1-2 weeks | 3-6 months | 1-2 days | 1-2 days (threshold) + 3-6 months (damage) |
| **Severity** | 🔴 High | 🔴 High (delayed) | 🟡 Medium | 🔴 Very High (exponential) |
| **Main victim** | Bank (revenue) + Customer (denied) | Bank (credit loss) + Regulator (NPL) | Customer (experience) + Fraud team (overload) | Bank (fraud loss) + Regulator (SIMO) |
| **Reversibility** | ✅ Easy | ⚠️ Hard (damage done) | ✅ Easy | ⚠️ Hard (fraud compounds) |

### Risk-Ranked (highest to lowest)

| Rank | Scenario | Why most dangerous |
|------|---------|-------------------|
| **#1** | **B: TH_high too low** | Slow detection (3-12 months) + hard to reverse (portfolio damage). The "easy credit" trap. |
| **#2** | **D: TH_fraud too lax** | Exponential compounding + regulatory risk. Low probability but catastrophic if happens. |
| **#3** | **A: TH_high too high** | Large financial impact (-80.6 tỷ) but fast detection + easy fix. |
| **#4** | **C: TH_fraud too sensitive** | Smallest financial impact. Fast detection + easy fix. Main cost = customer experience. |

---

## 7. DETECTION & MONITORING FRAMEWORK

### 7.1 Early Warning Dashboard

| Metric | Normal range | Warning | Critical | Scenario detected |
|--------|-------------|---------|---------|------------------|
| Approval rate | 55-65% | < 55% or > 65% | < 50% or > 70% | A (low) or B (high) |
| State 1 % | 30-45% | < 25% or > 50% | < 15% or > 60% | A (low) or B (high) |
| State 3 volume/tháng | 70-130 | < 50 or > 180 | < 30 or > 250 | D (low) or C (high) |
| SLA breach rate | < 5% | 5-10% | > 15% | A or C (overload) |
| NPL trend (monthly) | Stable ± 0.3pp | Up > 0.3pp | Up > 0.5pp | B (delayed signal) |
| DPD 30+ trend (monthly) | Stable ± 1pp | Up > 1pp | Up > 2pp | B (early warning) |
| Fraud false alarm rate | 60-80% of State 3 | > 85% | > 90% | C |
| Fraud detection rate | Stable ± 10% | Drop > 20% | Drop > 40% | D |
| Override rate | 10-20% | > 30% | > 50% | Model misalignment (any) |
| Customer complaints/week | < 5 | 5-10 | > 15 | C or A |

### 7.2 Detection Lag Timeline

```
Event: Threshold set incorrectly
    │
    ├── T+0: Threshold deployed
    │
    ├── T+1 day:
    │   ├── State distribution change visible (A, B, C detectable)
    │   └── SLA impact visible (A, C detectable)
    │
    ├── T+1-2 weeks:
    │   ├── Approval rate change confirmed (A, B)
    │   ├── Fraud queue anomaly confirmed (C, D)
    │   └── Customer complaints start arriving (A, C)
    │
    ├── T+1-3 months:
    │   ├── DPD 30+ early warning for Scenario B
    │   └── Post-approval fraud patterns for Scenario D
    │
    ├── T+3-6 months:
    │   ├── NPL impact visible for Scenario B (DPD 90+)
    │   └── Fraud compounding visible for Scenario D
    │
    └── T+6-12 months:
        └── Full vintage analysis confirms Scenario B damage
```

---

## 8. RECOMMENDED SAFEGUARDS

### 8.1 Threshold Guardrails (Hard Limits)

| Threshold | Floor | Ceiling | Rationale | Who sets |
|----------|-------|---------|----------|---------|
| TH_high | **0.70** | **0.85** | Below 0.70 = NPL risk. Above 0.85 = insufficient ops benefit. | Risk Committee |
| TH_fraud_elevated | **0.30** | **0.50** | Below 0.30 = false alarm overload. Above 0.50 = miss too much fraud. | Risk Committee + Fraud team |
| TH_confidence | **0.50** | **0.70** | Below 0.50 = too many escalations. Above 0.70 = hiding uncertainty. | Risk Committee |

### 8.2 Change Authority

| Change magnitude | Who can approve | Timeline |
|-----------------|----------------|---------|
| ±0.02 (fine tuning) | Risk Manager alone | 24h |
| ±0.05 | Risk Manager (emergency) → ratify at Committee | 24h deploy, ratify within 2 weeks |
| > ±0.05 | Risk Committee only | Scheduled meeting (1-2 weeks) |
| Beyond guardrails | C-level + Risk Committee | Special meeting required |

### 8.3 Mandatory Review Triggers

| Trigger | Review scope | SLA |
|---------|-------------|-----|
| NPL > baseline + 0.5pp for 2 consecutive months | Full threshold review | 2 weeks |
| Approval rate change > 5pp from target | TH_high review | 1 week |
| Fraud detection rate drop > 20% | TH_fraud review | 48 hours |
| Override rate > 40% for 2 weeks | Model + threshold review | 2 weeks |
| SBV inquiry about NPL or fraud | Immediate threshold freeze + review | 24 hours |
| Model retrain deployed | All thresholds mandatory review | Pre-deploy (gate) |

---

## 9. C-LEVEL PRESENTATION — Risk Communication

### Key Message

```
┌─────────────────────────────────────────────────────────┐
│   "We've analyzed 4 ways threshold can go wrong.         │
│    The most dangerous: setting it too low (easy credit). │
│    Why? Losses hide for 6-12 months, then appear.        │
│                                                          │
│    Our safeguards:                                       │
│    ✓ Hard guardrails (can't go below 0.70 or above 0.85)│
│    ✓ Monthly NPL monitoring by approval cohort           │
│    ✓ Early warning: DPD 30+ trending before NPL hits     │
│    ✓ Emergency change: Risk Manager can adjust in 24h    │
│    ✓ Kill switch: pause AI entirely if needed             │
│                                                          │
│    Starting at TH_high = 0.75: conservative, safe,       │
│    with room to optimize in both directions."             │
└─────────────────────────────────────────────────────────┘
```

---

## Tracking — Tự hỏi cuối tuần

- [ ] Cost-of-error table đã cross-check với W4 damage model chưa? ✅ (Section 2-5 sử dụng cùng cost inputs)
- [ ] FP/FN ratio (29:1) đã discuss với Risk Manager chưa?
- [ ] Threshold governance process đã align với Risk Committee chưa?
- [ ] Approval rate floor (business requirement minimum) là bao nhiêu? (❓ cần Head of Cards confirm)
- [ ] Risk Committee meeting đã schedule chưa? (Cần trước Week 11)
- [ ] Shadow testing plan (Week 37) đã được reference chưa? ✅ (detection lag analysis references shadow testing)
- [ ] Guardrails [0.70, 0.85] — Risk Committee đồng ý hard limits?
- [ ] Scenario B (TH too low) — detection lag 3-12 months — Risk Manager aware?

---

## Ghi Chú & Limitations

1. **Tất cả quantified impacts là ước tính** dựa trên assumed score distribution + cost-of-error numbers (damage-model.md). Real impacts sẽ khác.
2. **Detection lag cho Scenario B (3-12 months) là risk thực** — không phải theoretical. Nhiều bank đã gặp "easy credit" trap khi relax lending standards. DPD 30+ early warning giảm lag xuống 1-3 months nhưng vẫn không real-time.
3. **Scenario D (fraud lax) exponential compounding** là worst case. Thực tế, other controls (eKYC, SIMO, CO review) sẽ catch một số fraud. Nhưng AI fraud threshold là layer quan trọng nhất cho origination fraud.
4. **Probability estimates (10-30%)** là subjective. Không có data để calibrate. Dùng để rank scenarios, không phải precision.
5. **Cross-reference:** threshold-framework.md (threshold governance), cost-of-error-table.md (cost inputs), approval-rate-curve.md (approval rate impact), assumptions-log.md (underlying assumptions).