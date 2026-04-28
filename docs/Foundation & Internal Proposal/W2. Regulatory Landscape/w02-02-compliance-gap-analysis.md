# Compliance Gap Analysis — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

So sánh current state của ngân hàng thương mại VN với requirements khi triển khai AI trong quy trình tín dụng. Document này dùng cho **generic Vietnamese commercial bank** — chưa gắn với bank partner cụ thể. Khi có bank partner, cần validate từng dòng.

**Ký hiệu:**
- ✅ Đã có — bank đã comply
- ⚠️ Có một phần — cần nâng cấp
- ❌ Chưa có — gap cần address
- ❓ Chưa biết — cần validate với bank partner

---

## 1. Audit Trail & Kiểm Soát Nội Bộ (TT 13/2018)

| # | Requirement | Current State (NHTM VN generic) | Gap | Priority | Owner | Văn bản gốc |
|---|------------|-------------------------------|-----|----------|-------|-------------|
| 1.1 | Audit trail cho mọi credit decision (input, output, who, when, why) | ⚠️ Có log nhưng manual hoặc bán tự động. Phần lớn bank ghi nhận quyết định trên hệ thống Core Banking, nhưng không đủ chi tiết cho AI (thiếu model version, feature values, confidence score). | Cần automated audit trail ≥20 fields: input features, CIC data snapshot, model version, threshold version, AI recommendation, confidence score, human decision, override reason, timestamp, tenant ID, adverse action reason. | 🔴 HIGH | IT + Compliance | TT 13/2018 Điều 5 |
| 1.2 | Mô hình 3 tuyến phòng thủ bao gồm AI system | ⚠️ Hầu hết NHTM đã áp dụng mô hình 3 tuyến (86% áp dụng TT41/Basel II). Nhưng AI system chưa được map vào mô hình. | Cần map AI-CRDS vào tuyến 1 (vận hành), bank Risk vào tuyến 2 (giám sát AI), Internal Audit vào tuyến 3 (kiểm toán AI). Cần bổ sung AI model risk vào framework KSNB. | 🟡 MEDIUM | Risk + Compliance | TT 13/2018 Chương II |
| 1.3 | Quản lý rủi ro mô hình (Model Risk Management) | ❌ Hầu hết NHTM VN chưa có MRM framework riêng cho AI/ML models. Một số bank lớn (VCB, TCB) bắt đầu nhưng chưa chuẩn hóa. | Cần MRM framework: model inventory, model validation (independent), model monitoring, model governance (approval, change, retirement). Dự thảo TT thay thế TT13 có thể thêm yêu cầu này. | 🟡 MEDIUM | Risk | TT 13/2018 (dự thảo thay thế) |
| 1.4 | Replay capability — tái hiện lại quyết định credit từ quá khứ | ❌ Không có. Quyết định manual không thể replay chính xác. | Cần: given same input + model version + threshold → same output. Yêu cầu data snapshot, model versioning, threshold versioning. | 🔴 HIGH | IT + Product | TT 13/2018; SBV audit requirement |

---

## 2. Bảo Vệ Dữ Liệu Cá Nhân (Luật 91/2025 + NĐ 356/2025)

