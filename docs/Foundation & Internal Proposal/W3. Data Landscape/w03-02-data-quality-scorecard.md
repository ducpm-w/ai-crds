# Data Quality Scorecard — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Đánh giá chất lượng dữ liệu cho AI-CRDS theo 5 dimensions. Document gồm 2 phần:
- **Phần A:** Template trống — dùng khi có access data thật tại bank partner
- **Phần B:** Ước tính dựa trên nguồn công khai — dùng làm baseline khi chưa có data thật

---

## 5 Dimensions Đánh Giá

| # | Dimension | Mô tả | Thang điểm |
|---|----------|-------|-----------|
| 1 | **Completeness** | % records có giá trị (không null/blank) | 1 (≤50%) → 5 (≥98%) |
| 2 | **Accuracy** | % values đúng so với reality / source-of-truth | 1 (≤60%) → 5 (≥98%) |
| 3 | **Consistency** | % values nhất quán across systems (CBS vs CIC vs eKYC) | 1 (≤60%) → 5 (≥95%) |
| 4 | **Timeliness** | Data fresh level (real-time → T+30) | 1 (T+30+) → 5 (real-time) |
| 5 | **Uniqueness** | % records không duplicate | 1 (≤80%) → 5 (≥99%) |

**Score tổng hợp per field:** Trung bình 5 dimensions. **Score ≥ 3.5 → dùng được cho model.**

**Usability:**
- ✅ Score ≥ 3.5 — Dùng được cho model
- ⚠️ Score 2.5–3.4 — Dùng được nhưng cần cleaning/enrichment
- ❌ Score < 2.5 — Không dùng được, cần address gap trước

---

## PHẦN A — TEMPLATE (Dùng khi có access data thật)

### A.1 Core Scoring Features

| # | Field | Source | Completeness | Accuracy | Consistency | Timeliness | Score | Dùng được? |
|---|-------|--------|-------------|----------|-------------|-----------|-------|-----------|
| F1 | Age (DOB) | CBS | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F2 | Monthly income (declared) | App form | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F3 | Income verified (payroll) | CBS txn | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F4 | Employment tenure | App form | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F5 | Employer type | App form | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F6 | CIC Score | CIC API | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F7 | Total outstanding debt | CIC | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F8 | DTI ratio | Derived | N/A | N/A | N/A | N/A | Depends on F2+F7 | ❓ |
| F9 | Number active loans | CIC | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F10 | Max DPD 12M | CIC | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F11 | CIC inquiries 6M | CIC | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F12 | Relationship tenure | CBS | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |

### A.2 Secondary / Fraud Features

| # | Field | Source | Completeness | Accuracy | Consistency | Timeliness | Score | Dùng được? |
|---|-------|--------|-------------|----------|-------------|-----------|-------|-----------|
| F13 | Avg balance 3M | CBS | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F14 | Salary credit frequency | CBS txn | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F15 | # existing products | CBS | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F16 | CC utilization | CBS/CIC | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F17 | Geography | CBS addr | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F20 | eKYC confidence | eKYC | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |
| F21 | Face match score | eKYC | ❓ ___% | ❓ | ❓ | ❓ | ❓ /5 | ❓ |

### A.3 Overall Assessment

| Dimension | Average across all fields | Target |
|----------|------------------------|--------|
| Completeness | ❓ | ≥ 85% |
| Accuracy | ❓ | ≥ 90% |
| Consistency | ❓ | ≥ 85% |
| Timeliness | ❓ | ≤ T+1 cho core features |
| Uniqueness | ❓ | ≥ 99% |
| **Overall Score** | **❓ /5** | **≥ 3.5** |

**Cần validate toàn bộ Phần A với IT/Data team tại bank partner.**

---

## PHẦN B — ƯỚC TÍNH DỰA TRÊN NGUỒN CÔNG KHAI

### B.0 Nguồn dữ liệu sử dụng

