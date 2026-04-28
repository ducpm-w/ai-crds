# Metric Conflict Memo — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Document tension thật giữa Business, Risk, và Compliance KPIs. Propose resolution framework. Dùng cho stakeholder alignment meetings trước Week 11 proposal.

---

## 1. THE THREE-WAY TENSION

```
                    BUSINESS
                   (Head of Cards)
                   "Approve more,
                    faster, grow
                    portfolio"
                       /\
                      /  \
                     /    \
          CONFLICT  /      \ CONFLICT
           #1     /        \  #2
                 /          \
                /            \
    RISK ──────────────────── COMPLIANCE
   (Risk Manager)            (Compliance Officer)
   "Keep NPL low,           "Full audit trail,
    catch fraud,              no bias, customer
    control exposure"         rights respected"
                   
                CONFLICT #3
```

---

## 2. CONFLICT #1 — BUSINESS vs RISK

### The Tension

| Business wants | Risk wants | Why they conflict |
|---------------|-----------|------------------|
| **Approval rate ↑** | **NPL rate ↓** | More approvals → more risky applicants approved → NPL ↑ |
| **Time-to-decision ↓** | **Thorough review** | Faster decisions → less time to catch risk signals |
| **Volume ↑** | **Exposure control** | More cards issued → higher total exposure → more potential loss |
| **Lower threshold** (TH_high) | **Higher threshold** | Lower TH = more auto-approve = more revenue but more risk |

### Real-world scenario tại Bank X

```
Head of Cards: "Q4 target là 2,500 CC mới/tháng. Current approval 
rate 60% cho 3,000 apps = 1,800. Tôi cần approval rate tăng lên 
70% hoặc volume apps tăng lên 4,200."

Risk Manager: "NPL đã 3.5%. Nếu approval rate tăng 70% mà không 
cải thiện model → NPL sẽ lên 4.0-4.5%. SBV sẽ hỏi."

→ DEADLOCK nếu không có framework resolve.
```

### Resolution Framework

| Principle | Implementation |
|----------|---------------|
| **North Star governs:** RARPA phải improve, không phải approval rate hay NPL đơn lẻ. | Approval rate increase OK chỉ khi RARPA không giảm. |
| **Error budget governs:** NPL ceiling (≤ 3.5%) là hard constraint. Business có thể optimize within constraint, không vượt. | Risk Committee set ceiling. Business optimize approval rate subject to ceiling. |
| **AI is the enabler:** AI-CRDS cho phép tăng approval rate WITHOUT tăng NPL — bằng cách score chính xác hơn (ít false positive + ít false negative). | Evidence: cost-of-error-table.md — FP/FN ratio 29.4x → current process over-rejects good customers. AI reduces false rejects → approval ↑ + NPL stable. |
| **Data settles disputes:** Tranh cãi resolve bằng shadow testing data + vintage analysis, không phải opinion. | "Hãy chạy shadow 4 tuần, so sánh AI vs manual, rồi decide." |

### Agreed Operating Zone (proposed)

```
Approval Rate (%)
    │
75% ┤                    ╔═══════════════╗
    │                    ║               ║
70% ┤                    ║  BUSINESS     ║
    │                    ║  HAPPY ZONE   ║
65% ┤             ╔══════╬═══════════════╬══════╗
    │             ║      ║   AGREED      ║      ║
60% ┤  ─ ─ ─ ─ ─ ╫──────╫── OPERATING ──╫──────╫ ─ ─ current
    │             ║      ║     ZONE      ║      ║
55% ┤             ╚══════╬═══════════════╬══════╝
    │                    ║  RISK         ║
50% ┤                    ║  HAPPY ZONE   ║
    │                    ╚═══════════════╝
    ├──────┼──────┼──────┼──────┼──────┼──────┤
   2.0%   2.5%   3.0%   3.5%   4.0%   4.5%   5.0%
                     NPL Rate (%)
                         │
                    NPL CEILING ≤ 3.5%
```

**Agreed Operating Zone:** Approval rate 55-65% AND NPL ≤ 3.5%. Both stakeholders acceptable. AI-CRDS target: move toward top-left corner (higher approval + lower NPL).

---

## 3. CONFLICT #2 — BUSINESS vs COMPLIANCE

### The Tension

