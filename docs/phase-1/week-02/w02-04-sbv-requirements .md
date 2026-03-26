# SBV Requirements — AI-CRDS
> **Tags:** `[Compliance]` `[Governance]` `[Risk]`
> **Dự án:** AI-CRDS
> **Use case:** Origination Scoring + Fraud Detection Layer — Retail CC Salaried
> **Tuần:** Week 2
> **Version:** v1.0
> **Ngày:** 25/03/2026

---

## Mục đích

Document 4 yêu cầu core từ SBV ảnh hưởng đến thiết kế AI-CRDS. Đây là các yêu cầu **không thể thỏa hiệp** — không comply = không deploy.

**⚠️ Lưu ý:** VN chưa có 1 văn bản riêng biệt "SBV quy định về AI trong tài chính." Các yêu cầu dưới đây được tổng hợp từ nhiều văn bản (Luật TCTD 2024, TT 13/2018, NĐ 94/2025, Luật BVDLCN 2025 + NĐ 356/2025). Xem `regulatory-mapping.md` cho chi tiết từng văn bản.

---

## 1. Human-in-the-Loop — AI KHÔNG được là Final Decision Maker

### 1.1 Cơ sở pháp lý

| Văn bản | Yêu cầu liên quan |
|---------|-------------------|
| Luật TCTD 32/2024/QH15 | Điều 102-103: TCTD phải có quy trình thẩm định, đánh giá rủi ro trước khi cấp tín dụng. Quyết định cấp tín dụng là của TCTD (con người đại diện tổ chức), không phải hệ thống tự động. |
| TT 13/2018/TT-NHNN | Mô hình 3 tuyến phòng thủ: tuyến 1 vận hành (bao gồm quyết định tín dụng bởi Credit Officer), tuyến 2 giám sát, tuyến 3 kiểm toán. AI system nằm ở tuyến 1 nhưng không thay thế con người. |
| NĐ 356/2025 Điều 9 | Chủ thể dữ liệu có quyền phản đối xử lý tự động + yêu cầu human review cho quyết định ảnh hưởng đáng kể. Credit decision = ảnh hưởng đáng kể. |
| Thực tiễn SBV | SBV chưa ban hành văn bản cho phép AI thay thế con người trong quyết định tín dụng. Cho đến khi có quy định rõ ràng, human-in-the-loop là default requirement. |

### 1.2 Nguyên tắc thiết kế AI-CRDS

**Nguyên tắc bất biến — ghi vào mọi document:**

> AI-CRDS là **decision support system**. AI đưa ra recommendation (approve / reject / escalate) kèm explanation. Credit Officer là người ký quyết định cuối cùng. AI KHÔNG BAO GIỜ tự approve hoặc tự reject mà không có human oversight.

### 1.3 Decision flow — Human-in-the-Loop

```
Hồ sơ vào
    │
    ▼
AI-CRDS scoring + fraud detection
    │
    ├─── High confidence APPROVE (score > threshold_high)
    │    │
    │    ▼
    │    Auto-route to Credit Officer queue
    │    với tag "AI recommends: APPROVE"
    │    │
    │    ▼
    │    Credit Officer review (có thể batch review)
    │    ├── Đồng ý → Approve (CO ký) → Audit log
    │    └── Không đồng ý → Override → Log lý do → Escalate nếu cần
    │
    ├─── Medium confidence (threshold_low < score < threshold_high)
    │    │
    │    ▼
    │    Route to Credit Officer queue
    │    với tag "AI recommends: REVIEW NEEDED"
    │    + Top 3 risk factors
    │    + Similar cases reference
    │    │
    │    ▼
    │    Credit Officer full review
    │    ├── Approve (CO ký) → Audit log
    │    ├── Reject (CO ký) → Adverse action notice → Audit log
    │    └── Escalate to Senior/Committee
    │
    ├─── High confidence REJECT (score < threshold_low)
    │    │
    │    ▼
    │    Auto-route to Credit Officer queue
    │    với tag "AI recommends: REJECT"
    │    + Top 3 rejection reasons
    │    │
    │    ▼
    │    Credit Officer review
    │    ├── Đồng ý reject → Adverse action notice → Audit log
    │    └── Override → Approve (CO ký) → Log lý do → Supervisor review
    │
    └─── Low confidence / Anomaly / Need-more-info
         │
         ▼
         Route to Senior Credit Officer
         với tag "AI: CANNOT DETERMINE"
         + Explanation tại sao uncertain
         │
         ▼
         Senior review / Committee / Request thêm documents
```