| # | Nguồn | Nội dung lấy | Thời điểm |
|---|-------|-------------|-----------|
| 1 | CIC Conference 02/2026 (vietnam.vn) | CIC database: ~55 triệu chủ thể dữ liệu, coverage 71% dân số trưởng thành. Host-to-Host ~95%. 106 triệu báo cáo/2025. | 02/2026 |
| 2 | Cambridge Legal Research (2023) | CIC: 30.8 triệu cá nhân có lịch sử tín dụng, 670K doanh nghiệp, 1200+ TCTD. FE Credit: 14 triệu khách hàng. | 2023 |
| 3 | SeaBank/CIC guides (2025) | CIC score 150-750 hoặc 300-850 (tùy sản phẩm). Update mỗi 1-2 tuần. Bad debt giữ ≥5 năm. | 2025 |
| 4 | Vietcombank/VietinBank Basel II reports | 86% NHTM áp dụng TT41. Mô hình 3 tuyến đã kiện toàn. | 2022 |
| 5 | Industry knowledge — VN banking practice | Self-reported income, address free-text, CMND→CCCD migration, digital bank adoption. | General |

**⚠️ Disclaimer:** Tất cả giá trị Phần B là ước tính/giả định dựa trên nguồn công khai + industry knowledge. Không phải data thực từ bank cụ thể. Sai số có thể lớn. Chỉ dùng làm baseline để planning, không dùng cho quyết định thiết kế chính thức.

### B.1 Core Scoring Features — Ước tính

| # | Field | Source | Completeness | Accuracy | Consistency | Timeliness | Score | Dùng được? | Giải thích |
|---|-------|--------|-------------|----------|-------------|-----------|-------|-----------|-----------|
| F1 | Age (DOB) | CBS | ~98% (4.5) | ~95% (4.5) — CCCD matched | ~90% (4) — CBS vs eKYC có thể lệch format | Real-time (5) | **4.5** | ✅ | DOB là mandatory field khi mở TK. Accuracy cao nhờ CCCD/eKYC verification. Consistency issue: DD/MM/YYYY vs YYYY-MM-DD across systems. |
| F2 | Monthly income (declared) | App form | ~95% (4.5) | ~60% (2) — self-reported, inflation phổ biến | ~50% (1.5) — declared vs actual có thể chênh 20-50% | T+0 khi khai (5) nhưng stale nhanh (2) | **2.5** | ⚠️ | Đây là weakness lớn nhất. Khách thường khai cao hơn thực tế 20-50%. Không auto-update khi tăng/giảm lương. Cần cross-check với payroll/bank statement. |
| F3 | Income verified (payroll) | CBS txn | ~35-50% (2) — chỉ existing customers nhận lương qua bank | ~90% (4.5) — bank statement data chính xác | ~85% (4) — khớp nếu cùng bank | T+1 (4) | **3.6** | ✅ (nếu có) | Gold standard cho income verification. Nhưng coverage thấp: chỉ ~35-50% CC applicants nhận lương qua bank đang apply. New-to-bank = 0%. Segment "salaried via bank" coverage cao hơn. |
| F4 | Employment tenure | App form | ~90% (4) | ~50% (1.5) — self-reported, khó verify | ~40% (1) — CBS có thể còn employer cũ | T+0 khi khai (5) nhưng stale (2) | **2.1** | ❌ | Rất khó verify. Khách có thể khai sai (kéo dài tenure). Không có API verify trực tiếp. BHXH data chưa available. Cần kết hợp payroll data để cross-check. |
| F5 | Employer type | App form | ~85% (3.5) | ~60% (2) — free-text, khó standardize | ~50% (1.5) — không match ĐKKD | T+0 (5) nhưng stale (2) | **2.2** | ❌ | Free-text input: "Cty ABC" vs "Công ty TNHH ABC" vs "ABC Corp." Cần NLP standardization + ĐKKD lookup. SOE vs FDI vs Private classification manual. |
| F6 | CIC Score | CIC API | ~71% (3) — CIC coverage 71% dân số trưởng thành | ~90% (4.5) — CIC algorithm standardized | ~95% (4.5) — single source, nhất quán | T+7-14 (3) — update mỗi 1-2 tuần | **3.8** | ✅ | Source đáng tin cậy nhất cho credit risk. Limitation: 29% dân số trưởng thành không có CIC record (thin file). Cho CC salaried segment, coverage có thể cao hơn (~80-85%) vì đã có quan hệ tín dụng. |
| F7 | Total outstanding debt | CIC | ~71% (3) | ~85% (4) — có thể delay so với thực tế | ~90% (4.5) — single source | T+7-14 (3) — update mỗi 1-2 tuần | **3.6** | ✅ | Delay 1-2 tuần → khách có thể đã trả nợ nhưng CIC chưa cập nhật. Hoặc vừa vay thêm nhưng chưa reflect. Acceptable cho scoring nhưng cần note limitation. |
| F8 | DTI ratio | Derived (F7/F2) | N/A | Phụ thuộc F2+F7 | N/A | N/A | **~3.0** (avg F2+F7) | ⚠️ | Chỉ tốt bằng input yếu nhất. Income (F2) accuracy thấp → DTI không reliable. Nếu có payroll income (F3) → DTI tốt hơn nhiều. |
| F9 | # active loans | CIC | ~71% (3) | ~90% (4.5) — CIC comprehensive | ~95% (4.5) | T+7-14 (3) | **3.8** | ✅ | Tương tự F6. Reliable nếu có CIC record. |
| F10 | Max DPD 12M | CIC | ~71% (3) | ~90% (4.5) — bank report chính xác | ~95% (4.5) | T+7-14 (3) | **3.8** | ✅ | Feature quan trọng nhất cho default prediction. Accuracy cao vì bank report trực tiếp. |
| F11 | CIC inquiries 6M | CIC | ~71% (3) | ~95% (4.5) — system-generated | ~98% (5) | T+1-7 (4) — inquiry log update nhanh hơn | **4.1** | ✅ | "Credit hunger" signal. Accuracy rất cao vì auto-logged. |
| F12 | Relationship tenure | CBS | ~40-60% (2) — chỉ existing customers (new-to-bank = 0) | ~98% (5) — system date chính xác | ~98% (5) | Real-time (5) | **4.3** (nếu có) | ✅ (nếu có) | Rất chính xác cho existing customers. Nhưng completeness thấp vì new-to-bank customers không có. Model cần handle missing value. |

