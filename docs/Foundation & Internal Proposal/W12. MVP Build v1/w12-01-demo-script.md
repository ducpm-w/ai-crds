# Demo Script — AI-CRDS MVP v1
> **Tags:** `[Product]` `[Demo]` `[Stakeholder]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 12
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Demo script cho Week 13 internal presentation. 3 scenarios, 15-20 phút total. Audience: Credit Officers, Risk Manager, Head of Cards, CTO.

**⚠️ MỌI DATA TRONG DEMO LÀ SYNTHETIC — KHÔNG PHẢI KHÁCH HÀNG THẬT.**

---

## 0. SETUP & OPENING (2 phút)

### Before Demo

- [ ] System running, data loaded (10K synthetic records)
- [ ] 3 test applications pre-created (Scenario A/B/C)
- [ ] Browser zoom 125% (readable from projector)
- [ ] Backup screenshots ready (nếu live demo fail)
- [ ] "SYNTHETIC DATA — DEMO ONLY" watermark visible

### Opening Script

```
"Cảm ơn mọi người dành thời gian. Hôm nay tôi demo AI-CRDS —
hệ thống AI hỗ trợ quyết định tín dụng cho CC.

3 điều quan trọng trước khi bắt đầu:
1. Data hoàn toàn synthetic — không phải khách hàng thật
2. AI chỉ HỖ TRỢ — Credit Officer vẫn ký quyết định cuối cùng
3. Đây là MVP — mục tiêu là show end-to-end flow, không phải production

Tôi sẽ demo 3 scenarios:
A. Hồ sơ tốt → AI score cao → batch confirm (3-5 phút thay vì 35 phút)
B. Hồ sơ borderline → AI explain → CO full review → reject → adverse action
C. Hồ sơ có fraud signal → AI flag → priority review

Mỗi scenario ~5-7 phút. Xin hỏi sau mỗi scenario hoặc cuối demo."
```

---

## 1. SCENARIO A — HAPPY PATH (State 1: Batch Approve)

### Setup

| Field | Value | Why |
|-------|-------|-----|
| Name | SYN-Nguyễn Văn An | Synthetic prefix |
| CCCD | SYN-079123456 | Synthetic |
| Age | 35 | Prime earning age |
| Income | 25M/tháng | Above average |
| Employer | FPT Software (FDI) | Stable, verifiable |
| Employment | 36 tháng | Long tenure |
| CIC Score | 740 | High |
| DTI | 22% | Low |
| DPD history | 0 | Clean |
| eKYC | Pass (0.96) | High confidence |

### Demo Flow (5-7 phút)

```
STEP 1: Application Input (/apply)
"Đây là form nhập hồ sơ. Trong production, data auto-fill từ online form
hoặc branch nhập. Hôm nay tôi nhập manual cho demo."
→ Fill form fields
→ Click "Submit Application"
→ "Hồ sơ đang được xử lý..."

STEP 2: AI Scoring Result (/score/[id])
"Trong <30 giây, AI đã:
- Query CIC (mock) → score 740
- Run eKYC (mock) → pass
- Calculate risk score → 0.82
- Calculate confidence → 91%
- Route to State 1 (Batch Review)"

Show trên screen:
├── Risk Score: 0.82 (LOW RISK) [green gauge]
├── Confidence: 91% [green bar]
├── Fraud Score: 0.05 (CLEAR) [green]
├── State: BATCH REVIEW (State 1)
├── AI Recommendation: APPROVE
├── Top 3 Positive: CIC 740, DTI 22%, 3yr employment
└── "ⓘ Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo"

→ "Chú ý AI label ở đây — bắt buộc theo Luật AI 134/2025."

STEP 3: Batch Review Queue (/review/batch)
"Đây là queue của Credit Officer. 12 hồ sơ AI recommends approve.
CO xem summary, có thể expand detail, rồi confirm."

→ Show batch queue (12 records)
→ Expand 1-2 records (show detail panel)
→ Select 4 records (including Nguyễn Văn An)
→ Click "Confirm Selected (4)"
→ "4 hồ sơ đã được approve."

→ "Thời gian: 3-5 phút cho 4 hồ sơ. Trước đây: 35 phút × 4 = 140 phút.
   Giảm 85% thời gian review cho high-confidence cases."

STEP 4: Audit Log (/audit)
"Mọi quyết định được ghi nhận tự động. 24+ fields."

→ Show audit log entry cho Nguyễn Văn An
→ Point out: decision_id, model_version, ai_score, human_decision,
             co_review_seconds, ai_label_displayed, batch_review_flag
