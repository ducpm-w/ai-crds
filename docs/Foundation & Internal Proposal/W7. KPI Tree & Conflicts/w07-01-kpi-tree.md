# KPI Tree — AI-CRDS
> **Tags:** `[Product]` `[Business]` `[Risk]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 7
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

KPI tree 3 tầng aligned với Bank X scorecards. Balance Business (revenue) + Risk (NPL/fraud) + Compliance (audit/bias). Cần pre-align với Head of Cards + Risk Manager trước khi finalize.

---

## 1. KPI TREE — 3 TẦNG

```
┌─────────────────────────────────────────────────────────────────┐
│ LEVEL 1 — NORTH STAR METRIC                                     │
│                                                                  │
│   Risk-Adjusted Revenue per CC Application (RARPA)               │
│   = (Revenue generated - Credit loss - Fraud loss - Ops cost)    │
│     ÷ Total applications                                        │
│                                                                  │
│   Baseline (ước tính): (64.8 tỷ - 26.5 tỷ - 14.4 tỷ - 2.95 tỷ)│
│                         ÷ 36,000 apps/năm                       │
│                       = 583K VND/application                     │
│   Target AI-CRDS:     ≥ 700K VND/application (+20%)             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   BUSINESS    │    │      RISK        │    │   OPERATIONS     │
│   METRICS     │    │    METRICS       │    │   METRICS        │
│               │    │                  │    │                  │
│ L2-B1 Approval│    │ L2-R1 NPL rate   │    │ L2-O1 Manual     │
│   rate (%)    │    │   (%)            │    │   review rate (%)│
│               │    │                  │    │                  │
│ L2-B2 Time-to-│    │ L2-R2 Fraud rate │    │ L2-O2 CO capacity│
│   decision (h)│    │   origination (%)│    │   utilization (%)│
│               │    │                  │    │                  │
│ L2-B3 Volume  │    │ L2-R3 Expected   │    │ L2-O3 SLA        │
│   issued/tháng│    │   Loss per app   │    │   compliance (%) │
└───────┬───────┘    └────────┬─────────┘    └────────┬─────────┘
        │                     │                       │
        ▼                     ▼                       ▼
