# Budget Estimate v0 — AI-CRDS
> **Tags:** `[Business]` `[Finance]` `[C-Level]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 4
> **Version:** v0 — Draft cho internal proposal Week 11
> **Ngày:** 02/04/2026

---

## Mục đích

Budget estimate phục vụ C-level proposal. Chia thành 3 giai đoạn với ask rõ ràng:
- **Phase 0 (Discovery):** Ask ngay — budget nhỏ, risk thấp
- **Phase 1 (Shadow Testing):** Ask sau Phase 0 results — budget trung bình
- **Full Deployment:** Range only — commit sau Phase 1

**Chiến lược ask:** Smaller ask = easier approval. "Cho chúng tôi 8 tuần shadow testing" dễ approve hơn "cho chúng tôi 60 tuần và 15 tỷ VND."

---

## PHASE 0 — DISCOVERY & SHADOW TESTING (8 tuần)

### Đây là budget ask chính tại Week 11 C-level meeting.

**Mục tiêu Phase 0:**
1. Validate data availability + quality tại Bank X
2. Build MVP demo (synthetic data)
3. Shadow test AI scoring song song với quyết định manual (AI chỉ observe, không ảnh hưởng)
4. Thu thập evidence cho Phase 1 proposal

**Risk cho Bank X:** Gần bằng 0 — AI chỉ observe, không quyết định. Không ảnh hưởng khách hàng. Không thay đổi quy trình hiện tại.

### Phase 0 — Headcount

| Role | FTE | Duration | Monthly all-in | Total | Ghi chú |
|------|-----|----------|---------------|-------|---------|
| AI-Native PM | 1.0 | 8 tuần (2 tháng) | 40M | 80M | Full-time lead. Stakeholder management, roadmap, documentation. |
| Data Scientist (senior) | 1.0 | 8 tuần | 55M | 110M | Model development, feature engineering, shadow testing setup. |
| Backend Developer | 0.5 | 8 tuần | 35M | 35M | CIC API integration, audit trail prototype, data pipeline. |
| IT Support (Bank X side) | 0.3 | 8 tuần | 20M | 12M | CBS access, CIC test environment, network setup. |
| **Subtotal Headcount** | **2.8 FTE** | | | **237M** | |

### Phase 0 — Infrastructure

| Item | Cost | Ghi chú |
|------|------|---------|
| Development environment (VN cloud) | 15M | Viettel/FPT Cloud — dev/staging instances, small GPU (nếu cần). |
| CIC API test access | 10M | Test queries — volume nhỏ, có thể dùng sandbox CIC nếu có. ❓ Phí thực tế cần confirm. |
| Tools & licenses | 5M | GitHub, monitoring, CI/CD. Có thể dùng free tier. |
| **Subtotal Infra** | **30M** | |

### Phase 0 — Compliance & Legal

| Item | Cost | Ghi chú |
|------|------|---------|
| DPIA preparation (draft) | 30M | Bắt đầu soạn DPIA theo Mẫu 10 NĐ 356. Draft — finalize ở Phase 1. |
| Legal review (initial) | 20M | Review consent flow, liability framework draft, Luật AI 134/2025 assessment. |
| Compliance Officer time (Bank X) | 0 | Internal resource — không tính budget project. |
| **Subtotal Compliance** | **50M** | |

### Phase 0 — Other

| Item | Cost | Ghi chú |
|------|------|---------|
| Training materials (draft) | 10M | CO briefing materials cho shadow testing. |
| Synthetic data generation | 5M | 10K records — compute + validation. Minimal cost. |
| Contingency (10%) | 33M | Buffer cho unexpected. |
| **Subtotal Other** | **48M** | |

### Phase 0 — TOTAL ASK

```
┌─────────────────────────────────────────┐
│          PHASE 0 BUDGET ASK             │
│                                         │
│  Headcount:     237M VND                │
│  Infrastructure:  30M VND               │
│  Compliance:      50M VND               │
│  Other:           48M VND               │
│  ─────────────────────────              │
│  TOTAL:         365M VND                │
│                                         │
│  ≈ $14,500 USD                          │
│  Duration: 8 tuần                       │
│  Risk: Gần bằng 0                       │
│                                         │
│  Deliverables:                          │
│  ✓ Data quality assessment (real data)  │
│  ✓ MVP demo (synthetic data)            │
│  ✓ Shadow testing results (4 tuần)      │
│  ✓ Phase 1 proposal with evidence       │
│  ✓ DPIA draft                           │
└─────────────────────────────────────────┘
```

**So sánh:** 365M VND = cost of ~4 bad CC approvals (4 × 50M limit × 70% LGD × 100% PD). Nếu Phase 0 ngăn được 4 fraud/bad approvals → đã hòa vốn.

---

## PHASE 1 — LIMITED DEPLOYMENT (16 tuần)

### Ask sau khi có Phase 0 results. Không commit bây giờ.

**Mục tiêu Phase 1:**
1. AI recommend decisions cho subset applications (CO vẫn review tất cả)
2. Measure: AI vs manual accuracy, override rate, CO feedback
3. Build production-ready infrastructure
4. Full DPIA + compliance sign-off

**Điều kiện trigger Phase 1:** Phase 0 results cho thấy (a) data quality đủ cho model, (b) shadow test AI accuracy ≥ manual baseline, (c) no blocking compliance issue.

### Phase 1 — Headcount

| Role | FTE | Duration | Monthly all-in | Total | Ghi chú |
|------|-----|----------|---------------|-------|---------|
| AI-Native PM | 1.0 | 16 tuần (4 tháng) | 40M | 160M | Full-time. |
| Data Scientist (senior) | 1.0 | 16 tuần | 55M | 220M | Model refinement, champion-challenger setup. |
| Data Scientist (mid) | 0.5 | 16 tuần | 35M | 70M | Feature engineering, bias monitoring. |
| Backend Developer | 1.0 | 16 tuần | 35M | 140M | Production API, audit trail, integration hardening. |
| Frontend Developer | 0.5 | 12 tuần (3 tháng) | 30M | 90M | CO review UI production version. |
| QA / Testing | 0.3 | 12 tuần | 25M | 22.5M | Integration testing, UAT support. |
| IT Support (Bank X) | 0.5 | 16 tuần | 20M | 40M | Production environment, CBS integration. |
| **Subtotal Headcount** | **4.8 FTE** | | | **742.5M** | |

### Phase 1 — Infrastructure

| Item | Cost | Ghi chú |
|------|------|---------|
| Production environment (VN cloud) | 120M | Production-grade: redundancy, SLA 99.9%, GPU inference. |
| CIC API (production queries) | 80M | ~3,000 queries/tháng × 4 tháng × ~7K/query. ❓ Phí cần confirm. |
| eKYC integration cost | 30M | Integration effort + test queries. |
| Monitoring & alerting | 20M | Drift detection, performance monitoring, alerting infrastructure. |
| **Subtotal Infra** | **250M** | |

### Phase 1 — Compliance & Training

| Item | Cost | Ghi chú |
|------|------|---------|
| DPIA finalization + submission A05 | 50M | Legal counsel final review + submission. |
| Legal (contracts, liability) | 40M | Vendor-bank agreement, liability allocation (Luật AI 134/2025). |
| Compliance audit | 30M | Internal audit review pre-deployment. |
| CO training (10-15 sessions) | 40M | Training materials, sessions, user guides. 2-3 sessions/week × 5 weeks. |
| Change management | 25M | Communication plan, FAQ, stakeholder updates. |
| **Subtotal Compliance & Training** | **185M** | |

### Phase 1 — Other

| Item | Cost | Ghi chú |
|------|------|---------|
| Stress testing infrastructure | 20M | Load testing, failure scenario testing. |
| Contingency (10%) | 120M | |
| **Subtotal Other** | **140M** | |

### Phase 1 — TOTAL ESTIMATE

```
┌─────────────────────────────────────────┐
│        PHASE 1 BUDGET ESTIMATE          │
│     (Ask sau Phase 0 — không commit)    │
│                                         │
│  Headcount:      742.5M VND             │
│  Infrastructure:   250M VND             │
│  Compliance:       185M VND             │
│  Other:            140M VND             │
│  ─────────────────────────              │
│  TOTAL:          1.32 tỷ VND            │
│                                         │
│  ≈ $52,500 USD                          │
│  Duration: 16 tuần                      │
│  Conditional: Phase 0 success           │
│                                         │
│  Deliverables:                          │
│  ✓ Production-ready AI scoring system   │
│  ✓ Limited deployment results           │
│  ✓ Full compliance (DPIA, Luật AI)      │
│  ✓ Trained CO team                      │
│  ✓ Full deployment proposal             │
└─────────────────────────────────────────┘
```

---

## FULL DEPLOYMENT — RANGE ONLY

### Không commit số cứng. Phụ thuộc Phase 0+1 results.

**Mục tiêu:** AI-CRDS live cho toàn bộ CC origination workflow.

### Full Deployment — Cost Range

| Category | Low | Mid | High | Assumption |
|---------|-----|-----|------|-----------|
| **Headcount (Year 1 remaining)** | 400M | 800M | 1.5 tỷ | Ongoing team: 2-3 FTE (PM + ML engineer + support). 6-8 tháng after Phase 1. |
| **Infrastructure (annual)** | 300M | 600M | 1.2 tỷ | Production scale. Depends on volume + cloud choice. |
| **CIC/eKYC (annual)** | 200M | 500M | 1 tỷ | 3,000-5,000 queries/tháng. Scale with approval volume. |
| **Compliance ongoing** | 100M | 200M | 400M | Quarterly reports, DPIA updates, Luật AI compliance, audit support. |
| **Model lifecycle (annual)** | 200M | 400M | 700M | Retraining, validation, drift monitoring, champion-challenger. |
| **TOTAL ANNUAL (post-deploy)** | **1.2 tỷ** | **2.5 tỷ** | **4.8 tỷ** | |

### Full Deployment — Total Project Cost (Phase 0 → Full year 1)

| Phase | Duration | Cost |
|-------|----------|------|
| Phase 0 (Discovery) | 8 tuần | 365M |
| Phase 1 (Limited) | 16 tuần | 1.32 tỷ |
| Full Deployment setup | 8-12 tuần | ~800M-1.5 tỷ (incremental) |
| Annual run (Year 1 partial) | 6-8 tháng | ~1.0-2.0 tỷ |
| **TOTAL YEAR 1** | **~12 tháng** | **3.5 tỷ - 5.2 tỷ** |

**So với break-even analysis:** Investment 3.5-5.2 tỷ vs Expected saving 26.64 tỷ/năm (full ramp). Break-even trong 3-5 tháng sau full deployment.

**Lưu ý cho C-level:** Budget estimate v0 thấp hơn break-even-analysis.md estimate (9.65 tỷ base) vì:
1. Break-even-analysis bao gồm full team salaries + generous contingency
2. Budget v0 assume phased ramp — không hire full team from day 1
3. Budget v0 assume Bank X IT support (không thuê riêng)
4. Cả 2 số đều trong acceptable range — conservative vs realistic

---

## TỔNG HỢP — PHASED INVESTMENT

### "Staircase" Budget — Ask nhỏ trước, tăng dần

```
Phase 0:   ████░░░░░░░░░░░░░░░░  365M VND    ← ASK BÂY GIỜ
Phase 1:   ████████░░░░░░░░░░░░  1.32 tỷ     ← Ask sau Phase 0
Full:      ████████████████░░░░  2-4 tỷ/năm  ← Ask sau Phase 1
           ─────────────────────
           0     1     2     3     4 tỷ VND

