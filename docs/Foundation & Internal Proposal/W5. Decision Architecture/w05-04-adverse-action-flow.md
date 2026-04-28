# Adverse Action Flow — AI-CRDS
> **Tags:** `[Product]` `[Compliance]` `[UX]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 5
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Define quy trình thông báo từ chối khách hàng: nội dung, format, delivery channel, timeline, quyền khiếu nại. Comply Luật TCTD 2024, NĐ 356/2025 (BVDLCN), Luật AI 134/2025.

---

## 1. LEGAL BASIS — Tại sao cần Adverse Action Notice?

| Yêu cầu | Nguồn pháp lý | Nội dung |
|---------|---------------|---------|
| **Thông báo lý do từ chối** | Luật TCTD 2024 (best practice) + NĐ 356/2025 Điều 9 (quyền được giải thích quyết định tự động) | Khách hàng có quyền biết tại sao bị từ chối. Đặc biệt khi AI involved → giải thích phải meaningful. |
| **Ghi nhãn AI** | Luật AI 134/2025 | Output có AI involvement phải ghi rõ "được hỗ trợ bởi AI." |
| **Quyền yêu cầu human review** | NĐ 356/2025 Điều 9 + Luật AI 134/2025 Điều 4 | Khách có quyền yêu cầu con người xem xét lại nếu không đồng ý với quyết định có AI. |
| **Quyền khiếu nại** | Luật BVDLCN 91/2025 | Quyền khiếu nại đến Bộ Công an (A05) hoặc tòa án nếu cho rằng quyền DLCN bị xâm phạm. |
| **Quyền xem CIC** | CIC regulations | Khách có quyền kiểm tra thông tin tín dụng CIC miễn phí 1 lần/năm. |

---

## 2. ADVERSE ACTION NOTICE — NỘI DUNG

### 2.1 Template — Tiếng Việt (primary)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              THÔNG BÁO KẾT QUẢ XÉT DUYỆT
              THẺ TÍN DỤNG [TÊN SẢN PHẨM]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kính gửi: [Họ và tên khách hàng]
Mã hồ sơ: [Application ID]
Ngày nộp hồ sơ: [DD/MM/YYYY]
Ngày thông báo: [DD/MM/YYYY]

──────────────────────────────────────────────────────

KẾT QUẢ: KHÔNG ĐỦ ĐIỀU KIỆN PHÁT HÀNH THẺ

Sau khi xem xét hồ sơ của Quý khách, [Tên Bank X] rất 
tiếc phải thông báo rằng hồ sơ đề nghị phát hành thẻ 
tín dụng [Tên sản phẩm] không đáp ứng đủ điều kiện 
tại thời điểm này.

──────────────────────────────────────────────────────

LÝ DO CHÍNH (theo thứ tự ảnh hưởng):

1. [Lý do 1 — plain language]
2. [Lý do 2 — plain language]  
3. [Lý do 3 — plain language]

──────────────────────────────────────────────────────

ⓘ  THÔNG TIN QUAN TRỌNG

• Quyết định này được hỗ trợ bởi hệ thống trí tuệ 
  nhân tạo và được xác nhận bởi cán bộ tín dụng 
  của [Tên Bank X].

• Quý khách có quyền:
  ✓ Yêu cầu xem xét lại bởi cán bộ tín dụng
  ✓ Kiểm tra thông tin tín dụng CIC miễn phí 
    (1 lần/năm) tại https://cic.gov.vn hoặc 
    ứng dụng CIC Credit Connect
  ✓ Khiếu nại quyết định trong vòng 30 ngày
  ✓ Nộp hồ sơ mới sau 90 ngày kể từ ngày 
    thông báo này

──────────────────────────────────────────────────────

📞  LIÊN HỆ KHIẾU NẠI

Hotline: [Số hotline Bank X]
Email: [Email khiếu nại Bank X]
Chi nhánh: Quý khách có thể đến bất kỳ chi nhánh 
[Tên Bank X] để được hỗ trợ

Thời gian xử lý khiếu nại: tối đa 15 ngày làm việc
kể từ ngày nhận khiếu nại.

──────────────────────────────────────────────────────

Trân trọng,
[Tên Bank X]
Mã thông báo: [AAN-YYYY-MM-XXXXX]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2.2 Rejection Reason Catalog — Plain Language

AI-CRDS phải translate model output (technical) thành lý do khách hiểu được (plain language):

| # | Technical reason (internal) | Plain language (customer-facing) | Source |
|---|---------------------------|--------------------------------|--------|
| R1 | `cic_score < threshold` | "Điểm tín dụng tại Trung tâm Thông tin Tín dụng Quốc gia (CIC) thấp hơn yêu cầu tối thiểu" | CIC |
| R2 | `dti > 45%` | "Tỷ lệ nghĩa vụ nợ hiện tại so với thu nhập vượt mức cho phép" | CIC + App |
| R3 | `max_dpd_12m >= 30` | "Có lịch sử thanh toán chậm trong 12 tháng gần nhất" | CIC |
| R4 | `max_dpd_12m >= 90` | "Có lịch sử nợ quá hạn nghiêm trọng (trên 90 ngày)" | CIC |
| R5 | `npl_group >= 3` | "Có nợ xấu (nhóm 3 trở lên) trong lịch sử tín dụng" | CIC |
| R6 | `inquiries_6m > threshold` | "Số lượng yêu cầu vay vốn gần đây cao bất thường" | CIC |
| R7 | `employment_months < 6` | "Thời gian làm việc tại đơn vị hiện tại chưa đủ yêu cầu tối thiểu" | App form |
| R8 | `income_insufficient` | "Thu nhập chưa đáp ứng yêu cầu tối thiểu cho hạn mức đề nghị" | App form |
| R9 | `no_cic_record` (thin file) | "Chưa có đủ lịch sử tín dụng để đánh giá" | CIC |
| R10 | `existing_debt_high` | "Tổng dư nợ hiện tại tại các tổ chức tín dụng vượt mức cho phép" | CIC |
| R11 | `fraud_flag` | "Không thể xác minh danh tính theo yêu cầu" | eKYC/Fraud |
| R12 | `age < minimum` | "Chưa đủ điều kiện về độ tuổi" | CBS |
| R13 | `address_unverifiable` | "Không thể xác minh địa chỉ thường trú" | App form |
| R14 | `employer_unverifiable` | "Không thể xác minh thông tin nơi làm việc" | App form |

**Rules:**
- Luôn show **top 3 reasons** theo thứ tự ảnh hưởng (feature importance từ model)
- **KHÔNG** show: AI score number, model version, threshold values, internal codes
- **KHÔNG** show: "Bạn bị từ chối bởi AI" — phải frame là bank decision, AI chỉ hỗ trợ
- **KHÔNG** show lý do vague: ~~"Không đủ điều kiện theo quy định ngân hàng"~~
- Mỗi reason phải actionable: khách biết cần cải thiện gì

### 2.3 Rejection Reasons per Terminal State

| Terminal State | Reason source | Template variation |
|---------------|-------------|-------------------|
| **REJECTED** (credit risk) | AI model top 3 factors (R1-R14) | Standard template ở Section 2.1 |
| **REJECTED** (CO override) | CO-provided reasons (from override reason dropdown) | Standard template, reasons từ CO chứ không phải AI |
| **REJECTED_FRAUD** | Generic fraud reason | "Không thể xác minh danh tính theo yêu cầu quy định." **KHÔNG tiết lộ** fraud detection details (tránh giúp fraudster learn). |
| **EXPIRED** (no response) | No reasons needed — application lapsed | "Hồ sơ đã hết hạn do không nhận được thông tin bổ sung trong thời hạn quy định. Quý khách có thể nộp hồ sơ mới." |

---

## 3. AI LABEL — Luật AI 134/2025 Compliance

### 3.1 Mandatory AI Disclosure

Mọi adverse action notice khi AI involved phải có:

```
"Quyết định này được hỗ trợ bởi hệ thống trí tuệ nhân tạo
và được xác nhận bởi cán bộ tín dụng của [Tên Bank X]."
```

### 3.2 Khi nào KHÔNG cần AI label?

| Scenario | AI label? | Lý do |
|---------|----------|-------|
| AI scoring → CO confirm reject | ✅ Có | AI involved |
| AI scoring → CO override reject (AI said approve) | ✅ Có | AI involved trong process dù CO override |
| Customer opt-out AI → 100% manual | ❌ Không | AI không involved |
| State 5 expired (no AI scoring ran) | ❌ Không | AI chưa chạy |

### 3.3 Customer Right to Human Review

Thêm vào mọi AI-involved adverse action:

```
"Quý khách có quyền yêu cầu cán bộ tín dụng xem xét 
lại hồ sơ mà không sử dụng hệ thống trí tuệ nhân tạo. 
Vui lòng liên hệ [Hotline/Email] trong vòng 30 ngày."
```

**Implementation:** Khi khách yêu cầu human review → route to State 2 (Standard Review) with flag `human_review_request = true`. Assign to **different CO** (không phải CO ban đầu). CO review 100% manual, AI output ẩn.

---

## 4. DELIVERY CHANNELS

### 4.1 Channel Selection Logic

```
Application channel?
    │
    ├── Online / Mobile App
    │   ├── Primary: In-app notification (push + inbox)
    │   ├── Secondary: Email (nếu có)
    │   └── Fallback: SMS (summary + link to full notice)
    │
    ├── Branch
    │   ├── Primary: In-branch letter (print, CO hand over)
    │   ├── Secondary: Email (nếu có)
    │   └── Fallback: SMS
    │
    └── All channels
        └── Full notice available in app / web portal anytime
