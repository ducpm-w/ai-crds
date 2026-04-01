# Feature Availability Matrix — AI-CRDS
> **Tags:** `[Data]` `[Architecture]` `[Model Design]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 3
> **Version:** v1.0
> **Ngày:** 27/03/2026

---

## Mục đích

Map từng feature cần cho AI scoring/fraud detection → availability, source, quality, priority. Dùng cho model design decision: feature nào dùng được ngay, feature nào cần work, feature nào bỏ.

**Ký hiệu Availability:**
- ✅ Available — dùng được ngay
- ⚠️ Available nhưng cần thêm work (cleaning, API, permission)
- ❌ Not available — gap
- ❓ Unknown — cần confirm với IT/Data team

**Ký hiệu Quality** (từ data-quality-scorecard.md):
- **High** (score ≥ 3.5): Reliable, dùng cho model
- **Medium** (score 2.5–3.4): Dùng được nhưng cần cleaning/enrichment
- **Low** (score < 2.5): Unreliable, cần address trước khi dùng

**Ký hiệu Priority:**
- **Must-have**: Model không chạy được nếu thiếu
- **Should-have**: Cải thiện model đáng kể nếu có
- **Nice-to-have**: Marginal improvement, bỏ cũng được

---

## NHÓM 1 — IDENTITY & KYC

| # | Feature | Available? | Source | Quality | Priority | Latency | Notes |
|---|---------|-----------|--------|---------|----------|---------|-------|
| 1.1 | **CCCD verified** | ✅ | eKYC provider (VNPT/FPT/VNG) | High (4.5) | Must-have | Real-time | TT 45/2025 bắt buộc đối chiếu sinh trắc khi phát hành CC. Output: pass/fail + confidence. AI-CRDS nhận kết quả, KHÔNG lưu raw biometric. |
| 1.2 | **Age** | ✅ | CBS (DOB) / eKYC OCR | High (4.5) | Must-have | Real-time | DOB từ CBS hoặc OCR từ CCCD. Cross-check 2 nguồn. Dùng age (numeric), không dùng DOB trực tiếp trong model. |
| 1.3 | **Gender** | ✅ | CBS / eKYC | High | Bias monitoring ONLY | Real-time | ⚠️ **KHÔNG dùng làm scoring feature.** Chỉ dùng cho bias monitoring (Luật AI 134/2025 Điều 4: không phân biệt đối xử). Log gender → monitor approval rate per gender → flag nếu disparity > threshold. |
| 1.4 | **Address (province/city)** | ⚠️ | CBS | Medium (2.6) | Should-have | Stale | Free-text trong CBS → cần geocoding pipeline để extract province/city. Accuracy tại province level ~80%, district level ~60%. Nhiều khách không update khi chuyển nhà. **Action needed:** Build address standardization pipeline. |
| 1.5 | **Phone verified** | ✅ | eKYC + TT 45/2025 check | High (4.5) | Must-have | Real-time | TT 45/2025 bắt buộc verify SĐT chính chủ. eKYC provider thực hiện. Output: verified/not verified. |

**Nhóm 1 Summary:** 4/5 features available ngay (✅). Address cần geocoding pipeline (⚠️). Nhóm này chủ yếu phục vụ identity verification + fraud gate, không phải core scoring features.

---

## NHÓM 2 — FINANCIAL CAPACITY

| # | Feature | Available? | Source | Quality | Priority | Latency | Notes |
|---|---------|-----------|--------|---------|----------|---------|-------|
| 2.1 | **Monthly income (declared)** | ⚠️ | Application form | Low (2.5) | Must-have | T+0 (tại thời điểm apply) | **Weakness lớn nhất.** Self-reported, khách thường khai cao hơn thực tế 20-50%. Không auto-update. Cần cross-check với payroll (2.2) hoặc bank statement. **Không nên dùng declared income làm sole repayment capacity feature.** |
| 2.2 | **Income verified (payroll)** | ⚠️ | CBS transaction history | High (3.6) nếu có | Must-have | T+1 | **Gold standard** cho income verification. Detect salary credit patterns trong CBS transactions (recurring amount, monthly, keyword "lương/salary"). **Limitation:** chỉ available cho existing customers nhận lương qua bank (~35-50% applicants). New-to-bank = không có. **Action needed:** Build salary detection algorithm (NLP pattern matching trên transaction narration). |
| 2.3 | **Income source type** | ⚠️ | Application form + CBS | Medium | Should-have | T+0 | Salaried / Self-employed / Freelance / Retired. Self-reported trên application form. Cho target segment "CC Salaried" → hầu hết = salaried. Cross-check: có salary credit pattern trong CBS không? Nếu khai "salaried" nhưng không có recurring deposit → flag. |
| 2.4 | **Employment duration** | ⚠️ | Application form | Low (2.1) | Should-have | T+0 (stale) | Self-reported, rất khó verify. Khách có thể khai dài hơn thực tế. Không có API verify BHXH. **Mitigation:** Cross-check với payroll history length (nếu có): salary credits ≥ X months → minimum employment tenure. Nếu không verify được → giảm weight trong model. |
| 2.5 | **Employer type/size** | ⚠️ | Application form | Low (2.2) | Should-have | T+0 (stale) | Free-text: "Cty ABC" — cần NLP standardization. Binning đề xuất: SOE (nhà nước) / FDI (nước ngoài) / Large Private / SME / Startup / Other. ĐKKD lookup (dangkykinhdoanh.gov.vn) có thể verify employer tồn tại nhưng không có API chính thức. **Action needed:** Employer standardization pipeline + ĐKKD web scraping (nếu legal). |
| 2.6 | **Existing debt obligations** | ✅ | CIC API | High (3.6) | Must-have | T+7-14 | Tổng dư nợ hiện tại tại tất cả TCTD. CIC là single source-of-truth. Delay 1-2 tuần so với thực tế. Reliable nhưng cần note: khách có thể vừa trả nợ hoặc vừa vay thêm mà CIC chưa update. |
| 2.7 | **Debt-to-Income ratio** | ⚠️ | Derived (2.6 / 2.1 hoặc 2.2) | Medium (3.0) | Must-have | Derived | Chỉ tốt bằng input yếu nhất. DTI = total debt / monthly income. Nếu dùng declared income (2.1) → DTI unreliable. Nếu dùng payroll income (2.2) → DTI reliable. **Design:** Tạo 2 DTI variants: `dti_declared` và `dti_verified`. Prefer verified. |

**Nhóm 2 Summary:** Chỉ 1/7 features available ngay (✅ existing debt). Income verification là gap lớn nhất — self-reported income (score 2.5) là weakest link trong toàn bộ feature set. Payroll verification là must-build.

---

## NHÓM 3 — CREDIT HISTORY

| # | Feature | Available? | Source | Quality | Priority | Latency | Notes |
|---|---------|-----------|--------|---------|----------|---------|-------|
| 3.1 | **CIC Score** | ✅ | CIC API | High (3.8) | Must-have | T+7-14 (update 1-2 tuần) | Score range: 150-750 hoặc 300-850 (tùy product CIC). Single most predictive feature cho credit risk. **Limitation:** ~71% dân số trưởng thành có CIC record. Cho CC salaried: ước tính 80-85% coverage. 15-20% thin file → cần alternative scoring. |
| 3.2 | **# existing credit products** | ✅ | CIC API | High (3.8) | Must-have | T+7-14 | Số khoản vay/CC đang active. Over-indebtedness signal. Đếm: personal loans + CC + mortgage + auto loan + other. |
| 3.3 | **Payment history (on-time/late)** | ✅ | CIC API | High (3.8) | Must-have | T+7-14 | DPD (Days Past Due) history: 0 / 30 / 60 / 90+. Feature engineering: max DPD last 12M, # times DPD 30+ last 24M, current DPD. **Single most important credit risk indicator.** |
| 3.4 | **NPL history** | ✅ | CIC API | High (3.8) | Must-have | T+7-14 | Nhóm nợ CIC: 1 (đủ chuẩn) → 5 (có khả năng mất vốn). Từng có nợ nhóm 3-5 = bad signal. CIC giữ bad debt ≥5 năm. Feature: max debt group ever, max debt group last 24M. |
| 3.5 | **# inquiries (6M)** | ✅ | CIC API | High (4.1) | Must-have | T+1-7 | Số lần bị tra cứu CIC trong 6 tháng gần nhất. "Credit hunger" signal — nhiều inquiry = đang cần tiền gấp = higher risk. Auto-logged nên accuracy rất cao. |
| 3.6 | **Length of credit history** | ✅ | CIC API | High (3.8) | Should-have | T+7-14 | Thời gian từ khoản vay đầu tiên đến nay. Longer history = more data = better prediction. Feature: months since first credit facility. |

**Nhóm 3 Summary:** 6/6 features available ngay (✅). CIC là source đáng tin cậy nhất. Tất cả must-have hoặc should-have. **Đây là backbone của credit scoring model.** Limitation duy nhất: CIC coverage (thin file ~15-20% cho CC salaried).

---

## NHÓM 4 — BEHAVIORAL (Existing customers only)

| # | Feature | Available? | Source | Quality | Priority | Latency | Notes |
|---|---------|-----------|--------|---------|----------|---------|-------|
| 4.1 | **Avg monthly transaction volume** | ⚠️ | CBS transaction history | High (3.8) nếu có | Should-have | T+1 | Tổng giá trị giao dịch hàng tháng (inflow + outflow). Proxy cho activity level + income. **Chỉ available cho existing customers.** New-to-bank = 0. Cần aggregate từ raw transactions → volume lớn. NĐ 356: giao dịch NH = DLCN nhạy cảm → consent riêng. |
| 4.2 | **Salary deposit history** | ⚠️ | CBS transaction history | High (3.6) nếu có | Should-have | T+1 | Pattern detection: recurring monthly credits, consistent amount (±10%), keyword match ("lương", "salary", employer name). Output: `has_salary_deposit` (boolean), `salary_amount` (numeric), `salary_months` (count). **Chỉ ~35-50% CC applicants.** Rất valuable khi có — income verification gold standard. |
| 4.3 | **Account balance patterns** | ⚠️ | CBS account data | High (3.8) nếu có | Should-have | T+1 | Features: avg balance 3M, min balance 3M, balance volatility (std dev), end-of-month balance pattern. Proxy cho savings discipline + financial stability. **Existing customers only.** |
| 4.4 | **Product usage breadth** | ✅ (existing) | CBS | High (4.3) nếu có | Nice-to-have | Real-time | Số sản phẩm đang dùng: savings, fixed deposit, insurance, investment, internet banking, mobile banking. More products = deeper relationship = lower risk (cross-sell signal). Chỉ meaningful cho existing customers. |

**Nhóm 4 Summary:** 0 features available cho new-to-bank customers. 4/4 available cho existing customers (⚠️ cần processing). Nhóm này tạo **advantage lớn cho existing customer scoring** nhưng model không nên phụ thuộc quá nhiều vì coverage thấp (~40-60% applicants).

**Design implication:** Cần 2 scoring paths:
- **Path A (existing customer):** Full model = Nhóm 1+2+3+4
- **Path B (new-to-bank):** Reduced model = Nhóm 1+2+3 only

---

## NHÓM 5 — FRAUD SIGNALS

| # | Feature | Available? | Source | Quality | Priority | Latency | Notes |
|---|---------|-----------|--------|---------|----------|---------|-------|
| 5.1 | **Device fingerprint** | ⚠️ | Online application channel | Medium | Should-have | Real-time | Browser/device fingerprint khi apply online. Detect: same device multiple applications, known fraud device. **Chỉ available cho online channel** (không có cho branch walk-in). Cần implement fingerprinting SDK (FingerprintJS hoặc tương đương). NĐ 356: cần consent cho device data. |
| 5.2 | **Application velocity** | ⚠️ | Application system + CIC inquiries | High | Must-have | Real-time / T+1-7 | 2 signals: (a) Same device/IP multiple applications trong X giờ (real-time, cần device fingerprint). (b) CIC inquiry count spike (T+1-7). High velocity = fraud or credit hunger. Feature: `apps_same_device_24h`, `cic_inquiries_30d`. |
| 5.3 | **Blacklist check** | ❓ | Bank internal blacklist + SIMO (TT 45/2025) | High | Must-have | ❓ | (a) Internal blacklist: khách bị ban trước đó. ❓ Format và access method tùy bank. (b) SIMO: hệ thống báo cáo gian lận liên ngân hàng (TT 45/2025). ❓ Chưa rõ bank nào đã integrate SIMO realtime. **Action needed:** Confirm SIMO integration status tại bank partner. |
| 5.4 | **Document authenticity score** | ✅ | eKYC provider | High (4.1) | Must-have | Real-time | eKYC output: document real/fake/suspicious. Detect: photoshopped CCCD, photocopied CCCD, expired CCCD. Provider dependent — VNPT kết nối BCA nên accuracy cao. |
| 5.5 | **Biometric liveness check** | ✅ | eKYC provider | High (4.5) | Must-have | Real-time | eKYC output: liveness pass/fail. Detect: photo attack, video replay, mask attack. TT 45/2025 bắt buộc. AI-CRDS nhận pass/fail, KHÔNG lưu biometric data. |
| 5.6 | **Name/DOB cross-check** | ⚠️ | CBS vs eKYC vs CIC | High | Should-have | Real-time | Cross-check name + DOB across 3 systems. Mismatch = identity fraud signal. Challenge: Unicode/diacritics ("Nguyễn" vs "Nguyen"), nickname vs legal name. Cần fuzzy matching algorithm. |
| 5.7 | **IP geolocation** | ⚠️ | Online application channel | Medium | Nice-to-have | Real-time | IP → approximate location. Signal: IP location ≠ declared address = flag (không auto-reject). VPN users = false positive risk. Chỉ online channel. |

**Nhóm 5 Summary:** 2/7 available ngay (✅ document authenticity, liveness). 4 cần implementation work (⚠️). 1 unknown (❓ blacklist/SIMO). Fraud signals quan trọng nhưng nhiều cái cần build.

---

## TỔNG HỢP — FEATURE AVAILABILITY DASHBOARD

### By Availability

| Status | Count | % | Features |
|--------|-------|---|---------|
| ✅ Available | 14 | 45% | Age, CCCD, phone, gender, existing debt, CIC score, # products (CIC), payment history, NPL, inquiries, credit length, product usage, doc authenticity, liveness |
| ⚠️ Need work | 14 | 45% | Address, income declared, income verified, income source, employment, employer, DTI, txn volume, salary history, balance patterns, device fingerprint, app velocity, name cross-check, IP geo |
| ❌ Not available | 0 | 0% | — |
| ❓ Unknown | 3 | 10% | Blacklist/SIMO, internal risk rating, previous CC history |

### By Priority

| Priority | Count | Available ✅ | Need work ⚠️ | Unknown ❓ |
|----------|-------|-------------|-------------|-----------|
| Must-have | 16 | 10 | 5 | 1 |
| Should-have | 12 | 2 | 9 | 1 |
| Nice-to-have | 3 | 2 | 1 | 0 |

### By Quality (estimated)

| Quality | Count | Features |
|---------|-------|---------|
| High (≥3.5) | 17 | CIC features (6), eKYC features (4), CBS demographics (3), CBS behavioral (3), doc authenticity |
| Medium (2.5-3.4) | 6 | Income declared, DTI, address, device fingerprint, IP geo, CC utilization |
| Low (<2.5) | 3 | Employment tenure, employer type, income source (self-reported) |

---

## FEATURE DEPENDENCY MAP

```
SCORING MODEL — Feature Flow