### 1.4 Governance rules

| Rule | Mô tả | Owner |
|------|-------|-------|
| **R1** | Mọi credit decision phải có chữ ký (digital) của Credit Officer hoặc cấp trên. AI recommendation ≠ decision. | Risk Manager |
| **R2** | "Auto-approve" thực chất là "AI recommends approve + CO batch-confirms." CO vẫn ký, chỉ là quy trình nhanh hơn. Batch review tối đa X hồ sơ/lần — Risk Committee quyết định X. | Risk Committee |
| **R3** | Override AI phải log lý do. Override approve khi AI reject → cần Supervisor confirmation. | Credit Officer + Supervisor |
| **R4** | AI confidence < threshold_low HOẶC data thiếu → AI KHÔNG ĐƯA RA recommendation. Route thẳng đến human. AI không ép quyết định khi không đủ data. | Product (design) |
| **R5** | Khách hàng có quyền opt-out khỏi AI scoring → hồ sơ xử lý 100% manual. Quyền này theo NĐ 356 Điều 9. | Compliance |
| **R6** | Threshold (auto-approve / review / auto-reject) do Risk Committee approve. PM không tự quyết. Review ít nhất mỗi quý hoặc khi model thay đổi. | Risk Committee |

### 1.5 Điều CẤM

| # | Cấm | Lý do |
|---|-----|-------|
| 1 | AI tự approve mà không có CO ký | Vi phạm Luật TCTD — quyết định tín dụng phải của TCTD (con người) |
| 2 | AI tự reject mà không có CO review | Vi phạm NĐ 356 — chủ thể có quyền human review |
| 3 | AI tự thay đổi threshold mà không có Risk Committee approve | Vi phạm TT 13 — quản lý rủi ro phải có giám sát cấp cao |
| 4 | Ép AI quyết định khi data thiếu (no "need-more-info" state) | Thiết kế sai — AI phải có abstain option |
| 5 | Gỡ bỏ override option cho CO | Vi phạm human-in-the-loop principle |

### 1.6 Status tại Bank X

❓ **Chưa validate** — Pending meeting với Compliance Officer.

Cần confirm:
- [ ] Bank X hiện tại có AI/ML nào trong quy trình tín dụng chưa?
- [ ] Nếu có, human-in-the-loop được implement thế nào?
- [ ] Risk Committee có quy trình approve threshold/policy cho automated system chưa?
- [ ] Override governance có documented chưa?

---

## 2. Model Validation — Independent Review Trước Khi Deploy

### 2.1 Cơ sở pháp lý

| Văn bản | Yêu cầu liên quan |
|---------|-------------------|
| TT 13/2018 | Mô hình 3 tuyến: tuyến 2 (Risk/Model Validation) phải giám sát và validate mô hình trước khi đưa vào sử dụng. Dự thảo TT thay thế có thể thêm yêu cầu "quản lý rủi ro mô hình" (Model Risk Management). |
| TT 41/2016 (Basel II) | Trụ cột II (ICAAP) yêu cầu đánh giá nội bộ mức đủ vốn — mô hình tín dụng phải được validate. |
| Thực tiễn SBV | SBV thanh tra/kiểm tra → có thể yêu cầu xem tài liệu model validation. Không có model documentation = SBV finding. |
| NĐ 94/2025 (Sandbox) | Hồ sơ tham gia sandbox yêu cầu "kế hoạch thử nghiệm, quản lý rủi ro" — bao gồm model validation plan. |

### 2.2 Model Validation Requirements

AI-CRDS phải cung cấp đủ tài liệu để bank partner's Risk/Model Validation team review **trước khi deploy production:**

