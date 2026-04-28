# Cost-of-Error Table — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Quantify cost per error type → drive threshold design + Risk Committee decision. Document này trả lời: "Sai ở đâu đắt nhất? Threshold nên bias về hướng nào?"

---

## 1. FOUR ERROR TYPES — MASTER TABLE

| | **ERROR TYPE 1** | **ERROR TYPE 2** | **ERROR TYPE 3** | **ERROR TYPE 4** |
|--|-----------------|-----------------|-----------------|-----------------|
| **Name** | False Negative (FN) | False Positive (FP) | Fraud Miss | Fraud False Alarm |
| **What happens** | AI/CO approve → bad applicant → default | AI/CO reject → good applicant → LTV lost | Fraud lọt qua screening → fraudster gets CC → full loss | Legit customer flagged as fraud → LTV lost + experience damage |
| **Who's hurt** | Bank (credit loss) | Bank (revenue loss) + Customer (denied service) | Bank (full limit loss) | Bank (revenue loss) + Customer (delayed/denied + bad experience) |
| **Cost per case** | **1.225M VND** | **36M VND** | **50M VND** | **40M VND** |
| **Cost calculation** | PD × LGD × EAD = 3.5% × 70% × 50M | LTV = 8M/năm × 3 years + acquisition cost (~12M) | 100% limit × 100% PD = 50M | LTV (36M) + experience penalty (~4M: complaint handling, reputation) |
| **Frequency (base)** | ~63/tháng | ~120/tháng | ~24/tháng | ~15/tháng |
| **How calculated** | 3.5% NPL × 1,800 approved | 10% false reject × 1,200 rejected | 0.8% fraud × 3,000 apps | Ước tính: ~15% of State 3 cases are false alarms |
| **Annual cost** | **26.46 tỷ VND** | **51.84 tỷ VND** | **14.4 tỷ VND** | **7.2 tỷ VND** |
| **% of total error cost** | 26% | **52%** ← lớn nhất | 14% | 7% |
| **Source** | damage-model.md T1, A7-A9 | damage-model.md T3, A13-A14 | damage-model.md T2, A11-A12 | Ước tính từ T2 + T3 |

**Total annual error cost (base case): 99.9 tỷ VND**

---

## 2. COST RATIO ANALYSIS

### 2.1 The Asymmetry

```
FP cost / FN cost = 36M / 1.225M = 29.4x

╔══════════════════════════════════════════════════════════════╗
║  Rejecting 1 good customer costs BANK 29.4x more            ║
║  than approving 1 bad customer.                              ║
╚══════════════════════════════════════════════════════════════╝
```

### 2.2 All Pairwise Ratios

| Ratio | Value | Implication |
|-------|-------|------------|
| **FP / FN** | **29.4x** | Threshold bias → approve. Tốt hơn chấp nhận thêm risk (approve more) hơn là mất good customers (reject more). |
| **Fraud miss / FN** | 40.8x | Fraud miss đắt hơn credit loss rất nhiều. Fraud detection phải aggressive. |
| **Fraud miss / FP** | 1.4x | Fraud miss đắt hơn false reject — nhưng chỉ 1.4x, gần tương đương. |
| **Fraud false alarm / FP** | 1.1x | Fraud false alarm ≈ false reject cost. Flagging legit customer as fraud = almost as bad as rejecting them. |
| **Fraud miss / Fraud false alarm** | 1.25x | Fraud miss slightly worse than fraud false alarm → fraud threshold nên lean conservative (catch more fraud, accept some false alarms). |

### 2.3 Visual: Cost per Error Type

```
Cost per case (M VND):

Fraud Miss     ████████████████████████████████████████████████████  50M
Fraud Alarm    ████████████████████████████████████████             40M
FP (reject)    ████████████████████████████████████                 36M
FN (approve)   █                                                    1.225M
               ├──────┼──────┼──────┼──────┼──────┤
               0     10     20     30     40     50
```

```
Annual total cost (tỷ VND):

FP (reject)    ████████████████████████████████████████████████████  51.84
FN (approve)   ██████████████████████████                            26.46
Fraud Miss     ██████████████                                        14.4
Fraud Alarm    ███████                                                7.2
               ├──────┼──────┼──────┼──────┼──────┤
               0     10     20     30     40     50
```

