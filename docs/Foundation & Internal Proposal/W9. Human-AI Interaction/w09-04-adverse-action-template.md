# Adverse Action Templates — AI-CRDS
> **Tags:** `[Compliance]` `[UX]` `[Product]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 9
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

3 templates chuẩn cho adverse action notice. Comply Luật TCTD 2024, NĐ 356/2025, Luật AI 134/2025. Cần Legal + Compliance review trước khi production.

Mở rộng từ adverse-action-flow.md (Week 5) — tuần này focus vào template text + reason library hoàn chỉnh.

---

## 1. TEMPLATE A — Credit Score Based Rejection

Dùng khi: rejection dựa trên AI credit scoring (majority of rejections).

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             THÔNG BÁO KẾT QUẢ XÉT DUYỆT
             THẺ TÍN DỤNG [TÊN SẢN PHẨM]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kính gửi: [Họ và tên]
Mã hồ sơ: [APP-YYYY-MM-XXXXX]
Ngày thông báo: [DD/MM/YYYY]

────────────────────────────────────────────────────────

KẾT QUẢ: CHƯA ĐÁP ỨNG ĐIỀU KIỆN PHÁT HÀNH THẺ

Sau khi xem xét hồ sơ của Quý khách, [Tên Bank X]
rất tiếc thông báo hồ sơ đề nghị phát hành thẻ tín dụng
[Tên sản phẩm] chưa đáp ứng đủ điều kiện tại thời điểm
này.

────────────────────────────────────────────────────────

LÝ DO CHÍNH:

① [LÝ DO 1 — từ reason library]
② [LÝ DO 2 — từ reason library]
③ [LÝ DO 3 — từ reason library]

────────────────────────────────────────────────────────

QUYỀN CỦA QUÝ KHÁCH:

✓ Yêu cầu xem xét lại bởi chuyên viên tín dụng
  (không sử dụng hệ thống AI)
✓ Kiểm tra thông tin tín dụng CIC miễn phí 1 lần/năm
  tại https://cic.gov.vn hoặc ứng dụng CIC Credit Connect
✓ Khiếu nại quyết định trong vòng 30 ngày
✓ Nộp hồ sơ mới sau 90 ngày kể từ ngày thông báo

────────────────────────────────────────────────────────

ⓘ Quyết định này được hỗ trợ bởi hệ thống trí tuệ
nhân tạo và được xác nhận bởi cán bộ tín dụng
của [Tên Bank X].

────────────────────────────────────────────────────────

LIÊN HỆ:
📞 Hotline: [Số hotline]
📧 Email: [Email khiếu nại]
🏦 Chi nhánh: Bất kỳ chi nhánh [Tên Bank X]

Thời gian xử lý khiếu nại: tối đa 15 ngày làm việc.

Mã thông báo: [AAN-YYYY-MM-XXXXX]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 2. TEMPLATE B — Fraud/Identity Rejection

Dùng khi: rejection do fraud flag hoặc identity verification fail. **KHÔNG tiết lộ chi tiết fraud detection** (tránh giúp fraudster learn system).

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             THÔNG BÁO KẾT QUẢ XÉT DUYỆT
             THẺ TÍN DỤNG [TÊN SẢN PHẨM]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kính gửi: [Họ và tên]
Mã hồ sơ: [APP-YYYY-MM-XXXXX]
Ngày thông báo: [DD/MM/YYYY]

────────────────────────────────────────────────────────

KẾT QUẢ: CHƯA ĐÁP ỨNG ĐIỀU KIỆN PHÁT HÀNH THẺ

Hồ sơ của Quý khách chưa đáp ứng yêu cầu xác minh
thông tin theo quy định của [Tên Bank X].

────────────────────────────────────────────────────────

LÝ DO:

Không thể hoàn tất xác minh thông tin cá nhân theo
yêu cầu quy định.

────────────────────────────────────────────────────────

QUYỀN CỦA QUÝ KHÁCH:

✓ Đến chi nhánh [Tên Bank X] gần nhất để được hỗ trợ
  xác minh thông tin trực tiếp
✓ Khiếu nại quyết định trong vòng 30 ngày

────────────────────────────────────────────────────────

LIÊN HỆ:
📞 Hotline: [Số hotline]
🏦 Chi nhánh: Bất kỳ chi nhánh [Tên Bank X]

Mã thông báo: [AAN-YYYY-MM-XXXXX]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Khác biệt vs Template A:**
- **KHÔNG** nêu "nghi ngờ gian lận" — tránh defamation risk
- **KHÔNG** nêu chi tiết fraud signals — tránh giúp fraudster
- **KHÔNG** có AI label — vì fraud rejection = bank policy, not AI-specific (optional: bank có thể chọn include)
- **KHÔNG** offer human review right — fraud rejection = final (customer có thể đến branch verify identity)
- Lý do generic: "không thể hoàn tất xác minh" — covers eKYC fail, document forgery, identity mismatch
- Hướng khách đến branch — legitimate customers can re-verify in person

---

## 3. TEMPLATE C — CO Override Rejection (AI Recommended Approve)

Dùng khi: CO override AI recommendation to reject. Reasons from CO, not AI.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             THÔNG BÁO KẾT QUẢ XÉT DUYỆT
             THẺ TÍN DỤNG [TÊN SẢN PHẨM]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kính gửi: [Họ và tên]
Mã hồ sơ: [APP-YYYY-MM-XXXXX]
Ngày thông báo: [DD/MM/YYYY]

────────────────────────────────────────────────────────

KẾT QUẢ: CHƯA ĐÁP ỨNG ĐIỀU KIỆN PHÁT HÀNH THẺ

Sau khi xem xét hồ sơ, [Tên Bank X] rất tiếc thông báo
hồ sơ chưa đáp ứng đủ điều kiện.

────────────────────────────────────────────────────────

LÝ DO CHÍNH:

① [LÝ DO 1 — từ CO override reason, không phải AI]
② [LÝ DO 2]
③ [LÝ DO 3 — nếu có]

────────────────────────────────────────────────────────

QUYỀN CỦA QUÝ KHÁCH:

✓ Yêu cầu xem xét lại bởi chuyên viên tín dụng khác
✓ Kiểm tra thông tin tín dụng CIC miễn phí 1 lần/năm
✓ Khiếu nại quyết định trong vòng 30 ngày
✓ Nộp hồ sơ mới sau 90 ngày

────────────────────────────────────────────────────────

ⓘ Quyết định này được hỗ trợ bởi hệ thống trí tuệ
nhân tạo và được xác nhận bởi cán bộ tín dụng
của [Tên Bank X].

────────────────────────────────────────────────────────

LIÊN HỆ:
📞 Hotline: [Số hotline]
📧 Email: [Email khiếu nại]

Mã thông báo: [AAN-YYYY-MM-XXXXX]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Khác biệt vs Template A:**
- Reasons từ CO override (mapped to plain language), không phải AI model output
- AI label vẫn present (AI was involved in process dù CO overrode)
- "Xem xét lại bởi chuyên viên **khác**" — different CO reviews (not same CO)

---

## 4. REJECTION REASON LIBRARY — Complete

### 4.1 Credit Score Reasons

| Code | Internal reason | Plain language (customer-facing) |
|------|----------------|--------------------------------|
| R01 | `cic_score_low` | "Điểm tín dụng tại Trung tâm Thông tin Tín dụng Quốc gia (CIC) chưa đạt mức tối thiểu" |
| R02 | `dti_high` | "Tỷ lệ nghĩa vụ nợ hiện tại so với thu nhập vượt mức cho phép" |
| R03 | `dpd_30_recent` | "Có lịch sử thanh toán chậm trong 12 tháng gần nhất" |
| R04 | `dpd_90_history` | "Có lịch sử nợ quá hạn nghiêm trọng (trên 90 ngày)" |
| R05 | `npl_group_3plus` | "Có nợ xấu trong lịch sử tín dụng" |
| R06 | `inquiries_high` | "Số lượng yêu cầu vay vốn gần đây cao bất thường" |
| R07 | `debt_total_high` | "Tổng dư nợ hiện tại tại các tổ chức tín dụng vượt mức cho phép" |
| R08 | `credit_history_short` | "Chưa có đủ lịch sử tín dụng để đánh giá" |

### 4.2 Income/Employment Reasons

| Code | Internal reason | Plain language |
|------|----------------|---------------|
| R09 | `income_insufficient` | "Thu nhập chưa đáp ứng yêu cầu tối thiểu cho hạn mức đề nghị" |
| R10 | `income_unverifiable` | "Không thể xác minh thu nhập theo yêu cầu" |
| R11 | `employment_short` | "Thời gian làm việc tại đơn vị hiện tại chưa đủ yêu cầu tối thiểu" |
| R12 | `employer_unverifiable` | "Không thể xác minh thông tin nơi làm việc" |

### 4.3 Identity/Document Reasons

| Code | Internal reason | Plain language |
|------|----------------|---------------|
| R13 | `ekyc_fail` | "Không thể xác minh danh tính theo yêu cầu" |
| R14 | `data_mismatch` | "Thông tin khai báo chưa khớp với hồ sơ xác minh" |
| R15 | `age_insufficient` | "Chưa đủ điều kiện về độ tuổi" |
| R16 | `address_unverifiable` | "Không thể xác minh địa chỉ thường trú" |

### 4.4 Fraud Reasons (Generic — KHÔNG tiết lộ chi tiết)

| Code | Internal reason | Plain language |
|------|----------------|---------------|
| R17 | `fraud_identity` | "Không thể hoàn tất xác minh thông tin cá nhân theo quy định" |
| R18 | `fraud_document` | "Không thể hoàn tất xác minh thông tin cá nhân theo quy định" |
| R19 | `fraud_velocity` | "Không thể hoàn tất xác minh thông tin cá nhân theo quy định" |

**Note:** R17, R18, R19 dùng cùng 1 plain language text — intentionally vague. Không phân biệt loại fraud cho customer.

### 4.5 Reason Selection Rules

1. Always show **top 3 reasons** ordered by model feature importance (highest impact first)
2. **KHÔNG** show: AI score, threshold, model version, internal codes
3. **KHÔNG** show reasons that reveal protected attributes: ~~"Bạn ở nông thôn"~~ ~~"Bạn quá trẻ"~~
4. If only 1-2 strong reasons → show 1-2 (don't pad with weak reasons)
5. Fraud reasons → always use generic R17 text. Never expose fraud type.

---

## 5. TEMPLATE SELECTION LOGIC

```
Decision = REJECTED
    │
    ├── Fraud flag involved? (State 3 → REJECTED or REJECTED_FRAUD)
    │   ├── YES → Template B (Fraud/Identity)
    │   └── NO ─┐
    │            │
    ├── CO override? (CO rejected when AI recommended approve/review)
    │   ├── YES → Template C (CO Override)
    │   │         Reasons from CO override dropdown, mapped to plain language
    │   └── NO ─┐
    │            │
    └── Standard AI-based rejection
        └── Template A (Credit Score)
            Reasons from AI model top 3 factors, mapped to plain language