| # | Requirement | Current State (NHTM VN generic) | Gap | Priority | Owner | Văn bản gốc |
|---|------------|-------------------------------|-----|----------|-------|-------------|
| 2.1 | DPIA (Đánh giá tác động xử lý DLCN) cho AI scoring system | ❓ Chưa biết bank nào đã có DPIA cho hệ thống scoring hiện tại. NĐ 356 mới có hiệu lực 01/01/2026 — nhiều bank đang trong quá trình transition từ NĐ 13. | Cần DPIA theo Mẫu 10 NĐ 356 cho AI-CRDS. Nộp A05 trong 60 ngày kể từ khi bắt đầu xử lý. Bank partner cần DPIA riêng cho hệ thống của họ + DPIA cho AI-CRDS integration. | 🔴 HIGH | Compliance + Product | Luật 91/2025 Điều 20; NĐ 356 Điều 19 |
| 2.2 | Consent management — đồng ý xử lý DLCN cho chấm điểm tín dụng | ⚠️ Bank có consent cơ bản (ký form đồng ý khi mở tài khoản/vay). Nhưng NĐ 356 yêu cầu: nêu rõ mục đích chấm điểm tín dụng, thời gian lưu trữ, nguồn thu thập, các bên chia sẻ. Cấm "mặc định đồng ý." | Cần granular consent: (1) tách riêng consent cho credit scoring vs marketing. (2) Nêu rõ AI sẽ xử lý tự động. (3) Lưu trữ sự đồng ý. (4) Cho phép rút lại + quy trình xử lý khi rút. Đặc biệt: NĐ 356 yêu cầu trong lĩnh vực tài chính ngân hàng phải nêu rõ hoạt động chấm điểm/xếp hạng tín dụng. | 🔴 HIGH | Compliance + Product | Luật 91/2025 Điều 9; NĐ 356 Điều 5-6, Điều 10 |
| 2.3 | Right to explanation cho automated decision | ❌ Không có. Quy trình hiện tại 100% manual nên không phát sinh yêu cầu giải thích thuật toán. | Khi có AI: NĐ 356 Điều 9 yêu cầu bên kiểm soát phải (1) thông báo cho chủ thể về xử lý tự động, (2) giải thích nguyên tắc hoạt động thuật toán, (3) cho phép chủ thể chọn không tham gia (opt-out). AI-CRDS cần explainability module (feature importance, counterfactual) + opt-out flow. | 🔴 HIGH | Product + Risk | NĐ 356 Điều 9 |
| 2.4 | DPO — Nhân sự bảo vệ dữ liệu cá nhân | ❓ Chưa biết bank nào đã bổ nhiệm DPO theo điều kiện NĐ 356 (cao đẳng+, ≥2 năm kinh nghiệm pháp chế/CNTT/QTRR, đã đào tạo BVDLCN). Trước đây NĐ 13 không quy định điều kiện cụ thể. | Bank partner cần confirm đã có DPO đủ điều kiện. AI-CRDS vendor (nếu xử lý DLCN) cũng cần DPO hoặc thuê dịch vụ BVDLCN (NĐ 356 cho phép outsource, nhưng cá nhân cung cấp cần ≥3 năm kinh nghiệm). | 🟡 MEDIUM | HR + Compliance | NĐ 356 Điều 13-14 |
| 2.5 | Data residency — DLCN lưu trữ tại VN hoặc có hồ sơ chuyển XLBG | ⚠️ Core Banking thường on-premise tại VN. Nhưng nếu AI-CRDS dùng cloud nước ngoài (AWS/GCP/Azure) → phải có hồ sơ đánh giá tác động chuyển DLCN xuyên biên giới (Mẫu 09 NĐ 356) + thông báo Bộ Công an (Mẫu 01a). | Quyết định architecture: (a) VN cloud only (Viettel Cloud/FPT Cloud) — không cần hồ sơ XLBG nhưng giới hạn dịch vụ. (b) Foreign cloud + hồ sơ XLBG — linh hoạt hơn nhưng compliance cost cao. (c) Hybrid — core processing VN, non-PII analytics foreign. | 🔴 HIGH | CTO + Compliance | Luật 91/2025 Điều 27; NĐ 356 Điều 20-21 |
| 2.6 | Breach notification — thông báo vi phạm DLCN trong 72h | ❓ Chưa biết bank đã có incident response plan cho data breach theo NĐ 356 chưa. | Cần: (1) Incident response plan (phát hiện → containment → notification 72h → recovery → RCA). (2) Thông báo A05 + chủ thể dữ liệu (nếu dữ liệu nhạy cảm). (3) Template thông báo theo Mẫu 08 NĐ 356. AI-CRDS cần breach detection + notification workflow tích hợp. | 🟡 MEDIUM | IT + Compliance | Luật 91/2025 Điều 23; NĐ 356 Điều 28 |

---

## 3. Explainability & Adverse Action (Luật TCTD 2024 + NĐ 356)

