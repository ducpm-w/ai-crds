# To-Be Workflow — CC Origination with AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Map quy trình CC origination với AI-CRDS. Tham chiếu W5 decision states (S1-S5) + W6 thresholds + W7 KPIs. Document này là blueprint cho MVP build (Week 12).

---

## 1. END-TO-END FLOW — 5 STAGES

```
┌──────────────────────────────────────────────────────────────┐
│            TO-BE: CC ORIGINATION WITH AI-CRDS                 │
│            AI-assisted, Human-in-the-loop                     │
│            Est. end-to-end: 1-8 giờ (State 1) to 1-3 ngày    │
└──────────────────────────────────────────────────────────────┘

  STAGE 1          STAGE 2           STAGE 3         STAGE 4        STAGE 5
┌──────────┐   ┌─────────────┐   ┌───────────┐   ┌──────────┐   ┌──────────┐
│ Data     │──▶│ Identity &  │──▶│ AI        │──▶│ Human    │──▶│ Post-    │
│ Collect  │   │ Fraud Gate  │   │ Scoring & │   │ Decision │   │ Decision │
│ & Valid. │   │ (parallel)  │   │ Routing   │   │          │   │          │
│          │   │             │   │           │   │          │   │          │
│ 1-5 sec  │   │ 5-30 sec    │   │ 2-5 sec   │   │ 3-35 min │   │ <1 min   │
└──────────┘   └─────────────┘   └───────────┘   └──────────┘   └──────────┘
      │               │                │                │              │
  Auto-fill       eKYC fail        Fraud flag      CO ký quyết    Adverse action
  from app        CIC down         AI route to     định cuối      Audit trail
  + eKYC OCR      Data missing     S1/S2/S3/S4/S5 cùng           CC issuance
                  → State 5                        Override OK     Notification
```

---

## 2. STAGE DETAILS

### STAGE 1 — Data Collection & Validation (1-5 giây)

| Attribute | As-Is | To-Be | Improvement |
|-----------|-------|-------|------------|
| **Data entry** | Manual by staff (10-20 min) | Auto-ingest from online form/app. Branch: staff enters, eKYC OCR assists. | **-80% time** |
| **Validation** | Manual check by back-office | **Real-time automated validation:** required fields, format check, age ≥ 21, income > 0, CCCD format. | Instant feedback, no downstream errors |
| **Duplicate check** | Manual/none | **Automated:** same CCCD + same product within 30 days → flag | Prevent duplicate processing |
| **Customer opt-out** | N/A | **New:** Customer can choose "Tôi muốn review thủ công" → bypass AI, route to State 2 (NĐ 356 compliance) | Regulatory compliance |
| **System** | CBS manual entry | AI-CRDS application gateway → CBS | Seamless |

**Output:** Validated application record, ready for Stage 2.

### STAGE 2 — Identity & Fraud Gate (5-30 giây, parallel)

**Key design: tất cả checks chạy PARALLEL, không sequential.**

```
Application validated
    │
    ├──[PARALLEL]──┬──────────────┬────────────────┬───────────────┐
    │              │              │                │               │
    ▼              ▼              ▼                ▼               ▼
 eKYC           CIC API       Blacklist        Device          Velocity
 verify         query         check            fingerprint     check
 (VNPT/FPT)    (H2H)         (internal+SIMO)  (online only)   (same CCCD
                                                                30 days)
    │              │              │                │               │
    └──────────────┴──────────────┴────────────────┴───────────────┘
                              │
                    ┌─────────┤
                    │         │
               ANY FAIL    ALL PASS
               or FLAG         │
                    │          │
                    ▼          ▼
              Route to     → Stage 3
              S3 or S5     (AI Scoring)
```