┌───────────────────────────────────────────────────────────────┐
│ LEVEL 3 — DIAGNOSTIC METRICS (explain WHY L2 moves)           │
│                                                               │
│ Model Performance          Workflow Health        Compliance  │
│ ├── AI confidence dist.    ├── State distribution ├── Audit   │
│ ├── Model Gini/AUC/KS     ├── Override rate (%)    trail     │
│ ├── False positive rate    ├── Escalation rate      completeness│
│ ├── False negative rate    ├── Queue depth/age    ├── Adverse │
│ ├── Score stability (PSI)  └── Avg review time      action    │
│ └── Feature drift                                   compliance│
│                                                   ├── Bias    │
│                                                     metrics  │
│                                                   └── Opt-out│
│                                                     rate     │
└───────────────────────────────────────────────────────────────┘
```

---

## 2. LEVEL 1 — NORTH STAR

### Risk-Adjusted Revenue per Application (RARPA)

| Attribute | Detail |
|-----------|--------|
| **Formula** | (CC Revenue - Credit Loss - Fraud Loss - Ops Cost) ÷ Total Applications |
| **Why this metric** | Duy nhất balance được cả 3 stakeholders. Business muốn revenue ↑, Risk muốn loss ↓, Ops muốn cost ↓. RARPA tăng chỉ khi tổng thể improve — không thể game bằng cách optimize 1 bên. |
| **Baseline** | ~583K VND/application (ước tính, xem damage-model.md) |
| **Target** | ≥ 700K VND/application (+20%) sau 6 tháng full deployment |
| **Owner** | Head of Cards (primary) + Risk Manager (co-owner) |
| **Frequency** | Monthly |
| **Data source** | Tổng hợp từ CBS (revenue), CIC (NPL), fraud records, ops cost |

### Why NOT other candidates for North Star?

| Candidate | Why rejected |
|----------|-------------|
| Approval rate | Business-only metric. Tăng approval rate bằng cách hạ threshold → NPL tăng → không phải improvement thật. |
| NPL rate | Risk-only metric. Giảm NPL bằng cách reject nhiều → mất revenue → không phải improvement thật. |
| Time-to-decision | Ops/UX metric. Nhanh nhưng sai decision = worse than slow but right. |
| Volume issued | Vanity metric. Nhiều thẻ nhưng NPL cao = net loss. |

---

## 3. LEVEL 2 — PRIMARY METRICS

### 3.1 Business Metrics

| ID | Metric | Formula | Baseline (est.) | Target | Owner | Frequency |
|----|--------|---------|-----------------|--------|-------|-----------|
| **L2-B1** | **Approval rate** | Approved ÷ Total applications | 60% | 60-65% (maintain or slight improve) | Head of Cards | Weekly |
| **L2-B2** | **Time-to-decision** | Median hours from application to decision | 24-48h (manual) | ≤ 4h (State 1), ≤ 8h (State 2) | Ops Manager | Weekly |
| **L2-B3** | **Volume issued/tháng** | Count of CC issued | ~1,800/tháng | ≥ 1,800 (maintain) | Head of Cards | Monthly |

### 3.2 Risk Metrics

| ID | Metric | Formula | Baseline (est.) | Target | Owner | Frequency |
|----|--------|---------|-----------------|--------|-------|-----------|
| **L2-R1** | **NPL rate** | DPD 90+ ÷ Total outstanding CC | 3.5% | ≤ 3.5% (not worse). Target: 2.8% (-20%) | Risk Manager | Monthly (90-day lag) |
| **L2-R2** | **Fraud rate at origination** | Confirmed fraud ÷ Total applications | 0.8% | ≤ 0.56% (-30%) | Head of Fraud | Monthly |
| **L2-R3** | **Expected Loss per approved app** | EL = PD × LGD × EAD | 1.225M VND | ≤ 1.0M VND | Risk Manager | Monthly |

### 3.3 Operations Metrics

| ID | Metric | Formula | Baseline (est.) | Target | Owner | Frequency |
|----|--------|---------|-----------------|--------|-------|-----------|
| **L2-O1** | **Manual review rate** | State 2+3+4 volume ÷ Total applications | 100% (all manual) | ≤ 55% (45%+ auto-route batch) | Ops Manager | Weekly |
| **L2-O2** | **CO capacity utilization** | Actual CO hours ÷ Available CO hours | ~95% (overloaded) | 70-80% (healthy buffer) | Ops Manager | Weekly |
| **L2-O3** | **SLA compliance rate** | On-time decisions ÷ Total decisions | ❓ Unknown (no SLA currently) | ≥ 90% (all states weighted) | Ops Manager | Weekly |

---

## 4. LEVEL 3 — DIAGNOSTIC METRICS

### 4.1 Model Performance

| ID | Metric | What it tells | Target | Frequency | Alert if |
|----|--------|-------------|--------|-----------|---------|
| **L3-M1** | AI confidence distribution | Model certainty spread | Mean > 0.70 | Weekly | Mean drops > 0.05 from baseline |
| **L3-M2** | Model Gini coefficient | Overall discrimination power | ≥ 0.40 (logistic), ≥ 0.55 (GBM) | Monthly (retrain cycle) | Drop > 0.05 from baseline |
| **L3-M3** | AUC-ROC | Classification accuracy | ≥ 0.75 | Monthly | Drop below 0.70 |
| **L3-M4** | KS statistic | Max separation between good/bad | ≥ 0.30 | Monthly | Drop below 0.25 |
| **L3-M5** | False positive rate (est.) | Good applicants rejected | ≤ 10% (baseline) → target 7% | Monthly (shadow: compare AI reject vs CO approve) | Increase > 2pp from baseline |
| **L3-M6** | False negative rate (est.) | Bad applicants approved | ≤ 3.5% (NPL proxy) | Monthly (90-day lag) | Increase > 0.5pp |
| **L3-M7** | PSI (Population Stability Index) | Score distribution drift | < 0.10 (stable) | Monthly | > 0.20 (significant drift) |
| **L3-M8** | Feature drift | Individual feature distribution shift | CSI < 0.10 per feature | Monthly | Any feature CSI > 0.25 |

### 4.2 Workflow Health

| ID | Metric | What it tells | Target | Frequency | Alert if |
|----|--------|-------------|--------|-----------|---------|
| **L3-W1** | State distribution (S1/S2/S3/S4/S5 %) | Threshold calibration | S1: 35-45%, S2: 25-35%, S3: 2-5%, S4: 5-10%, S5: 8-15% | Weekly | Any state ±10pp from target |
| **L3-W2** | Override rate | CO vs AI alignment | 10-20% | Weekly | > 30% sustained 2 weeks |
| **L3-W3** | Override direction | CO override approve vs reject | Balanced (60% override-to-approve, 40% override-to-reject) | Monthly | > 80% one direction |
| **L3-W4** | Escalation rate (L1→L2) | L1 CO confidence | 10-15% | Weekly | > 25% |
| **L3-W5** | Queue depth (max pending) | Capacity pressure | ≤ 50 per CO | Daily (dashboard) | > 100 per CO |
| **L3-W6** | Avg review time per state | CO efficiency | S1: 4min, S2: 25min, S3: 45min | Weekly | S1 > 10min (not batch reviewing) |
| **L3-W7** | Batch confirm ratio | CO using batch vs individual | S1: ≥ 80% batch | Weekly | < 50% (CO not trusting batch) |

### 4.3 Compliance Metrics

| ID | Metric | What it tells | Target | Frequency | Alert if |
|----|--------|-------------|--------|-----------|---------|
| **L3-C1** | Audit trail completeness | SBV readiness | 100% (24 fields per decision) | Daily (automated) | Any record < 24 fields |
| **L3-C2** | Adverse action compliance | NĐ 356 + Luật AI | 100% rejections have notice | Daily (automated) | Any rejection without notice |
| **L3-C3** | AI label compliance | Luật AI 134/2025 | 100% AI-involved decisions labeled | Daily (automated) | Any AI decision without label |
| **L3-C4** | Gender approval rate gap | Bias — Luật AI 134/2025 | ≤ 5pp gap M vs F | Monthly | > 5pp gap |
| **L3-C5** | Geography approval rate gap | Bias | ≤ 8pp gap urban vs rural | Monthly | > 8pp gap |
| **L3-C6** | Age approval rate gap | Bias | ≤ 10pp gap across age bands | Monthly | > 10pp gap |
| **L3-C7** | Opt-out AI rate | Customer trust in AI | < 5% | Monthly | > 10% (customers don't trust AI) |
| **L3-C8** | Human review request rate | NĐ 356 right to human review | < 3% of rejections | Monthly | > 5% |

---

## 5. METRIC RELATIONSHIPS — HOW THEY CONNECT

```
NORTH STAR: RARPA
    │
    ├── ↑ Revenue (L2-B1 approval rate × L2-B3 volume × LTV)
    │   │
    │   ├── Approval rate driven by:
    │   │   ├── L3-W1 State distribution (more S1 → higher approval)
    │   │   ├── L3-M5 False positive rate (lower → more good approved)
    │   │   └── L3-W2 Override rate (CO override reject → more approved)
    │   │
    │   └── Volume driven by:
    │       ├── L2-B2 Time-to-decision (faster → less customer drop-off)
    │       └── Marketing & channel (outside AI-CRDS scope)
    │
    ├── ↓ Credit loss (L2-R1 NPL × LGD × outstanding)
    │   │
    │   └── NPL driven by:
    │       ├── L3-M2/M3/M4 Model accuracy (better model → catch more bad)
    │       ├── L3-M6 False negative rate (lower → fewer bad approved)
    │       └── L3-W2 Override rate (CO override approve bad → NPL ↑)
    │
    ├── ↓ Fraud loss (L2-R2 fraud rate × avg limit)
    │   │
    │   └── Fraud rate driven by:
    │       ├── L3-W1 State 3 volume (more flagged → more caught)
    │       └── Fraud model quality (separate from credit model)
    │
    └── ↓ Ops cost (L2-O1 manual review rate × cost/review)
        │
        └── Manual review rate driven by:
            ├── L3-W1 State 1 % (more auto-route → less manual)
            ├── L3-W7 Batch confirm ratio (batch → faster per review)
            └── L2-O2 CO utilization (overloaded → SLA miss → more cost)