#### A. Model Card — Tài liệu mô hình

| Section | Nội dung | Status AI-CRDS |
|---------|---------|---------------|
| **Purpose** | AI-CRDS hỗ trợ quyết định cấp thẻ tín dụng retail salaried. Scoring + fraud detection. | ❌ Chưa soạn |
| **Intended use** | Decision support only. Input: application data + CIC + eKYC. Output: risk score + fraud flag + explanation + recommendation. | ❌ Chưa soạn |
| **Training data** | Mô tả data dùng train model: nguồn, size, time range, segment coverage, known biases. Nếu synthetic → ghi rõ. | ❌ Chưa soạn |
| **Feature list** | Danh sách features + importance ranking. Ghi rõ features KHÔNG dùng (gender, ethnicity). | ❌ Chưa soạn |
| **Architecture** | Loại model (logistic regression? gradient boosting? ensemble?). Complexity level. | ❌ Chưa soạn |
| **Performance metrics** | AUC, Gini, KS, precision, recall — per segment. Trên test data + validation data. | ❌ Chưa soạn |
| **Calibration** | Score vs actual default rate. Calibration curve. | ❌ Chưa soạn |
| **Known limitations** | Segments có performance kém. Data gaps. Conditions model không handle tốt. | ❌ Chưa soạn |
| **Threshold settings** | Auto-approve / review / reject thresholds. Approval rate curve. NPL impact per threshold. | ❌ Chưa soạn |
| **Bias assessment** | Fairness metrics per protected attribute (gender, geography). Disparate impact analysis. | ❌ Chưa soạn |
| **Update history** | Version log, changes per version, validation results per version. | ❌ Chưa soạn |

**→ Target: Model Card v1 tại Week 23 (Governance Layer). Draft structure tại Week 12 (MVP Build).**

#### B. Validation Process

| Step | Ai thực hiện | Nội dung | Timeline |
|------|------------|---------|---------|
| 1. Model documentation | AI-CRDS vendor (Product + DS team) | Chuẩn bị Model Card + tất cả sections trên | Trước pilot |
| 2. Independent validation | Bank partner's Risk/Model Validation team | Review model card, test trên bank's data, challenge assumptions, check bias | Trước production deploy (Week 27 trong roadmap) |
| 3. Validation report | Bank partner's Risk/Model Validation team | Kết luận: Approve / Approve with conditions / Reject. Conditions phải address trước deploy. | Week 27 |
| 4. Risk Committee approval | Bank partner's Risk Committee | Final sign-off dựa trên validation report | Week 31 |
| 5. Ongoing monitoring | Joint (vendor + bank Risk) | Performance monitoring, drift detection, periodic re-validation (annual hoặc khi model update) | Post-deploy |

#### C. Documentation bank cần từ AI-CRDS vendor

| # | Tài liệu | Mục đích | Ai prepare |
|---|---------|---------|-----------|
| 1 | Model Card (full) | Validation review | AI-CRDS vendor |
| 2 | Feature dictionary | Hiểu mọi feature + source + logic | AI-CRDS vendor |
| 3 | Training data description | Assess data quality + representativeness | AI-CRDS vendor |
| 4 | Performance report (per segment) | Assess model accuracy | AI-CRDS vendor |
| 5 | Bias assessment report | Assess fairness | AI-CRDS vendor |
| 6 | Threshold sensitivity analysis | Assess impact of threshold changes | AI-CRDS vendor |
| 7 | Monitoring plan | Ongoing drift detection + alert thresholds | AI-CRDS vendor + bank Risk |
| 8 | Incident response plan | What happens when model fails | Joint |

### 2.3 Status tại Bank X

❓ **Chưa validate** — Pending meeting với Compliance Officer + Risk Manager.

Cần confirm:
- [ ] Bank X có Model Validation team riêng không? Hay nằm trong Risk department?
- [ ] Bank X có quy trình validate model hiện tại (scorecard) không? Format documentation nào?
- [ ] Bank X có MRM (Model Risk Management) framework chưa?
- [ ] Risk Committee meeting cadence? Bao lâu để get approval?