| Check | Latency | Fallback if fail | Blocking for MVP? |
|-------|---------|-----------------|-------------------|
| eKYC | 5-15 sec | State 5 (retry/branch visit) | ✅ Yes |
| CIC API | 5-30 sec | State 5 (retry/manual query) | ✅ Yes |
| Blacklist (internal) | < 1 sec | State 3 if match | ✅ Yes |
| SIMO | ❓ sec | ❓ Cần confirm integration | ⚠️ Nice-to-have for MVP |
| Device fingerprint | < 1 sec | Skip (online only feature) | ❌ No (Phase 1+) |
| Velocity check | < 1 sec | State 3 if triggered | ✅ Yes (simple logic) |

**Output:** eKYC results, CIC data, fraud signals → feed into Stage 3.

### STAGE 3 — AI Scoring & Routing (2-5 giây)

```
Inputs from Stage 2:
├── Customer demographics (CBS/application)
├── CIC data (score, debt, DPD, inquiries)
├── eKYC results (confidence, face match)
├── Fraud signals (blacklist, velocity)
└── Behavioral data (CBS, if existing customer)
    │
    ▼
┌─────────────────────────────┐
│     FEATURE ENGINE          │
│ Pre-process + derive:       │
│ - DTI = debt / income       │
│ - Age from DOB              │
│ - Income verified flag      │
│ - Thin file flag            │
└─────────────┬───────────────┘
              │
    ┌─────────┼──────────┐
    │         │          │
    ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│ CREDIT │ │ FRAUD  │ │ BIAS   │
│ SCORING│ │ SCORING│ │ MONITOR│
│ MODEL  │ │ MODEL  │ │        │
│        │ │        │ │ Gender │
│ Output:│ │ Output:│ │ Geo    │
│ score  │ │ fraud  │ │ Age    │
│ conf.  │ │ score  │ │ → log  │
│ explain│ │ flag   │ │ only   │
└───┬────┘ └───┬────┘ └───┬────┘
    │          │          │
    └──────────┼──────────┘
               │
    ┌──────────┴──────────┐
    │   ROUTING ENGINE    │
    │                     │
    │ Apply thresholds:   │
    │ TH_high = 0.75      │
    │ TH_low = 0.35       │
    │ TH_fraud = 0.40     │
    │ TH_confidence = 0.60│
    │ Dead zone ±0.02     │
    └──────────┬──────────┘
               │
    ┌────┬─────┼─────┬────┐
    ▼    ▼     ▼     ▼    ▼
   S1   S2    S3    S4   S5
```

| Output field | Type | Used by |
|-------------|------|---------|
| `risk_score` | float 0.0-1.0 | Routing, CO display, audit trail |
| `confidence` | float 0.0-1.0 | Routing (< 0.60 → S4), CO display |
| `fraud_score` | float 0.0-1.0 | Routing (> 0.40 → S3), fraud team |
| `recommendation` | enum | CO display: APPROVE / REVIEW / ESCALATE |
| `explanation` | list of strings | CO display: top 3-5 factors. Adverse action: top 3. |
| `segment` | enum | existing_customer / new_to_bank / thin_file |
| `ai_label` | boolean | Luật AI 134/2025: "hỗ trợ bởi AI" |
| `bias_log` | object | Gender, geography, age → monitoring only |

### STAGE 4 — Human Decision (time varies by state)

**Same authority structure as as-is. Key difference: CO has AI context.**

| State | CO Action | AI provides | Time | Ref |
|-------|----------|------------|------|-----|
| **S1** (Auto-route approve) | Batch confirm. Review summary, confirm/override. | Risk score, confidence, top 3 positive factors, CIC summary. | **3-5 min** | decision-architecture.md |
| **S2** (Standard review) | Full individual review. Approve/reject/escalate. | Score, confidence, top 3 risk + positive factors, full CIC, AI recommendation. | **20-35 min** | decision-architecture.md |
| **S3** (Priority fraud) | Enhanced due diligence. Clear/confirm fraud. | Fraud score, fraud triggers list, EDD checklist, cross-check results. | **30-60 min** | decision-architecture.md |
| **S4** (Escalate) | Senior CO full underwriting. | Score, confidence (low), anomaly flags, conflicting signals. | **30-60 min** | decision-architecture.md |
| **S5** (Need more info) | System requests docs from customer. CO processes when received. | Missing data list, request template. | **10 min CO** + customer wait (14 days max) | decision-architecture.md |