```

### Leading vs Lagging Indicators

| Type | Metrics | Lag | Use |
|------|---------|-----|-----|
| **Leading** (predict future) | L3-M7 PSI, L3-M8 feature drift, L3-W2 override rate, L3-W4 escalation rate, DPD 30+ trend | Days to weeks | Early warning — act before problem manifests |
| **Coincident** (real-time) | L2-B1 approval rate, L2-B2 time-to-decision, L3-W1 state distribution, L2-O3 SLA compliance | Real-time | Operational monitoring |
| **Lagging** (confirm outcome) | L2-R1 NPL rate, L2-R3 EL per app, North Star RARPA | 3-12 months | Confirm AI-CRDS is actually working |

---

## 6. ALIGNMENT WITH BANK X EXISTING SCORECARDS

### 6.1 Mapping AI-CRDS KPIs to Bank Scorecards

| Bank scorecard | Bank KPI | AI-CRDS KPI alignment | How AI-CRDS contributes |
|---------------|----------|---------------------|----------------------|
| **Cards Business P&L** | Revenue from CC portfolio | L2-B1 + L2-B3 | Maintain/increase approval rate → more revenue |
| **Cards Business P&L** | Cost-to-income ratio | L2-O1 + L2-O2 | Reduce manual review cost → lower C/I |
| **Risk Dashboard** | NPL ratio | L2-R1 | Better scoring → lower NPL |
| **Risk Dashboard** | Provision coverage | L2-R3 (EL per app) | Lower EL → lower provision needed |
| **Risk Dashboard** | Fraud losses | L2-R2 | Better fraud detection → lower fraud losses |
| **Compliance Report** | SBV audit readiness | L3-C1, L3-C2, L3-C3 | Automated audit trail → always ready |
| **Compliance Report** | PDPD compliance | L3-C7, L3-C8 | Opt-out mechanism, human review right |
| **HR Dashboard** | Headcount efficiency | L2-O2 | CO capacity freed → reallocate or reduce |
| **Customer Experience** | Application processing time | L2-B2 | Faster decision → better NPS |

### 6.2 Reporting Alignment

| Audience | Metrics shown | Format | Frequency |
|---------|-------------|--------|-----------|
| **C-level** | North Star (RARPA) + L2 summary | 1-page dashboard | Monthly |
| **Head of Cards** | L2-B1/B2/B3 + L2-O1/O2 + North Star | Business dashboard | Weekly |
| **Risk Manager** | L2-R1/R2/R3 + L3-M1 through M8 + L3-C4/C5/C6 | Risk dashboard | Weekly (ops), Monthly (model) |
| **Compliance** | L3-C1 through C8 | Compliance checklist | Monthly + ad-hoc (SBV request) |
| **Data Science** | L3-M1 through M8 + L3-W1 through W7 | Technical dashboard | Daily/Weekly |
| **Credit Officers** | L2-B2 (time), L2-O3 (SLA), personal override rate | CO personal dashboard | Real-time |

---

## Tracking — Tự hỏi cuối tuần

- [ ] Head of Cards đã review Business metrics (L2-B1/B2/B3) chưa? Targets realistic?
- [ ] Risk Manager đã review Risk metrics (L2-R1/R2/R3) chưa? NPL target ≤ 3.5% OK?
- [ ] North Star (RARPA) formula — CFO đồng ý cách tính?
- [ ] Existing Bank X scorecards — đã map AI-CRDS KPIs vào chưa?
- [ ] Reporting format — align với existing dashboards hay build mới?

---

## Ghi Chú & Limitations

1. **North Star RARPA có 3-12 month lag** cho NPL component. Leading indicators (PSI, override rate, DPD 30+) cần monitor song song.
2. **Baseline estimates** dựa trên damage-model.md + assumptions-log.md. Khi có internal data → recalculate.
3. **L3 model metrics (Gini, AUC, KS)** chỉ meaningful sau khi có real model trained trên real data. MVP (synthetic data) → model metrics not representative.
4. **Bias metrics (L3-C4/C5/C6) thresholds (5pp/8pp/10pp)** là proposed — chưa có VN regulatory standard. Luật AI 134/2025 nói "không phân biệt đối xử" nhưng chưa define quantitative threshold.
5. **Cross-reference:** damage-model.md (cost baselines), threshold-framework.md (threshold ↔ approval rate), cost-of-error-table.md (FP/FN costs), decision-architecture.md (state definitions).