[Application Form]                [CIC API]                [eKYC]
├── Income (declared) ──┐        ├── CIC Score ────────┐   ├── CCCD verified
├── Employer ──────────┐│        ├── Outstanding debt ──┤   ├── Liveness pass
├── Employment tenure  ││        ├── # active loans ───┤   ├── Doc authentic
└── Address ───────────┤│        ├── Max DPD 12M ──────┤   ├── Face match score
                       ││        ├── # inquiries 6M ───┤   └── Confidence score
[CBS — Existing only]  ││        ├── NPL history ──────┤
├── Age (DOB) ─────────┤│        └── Credit length ────┤
├── Relationship tenure ┤│                              │
├── Salary deposits ────┤│   ┌──────────────────────────┘
├── Avg balance ────────┤│   │
├── Txn volume ─────────┤│   │
└── # products ─────────┘│   │
                         │   │
                    ┌────┘   │
                    ▼        ▼
              ┌─────────────────┐
              │  FEATURE ENGINE │
              │                 │
              │  Pre-process:   │
              │  - Impute       │
              │  - Normalize    │
              │  - Bin          │
              │  - Derive (DTI) │
              └───────┬─────────┘
                      │
            ┌─────────┼──────────┐
            ▼         ▼          ▼
     ┌──────────┐ ┌────────┐ ┌──────────┐
     │ SCORING  │ │ FRAUD  │ │ BIAS     │
     │ MODEL    │ │ MODEL  │ │ MONITOR  │
     │          │ │        │ │          │
     │ Nhóm 1-4│ │ Nhóm 5 │ │ Gender   │
     │ features│ │+eKYC   │ │ Geography│
     │          │ │+velocity│ │ Age      │
     └────┬─────┘ └───┬────┘ └────┬─────┘
          │           │           │
          ▼           ▼           ▼
    Risk Score   Fraud Flag   Bias Alert
    + Confidence + Score     (if disparity)
    + Explanation