**Unchanged principle:** CO ký quyết định cuối cùng. AI là decision support. Human-in-the-loop = non-negotiable (Luật TCTD 2024, Luật AI 134/2025).

### STAGE 5 — Post-Decision (< 1 phút, automated)

```
CO decision signed
    │
    ├── IF APPROVED:
    │   ├── Generate approval notification (app/SMS/email)
    │   │   Include: "Quyết định được hỗ trợ bởi AI" (Luật AI label)
    │   ├── Trigger CC issuance queue
    │   ├── Write audit trail (24 fields, immutable)
    │   ├── Start post-approval monitoring
    │   └── Feed outcome to model training pipeline (future ground truth)
    │
    ├── IF REJECTED:
    │   ├── Generate adverse action notice (adverse-action-flow.md)
    │   │   Include: top 3 reasons (plain language) + AI label + rights info
    │   ├── Send via: app + email + SMS (multi-channel)
    │   ├── Write audit trail (24 fields)
    │   ├── Start PII retention timer per terminal state
    │   └── Enable complaint/human review request channel
    │
    └── IF REJECTED_FRAUD:
        ├── All REJECTED actions above +
        ├── SIMO report (TT 45/2025)
        ├── Internal blacklist update
        └── Law enforcement referral (if applicable)
```

---

## 3. IMPROVEMENT SUMMARY — AS-IS vs TO-BE

| Metric | As-Is | To-Be | Improvement | Source |
|--------|-------|-------|------------|--------|
| **Time-to-decision (S1)** | 20-45 min review + queue | 3-5 min batch confirm | **-85%** | decision-architecture.md |
| **Time-to-decision (overall median)** | 2-4 ngày | 4-8 giờ | **-80%** | Calculated |
| **CO capacity needed** | ~10 FTE | ~4.3 FTE | **-56%** | decision-architecture.md |
| **Consistency** | CO-dependent (high variance) | AI baseline + CO judgment | Standardized | Core value proposition |
| **CIC query** | Manual/batch (min to hours) | Real-time API (5-30 sec) | **-99% time** | Integration design |
| **Fraud detection** | eKYC pass/fail only | Multi-signal AI scoring | **+30% detection** (A22) | damage-model.md |
| **Explainability** | "Không đủ điều kiện" | Top 3 factors + right to human review | **NĐ 356 + Luật AI compliant** | adverse-action-flow.md |
| **Audit trail** | ~5-8 fields, manual | 24 fields, automated, immutable | **SBV inspection ready** | sbv-requirements.md |
| **Adverse action** | Vague generic notice | Specific reasons + AI label + rights | **Regulatory compliant** | adverse-action-flow.md |
| **Bias monitoring** | None | Gender/geography/age monitored | **Luật AI 134/2025 compliant** | guardrail-definitions.md |

---