```

### 4.2 Channel-specific Format

| Channel | Format | Content | Timing |
|---------|--------|---------|--------|
| **In-app notification** | Push notification + full notice in inbox | Push: "Kết quả xét duyệt thẻ tín dụng: Xem chi tiết." Inbox: full template Section 2.1 | Within 1 giờ after decision |
| **Email** | HTML email | Full template Section 2.1. Responsive design. Include bank logo. Link to app for details. | Within 1 giờ |
| **SMS** | 160 characters max | "Bank X: Hồ sơ thẻ tín dụng [mã] chưa đáp ứng điều kiện. Chi tiết: [link] hoặc gọi [hotline]." | Within 1 giờ |
| **In-branch letter** | A4 printed, bank letterhead | Full template Section 2.1. CO signature. Bank stamp. | Same day (nếu decide tại branch) hoặc gửi bưu điện 3-5 ngày |

### 4.3 Multi-channel Delivery Rules

| Rule | Detail |
|------|--------|
| **Minimum 1 channel** | Mọi rejection phải được thông báo ít nhất 1 channel |
| **Preferred: 2 channels** | App/email + SMS (redundancy) |
| **Language** | Tiếng Việt (primary). English available nếu customer preference. |
| **Timing** | Within 1 giờ sau decision cho digital channels. Same day cho branch. |
| **Retention** | Notice available trong app/portal ≥ 90 ngày. Email/SMS: customer's own retention. |
| **Proof of delivery** | Log: channel, timestamp, delivery status (sent/delivered/read nếu trackable). |

---

## 5. COMPLAINT HANDLING FLOW

### 5.1 Complaint Types & Routing

```
Khách phàn nàn về rejection
    │
    ├── TYPE A: "Tại sao tôi bị từ chối?"
    │   ├── Answer: Gửi lại adverse action notice (đã có reasons)
    │   ├── If not satisfied → Route to human review (Section 3.3)
    │   └── SLA: 3 business days (initial response)
    │
    ├── TYPE B: "Tôi muốn người thật xem lại, không phải AI"
    │   ├── Route to State 2 (Standard Review, different CO)
    │   ├── Flag: human_review_request = true
    │   ├── AI output ẩn — CO review 100% manual
    │   └── SLA: 5 business days
    │
    ├── TYPE C: "Thông tin CIC/data của tôi sai"
    │   ├── Guide khách check CIC tại cic.gov.vn (miễn phí 1 lần/năm)
    │   ├── Nếu CIC data sai → khách dispute trực tiếp với CIC
    │   ├── Sau khi CIC update → khách có thể apply lại
    │   └── SLA: 5 business days (bank response) + CIC dispute timeline
    │
    ├── TYPE D: "AI phân biệt đối xử / thiên lệch"
    │   ├── IMMEDIATE escalate to Risk Manager + Compliance (Level 4)
    │   ├── Audit specific case + segment analysis
    │   ├── Luật AI 134/2025 compliance review
    │   └── SLA: 10 business days
    │
    └── TYPE E: "Tôi muốn xóa dữ liệu của tôi"
        ├── Route to DPO / Data Privacy team
        ├── Apply Tiered Data Lifecycle (pdpd-impact-assessment.md §4.4)
        ├── Xóa Tầng 1 (raw PII). Giữ Tầng 2 (pseudonymized audit).
        └── SLA: 15 business days (per NĐ 356)
