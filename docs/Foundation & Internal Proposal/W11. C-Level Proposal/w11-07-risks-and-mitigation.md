# Risks & Mitigation — AI-Native CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Top 7 risks C-level sẽ hỏi. Mỗi risk: description, likelihood, impact, mitigation, residual risk. Frame: chúng ta đã anticipate + có plan, không phải "hy vọng sẽ ổn."

---

## 1. RISK MATRIX — Overview

```
                    IMPACT
                    Low         Medium        High       Very High
              ┌──────────┬──────────────┬──────────┬────────────┐
  LIKELIHOOD  │          │              │          │            │
              │          │              │          │            │
  High        │          │              │   R2     │            │
              │          │              │   CO     │            │
              │          │              │  Adopt   │            │
              ├──────────┼──────────────┼──────────┼────────────┤
  Medium      │          │   R4         │   R1     │   R3       │
              │          │  Integration │  AI Perf │  Regulatory│
              │          │              │          │            │
              ├──────────┼──────────────┼──────────┼────────────┤
  Low         │   R6     │   R7         │   R5     │            │
              │  Vendor  │   Data       │  NPL     │            │
              │  lock-in │   Breach     │  Spike   │            │
              └──────────┴──────────────┴──────────┴────────────┘
```

---

## 2. DETAILED RISKS

### RISK 1: AI Performance Không Đủ Tốt

| Attribute | Detail |
|-----------|--------|
| **Description** | AI scoring accuracy thấp hơn kỳ vọng. Model không outperform CO manual review. ROI không đạt. |
| **Likelihood** | 🟡 Medium (30%) |
| **Impact** | 🔴 High — investment wasted, credibility damaged |
| **Root cause** | Data quality kém. Feature set thiếu predictive power. Model architecture không phù hợp. CIC data stale. |
| **Mitigation** | |

| # | Action | When | Effect |
|---|--------|------|--------|
| 1 | **Shadow testing 4 tuần trước khi commit Phase 1** | Phase 0 Week 5-8 | Validate AI vs manual. Data, not hope. |
| 2 | **Kill switch tại Gate 0→1** | Phase 0 Week 8 | Nếu AI alignment < 50% → stop. Sunk cost = 365M only. |
| 3 | **Start with simple model (logistic regression)** | Phase 0 | Interpretable. If simple model works → complex model will do better. |
| 4 | **Iterate: model v1 → v2 → v3** during shadow testing | Phase 0-1 | Continuous improvement, not big-bang. |

| **Residual risk** | Low. Phase-gated approach limits downside to 365M. Shadow testing provides evidence before committing more. |

---

### RISK 2: Credit Officers Không Adopt

| Attribute | Detail |
|-----------|--------|
| **Description** | COs ignore AI recommendations (override >50%), bypass system, or sabotage (rubber-stamp without review). Operational benefit not realized. |
| **Likelihood** | 🟡 Medium-High (40%) — resistance to change is natural |
| **Impact** | 🔴 High — AI investment has no operational value if COs don't use it |
| **Root cause** | Fear of job loss. Distrust of AI. Poor UX. Forced change without involvement. |
| **Mitigation** | |

| # | Action | When | Effect |
|---|--------|------|--------|
| 1 | **CO interviews BEFORE design** | Week 9 (in progress) | Design based on real needs, not assumptions. |
| 2 | **4-week onboarding sequence** | Before limited deployment | Shadow → Dual → AI-First → Standard. Build trust gradually. |
| 3 | **"AI assists, không replace" messaging** | Pre-deployment + ongoing | Address job security fear proactively. CO ký mọi quyết định = their authority maintained. |
| 4 | **Override always available** | Design principle | CO can override any AI recommendation. No friction. Override = exercising judgment, not defying system. |
| 5 | **Monthly calibration sessions** | Post-deployment | Show CO where AI was right AND wrong. Build calibrated trust. |
| 6 | **Freed capacity → higher-value work** | HR + management | COs reassigned to complex underwriting, collections, relationship — not laid off. |

| **Residual risk** | Medium. Change management takes time. Expect 3-6 months for full adoption. Monitor override rate as leading indicator. |

---

### RISK 3: Regulatory Compliance Failure

| Attribute | Detail |
|-----------|--------|
| **Description** | Violation of Luật AI 134/2025, Luật BVDLCN 91/2025, hoặc yêu cầu SBV. Regulatory fine, reputational damage, forced shutdown. |
| **Likelihood** | 🟢 Low (15%) — AI-CRDS designed for VN compliance from Day 1 |
| **Impact** | 🔴 Very High — regulatory action, reputation, potential forced shutdown |
| **Root cause** | Luật AI 134/2025 mới (effective 01/03/2026), NĐ hướng dẫn chưa ban hành, interpretation uncertain. |
| **Mitigation** | |