| # | Requirement | Current State (NHTM VN generic) | Gap | Priority | Owner | Văn bản gốc |
|---|------------|-------------------------------|-----|----------|-------|-------------|
| 3.1 | Adverse action notice — lý do từ chối cấp tín dụng cho khách hàng | ⚠️ Bank thường thông báo từ chối nhưng lý do chung chung ("không đủ điều kiện"). Chưa có structured adverse action notice nêu rõ yếu tố chính dẫn đến từ chối. | Cần adverse action notice template: (1) Nêu top 3-5 lý do từ chối (feature-based, không phải model internals). (2) Gợi ý cách cải thiện (nếu applicable). (3) Quyền khiếu nại và yêu cầu human review. (4) Lưu trữ trong audit trail. | 🔴 HIGH | Product + Compliance | Luật TCTD 2024; NĐ 356 Điều 9 (right to explanation) |
| 3.2 | Model documentation — model card, feature list, performance metrics, limitations | ❌ Hầu hết bank VN chưa có model card chuẩn cho scorecard/model hiện tại. Một số bank lớn có internal documentation nhưng không theo format chuẩn. | Cần model card cho AI-CRDS: (1) Purpose & intended use. (2) Training data description. (3) Feature list & importance. (4) Performance metrics (per segment). (5) Known limitations & biases. (6) Update history. SBV audit có thể yêu cầu xuất trình. | 🟡 MEDIUM | Risk + Product | TT 13/2018 (KSNB); Dự thảo TT thay thế (model risk) |
| 3.3 | Bias monitoring — protected attributes (gender, geography, income source) | ❌ Không có systematic bias monitoring. Quy trình manual → bias tồn tại nhưng không đo được. | Cần: (1) Define protected attributes cho VN context (gender, geography, ethnicity — lưu ý VN không có protected class regulation riêng như US ECOA, nhưng Hiến pháp cấm phân biệt đối xử). (2) Fairness metrics per segment. (3) Regular bias audit. (4) Response plan khi phát hiện bias. | 🟡 MEDIUM | Risk + Product | Hiến pháp VN 2013 Điều 16; Dự thảo TT thay thế TT13 |

---

## 4. Human-in-the-Loop & Decision Governance (Luật TCTD 2024)

| # | Requirement | Current State (NHTM VN generic) | Gap | Priority | Owner | Văn bản gốc |
|---|------------|-------------------------------|-----|----------|-------|-------------|
| 4.1 | Human-in-the-loop — người ký quyết định credit cuối cùng | ✅ 100% manual hiện tại — Credit Officer ký mọi quyết định. | Khi có AI: cần formal governance: (1) AI chỉ recommend, không decide. (2) Governance document rõ ràng: ai ký, khi nào override, log override reason. (3) Auto-approve/auto-reject cũng cần human oversight (batch review, threshold approval bởi Risk Committee). (4) Escalation tree khi AI low confidence. | 🔴 HIGH | Risk + Compliance | Luật TCTD 2024 Điều 102-103; TT 13/2018 |
| 4.2 | Override governance — quy trình khi Credit Officer không đồng ý với AI | ❌ Không có (vì chưa có AI). | Cần: (1) Override policy: ai được override, cần approval thêm không. (2) Override reason logging (bắt buộc). (3) Override rate monitoring (nếu >60% → AI không có giá trị, cần recalibrate). (4) Feedback loop: override data feed back vào model training. | 🔴 HIGH | Risk + Product | Thiết kế nội bộ; TT 13/2018 (KSNB) |
| 4.3 | Threshold governance — ai approve threshold cho auto-approve/auto-reject | ❌ Không có (vì chưa có AI threshold). Bank có credit policy nhưng không có AI threshold framework. | Cần: (1) Risk Committee approve threshold. (2) Threshold review cadence (quarterly hoặc khi drift detected). (3) Sensitivity analysis: threshold ±10% → impact on NPL, approval rate. (4) PM không được tự quyết threshold — phải qua Risk Committee. | 🔴 HIGH | Risk Committee | Thiết kế nội bộ; TT 13/2018 |
| 4.4 | Escalation tree — quy trình khi AI uncertain hoặc edge case | ⚠️ Có escalation hiện tại (CO → Senior → Committee) nhưng chưa có trigger từ AI. | Cần bổ sung: (1) AI confidence < threshold → auto-escalate. (2) AI detect anomaly/fraud signal → fast-track escalation. (3) "Need-more-info" state — AI không ép quyết định khi data thiếu. (4) SLA per escalation level. | 🟡 MEDIUM | Risk + Product | Thiết kế nội bộ |

---

## 5. CIC & eKYC Integration (TT 45/2025 + quy định CIC)