| Business wants | Compliance wants | Why they conflict |
|---------------|-----------------|------------------|
| **Minimal friction** | **Full consent + disclosure** | Consent flow adds steps → customer drop-off ↑ |
| **Fast approval** | **DPIA + audit trail** | Compliance overhead adds processing time |
| **Use all data** | **Data minimization** (BVDLCN) | More data = better model, but BVDLCN says minimize |
| **Vague rejection** | **Specific adverse action** (NĐ 356) | Specific reasons help customer improve, but expose bank criteria |

### Real-world scenario

```
Head of Cards: "Consent form có 3 trang? Customer drop-off 
rate sẽ tăng 15-20%. Đối thủ chỉ cần 1 click."

Compliance: "NĐ 356 bắt buộc consent rõ ràng cho processing 
DLCN bằng AI. Không có shortcut. Vi phạm → phạt hành chính 
+ A05 điều tra."
```

### Resolution Framework

| Principle | Implementation |
|----------|---------------|
| **Compliance is non-negotiable.** BVDLCN, Luật AI 134/2025, SBV requirements = hard constraints. Business cannot override. | Compliance đặt minimum requirements. Business optimize UX within requirements. |
| **UX can minimize friction within compliance.** Consent doesn't have to be 3 pages. Can be smart, progressive, integrated. | Progressive consent: Tầng 1 (basic) at app start. Tầng 2 (detailed) before AI scoring. Single-page, plain language, 1-click. |
| **Data minimization ≠ no data.** BVDLCN says minimize, not eliminate. Use what's necessary for stated purpose. | Document purpose per data field (pdpd-impact-assessment.md). Justify each field. Remove truly unnecessary fields. |
| **Adverse action = customer service, not risk exposure.** Specific reasons help bank long-term (fewer complaints, regulatory compliance). | Train CO: specific reasons ≠ reveal scoring formula. "Điểm CIC thấp" ≠ reveal threshold. |

---

## 4. CONFLICT #3 — RISK vs COMPLIANCE

### The Tension

| Risk wants | Compliance wants | Why they conflict |
|-----------|-----------------|------------------|
| **Keep all data forever** (audit, SBV) | **Delete PII per retention schedule** (BVDLCN) | SBV wants audit trail. BVDLCN wants PII deleted. |
| **Use all features for scoring** | **No bias, no discrimination** (Luật AI) | Some features (geography, employer type) predict risk but may proxy for protected attributes. |
| **Model opacity OK** (complex model = better accuracy) | **Explainability mandatory** (Luật AI, NĐ 356) | Black box GBM model > explainable logistic regression. But Luật AI requires explanation. |

### Real-world scenario

```
Risk Manager: "Geography (tỉnh/thành) là predictor mạnh. Rural 
customers default rate cao hơn urban 30%. Bỏ feature này = model 
kém đi."

Compliance: "Luật AI 134/2025 Điều 4: không phân biệt đối xử. 
Nếu geography proxy cho income/ethnicity → discrimination. 
Approval rate gap urban vs rural > 8pp = red flag."
```

### Resolution Framework

| Principle | Implementation |
|----------|---------------|
| **Tiered Data Lifecycle resolves retention conflict.** | pdpd-impact-assessment.md v1.1 §4.4: Tầng 1 (PII) xóa sớm. Tầng 2 (pseudonymized audit) giữ lâu cho SBV. Cả hai bên satisfied. |
| **Use feature, monitor bias.** Geography can be used nếu: (a) justified by actual risk difference, (b) bias monitored monthly, (c) gap within accepted range. | Include geography in model. Monitor L3-C5 (geography gap ≤ 8pp). If exceeded → investigate: real risk difference or proxy bias? |
| **Explainability layer, not model restriction.** Complex model OK nếu có explainability layer (SHAP/LIME for individual explanations). | Use GBM for accuracy. Add SHAP explanation layer. Adverse action notice uses SHAP top 3 factors. Risk gets accuracy. Compliance gets explainability. |
| **"Comply first, optimize second."** When Risk and Compliance truly conflict → Compliance wins. Better to have slightly worse model than regulatory violation. | Compliance veto on features that create unacceptable bias. Risk can appeal to Risk Committee with data evidence. |

---

## 5. CONFLICT #4 — OVERRIDE RATE: TOO HIGH vs TOO LOW

### The Tension