→ "SBV có thể inspect bất kỳ quyết định nào — đầy đủ thông tin."
```

### Key Message (nói cho audience)

```
"State 1 = 35-45% volume. Từ 35 phút manual → 3-5 phút batch confirm.
CO vẫn review và confirm — AI chỉ pre-screen và route.
Đây là nguồn operational saving lớn nhất."
```

---

## 2. SCENARIO B — BORDERLINE (State 2: Individual Review → Reject)

### Setup

| Field | Value | Why |
|-------|-------|-----|
| Name | SYN-Phạm Thị Bình | Synthetic |
| CCCD | SYN-024987654 | Synthetic |
| Age | 29 | Younger |
| Income | 18M/tháng | Moderate |
| Employer | Công ty ABC (SME) | Less stable |
| Employment | 8 tháng | Short |
| CIC Score | 650 | Adequate but not strong |
| DTI | 42% | Borderline high |
| DPD history | 0 | Clean |
| Inquiries 6M | 2 | Multiple recent inquiries |
| eKYC | Pass (0.91) | OK |

### Demo Flow (5-7 phút)

```
STEP 1: AI Scoring Result
→ Risk Score: 0.52 (MEDIUM) [yellow gauge]
→ Confidence: 72% [yellow bar]
→ State: STANDARD REVIEW (State 2)
→ AI Recommendation: REVIEW NEEDED

STEP 2: Individual Review Screen (/review/[id])
"Đây là screen CO dùng cho State 2 — full review."

Show 2-column layout:
LEFT (AI Panel):
├── Risk Score: 0.52 MEDIUM
├── Confidence: 72%
├── ⚠️ TOP 3 RISK:
│   ❶ DTI 42% (borderline)
│   ❷ Employment 8 tháng (short)
│   ❸ 2 inquiries/6M (multiple recent)
├── ✅ TOP 3 POSITIVE:
│   ❶ CIC 650 (adequate)
│   ❷ No DPD history
│   ❸ eKYC verified

RIGHT (Applicant Data):
├── Demographics, income, employer
├── CIC Report summary
├── eKYC details

→ "AI không nói 'reject' — AI nói 'review needed' và explain WHY.
   CO thấy cả risk VÀ positive factors. CO quyết định."

STEP 3: CO Decision — REJECT
"Trong demo này, CO quyết định reject vì DTI 42% + employment 8 tháng."

→ Click "REJECT"
→ System tự động generate adverse action notice

STEP 4: Adverse Action Notice
"Khi reject, hệ thống tự động tạo thông báo cho khách."

Show notice:
├── "CHƯA ĐÁP ỨNG ĐIỀU KIỆN PHÁT HÀNH THẺ"
├── Lý do:
│   ① Tỷ lệ nghĩa vụ nợ hiện tại so với thu nhập vượt mức cho phép
│   ② Thời gian làm việc tại đơn vị hiện tại chưa đủ yêu cầu
│   ③ Số lượng yêu cầu vay vốn gần đây cao bất thường
├── Quyền của khách: CIC check, human review, khiếu nại, apply lại
├── "ⓘ Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo"
└── Hotline + email khiếu nại

→ "3 lý do plain language — không phải 'không đủ điều kiện' chung chung.
   Khách hiểu tại sao bị từ chối. Comply NĐ 356 + Luật AI 134/2025."
```

### Key Message

```
"AI explain WHY → CO quyết định informed hơn → khách hiểu tại sao bị từ chối.
Trước đây: CO check 10+ fields, 35 phút, lý do reject = 'không đủ điều kiện'.
Bây giờ: AI highlight top 3 risk + top 3 positive, CO focus review, adverse action tự động."
```

---

## 3. SCENARIO C — FRAUD DETECTION (State 3)

### Setup

| Field | Value | Why |
|-------|-------|-----|
| Name | SYN-Trần Văn Cường | Synthetic |
| CCCD | SYN-036111222 | Synthetic |
| Age | 28 | Young |
| Income | 30M/tháng | Suspiciously high for profile |
| Employer | "Tập đoàn XYZ" | Unverifiable |
| Employment | 24 tháng | Claims 2 years |
| eKYC | Face match: 0.58 (LOW) | Possible identity fraud |
| Velocity | 3 applications same device/24h | Fraud signal |
| CIC | No record (thin file) | No credit history |

### Demo Flow (5-7 phút)

```
STEP 1: AI Scoring Result
→ Risk Score: 0.38 (HIGH RISK) [red gauge]
→ Fraud Score: 0.71 (ELEVATED) [red alert]
→ State: PRIORITY FRAUD REVIEW (State 3) [red badge]
→ 🔴 FRAUD SIGNAL DETECTED banner

STEP 2: Fraud Review Screen
"State 3 = priority fraud review. Fraud analyst hoặc Senior CO xử lý."

Show fraud-specific UI:
├── 🔴 FRAUD SIGNALS DETECTED
│   ├── Face match score: 0.58 (below 0.80 threshold)
│   ├── Application velocity: 3 apps / same device / 24h
│   ├── Employer: không tìm thấy trong ĐKKD
│   └── Income: 30M mâu thuẫn với thin file (no CIC record)
├── Recommended action: Enhanced Due Diligence
└── EDD Checklist available