Timeline:  W1-8   W9-24    W25+
           ═════  ═══════  ═════════════
           Phase0  Phase1   Full Deploy
```

### Gate Conditions — Budget chỉ unlock khi pass gate

| Gate | Condition | Who approves | Budget unlocked |
|------|----------|-------------|----------------|
| **Gate 0 → 1** | Phase 0 results: data quality ≥ 3.5/5, shadow test accuracy ≥ baseline, no compliance blocker | Risk Manager + CTO | Phase 1: 1.32 tỷ |
| **Gate 1 → Full** | Phase 1 results: AI outperform manual on ≥2/4 metrics (NPL, fraud, approval rate, time-to-decision), CO adoption ≥70%, compliance signed off | C-level + Risk Committee | Full: 2-4 tỷ/năm |
| **Kill switch** | Any gate fails → project pauses. Sunk cost = Phase 0 (365M) hoặc Phase 0+1 (1.68 tỷ). | C-level | N/A |

### Maximum Downside (worst case)

| Scenario | Sunk cost | Outcome |
|---------|----------|---------|
| Phase 0 fails → kill | 365M | Learned data quality status. DPIA draft reusable. Knowledge gained. |
| Phase 1 fails → kill | 1.68 tỷ | Shadow test data. Trained CO team. Production infra reusable. Compliance done. |
| Full deploy underperforms | 3.5-5 tỷ | Working system, có thể tune. Unlikely to be total loss — partial benefits still captured. |

**Key message cho C-level:** "Maximum downside Phase 0 = 365M VND. Maximum upside = 27+ tỷ/năm saving. Asymmetric bet."

---

## BUILD vs BUY — COST COMPARISON

| | Build In-house | Buy Vendor |
|--|---------------|-----------|
| **Phase 0 equivalent** | 365M | ~500M-1 tỷ (vendor POC fee + integration) |
| **Phase 1 equivalent** | 1.32 tỷ | ~2-3 tỷ (license + integration + customization) |
| **Annual run** | 2-4 tỷ | 4-8 tỷ (recurring license: 2-4 tỷ/năm) |
| **3-year TCO** | 8-14 tỷ | 14-27 tỷ |
| **IP ownership** | ✅ Bank owns | ❌ Vendor owns |
| **VN regulatory fit** | ✅ Built for Luật AI, BVDLCN, SBV | ⚠️ Needs adaptation |
| **Explainability** | ✅ Full transparency | ⚠️ Black box risk |
| **Time to first value** | 6-8 tháng | 3-5 tháng |

**Recommendation:** Build in-house — 3-year TCO thấp hơn 40-50%, full IP ownership, regulatory compliance native.

---

## FUNDING SOURCE OPTIONS

| Option | Mô tả | Pros | Cons |
|--------|-------|------|------|
| **IT Budget** | Allocate từ IT annual budget | Quen thuộc, ít approval layers | IT budget thường tight, compete với other projects |
| **Innovation Fund** | Quỹ đổi mới sáng tạo nội bộ (nếu có) | Designed cho projects như thế này | Không phải bank nào cũng có |
| **Risk/Compliance Budget** | Frame as risk reduction investment | NPL reduction = Risk department's KPI | Unusual — cần Risk Manager champion |
| **Business Case (new)** | Request riêng dựa trên ROI | Clean, transparent, tied to results | Cần C-level sponsor |
| **Phased from P&L** | Absorb Phase 0 vào operational cost | Phase 0 nhỏ (365M) có thể absorb | Chỉ works cho Phase 0 |

**Đề xuất:** Phase 0 absorb vào IT/Innovation budget (365M — nhỏ, dễ approve). Phase 1+ = separate business case with ROI justification.

---

## HEADCOUNT PLAN — WHO WE NEED

### Phase 0 Team

```
PM (1.0 FTE) ─────────── AI-Native PM (existing or hire)
                         ├── Stakeholder management
                         ├── Roadmap & documentation
                         └── C-level reporting