---

## 3. Audit & Reporting — Mọi Decision Phải Traceable

### 3.1 Cơ sở pháp lý

| Văn bản | Yêu cầu liên quan |
|---------|-------------------|
| TT 13/2018 Điều 5 | Hệ thống KSNB phải đảm bảo "thông tin tài chính và thông tin quản lý trung thực, hợp lý, đầy đủ và kịp thời." Mọi quyết định tín dụng phải traceable. |
| Luật TCTD 2024 | TCTD chịu thanh tra, giám sát của NHNN. Phải cung cấp hồ sơ, tài liệu khi SBV yêu cầu. |
| Luật BVDLCN 2025 + NĐ 356 | Audit trail cho xử lý DLCN. Replay capability cho quyết định tự động. |
| TT 45/2025 | Báo cáo gian lận qua hệ thống SIMO. |

### 3.2 Audit Trail Schema — Minimum 20 fields

Mọi credit decision qua AI-CRDS phải log đầy đủ các fields sau:

| # | Field | Mô tả | Ví dụ | Mục đích |
|---|-------|-------|-------|---------|
| 1 | `decision_id` | Unique ID cho mỗi quyết định | `DEC-2026-0001` | Truy xuất |
| 2 | `application_id` | ID hồ sơ | `APP-2026-0001` | Link to application |
| 3 | `applicant_id_hash` | Hash CCCD (không lưu plaintext) | `sha256:abc...` | Privacy + truy xuất |
| 4 | `timestamp` | Thời điểm AI scoring | `2026-03-25T10:30:00+07:00` | Timeline |
| 5 | `model_version` | Version model đang chạy | `v1.2.3` | Replay capability |
| 6 | `threshold_version` | Version threshold đang áp dụng | `TH-2026-Q1` | Replay capability |
| 7 | `input_features` | Snapshot tất cả features đưa vào model | `{age: 30, income: 25M, cic_score: 680, ...}` | Replay + explain |
| 8 | `cic_data_snapshot` | CIC data tại thời điểm query | `{cic_score: 680, existing_debt: 50M, ...}` | Replay |
| 9 | `ekyc_result` | Kết quả eKYC (pass/fail/confidence) | `{status: "pass", confidence: 0.98}` | Fraud audit |
| 10 | `ai_risk_score` | Risk score AI trả về | `0.72` | Audit |
| 11 | `ai_fraud_flag` | Fraud flag AI trả về | `{flag: false, fraud_score: 0.05}` | Audit |
| 12 | `ai_confidence` | Confidence level | `0.89` | Audit |
| 13 | `ai_recommendation` | AI recommend gì | `APPROVE` / `REJECT` / `REVIEW` / `ESCALATE` | Audit |
| 14 | `ai_explanation` | Top reasons for recommendation | `["CIC score > 650", "DTI < 40%", "Employment > 2y"]` | Explainability + adverse action |
| 15 | `human_decision` | Credit Officer quyết định gì | `APPROVE` / `REJECT` | Final decision |
| 16 | `human_user_id` | ID người quyết định | `CO-001` | Accountability |
| 17 | `override_flag` | CO có override AI không | `true` / `false` | Monitoring |
| 18 | `override_reason` | Lý do override (bắt buộc nếu override=true) | `"Khách VIP, relationship 5 năm"` | Audit |
| 19 | `decision_timestamp` | Thời điểm CO quyết định | `2026-03-25T11:15:00+07:00` | SLA tracking |
| 20 | `adverse_action_sent` | Đã gửi adverse action notice chưa (nếu reject) | `true` / `false` + `timestamp` | Compliance |
| 21 | `escalation_flag` | Có escalate không | `true` / `false` | Workflow |
| 22 | `escalation_to` | Escalate cho ai | `SENIOR-001` / `COMMITTEE` | Workflow |
| 23 | `tenant_id` | Bank partner ID (multi-tenant SaaS) | `BANK-TPB` | SaaS isolation |
| 24 | `data_consent_id` | ID consent record của khách | `CONSENT-2026-0001` | PDPD compliance |

### 3.3 Audit requirements