```

---

## 6. CHANNEL-SPECIFIC FORMAT

| Channel | Format | Character limit | Template adaptation |
|---------|--------|----------------|-------------------|
| **In-app** | Full template rendered in app notification inbox | No limit | Full template as-is |
| **Email** | HTML email with bank branding | No limit | Full template + bank logo + formatting |
| **SMS** | Short text + link | ~70 chars (Unicode Vietnamese) | "Bank X: Hồ sơ CC [mã] chưa đạt điều kiện. Chi tiết: [link] hoặc gọi [hotline]" |
| **Branch letter** | Printed A4, bank letterhead, CO signature | 1 page | Full template + CO signature + bank stamp |

---

## Tracking

- [ ] Template A/B/C reviewed with Compliance?
- [ ] Reason library (R01-R19) reviewed with Legal?
- [ ] AI label wording confirmed with Legal? (Luật AI 134/2025)
- [ ] "Human review right" wording confirmed with Compliance?
- [ ] SMS template fits 70-char Unicode limit?
- [ ] Template selection logic reviewed with dev team?
- [ ] Fraud template (B) reviewed: sufficiently generic to not expose fraud method?

---

## Ghi Chú

1. **Templates are DRAFT** — Legal + Compliance must review before production use.
2. **Fraud template intentionally vague** — "không thể xác minh" covers all fraud types without revealing which fraud signal triggered. This protects the bank's fraud detection capability.
3. **CO Override template (C) still includes AI label** — because AI was part of the process even though CO overrode. NĐ 356 + Luật AI 134/2025 require disclosure.
4. **"Chuyên viên khác"** in Template C human review right — important: different CO must review, not the same CO who rejected. Prevents rubber-stamping of override decision.
5. **Cross-reference:** adverse-action-flow.md (full flow design), decision-architecture.md (terminal states + retention), pdpd-impact-assessment.md (customer data rights).