### B.2 Secondary / Fraud Features — Ước tính

| # | Field | Source | Completeness | Accuracy | Consistency | Timeliness | Score | Dùng được? | Giải thích |
|---|-------|--------|-------------|----------|-------------|-----------|-------|-----------|-----------|
| F13 | Avg balance 3M | CBS | ~40-60% (2) — existing customers only | ~95% (4.5) | ~95% (4.5) | T+1 (4) | **3.8** (nếu có) | ✅ (nếu có) | Rất tốt cho income proxy + stability signal. Nhưng chỉ có cho existing customers. |
| F14 | Salary credit freq | CBS txn | ~30-45% (1.5) — existing + nhận lương qua bank | ~90% (4.5) | ~90% (4.5) | T+1 (4) | **3.6** (nếu có) | ✅ (nếu có) | Cần pattern detection: "lương" keyword trong narration, recurring amount monthly. Noise: bonus, thưởng lẫn vào. |
| F15 | # existing products | CBS | ~40-60% (2) — existing customers only (0 cho new) | ~98% (5) | ~98% (5) | Real-time (5) | **4.3** (nếu có) | ✅ (nếu có) | System data, rất chính xác. Cross-sell signal. |
| F16 | CC utilization | CBS/CIC | ~20-30% (1) — chỉ khách đã có CC | ~85% (4) | ~80% (3.5) — CBS vs CIC có thể delay khác nhau | T+1-14 (3) | **2.9** (nếu có) | ⚠️ | Chỉ applicable cho khách đã có CC. Utilization real-time tại CBS có thể khác CIC (delay). |
| F17 | Geography | CBS addr | ~85% (3.5) | ~70% (3) — address outdated, người thuê nhà đổi thường xuyên | ~60% (2) — format free-text, inconsistent | Stale (2) — nhiều khách không update address | **2.6** | ⚠️ | Free-text address là pain point lớn. "123 Nguyễn Huệ, Q.1, TP.HCM" vs "123 Nguyen Hue, Dist 1, HCMC." Cần geocoding pipeline. Province/city level OK, district level risky. |
| F20 | eKYC confidence | eKYC | ~95% (4.5) — bắt buộc theo TT 45 | ~85% (4) — dependent on eKYC provider quality | ~90% (4.5) — single provider | Real-time (5) | **4.5** | ✅ | eKYC output mới, real-time, high quality. Bắt buộc theo TT 45/2025 nên coverage cao. |
| F21 | Face match score | eKYC | ~95% (4.5) | ~80% (3.5) — lighting, angle affect accuracy | ~90% (4.5) | Real-time (5) | **4.1** | ✅ | Tốt cho fraud detection. Edge case: ảnh kém chất lượng, người cao tuổi match rate thấp hơn. |

