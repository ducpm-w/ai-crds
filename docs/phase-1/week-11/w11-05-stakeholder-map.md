# Stakeholder Map — AI-Native CRDS
> **Dự án:** AI-Native Credit Risk Decision Support
> **File:** 05/07 — Internal Proposal
> **Ngày:** 09/04/2026

---

## 1. STAKEHOLDER MATRIX

| Stakeholder | Role in Project | Influence | Concern #1 | Concern #2 | What They Need to Hear | Status |
|------------|----------------|----------|-----------|-----------|----------------------|--------|
| **CEO** | Final approval | 🔴 Quyết định | ROI — có đáng đầu tư không? | Risk — nếu AI sai thì sao? | "Phase 0 = 365M, 8 tuần, zero risk. Full deploy saves 26 tỷ/năm. Kill switch tại mỗi gate." | ❓ Chưa pre-align |
| **CFO** | Budget approval | 🔴 Quyết định | Budget justification | Break-even timeline | "Break-even Month 11. NPV +33.56 tỷ. Phase-gated: 365M now, 1.32 tỷ later, only if Phase 0 passes." | ❓ Chưa pre-align |
| **Head of Cards** | Business sponsor | 🔴 Quyết định | Approval rate — có giảm không? Revenue impact | Speed — time-to-decision | "Approval rate duy trì 60% hoặc tăng nhẹ. TTD giảm từ 3-7 ngày → <1 ngày. False rejection -30% → recover 15 tỷ/năm revenue." | ❓ Chưa pre-align |
| **Chief Risk Officer / Risk Manager** | Risk approval | 🔴 Quyết định | NPL — có tăng không? | Compliance — SBV audit ready? | "NPL guardrail: không vượt current baseline. Threshold do Risk Committee approve. Audit trail 24 fields. SBV inspection ready <15 phút." | ❓ Chưa pre-align |
| **CTO / Head of IT** | Tech approval | 🟡 Ảnh hưởng | Integration complexity | Maintenance burden | "Phase 0 dùng synthetic data → zero IT impact. Phase 1: phased integration. Stack: Python/PostgreSQL, no exotic tech. IT owns deployment." | ❓ Chưa pre-align |
| **Compliance Officer** | Compliance sign-off | 🟡 Ảnh hưởng | Luật AI 134/2025 | BVDLCN / PDPD | "AI label hiển thị. Human-in-the-loop bắt buộc. DPIA draft ready. Opt-out mechanism designed. Bias monitoring active." | ❓ Chưa pre-align |
| **Head of Fraud** | Fraud domain expert | 🟡 Ảnh hưởng | Fraud detection accuracy | SIMO compliance (TT 45) | "Fraud detection layer mới (hiện không có). Multi-signal scoring. SIMO integration planned. Fraud miss -30%." | ❓ Chưa pre-align |
| **Credit Officers** (end users) | Daily users | 🟢 Sử dụng | Job security — AI thay thế? | Usability — dễ dùng không? | "AI assists, không replace. CO ký mọi quyết định. Workload giảm (batch review 3-5 phút). Override luôn available." | ❓ Chưa interview (W9 pending) |
| **Internal Audit** | Post-deploy oversight | 🟢 Giám sát | Audit trail completeness | Override governance | "24 fields, immutable, replay capable. Override logged with reason. SBV inspection ready." | ❓ Chưa engage |

---

## 2. INFLUENCE / INTEREST MAP

```
                     HIGH INFLUENCE
                          │
       KEEP SATISFIED     │    MANAGE CLOSELY
       (CTO, Head of IT) │    (CEO, CFO, Head of Cards,
                          │     CRO/Risk Manager)
                          │
    LOW ──────────────────┼────────────────── HIGH
    INTEREST              │                   INTEREST
                          │
       MONITOR            │    KEEP INFORMED
       (Internal Audit)   │    (Compliance, Head of Fraud,
                          │     Credit Officers)
                          │
                     LOW INFLUENCE
```

---

## 3. PRE-ALIGNMENT STRATEGY

### 3.1 Before Week 16 C-Level Presentation

