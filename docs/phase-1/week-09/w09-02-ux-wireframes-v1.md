# UX Wireframes Notes — CO Review Interface
> **Tags:** `[Product]` `[UX]` `[Design]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 9
> **Version:** v1.0 (low-fidelity text wireframes)
> **Ngày:** 09/04/2026

---

## Mục đích

Low-fidelity wireframes cho 3 core screens + design decisions. Text/ASCII — pixel-perfect design sau khi interview data confirms assumptions.

**Design principles:**
1. **AI explains, CO decides** — AI panel informative, không prescriptive
2. **Không ẩn information** — CO thấy full data + AI reasoning
3. **Override luôn accessible** — không cần nhiều clicks
4. **Luật AI 134/2025 label** hiển thị rõ ràng
5. **Speed matters** — batch review phải nhanh, individual review phải comprehensive

---

## SCREEN 1 — BATCH REVIEW QUEUE (State 1)

### Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│ 🏦 AI-CRDS — Batch Review Queue                    CO: NVA  │
│ ⓘ Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📋 12 hồ sơ chờ xác nhận — AI recommends: APPROVE          │
│                                                             │
│ ┌─ Filter: [Tất cả ▼] Sort: [Score cao→thấp ▼] Search: [___]│
│ │                                                           │
│ │ [☐] # │ Họ tên      │ Score │ Conf │ Top Factor        │ Limit   │
│ │ ────────────────────────────────────────────────────────── │
│ │ [☑] 1 │ Nguyễn V.A  │ 0.88  │ 94%  │ CIC 740, DTI 22% │ 50M     │
│ │ [☑] 2 │ Trần T.B    │ 0.84  │ 91%  │ 5yr employ, CIC 710│ 40M    │
│ │ [☑] 3 │ Lê V.C      │ 0.82  │ 89%  │ CIC 720, exist 3yr │ 60M    │
│ │ [☐] 4 │ Phạm T.D    │ 0.79  │ 87%  │ 3yr employ, DTI 28%│ 50M    │
│ │ [☑] 5 │ Hoàng V.E   │ 0.78  │ 86%  │ CIC 690, exist 5yr │ 40M    │
│ │ ... (7 more)                                              │
│ │                                                           │
│ │ Click row → expand detail panel (below)                   │
│ └───────────────────────────────────────────────────────────│
│                                                             │
│ ── Expanded Detail (row 4 — Phạm T.D) ─────────────────── │
│ │ Age: 29 │ Income: 22M │ Employer: FPT (FDI) │ 8M employ │
│ │ CIC: 680 │ Debt: 85M │ DTI: 28% │ DPD: 0 │ Inquiries: 1│
│ │ eKYC: ✓ PASS (0.96) │ Fraud: CLEAR (0.08)             │
│ │ AI explains: CIC adequate, stable employment, low DTI    │
│ └───────────────────────────────────────────────────────── │
│                                                             │
│ Selected: 4/12                                              │
│ [✓ Confirm Selected (4)] [✗ Override Selected] [→ Move to Review] │
│                                                             │
│ ⚠️ Max batch confirm: 10 hồ sơ/lần (Risk Committee policy) │
└─────────────────────────────────────────────────────────────┘
```

### Design Decisions

| Question | Decision | Rationale |
|---------|---------|----------|
| **Bao nhiêu hồ sơ per page?** | 10-15 per page, paginated | More than 15 → CO scroll fatigue → rubber-stamping risk |
| **Max batch confirm?** | Max 10 per confirm action | Risk Committee policy (guardrail G-O2). Force CO to process in manageable chunks. ❓ Cần Risk Committee confirm con số. |
| **Sort/filter?** | Yes: sort by score, confidence, limit, date. Filter by limit range, score range. | CO may want to review highest-limit first (most risk). |
| **Expand row?** | Click row → inline expand (không new page). Show: demographics + CIC summary + AI explanation. | Speed: CO không muốn navigate away. Expand = quick glance. |
| **Override 1 hồ sơ?** | Uncheck from batch → click "Override Selected" → override pop-up (Screen 3) | Minimal friction. Override phải dễ — không discourage CO from overriding when needed. |
| **Select all?** | NO "select all" button | Prevent rubber-stamping. CO phải check each row individually. Force at least 1 interaction per record. |
| **AI label placement** | Top of screen, persistent. Not per-row (too noisy). | Luật AI 134/2025: must be visible. Top-level = always visible without scroll. |
| **Time tracking** | Hidden counter: `co_review_time_seconds` starts when screen loads, stops when confirm clicked. Per-record: time between expand and collapse/next. | Monitoring L3-W6 (avg review time). CO doesn't need to see timer (pressure → worse decisions). |