```

### 5.2 Complaint Escalation

| Level | Handles | SLA |
|-------|---------|-----|
| **Frontline (Call center / Branch)** | Type A initial response | 3 BD |
| **CO (Standard Review)** | Type B human review request | 5 BD |
| **Senior CO + Compliance** | Type C data dispute, Type D bias | 10 BD |
| **Risk Manager + Legal** | Type D persistent, regulatory complaint, A05 inquiry | 15 BD |
| **C-level** | If complaint reaches media / SBV / Bộ Công an | Immediate |

### 5.3 Re-application Rules

| Scenario | Waiting period | Condition |
|---------|---------------|----------|
| Standard rejection | **90 ngày** | Khách có thể apply lại. Lý do rejection trước NOT auto-reject (fresh review). |
| Rejection after human review (Type B) | **90 ngày** | Same as above. |
| Fraud rejection | **12 tháng** (hoặc permanent nếu confirmed fraud) | SIMO record may block. Cần prove identity cleared. |
| Expired (no response) | **0 ngày** | Có thể apply lại ngay. |
| Withdrawn | **0 ngày** | Có thể apply lại ngay. |

---

## 6. DATA SCHEMA — Adverse Action Record

```python
ADVERSE_ACTION_SCHEMA = {
    "aan_id":               str,    # "AAN-2026-04-00001"
    "application_id":       str,    # FK to application
    "decision_id":          str,    # FK to audit trail
    
    # Decision info
    "rejection_type":       str,    # "credit_risk" | "fraud" | "expired" | "co_override"
    "ai_involved":          bool,   # True nếu AI scoring ran
    "ai_label_displayed":   bool,   # True nếu AI label shown (Luật AI)
    
    # Reasons
    "reason_1_code":        str,    # "R1" (internal code)
    "reason_1_text":        str,    # "Điểm tín dụng tại CIC thấp hơn yêu cầu tối thiểu"
    "reason_2_code":        str,
    "reason_2_text":        str,
    "reason_3_code":        str,
    "reason_3_text":        str,
    
    # Delivery
    "channels_sent":        list,   # ["app_notification", "email", "sms"]
    "app_sent_at":          datetime,
    "email_sent_at":        datetime,
    "sms_sent_at":          datetime,
    "letter_sent_at":       datetime,   # null nếu không gửi letter
    "delivery_status":      dict,   # {"app": "delivered", "email": "sent", "sms": "delivered"}
    
    # Customer rights info
    "human_review_offered": bool,   # True (always for AI-involved)
    "cic_check_info":       bool,   # True (always)
    "complaint_channel":    str,    # Hotline + email included
    "reapply_date":         date,   # Earliest date khách có thể apply lại
    
    # Complaint tracking
    "complaint_received":   bool,   # True nếu khách khiếu nại
    "complaint_id":         str,    # FK to complaint record (nếu có)
    "human_review_requested": bool, # True nếu khách yêu cầu human review
    
    # Timestamps
    "created_at":           datetime,
    "updated_at":           datetime,
}
```

---

## 7. OPT-OUT AI FLOW

NĐ 356/2025 Điều 9: khách có quyền không đồng ý với quyết định tự động.

### 7.1 Pre-application Opt-out

```
Khách bắt đầu apply CC (online/app)
    │
    ├── Consent form hiển thị:
    │   "Hồ sơ của Quý khách sẽ được xử lý có hỗ trợ 
    │    của hệ thống trí tuệ nhân tạo để đánh giá tín dụng.
    │    Quyết định cuối cùng do cán bộ tín dụng đưa ra."
    │
    │   [✓ Đồng ý — xử lý có hỗ trợ AI]
    │   [✗ Không đồng ý — yêu cầu xử lý hoàn toàn bởi nhân viên]
    │
    ├── Nếu đồng ý → Normal AI-CRDS flow
    │
    └── Nếu không đồng ý (opt-out):
        ├── Application flag: opt_out_ai = true
        ├── Bypass AI scoring entirely
        ├── Route to State 2 (Standard Review) — 100% manual
        ├── Adverse action notice (nếu reject): KHÔNG có AI label
        ├── Review time: 20-35 min (full manual, no batch)
        └── Log: opt_out_reason, opt_out_timestamp