DS (1.0 FTE) ─────────── Senior Data Scientist
                         ├── Model development
                         ├── Feature engineering
                         └── Shadow testing analysis

Dev (0.5 FTE) ────────── Backend Developer
                         ├── CIC API integration
                         ├── Audit trail prototype
                         └── Data pipeline

IT (0.3 FTE) ─────────── Bank X IT Support
                         ├── CBS access
                         ├── CIC test environment
                         └── Network setup

Total: 2.8 FTE for 8 weeks
```

### Hire vs Reallocate

| Role | Hire new? | Reallocate? | Ghi chú |
|------|----------|------------|---------|
| PM | ⚠️ Có thể reallocate nếu có PM với AI/banking experience | Ideal: existing PM với domain knowledge | Khó tìm AI-Native PM sẵn có tại VN |
| Senior DS | 🔴 Likely hire | ML engineers trong banking hiếm tại VN | Salary 40-70M/tháng (Adecco 2025). Lead time: 4-8 tuần. |
| Backend Dev | ✅ Reallocate từ IT team | Bank IT team thường có dev available | 0.5 FTE = part-time allocation |
| IT Support | ✅ Internal Bank X | Không hire | Part-time allocation từ existing IT |

---

## Tracking — Tự hỏi cuối tuần

- [ ] Budget estimate đã review với direct manager chưa?
- [ ] Phase 0 ask (365M) có realistic với Bank X budget cycle không?
- [ ] Headcount: Senior DS — đã bắt đầu tìm chưa? (lead time 4-8 tuần)
- [ ] Funding source đã identify chưa? (IT budget / Innovation fund / Business case?)
- [ ] Build vs Buy discussion đã có với CTO chưa?
- [ ] Gate conditions đã align với Risk Manager chưa?

---

## Ghi Chú & Limitations

1. **Budget v0 = draft.** Cần refine khi có Bank X internal data (IT cost, cloud pricing, CIC fee chính xác).
2. **People cost dựa trên market rate HN/HCM 2025-2026.** Bank X internal rate có thể khác (SOE vs private).
3. **Phase 0 budget (365M) intentionally low** — strategy: small ask, prove value, then scale.
4. **CIC API cost (❓)** là unknown lớn nhất. Phí per query khác nhau giữa các bank. Cần confirm.
5. **Contingency 10%** — conservative. Real projects thường overrun 20-30%. Nhưng keep estimate low cho C-level presentation.
6. **Cross-reference:** break-even-analysis.md (ROI justification), damage-model.md (cost of inaction), sbv-requirements.md (compliance cost basis).