### B.3 Tổng hợp ước tính — Feature Quality Overview

| Category | Fields | Avg Score | Assessment |
|---------|--------|----------|-----------|
| **CIC-sourced** (F6, F7, F9, F10, F11) | 5 | **3.8** | ✅ Nhóm feature đáng tin cậy nhất. Limitation chính: coverage 71% (thin file). |
| **CBS demographics** (F1, F12, F15) | 3 | **4.4** (nếu có) | ✅ Accuracy rất cao cho existing customers. Gap: new-to-bank. |
| **CBS behavioral** (F3, F13, F14) | 3 | **3.7** (nếu có) | ✅ Tốt nhưng chỉ cho existing customers nhận lương qua bank. |
| **Self-reported** (F2, F4, F5) | 3 | **2.3** | ❌ Nhóm yếu nhất. Income inflated, employment unverifiable, employer unstandardized. |
| **eKYC** (F20, F21) | 2 | **4.3** | ✅ Mới, real-time, high quality. Fraud detection feature tốt. |
| **Derived** (F8 DTI, F16 util, F17 geo) | 3 | **2.8** | ⚠️ Phụ thuộc vào input quality. DTI chỉ tốt nếu có payroll income. |

### B.4 Heatmap tổng hợp

```
                  Completeness  Accuracy  Consistency  Timeliness  Overall
CIC features      ███░░  71%   █████ 90%  █████ 95%   ███░░ T+14  ████░ 3.8
CBS demographics  ██░░░  40-98% █████ 95%  █████ 95%   █████ RT    ████░ 4.4*
CBS behavioral    ██░░░  35-50% ████░ 90%  ████░ 85%   ████░ T+1   ███░░ 3.7*
Self-reported     ████░  85-95% ██░░░ 55%  █░░░░ 45%   ██░░░ Stale ██░░░ 2.3
eKYC             █████  95%    ████░ 82%  ████░ 90%   █████ RT    ████░ 4.3

* Nếu existing customer. New-to-bank completeness = 0%.
RT = Real-time
```

**Pattern rõ ràng:**
1. **Completeness là bottleneck chính** cho CBS data (chỉ existing customers) và CIC (71% coverage)
2. **Accuracy thấp nhất ở self-reported data** — income, employment tenure, employer type
3. **Timeliness tốt nhất ở eKYC** (real-time) và CBS (real-time/T+1). CIC lag 1-2 tuần.
4. **Consistency tốt nhất khi single source** (CIC, eKYC). Cross-system matching (CBS vs CIC) có friction.

---

## PHẦN C — ĐÁNH GIÁ VÀ KHUYẾN NGHỊ

### C.1 Feature Tiering — Dựa trên quality assessment

| Tier | Features | Avg Score | Recommendation |
|------|---------|----------|---------------|
| **Tier 1 — Core reliable** | CIC Score, DPD history, # loans, inquiries, eKYC scores | 3.8-4.3 | Dùng cho mọi applicant có CIC record. High weight trong model. |
| **Tier 2 — Good if available** | Age, relationship tenure, avg balance, salary credit, # products | 3.6-4.4 | Dùng cho existing customers. Handle missing value cho new-to-bank. |
| **Tier 3 — Use with caution** | Income declared, DTI, geography, CC utilization | 2.5-3.0 | Cần cleaning + cross-validation. Giảm weight nếu chưa verify income. |
| **Tier 4 — Unreliable** | Employment tenure, employer type | 2.1-2.2 | Cần enrichment (BHXH verify, ĐKKD lookup) trước khi dùng. Có thể bỏ nếu không improve model đáng kể. |

### C.2 Action Items — Data Quality Improvement