| # | Requirement | Current State (NHTM VN generic) | Gap | Priority | Owner | Văn bản gốc |
|---|------------|-------------------------------|-----|----------|-------|-------------|
| 5.1 | CIC data access — AI system query CIC tự động | ⚠️ Bank có CIC access nhưng nhiều bank query manual hoặc bán tự động. API integration level khác nhau giữa các bank. | Cần: (1) Automated CIC API query trong AI pipeline. (2) CIC data snapshot lưu trong audit trail (tại thời điểm quyết định). (3) Retry/fallback khi CIC timeout. (4) CIC data usage phải comply consent (NĐ 356 — nêu rõ nguồn thu thập). | 🟡 MEDIUM | IT + Product | Quy chế CIC; NĐ 356 |
| 5.2 | Sinh trắc học tại origination — eKYC integration | ⚠️ Bank có eKYC nhưng level khác nhau. TT 45/2025 bắt buộc đối chiếu sinh trắc khi phát hành thẻ (digital bank: online biometric OK). | AI-CRDS cần: (1) Integrate kết quả eKYC/biometric vào scoring pipeline (pass/fail + confidence). (2) Fraud detection layer sử dụng biometric verification result. (3) Nếu eKYC fail → auto-route to manual review, không auto-reject. | 🟡 MEDIUM | IT + Product | TT 45/2025 |

---

## 6. Sandbox & Reporting (NĐ 94/2025)

| # | Requirement | Current State (NHTM VN generic) | Gap | Priority | Owner | Văn bản gốc |
|---|------------|-------------------------------|-----|----------|-------|-------------|
| 6.1 | Sandbox participation — hồ sơ đăng ký cơ chế thử nghiệm credit scoring | ❓ Chưa biết bank nào đã đăng ký sandbox credit scoring. NĐ 94 mới hiệu lực 01/07/2025. | Nếu bank partner muốn tham gia sandbox: cần hồ sơ gồm kế hoạch thử nghiệm, quản lý rủi ro, nhân sự, pháp lý. AI-CRDS cần chuẩn bị documentation package hỗ trợ bank nộp hồ sơ. IT phải đặt tại VN. | 🟢 LOW (enabler) | Product + Compliance | NĐ 94/2025 Điều 8-10 |
| 6.2 | SBV reporting — báo cáo định kỳ khi tham gia sandbox | ❌ Chưa có (vì chưa tham gia sandbox). | Nếu tham gia: cần progress reports cho NHNN theo cadence quy định. AI-CRDS cần reporting module: performance metrics, incident log, risk assessment. Bắt đầu trong 90 ngày kể từ khi nhận Giấy chứng nhận. | 🟢 LOW | Product + Compliance | NĐ 94/2025 Điều 15-16 |
| 6.3 | Gian lận reporting qua SIMO | ⚠️ Bank có báo cáo gian lận nhưng format và frequency có thể chưa align TT 45/2025 mới. | AI-CRDS fraud detection output cần compatible với SIMO reporting format. Cần thiết kế fraud alert → SIMO report mapping. | 🟡 MEDIUM | IT + Compliance | TT 45/2025 |

---

## 7. Basel II/III Alignment (TT 41/2016)

| # | Requirement | Current State (NHTM VN generic) | Gap | Priority | Owner | Văn bản gốc |
|---|------------|-------------------------------|-----|----------|-------|-------------|
| 7.1 | AI score output compatible với risk weight categories | ⚠️ Bank tính risk weight theo TT 41 (phương pháp tiêu chuẩn). Scorecard hiện tại đã align. Nhưng AI score output format có thể khác. | AI-CRDS output phải map được sang risk categories mà bank đang dùng cho CAR calculation. Cần hiểu cách target bank tính risk weight → thiết kế output compatible. Không cần AI-CRDS tính CAR, nhưng output phải usable. | 🟡 MEDIUM | Risk + Product | TT 41/2016; TT 22/2023 |
| 7.2 | Model documentation đủ cho Trụ cột III disclosure | ⚠️ Bank có disclosure theo TT 41 nhưng chưa bao gồm AI model. | Khi thêm AI: disclosure cần bao gồm: (1) AI model description. (2) Performance metrics. (3) Impact on risk assessment. Model card (Gap 3.2) phục vụ mục đích này. | 🟡 MEDIUM | Risk | TT 41/2016 Trụ cột III |

---

## 8. Tổng Hợp Priority

### 🔴 HIGH Priority — Cần address trước khi deploy (8 gaps)

