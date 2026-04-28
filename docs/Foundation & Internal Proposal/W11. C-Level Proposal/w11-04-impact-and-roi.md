# Impact & ROI — AI-Native CRDS
> **Dự án:** AI-Native Credit Risk Decision Support
> **File:** 04/07 — Internal Proposal
> **Ngày:** 09/04/2026

---

## 1. PROJECTED SAVINGS — 26.64 tỷ VND/năm

AI-CRDS giảm thiệt hại ở cả 4 tầng damage model. Conservative estimates (base case):

| Tầng thiệt hại | Hiện tại/năm | AI reduction | Saving/năm | How |
|----------------|-------------|-------------|-----------|-----|
| **T1: Credit loss (NPL)** | 26.46 tỷ | -20% | **5.29 tỷ** | AI scoring chính xác hơn CO manual → ít approve nhầm bad applicant |
| **T2: Fraud loss** | 14.4 tỷ | -30% | **4.32 tỷ** | AI fraud detection layer (hiện không có). Multi-signal: velocity, device, eKYC, CIC anomaly |
| **T3: Opportunity cost** (false rejection) | 51.84 tỷ | -30% | **15.55 tỷ** | AI giảm false rejection rate. Good customers được approve thay vì bị CO reject nhầm |
| **T4: Ops cost** | 2.95 tỷ | -50% | **1.48 tỷ** | CO capacity 10 FTE → 4.3 FTE. State 1 batch review: 3-5 phút thay vì 35 phút |
| **TOTAL** | **95.65 tỷ** | | **26.64 tỷ** | |

**Ghi chú chuẩn hoá số liệu:** Tổng thiệt hại baseline dùng nhất quán **95.65 tỷ/năm** (làm tròn: ~96 tỷ/năm) trong toàn bộ Week 11. Nếu thấy “96 tỷ” ở slide/tóm tắt, đó là làm tròn.

### Saving lớn nhất: T3 Opportunity Cost (15.55 tỷ/năm)

Đây là insight quan trọng: **thiệt hại lớn nhất của Bank X không phải nợ xấu — mà là từ chối nhầm khách hàng tốt.** Mỗi good customer bị reject = 36M VND LTV lost (interest + fee + interchange × 3 năm). FP/FN cost ratio = 29.4:1.

AI scoring consistent (không phụ thuộc CO cá nhân) → false rejection rate giảm từ 10% xuống ~7% → 15.55 tỷ/năm recovered revenue.

---

## 2. INVESTMENT

### Phase-gated — không commit toàn bộ ngay

| Phase | Budget | Timeline | Condition |
|-------|--------|---------|----------|
| **Phase 0** ← ASK NGAY | **365M VND** | 8 tuần | Approve ngay. Rủi ro ~0. |
| Phase 1 | 1.32 tỷ | 16 tuần | Chỉ nếu Phase 0 pass. |
| Phase 2 (ongoing) | 2-4 tỷ/năm | Ongoing | Chỉ nếu Phase 1 pass. |

### Phase 0 Budget Detail (365M VND)

| Item | Cost | Note |
|------|------|------|
| Senior Data Scientist (contract, 8 tuần) | 160M | Lead model development. Critical hire. |
| AI PM allocation (internal, 50%) | 72M | Project lead (existing headcount). |
| Infrastructure (cloud, dev tools) | 48M | VN cloud, PostgreSQL, monitoring. |
| IT integration support (internal, 20%) | 45M | CBS/CIC/eKYC assessment. |
| Contingency (10%) | 40M | Buffer. |
| **TOTAL** | **365M** | **2.8 FTE-equivalent, 8 tuần** |

### Maximum Downside

```
Nếu Phase 0 fail → STOP.
Sunk cost = 365M VND.
365M = 0.38% of annual damage (95.65 tỷ).
= 1.4% of annual saving nếu thành công (26.64 tỷ).
= Chi phí ~1.5 ngày thiệt hại hiện tại.
```

---

## 3. ROI ANALYSIS

### Break-even

| Scenario | Break-even | Assumption |
|---------|-----------|-----------|
| **Optimistic** | **Month 6** | AI reduction rates 30-40% faster than base |
| **Base case** | **Month 11** | AI reduction rates as projected (T1 -20%, T2 -30%, T3 -30%, T4 -50%) |
| **Conservative** | **Month 22** | AI reduction rates 50% of base case |

### NPV & IRR (3 năm, discount rate 12%)

| Metric | Value | Note |
|--------|-------|------|
| **NPV** | **+33.56 tỷ VND** | Positive in ALL scenarios (even conservative = +10.5 tỷ) |
| **IRR** | **142%** | Far exceeds Bank X cost of capital |
| **Payback** | **11 tháng** (base) | Faster than typical IT project (18-24 months) |