| Requirement | Mô tả | Implementation |
|------------|-------|---------------|
| **Immutability** | Audit log không được sửa/xóa sau khi ghi | Append-only storage. Hash chain hoặc write-once DB. |
| **Replay capability** | Given decision_id → có thể tái hiện chính xác quyết định: same input + same model version + same threshold → same output | Lưu input_features snapshot + model version + threshold version. Test replay monthly. |
| **SBV on-demand export** | SBV có thể yêu cầu xem bất kỳ quyết định nào, bất kỳ lúc nào | Export API: filter by date range, applicant, decision type. Format: CSV hoặc structured report. Target: <15 phút để xuất. |
| **Retention** | Bao lâu giữ audit log | ❓ Chưa có quy định rõ cho AI audit specifically. SBV thường yêu cầu giữ hồ sơ tín dụng 5-10 năm. Cần confirm với Compliance. |
| **Tamper detection** | Phát hiện nếu audit log bị sửa | Hash chain, checksums, hoặc blockchain-inspired integrity check. |
| **Access control** | Ai được xem audit log | Tiered: CO xem case mình xử lý, Risk xem all, Internal Audit xem all, SBV xem all khi yêu cầu. |

### 3.4 SBV Inspection Scenario — Chuẩn bị sẵn

Giả lập: SBV inspector đến bank, hỏi:

> "Cho tôi xem quyết định cấp thẻ tín dụng cho khách hàng CCCD xxx trong tháng 2/2026. Ai quyết định? Dựa trên data gì? AI recommend gì? Nếu AI recommend khác human decision — tại sao?"

**AI-CRDS phải trả lời được trong <15 phút:**

| Bước | Hành động | Thời gian |
|------|----------|----------|
| 1 | Tìm decision record by applicant hash + date range | <1 phút |
| 2 | Xuất full audit record (24 fields) | <1 phút |
| 3 | Show AI recommendation + explanation + human decision | Có sẵn trong record |
| 4 | Nếu override → show override reason | Có sẵn trong record |
| 5 | Replay: chạy lại model version đó + threshold version đó + input đó → confirm same output | <5 phút |
| 6 | Export report format cho SBV | <5 phút |

**→ Target: Audit trail design tại Week 35. Prototype tại Week 12 (MVP).**

### 3.5 Reporting obligations

| Report | Cho ai | Frequency | Nội dung | Trigger |
|--------|-------|-----------|---------|--------|
| Credit decision audit | SBV | On-demand | Full audit trail per decision | SBV request |
| Fraud report SIMO | SBV via SIMO | Định kỳ (TT 45/2025) | Fraud cases detected + actions taken | Per TT 45 schedule |
| Model performance report | Bank Risk Committee | Quarterly | AUC, approval rate, NPL by vintage, override rate, drift metrics | Scheduled |
| Incident report | SBV + Bank management | Within 24h of incident | Major model failure, data breach, systematic error | Incident trigger |
| DPIA update | A05 (Bộ Công an) | When processing changes | Updated DPIA per NĐ 356 | Processing change |

### 3.6 Status tại Bank X

❓ **Chưa validate** — Pending meeting với Compliance Officer + IT.

Cần confirm:
- [ ] Bank X hiện có audit trail format nào cho credit decisions?
- [ ] SBV gần nhất thanh tra Bank X khi nào? Findings liên quan đến audit/documentation?
- [ ] Bank X có hệ thống SIMO reporting chưa?
- [ ] Retention policy hiện tại cho hồ sơ tín dụng?
- [ ] Bank X dùng gì để lưu audit log (database? file? manual)?

---

## 4. Sandbox Compliance — NĐ 94/2025

### 4.1 Tổng quan NĐ 94/2025