| # | Action | Priority | Impact | Effort | Target |
|---|--------|---------|--------|--------|--------|
| 1 | **Payroll income verification** — identify salary credits trong CBS transactions cho existing customers | 🔴 HIGH | Income accuracy: 60% → 90% | Medium (NLP pattern matching) | Week 3-5 |
| 2 | **Address standardization** — geocoding pipeline (free-text → province/district/ward) | 🟡 MEDIUM | Geography feature usability: 2.6 → 4.0 | Medium (3rd party geocoding API) | Week 5-8 |
| 3 | **Employer standardization** — NLP + ĐKKD lookup | 🟡 MEDIUM | Employer accuracy: 60% → 80% | High (ĐKKD không có API) | Week 8-12 |
| 4 | **Thin file strategy** — alternative scoring model cho applicants không có CIC | 🔴 HIGH | Coverage: 71% → 90%+ | High (model riêng) | Week 12-16 |
| 5 | **Data freshness monitoring** — automated alerts khi data stale > threshold | 🟡 MEDIUM | Detect stale data trước khi affect model | Low (monitoring script) | Week 10 |
| 6 | **Duplicate detection** — customer dedup across CMND→CCCD migration | 🟡 MEDIUM | Uniqueness: unknown → >99% | Medium | Week 5-8 |
| 7 | **Cross-system reconciliation** — CBS vs CIC name/DOB matching | 🟢 LOW | Consistency improvement | Low (matching algorithm) | Week 8 |

### C.3 Model Design Implications

| Quality Finding | Model Design Decision |
|----------------|---------------------|
| Self-reported income unreliable (score 2.5) | Không dùng declared income làm sole feature cho repayment capacity. Weight thấp hơn nếu chưa verify payroll. Create "income_verified" flag. |
| CIC coverage 71% (thin file ~29%) | Thiết kế 2 models: (a) Full model cho applicants có CIC. (b) Thin-file model cho applicants không có CIC — dùng CBS behavioral + eKYC. |
| CBS behavioral data chỉ cho existing customers | Feature importance analysis cần tách existing vs new-to-bank. Model không phụ thuộc quá nhiều vào CBS behavioral nếu muốn cover new customers. |
| Employer type unstandardized (score 2.2) | Xem xét binning thô (SOE/FDI/Private/Other) thay vì dùng employer name trực tiếp. Hoặc bỏ nếu marginal lift thấp. |
| CIC delay 1-2 tuần | Acknowledge trong model documentation: score tính tại thời điểm T nhưng CIC data có thể stale T-14 days. Không claim "real-time scoring." |
| eKYC data high quality nhưng chỉ pass/fail + scores | Dùng eKYC scores trực tiếp cho fraud model. Không cần raw biometric — consistent với data minimization (PDPD). |

---

## Tracking — Tự hỏi cuối tuần

- [ ] Đã meeting với IT/Data team để validate Phần A chưa?
- [ ] Phần B ước tính có match với reality không? Sai ở đâu?
- [ ] Thin file rate thực tế bao nhiêu? (Ước tính 29% population, nhưng CC salaried có thể thấp hơn)
- [ ] Payroll income verification có feasible không? (CBS transaction data access?)
- [ ] Address standardization: bank đã có geocoding chưa?
- [ ] Overall data quality score ≥ 3.5? Nếu chưa → address gaps trước khi train model.

---

## Ghi Chú & Limitations

1. **Phần B là ước tính** — sai số có thể lớn tùy bank. Bank lớn (VCB, TCB, VPB) có data quality tốt hơn bank nhỏ.
2. **CIC coverage 71%** là toàn dân — cho segment "CC salaried" tại NHTM, coverage có thể cao hơn (80-85%) vì nhóm này đã có quan hệ tín dụng.
3. **CIC score range** có sự khác biệt giữa các nguồn: 150-750 (CIC trực tiếp) vs 300-850/900 (một số bài viết). Cần confirm với CIC documentation chính thức.
4. **Self-reported data quality** (income, employment) là weakness hệ thống của banking VN, không riêng bank nào. AI-CRDS cần design xung quanh limitation này.
5. **Cross-reference:** data-landscape-assessment.md cho data source details, pdpd-impact-assessment.md cho data protection requirements.