| # | Action | When | Effect |
|---|--------|------|--------|
| 1 | **Human-in-the-loop bắt buộc** | Design principle | CO ký mọi quyết định. AI = support only. Không thỏa hiệp. |
| 2 | **AI labeling** | Every AI-involved output | "Quyết định được hỗ trợ bởi AI" — Luật AI 134/2025. |
| 3 | **DPIA** | Draft Phase 0, submit A05 trước Phase 1 real data | NĐ 356/2025 Đ.19 compliance. |
| 4 | **Opt-out mechanism** | Consent form design | Customer can choose 100% manual. NĐ 356 Đ.9. |
| 5 | **Audit trail 24 fields, immutable** | Core system design | SBV inspection ready in <15 minutes. |
| 6 | **Bias monitoring** | Ongoing (gender/geography/age) | Luật AI Đ.4: không phân biệt đối xử. Proactive, not reactive. |
| 7 | **Compliance Officer involved from Week 2** | Ongoing | Early involvement = ally, not blocker. |

| **Residual risk** | Low. AI-CRDS is more compliant than current manual process (which has no audit trail, no explainability, no bias monitoring). |

---

### RISK 4: Integration với CBS/CIC Phức Tạp Hơn Dự Kiến

| Attribute | Detail |
|-----------|--------|
| **Description** | CBS không có API. CIC H2H format khó parse. eKYC provider switch. Integration timeline extends 2-3x. |
| **Likelihood** | 🟡 Medium (35%) — common in VN banking |
| **Impact** | 🟡 Medium — delays Phase 1, nhưng không kill project |
| **Root cause** | Legacy CBS (T24/Flexcube versions vary). CIC protocol evolution. Bank IT resource constraint. |
| **Mitigation** | |

| # | Action | When | Effect |
|---|--------|------|--------|
| 1 | **Phase 0 dùng synthetic data** | Phase 0 | Zero integration dependency. MVP works without any Bank X API. |
| 2 | **IT assessment Week 1-2** | Phase 0 start | Know integration reality before committing Phase 1 budget. |
| 3 | **Adapter pattern architecture** | Design principle | AI-CRDS → Adapter → CBS. Swap adapter if CBS method changes. No core rewrite. |
| 4 | **Phase 1 budget includes IT integration** | Phase 1 budget | 180M allocated for IT integration support (40% IT FTE, 16 weeks). |
| 5 | **Fallback: batch/DWH if no API** | Architecture contingency | Less ideal (stale data) but functional. Timeline extends 4-8 weeks. |

| **Residual risk** | Low-Medium. Worst case = Phase 1 delayed 4-8 weeks. Not fatal. Phase 0 unaffected. |

---

### RISK 5: NPL Tăng Sau Deployment

| Attribute | Detail |
|-----------|--------|
| **Description** | AI scoring leads to more bad approvals. NPL increases above baseline. Financial loss + regulatory scrutiny. |
| **Likelihood** | 🟢 Low (15%) |
| **Impact** | 🔴 High — financial loss, SBV scrutiny, reputation |
| **Root cause** | Threshold too low (easy credit trap). Model drift. Adversarial applicants game the system. CO rubber-stamping. |
| **Mitigation** | |

| # | Action | When | Effect |
|---|--------|------|--------|
| 1 | **Threshold do Risk Committee approve** | Before deployment | PM proposes, Committee decides. Không PM quyết đơn phương. |
| 2 | **Guardrail: NPL +200bps → emergency stop** | Ongoing | Auto-pause State 1 (auto-route). All cases → full manual review. |
| 3 | **Shadow testing 4 tuần TRƯỚC khi AI affect decisions** | Phase 0 | Validate AI accuracy on real data. No risk during shadow. |
| 4 | **Limited deployment (subset only) trước full** | Phase 1 | Start with low-risk, high-confidence cases. Scale gradually. |
| 5 | **DPD 30+ early warning** | Monthly monitoring (Phase 1+) | Detect NPL trend 60 days before DPD 90 (actual NPL). React early. |
| 6 | **Champion-Challenger** | Phase 2+ | New model chạy parallel, must beat champion before deploy. |

| **Residual risk** | Low. Multiple layers of protection. Worst case: revert to manual process (status quo, not worse). |

---

### RISK 6: Vendor Lock-in (nếu mua vendor thay vì build)