```

---

## MISSING VALUE STRATEGY

Nhiều features chỉ có cho existing customers hoặc applicants có CIC. Cần strategy xử lý missing values:

| Feature group | Missing when | Rate (estimated) | Strategy |
|--------------|-------------|-----------------|---------|
| CIC features (Nhóm 3) | Thin file — khách chưa bao giờ vay | 15-20% (CC salaried) | Route to thin-file model (Path B). Dùng CBS behavioral + eKYC nếu existing customer. Nếu new-to-bank + thin file → manual review. |
| CBS behavioral (Nhóm 4) | New-to-bank customer | 40-60% | Model không dùng Nhóm 4 features cho path này. Rely on Nhóm 1+2+3. |
| Payroll income (2.2) | New-to-bank hoặc nhận lương bank khác | 50-65% | Fall back to declared income (2.1) nhưng giảm weight. Flag `income_verified = false`. |
| Employment tenure (2.4) | Không khai / khai sai | ~10% missing, ~40% inaccurate | Impute median nếu missing. Giảm weight nếu unverified. |

**Nguyên tắc:** Không impute CIC features — nếu thiếu CIC → route to separate model/manual. Impute cho non-critical features (address, employment) bằng median/mode.

---

## ACTION ITEMS — Feature Readiness

### Immediate (Week 3-5)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | **Confirm CIC API integration** tại bank partner (API vs manual) | Unlock Nhóm 3 (backbone) | Low (confirm only) |
| 2 | **Confirm eKYC provider + output format** | Unlock Nhóm 5 fraud features | Low (confirm only) |
| 3 | **Build salary detection algorithm** — NLP on CBS transaction narrations | Income verification: 60% → 90% accuracy | Medium |

### Short-term (Week 5-10)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 4 | **Address standardization pipeline** — free-text → province/district | Geography feature: 2.6 → 4.0 quality | Medium |
| 5 | **Employer standardization** — NLP + binning (SOE/FDI/Private/SME) | Employer feature: 2.2 → 3.0 quality | Medium |
| 6 | **Device fingerprinting SDK** — implement cho online channel | Unlock fraud features 5.1, 5.2 | Medium |
| 7 | **Confirm SIMO integration** tại bank partner | Unlock blacklist check 5.3 | Low (confirm only) |

### Medium-term (Week 10-16)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 8 | **Thin-file model** — alternative scoring cho khách không có CIC | Coverage: 80% → 95%+ | High |
| 9 | **Name/DOB fuzzy matching** — cross-check CBS vs eKYC vs CIC | Fraud detection improvement | Medium |
| 10 | **2-path scoring design** — existing vs new-to-bank | Model architecture | High |

---

## Tracking — Tự hỏi cuối tuần

- [ ] CIC integration method confirmed? (API/manual?)
- [ ] eKYC provider + output format confirmed?
- [ ] CBS transaction data access confirmed? (cho salary detection + behavioral features)
- [ ] Thin file rate actual estimate? (target: CC salaried segment)
- [ ] SIMO integration status?
- [ ] Salary detection algorithm — feasibility assessment done?
- [ ] 2-path scoring design (existing vs new-to-bank) — architecture decision?

---

## Ghi Chú & Limitations

1. **Tất cả quality scores là ước tính** từ data-quality-scorecard.md (Phần B). Cần validate với data thật.
2. **"Existing customer" features** (Nhóm 4) coverage phụ thuộc bank partner: bank lớn có nhiều existing customers hơn bank nhỏ/mới.
3. **Alternative data** (telco, e-commerce, social media) đã evaluate tại data-landscape-assessment.md → kết luận: KHÔNG dùng cho v1. Focus traditional data.
4. **Gender, ethnicity, religion: KHÔNG dùng cho scoring** — Luật AI 134/2025 Điều 4 bắt buộc không phân biệt đối xử. Gender chỉ dùng bias monitoring.
5. **NĐ 356/2025 consent** — mọi data từ CBS transactions, CIC cần consent rõ ràng cho mục đích chấm điểm tín dụng (xem pdpd-impact-assessment.md).
6. **Cross-reference:** data-landscape-assessment.md (data sources detail), data-quality-scorecard.md (quality assessment), pdpd-impact-assessment.md (consent requirements).