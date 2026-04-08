# As-Is Workflow — CC Origination tại Bank X
> **Tags:** `[Product]` `[Workflow]` `[Architecture]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 8
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Map quy trình CC origination hiện tại tại Bank X — trước khi có AI. Dùng làm baseline so sánh với to-be workflow.

**⚠️ CHƯA VALIDATE VỚI CO.** Roadmap yêu cầu shadow CO ít nhất 1 ngày. Flow dưới đây là generic cho NHTM VN có CC salaried origination. Mọi item đánh dấu ❓ cần confirm tại Bank X.

---

## 1. END-TO-END FLOW — 9 STATES

```
┌──────────────────────────────────────────────────────────────┐
│               AS-IS: CC ORIGINATION — BANK X                  │
│               (Pre-AI, manual/semi-manual)                    │
│               Est. end-to-end: 1-7 ngày                       │
└──────────────────────────────────────────────────────────────┘

 ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
 │ BƯỚC 1  │──▶│ BƯỚC 2  │──▶│ BƯỚC 3  │──▶│ BƯỚC 4  │
 │ Tiếp    │   │ eKYC    │   │ Data    │   │ CIC     │
 │ nhận    │   │ Verify  │   │ Entry & │   │ Query   │
 │ hồ sơ   │   │         │   │ Validate│   │         │
 └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
      │              │              │              │
      │         EX-A │         EX-B │         EX-C │
      │         eKYC │         Docs │         CIC  │
      │         fail │         miss │         down │
      │              │              │              │
      ▼              ▼              ▼              ▼
 ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
 │ BƯỚC 5  │──▶│ BƯỚC 6  │──▶│ BƯỚC 7  │──▶│ BƯỚC 8  │
 │ CO      │   │ Decision│   │ Approval│   │ Notify  │
 │ Review  │   │ & Sign  │   │ Process │   │ & Issue │
 └────┬────┘   └────┬────┘   └────┬────┘   └─────────┘
      │              │              │
      │         EX-D │         EX-E │
      │         CO   │         Limit│
      │         unsure│        > auth│
      │              │              │
      ▼              ▼              ▼
 ┌─────────┐
 │ BƯỚC 9  │
 │ Audit   │
 │ Log     │
 └─────────┘