**Per-case:** Fraud miss đắt nhất (50M). **Total annual:** FP đắt nhất (51.84 tỷ) vì frequency cao hơn nhiều.

---

## 3. THRESHOLD IMPLICATIONS

### 3.1 Credit Scoring Threshold → Bias Toward Approval

| FP/FN ratio | Threshold direction | Lý do |
|------------|-------------------|-------|
| **29.4x** (FP >> FN) | **Bias toward APPROVE** | Mỗi good customer bị reject mất 29.4x so với mỗi bad customer được approve. Tốt hơn approve thêm 1 bad case (lose 1.225M) hơn reject thêm 1 good case (lose 36M). |

**Concrete implication cho TH_high (threshold-framework.md):**
- TH_high = 0.75 → ~37% auto-route approve
- Giảm TH_high = 0.70 → ~50% auto-route → FP giảm (ít reject nhầm) nhưng FN tăng (thêm risky apps approved)
- **Optimal point:** giảm TH_high cho đến khi marginal FN cost increase = marginal FP cost decrease
- Vì FP/FN = 29.4x → optimal TH_high thấp hơn "neutral" threshold. Hệ thống nên "dễ dãi" hơn so với threshold trung lập.

### 3.2 Fraud Threshold → Bias Toward CATCHING Fraud

| Fraud miss / Fraud false alarm | Threshold direction | Lý do |
|-------------------------------|-------------------|-------|
| **1.25x** (miss slightly > alarm) | **Bias toward CONSERVATIVE (catch more)** | Fraud miss (50M) > false alarm (40M). Nhưng gần nhau → không quá aggressive (tránh flag quá nhiều legit customers). |

**Concrete implication cho TH_fraud:**
- TH_fraud_elevated = 0.40 → catches ~90% fraud, ~78 false alarms/tháng
- Giảm TH_fraud = 0.30 → catches ~95% fraud, ~176 false alarms/tháng
- Cost analysis: giảm từ 0.40 → 0.30 catches ~2 thêm fraud/tháng (save 100M) nhưng thêm ~98 false alarms (cost 3.92 tỷ/năm)
- **→ TH_fraud = 0.40 better than 0.30 từ cost perspective.** 0.40 is already sufficiently conservative.

### 3.3 Decision Matrix — Error Trade-offs

| Decision | If threshold too HIGH (conservative) | If threshold too LOW (aggressive) |
|---------|-------------------------------------|----------------------------------|
| **Credit scoring** | More FP (reject good → lose 36M/case). More manual review (State 2). Less risk but less growth. | More FN (approve bad → lose 1.225M/case). Less manual review. More risk but more growth. |
| **Fraud detection** | More fraud false alarms (flag legit → lose 40M/case). More State 3 queue. Better fraud catch. | More fraud miss (let fraud through → lose 50M/case). Less State 3 queue. Higher fraud loss. |

---

## 4. SCENARIO ANALYSIS — "What If" Error Rates Change

### 4.1 FN Rate Changes (NPL impact)

| FN rate (NPL) | FN cases/tháng | FN cost/năm | Change vs base |
|--------------|---------------|------------|---------------|
| 2.0% (best) | 36 | 15.12 tỷ | -11.34 tỷ |
| 2.8% (-20%, AI target) | 50 | 21.17 tỷ | -5.29 tỷ |
| **3.5% (base)** | **63** | **26.46 tỷ** | **baseline** |
| 4.5% (worse) | 81 | 34.02 tỷ | +7.56 tỷ |
| 6.0% (worst) | 108 | 45.36 tỷ | +18.90 tỷ |

### 4.2 FP Rate Changes (False Rejection impact)

| FP rate | FP cases/tháng | FP cost/năm | Change vs base |
|---------|---------------|------------|---------------|
| 5% (best, AI target) | 60 | 25.92 tỷ | -25.92 tỷ |
| 7% (-30%, AI realistic) | 84 | 36.29 tỷ | -15.55 tỷ |
| **10% (base)** | **120** | **51.84 tỷ** | **baseline** |
| 12% | 144 | 62.21 tỷ | +10.37 tỷ |
| 15% (worst) | 180 | 77.76 tỷ | +25.92 tỷ |

### 4.3 Combined: AI Improvement Scenarios