| Attribute | Detail |
|-----------|--------|
| **Description** | Context: AI-CRDS proposal là build in-house. Nhưng nếu switch to vendor later → lock-in risk. |
| **Likelihood** | 🟢 Low (10%) — in-house build = no vendor dependency |
| **Impact** | 🟢 Low — Bank X owns 100% IP |
| **Root cause** | N/A for in-house build. Only relevant if decision changes to buy. |
| **Mitigation** | Build in-house → Bank X owns code, model, data, architecture. Can switch approach anytime. |

| **Residual risk** | Near zero. In-house build = full control. |

---

### RISK 7: Data Breach / Security Incident

| Attribute | Detail |
|-----------|--------|
| **Description** | AI-CRDS system compromised. Customer PII leaked. Regulatory fine, reputation damage, customer trust lost. |
| **Likelihood** | 🟢 Low (10%) — with proper security controls |
| **Impact** | 🔴 Very High — regulatory, reputation, financial |
| **Root cause** | Insufficient security controls. Insider threat. External attack. |
| **Mitigation** | |

| # | Action | When | Effect |
|---|--------|------|--------|
| 1 | **Align with Bank X security policies** | Design phase | SSO, MFA, RBAC, encryption at rest + transit. |
| 2 | **PII minimization** | Design principle | AI-CRDS stores minimum PII needed. No raw biometrics. Pseudonymized audit trail. |
| 3 | **Penetration testing** | Before production (Phase 1) | External pentest + fix critical findings. |
| 4 | **Breach notification SOP** | Documented (Phase 0) | 72h notification per NĐ 356. Process ready before go-live. |
| 5 | **Dev/staging: synthetic data only** | Enforced | No real PII in non-production environments. |

| **Residual risk** | Low. AI-CRDS adds new attack surface — but with proper controls, risk manageable. Current manual process also has data breach risk (paper files, unencrypted CBS access). |

---

## 3. RISK MITIGATION SUMMARY

| Risk | Pre-mitigation | Post-mitigation | Key control |
|------|---------------|-----------------|------------|
| R1: AI performance | 🟡 Medium × 🔴 High | 🟢 Low × 🟡 Medium | Shadow testing + kill switch |
| R2: CO adoption | 🟡 Medium × 🔴 High | 🟡 Medium × 🟡 Medium | 4-week onboarding + override rights |
| R3: Regulatory | 🟢 Low × 🔴 Very High | 🟢 Low × 🟡 Medium | Designed for compliance from Day 1 |
| R4: Integration | 🟡 Medium × 🟡 Medium | 🟢 Low × 🟢 Low | Synthetic data Phase 0 + adapter pattern |
| R5: NPL spike | 🟢 Low × 🔴 High | 🟢 Low × 🟡 Medium | Risk Committee threshold + guardrails |
| R6: Vendor lock-in | 🟢 Low × 🟢 Low | Near zero | Build in-house |
| R7: Data breach | 🟢 Low × 🔴 Very High | 🟢 Low × 🟡 Medium | Bank X security + pentest + PII minimization |

---

## 4. THE "WHAT IF IT FAILS" ANSWER

```
C-level hỏi: "Nếu project fail thì sao?"

Trả lời:

"Phase 0 (8 tuần, 365M) = maximum downside nếu fail tại Gate 0.
365M = 1.5 ngày thiệt hại hiện tại (95.65 tỷ ÷ 365 = 262M/ngày).

Nếu Phase 0 fail → chúng ta học được:
- Data quality tại Bank X (có thể dùng cho projects khác)
- AI feasibility assessment (save time cho future AI initiatives)
- CO workflow insights (improve current manual process)
- Compliance readiness (DPIA progress, Luật AI assessment)

Nếu Phase 1 fail → chúng ta có:
- Phase 0 deliverables (above)
- Real shadow testing data (model performance evidence)
- CO training completed (useful regardless)
- Full compliance framework (transferable)
- Sunk cost: 1.68 tỷ = ~6.5 ngày thiệt hại hiện tại

Nếu full deployment fail → we revert to manual process (status quo).
No worse than today. System can be paused instantly (kill switch)."
```

---

## Tracking

- [ ] Top 5 risks address C-level objections?
- [ ] Mỗi risk có specific mitigation (không generic)?
- [ ] "What if it fails" answer rehearsed?
- [ ] Phase 0 kill criteria clear? (Section 2, R1)
- [ ] NPL guardrail (+200bps → emergency stop) — Risk Manager agreed?
- [ ] Security risk mitigation — IT Security reviewed?