```

---

## 2. DETAILED STEPS

### BƯỚC 1 — Tiếp nhận hồ sơ

| Attribute | Detail |
|-----------|--------|
| **Channel** | Branch (walk-in) / Online form / Mobile app / Sales team referral |
| **Actor** | Sales staff (branch) / Customer self-service (online/app) |
| **Documents collected** | (1) CCCD/CMND bản gốc hoặc scan. (2) Giấy xác nhận thu nhập hoặc sao kê lương 3 tháng. (3) Hợp đồng lao động (nếu có). (4) Giấy tờ bổ sung tùy bank: hộ khẩu, hóa đơn tiện ích, etc. |
| **System action** | Tạo application record trong CBS. Assign queue number. |
| **Time** | 10-20 phút (branch). 5-10 phút (online, customer self-fill). |
| **Pain points** | ❓ (1) Missing documents — khách thiếu giấy tờ, phải quay lại. (2) Inconsistent format — free-text fields, scan quality kém. (3) Duplicate entry — sales nhập lại từ paper form vào CBS. (4) No real-time validation — lỗi phát hiện muộn ở bước sau. |

### BƯỚC 2 — eKYC Verification

| Attribute | Detail |
|-----------|--------|
| **Actor** | System (automated) hoặc back-office staff |
| **Process** | ❓ Chụp CCCD → OCR extract data → đối chiếu sinh trắc (face match) → liveness detection |
| **Provider** | ❓ Cần confirm: VNPT / FPT.AI / VNG / in-house |
| **Pass criteria** | ❓ Face match score > threshold, liveness pass, document authentic |
| **TT 45/2025** | Bắt buộc biometric verification cho phát hành CC |
| **Time** | 2-5 phút (auto). 10-15 phút (manual fallback tại branch). |
| **Output** | Pass / Fail + confidence score |
| **Exception EX-A** | eKYC fail → retry 1 lần. Nếu vẫn fail → yêu cầu khách đến branch verify manual. Application ON HOLD. |
| **Pain points** | ❓ (1) Ảnh CCCD kém chất lượng → OCR fail. (2) Elderly customers: face match accuracy thấp hơn. (3) CMND cũ (9 số) chưa upgrade CCCD → có thể không support. |

### BƯỚC 3 — Data Entry & Validation

| Attribute | Detail |
|-----------|--------|
| **Actor** | Back-office staff / CO |
| **Process** | Nhập/verify data vào CBS: demographics, income, employer, address. Cross-check application form vs CCCD vs eKYC output. |
| **System** | ❓ CBS (T24/Flexcube/homegrown?) |
| **Validation** | Manual: required fields filled, income > 0, age ≥ 21, employer info present |
| **Time** | 10-20 phút |
| **Exception EX-B** | Documents incomplete → contact customer → request missing docs. Application ON HOLD (SLA: ❓ cần confirm, ước tính 3-7 ngày). |
| **Pain points** | (1) **~70% of processing time spent here** (McKinsey banking ops benchmark). (2) Manual data entry → typos, inconsistency. (3) Free-text fields (address, employer) → không standardize. (4) No automated income verification — self-reported income chỉ cross-check manual. |

### BƯỚC 4 — CIC Query

| Attribute | Detail |
|-----------|--------|
| **Actor** | CO hoặc system (auto) |
| **Method** | ❓ **Cần confirm:** (a) Host-to-Host API (automated, real-time) — CIC 02/2026: ~95% banks connected H2H. (b) Web portal query (manual, 1-5 phút). (c) Batch query (cuối ngày — stale data). |
| **Data returned** | CIC Score, credit history, outstanding debt, DPD history, inquiries, debt group |
| **Time** | API: 5-30 giây. Manual portal: 1-5 phút. Batch: T+1. |
| **Exception EX-C** | CIC timeout/down → (a) Retry manual qua portal. (b) Nếu vẫn fail → application ON HOLD chờ CIC recovery. (c) ❓ Có fallback process không? Có bank nào approve không cần CIC? |
| **Pain points** | ❓ (1) Manual query → bottleneck nếu volume cao. (2) Batch query → stale data (khách có thể vay thêm giữa batch). (3) CIC response format → cần manual read/interpret. |

### BƯỚC 5 — Credit Officer Review

| Attribute | Detail |
|-----------|--------|
| **Actor** | Credit Officer (CO) |
| **Process** | (1) Review application form. (2) Review CIC report chi tiết. (3) Verify income documents (sao kê lương, HĐLĐ). (4) ❓ Apply rules/scorecard (nếu có): check DTI, check NPL history, check age/employment. (5) Cross-reference: income vs lifestyle vs debt. (6) Make credit judgment (experience-based). |
| **Tools** | ❓ CBS screen + CIC report (print/screen) + Excel/manual calculation |
| **Decision basis** | ❓ (a) Formal scorecard → score-based decision? (b) Rules engine → if-then rules? (c) 100% judgment → CO experience? (d) Combination? |
| **Time** | 20-45 phút per application (depends on complexity) |
| **Exception EX-D** | CO uncertain → ask colleague / supervisor. No formal escalation process (ad-hoc). |
| **Pain points** | (1) **Inconsistency** — mỗi CO criteria khác nhau. CO A strict, CO B lenient → same applicant, different outcome. (2) **Bottleneck** — CO = scarce resource. Peak periods: queue backlog. (3) **No explainability** — CO decision based on "gut feeling" + experience. Hard to explain to customer. (4) **Fatigue** — 15-20 reviews/ngày → quality drops afternoon. (5) **No audit trail** — CO notes (nếu có) minimal, not structured. |

### BƯỚC 6 — Decision & Sign

| Attribute | Detail |
|-----------|--------|
| **Actor** | CO (within authority) / Supervisor (above authority) |
| **Process** | CO ký quyết định: Approve (set limit) hoặc Reject (ghi lý do — thường vague). |
| **Authority** | ❓ CO authority limit: ước tính ≤ 100M VND. Above → supervisor/committee. |
| **System update** | Update CBS: application status, decision, limit (if approved). |
| **Adverse action** | ❓ Reject → thông báo gì cho khách? Format nào? Qua channel nào? Thường: generic "không đủ điều kiện" — NOT specific reasons. |
| **Time** | 5-10 phút (decision + system update). |
| **Exception EX-E** | Limit > CO authority → escalate to supervisor/committee. ❓ SLA cho committee: ước tính 1-3 ngày bổ sung. |

### BƯỚC 7 — Approval Process (Internal)

| Attribute | Detail |
|-----------|--------|
| **Actor** | System / Operations team |
| **Process (if approved)** | (1) Verify decision recorded in CBS. (2) Check limit vs policy (system rule). (3) Trigger card production/issuance queue. (4) Generate welcome pack / terms. |
| **Process (if rejected)** | (1) Record rejection. (2) Generate notification (generic). |
| **Time** | Same day (nếu all manual steps done) to 1-2 days (queue). |

### BƯỚC 8 — Notification & Issuance

| Attribute | Detail |
|-----------|--------|
| **Actor** | System + Operations |
| **If approved** | (1) SMS/app notification to customer. (2) CC production (physical card: 5-7 ngày; virtual: immediate). (3) Activation instructions. |
| **If rejected** | (1) SMS/letter: "Hồ sơ không đủ điều kiện." (2) ❓ Adverse action notice với specific reasons? → Likely NO for most VN banks currently. (3) No information about CIC check right. |
| **Time** | Notification: same day to T+1. Physical card: 5-7 business days. |
| **Pain points** | (1) Vague rejection notice → customer confused → calls hotline → ops cost. (2) No AI label needed (no AI involved). (3) No complaint handling process for decisions. |

### BƯỚC 9 — Audit Log

| Attribute | Detail |
|-----------|--------|
| **Actor** | System (partial auto) + CO (manual) |
| **What's logged** | ❓ Typical: Application ID, customer ID, CO decision, date, limit. **Likely missing:** detailed reasons, CIC data snapshot, review time, override info, feature values at decision time. |
| **Format** | ❓ CBS record + possibly Excel/manual log |
| **Immutability** | ❓ CBS records likely immutable. Manual logs: editable. |
| **Replay capability** | ❌ Likely NO — cannot reconstruct exactly why CO decided what they decided. CIC data changes over time. |
| **SBV inspection** | ❓ If SBV asks "show me decision #12345" → can bank produce full trace? Likely partial only. |
| **Pain points** | (1) **Not SBV inspection ready** — missing fields, no replay. (2) Manual logging → incomplete, inconsistent. (3) No standard schema → hard to aggregate/analyze. |

---

## 3. EXCEPTION EXITS — SUMMARY

| # | Exception | Trigger | Current handling | SLA | Pain point |
|---|----------|---------|-----------------|-----|-----------|
| **EX-A** | eKYC fail | Face match fail, doc unreadable, liveness fail | Retry 1x → branch manual verify | ❓ 1-3 ngày | Customer must visit branch physically |
| **EX-B** | Documents incomplete | Missing income proof, HĐLĐ, address proof | Contact customer → request docs | ❓ 3-7 ngày (customer response) | High drop-off rate. Customers abandon. |
| **EX-C** | CIC timeout/down | CIC API fail, system maintenance | Manual CIC portal query / wait | ❓ Hours to 1 ngày | Entire queue blocked if CIC down |
| **EX-D** | CO uncertain | Edge case, conflicting signals, policy question | Ask colleague / supervisor (ad-hoc) | ❓ No formal SLA | No structured escalation → delays |
| **EX-E** | Limit > CO authority | Requested limit exceeds CO approval threshold | Escalate to supervisor / committee | ❓ 1-3 ngày | Committee meeting schedule dependent |

---

## 4. TIMELINE — END-TO-END

### Typical Case (no exceptions)

```
Day 1: Bước 1 (receive) + Bước 2 (eKYC) + Bước 3 (data entry)
        ───────────────────────────────────────────────────────
        Total: 30-45 phút
        