| # | Gap | Owner | Target Week |
|---|-----|-------|------------|
| 1.1 | Automated audit trail ≥20 fields | IT + Compliance | Week 35 (Audit Trail Design) |
| 1.4 | Replay capability | IT + Product | Week 35 |
| 2.1 | DPIA theo NĐ 356 | Compliance + Product | Week 10 (DPIA Report) |
| 2.2 | Granular consent management | Compliance + Product | Week 9 (Human-AI Interaction) |
| 2.3 | Right to explanation cho automated decision | Product + Risk | Week 9 |
| 2.5 | Data residency architecture decision | CTO + Compliance | Week 10 (Tech Stack) |
| 3.1 | Adverse action notice template | Product + Compliance | Week 9 |
| 4.1 | Human-in-the-loop formal governance | Risk + Compliance | Week 5 (Decision Architecture) |
| 4.2 | Override governance policy | Risk + Product | Week 9 |
| 4.3 | Threshold governance — Risk Committee approval | Risk Committee | Week 6 (Threshold Design) |

### 🟡 MEDIUM Priority — Cần address trước pilot (9 gaps)

| # | Gap | Owner | Target Week |
|---|-----|-------|------------|
| 1.2 | Map AI vào mô hình 3 tuyến | Risk + Compliance | Week 17 (Multi-role Architecture) |
| 1.3 | Model Risk Management framework | Risk | Week 57 (Model Lifecycle Maturity) |
| 2.4 | DPO theo NĐ 356 | HR + Compliance | Week 23 (Governance Layer) |
| 2.6 | Breach notification workflow | IT + Compliance | Week 36 (Compliance Simulation) |
| 3.2 | Model card / documentation | Risk + Product | Week 23 |
| 3.3 | Bias monitoring framework | Risk + Product | Week 23 |
| 4.4 | Escalation tree từ AI | Risk + Product | Week 5 |
| 5.1 | CIC automated API integration | IT + Product | Week 20 (Integration Build) |
| 5.2 | eKYC biometric integration | IT + Product | Week 20 |
| 6.3 | SIMO reporting compatibility | IT + Compliance | Week 35 |
| 7.1 | AI output → risk weight mapping | Risk + Product | Week 5 (Decision Architecture) |
| 7.2 | Basel III disclosure cho AI model | Risk | Week 23 |

### 🟢 LOW Priority — Enablers (2 gaps)

| # | Gap | Owner | Target Week |
|---|-----|-------|------------|
| 6.1 | Sandbox documentation package | Product + Compliance | Week 29 (Pilot Proposal) |
| 6.2 | SBV sandbox reporting module | Product + Compliance | Week 29 |

### ❓ Cần Validate với Bank Partner (4 items)

| # | Question | Khi nào validate |
|---|---------|-----------------|
| 2.1 | Bank đã có DPIA cho scoring system hiện tại chưa? | Week 13 (Discovery) |
| 2.4 | Bank đã bổ nhiệm DPO theo NĐ 356 chưa? | Week 13 |
| 2.6 | Bank có incident response plan cho data breach chưa? | Week 13 |
| 6.1 | Bank có kế hoạch đăng ký sandbox NĐ 94 không? | Week 13 |

---

## 9. Tracking — Tự hỏi cuối tuần

- [ ] Đã contact Compliance Officer chưa?
- [ ] Gap nào HIGH priority cần address ngay? (Top 3: DPIA, Consent, Human-in-the-loop governance)
- [ ] PDPD: Bank X đã có consent management system chưa? Đã chuyển từ NĐ 13 sang Luật 91/2025 + NĐ 356 chưa?
- [ ] SBV: Bank X có đăng ký sandbox NĐ 94 cho credit scoring không?
- [ ] Các ❓ items đã được schedule validate khi nào?
- [ ] HIGH priority gaps có map đúng vào roadmap timeline chưa?

---

## 10. Ghi Chú & Limitations

1. **Current state là generic** — dựa trên thông tin công khai về NHTM VN nói chung. Mỗi bank sẽ khác nhau đáng kể (bank lớn Basel II-compliant vs bank nhỏ). Cần validate per bank partner.
2. **NĐ 356/2025 rất mới** (hiệu lực 01/01/2026) — nhiều bank đang trong giai đoạn transition. Gap thực tế có thể lớn hơn hoặc nhỏ hơn tùy bank.
3. **Bias monitoring** — VN chưa có protected class regulation riêng (như US ECOA/FCRA). Nhưng Hiến pháp 2013 cấm phân biệt đối xử → cần proactive approach.
4. **Dự thảo TT thay thế TT 13** có thể thêm yêu cầu model risk management — follow sát.
5. **Document này không phải tư vấn pháp lý** — cần legal review trước khi triển khai.
6. **Cross-reference:** regulatory-mapping.md v1.0 cho chi tiết từng văn bản pháp lý.