# PDPD Impact Assessment — AI-CRDS
> **Tags:** `[Compliance]` `[Legal]` `[Architecture]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 2
> **Version:** v1.0
> **Ngày:** 25/03/2026

---

## Mục đích

Đánh giá tác động của pháp luật bảo vệ dữ liệu cá nhân đến thiết kế và vận hành AI-CRDS. Document này ảnh hưởng trực tiếp đến architecture decisions.

**⚠️ Lưu ý quan trọng:** NĐ 13/2023/NĐ-CP đã **hết hiệu lực từ 01/01/2026**. Framework hiện hành là **Luật BVDLCN 91/2025/QH15 + NĐ 356/2025/NĐ-CP**. Tài liệu này reference framework mới. Roadmap ban đầu ghi "NĐ13" — cần update.

**Không phải tư vấn pháp lý.** Cần legal review trước khi triển khai.

---

## 1. Data Inventory — AI-CRDS xử lý những PII nào?

### 1.1 Phân loại dữ liệu theo NĐ 356/2025

NĐ 356/2025 phân dữ liệu thành 2 loại với mức bảo vệ khác nhau. AI-CRDS xử lý **cả hai loại**.

#### Dữ liệu cá nhân cơ bản (Điều 3 NĐ 356)

| # | Data field | Mục đích trong AI-CRDS | Nguồn | Bắt buộc? |
|---|-----------|----------------------|-------|----------|
| 1 | Họ tên | Định danh applicant, match CIC | Application form | Có |
| 2 | Ngày sinh | Feature scoring (age-based risk) | Application form / eKYC | Có |
| 3 | Giới tính | ⚠️ Protected attribute — dùng cho bias monitoring, KHÔNG dùng làm scoring feature | Application form | Bias monitoring only |
| 4 | CCCD/CMND | Định danh, query CIC, eKYC verification | Application form / eKYC | Có |
| 5 | Địa chỉ | Feature scoring (geography-based risk) | Application form | Có |
| 6 | Số điện thoại | Verify chính chủ (TT 45/2025), liên hệ | Application form | Có |
| 7 | Email | Liên hệ, gửi adverse action notice | Application form | Không bắt buộc |
| 8 | Nghề nghiệp / employer | Feature scoring (employment stability) | Application form | Có |
| 9 | Thông tin vợ/chồng | ⚠️ NĐ 356 bổ sung vào danh mục cơ bản. Có thể dùng cho debt-to-income nếu joint application | Application form | Tùy product |

#### Dữ liệu cá nhân nhạy cảm (Điều 4 NĐ 356) — YÊU CẦU BẢO VỆ CAO NHẤT

| # | Data field | Mục đích trong AI-CRDS | Nguồn | Phân loại nhạy cảm |
|---|-----------|----------------------|-------|-------------------|
| 10 | Thu nhập / sao kê lương | Core scoring feature (repayment capacity) | Payslip / bank statement | Dữ liệu tài chính |
| 11 | Lịch sử tín dụng CIC | Core scoring feature (credit history) | CIC API | Dữ liệu tài chính — NĐ 356 quy định rõ lịch sử giao dịch tài khoản NH là nhạy cảm |
| 12 | CIC score | Scoring input | CIC API | Dữ liệu tài chính |
| 13 | Số dư nợ hiện tại | Debt-to-income calculation | CIC API / bank internal | Dữ liệu tài chính |
| 14 | Lịch sử giao dịch ngân hàng | Behavioral scoring, income verification | Bank internal (nếu existing customer) | NĐ 356 quy định rõ: lịch sử giao dịch tài khoản NH = nhạy cảm |
| 15 | Thông tin thẻ ngân hàng | Fraud detection (existing card check) | Bank internal | NĐ 356: thông tin thẻ NH = nhạy cảm |
| 16 | Dữ liệu sinh trắc học | eKYC verification (TT 45/2025 bắt buộc) | eKYC provider | Sinh trắc = nhạy cảm |
| 17 | Ảnh CCCD / khuôn mặt | eKYC matching | eKYC provider | Hình ảnh gắn liền cá nhân |
| 18 | Dữ liệu vi phạm pháp luật | Fraud blacklist check | CIC / internal blacklist | NĐ 356 mở rộng: MỌI vi phạm PL = nhạy cảm (trước đây chỉ hình sự) |

### 1.2 Data flow diagram (simplified)

```
Khách hàng nộp hồ sơ (online/app)
        │
        │  [DLCN cơ bản + nhạy cảm]
        ▼