Day 1-2: Bước 4 (CIC query)
         ─────────────────────
         If API: 30 giây. If batch: T+1.
         
Day 1-3: Bước 5 (CO review) + Bước 6 (decision)
         ─────────────────────────────────────────
         Queue time: 0-2 ngày (depends on CO load)
         Review: 20-45 phút
         
Day 1-3: Bước 7 (approval process)
         ─────────────────────────
         Same day if no committee needed.
         
Day 2-7: Bước 8 (notification + card issuance)
         ────────────────────────────────────────
         Notification: same day.
         Physical card: 5-7 BD.
```

| Scenario | End-to-end time | Bottleneck |
|---------|----------------|-----------|
| **Best case** (online, CIC API, CO available) | **1-2 ngày** | CO review queue |
| **Typical** (branch, CIC API, moderate queue) | **3-5 ngày** | CO review queue + card production |
| **Worst case** (missing docs, CIC batch, committee) | **7-14 ngày** | Document collection + committee schedule |

---

## 5. PAIN POINTS SUMMARY — PRIORITIZED

| Rank | Pain point | Impact | Affected step | Solvable by AI-CRDS? |
|------|-----------|--------|-------------|---------------------|
| **#1** | **CO inconsistency** — same applicant, different outcomes | FP + FN cost (cost-of-error-table.md) | Bước 5 | ✅ AI scoring standardizes baseline |
| **#2** | **No explainability** — vague rejection reasons | Customer complaints, NĐ 356 non-compliance | Bước 6, 8 | ✅ AI explains top 3 factors |
| **#3** | **CO bottleneck** — queue backlog at peak | Time-to-decision 3-7 days, customer churn | Bước 5 | ✅ State 1 batch review (3-5 min) |
| **#4** | **Weak audit trail** — SBV inspection risk | Compliance risk | Bước 9 | ✅ Automated 24-field audit trail |
| **#5** | **Manual data entry** — typos, inconsistency | Data quality → scoring accuracy | Bước 3 | ⚠️ Partial — auto-fill from eKYC OCR |
| **#6** | **No fraud scoring** — eKYC pass/fail only | Fraud loss 14.4 tỷ/năm | Bước 2 | ✅ AI fraud detection layer |
| **#7** | **CIC manual query** — bottleneck, stale data | Decision delay | Bước 4 | ✅ Real-time API integration |

---

## 6. METRICS — CURRENT STATE (ước tính)

| Metric | Current (est.) | Source | Confidence |
|--------|---------------|--------|-----------|
| Applications/tháng | ~3,000 | Assumption A1 | ❓ Low |
| Approval rate | ~60% | Industry avg | ❓ Low |
| Time-to-decision (median) | 2-4 ngày | Industry est. | ❓ Low |
| CO review time per app | 20-45 phút | Industry est. | 🟡 Medium |
| CO team size | 10-12 FTE | Calculated (A1 ÷ capacity) | ❓ Low |
| NPL rate (CC) | 3.5% | FiinRatings + industry | 🟡 Medium |
| Fraud rate (origination) | 0.8% | Visa VN Q2 2025 | 🟡 Medium |
| Manual review rate | 100% | By definition (no AI) | ✅ High |
| SLA compliance | ❓ Unknown | No SLA currently | ❓ |
| Audit trail fields | ❓ ~5-8 fields | Industry est. | ❓ Low |
| **Shadow CO validated** | **❌ Chưa** | **N/A** | **N/A** |

> **⚠️ Toàn bộ flow chưa được validate với CO tại Bank X.** Cần shadow ít nhất 1 ngày trước Week 12. Nếu không kịp → ghi rõ trong MVP assumptions log (assumptions-log.md) và note "As-is flow = industry generic, not Bank X specific" trong mọi document tham chiếu flow này.

---

## Tracking

- [ ] ⚠️ **Đã shadow CO ít nhất 1 ngày chưa?** → Nếu chưa, flow này là assumptions.
- [ ] CBS system type confirmed? (T24/Flexcube?)
- [ ] CIC integration method confirmed? (API/portal/batch?)
- [ ] eKYC provider confirmed?
- [ ] Scoring system type confirmed? (scorecard/rules/none?)
- [ ] CO authority limit confirmed?
- [ ] Committee composition + SLA confirmed?
- [ ] Exception handling protocols confirmed?

---

## Ghi Chú

1. **Flow là generic NHTM VN** — mỗi bank khác nhau đáng kể. Cần validate.
2. **Pain point #1 (CO inconsistency) là strongest argument cho AI-CRDS** khi pitch C-level.
3. **Cross-reference:** decision-state-spec.md (as-is section, simpler version), damage-model.md (cost of current errors), feature-availability-matrix.md (data sources per step).