---

## SCREEN 2 — INDIVIDUAL REVIEW (State 2)

### Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│ 🏦 AI-CRDS — Standard Review                          CO: NVA  │
│ ⓘ Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo       │
│ Hồ sơ: APP-2026-04-001 │ Phạm Thị D │ Nộp: 09/04/2026        │
│ SLA: ██████░░░░ 4h/8h remaining                                │
├──────────────────────────┬──────────────────────────────────────┤
│                          │                                      │
│ ┌── AI ASSESSMENT ─────┐ │ ┌── APPLICANT PROFILE ────────────┐ │
│ │                      │ │ │                                  │ │
│ │ Risk Score: 0.52     │ │ │ Tuổi: 32    Gender: Nữ           │ │
│ │ ████████░░ MEDIUM    │ │ │ Thu nhập: 18M (declared)         │ │
│ │                      │ │ │ Thu nhập verified: 15M ✓(payroll)│ │
│ │ Confidence: 72%      │ │ │ Employer: Công ty ABC (SOE)     │ │
│ │ ████████░░           │ │ │ Employment: 8 tháng              │ │
│ │                      │ │ │ Address: Quận 1, TP.HCM         │ │
│ │ Recommendation:      │ │ │                                  │ │
│ │ ⚠️ REVIEW NEEDED     │ │ │ Existing customer: ✓ 2 năm      │ │
│ │                      │ │ │ Products: Savings, Debit card    │ │
│ │ Fraud: CLEAR (0.12)  │ │ │ Avg balance 3M: 25M             │ │
│ ├──────────────────────┤ │ └──────────────────────────────────┘ │
│ │                      │ │                                      │
│ │ ⚠️ TOP 3 RISK        │ │ ┌── CIC REPORT ──────────────────┐ │
│ │ ❶ DTI 42% (border.)  │ │ │ CIC Score: 650                  │ │
│ │ ❷ Employment 8M      │ │ │ Outstanding: 120M               │ │
│ │ ❸ 2 inquiries/6M     │ │ │ Active loans: 3                 │ │
│ │                      │ │ │ Max DPD 12M: 0 ✓                │ │
│ │ ✅ TOP 3 POSITIVE     │ │ │ Max DPD ever: 0 ✓               │ │
│ │ ❶ CIC 650 (adequate) │ │ │ Inquiries 6M: 2                 │ │
│ │ ❷ No DPD history     │ │ │ Debt group: 1 (standard)        │ │
│ │ ❸ Existing cust 2yr  │ │ │ Credit history: 48 months       │ │
│ │                      │ │ │ [View full CIC report →]        │ │
│ └──────────────────────┘ │ └──────────────────────────────────┘ │
│                          │                                      │
│ ┌── SIMILAR CASES ─────┐ │ ┌── eKYC DETAILS ────────────────┐ │
│ │ Cases with similar    │ │ │ Identity: ✓ PASS               │ │
│ │ profile (last 6M):   │ │ │ Face match: 0.94               │ │
│ │ 23 cases → 87% good  │ │ │ Liveness: ✓ PASS               │ │
│ │ 3 cases → default    │ │ │ Document: ✓ Authentic          │ │
│ │ [View details →]     │ │ │ CCCD: ✓ Verified               │ │
│ └──────────────────────┘ │ └──────────────────────────────────┘ │
│                          │                                      │
├──────────────────────────┴──────────────────────────────────────┤
│                                                                  │
│ CO Notes: [                                                    ] │
│           [  Free text area for CO assessment notes            ] │
│                                                                  │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│ │ ✓ APPROVE   │ │ ✗ REJECT    │ │ ↑ ESCALATE  │ │ ? NEED     │ │
│ │ Set limit:  │ │             │ │ to Senior   │ │ MORE INFO  │ │
│ │ [50M ▼]     │ │             │ │             │ │            │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Design Decisions

