# Trust Calibration Guide — CO × AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

CO phải ở "calibrated trust zone" — không quá tin AI (rubber-stamping), không quá ngờ (ignoring AI). Document này define 3 failure modes + prevention + CO onboarding sequence.

---

## 1. THREE ZONES — Trust Spectrum

```
Trust Spectrum:

UNDER-TRUST          CALIBRATED TRUST           OVER-TRUST
(ignoring AI)        (target zone)              (rubber-stamping)
     │                    │                          │
     ▼                    ▼                          ▼
├─────────────────┤ ├──────────────────────┤ ├───────────────────┤
│ Override >50%   │ │  Override 10-20%      │ │ Override <5%      │
│ AI panel ignored│ │  AI = starting point  │ │ Review <2 min     │
│ No time saving  │ │  CO adds judgment     │ │ Never questions AI│
│ AI waste $$$    │ │  Both add value       │ │ AI errors missed  │
├─────────────────┤ ├──────────────────────┤ ├───────────────────┤
     ❌ BAD              ✅ GOOD                   ❌ BAD
```

---

## 2. FAILURE MODE 1 — OVER-TRUST (Rubber-Stamping)

### Signs

| Signal | Detection method | Threshold |
|--------|-----------------|----------|
| Override rate extremely low | L3-W2 monitoring | < 5% sustained 2 weeks |
| Review time too fast | `co_review_time_seconds` | State 1 batch: < 30 sec/record. State 2: < 3 min. |
| Never expands detail in batch | UI interaction log | < 20% records expanded in batch review |
| Never uses escalate/need-info | State 4/5 from CO = 0 | 0 escalations in 1 month |
| Agrees with AI 100% | Override rate = 0% | 0 overrides in 2+ weeks |

### Risk

- CO không catch AI errors → NPL spike (AI wrong cases go undetected)
- Violated spirit of human-in-the-loop (Luật AI 134/2025 Điều 4)
- If SBV inspects: "CO reviewed this in 20 seconds — was that a real review?"
- Model errors compound: no human correction signal → model doesn't improve

### Prevention Measures

| # | Measure | Implementation | When |
|---|---------|---------------|------|
| 1 | **Spot audit** | Random sample 10 batch confirmations/week. Supervisor reviews: did CO check key fields? | Weekly (Supervisor) |
| 2 | **Review time alert** | System alert: avg State 1 review time < 2 min → Supervisor notified | Real-time (dashboard) |
| 3 | **Monthly "AI was wrong" session** | Show CO 5-10 cases where AI recommended approve but customer defaulted or was fraud. "Here's what AI missed — this is why your review matters." | Monthly (PM + DS facilitate) |
| 4 | **No "select all"** in batch UI | Force CO to check each row individually in batch review. Cannot select all → confirm all. | Design (ux-wireframes-notes.md) |
| 5 | **Mandatory expand** for ≥20% of batch | System enforces: CO must expand detail for at least 2/10 records in batch before confirm enabled. Random selection. | Design (Phase 1+) |
| 6 | **Override challenge** | Monthly: DS picks 5 cases where AI was borderline (confidence 0.60-0.70). Ask CO: "Would you override any of these?" If CO says "no override on any" → possible over-trust signal. | Monthly (DS + Supervisor) |

---

## 3. FAILURE MODE 2 — UNDER-TRUST (Ignoring AI)

### Signs