| Too HIGH override (>40%) | Too LOW override (<5%) |
|-------------------------|----------------------|
| AI recommendations ignored → AI not adding value. Wasted investment. | CO rubber-stamping → not actually reviewing. Human-in-the-loop violated in spirit. |
| Possible cause: model poorly calibrated, CO doesn't trust AI | Possible cause: CO overtrusts AI, CO lazy/overloaded, batch confirm = auto-approve |
| Risk wants: lower (CO trust AI) | Compliance wants: not too low (human review must be real) |

### Resolution

| Principle | Implementation |
|----------|---------------|
| **Target range 10-30%** | Healthy: CO overrides AI 10-30% of cases = CO adds unique value AI doesn't have |
| **Override > 40% sustained 2 weeks → model review** | Investigate: is model wrong (recalibrate) or CO has info AI doesn't (capture new features)? |
| **Override < 5% sustained 1 month → CO audit** | Investigate: is CO actually reviewing? Check `co_review_time_seconds` — if S1 batch confirm < 30 seconds/app → rubber-stamping. Reduce batch size. Mandatory training refresh. |
| **Direction matters** | Override-to-approve (AI says reject, CO approves) → track NPL of overridden cases separately. Override-to-reject (AI says approve, CO rejects) → track if rejected applicants would have been good (counterfactual, hard to measure). |
| **Data settles** | After 6 months: compare NPL of AI-recommended vs CO-overridden cohorts. If CO overrides perform better → model needs features CO has. If CO overrides perform worse → CO training needed. |

---

## 6. CONFLICT #5 — FRAUD THRESHOLD vs CUSTOMER EXPERIENCE

### The Tension

| Risk/Fraud team wants | Business/CX wants |
|---------------------|------------------|
| **Strict fraud threshold** (TH_fraud = 0.30) → catch more fraud | **Lenient fraud threshold** (TH_fraud = 0.50) → fewer good customers flagged |
| Accept many false alarms to catch nearly all fraud | Reject fewer legit customers, protect brand reputation |
| Every fraud miss = 50M VND loss + SIMO reporting burden | Every fraud false alarm = 40M VND LTV lost + angry customer + WOM damage |

### Resolution

| Principle | Implementation |
|----------|---------------|
| **Separate fraud score from credit score** | Fraud model runs independently. Customer can have excellent credit score but still get fraud-flagged. Two independent assessments, not one combined threshold. |
| **Fraud miss ≈ fraud false alarm cost (50M vs 40M, ratio 1.25x)** | Near-equal → threshold should be balanced, NOT extremely conservative OR extremely lenient. TH_fraud = 0.40 captures this balance. |
| **Monitor fraud false alarm rate** | Target: false alarm rate ≤ 80% of State 3 cases (i.e., ≥ 20% of flagged cases should be actual fraud). If > 85% false alarm → threshold too sensitive → customer experience suffering. |
| **Fast resolution SLA for fraud false alarms** | State 3 SLA = 4h. Legitimate customer cleared within 4h max → minimize CX damage. If SLA consistently missed → capacity issue, not threshold issue. |
| **Customer communication for fraud flags** | Do NOT tell customer "you are suspected of fraud." Say: "We need additional identity verification for your application. Please [action]." Frame as security, not accusation. |

---

## 7. CONFLICT RESOLUTION PROTOCOL

### 5.1 Who Decides When Metrics Conflict?

| Conflict type | First try | If unresolved | Final authority |
|-------------|----------|-------------|---------------|
| Business vs Risk (approval rate vs NPL) | PM mediates with data | Risk Committee reviews evidence | Risk Committee decides (Risk has veto on NPL ceiling) |
| Business vs Compliance (speed vs consent) | PM + Compliance discuss UX options | Legal review | Compliance has veto (regulatory = non-negotiable) |
| Risk vs Compliance (retention vs deletion, features vs bias) | Risk + Compliance discuss tiered approach | Risk Committee + Legal | If regulatory requirement → Compliance wins. If best practice → Risk Committee decides. |
| Any metric vs North Star (RARPA) | Check: does proposed change improve RARPA? | If RARPA neutral/positive → proceed. If RARPA negative → justify exception. | Risk Committee |

### 5.2 Escalation Path for Metric Conflicts

```
Step 1: PM identifies conflict, documents data
    │
Step 2: 1-on-1 with each stakeholder (understand position)
    │
Step 3: Joint meeting with data evidence
    │     → Resolution? → Document + implement
    │
Step 4: If no resolution → Risk Committee arbitrates
    │     → Committee decides with documented reasoning
    │
Step 5: Losing side can appeal to C-level with new evidence
        → C-level decision is FINAL
```