┌───────────────────┐
│ Bank Application  │  ← Thu thập: họ tên, CCCD, thu nhập, employer
│ System            │     Consent lấy tại đây
└───────┬───────────┘
        │
        ├──────────────────┐──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  CIC API     │  │  eKYC        │  │  Bank        │
│  query       │  │  verification│  │  Internal DB │
│              │  │              │  │              │
│ Credit hist  │  │ Biometric    │  │ Transaction  │
│ CIC score    │  │ CCCD match   │  │ history      │
│ Existing debt│  │ Liveness     │  │ Existing     │
│              │  │              │  │ products     │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └────────┬────────┘────────┬────────┘
                ▼                 │
        ┌───────────────┐        │
        │  AI-CRDS      │◄───────┘
        │  Scoring +    │
        │  Fraud Engine │
        │               │
        │ Input: 15-25  │
        │ features      │
        │               │
        │ Output:       │
        │ - Risk score  │
        │ - Fraud flag  │
        │ - Confidence  │
        │ - Explanation │
        │ - Recommend   │
        └──────┬────────┘
               │
               ▼
        ┌───────────────┐
        │ Credit Officer │  ← Human decision
        │ Review UI     │     Override nếu cần
        └──────┬────────┘
               │
               ▼
        ┌───────────────┐
        │  Audit Log    │  ← Lưu trữ: input, output, decision,
        │  (immutable)  │     override reason, timestamp, model version
        └───────────────┘