| Mục | Nội dung |
|-----|---------|
| **Tên** | NĐ 94/2025/NĐ-CP — Cơ chế thử nghiệm có kiểm soát (Regulatory Sandbox) trong lĩnh vực ngân hàng |
| **Hiệu lực** | 01/07/2025 (đã có hiệu lực) |
| **3 lĩnh vực** | (1) Chấm điểm tín dụng (Credit Scoring) — **AI-CRDS core use case**, (2) Open API, (3) P2P Lending |
| **Thời gian thử nghiệm** | Tối đa 2 năm, có thể gia hạn |
| **Giám sát** | NHNN |
| **Sau sandbox** | Kết quả làm cơ sở hoàn thiện framework pháp lý. Thành công → fast-track licensing. |

### 4.2 Hai con đường compliance

AI-CRDS có 2 con đường tùy thuộc bank partner có tham gia sandbox hay không:

#### Con đường A: Bank tham gia Sandbox (NĐ 94)

```
Bank nộp hồ sơ sandbox cho NHNN
    │
    ├── Hồ sơ gồm: kế hoạch thử nghiệm, QLRR, nhân sự, pháp lý
    │   AI-CRDS vendor hỗ trợ chuẩn bị tài liệu kỹ thuật
    │
    ▼
NHNN review (có thể kiểm tra on-site)
    │
    ▼
Cấp Giấy chứng nhận tham gia
    │
    ▼
Bắt đầu thử nghiệm trong 90 ngày
    │
    ├── Scope giới hạn (1 product line, subset customers)
    ├── Báo cáo tiến độ cho NHNN
    ├── Phải tuân thủ operational boundaries
    │
    ▼
Kết thúc sandbox (max 2 năm)
    │
    ├── Thành công → Fast-track licensing / full deploy
    └── Không thành công → Dừng + lessons learned
```

**Ưu điểm sandbox:**
- Framework pháp lý rõ ràng — NHNN biết và giám sát
- Fast-track licensing sau sandbox
- Ít rủi ro pháp lý hơn con đường B
- PR value: "ngân hàng đầu tiên tham gia sandbox credit scoring"

**Nhược điểm sandbox:**
- Thời gian nộp hồ sơ + approve có thể 3-6 tháng
- Scope giới hạn trong sandbox
- Reporting obligations cho NHNN
- P2P Lending yêu cầu 100% vốn VN (nhưng credit scoring không có hạn chế này cho TCTD)

#### Con đường B: Standard Compliance (không sandbox)

```
Bank triển khai AI-CRDS như vendor solution
    │
    ├── Comply tất cả VB hiện hành:
    │   TT 13 (KSNB), Luật TCTD (thẩm định), Luật BVDLCN + NĐ 356 (DPIA),
    │   TT 41 (Basel II), TT 45 (thẻ)
    │
    ├── Model validation bởi bank Risk team
    ├── Risk Committee approval
    ├── DPIA nộp A05
    │
    ▼
Deploy production
    │
    ├── Ongoing compliance: audit, reporting, monitoring
    └── SBV thanh tra bình thường
```

**Ưu điểm standard:**
- Nhanh hơn (không chờ sandbox approval)
- Không bị giới hạn scope sandbox
- Quen thuộc với bank — quy trình vendor management thông thường

**Nhược điểm standard:**
- Không có "legal shield" của sandbox
- SBV có thể question: "tại sao không tham gia sandbox khi đã có?"
- Không có fast-track licensing benefit

### 4.3 Đề xuất

**Khuyến nghị: Tùy thuộc bank partner — hỏi trong discovery meeting.**

Nếu bank partner is **early adopter** (TPBank, VIB — Tier 1 targets) → sandbox có thể attract vì:
- Được SBV "bật đèn xanh" chính thức
- Differentiation vs competitors
- Regulatory relationship building

Nếu bank partner muốn **deploy nhanh** → standard compliance path, sandbox sau nếu muốn.

**AI-CRDS vendor cần chuẩn bị cho CẢ HAI con đường** — documentation package phải đủ cho sandbox application VÀ standard compliance.

### 4.4 Sandbox Requirements — Nếu bank chọn con đường A

Hồ sơ nộp NHNN phải bao gồm (Điều 8-10 NĐ 94):

