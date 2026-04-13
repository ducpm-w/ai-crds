# Implementation Roadmap — AI-Native CRDS
> **Dự án:** AI-Native Credit Risk Decision Support
> **File:** 06/07 — Internal Proposal
> **Ngày:** 09/04/2026

---

## 1. THREE PHASES — Overview

```
PHASE 0                    PHASE 1                      PHASE 2
DISCOVERY & SHADOW         LIMITED DEPLOYMENT            FULL DEPLOYMENT
8 tuần │ 365M VND          16 tuần │ 1.32 tỷ VND        Ongoing │ 2-4 tỷ/năm

Wk 1-2   Wk 3-4   Wk 5-8  Wk 9-12  Wk 13-16  Wk 17-20 Wk 21-24 Wk 25+
┌──────┐┌──────┐┌────────┐┌───────┐┌────────┐┌────────┐┌────────┐┌──────┐
│Data  ││MVP   ││Shadow  ││Train  ││Limited ││Monitor ││Results ││Full  │
│Assess││Build ││Testing ││& CMS  ││Deploy  ││& Iter. ││& Scale ││Deploy│
└──────┘└──────┘└────────┘└───────┘└────────┘└────────┘└────────┘└──────┘
         │               │                   │                    │
     DEMO DAY      GATE 0→1           GATE 1→2              GATE 2→SCALE
     (internal)    Go/No-Go           Full deploy?           Expand?
```

---

## 2. PHASE 0 — DISCOVERY & SHADOW TESTING (8 tuần, 365M)

**⚠️ ĐÂY LÀ PHẦN XIN PHÊ DUYỆT**

| Week | Activity | Deliverable | Risk |
|------|---------|------------|------|
| **1-2** | Data quality assessment. Verify CBS/CIC/eKYC data availability. Confirm IT integration path. | Data quality report. Integration feasibility confirmed. | CBS API may not exist → fallback plan documented |
| **3-4** | MVP build with synthetic data. Logistic regression model. Basic CO review UI. Audit trail. | Working demo: application → AI score → explanation → CO review → audit log | Technical: achievable with synthetic data |
| **5** | Internal demo to stakeholders. CO usability test (3-5 COs). Collect feedback. Update MVP. | Demo delivered. CO feedback captured. MVP v1.1. | CO resistance → address in change management |
| **6-8** | Shadow testing (4 tuần). AI chạy parallel trên real applications. AI scores logged, không ảnh hưởng quyết định thật. CO xem AI scores (optional). | Shadow testing report: AI vs manual comparison (accuracy, consistency, speed) | Data quality issues in real data → document gaps |
| **8** | Go/No-Go analysis. Present results. Prepare Phase 1 proposal nếu Go. | Go/No-Go report + Phase 1 plan (nếu Go) | Results may not be conclusive → extend shadow 2-4 weeks |

### Phase 0 Success Criteria (Gate 0→1)

| Criterion | Threshold | Measured by |
|----------|----------|-----------|
| AI scoring functional | Score + explanation generated for ≥95% of applications | System logs |
| AI vs manual alignment | AI agrees with CO decision ≥70% of cases | Shadow testing comparison |
| AI catches cases CO missed | ≥5 cases where AI flagged risk CO didn't | Shadow testing review |
| System stability | Uptime ≥99%, latency <30s, error rate <1% | Monitoring |
| Stakeholder support | Risk Manager + Head of Cards support Phase 1 | Verbal/written confirmation |
| No compliance blockers | DPIA progressing, no legal showstoppers | Compliance confirmation |

### Phase 0 Kill Criteria (Stop nếu)

| Kill criterion | Why |
|---------------|-----|
| AI alignment with CO < 50% | Model fundamentally wrong — need different approach |
| CBS/CIC data quality unusable | Cannot build reliable model — need data remediation first |
| Risk Manager vetoes | Risk concern too high — address before proceeding |
| CO unanimous rejection | Change management failure — redesign approach |

---

## 3. PHASE 1 — LIMITED DEPLOYMENT (16 tuần, 1.32 tỷ)

**Chỉ nếu Phase 0 pass Gate 0→1.**

| Week | Activity | Deliverable |
|------|---------|------------|
| **9-10** | CO training (4-week onboarding). Change management kickoff. DPIA finalize. | Trained COs. DPIA submitted A05. |
| **11-12** | Production integration (CBS, CIC, eKYC). Hardened audit trail. Security review. | Production-ready system |
| **13-14** | Limited deployment: AI recommend on subset applications (low-risk, high-confidence only). CO review ALL AI recommendations. | Limited deployment live. Daily monitoring. |
| **15-16** | Monitor, iterate, collect evidence. Prepare full deployment proposal. | Limited deployment results. Phase 2 proposal. |
| **17-20** | Extended monitoring. Threshold optimization. Model improvement. | Updated ROI with real numbers. |
| **21-24** | Full deployment approval process. Expand scope. Stabilize. | Full deployment approval. 30-day impact report. |

### Phase 1 Success Criteria (Gate 1→2)