```

### 1.3 Tổng hợp data inventory

| Loại | Số fields | Ví dụ | Yêu cầu bảo vệ |
|------|----------|-------|----------------|
| DLCN cơ bản | 9 | Họ tên, CCCD, địa chỉ, SĐT | Tiêu chuẩn |
| DLCN nhạy cảm | 9 | Thu nhập, CIC, sinh trắc, giao dịch NH | Cao nhất — cần DPO, thông báo chủ thể, biện pháp bảo mật tăng cường |
| **Tổng** | **18** | | |

---

## 2. Legal Basis cho xử lý dữ liệu

### 2.1 Các legal basis theo Luật BVDLCN 2025

Luật 91/2025 quy định xử lý DLCN phải có legal basis. Các basis chính applicable cho AI-CRDS:

| Legal basis | Mô tả | Applicable cho AI-CRDS? |
|------------|-------|------------------------|
| **Đồng ý (Consent)** | Chủ thể dữ liệu đồng ý rõ ràng, tự nguyện | ✅ Primary basis |
| **Thực hiện hợp đồng** | Cần xử lý để thực hiện hợp đồng với chủ thể | ✅ Khi khách đã ký hợp đồng vay/mở thẻ |
| **Nghĩa vụ pháp luật** | Xử lý theo yêu cầu pháp luật | ✅ CIC query theo quy định SBV |
| **Lợi ích công cộng** | Xử lý vì lợi ích công cộng quan trọng | ❌ Không applicable |
| **Lợi ích hợp pháp** | Bên kiểm soát có lợi ích hợp pháp | ⚠️ Luật VN chưa quy định rõ "legitimate interest" như GDPR — không nên dựa vào basis này |

### 2.2 Legal basis per data type — AI-CRDS

| # | Data | Legal basis | Lý do | Consent cần nêu rõ |
|---|------|-----------|-------|-------------------|
| 1 | Thông tin cá nhân cơ bản (tên, CCCD, SĐT) | Consent + Hợp đồng | Cần để mở thẻ tín dụng | Mục đích: xét duyệt thẻ tín dụng |
| 2 | Thu nhập / employer | Consent | Không bắt buộc theo luật, nhưng cần cho scoring | Mục đích: đánh giá khả năng trả nợ |
| 3 | CIC credit history | Consent + Nghĩa vụ PL | SBV yêu cầu TCTD thẩm định → CIC query hợp pháp. Nhưng NĐ 356 yêu cầu consent rõ ràng cho chấm điểm tín dụng | Mục đích: tra cứu lịch sử tín dụng tại CIC để chấm điểm |
| 4 | Giao dịch ngân hàng | Consent | Dữ liệu nhạy cảm — cần consent riêng | Mục đích: phân tích hành vi giao dịch để đánh giá rủi ro |
| 5 | Sinh trắc học | Consent + Nghĩa vụ PL | TT 45/2025 bắt buộc đối chiếu sinh trắc. Nhưng consent vẫn cần | Mục đích: xác minh danh tính theo quy định phát hành thẻ |
| 6 | **AI scoring output** | ⚠️ Đây là dữ liệu phái sinh | AI score, risk category, fraud flag — dù không phải PII gốc, nhưng gắn liền với cá nhân cụ thể → vẫn là DLCN | Phải nêu trong consent: dữ liệu sẽ được xử lý tự động (AI scoring) |

### 2.3 Consent requirements đặc biệt cho lĩnh vực ngân hàng (NĐ 356)

NĐ 356 quy định khi xử lý DLCN trong lĩnh vực tài chính, ngân hàng, consent phải nêu rõ:

1. **Các mục đích xử lý**, bao gồm hoạt động chấm điểm, xếp hạng tín dụng, đánh giá thông tin tín dụng
2. **Thời gian lưu trữ** dữ liệu cá nhân
3. **Nguồn thu thập** dữ liệu cá nhân (CIC, eKYC provider, bank internal)
4. **Các bên thu thập, chia sẻ** dữ liệu cá nhân liên quan (AI-CRDS vendor, CIC, eKYC provider)

**→ Consent form cho AI-CRDS phải bao gồm tất cả 4 nội dung trên. Generic consent "đồng ý xử lý dữ liệu" là KHÔNG ĐỦ.**

### 2.4 Action items — Legal basis

- [ ] **Thiết kế consent form** nêu rõ 4 nội dung NĐ 356 yêu cầu cho lĩnh vực ngân hàng
- [ ] **Tách consent** cho: (a) thẩm định tín dụng, (b) AI scoring tự động, (c) chia sẻ với bên thứ ba (CIC, eKYC)
- [ ] **Xác định legal basis per data type** — bảng 2.2 cần được confirm với legal counsel
- [ ] **Xác nhận:** AI scoring output (risk score, fraud flag) có phải DLCN không? → Cần legal opinion. Nếu có → phải include trong DPIA.

---

## 3. Data Minimization — Chỉ collect cái cần

### 3.1 Nguyên tắc

Luật 91/2025 Điều 3: "Dữ liệu cá nhân thu thập phải phù hợp và giới hạn trong phạm vi, mục đích cần xử lý."

AI-CRDS phải tuân thủ: chỉ thu thập và xử lý data fields thực sự cần cho scoring + fraud detection. Không thu thập "phòng xa."

### 3.2 Data minimization matrix

| # | Data field | Cần cho Scoring? | Cần cho Fraud? | Cần cho Compliance? | Kết luận |
|---|-----------|-----------------|---------------|-------------------|---------|
| 1 | Họ tên | Không (match CIC) | Có (identity check) | Có (audit trail) | ✅ Thu thập |
| 2 | CCCD | Không trực tiếp | Có (identity fraud) | Có (định danh) | ✅ Thu thập |
| 3 | Ngày sinh / tuổi | Có (age-risk) | Có (age fraud pattern) | Không | ✅ Thu thập — nhưng xem xét dùng age range thay vì DOB chính xác cho model |
| 4 | Giới tính | ❌ KHÔNG dùng cho scoring | Không | Có (bias monitoring) | ⚠️ Thu thập cho bias monitoring ONLY — không đưa vào model features |
| 5 | Địa chỉ | Có (geography risk) | Có (address fraud) | Có (adverse action) | ✅ Thu thập — xem xét dùng district/city level thay vì full address cho model |
| 6 | SĐT | Không | Có (SIM fraud) | Có (verify TT45) | ✅ Thu thập |
| 7 | Thu nhập | Có (core feature) | Có (income fraud) | Không | ✅ Thu thập |
| 8 | Employer / nghề nghiệp | Có (stability) | Có (fake employer) | Không | ✅ Thu thập |
| 9 | CIC score + history | Có (core feature) | Có (identity fraud) | Có (SBV thẩm định) | ✅ Thu thập |
| 10 | Giao dịch NH | Có (behavioral) | Có (transaction fraud) | Không | ⚠️ Chỉ thu thập nếu existing customer + consent riêng. Không bắt buộc cho new-to-bank |
| 11 | Sinh trắc | Không | Có (liveness check) | Có (TT 45) | ✅ Thu thập — nhưng AI-CRDS chỉ nhận kết quả pass/fail + confidence, KHÔNG lưu raw biometric |
| 12 | Ảnh CCCD | Không | Có (document fraud) | Có (eKYC) | ⚠️ AI-CRDS không cần lưu ảnh — chỉ nhận kết quả eKYC verification |
| 13 | Tôn giáo / dân tộc | ❌ KHÔNG | ❌ KHÔNG | ❌ KHÔNG | ❌ KHÔNG thu thập — không relevant, tăng bias risk |
| 14 | Tình trạng hôn nhân | Có thể (DTI) | Không | Không | ⚠️ Chỉ thu thập nếu joint income/liability calculation cần. Không mặc định |
| 15 | Mạng xã hội / online behavior | ❌ | ❌ | ❌ | ❌ KHÔNG thu thập — NĐ 356 coi dữ liệu hành vi online là nhạy cảm, risk cao, value thấp cho VN credit scoring |

### 3.3 Nguyên tắc thiết kế

1. **AI-CRDS KHÔNG lưu raw biometric** — chỉ nhận kết quả eKYC (pass/fail/confidence)
2. **AI-CRDS KHÔNG lưu ảnh CCCD** — chỉ nhận extracted fields từ eKYC
3. **Giới tính KHÔNG là scoring feature** — chỉ dùng cho bias monitoring
4. **Tôn giáo / dân tộc KHÔNG thu thập** — zero relevance, high bias risk
5. **Giao dịch NH chỉ khi existing customer** + consent riêng
6. **Data retention có thời hạn** — không giữ vô thời hạn (xem Section 6)

---

## 4. Quyền của Chủ Thể Dữ Liệu

### 4.1 Các quyền theo Luật 91/2025 và ảnh hưởng đến AI-CRDS

| # | Quyền | Mô tả | Ảnh hưởng đến AI-CRDS | Implementation |
|---|-------|-------|----------------------|---------------|
| 1 | **Quyền được biết** | Chủ thể được biết dữ liệu đang được xử lý thế nào | AI-CRDS phải có transparency page/notice: data nào được thu thập, AI xử lý thế nào, ai truy cập | Consent form + Privacy notice |
| 2 | **Quyền đồng ý** | Xử lý phải có đồng ý rõ ràng, tự nguyện. Cấm "mặc định đồng ý" | Consent form phải opt-in (không pre-checked). Sự im lặng ≠ đồng ý | Consent UI: checkbox không pre-checked |
| 3 | **Quyền truy cập** | Chủ thể có quyền xem dữ liệu của mình | Khách hàng có thể yêu cầu xem: data AI-CRDS đang giữ về họ, AI score, lý do quyết định | Data access request workflow |
| 4 | **Quyền rút lại đồng ý** | Chủ thể rút consent bất cứ lúc nào. NĐ 356: bên kiểm soát phải ngừng xử lý theo thời hạn quy định | Nếu khách rút consent giữa chừng scoring → phải dừng xử lý. Application = reject (do thiếu data). Phải có quy trình rõ ràng | Consent withdrawal flow + impact notification |
| 5 | **Quyền xóa dữ liệu** | Chủ thể yêu cầu xóa DLCN | ⚠️ **Xung đột:** SBV yêu cầu giữ audit trail cho credit decision. Luật BVDLCN cho phép giữ dữ liệu nếu có nghĩa vụ pháp luật → giữ audit trail nhưng xóa/ẩn danh data không cần thiết | Xóa raw data, giữ anonymized audit trail. Cần legal opinion cho retention period |
| 6 | **Quyền hạn chế xử lý** | Yêu cầu hạn chế mục đích xử lý | Khách đồng ý scoring nhưng không đồng ý marketing → phải tách được | Granular consent + purpose limitation |
| 7 | **Quyền phản đối xử lý tự động** (NĐ 356 Điều 9) | Chủ thể chọn không tham gia xử lý tự động | **Quan trọng:** Khách có quyền opt-out khỏi AI scoring → application phải được xử lý manual 100%. AI-CRDS cần workflow cho opt-out case | Opt-out flag → route to manual review |
| 8 | **Quyền yêu cầu human review** | Quyết định dựa hoàn toàn trên xử lý tự động → chủ thể có quyền yêu cầu human review | AI-CRDS design đã có human-in-the-loop → comply by default. Nhưng cần communicate rõ cho khách | Adverse action notice ghi: "Quý khách có quyền yêu cầu xem xét lại bởi nhân viên" |
| 9 | **Quyền khiếu nại** | Chủ thể có quyền khiếu nại lên cơ quan chuyên trách (A05) | AI-CRDS cần complaint handling workflow. Bank partner cần internal complaint resolution trước khi lên A05 | Complaint workflow + escalation |
| 10 | **Quyền yêu cầu bồi thường** | Chủ thể có quyền yêu cầu bồi thường thiệt hại | AI reject nhầm → khách mất cơ hội tín dụng → có thể yêu cầu bồi thường. AI-CRDS cần: audit trail đầy đủ để chứng minh quyết định hợp lý | Audit trail + explainability |

### 4.2 Adverse Action Notice — Template fields

Khi AI-CRDS recommend reject và Credit Officer đồng ý:

```
THÔNG BÁO TỪ CHỐI CẤP TÍN DỤNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kính gửi: [Họ tên khách hàng]
Ngày: [DD/MM/YYYY]
Mã hồ sơ: [Application ID]