| # | Meeting | Who | Duration | Purpose | Key ask | Target week |
|---|---------|-----|---------|---------|---------|------------|
| 1 | **1-on-1 Direct Manager** | Direct manager | 30 min | Pre-align, get coaching on C-level dynamics | "Support my proposal in C-level meeting?" | Week 11-12 |
| 2 | **1-on-1 Head of Cards** | Business sponsor | 45 min | Validate business case, confirm approval rate floor | "Bạn sẽ speak up support trong meeting?" | Week 12-13 |
| 3 | **1-on-1 Risk Manager** | Risk gatekeeper | 45 min | Validate NPL constraint, threshold governance | "NPL ceiling 3.5% — đồng ý?" | Week 12-13 |
| 4 | **1-on-1 CTO** | Tech gatekeeper | 30 min | Validate tech approach, integration feasibility | "CBS API available? Phase 0 IT support?" | Week 12-13 |
| 5 | **1-on-1 Compliance** | Compliance sign-off | 30 min | Validate DPIA approach, Luật AI compliance | "Luật AI label wording OK?" | Week 13-14 |
| 6 | **1-on-1 CFO** | Budget approve | 30 min | Walk through ROI, "even if" scenarios | "Phase 0 budget 365M — reasonable?" | Week 14 |
| 7 | **1-on-1 CEO** (nếu possible) | Final approver | 15-30 min | Executive summary only, get temperature | "Any concerns I should address?" | Week 14-15 |

**Principle: No surprises in C-level meeting.** Mọi stakeholder đã biết proposal trước meeting. Objections đã addressed. Champions đã committed.

### 3.2 Champion Network

| Champion | Why they should support | What they get |
|---------|----------------------|-------------|
| **Head of Cards** | Revenue increase (approval rate↑, TTD↓). Competitive positioning vs fintech. | More approvals, faster decisions, better customer experience |
| **Risk Manager** | NPL reduction potential. SBV audit trail. Fraud detection layer (new). | Better risk management tools, compliance readiness |
| **Direct Manager** | Visible innovation project. AI-Native capability for bank. | Department recognition, career opportunity for team |

### 3.3 Potential Objectors + Pre-responses

| Potential objector | Likely objection | Pre-response |
|-------------------|-----------------|-------------|
| **CFO** | "Budget tight, other priorities" | "Ask là 365M only (Phase 0). 0.38% of annual damage. Smallest meaningful investment." |
| **CTO** | "Integration too complex. CBS doesn't have API." | "Phase 0 uses synthetic data — zero CBS integration needed. Phase 1 integration phased + adapter pattern." |
| **Risk Manager** | "NPL might increase" | "Threshold do Risk Committee approve. Guardrail: NPL +200bps → emergency stop. Shadow testing trước khi affect real decisions." |
| **Compliance** | "Luật AI mới, chưa rõ ràng" | "AI-CRDS designed WITH Luật AI 134/2025 from Day 1: labeling, human-in-the-loop, opt-out, DPIA. Proactive compliance, not reactive." |
| **Credit Officers** | "AI will replace us" | "CO ký mọi quyết định. AI handles routine (batch), CO handles complex. Your expertise MORE valuable, not less." |

---

## 4. COMMUNICATION PLAN

### Pre-Presentation (Week 11-15)

| Audience | Channel | Message | Frequency |
|---------|---------|---------|-----------|
| C-level (individual) | 1-on-1 meetings | Tailored per stakeholder (Section 3.1) | Once each |
| Champions | Email/chat + in-person | "Here's the proposal. Your feedback?" | 2-3 touchpoints |
| Credit Officers | Informal lunch/coffee | "We're exploring AI to help your workflow. What would help?" | 1-2 conversations |
| IT team | Meeting | "We'll need your help for Phase 1. Phase 0 = no IT impact." | Once |

### Post-Presentation (Week 16+)

| Outcome | Communication |
|---------|-------------|
| **Approved** | Thank champions. Email summary to all stakeholders. Schedule Phase 0 kickoff. |
| **Approved with conditions** | Document conditions. Address in Phase 0 plan. Communicate adjustments. |
| **Deferred** | Ask: "What would change your mind?" Address concerns. Re-present in 4-8 weeks. |
| **Rejected** | Debrief with champions. Understand objections. Document learnings. Consider: smaller scope? Different timing? |

---

## Tracking

- [ ] Direct manager pre-aligned?
- [ ] Head of Cards pre-aligned? Will champion?
- [ ] Risk Manager pre-aligned? NPL ceiling agreed?
- [ ] CTO pre-aligned? No tech blockers?
- [ ] Compliance pre-aligned? DPIA approach OK?
- [ ] CFO pre-aligned? Budget reasonable?
- [ ] CEO temperature check? Any unknown concerns?
- [ ] Champions confirmed (≥2 people who will actively support)?
- [ ] All potential objections have pre-responses?