### 5.3 Quarterly Metric Review Meeting

| Agenda item | Duration | Participants |
|------------|---------|-------------|
| North Star (RARPA) trend | 10 min | All |
| Business metrics review (L2-B1/B2/B3) | 10 min | Head of Cards presents |
| Risk metrics review (L2-R1/R2/R3) | 10 min | Risk Manager presents |
| Compliance metrics review (L3-C1-C8) | 10 min | Compliance presents |
| Conflicts identified + resolution | 15 min | PM facilitates |
| Threshold adjustment proposals (if any) | 10 min | DS presents, Risk Committee decides |
| **Total** | **~65 min** | |

---

## 8. CONFLICT SCENARIOS — PRE-PREPARED RESPONSES

### Scenario 1: "Tăng approval rate lên 70%"

```
Head of Cards: "Tôi cần approval rate 70%."

PM response:
"Hiện tại approval rate 60%, NPL 3.5%. Nếu tăng approval 
rate lên 70% bằng cách hạ threshold:
- NPL ước tăng lên 4.0-4.5% (vượt ceiling 3.5%)
- Risk Committee sẽ không approve.

Nhưng: AI-CRDS có thể tăng approval rate lên 65% WHILE 
giảm NPL xuống 3.0% — bằng cách giảm false rejection rate.
Kết quả: +5pp approval, -0.5pp NPL. Win-win.

Proposal: Chạy shadow testing 4 tuần, prove AI reduces 
false rejection, rồi tăng approval gradually."
```

### Scenario 2: "NPL tăng 0.3pp — tighten everything"

```
Risk Manager: "NPL tăng từ 3.5% lên 3.8%. Tăng TH_high ngay."

PM response:
"Trước khi tighten, cần phân tích:
1. NPL tăng ở cohort nào? AI-approved hay CO-override-approved?
2. Nếu AI-approved cohort stable, CO-override cohort tăng → 
   vấn đề là override governance, không phải threshold.
3. Nếu AI-approved cohort tăng → check: có model drift không? 
   (L3-M7 PSI). Có external shock không? (economic downturn)

Proposal: Investigate root cause (1 tuần) → targeted action 
thay vì blanket tightening (sẽ tăng FP cost đáng kể)."
```

### Scenario 3: "Geography feature tạo bias"

```
Compliance: "Approval rate HCM 68%, rural provinces 52%. Gap 
16pp > 8pp threshold. Remove geography feature."

PM response:
"Cần phân tích sâu hơn:
1. Geography gap phản ánh real risk difference hay proxy bias?
2. Rural customers có CIC score thấp hơn? Income thấp hơn?
3. Nếu remove geography, replace bằng income + CIC (actual 
   risk factors) → gap có giảm không?

Proposal: Test model without geography feature. If accuracy 
drops < 1% Gini → remove permanently. If drops > 1% → keep 
but with bias monitoring + annual review."
```

---

## Tracking

- [ ] Head of Cards đã agree approval rate target range (55-65%) chưa?
- [ ] Risk Manager đã agree NPL ceiling (≤ 3.5%) chưa?
- [ ] Compliance đã agree bias thresholds (5pp/8pp/10pp) chưa?
- [ ] North Star (RARPA) đã agree là north star metric chưa?
- [ ] Quarterly metric review meeting đã schedule chưa?
- [ ] Pre-prepared responses (Section 6) đã rehearse chưa?

---

## Ghi Chú

1. **Conflict #1 (Business vs Risk) là conflict phổ biến nhất** — sẽ xảy ra hàng tháng. Framework phải robust.
2. **Conflict #3 (Risk vs Compliance) là mới** — triggered bởi Luật AI 134/2025 (effective 01/03/2026). Chưa có precedent tại VN banking. Need to navigate carefully.
3. **"Data settles disputes"** — nguyên tắc quan trọng nhất. Mọi conflict nên resolve bằng evidence (shadow testing, vintage analysis, bias metrics), không phải opinion hoặc seniority.
4. **Cross-reference:** kpi-tree.md (metric hierarchy), guardrail-definitions.md (acceptable ranges), threshold-framework.md (threshold governance), cost-of-error-table.md (cost basis for trade-off analysis).