Ngân hàng [Tên bank] thông báo hồ sơ đề nghị mở thẻ tín dụng
của Quý khách không được chấp thuận.

LÝ DO CHÍNH:
1. [Top reason — ví dụ: Tỷ lệ nợ trên thu nhập vượt ngưỡng cho phép]
2. [Second reason — ví dụ: Thời gian công tác tại đơn vị hiện tại chưa đủ]
3. [Third reason — ví dụ: Lịch sử thanh toán tại CIC có ghi nhận chậm trả]

QUYỀN CỦA QUÝ KHÁCH:
• Yêu cầu xem xét lại bởi nhân viên ngân hàng
• Yêu cầu xem thông tin tín dụng đã được sử dụng
• Yêu cầu giải thích chi tiết quy trình đánh giá
• Khiếu nại theo quy trình nội bộ của ngân hàng

LIÊN HỆ: [Hotline] | [Email]

Lưu ý: Quyết định này không ảnh hưởng đến điểm tín dụng CIC
của Quý khách và không ngăn cản Quý khách nộp hồ sơ trong
tương lai khi điều kiện thay đổi.
```

### 4.3 Action items — Quyền chủ thể

- [ ] Thiết kế **opt-out workflow**: khách chọn không dùng AI → route 100% manual
- [ ] Thiết kế **data access request flow**: khách yêu cầu xem data AI giữ về họ
- [ ] Thiết kế **consent withdrawal flow**: khách rút consent giữa chừng → impact gì
- [ ] Xác định **data deletion policy**: xóa gì, giữ gì (audit trail), bao lâu → cần legal opinion về xung đột SBV retention vs BVDLCN deletion
- [ ] Thiết kế **adverse action notice template** → validate với Compliance
- [ ] Thiết kế **complaint handling workflow**: internal resolution → A05 escalation

---

## 5. Data Residency — Dữ liệu phải ở đâu?

### 5.1 Yêu cầu pháp lý

| Yêu cầu | Nguồn | Chi tiết |
|---------|-------|---------|
| Chuyển DLCN xuyên biên giới | Luật 91/2025 Điều 27; NĐ 356 Điều 20-21 | Phải có: (1) Hồ sơ đánh giá tác động (Mẫu 09). (2) Thông báo Bộ Công an/A05 (Mẫu 01a). (3) Văn bản thỏa thuận ràng buộc pháp lý với bên nhận. (4) Bên nhận phải bảo vệ tương đương VN. |
| IT hệ thống sandbox đặt tại VN | NĐ 94/2025 | Nếu bank partner tham gia sandbox credit scoring → IT phải đặt tại VN |
| SBV data sovereignty | Thực tiễn SBV | SBV truyền thống yêu cầu data ngân hàng lưu tại VN. Chưa có quy định cấm cloud nước ngoài cho AI processing, nhưng expectation rõ ràng. |

### 5.2 Phương án architecture

| Phương án | Mô tả | Ưu điểm | Nhược điểm | Compliance level |
|----------|-------|---------|-----------|-----------------|
| **A. VN Cloud Only** | Toàn bộ AI-CRDS deploy trên Viettel Cloud / FPT Cloud / CMC Cloud | Không cần hồ sơ XLBG. SBV comfortable. Sandbox-ready | Service limitations (GPU, ML tools). Ít kinh nghiệm ML workload. Giá có thể cao hơn | ✅ Cao nhất |
| **B. Foreign Cloud + Hồ sơ XLBG** | Deploy trên AWS/GCP/Azure Singapore + hồ sơ đầy đủ | ML tooling tốt nhất. Scaling dễ. Ecosystem mature | Compliance cost cao (DPIA + hồ sơ XLBG). Thời gian approve lâu. SBV có thể push back | ⚠️ Phụ thuộc approve |
| **C. Hybrid** | PII processing tại VN (scoring, storage). Non-PII analytics tại foreign cloud (model training trên anonymized data) | Balance giữa compliance và capability | Architecture phức tạp hơn. Phải đảm bảo PII thực sự không rời VN | ✅ Tốt nếu implement đúng |

### 5.3 Đề xuất — cần validate

**Phương án C (Hybrid) là practical nhất cho AI-CRDS SaaS:**

```
VN Cloud (Viettel/FPT/CMC):
├── Scoring engine (real-time inference)
├── PII storage (encrypted at rest)
├── Audit trail (immutable)
├── Consent management
└── API gateway