→ "AI phát hiện 4 fraud signals mà process hiện tại có thể miss.
   eKYC chỉ cho pass/fail — AI cross-check nhiều signals."

STEP 3: Decision — REJECT (Fraud)
→ Click "REJECT — Fraud Confirmed"
→ Audit log: fraud_decision = true
→ SIMO report flag = filed
→ Internal blacklist updated

STEP 4: Adverse Action (Fraud template)
Show fraud template:
├── "Không thể hoàn tất xác minh thông tin cá nhân theo quy định"
├── KHÔNG nêu chi tiết fraud signals
└── Hướng khách đến branch nếu muốn re-verify

→ "Lưu ý: thông báo cho khách KHÔNG nêu 'nghi ngờ gian lận'.
   Chỉ nói 'không thể xác minh'. Bảo vệ bank khỏi defamation risk
   VÀ không giúp fraudster biết bị phát hiện bằng cách nào."
```

### Key Message

```
"Hiện tại Bank X chỉ có eKYC pass/fail — không có fraud scoring layer.
AI-CRDS thêm multi-signal fraud detection:
- Face match anomaly
- Application velocity
- Employer verification
- Income-profile mismatch

Fraud rate ~0.8% × 3,000 apps = 24 fraud cases/tháng × 50M = 14.4 tỷ/năm.
AI catch thêm 30% → save 4.32 tỷ/năm."
```

---

## 4. CLOSING (2 phút)

```
"Tóm tắt 3 scenarios:

A. Hồ sơ tốt → 35 phút manual → 3-5 phút batch = TIẾT KIỆM 85% THỜI GIAN
B. Hồ sơ borderline → AI explain → CO review informed → adverse action tự động
C. Fraud → AI detect multi-signal → catch tại origination, TRƯỚC KHI card phát hành

Tất cả: CO vẫn ký quyết định cuối cùng.
Tất cả: Audit trail 24 fields, SBV ready.
Tất cả: AI label display (Luật AI 134/2025).
Tất cả: Data 100% synthetic — MVP demo only.

Next step: Week 13 — usability test với Credit Officers.
Xin mọi người thử dùng và cho feedback."
```

---

## 5. FAQ — Prepare for Q&A

| # | Likely question | Answer |
|---|----------------|--------|
| 1 | "AI score dựa trên cái gì?" | "MVP dùng rule-based scoring (CIC score, DTI, employment, DPD). Production sẽ dùng ML model (logistic regression → gradient boosting) trained trên real data." |
| 2 | "Accuracy bao nhiêu?" | "MVP trên synthetic data — accuracy chưa meaningful. Shadow testing trên real data (Phase 0, 4 tuần) sẽ cho con số thật. Mục tiêu: AI agree với CO ≥70%." |
| 3 | "Nếu AI sai thì sao?" | "CO luôn có quyền override. Override logged + tracked. Nếu AI consistently sai → model retrain. Guardrail: NPL +200bps → emergency stop." |
| 4 | "CO có bị thay thế không?" | "Không. CO ký mọi quyết định. AI xử lý routine (batch), CO xử lý complex. CO expertise MORE valuable — focus vào cases khó." |
| 5 | "Khi nào dùng real data?" | "Sau khi: (1) Phase 0 approved, (2) DPIA submitted, (3) IT integration done. Ước tính: shadow testing Week 37 (nếu Phase 0 approved Week 16)." |
| 6 | "Budget bao nhiêu?" | "Phase 0: 365M, 8 tuần. Chi tiết trong proposal file 06-implementation-roadmap.md." |
| 7 | "Tại sao không mua vendor?" | "In-house: IP 100% Bank X, chi phí 3 năm thấp hơn 40-50%, regulatory fit cho VN, tận dụng CBS/CIC data nội bộ." |

---

## 6. CONTINGENCY — Nếu Live Demo Fail

| Problem | Backup |
|---------|--------|
| System down | Switch to screenshot deck (pre-captured for all 3 scenarios) |
| Scoring engine error | Show hardcoded results (pre-populated test data) |
| UI broken | Walk through wireframe mockups (ux-wireframes-notes.md) |
| Data not loading | Demo with 1 pre-loaded record per scenario |
| Projector issue | Share screen via Zoom/Teams (have link ready) |

**Rule: Nếu live demo fail > 2 phút → switch to backup. Không debug on stage.**

---

## Tracking

- [ ] 3 test applications pre-created?
- [ ] Scoring engine returns correct scores for 3 scenarios?
- [ ] Audit log ghi đủ 24+ fields?
- [ ] AI label visible on every screen?
- [ ] Adverse action notice generates correctly?
- [ ] Backup screenshots captured?
- [ ] FAQ answers rehearsed?
- [ ] Demo time ≤ 20 phút (timed)?