## 4. DATA FLOW DIAGRAM

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  CUSTOMER   │         │  AI-CRDS    │         │  BANK X     │
│  CHANNELS   │         │  SYSTEM     │         │  SYSTEMS    │
│             │         │             │         │             │
│ Online form ├────────▶│ Application ├────────▶│ CBS         │
│ Mobile app  │ submit  │ Gateway     │ write   │ (customer   │
│ Branch      │         │             │         │  record)    │
└─────────────┘         │      │      │         └──────┬──────┘
                        │      │      │                │ read
                        │      ▼      │                ▼
                        │ ┌──────────┐│         ┌─────────────┐
                        │ │Validation││         │ CIC API     │
                        │ │Engine    ││◀────────│ (H2H)       │
                        │ └────┬─────┘│ query   └─────────────┘
                        │      │      │
                        │      ▼      │         ┌─────────────┐
                        │ ┌──────────┐│         │ eKYC        │
                        │ │ Feature  ││◀────────│ Provider    │
                        │ │ Engine   ││ verify  │ (VNPT/FPT)  │
                        │ └────┬─────┘│         └─────────────┘
                        │      │      │
                        │      ▼      │         ┌─────────────┐
                        │ ┌──────────┐│         │ SIMO        │
                        │ │ Scoring  ││◀────────│ (TT 45)     │
                        │ │ + Routing││ check   └─────────────┘
                        │ └────┬─────┘│
                        │      │      │
                        │      ▼      │
                        │ ┌──────────┐│         ┌─────────────┐
                        │ │ CO       ││         │ Notification│
                        │ │ Review   ││────────▶│ System      │
                        │ │ UI       ││ trigger │ (SMS/Email/ │
                        │ └────┬─────┘│         │  Push)      │
                        │      │      │         └─────────────┘
                        │      ▼      │
                        │ ┌──────────┐│         ┌─────────────┐
                        │ │ Audit    ││         │ Card Ops    │
                        │ │ Trail DB ││────────▶│ (Issuance)  │
                        │ └──────────┘│ trigger └─────────────┘
                        └─────────────┘
```

---

## 5. STATE DISTRIBUTION & VOLUME

Ref: decision-architecture.md, approval-rate-curve.md (TH_high = 0.75)

| State | % Volume | Apps/tháng | CO Time/app | CO Hours/tháng | Key metric |
|-------|---------|-----------|------------|---------------|-----------|
| S1 Auto-route | 35-45% | ~1,200 | 4 min (batch) | 80h | Batch confirm ratio |
| S2 Standard | 25-35% | ~900 | 25 min (full) | 375h | Override rate |
| S3 Fraud | 2-5% | ~100 | 45 min (EDD) | 75h | Fraud detection rate |
| S4 Escalate | 5-10% | ~225 | 45 min (senior) | 169h | Escalation rate |
| S5 Need-info | 8-15% | ~375 | 10 min (process) | 63h | Conversion rate |
| **Total** | **100%** | **3,000** | **~15 min avg** | **762h (4.3 FTE)** | RARPA |

---

## 6. IMPLEMENTATION PHASING

| Phase | Scope | Timeline | What's live |
|-------|-------|---------|-----------|
| **MVP (Week 12)** | Synthetic data. S1/S2 only. Basic UI. Logistic regression. | Week 12 | Demo end-to-end flow |
| **Shadow (Week 37-40)** | Real data. All 5 states. AI chạy parallel, không ảnh hưởng decision. | Week 37 | AI vs manual comparison |
| **Limited (Week 41-43)** | AI recommend, CO review all. Low-risk subset only. | Week 41 | Subset live |
| **Full (Week 45+)** | All applications, all states, full monitoring. | Week 45 | Production |

---

## Tracking

- [ ] To-be flow đã review với IT (integration feasibility)?
- [ ] Parallel processing (Stage 2) — IT confirm all APIs can run parallel?
- [ ] Feature engine design — DS confirm feature pipeline feasible?
- [ ] CO review UI — UX designer assigned? (Week 9)
- [ ] Audit trail write — IT confirm immutable DB design?

---

## Ghi Chú

1. **To-be flow assumes CIC H2H API available.** Nếu chỉ manual portal → Stage 2 sẽ khác đáng kể (async CIC query + State 5 wait).
2. **Parallel processing (Stage 2)** là key performance driver. Nếu sequential → latency tăng gấp 3-5x.
3. **Cross-reference:** decision-architecture.md (5 states detail), threshold-framework.md (routing logic), feature-availability-matrix.md (feature inputs), adverse-action-flow.md (Stage 5 reject flow).