Foreign Cloud (nếu cần):
├── Model training (trên anonymized/synthetic data ONLY)
├── Monitoring dashboard (aggregated metrics, no PII)
└── Development/staging environment (synthetic data)
```

**Điều kiện:** PII KHÔNG BAO GIỜ rời VN. Model training chỉ trên data đã anonymize hoặc synthetic. Nếu không cần foreign cloud cho training → Phương án A đơn giản nhất.

### 5.4 Cloud providers VN — preliminary assessment

| Provider | ML Workload | GPU | Compliance | Lưu ý |
|---------|------------|-----|-----------|-------|
| Viettel Cloud | Cơ bản | Có (limited) | ✅ SOC compliant | Lớn nhất VN, partnership với VMware |
| FPT Cloud | Cơ bản | Có (limited) | ✅ | FPT có AI division riêng |
| CMC Cloud | Cơ bản | ❓ Chưa verify | ⚠️ Chưa verify | Nhỏ hơn |
| VNG Cloud | Mới | ❓ | ⚠️ | Mới launch, chưa proven cho banking |

**⚠️ Chưa verify chi tiết** — cần evaluate cụ thể GPU availability, ML framework support, SLA, pricing khi đến Week 10 (Tech Stack).

### 5.5 Action items — Data residency

- [ ] **Quyết định architecture** (A/B/C) — target Week 10
- [ ] Nếu chọn B hoặc C: **chuẩn bị hồ sơ XLBG** (Mẫu 09 NĐ 356)
- [ ] **Evaluate VN cloud providers** chi tiết (GPU, ML framework, SLA, pricing)
- [ ] **Confirm với bank partner** data residency expectation của họ

---

## 6. DPIA — Data Protection Impact Assessment

### 6.1 Tại sao DPIA bắt buộc cho AI-CRDS?

NĐ 356 Điều 19: Bên kiểm soát/xử lý DLCN phải lập và lưu giữ hồ sơ DPIA từ thời điểm bắt đầu xử lý.

AI-CRDS trigger DPIA vì:

| Trigger | Giải thích |
|---------|-----------|
| **Xử lý DLCN nhạy cảm** | Thu nhập, CIC, giao dịch NH, sinh trắc — tất cả nhạy cảm theo NĐ 356 |
| **Xử lý tự động / AI** | NĐ 356 Điều 9: xử lý dữ liệu lớn, phân tích hành vi, dự đoán xu hướng, phân loại người dùng |
| **Quyết định ảnh hưởng đáng kể** | AI scoring ảnh hưởng trực tiếp đến khả năng tiếp cận tín dụng của cá nhân |
| **Xử lý quy mô lớn** | Target: hàng nghìn applications/ngày |

**→ DPIA là bắt buộc, không phải tùy chọn.**

### 6.2 DPIA phải nộp cho ai, khi nào?

| Mục | Yêu cầu |
|-----|---------|
| **Ai lập?** | Bên kiểm soát DLCN (= bank partner). AI-CRDS vendor hỗ trợ cung cấp thông tin cho DPIA. |
| **Mẫu** | Mẫu số 10 ban hành kèm NĐ 356/2025 |
| **Nộp cho** | Cục An ninh mạng và phòng chống tội phạm sử dụng công nghệ cao (A05), Bộ Công an |
| **Thời hạn** | 60 ngày kể từ ngày bắt đầu xử lý DLCN |
| **Cập nhật** | Khi có thay đổi nội dung xử lý (thêm data type, thay model, thêm third party) |

### 6.3 DPIA Content Outline cho AI-CRDS

Theo Mẫu 10 NĐ 356, DPIA cần bao gồm (adapted cho AI-CRDS):

**Phần 1 — Thông tin chung**
- Tên tổ chức (bank partner)
- Tên hệ thống/hoạt động xử lý (AI-CRDS — Origination Scoring + Fraud Detection)
- DPO contact
- Mục đích xử lý: hỗ trợ quyết định cấp thẻ tín dụng

**Phần 2 — Mô tả hoạt động xử lý**
- Loại DLCN được xử lý (bảng Section 1 của tài liệu này)
- Nguồn thu thập (application form, CIC, eKYC, bank internal)
- Phương thức xử lý (automated scoring + human review)
- Bên thứ ba tham gia (AI-CRDS vendor, CIC, eKYC provider)
- Thời gian lưu trữ
- Phạm vi chuyển DLCN (trong nước / xuyên biên giới)

**Phần 3 — Đánh giá rủi ro**
- Rủi ro cho chủ thể: reject nhầm (mất cơ hội tín dụng), data breach, bias/phân biệt đối xử, thiếu transparency
- Xác suất và mức độ nghiêm trọng per rủi ro
- Biện pháp giảm thiểu per rủi ro

**Phần 4 — Biện pháp bảo vệ**
- Biện pháp kỹ thuật: encryption at rest + in transit, access control, audit logging, data minimization, anonymization
- Biện pháp tổ chức: DPO, training, incident response, consent management
- Biện pháp đặc biệt cho xử lý tự động: human-in-the-loop, explainability, opt-out, override governance

**Phần 5 — Kết luận**
- Rủi ro còn lại sau biện pháp giảm thiểu
- Kế hoạch review và cập nhật DPIA

### 6.4 Risk assessment matrix cho DPIA

| # | Rủi ro | Xác suất | Nghiêm trọng | Mức rủi ro | Biện pháp giảm thiểu |
|---|--------|---------|-------------|-----------|---------------------|
| 1 | AI reject nhầm → khách mất cơ hội tín dụng | Trung bình | Cao | 🔴 Cao | Human-in-the-loop, adverse action notice, quyền khiếu nại, threshold tuning |
| 2 | AI approve nhầm → NPL + loss | Trung bình | Cao | 🔴 Cao | Threshold governance, model monitoring, drift detection, override option |
| 3 | Data breach → lộ DLCN nhạy cảm | Thấp | Rất cao | 🔴 Cao | Encryption, access control, breach notification 72h, incident response plan |
| 4 | Bias/phân biệt (gender, geography) | Trung bình | Cao | 🔴 Cao | Bias monitoring, protected attributes không là features, fairness metrics, regular audit |
| 5 | Model opacity → khách không hiểu lý do reject | Cao | Trung bình | 🟡 Trung bình | Explainability module, adverse action notice top 3 reasons, counterfactual |
| 6 | Consent không đầy đủ → vi phạm NĐ 356 | Trung bình | Cao | 🔴 Cao | Granular consent form, consent storage, withdrawal flow |
| 7 | Data retention quá lâu → vi phạm minimization | Trung bình | Trung bình | 🟡 Trung bình | Retention policy, automated deletion, anonymization sau retention period |
| 8 | Third-party breach (CIC/eKYC) → lộ DLCN | Thấp | Cao | 🟡 Trung bình | Vendor assessment, DPA với third parties, monitoring |
| 9 | Model drift → quyết định sai hệ thống | Trung bình | Cao | 🔴 Cao | Drift monitoring, champion-challenger, automatic alerts, rollback plan |

### 6.5 Action items — DPIA

- [ ] **Lập DPIA template** adapted cho AI-CRDS theo Mẫu 10 NĐ 356 — target Week 10
- [ ] **Risk assessment chi tiết** per rủi ro (bảng 6.4 là starting point, cần refine)
- [ ] **Xác định retention period** cho từng loại data — cần legal opinion (SBV retention vs BVDLCN minimization)
- [ ] **Chuẩn bị DPA (Data Processing Agreement)** template cho bank partner ↔ AI-CRDS vendor
- [ ] **Chuẩn bị DPA cho third parties** (CIC, eKYC provider)

---

## 7. Tổng Hợp — Impact on Architecture

PDPD requirements ảnh hưởng trực tiếp đến AI-CRDS architecture:

| Architecture Decision | Driver | Deadline |
|----------------------|--------|---------|
| Consent management module | NĐ 356 — granular consent cho banking | Trước pilot |
| Explainability module | NĐ 356 Điều 9 — giải thích thuật toán | Trước pilot |
| Opt-out workflow | NĐ 356 Điều 9 — quyền không tham gia xử lý tự động | Trước pilot |
| Data access / portability API | Luật 91/2025 — quyền truy cập | Trước pilot |
| Consent withdrawal flow | NĐ 356 — quyền rút consent | Trước pilot |
| Audit trail (immutable, ≥20 fields) | TT 13/2018 + Luật BVDLCN | Trước pilot |
| Data residency (VN cloud hoặc hybrid) | NĐ 356 Điều 20-21 + SBV expectation | Week 10 |
| Encryption at rest + in transit | NĐ 356 biện pháp bảo mật | From day 1 |
| Anonymization pipeline | Data minimization + model training | Nếu training trên real data |
| Breach notification workflow | NĐ 356 Điều 28 — 72h notification | Trước pilot |
| Adverse action notice generator | Luật TCTD + NĐ 356 right to explanation | Week 9 |
| Bias monitoring dashboard | Proactive — chưa bắt buộc nhưng best practice | Week 23 |

---

## 8. Tracking — Tự hỏi cuối tuần

- [ ] Data inventory đã đầy đủ chưa? Có data field nào AI-CRDS xử lý mà chưa list?
- [ ] Legal basis per data type đã được confirm với legal counsel chưa?
- [ ] Consent form draft đã bao gồm 4 nội dung NĐ 356 yêu cầu cho banking chưa?
- [ ] Data residency architecture đã quyết chưa? (A/B/C)
- [ ] DPIA template đã bắt đầu soạn chưa?
- [ ] Xung đột SBV retention vs BVDLCN deletion đã có legal opinion chưa?
- [ ] Opt-out workflow cho AI automated decision đã thiết kế chưa?

---

## 9. Ghi Chú & Limitations

1. **Không phải tư vấn pháp lý.** Cần legal review cho: legal basis per data type, retention period, deletion vs retention xung đột, DPIA nộp A05.
2. **NĐ 356/2025 rất mới** (hiệu lực 01/01/2026) — practice chưa settle. Có thể có hướng dẫn bổ sung từ A05.
3. **Chế tài xử phạt** — Luật 91/2025 có khung phạt nhưng NĐ xử phạt chi tiết chưa rõ. Follow sát.
4. **"Legitimate interest"** — Luật VN không quy định rõ ràng như GDPR Điều 6(1)(f). Không nên dựa vào basis này.
5. **VN cloud provider evaluation** ở Section 5.4 là preliminary — cần evaluate chi tiết tại Week 10.
6. **Cross-reference:** regulatory-mapping.md và compliance-gap-analysis.md cho context đầy đủ.