| # | Tài liệu | Ai prepare | Status |
|---|---------|-----------|--------|
| 1 | Đơn đề nghị tham gia | Bank partner | ❌ |
| 2 | Mô tả giải pháp credit scoring (AI-CRDS) | AI-CRDS vendor + Bank | ❌ — cần soạn technical description |
| 3 | Kế hoạch thử nghiệm (scope, timeline, metrics, exit criteria) | Joint | ❌ |
| 4 | Kế hoạch quản lý rủi ro | Joint | ❌ — link to risk assessment |
| 5 | Nhân sự (trình độ, kinh nghiệm CEO/CTO, không tiền án) | Bank + AI-CRDS vendor | ❌ |
| 6 | Hệ thống CNTT (đặt tại VN, bảo mật, privacy, business continuity) | AI-CRDS vendor + Bank IT | ❌ — cần confirm IT đặt tại VN |
| 7 | Giấy tờ pháp lý thành lập | Bank + AI-CRDS vendor | Có sẵn |
| 8 | Quy trình bảo vệ khách hàng | Joint | ❌ |

**→ Target: Chuẩn bị sandbox documentation package tại Week 29 (Pilot Proposal). Nếu bank partner muốn sandbox → nộp sau Week 29.**

### 4.5 Status tại Bank X

❓ **Chưa validate** — Pending meeting.

Cần confirm:
- [ ] Bank X có biết về NĐ 94/2025 sandbox chưa?
- [ ] Bank X có kế hoạch đăng ký sandbox credit scoring không?
- [ ] Nếu có → timeline dự kiến? AI-CRDS có thể là giải pháp họ thử nghiệm?
- [ ] Nếu không → họ prefer standard compliance path? Lý do?
- [ ] Bank X đã có vendor nào khác đăng ký sandbox chưa?

---

## 5. Tổng Hợp — SBV Compliance Checklist

| # | Requirement | Văn bản gốc | Priority | Status AI-CRDS | Target Week |
|---|------------|------------|----------|---------------|------------|
| 1.1 | AI chỉ là decision support, CO ký quyết định | Luật TCTD 2024 | 🔴 NON-NEGOTIABLE | ✅ Designed in | From day 1 |
| 1.2 | Batch review governance (không phải auto-approve thật) | TT 13/2018 | 🔴 HIGH | ❌ Chưa design | Week 5 |
| 1.3 | Override logging bắt buộc | TT 13/2018 | 🔴 HIGH | ❌ Chưa design | Week 9 |
| 1.4 | Opt-out AI scoring → 100% manual | NĐ 356/2025 | 🔴 HIGH | ❌ Chưa design | Week 9 |
| 1.5 | Threshold do Risk Committee approve | TT 13/2018 | 🔴 HIGH | ❌ Chưa design | Week 6 |
| 2.1 | Model Card (full documentation) | TT 13/2018 + Basel II | 🟡 MEDIUM | ❌ Chưa soạn | Week 23 |
| 2.2 | Independent model validation (bank Risk team) | TT 13/2018 | 🔴 HIGH | ❌ Chưa có process | Week 27 |
| 2.3 | Risk Committee sign-off | TT 13/2018 | 🔴 HIGH | ❌ | Week 31 |
| 3.1 | Audit trail ≥20 fields, immutable | TT 13/2018 + Luật BVDLCN | 🔴 HIGH | ❌ Schema chưa finalize | Week 35 (design), Week 12 (prototype) |
| 3.2 | Replay capability | TT 13/2018 | 🔴 HIGH | ❌ Chưa design | Week 35 |
| 3.3 | SBV on-demand export (<15 phút) | Luật TCTD 2024 | 🟡 MEDIUM | ❌ Chưa design | Week 35 |
| 3.4 | SIMO fraud reporting compatibility | TT 45/2025 | 🟡 MEDIUM | ❌ Chưa design | Week 35 |
| 3.5 | Retention policy | TT 13/2018 + Luật BVDLCN | 🟡 MEDIUM | ❌ Chưa xác định | Week 23 |
| 4.1 | Sandbox documentation package | NĐ 94/2025 | 🟢 OPTIONAL | ❌ Chưa soạn | Week 29 |
| 4.2 | IT infrastructure đặt tại VN | NĐ 94/2025 | 🟡 CONDITIONAL | ❌ Chưa quyết | Week 10 |