| Criterion | Threshold |
|----------|----------|
| NPL of AI-recommended cohort | ≤ current baseline (3.5%) |
| Override rate | 10-30% (calibrated trust zone) |
| CO satisfaction | ≥3/5 on trust survey |
| SLA compliance | ≥90% |
| System stability (production) | Uptime ≥99.5%, error rate <0.5% |
| No compliance incidents | Zero SBV findings, zero PDPD complaints |

---

## 4. PHASE 2 — FULL DEPLOYMENT & SCALE (Ongoing, 2-4 tỷ/năm)

| Period | Activity |
|--------|---------|
| **Week 25-28** | Full deployment: all CC origination applications. Full monitoring. |
| **Week 29-32** | Stabilize. 90-day impact report. ROI validation. |
| **Week 33+** | Ongoing: model improvement cycle, champion-challenger, drift monitoring. |
| **Week 37+** | Expansion assessment: CC self-employed? Consumer loans? Early warning system? |

---

## 5. RESOURCE PLAN

### Phase 0 (8 tuần)

| Role | Source | Allocation | Cost |
|------|--------|-----------|------|
| AI Product Manager | Internal (existing) | 50% | 72M (internal allocation) |
| Senior Data Scientist | **Hire contract** | 100% | 160M |
| IT Integration Support | Internal | 20% | 45M |
| Infrastructure | Cloud + tools | N/A | 48M |
| Contingency | | | 40M |
| **Total** | | **2.8 FTE-eq** | **365M** |

### Phase 1 (16 tuần) — Conditional

| Role | Source | Allocation | Cost |
|------|--------|-----------|------|
| AI Product Manager | Internal | 80% | 230M |
| Senior Data Scientist | Continue contract → consider FTE | 100% | 320M |
| ML Engineer | **Hire** | 100% | 260M |
| Frontend Developer | Internal/contract | 50% | 130M |
| IT Integration | Internal | 40% | 180M |
| Infrastructure | Production cloud | N/A | 120M |
| Training & Change Mgmt | Internal | | 80M |
| **Total** | | **~5 FTE-eq** | **1.32 tỷ** |

### Key Hire: Senior Data Scientist

- **Critical for Phase 0.** Cannot start without.
- Lead time: 4-8 weeks recruiting. Start ASAP if Phase 0 approved.
- Profile: 3+ years credit scoring / ML in banking. Python, scikit-learn, XGBoost. Vietnamese financial data experience preferred.
- Contract option reduces commitment risk: 8 weeks → extend if Phase 0 passes.

---

## 6. KEY MILESTONES

```
Week after approval:

 0     2     4     5     8     12    16    20    24    28    32
 │     │     │     │     │     │     │     │     │     │     │
 ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼
 Start Data  MVP   Demo  Gate  Train Limited     Full  90-day
       done  v1    Day   0→1   done  deploy      deploy report
                               DPIA        Gate
                               submit      1→2
```

| Milestone | Week | Significance |
|-----------|------|-------------|
| **Phase 0 Start** | 0 | Budget released, hiring starts |
| **Data Assessment Done** | 2 | Know data quality → model feasibility confirmed |
| **MVP Demo** | 5 | Internal stakeholders see working system |
| **Gate 0→1** | 8 | Go/No-Go for Phase 1. Maximum downside = 365M. |
| **DPIA Submitted** | 12 | Compliance gate for real data usage |
| **Limited Deployment Live** | 16 | First real-world AI recommendations |
| **Gate 1→2** | 24 | Go/No-Go for full deployment |
| **Full Deployment** | 25 | AI-CRDS live on all CC origination |
| **90-day Impact Report** | 37 | Actual ROI validation → expansion decision |

---

## 7. DEPENDENCIES & CRITICAL PATH

| Dependency | Blocks | Lead time | Owner | Mitigation if delayed |
|-----------|--------|----------|-------|---------------------|
| **Senior DS hire** | MVP build, model development | 4-8 weeks | HR + PM | Start recruiting BEFORE Phase 0 approval. Contract option. |
| **CBS API confirmation** | Production integration | IT assessment (Week 1-2) | IT | If no API → adapter pattern. Timeline extends 4-8 weeks in Phase 1. Phase 0 unaffected (synthetic data). |
| **CIC H2H confirmation** | Real-time scoring | IT assessment (Week 1-2) | IT | If no H2H → manual CIC fallback. Model accuracy reduces. |
| **DPIA completion** | Real data usage (Phase 1) | 8-12 weeks (draft → legal → submit A05) | Compliance + Legal | Start DPIA in Phase 0 Week 1. Parallel track. |
| **Risk Committee approval of thresholds** | Limited deployment | 1-2 meetings | Risk Manager | Pre-align in Phase 0. Present threshold framework early. |

---

## Tracking

- [ ] Phase 0 budget 365M — CFO pre-approved?
- [ ] Key hire (Senior DS) — recruiting started?
- [ ] IT meeting for CBS/CIC assessment — scheduled Week 1-2?
- [ ] DPIA parallel track — Compliance aware?
- [ ] Risk Committee meeting — scheduled for threshold review?