```

### 7.2 Post-rejection Opt-out (Human Review Request)

```
Khách nhận adverse action notice (AI-involved)
    │
    ├── Thấy: "Quý khách có quyền yêu cầu xem xét lại 
    │          bởi cán bộ tín dụng không sử dụng AI"
    │
    └── Khách gọi hotline / email / đến branch
        │
        ├── Verify identity (CCCD + application ID)
        ├── Create complaint record (Type B)
        ├── Route to State 2 (Standard Review)
        │   ├── Assign DIFFERENT CO (không phải CO ban đầu)
        │   ├── AI output HIDDEN (CO không thấy AI score)
        │   ├── CO review from scratch: CIC + documents + assessment
        │   └── CO decision: Approve or Reject (independent)
        │
        ├── Nếu CO approve:
        │   ├── Issue CC
        │   ├── Log: human_review_override = true
        │   └── Notify khách: "Sau khi xem xét lại, hồ sơ đã được chấp thuận"
        │
        └── Nếu CO reject (same conclusion):
            ├── New adverse action notice (WITHOUT AI label)
            ├── Reasons từ CO (có thể giống hoặc khác AI reasons)
            └── Khách vẫn có quyền khiếu nại tiếp (Type D nếu cho rằng bias)
```

---

## 8. TIMING & SLA

### 8.1 Adverse Action Notice Timeline

| Step | Timing | Owner |
|------|--------|-------|
| CO ký quyết định reject | T+0 | CO |
| System generate adverse action notice | T+0 (automated, < 1 phút) | System |
| Delivery — digital channels (app, email, SMS) | T+0 to T+1h | System |
| Delivery — branch letter (nếu apply tại branch) | Same day or T+3-5 BD (mail) | Branch ops |
| Notice available trong app/portal | T+0 | System (retained ≥ 90 ngày) |
| Complaint window opens | T+0 | System |
| Complaint window closes (recommended) | T+30 calendar days | Policy |
| Re-application window opens | T+90 calendar days | Policy |

### 8.2 Human Review Request SLA

| Step | SLA | Owner |
|------|-----|-------|
| Khách submit human review request | T+0 | Customer |
| Acknowledge receipt | T+1 BD | Call center / Branch |
| Assign to CO (different from original) | T+1 BD | System / Supervisor |
| CO complete review | T+5 BD from assignment | CO |
| Notify khách kết quả | T+1 BD from CO decision | System |
| **Total end-to-end** | **≤ 8 BD** | |

---

## 9. AUDIT REQUIREMENTS

Mọi adverse action phải logged:

| Field | Bắt buộc? | Lý do |
|-------|----------|-------|
| Application ID + Decision ID | ✅ | Traceability |
| Rejection reasons (3, coded + text) | ✅ | Explainability (NĐ 356, Luật AI) |
| AI involved flag | ✅ | Luật AI 134/2025 compliance |
| AI label displayed flag | ✅ | Proof of Luật AI compliance |
| Delivery channels + timestamps | ✅ | Proof of delivery |
| Human review offered flag | ✅ | NĐ 356 compliance |
| Complaint received flag + ID | ✅ | Complaint tracking |
| Re-application earliest date | ✅ | Policy enforcement |
| CO ID who signed rejection | ✅ | Accountability |

**Retention:** Adverse action records giữ **5 năm** (align REJECTED terminal state retention — decision-architecture.md §Terminal States).

---

## Tracking — Tự hỏi cuối tuần

- [ ] Adverse action template đã review với Compliance Officer chưa?
- [ ] Rejection reason catalog (R1-R14) đủ cover mọi scenario chưa?
- [ ] Plain language reasons thực sự "plain" chưa? (Test với non-banking person)
- [ ] AI label wording đã review với Legal chưa? (Luật AI 134/2025)
- [ ] Complaint handling flow align với bank's existing complaint process chưa?
- [ ] Opt-out flow (NĐ 356) đã design trong application form chưa?
- [ ] Human review request flow — CO assignment logic (different CO) feasible với team size?
- [ ] Re-application 90 ngày — align với bank policy chưa?
- [ ] SMS 160-char template fit chưa? (tiếng Việt Unicode = ít ký tự hơn)

---

## Ghi Chú & Limitations

1. **Template là draft** — cần Legal + Compliance review trước khi dùng. Wording có thể thay đổi.
2. **Rejection reason catalog (R1-R14)** dựa trên feature priority stack (feature-availability-matrix.md). Khi thêm features mới → thêm reasons mới.
3. **"Không tiết lộ fraud details"** cho REJECTED_FRAUD — cố ý vague ("không thể xác minh danh tính") để không giúp fraudster learn hệ thống.
4. **Human review request** — CO mới review WITHOUT AI output. Nếu bank muốn CO thấy AI output → cần discuss với Compliance (có thể introduce bias).
5. **90-day re-application window** là đề xuất — mỗi bank có policy khác. Một số cho apply lại ngay, một số 6 tháng.
6. **SMS Unicode** — tiếng Việt dùng Unicode characters → mỗi SMS chỉ ~70 ký tự (thay vì 160 ASCII). Template SMS cần test fit.
7. **Cross-reference:** decision-architecture.md (terminal states, override governance), pdpd-impact-assessment.md (data subject rights, deletion flow), sbv-requirements.md (Luật AI 134/2025 requirements), escalation-tree.md (complaint escalation).