| Scenario | FN rate | FP rate | Fraud miss rate | Total error cost/năm | Saving vs base |
|---------|---------|---------|----------------|--------------------|-|
| **Current (no AI)** | 3.5% | 10% | 0.8% | **99.9 tỷ** | baseline |
| AI Conservative | 3.15% (-10%) | 8% (-20%) | 0.64% (-20%) | 78.3 tỷ | **21.6 tỷ** |
| **AI Base** | **2.8% (-20%)** | **7% (-30%)** | **0.56% (-30%)** | **64.3 tỷ** | **35.6 tỷ** |
| AI Optimistic | 2.45% (-30%) | 5% (-50%) | 0.32% (-60%) | 44.8 tỷ | **55.1 tỷ** |

---

## 5. HIDDEN COSTS — Beyond Direct Financial

| Error type | Hidden cost | Quantifiable? | Impact |
|-----------|------------|-------------|--------|
| **FN (approve bad)** | Provision cost (bank must provision for expected loss). Regulatory scrutiny if NPL rises. Management time. | Partially — provision = 100% of NPL amount | Medium |
| **FP (reject good)** | Customer switches to competitor. Negative word-of-mouth. Brand damage. Market share loss. | Hard to quantify — estimate: 1 rejected customer tells 3-5 people | High long-term |
| **Fraud miss** | SIMO reporting burden. Law enforcement cooperation time. System vulnerability exposed (fraudster shares method). Regulatory fine risk. | Partially — SIMO effort ~500K/case. Regulatory fine: unknown. | High |
| **Fraud false alarm** | Customer trust damage (accused of fraud). Complaint handling cost. Potential media/social media escalation. | Partially — complaint cost ~200-500K/case. Reputation: unquantifiable. | Medium-High |

### 5.1 Adjusted Costs (including hidden costs — ước tính)

| Error type | Direct cost | Hidden cost (est.) | **Adjusted cost** |
|-----------|------------|-------------------|-----------------|
| FN | 1.225M | +0.3M (provision effort, mgmt time) | **~1.5M** |
| FP | 36M | +5-10M (competitor switch, WOM) | **~43M** |
| Fraud miss | 50M | +2-5M (SIMO, legal, system patch) | **~54M** |
| Fraud alarm | 40M | +1-2M (complaint, trust damage) | **~42M** |

**Adjusted FP/FN ratio: 43M / 1.5M = 28.7x** — still heavily asymmetric. Conclusion unchanged: bias toward approval.

---

## 6. ERROR BUDGET — How Much Error is Acceptable?

### 6.1 Error Budget Concept

Không tồn tại hệ thống zero-error. Câu hỏi đúng: "Bao nhiêu error là chấp nhận được?"

| Error type | Current rate | Target (AI-CRDS) | Maximum acceptable | Who sets? |
|-----------|-------------|-----------------|-------------------|----------|
| FN (NPL) | 3.5% | 2.8% (-20%) | ≤ 3.5% (≤ current) | Risk Committee |
| FP (false reject) | 10% | 7% (-30%) | ≤ 10% (≤ current) | Head of Cards + Risk |
| Fraud miss | 0.8% | 0.56% (-30%) | ≤ 0.8% (≤ current) | Risk Committee |
| Fraud false alarm | ~0.5% | ~0.35% | ≤ 1.0% | Head of Cards |

**Principle: AI-CRDS phải đạt "at least as good as current" trên TẤT CẢ error types.** Improve on some, neutral on others. NEVER worse on any.

### 6.2 Error Budget Monitoring

```
MONTHLY ERROR BUDGET DASHBOARD

FN Rate (NPL):    [████████░░] 2.8% / 3.5% max    ✅ Within budget
FP Rate:          [██████░░░░] 7.0% / 10.0% max    ✅ Within budget
Fraud Miss:       [████████░░] 0.56% / 0.80% max   ✅ Within budget
Fraud Alarm:      [███░░░░░░░] 0.35% / 1.00% max   ✅ Within budget

IF ANY metric exceeds budget → ALERT → investigate → threshold adjustment
```

---

## 7. IMPLICATIONS FOR WEEK 12 MVP

### 7.1 MVP Threshold Strategy