| Signal | Detection method | Threshold |
|--------|-----------------|----------|
| Override rate extremely high | L3-W2 monitoring | > 50% sustained 2 weeks |
| AI panel not viewed | UI interaction log (future) | CO clicks decision without scrolling to AI panel |
| Takes same time as before AI | `co_review_time_seconds` State 2 | No reduction from as-is baseline (still 30-35 min) |
| Doesn't use AI explanation | CO notes don't reference AI factors | Manual review of CO notes |
| Escalation rate very high | L3-W4 | > 25% (CO doesn't trust any AI output, escalates everything) |

### Risk

- AI adds no operational value → investment wasted → CO capacity not freed
- C-level will question ROI: "We spent 10 tỷ and COs ignore the system?"
- Break-even pushed back indefinitely
- COs overworked (same workload as before AI)

### Prevention Measures

| # | Measure | Implementation | When |
|---|---------|---------------|------|
| 1 | **Show AI track record** | After 1 month: show CO statistics. "In cases similar to this, AI was correct 87% of the time." Build trust with data. | Phase 1+ (after shadow testing data available) |
| 2 | **Override outcome feedback** | Monthly: show CO their override outcomes. "Of 20 cases you overrode-to-approve: 3 defaulted (15%). AI-approved cases: 3.5% default. Your overrides performed X." | Monthly (DS report) |
| 3 | **Gradual introduction** (onboarding) | Don't force AI immediately. 4-week onboarding (Section 5). CO learns to trust gradually. | Onboarding |
| 4 | **Address specific fears** | Common fears: "AI will replace me" → NO, CO still signs. "AI is wrong" → show accuracy data. "I don't understand AI" → training on what AI does (simple language). | Training (Week 34) |
| 5 | **CO involvement in model improvement** | When CO override leads to better outcome → celebrate. "Your override helped us identify a new pattern. Thank you." CO feels valued, not replaced. | Ongoing |
| 6 | **Peer comparison** (gentle) | "Your override rate is 45%. Team average is 16%. Other COs find AI helpful for X. Would you like to discuss?" Non-punitive. | Monthly 1-on-1 (Supervisor) |

---

## 4. TARGET ZONE — CALIBRATED TRUST

### Behavioral Indicators

| Behavior | What it looks like | Metric proxy |
|---------|-------------------|-------------|
| **Uses AI as starting point** | CO reads AI score + explanation first, then reviews raw data. AI directs attention to key areas. | Review time reduced 30-50% from baseline |
| **Overrides with specific reason** | CO overrides when they have additional information AI doesn't have. Reason = specific, not "I disagree." | Override reason: REL/INC/EMP (specific) > OTH (vague) |
| **Questions AI when signals conflict** | Score says approve but CO sees red flag → escalates or investigates further instead of blindly following either. | Escalation rate 10-15% |
| **Acknowledges AI accuracy** | CO says "AI was right on this one, I would have missed it." Not adversarial relationship. | Qualitative (interview feedback) |
| **Reports AI errors** | When CO believes AI output is wrong, selects "AI error suspected" → system logs → DS investigates. | Override reason ERR > 0 but < 10% of overrides |
| **Batch reviews with attention** | In State 1: CO expands 30-50% of records, spends 3-5 min per batch of 10. Not instant confirm. | Review time 3-5 min/batch. Expand rate 30-50%. |

### Quantitative Targets

| Metric | Under-trust | **Calibrated (target)** | Over-trust |
|--------|------------|----------------------|-----------|
| Override rate | > 40% | **10-20%** | < 5% |
| Avg review time S1 (per record) | N/A (not using batch) | **2-4 min** | < 30 sec |
| Avg review time S2 | > 30 min (same as manual) | **15-25 min** | < 5 min |
| Expand rate (S1 batch) | N/A | **30-50%** of records | < 10% |
| Override direction | All directions | **60-70% approve, 30-40% reject** | N/A |
| Escalation rate | > 25% | **10-15%** | < 3% |

---

## 5. CO ONBOARDING SEQUENCE — 4 Weeks

### Week 1 — Shadow Mode (AI observes, CO decides as usual)

```
Purpose: CO sees AI scores but doesn't need to use them.
Build familiarity without pressure.

Setup:
├── AI scoring runs on all applications
├── AI panel visible but labeled "Preview — cho tham khảo"
├── CO decides as normal (full manual review)
├── AI output NOT part of decision (no audit trail impact)
└── CO encouraged to note: "Tôi đồng ý/không đồng ý với AI"

Session end-of-week:
├── Group discussion: "AI đúng bao nhiêu lần?"
├── Show aggregate: AI accuracy vs CO decisions
└── Address questions, concerns, fears
```

### Week 2 — Dual Review (CO reviews first, reveals AI after)

```
Purpose: CO forms own judgment first, then compares with AI.
Prevents anchoring bias (CO influenced by AI score before reviewing).

Setup:
├── CO receives application WITHOUT AI panel visible
├── CO makes preliminary assessment (approve/reject/unsure)
├── CO clicks "Reveal AI Assessment" → AI panel appears
├── CO compares: "My assessment vs AI — same or different?"
├── CO makes final decision (can adjust after seeing AI)
└── Log: CO initial assessment + AI recommendation + final decision

Session end-of-week:
├── Analyze: when did CO and AI agree/disagree?
├── When CO changed mind after seeing AI → was it good change?
├── When CO stuck with original despite AI → what was the outcome?
└── Build CO confidence: "My judgment + AI = better than either alone"
```

### Week 3 — AI-First Mode (AI shows first, CO reviews with AI context)

```
Purpose: CO uses AI as starting point. Standard operational mode.

Setup:
├── AI panel visible from start (like production)
├── CO reviews with AI score + explanation
├── State routing active (S1/S2/S3/S4/S5)
├── Batch review enabled for State 1
├── Override flow active with logging
└── Supervisor monitoring active

Session end-of-week:
├── Review: override rate, review time, batch behavior
├── Individual feedback per CO
├── Address any trust issues identified
└── Fine-tune: any UI changes needed?
```

### Week 4+ — Standard Operation

```
Purpose: Full production mode. AI-CRDS as designed.

Setup:
├── All features active
├── Full monitoring dashboard
├── Guardrails enforced
├── Override governance active
└── Monthly calibration sessions continue

Ongoing:
├── Monthly "AI was wrong" sessions
├── Monthly override outcome feedback
├── Quarterly trust assessment
└── Annual CO satisfaction survey
```

### Onboarding Timeline

```
Week 1          Week 2          Week 3          Week 4+
Shadow          Dual Review     AI-First        Standard
──────────── ──────────────── ──────────── ────────────────
CO decides      CO first,       AI shows,       Full
normally.       then reveals    CO reviews      production.
AI observes.    AI. Compare.    with AI.        Monitor +
                                                calibrate.

Trust level:
Low ─────── Building ─────── Growing ─────── Calibrated
```

---

## 6. ONGOING CALIBRATION — Post-Onboarding

### Monthly Calibration Session (30 min, facilitated by PM + DS)

```
Agenda:
1. Override outcome review (10 min)
   - Show: "Last month you overrode X cases."
   - Outcome: "Y% of your overrides → good outcome, Z% → bad"
   - Compare: team average, AI-only outcome
   - Non-punitive. Learning opportunity.

2. "AI was wrong" cases (10 min)
   - Show: 3-5 cases where AI was clearly wrong
   - Discuss: what did CO see that AI missed?
   - Feeds into model improvement

3. "AI was right, you were wrong" cases (5 min)
   - Show: 2-3 cases where CO overrode AI and outcome was bad
   - Discuss: what could CO have done differently?
   - Gentle — framed as learning, not blame

4. Questions / feedback (5 min)
   - CO: "I wish AI could show me X"
   - CO: "AI keeps getting Y wrong"
   - → Action items for DS/PM
```

### Quarterly Trust Assessment

| Question (survey, anonymous) | Scale | Red flag |
|-----------------------------|-------|---------|
| "AI scoring giúp tôi quyết định tốt hơn" | 1-5 | < 3 avg → under-trust issue |
| "Tôi hiểu tại sao AI đưa ra score này" | 1-5 | < 3 avg → explainability issue |
| "Tôi cảm thấy thoải mái override AI khi cần" | 1-5 | < 3 avg → override governance too strict? |
| "AI tiết kiệm thời gian cho tôi" | 1-5 | < 3 avg → workflow not optimized |
| "Tôi lo AI sẽ thay thế công việc của tôi" | 1-5 | > 3 avg → trust/job security issue → address |

---

## 7. MESSAGING FRAMEWORK — How to Talk to COs About AI

### DO say

| Message | Why |
|---------|-----|
| "AI giúp anh/chị tập trung vào cases quan trọng" | Framing: AI = assistant, not replacement |
| "Anh/chị là người quyết định cuối cùng — luôn luôn" | Reinforce authority. Legal requirement. |
| "Override AI là quyền của anh/chị. Hãy override khi anh/chị có thêm thông tin" | Normalize override. Not rebellion. |
| "AI mạnh ở consistency. Anh/chị mạnh ở judgment. Kết hợp = tốt hơn cả hai" | Complementary, not competitive. |
| "Feedback của anh/chị giúp AI tốt hơn" | CO feels valued. True (feedback loop). |

### DON'T say

| Message | Why not |
|---------|---------|
| ~~"AI chính xác hơn con người"~~ | Creates adversarial dynamic. CO feels threatened. |
| ~~"AI sẽ giúp giảm headcount"~~ | Job security fear → under-trust → sabotage risk. |
| ~~"Hãy tin AI"~~ | Trust is earned, not commanded. Sounds like propaganda. |
| ~~"Override rate của anh/chị cao nhất team"~~ | Punitive framing. Use 1-on-1, not public. |
| ~~"AI không bao giờ sai"~~ | Untrue. Destroys trust when first error discovered. |

---

## Tracking

- [ ] Trust calibration guide shared with Risk Manager?
- [ ] Onboarding sequence feasible (4 weeks before production)?
- [ ] Monthly calibration sessions: who facilitates? Calendar blocked?
- [ ] "AI was wrong" case library: DS started collecting?
- [ ] CO satisfaction survey drafted?
- [ ] Messaging framework reviewed with HR/Change Management?

---

## Ghi Chú

1. **Week 2 (Dual Review) is most important onboarding phase.** CO forms own judgment first → compares with AI → learns when AI adds value. Skip this → anchoring bias → either over-trust or under-trust.
2. **"AI was wrong" sessions critical for preventing over-trust.** If CO only sees "AI is great" messaging → rubber-stamps. Showing AI failures = healthy calibration.
3. **Job security messaging must be proactive.** Don't wait for CO to ask "will AI replace me?" Address in Week 1 onboarding: "AI handles routine batch. You handle complex cases. Your expertise is MORE valuable, not less."
4. **Cross-reference:** override-governance.md (override rules + monitoring), metric-definitions.md (L3-W2 override rate, review time), guardrail-definitions.md (G-O1 override ceiling, G-O2 override floor), ux-wireframes-notes.md (UI design supporting calibrated trust).