---

## 6. ⚠️ ACTION BẮT BUỘC TUẦN NÀY

### Book meeting với Compliance Officer — NGAY TUẦN NÀY

**Tại sao không chờ được:**
- Toàn bộ tài liệu compliance (regulatory-mapping, gap analysis, PDPD impact, SBV requirements) đều dựa trên thông tin công khai + assumptions
- Compliance Officer biết **chính xác** Bank X đang comply gì, gap ở đâu, SBV gần nhất nói gì
- Không có input từ Compliance Officer → tất cả 4 documents Week 2 = **assumptions cần validate**
- Mỗi tuần delay = thêm 1 tuần rework nếu assumption sai

**Agenda meeting đề xuất (30-45 phút):**

| # | Câu hỏi | Mục đích |
|---|---------|---------|
| 1 | Bank X hiện có AI/ML nào trong quy trình tín dụng chưa? | Baseline |
| 2 | Bank X đã chuyển từ NĐ 13/2023 sang Luật BVDLCN 2025 + NĐ 356 chưa? Đã có DPIA chưa? | PDPD compliance |
| 3 | Bank X có DPO theo NĐ 356 chưa? | PDPD compliance |
| 4 | Bank X có biết về NĐ 94/2025 sandbox credit scoring chưa? Có kế hoạch đăng ký? | Sandbox |
| 5 | SBV gần nhất thanh tra Bank X khi nào? Findings liên quan đến KSNB / audit? | Risk assessment |
| 6 | Bank X có Model Validation team riêng không? Quy trình validate model hiện tại? | Model validation |
| 7 | Audit trail hiện tại cho credit decisions: format nào, lưu ở đâu, bao lâu? | Audit gap |
| 8 | Data residency policy: data lưu ở đâu? Cloud hay on-premise? | Architecture |
| 9 | Consent management hiện tại: basic form hay granular? | PDPD gap |
| 10 | Blocker lớn nhất nếu triển khai AI scoring từ góc nhìn compliance? | Prioritization |

**Nếu chưa có access đến Compliance Officer:**
- Ghi rõ trong tất cả documents: "Pending validation với Compliance Officer"
- Escalate: nhờ direct manager hoặc internal champion (Head of Cards / Risk Manager) giới thiệu
- Plan B: gặp IT/CTO trước (họ thường biết data residency, audit trail current state)

---

## 7. Tracking — Tự hỏi cuối tuần

- [ ] ⚠️ **Đã book meeting với Compliance Officer chưa? Nếu chưa → làm NGAY HÔM NAY**
- [ ] Gap nào HIGH priority cần address ngay? (Top 3: Human-in-the-loop governance, Audit trail design, Model validation process)
- [ ] PDPD: Bank X đã có consent management chưa? Đã chuyển từ NĐ 13 sang Luật 91/2025 + NĐ 356 chưa?
- [ ] SBV: Bank X có đăng ký sandbox NĐ 94 không? Nếu có → chuẩn bị documentation. Nếu không → standard path.
- [ ] Tất cả 4 documents Week 2 đã ghi "Pending validation" cho các items chưa confirm?
- [ ] Next step: validate với Compliance Officer → update tất cả 4 documents với real data

---

## 8. Ghi Chú & Limitations

1. **"Pending validation với Compliance Officer"** — tất cả status "Bank X" trong document này là assumptions. Phải validate trước khi dùng cho quyết định thiết kế.
2. **Không phải tư vấn pháp lý.** Cần legal counsel cho: retention period, DPIA nộp A05, sandbox application.
3. **Dự thảo TT thay thế TT 13/2018** đang ở giai đoạn hoàn thiện. Có thể thêm yêu cầu Model Risk Management cụ thể. Follow sát.
4. **NĐ 94/2025 sandbox mới** — chưa có tiền lệ bank nào hoàn thành sandbox credit scoring tại VN. Process có thể evolve.
5. **Cross-reference:** regulatory-mapping.md, compliance-gap-analysis.md, pdpd-impact-assessment.md cho context đầy đủ.