| Question | Decision | Rationale |
|---------|---------|----------|
| **Layout** | 2-column: AI panel (left) + Applicant data (right) | CO can compare AI assessment with raw data side-by-side. |
| **AI score display** | Score number + progress bar + label (LOW/MEDIUM/HIGH) + color | CO needs quick visual read. Color: green (low risk) / yellow (medium) / red (high). |
| **Explanation display** | Top 3 risk factors + Top 3 positive factors, always visible | CO needs balanced view — not just "why reject" but also "why might approve." Prevents confirmation bias. |
| **Similar cases** | Show: X similar cases, Y% performed well | CO builds calibrated trust over time. "87% of similar cases → good" = confidence booster. ❓ Feasibility depends on historical data. |
| **CIC report** | Summary inline + "View full report" link | Most COs don't need full CIC for every case. Summary sufficient for 80% decisions. Full report 1 click away. |
| **Income verified indicator** | Green check + "(payroll)" label if verified | Highlight verified vs declared income — CO knows which to trust. |
| **SLA bar** | Top of screen, progress bar with time remaining | CO aware of time pressure without explicit countdown (less stressful than timer). |
| **CO notes** | Optional free text. Saved with audit trail. | CO can document reasoning. Not mandatory for approve (speed). Mandatory for reject (adverse action). |
| **Action buttons** | 4 buttons always visible at bottom. Large touch targets. | Approve has limit dropdown. Reject triggers adverse action flow. Escalate + Need-Info available. |
| **Approve limit** | Dropdown with suggested limit (AI-calculated based on income/DTI) + manual override | CO can accept AI suggestion or adjust. |

---

## SCREEN 3 — OVERRIDE FLOW

### Wireframe (Pop-up when CO clicks action that contradicts AI)

```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Override: REJECT                                  │
│ AI recommended: APPROVE (score 0.82, confidence 91%) │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Reason category (required): [dropdown ▼]            │
│ ┌─────────────────────────────────────────────┐     │
│ │ ○ Relationship knowledge — tôi biết thêm    │     │
│ │   thông tin AI không có                     │     │
│ │ ○ Income verification — income thực tế      │     │
│ │   khác declared                             │     │
│ │ ○ Employer verification — employer có vấn đề│     │
│ │ ○ Temporary situation — DPD do tình huống   │     │
│ │   tạm thời                                  │     │
│ │ ● AI error suspected — AI output có vẻ sai  │     │
│ │ ○ Policy concern — case ngoài policy        │     │
│ │ ○ Other                                     │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ Detail (required, min 20 chars):                    │
│ ┌─────────────────────────────────────────────┐     │
│ │ Employer mới thành lập 3 tháng, chưa có     │     │
│ │ revenue. Rủi ro cao dù CIC score OK.        │     │
│ │                                    42/20 ✓  │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ ⚠️ Override này sẽ được log trong audit trail       │
│    và review bởi Supervisor.                        │
│                                                     │
│ Supervisor approval needed?                         │
│ ● No — within my authority                          │
│ ○ Yes — notify supervisor (auto nếu limit > 50M)   │
│                                                     │
│        [Cancel]        [Submit Override]             │
└─────────────────────────────────────────────────────┘
```

### Override Trigger Rules

| CO Action | AI Recommendation | Override pop-up? | Supervisor notify? |
|----------|------------------|-----------------|-------------------|
| Approve | APPROVE (S1/S2) | ❌ No pop-up (agreement) | No |
| Approve | REVIEW (S2) | ❌ No pop-up (CO reviewed, agrees to approve) | No |
| Approve | REJECT recommendation | ✅ **Yes — override pop-up** | Yes (auto) |
| Reject | REJECT recommendation | ❌ No pop-up (agreement) | No |
| Reject | APPROVE (S1) | ✅ **Yes — override pop-up** | Yes (notify) |
| Reject | REVIEW (S2) | ❌ No pop-up (CO reviewed, decides reject = normal) | No |
| Escalate | Any | ❌ No pop-up (escalation reason required in escalate flow) | Auto (goes to Senior) |