| Principle | Implementation |
|----------|---------------|
| **Start conservative** | TH_high = 0.75 (not lower). Prove safety first, optimize later. |
| **FP/FN asymmetry acknowledged** | But for MVP, safety > optimization. Don't chase FP reduction at expense of NPL increase. |
| **Fraud conservative** | TH_fraud = 0.40. Better to over-flag than miss fraud in early deployment. |
| **Monitor heavily** | Track all 4 error types daily during shadow testing. Any trend → investigate immediately. |

### 7.2 What to Measure in Shadow Testing (Week 37-40)

| Metric | How to measure | Target |
|--------|---------------|--------|
| FN rate (hypothetical) | AI would have approved → did customer default? (need 90+ day lag) | ≤ current NPL |
| FP rate | AI would have rejected → CO approved → did customer perform well? | < current false reject |
| Fraud miss | AI fraud score < TH → was it actually fraud? | ≤ current fraud miss |
| Fraud false alarm | AI fraud score > TH → was it actually legit? | Minimize while keeping fraud catch rate |

**⚠️ FN measurement has 90+ day lag** (default = DPD 90+). Shadow testing 4 weeks → can only see DPD 30 at most. Full FN validation needs 90-day post-deployment measurement (Week 47).

---

## 8. RISK COMMITTEE PRESENTATION — Key Slides

### Slide 1: The Asymmetry

```
"Our biggest cost is NOT bad loans — it's REJECTING GOOD CUSTOMERS."

                Per case:        Annual:
FP (reject):    36M VND          51.84 tỷ (52%)  ← LARGEST
FN (approve):   1.225M VND       26.46 tỷ (26%)
Fraud miss:     50M VND          14.4 tỷ  (14%)
Fraud alarm:    40M VND          7.2 tỷ   (7%)
```

### Slide 2: The Implication

```
"Threshold should bias toward approval — 
 but with guardrails."

✅ DO:  Lower threshold slightly → approve more → capture revenue
✅ DO:  Aggressive fraud detection → catch fraud → protect bank
❌ DON'T: Lower threshold so much that NPL increases above current
❌ DON'T: Lower fraud threshold so much that false alarms overwhelm fraud team
```

### Slide 3: The Ask

```
"Approve error budget framework:
 - NPL: ≤ current (3.5%)
 - False reject: ≤ current (10%)
 - Fraud miss: ≤ current (0.8%)
 
 AI-CRDS must be AT LEAST AS GOOD as current on ALL metrics.
 Improve some, neutral on others. NEVER worse on any."
```

---

## Tracking — Tự hỏi cuối tuần

- [ ] Risk Committee đã review cost-of-error analysis chưa?
- [ ] FP/FN ratio (29.4x) — Risk Manager đồng ý conclusion "bias toward approve"?
- [ ] Error budget limits — Risk Committee approve NPL ≤ 3.5%, FP ≤ 10%, Fraud ≤ 0.8%?
- [ ] Hidden costs — có cost nào quan trọng bị miss không?
- [ ] Head of Cards đồng ý "FP is our biggest cost, not FN"?
- [ ] Shadow testing measurement plan — đã share với DS team chưa?

---

## Ghi Chú & Limitations

1. **FP rate 10% là assumption yếu nhất** (A13, confidence ❓ Low). FP/FN ratio có thể thay đổi đáng kể nếu actual FP rate khác. Nếu FP = 5% → ratio = 14.7x (vẫn asymmetric nhưng ít hơn). Nếu FP = 15% → ratio vẫn 29.4x nhưng annual FP cost = 77.76 tỷ.
2. **LTV 36M VND** bao gồm: interest income (revolvers) + annual fee + interchange. Nếu khách là transactor (trả full mỗi tháng) → LTV thấp hơn (~15M). Nếu khách revolve → LTV cao hơn (~60M). 36M là blended average.
3. **Fraud false alarm cost (40M)** bao gồm experience penalty (~4M) — ước tính. Actual experience damage khó quantify (social media risk, regulator complaint).
4. **"Bias toward approval" KHÔNG có nghĩa "approve tất cả."** Vẫn có NPL ceiling (≤ current). Vẫn reject high-risk applicants. Bias = khi 50/50, lean approve.
5. **Cross-reference:** damage-model.md (source cho all cost numbers), threshold-framework.md (threshold design using these costs), assumptions-log.md (confidence levels cho A7-A14), decision-architecture.md (state routing based on thresholds).