### "Even If" Scenarios

| Scenario | NPV | Still positive? |
|---------|-----|---------------|
| Chỉ giảm NPL, không giảm fraud hay false rejection | +10.5 tỷ | ✅ Yes |
| Chỉ giảm NPL + fraud, không giảm false rejection | +16.8 tỷ | ✅ Yes |
| Reduction rates chỉ bằng 50% target | +14.2 tỷ | ✅ Yes |
| Phase 0 fail, stop after 365M | -365M | Maximum downside |

**Key message:** NPV positive trong MỌI scenario trừ trường hợp dừng hoàn toàn. Ngay cả khi AI chỉ giảm NPL mà không giảm fraud hay false rejection → vẫn positive +10.5 tỷ.

---

## 4. OPERATIONAL IMPACT

### CO Capacity

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| CO FTE needed | 10 | 4.3 | **-56%** |
| Review time per app (avg) | 30 min | 15 min | **-50%** |
| State 1 review time | 30 min | 3-5 min | **-85%** |
| Time-to-decision | 1-7 ngày | <1 ngày | **-80%** |
| Manual review rate | 100% | 55% | **-45%** |

**Note:** 56% CO capacity freed ≠ layoff 56% COs. Options:
- Reassign COs to higher-value work (collections, relationship management, complex underwriting)
- Handle volume growth without hiring
- Reduce overtime/stress → improve retention

### Customer Experience

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Application-to-decision | 1-7 ngày | <1 ngày | Competitive với fintech |
| Rejection notice | "Không đủ điều kiện" (vague) | Top 3 specific reasons + rights | NĐ 356 compliant, fewer complaints |
| Human review option | None | Available on request | Customer trust + Luật AI compliance |
| Fraud protection | eKYC only | Multi-signal AI | Better customer protection |

### Compliance Readiness

| Requirement | Before | After |
|------------|--------|-------|
| Audit trail | ~5-8 fields, manual | 24 fields, automated, immutable |
| Explainability | None | Top 3 factors, plain language |
| AI labeling (Luật AI) | N/A | "Hỗ trợ bởi AI" on all outputs |
| Bias monitoring | None | Gender/geography/age tracked |
| SBV inspection | Partial readiness | <15 min full trace replay |

---

## 5. SENSITIVITY — Top 5 Assumptions

| # | Assumption | Base value | If wrong by ±20% | Impact on annual saving | Confidence |
|---|-----------|-----------|------------------|----------------------|-----------|
| A13 | False rejection rate | 10% | 8-12% | ±6.22 tỷ | ❓ Low — needs CO validation |
| A22 | AI fraud detection improvement | -30% | -24% to -36% | ±1.73 tỷ | 🟡 Medium |
| A21 | AI NPL reduction | -20% | -16% to -24% | ±2.12 tỷ | 🟡 Medium |
| A1 | CC application volume | 3,000/tháng | 2,400-3,600 | ±5.33 tỷ | ❓ Low — needs internal data |
| A14 | LTV per CC | 36M | 29M-43M | ±4.67 tỷ | 🟡 Medium |

**Mitigant:** Phase 0 shadow testing (4 tuần real data) sẽ validate assumptions trước khi commit Phase 1 budget.

---

## 6. COMPARISON — AI-CRDS vs Alternatives

| | AI-CRDS (In-house) | FICO vendor | Local vendor | Status quo |
|--|-------------------|------------|-------------|-----------|
| **3-year TCO** | 8-14 tỷ | 18-27 tỷ | 14-20 tỷ | 0 (but damage 96 tỷ/năm) |
| **IP** | 100% Bank X | Vendor owns | Vendor owns | N/A |
| **Deploy time** | 8-12 tháng | 4-8 tháng | 6-10 tháng | N/A |
| **VN regulatory fit** | ✅ Built for VN | ⚠️ Needs adapt | 🟡 Partial | ❌ Not compliant |
| **Data access** | ✅ Full CBS/CIC | ⚠️ Limited | ⚠️ Limited | ✅ Full |
| **Customization** | ✅ Full | ❌ Vendor roadmap | ⚠️ Partial | N/A |
| **Expansion potential** | ✅ New segments, EWS | ⚠️ Per-module cost | ⚠️ Per-module | N/A |

---

## Tracking

- [ ] Tất cả số liệu cross-check với W4 damage-model.md + break-even-analysis.md?
- [ ] CFO đã review ROI methodology?
- [ ] "Even if" scenarios address top objection: "Nếu AI không giảm NPL thì sao?"
- [ ] Sensitivity analysis identify assumptions cần validate trong Phase 0?