---

## 4. ADDITIONAL UI ELEMENTS

### 4.1 AI Confidence Indicator

```
Confidence styles:

HIGH (>85%):  ██████████ 92%  [green]   "AI highly confident"
MEDIUM (60-85%): ████████░░ 72%  [yellow]  "AI moderately confident"
LOW (<60%):   ████░░░░░░ 45%  [red]     "AI uncertain — senior review recommended"
```

### 4.2 Fraud Alert Banner (State 3)

```
┌─────────────────────────────────────────────────────┐
│ 🔴 FRAUD SIGNAL DETECTED — Priority Review Required  │
│                                                     │
│ Fraud Score: 0.65 (ELEVATED)                        │
│ Triggers:                                           │
│ ├── Face match score: 0.58 (below threshold)        │
│ ├── Application velocity: 3 apps same device/24h    │
│ └── Employer not found in ĐKKD                      │
│                                                     │
│ EDD Checklist: [Start Enhanced Due Diligence →]     │
└─────────────────────────────────────────────────────┘
```

### 4.3 State 5 — Need More Info Screen

```
┌─────────────────────────────────────────────────────┐
│ 📄 Request Additional Information                    │
│                                                     │
│ Missing / needed:                                    │
│ [☑] Bank statement (3 months)                       │
│ [☑] Employment contract                             │
│ [☐] Tax return                                      │
│ [☐] Utility bill (address verification)             │
│ [☐] Other: [________________]                       │
│                                                     │
│ Message to customer:                                │
│ ┌─────────────────────────────────────────────┐     │
│ │ [Auto-generated from selections above]      │     │
│ │ "Để hoàn tất xét duyệt, vui lòng bổ sung: │     │
│ │  - Sao kê ngân hàng 3 tháng gần nhất       │     │
│ │  - Hợp đồng lao động"                      │     │
│ │                              [Edit message] │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ Deadline: 14 calendar days (23/04/2026)             │
│                                                     │
│ Send via: [☑] App  [☑] SMS  [☑] Email              │
│                                                     │
│        [Cancel]        [Send Request]               │
└─────────────────────────────────────────────────────┘
```

---

## 5. DESIGN SYSTEM NOTES

| Element | Specification |
|---------|-------------|
| **Colors** | Risk: Green (#22C55E) / Yellow (#EAB308) / Red (#EF4444). Bank brand colors for chrome. |
| **Typography** | Vietnamese-friendly font (Inter, Noto Sans). Score numbers: monospace. |
| **AI label** | Persistent top bar: "ⓘ Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo" — light blue background, not dismissible. |
| **Accessibility** | Color-blind safe (add icons alongside colors). Vietnamese text: proper diacritics. Font size ≥ 14px body. |
| **Responsive** | Desktop-first (CO dùng desktop). Tablet support nice-to-have. Mobile: view-only dashboard. |

---

## Tracking

- [ ] Batch review UX validated với ≥ 1 CO?
- [ ] Max batch size confirmed với Risk Committee?
- [ ] "No select all" decision — Risk Manager comfortable?
- [ ] Override flow realistic? (CO feedback)
- [ ] AI label placement complies Luật AI 134/2025? (Legal review)
- [ ] Similar cases panel feasible? (DS confirm data availability)

---

## Ghi Chú

1. **Low-fidelity only.** Pixel-perfect design after interview validation. These wireframes may change significantly.
2. **"No select all"** in batch review is intentional anti-rubber-stamping measure. May cause CO friction. Need to validate with CO interviews.
3. **Similar cases panel (Screen 2)** requires historical data + similarity search. May not be available for MVP. Mark as nice-to-have.
4. **Cross-reference:** decision-architecture.md (state routing), override-governance.md (override rules), adverse-action-flow.md (rejection flow), trust-calibration-guide.md (trust design).