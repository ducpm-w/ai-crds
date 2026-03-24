# AI-Native CRDS — Lộ Trình Triển Khai Nội Bộ (v3 — Hợp Nhất)
## AI-Native Credit Risk Decision Support
### Dự án nội bộ tại Bank X — 60 tuần

---

## Bối Cảnh & Định Hướng

Lộ trình này được xây dựng cho dự án **AI-Native CRDS** — triển khai hệ thống AI hỗ trợ quyết định tín dụng tại Bank X, do đội ngũ inhouse dẫn dắt bởi AI-Native Product Manager.

### Hai mục tiêu song song

**Mục tiêu 1 — Triển khai nội bộ (Primary)**  
Xây dựng và deploy AI-Native CRDS tại Bank X cho use case Origination Scoring + Fraud Detection tại điểm phát hành thẻ tín dụng retail. Đo được bằng: giảm manual review rate, giảm time-to-decision, giữ hoặc giảm NPL.

**Mục tiêu 2 — Tiềm năng đóng gói (Secondary)**  
Nếu hệ thống chứng minh được giá trị tại Bank X, có thể đóng gói thành SaaS bán cho các tổ chức tài chính khác. Đây là optionality — không phải ưu tiên trong 60 tuần đầu.

---

## Cấu Trúc 4 Phase — 60 Tuần

| Phase     | Tuần       | Nội dung                                                                                       |
|----------|-----------|------------------------------------------------------------------------------------------------|
| **Phase 1** | Week 1–16 | Foundation & Internal Proposal — Problem framing, DPIA (NĐ13), MVP build, internal demo        |
| **Phase 2** | Week 17–32| Workflow Design & MLOps — Multi-role workflow, Champion-Challenger setup, internal validation |
| **Phase 3** | Week 33–48| Internal Deployment & Feedback Loop — Shadow testing, Full rollout, Ground Truth labeling     |
| **Phase 4** | Week 49–60| Scale & Lifecycle Maturity — CI/CD for ML, measure impact, assess packaging potential         |

---

## PHASE 1 — FOUNDATION & INTERNAL PROPOSAL (Week 1–16)

---

### Week 1 — Problem Framing (Internal Context)

🎯 **Mục tiêu:** Xác định đúng problem tại Bank X + outcome đo được bằng tiền

📘 **MUST KNOW:**  
- Current state của Bank X (quy trình hiện tại, tools đang dùng, pain points nội bộ)  
- Root cause vs symptom  
- Decision frequency tại Bank X  
- Cost per error (approve nhầm = loss, reject nhầm = lost revenue)

💡 **Vì sao:**  
Inhouse proposal cần số liệu nội bộ, không chỉ industry benchmark.  
“Chúng ta đang mất bao nhiêu” thuyết phục hơn “industry đang mất bao nhiêu”.

⚠️ **Chú ý:**  
Nếu chưa có số liệu nội bộ chính xác → thừa nhận gap và đề xuất Discovery Phase. **Không bịa số.**

🔧 **Áp dụng:**  
- Use case shortlist (3–5 trong credit lifecycle) → chọn 1  
- Current state mapping (as-is process)  
- Pain point inventory từ team nội bộ  
- Industry benchmark để triangulate nếu thiếu internal data

📦 **Output (v2 + gốc):**  
- `use-case-shortlist.md`  
- `problem-brief.md` (internal version)  
- `current-state-assessment.md`  
- `decision-frequency.md`

📊 **Tracking:**  
Có ít nhất 1 internal data point chưa? Pain point có được confirm bởi ≥1 colleague?

---

### Week 2 — VN Regulatory Landscape (Bank X Specific)

🎯 **Mục tiêu:** Map regulatory constraints ảnh hưởng đến AI-Native CRDS tại Bank X cụ thể

📘 **MUST KNOW:**  
- Thông tư 13/2018/TT-NHNN  
- Nghị định 13/2023/NĐ-CP (PDPD)  
- Nghị định 94/2025 (sandbox credit scoring)  
- Thông tư 41/2016/TT-NHNN (Basel II)  
- Internal compliance policies của Bank X  
- CIC data access rules

💡 **Vì sao:**  
Inhouse có lợi thế: biết Bank X đang comply gì rồi, không cần educate từ đầu. Nhưng phải biết rõ gap giữa current compliance và requirements mới khi có AI.

⚠️ **Chú ý:**  
Kết nối với Compliance Officer của Bank X ngay từ tuần này — họ là **ally quan trọng**, không phải blocker nếu được involve sớm.

🔧 **Áp dụng:**  
- Regulatory mapping table  
- Gap analysis: current state vs AI requirements  
- Internal compliance checklist  
- PDPD impact assessment cho Bank X

📦 **Output:**  
- `regulatory-mapping.md`  
- `compliance-gap-analysis.md`  
- `pdpd-impact-bank-x.md`

📊 **Tracking:**  
Đã nói chuyện với Compliance Officer chưa? Gap nào lớn nhất cần address?

---

### Week 3 — Data Landscape Assessment (Bank X Internal)

🎯 **Mục tiêu:** Đánh giá data thực tế tại Bank X: có gì, thiếu gì, quality thế nào

📘 **MUST KNOW:**  
- Core Banking system của Bank X (T24? Flexcube? Homegrown?)  
- CIC integration hiện tại (tự động hay manual?)  
- eKYC setup hiện tại  
- Internal transaction data quality  
- Feature availability cho CC origination segment

💡 **Vì sao:**  
Inhouse có lợi thế lớn nhất ở đây — access data nội bộ mà SaaS vendor không có. Tận dụng tối đa.

⚠️ **Chú ý:**  
Data quality thường tệ hơn mong đợi. Đánh giá thật, không optimistic.

🔧 **Áp dụng:**  
- Data source inventory (internal + external)  
- Data quality scorecard  
- Feature availability matrix cho CC salaried segment  
- Synthetic data strategy nếu có gaps

📦 **Output:**  
- `data-landscape-bank-x.md`  
- `data-quality-scorecard.md`  
- `feature-availability-matrix.md`

📊 **Tracking:**  
Bao nhiêu features available? Data quality score tổng thể?

---

### Week 4 — Damage Model & Break-even (Bank X Economics)

🎯 **Mục tiêu:** Biến rủi ro credit tại Bank X thành bảng thiệt hại và ngưỡng hòa vốn cụ thể

📘 **MUST KNOW:**  
- Expected Loss = PD × LGD × EAD  
- NPL ratio hiện tại của Bank X  
- Manual review cost per application tại Bank X  
- Revenue per approved CC  
- Current team size và cost

💡 **Vì sao:**  
C-level approve budget dựa trên ROI. Phải chứng minh: AI system tốn X nhưng tiết kiệm Y cho chính Bank X.

⚠️ **Chú ý:**  
Dùng số nội bộ Bank X khi có. Nếu không có → dùng range từ industry benchmark và ghi rõ assumption.

🔧 **Áp dụng:**  
- Damage tiers cho credit decisions tại Bank X  
- Break-even scenarios (best/base/worst)  
- Cost-benefit analysis: build inhouse vs buy vendor  
- Budget request estimate

📦 **Output:**  
- `damage-model-bank-x.md`  
- `break-even-analysis.md`  
- `budget-estimate-v0.md`

📊 **Tracking:**  
Assumption nào yếu nhất? Cần validate với Finance/CFO?

---

### Week 5 — Decision Architecture & States

🎯 **Mục tiêu:** Thiết kế cấu trúc quyết định: Auto-Approve / Manual Review / Auto-Reject / Escalate / (Need-More-Info)

📘 **MUST KNOW:**  
- Current decision flow tại Bank X  
- Decision states trong credit  
- SLA per state  
- Adverse action notice requirements  
- SBV human-in-the-loop requirement

💡 **Vì sao:**  
Phải map AI vào quy trình hiện tại của Bank X — không thể redesign toàn bộ quy trình ngay lần đầu.

⚠️ **Chú ý:**  
Phải có 'abstain/need-more-info' state. AI **không được ép quyết định** khi data thiếu.

🔧 **Áp dụng:**  
- As-is decision flow của Bank X  
- To-be decision flow với AI  
- 5–7 decision states với entry/exit conditions  
- Ownership per state  
- SLA per state

📦 **Output:**  
- `decision-architecture.md`  
- `decision-state-spec.md`  
- `escalation-tree-v1.md`

📊 **Tracking:**  
As-is flow đã được validate với Credit Officer chưa? SLA có realistic không?

---

### Week 6 — Threshold Design & Cost-of-Error

🎯 **Mục tiêu:** Chọn threshold framework dựa trên chi phí FP/FN tại Bank X

📘 **MUST KNOW:**  
- FP = reject good borrower (lost revenue tại Bank X)  
- FN = approve bad borrower (credit loss tại Bank X)  
- NPL rate hiện tại  
- Threshold governance — ai approve?

💡 **Vì sao:**  
Threshold quyết định bao nhiêu % hồ sơ auto-approve, manual review, auto-reject. Sai threshold = mất tiền hoặc mất khách.

⚠️ **Chú ý:**  
Threshold phải được approve bởi **Risk Committee** của Bank X — không phải PM quyết định đơn phương.

🔧 **Áp dụng:**  
- Cost table (FP vs FN cost tại Bank X)  
- Threshold sensitivity analysis  
- Approval rate curve  
- Risk Committee approval flow

📦 **Output:**  
- `threshold-framework.md`  
- `cost-of-error-table.md`  
- `approval-rate-curve.md`

📊 **Tracking:**  
Risk Manager đã review threshold approach chưa?

---

### Week 7 — KPI Tree & Metric Conflict

🎯 **Mục tiêu:** KPI tree cho AI-Native CRDS tại Bank X + guardrails + giải quyết metric conflict

📘 **MUST KNOW:**  
- Bank X's current KPIs  
- Primary metrics: NPL reduction, time-to-decision  
- Guardrail metrics: approval rate floor, bias  
- Metric conflict giữa Business và Risk

💡 **Vì sao:**  
Inhouse context: KPI phải align với existing Bank X scorecards. Không tự đặt KPI rồi surprise C-level.

⚠️ **Chú ý:**  
Confirm KPI framework với **Head of Cards** và **Risk Manager** trước khi finalize. Hai bên thường có tension.

🔧 **Áp dụng:**  
- KPI tree aligned với Bank X business objectives  
- Metric conflict memo  
- Guardrail definitions  
- Reporting alignment với existing Bank X reports

📦 **Output:**  
- `kpi-tree.md`  
- `metric-conflict-memo.md`  
- `guardrail-definitions.md`

📊 **Tracking:**  
KPI đã được pre-aligned với Risk Manager và Head of Cards chưa?

---

### Week 8 — Workflow Modeling (End-to-End tại Bank X)

🎯 **Mục tiêu:** Map end-to-end CC origination workflow tại Bank X + AI integration points

📘 **MUST KNOW:**  
- Current Bank X workflow chi tiết  
- Integration points với Core Banking, CIC, eKYC  
- Exception flows  
- Timeout handling  
- Handoff giữa systems

💡 **Vì sao:**  
Inhouse có lợi thế: có thể observe workflow thật, không phải giả định.

⚠️ **Chú ý:**  
Shadow Credit Officers ít nhất 1 ngày trước khi vẽ workflow. Quy trình thật thường khác quy trình trên giấy.

🔧 **Áp dụng:**  
- As-is workflow (observe thật, không giả định)  
- To-be workflow với AI integration  
- ≥7 states, ≥3 exception exits  
- Integration point map tại Bank X

📦 **Output:**  
- `workflow-as-is.md`  
- `workflow-to-be.md`  
- `integration-point-map.md`

📊 **Tracking:**  
Đã shadow Credit Officer chưa? As-is workflow đã được validate?

---

### Week 9 — Human-AI Interaction Design (Credit Officer Trust)

🎯 **Mục tiêu:** Thiết kế trust layer cho Credit Officer tại Bank X: explain, override, audit

📘 **MUST KNOW:**  
- Bank X Credit Officers' current workflow  
- Explanation types  
- Override governance  
- Adverse action notice  
- Calibrated trust — không quá tin, không quá nghi

💡 **Vì sao:**  
Inhouse advantage: có thể interview Credit Officers trực tiếp, test prototype với real users.

⚠️ **Chú ý:**  
Organize 3–5 internal user interviews với Credit Officers trước khi design. Đừng assume pain points.

🔧 **Áp dụng:**  
- User interviews với Credit Officers (3–5 người)  
- Risk score display + confidence band  
- Top 3 reasons panel  
- Override UI + reason logging  
- Adverse action notice template  
- Internal trust calibration guide

📦 **Output:**  
- `user-interview-notes.md`  
- `ux-wireframes-v1.md` (low-fidelity)  
- `override-governance.md`  
- (v2 giữ 3 file chính này, adverse action template có thể nằm trong gov pack sau)

📊 **Tracking:**  
Bao nhiêu Credit Officers đã interview? Key insights là gì?

---

### Week 10 — Tech Stack & DPIA (Data Privacy Impact Assessment) 🔰

🎯 **Mục tiêu:** Đảm bảo tuân thủ Nghị định 13/2023/NĐ-CP (PDPD) ngay từ khâu thiết kế, đồng thời hiểu rõ tech stack của Bank X

📘 **MUST KNOW:**  
- Bank X's Core Banking system  
- CIC API specs tại Bank X  
- eKYC provider của Bank X  
- PII handling theo PDPD  
- Data residency của Bank X  
- Existing security policies  
- Quy trình **Đánh giá tác động xử lý dữ liệu cá nhân (DPIA)** theo NĐ13

💡 **Vì sao:**  
Inhouse advantage: IT team có thể cung cấp thông tin này trực tiếp.  
DPIA sớm giúp tránh việc phải redesign kiến trúc sau khi Legal/Compliance “soi”.

⚠️ **Chú ý:**  
- Book meeting với IT/CTO và Compliance ngay tuần này.  
- DPIA không phải giấy tờ “cho có” — SBV / cơ quan quản lý có thể yêu cầu xuất trình.  
- KHÔNG dùng real customer data cho demo trước khi DPIA + data governance được approve.

🔧 **Áp dụng:**  
- Bank X tech stack documentation  
- **Data flow diagram** (PII marked)  
- Thực hiện báo cáo **DPIA** theo mẫu Nghị định 13  
- **Data Mapping:** luồng dữ liệu khách hàng từ thu thập → xử lý → quyết định → lưu trữ  
- **Privacy by Design:** cơ chế để khách hàng:
  - Rút lại sự đồng ý  
  - Yêu cầu giải thích quyết định tự động

📦 **Output:**  
- `tech-stack-bank-x.md`  
- `data-flow-diagram.md` hoặc nhúng trong DPIA  
- `dpia-report-v1.md`  
- `pdpd-compliance-checklist.md` (thay cho `pdpd-checklist-bank-x.md` ở bản gốc)

📊 **Tracking:**  
Đã meeting với IT và Compliance chưa? Có technical/legal blocker nào không?

---

### Week 11 — Internal Formal Proposal (C-Level Ready)

🎯 **Mục tiêu:** Hoàn thiện formal proposal để trình C-level và xin approve Phase 1 budget

📘 **MUST KNOW:**  
- Bank X internal proposal format  
- Budget approval process  
- C-level priorities  
- Cách trình bày AI với non-technical executives

💡 **Vì sao:**  
Đây là milestone quan trọng nhất của Phase 1. Không có approval → không có resources → không có project.

⚠️ **Chú ý:**  
Proposal phải có:  
- Problem (số nội bộ)  
- Solution (AI-Native CRDS)  
- ROI (break-even)  
- Ask (budget + headcount + timeline)  
Không quá kỹ thuật.

🔧 **Áp dụng:**  
- Executive Summary (1 trang)  
- Problem Statement (internal data)  
- Proposed Solution  
- Impact & ROI  
- Implementation Roadmap (Phase 0–3)  
- Budget & Resource Request  
- Risks & Mitigation  
- Stakeholder map (ai ảnh hưởng / ai quyết định)

📦 **Output (v2 gom lại):**  
- Bộ Proposal v1 gồm:
  - `01-executive-summary.md`  
  - `02-problem-statement.md`  
  - `03-proposed-solution.md`  
  - `04-impact-and-roi.md`  
  - `05-stakeholder-map.md`  
  - `06-implementation-roadmap.md`  
  - `07-risks-and-mitigation.md`

📊 **Tracking:**  
Đã pre-align với direct manager chưa? Proposal đã được review bởi ≥1 internal ally?

---

### Week 12 — MVP Build v1 (Internal Demo)

🎯 **Mục tiêu:** Có demo chạy được để show nội bộ: application input → AI score + explanation → decision recommendation → audit log

📘 **MUST KNOW:**  
- Streamlit hoặc Next.js cho demo  
- Synthetic data từ Bank X data structure  
- Threshold logic  
- Audit log schema

💡 **Vì sao:**  
Inhouse advantage: có thể dùng synthetic data modeled theo real Bank X data structure. Demo sẽ realistic hơn.

⚠️ **Chú ý:**  
- Dùng synthetic data — **KHÔNG dùng real customer data** cho demo (PDPD).  
- Keep it simple: mục tiêu là **show end-to-end**, không phải show “model xịn”.

🔧 **Áp dụng:**  
- Build UI tối thiểu  
- Implement threshold logic (simple rule + placeholder score)  
- Audit log đầy đủ các field cơ bản  
- Adverse action notice output (template)  
- Demo script cho internal presentation

📦 **Output:**  
- Working demo v1  
- Demo script  
- Synthetic dataset (Bank X structure)  
- Audit log v1

📊 **Tracking:**  
Demo chạy được end-to-end chưa? Audit log đủ fields chưa?

---

### Week 13 — Internal Usability Test + Stakeholder Alignment

🎯 **Mục tiêu:** Test demo với Credit Officers nội bộ + align với key stakeholders trước khi present C-level

📘 **MUST KNOW:**  
- Task-based testing  
- Internal politics  
- Stakeholder management  
- Building internal champions

💡 **Vì sao:**  
Inhouse advantage: user testing với real users ngay lập tức. Không cần tìm external testers.

⚠️ **Chú ý:**  
- Xây dựng **internal champions** — những người sẽ support proposal trong C-level meeting.  
- Risk Manager và Head of Cards là 2 người quan trọng nhất.

🔧 **Áp dụng:**  
- 3–5 usability sessions với Credit Officers (chạy demo, quan sát, hỏi)  
- 1-on-1 với Risk Manager, Head of Cards, Compliance Officer  
- Collect structured feedback (what works / what confuses / what scares them)  
- Address top concerns trước khi C-level presentation  
- Build champion network (ai sẽ speak up ủng hộ)

📦 **Output:**  
- Usability test report  
- Stakeholder feedback log  
- Champion confirmation (ai sẽ support)  
- Demo v1.1 (updated từ feedback)  
- C-level presentation deck

📊 **Tracking:**  
Risk Manager có support không? Head of Cards có support không? Top concerns đã address chưa?

---

### Week 14 — Failure Testing & Risk Assessment

🎯 **Mục tiêu:** Tìm failure modes + cập nhật risk section trong proposal

📘 **MUST KNOW:**  
- Adversarial test cases  
- Edge cases tại Bank X  
- Incident response  
- Risk taxonomy cho C-level presentation

💡 **Vì sao:**  
C-level sẽ hỏi “nếu AI sai thì sao?” Phải có câu trả lời cụ thể trước khi họ hỏi.

⚠️ **Chú ý:**  
Phân loại severity rõ ràng. Không làm C-level sợ — làm họ **confident** rằng risks đã được identify và có mitigation.

🔧 **Áp dụng:**  
- Thiết kế 10 test cases (edge cases tại Bank X)  
- Failure mode taxonomy  
- Risk matrix (severity × likelihood)  
- Mitigation plan per risk  
- Incident response draft

📦 **Output:**  
- `failure-test-log.md`  
- `risk-matrix.md`  
- `incident-response-draft.md`

📊 **Tracking:**  
Top 3 failure modes là gì? Mitigation có realistic không?

---

### Week 15 — Proposal Refinement + Pre-approval Alignment

🎯 **Mục tiêu:** Finalize proposal dựa trên feedback + align lần cuối trước C-level meeting

📘 **MUST KNOW:**  
- Executive communication  
- Handling objections  
- Internal budget process  
- Timeline negotiation

💡 **Vì sao:**  
Surprises trong C-level meeting = proposal bị delay. Pre-alignment giảm surprise.

⚠️ **Chú ý:**  
Gặp trực tiếp từng C-level stakeholder 1-on-1 trước meeting nếu có thể.  
Biết objections trước để prepare.

🔧 **Áp dụng:**  
- Update Proposal v2 (từ feedback tuần 13–14)  
- Chuẩn bị objection handling doc  
- Refinement cho Budget justification  
- Timeline negotiation prep

📦 **Output:**  
- Proposal v2 (final)  
- Objection handling doc  
- (v2 gom: Phase 0 approval ask, scope, risk mitigation)

📊 **Tracking:**  
Đã gặp 1-on-1 với từng stakeholder chưa? Objections đã được pre-addressed?

---

### Week 16 — C-Level Presentation & Phase 0 Approval

🎯 **Mục tiêu:** Present proposal lên C-level, xin approve Phase 0 (Discovery & Shadow Testing)

📘 **MUST KNOW:**  
- Executive presentation skills  
- Decision-making framework của Bank X  
- What C-level cares about (ROI, risk, timeline)  
- How to ask for approval

💡 **Vì sao:**  
Phase 0 approval = green light để dùng real data, real users, real workflow. Đây là gate quan trọng nhất.

⚠️ **Chú ý:**  
Ask for **Phase 0 approval**, không phải toàn bộ project.  
Smaller ask = easier approval.  
“Cho chúng tôi 8 tuần shadow testing để validate” dễ được approve hơn “cho chúng tôi 60 tuần và X tỷ VND.”

🔧 **Áp dụng:**  
- Present to C-level  
- Address Q&A  
- Document feedback và conditions  
- Get Phase 0 approval (written hoặc email confirmation)  
- Plan Phase 0 based on approval conditions

📦 **Output:**  
- C-level presentation (delivered)  
- Meeting notes + decisions  
- Phase 0 approval document  
- Phase 0 plan

📊 **Tracking:**  
Approved? Conditions gì? Timeline Phase 0 đã confirm?

---

## PHASE 2 — WORKFLOW & MLOPS DESIGN (Week 17–32)

---

### Week 17 — Multi-role Architecture (Bank X Org Structure)

🎯 **Mục tiêu:** Thiết kế workflow đa vai trò aligned với org structure thật của Bank X

📘 **MUST KNOW:**  
- Bank X org chart (Credit, Risk, Compliance, IT)  
- RBAC  
- Maker-checker principle  
- Existing approval hierarchies  
- Delegation rules

💡 **Vì sao:**  
Inhouse advantage: biết org structure thật, không phải generic banking org.  
AI workflow phải fit vào cách Bank X thực sự vận hành.

⚠️ **Chú ý:**  
Map AI roles vào **existing Bank X job titles**.  
Đừng tạo ra roles mới nếu có thể tránh — giảm friction adoption.

🔧 **Áp dụng:**  
- Bank X role inventory (actual titles)  
- Permission matrix aligned với existing hierarchy  
- Maker-checker implementation  
- Delegation rules (khi senior vắng)

📦 **Output:**  
- `role-architecture-bank-x.md`  
- `permission-matrix.md`  
- `maker-checker-spec.md`

📊 **Tracking:**  
Roles & permission đã được Risk/Compliance validate chưa?

---

### Week 18 — Advanced State Machine + Integration Design

🎯 **Mục tiêu:** State machine phức tạp + retry/timeout cho Bank X's specific integrations

📘 **MUST KNOW:**  
- Bank X's Core Banking reliability  
- CIC API uptime tại Bank X  
- eKYC provider của Bank X  
- Idempotency  
- Dead-letter queue

💡 **Vì sao:**  
Integration lỗi nhưng retry sai có thể gây **double disbursement** / duplicate actions. State machine & idempotency là critical.

⚠️ **Chú ý:**  
Retry disbursement sai → double disbursement.  
Phải có **idempotency keys** và dead-letter queue cho các case fail nhiều lần.

🔧 **Áp dụng:**  
- Thiết kế state machine v2 (bao gồm retry, timeout, error states)  
- Integration retry spec (số lần retry, backoff, fallback)  
- Idempotency design (keys per transaction, per decision)

📦 **Output:**  
- `state-machine-v2.md`  
- `integration-retry-spec.md`  
- `idempotency-design.md`

📊 **Tracking:**  
IT đã review state machine chưa? Có gaps nào với core banking constraints?

---

### Week 19 — Internal ROI Model v2

🎯 **Mục tiêu:** ROI model chi tiết dựa trên real Bank X data từ Phase 0

📘 **MUST KNOW:**  
- Actual manual review cost tại Bank X  
- Actual time-to-decision  
- Actual NPL rate CC  
- Actual team headcount và cost

💡 **Vì sao:**  
Phase 0 đã chạy → có real data để replace assumptions. ROI model lúc này **accurate hơn nhiều** so với Week 4.

🔧 **Áp dụng:**  
- Update damage model với số thật  
- Update break-even scenarios  
- Update cost-benefit analysis (build vs buy)  
- Ghi rõ assumptions, versioning

📦 **Output:**  
- `roi-model-v2-bank-x.md`  
- `assumptions-log-updated.md`

📊 **Tracking:**  
Các C-level metrics (ROI, payback period) đã cải thiện / rõ ràng hơn chưa?

---

### Week 20 — Integration Build (Bank X Systems)

🎯 **Mục tiêu:** Build actual integration với Core Banking, CIC, eKYC tại Bank X

📘 **MUST KNOW:**  
- Bank X's actual API specs  
- Auth methods  
- Data schemas  
- Rate limits  
- Maintenance windows

💡 **Vì sao:**  
Inhouse advantage: IT team có thể provide API docs và support trực tiếp.  
No NDAs, no procurement → nhanh hơn vendor.

⚠️ **Chú ý:**  
- Book dedicated IT support hours.  
- Integration thường mất **2–3x** thời gian estimate.

🔧 **Áp dụng:**  
- Kết nối đến Core Banking API (read/write as needed)  
- Kết nối CIC (pull credit history/score)  
- Kết nối eKYC (identity verification results)  
- Viết integration test cases

📦 **Output:**  
- Integration v1 (Core Banking)  
- Integration v1 (CIC)  
- Integration v1 (eKYC)  
- Integration test report  
  (v2 gom thành: API connections v1 + test report)

📊 **Tracking:**  
Có blocking issue nào từ IT? Test pass rate bao nhiêu?

---

### Week 21 — MVP Build Workflow v2 (Multi-role)

🎯 **Mục tiêu:** Demo workflow đa vai trò với Bank X org structure chạy thật

📘 **MUST KNOW:**  
- RBAC implementation  
- Maker-checker flows  
- Audit requirements

🔧 **Áp dụng:**  
- Build workflow UI theo role (Credit Officer, Supervisor, Risk, Compliance)  
- Áp dụng permission matrix vào UI & API  
- Log audit trail cho mỗi action

📦 **Output:**  
- Workflow demo v2  
- Role-based access demo  
- Audit trail v2

📊 **Tracking:**  
Các role chính đã test và confirm workflow phù hợp chưa?

---

### Week 22 — Internal User Testing #2 + Peer Review

🎯 **Mục tiêu:** Test multi-role workflow với actual Bank X users

💡 **Vì sao:**  
Real users, real feedback. Không cần recruit externally.

🔧 **Áp dụng:**  
- Tổ chức test với Credit Officers, Supervisors, Risk users  
- Peer review với IT, Compliance cho phần flows & audit  
- Ghi issue log, severity, owner

📦 **Output:**  
- Test report v2  
- Issue log  
- Demo v2.1 (nếu kịp fix)

📊 **Tracking:**  
Có blockers adoption nào từ phía users không?

---

### Week 23 — Governance Layer (Bank X Compliance)

🎯 **Mục tiêu:** Governance production-ready: SBV + PDPD + bias monitoring aligned với Bank X policies

📘 **MUST KNOW:**  
- Bank X's existing model governance framework  
- Internal audit requirements  
- SBV reporting obligations của Bank X  
- Existing bias policies

💡 **Vì sao:**  
Inhouse advantage: build on existing Bank X governance, không phải từ đầu.

🔧 **Áp dụng:**  
- Soạn `governance-pack-bank-x.md` (roles, responsibilities, approval flows)  
- Bias assessment (protected attributes, fairness metrics)  
- SBV compliance checklist (reporting, documentation)  
- Model card v1 (purpose, data, performance, limitations)

📦 **Output:**  
- `governance-pack-bank-x.md`  
- Bias assessment  
- SBV compliance checklist (Bank X specific)  
- Model card v1

📊 **Tracking:**  
Internal audit/compliance đã review governance pack chưa?

---

### Week 24 — Stress Test (Bank X Scenarios)

🎯 **Mục tiêu:** Tìm điểm gãy hệ thống với Bank X specific scenarios

📘 **MUST KNOW:**  
- Bank X peak periods (Tết, salary season, campaign periods)  
- Bank X's SLA commitments  
- Existing incident response

🔧 **Áp dụng:**  
Chạy qua **10 Bank X scenarios**:  
1. CIC bulk timeout  
2. Tết application spike (3–5x normal)  
3. Model drift sau economic event  
4. Fraud wave  
5. Core Banking maintenance window  
6. eKYC provider switch  
7. New SBV circular  
8. Data breach attempt  
9. Concurrent approval conflict  
10. System rollback scenario

📦 **Output:**  
- Failure scenario log  
- Runbook v1 (Bank X specific)  
- Mitigation per scenario

📊 **Tracking:**  
Scenario nào là high-risk nhất? Runbook có realistic với khả năng của IT/ops?

---

### Week 25 — Scale Assessment (Bank X Growth)

🎯 **Mục tiêu:** System thinking cho bottlenecks khi Bank X scales CC volume

📘 **MUST KNOW:**  
- Bank X's CC growth targets  
- IT infrastructure roadmap  
- Budget constraints

🔧 **Áp dụng:**  
- Phân tích load vs capacity  
- Tìm bottlenecks: model serving, DB, network, manual review capacity  
- Đề xuất infrastructure roadmap (on-prem vs cloud, horizontal scaling)

📦 **Output:**  
- Scale assessment doc  
- Bottleneck memo  
- Infrastructure recommendation

📊 **Tracking:**  
System có chịu được growth target 2–3 năm không?

---

### Week 26 — MLOps Pipeline & Champion-Challenger Design 🔰

🎯 **Mục tiêu:** Chống thoái hóa mô hình (model drift) và thiết lập cơ chế nâng cấp an toàn

📘 **MUST KNOW:**  
- Drift detection (data drift, concept drift)  
- Champion–Challenger logic  
- Retraining triggers  
- Bank X CAB / change approval process

💡 **Vì sao:**  
Model không đứng yên — behavior khách hàng, economy, policy thay đổi.  
Cần cơ chế **update model an toàn**, không “big bang”.

⚠️ **Chú ý:**  
- Không auto-deploy model mới lên production mà không có **validation + approval**.  
- Champion–Challenger phải có guardrails: ai xem kết quả, trong bao lâu, tiêu chí thắng/thua.

🔧 **Áp dụng:**  
- **Drift Monitoring:** KPI, feature distribution, PSI, stability indices  
- Thiết kế **Champion–Challenger Setup:**
  - Champion = model chính đang chạy  
  - Challenger = model mới (train từ feedback loop)  
  - Chạy song song trên subset traffic hoặc shadow  
- Thiết kế MLOps orchestration: retrain → validate → approval → deploy → monitor

📦 **Output:**  
- `mlops-orchestration-plan.md`  
- `drift-monitoring-spec.md`

📊 **Tracking:**  
Có định nghĩa rõ ràng về khi nào cần retrain? Ai approve việc promote Challenger?

---

### Week 27 — Internal Validation Sprint

🎯 **Mục tiêu:** Validate product-solution fit + Kiểm định độc lập (Model Validation) bởi bộ phận Risk

📘 **MUST KNOW:**  
- Phase 0 results analysis  
- Stakeholder feedback synthesis  
- Go/no-go framework for Phase 1 full deployment  
- Model validation criteria của Risk/Model Validation team

💡 **Vì sao:**  
Dùng Phase 0 data để validate assumptions. Số thật > assumptions.  
Model validation độc lập là requirement trong nhiều bank.

🔧 **Áp dụng:**  
- Phân tích Phase 0 results (performance, operational impact, user feedback)  
- Chuẩn bị bộ hồ sơ model validation cho Risk team  
- Nhận kết luận: Go / No-Go / Go with conditions  
- Soạn Phase 1 deployment plan draft

📦 **Output:**  
- Phase 0 results report  
- Stakeholder validation notes  
- Go/no-go recommendation  
- Phase 1 deployment plan

📊 **Tracking:**  
Risk/Model Validation có approve không? Conditions là gì?

---

### Week 28 — Product Roadmap (6 tháng) + Prioritization

🎯 **Mục tiêu:** Roadmap 6 tháng dựa trên Phase 0 learnings + internal priorities

📘 **MUST KNOW:**  
- Bank X's strategic priorities  
- Resource constraints  
- IT roadmap conflicts  
- Business KPIs

⚠️ **Chú ý:**  
Align roadmap với Bank X's **annual planning cycle**. Timing matters internally.

🔧 **Áp dụng:**  
- Build product roadmap (feature, infra, governance)  
- Prioritization matrix (impact vs effort, risk vs value)  
- Resource request update (headcount, budget)

📦 **Output:**  
- Product roadmap (aligned với Bank X planning)  
- Prioritization matrix  
- Resource request update

📊 **Tracking:**  
Roadmap có được buy-in từ Business, Risk, IT?

---

### Week 29 — Phase 1 Deployment Plan

🎯 **Mục tiêu:** Chi tiết hóa kế hoạch triển khai Phase 1 (Limited Deployment)

📘 **MUST KNOW:**  
- Change management tại Bank X  
- Training requirements  
- Communication plan  
- Rollback procedures  
- Success criteria (measurable)

🔧 **Áp dụng:**  
- Viết Phase 1 deployment plan (scope, timeline, roles)  
- Change management plan (thông điệp, kênh, tần suất)  
- Training plan (ai, khi nào, nội dung gì)  
- Communication plan cho Credit Officers & stakeholders  
- Định nghĩa success criteria rõ ràng (metrics, threshold)

📦 **Output:**  
- Phase 1 deployment plan  
- Change management plan  
- Training plan  
- Communication plan  
- Success criteria

📊 **Tracking:**  
Mọi stakeholder đã clear về “what will happen when”?

---

### Week 30 — Internal Case Study v1 + Progress Report

🎯 **Mục tiêu:** Document Phase 0 results như internal case study + progress report cho C-level

📘 **MUST KNOW:**  
- Executive reporting  
- Data storytelling  
- Impact quantification

⚠️ **Chú ý:**  
Case study này phục vụ 2 mục đích:  
1. Internal reporting  
2. Future packaging potential nếu muốn sell externally.

🔧 **Áp dụng:**  
- Viết Internal case study v1 (problem → solution → results)  
- Chuẩn bị C-level progress report (one-pager hoặc slide deck)  
- Gắn số thật vào ROI, NPL, time-to-decision, manual review rate

📦 **Output:**  
- Internal case study v1  
- C-level progress report  
- Phase 1 approval request

📊 **Tracking:**  
C-level phản hồi thế nào về kết quả Phase 0?

---

### Week 31 — Internal Review + Approvals

🎯 **Mục tiêu:** Get approvals cho Phase 1 từ Risk, Compliance, IT, Business

🔧 **Áp dụng:**  
- Tổ chức review meetings với từng bên  
- Chốt final deployment checklist  
- Build training materials v1

📦 **Output:**  
- Phase 1 approval (từ tất cả stakeholders)  
- Final deployment checklist  
- Training materials v1

📊 **Tracking:**  
Có bên nào chưa sign-off? Blockers?

---

### Week 32 — Buffer + Health Week

🎯 **Mục tiêu:** Nghỉ chủ động + dọn nợ kỹ thuật + chuẩn bị Phase 3

⚠️ **Chú ý:**  
Không mở feature mới. **Rest + cleanup + prepare** cho deployment phase.

🔧 **Áp dụng:**  
- Fix tech debt, doc debt, process debt  
- Improve tooling nhỏ giúp team nhanh hơn  
- Retro mini sau Phase 2

📦 **Output:**  
- Tech debt cleanup log  
- Updated documentation  
- Phase 3 readiness checklist

📊 **Tracking:**  
Team burnout level? Tech debt đã giảm chưa?

---

## PHASE 3 — INTERNAL DEPLOYMENT & FEEDBACK LOOP (Week 33–48)

---

### Week 33 — Competitive Positioning (Internal Context)

🎯 **Mục tiêu:** Định vị AI-Native CRDS so với alternatives tại Bank X (Buy vs Build)

📘 **MUST KNOW:**  
- Current tools tại Bank X  
- Buy vs build analysis  
- Vendor alternatives (FICO, local vendors)  
- Status quo (manual process)

💡 **Vì sao:**  
IT hoặc Procurement có thể suggest “mua vendor có sẵn”.  
Phải có câu trả lời rõ ràng tại sao inhouse build tốt hơn trong context Bank X.

🔧 **Áp dụng:**  
- Build vs buy analysis (cost, control, speed, compliance)  
- Vendor comparison matrix  
- Inhouse advantages doc (data, customizability, IP)

📦 **Output:**  
- Build vs buy analysis (Bank X specific)  
- Vendor comparison matrix  
- Inhouse advantages doc

📊 **Tracking:**  
C-level/IT có còn push phương án vendor không?

---

### Week 34 — Training & Change Management Prep

🎯 **Mục tiêu:** Chuẩn bị training materials và user guides cho Credit Officers

📘 **MUST KNOW:**  
- Adult learning principles  
- Change resistance patterns  
- Internal communication culture

🔧 **Áp dụng:**  
- Xây training curriculum theo từng role  
- Viết user guides per role  
- Soạn FAQ document (đặc biệt là liên quan đến job security, trách nhiệm pháp lý)  
- Build change management playbook (thông điệp, ambassadors)

📦 **Output:**  
- Training curriculum  
- User guides per role  
- Change management playbook  
- FAQ document

📊 **Tracking:**  
Credit Officers có được thông tin đủ sớm và đủ rõ chưa?

---

### Week 35 — Audit Trail Design (Banking Grade)

🎯 **Mục tiêu:** Audit trail đủ cho SBV inspection + Bank X internal audit

📘 **MUST KNOW:**  
- Bank X audit requirements  
- SBV inspection history  
- Immutability  
- Traceability  
- Retention policy

🔧 **Áp dụng:**  
- Thiết kế audit trail spec (20+ fields: input, features, model version, score, decision, override, user, timestamps…)  
- Export format cho SBV report  
- Replay functionality spec (khả năng tái hiện lại decision)  
- Retention policy align với Bank X / SBV

📦 **Output:**  
- Audit trail spec (20+ fields)  
- Export format cho SBV report  
- Replay functionality spec  
- Retention policy (Bank X aligned)

📊 **Tracking:**  
Internal audit đã review audit design chưa?

---

### Week 36 — Compliance Simulation (PDPD + SBV + Bank X Internal)

🎯 **Mục tiêu:** Diễn tập compliance scenarios tại Bank X

📘 **MUST KNOW:**  
- Bank X's compliance team processes  
- PDPD response procedures  
- SBV audit history của Bank X

🔧 **Áp dụng:**  
Chạy **5 scenarios tại Bank X:**  
1. Customer data deletion request (PDPD)  
2. SBV on-site audit  
3. Data breach notification  
4. Internal audit request  
5. Model bias complaint từ customer

📦 **Output:**  
- Compliance simulation doc  
- Playbook per scenario (Bank X specific)  
- PDPD response templates

📊 **Tracking:**  
Compliance team cảm thấy mức độ readiness thế nào?

---

### Week 37 — Phase 1 Kickoff: Shadow Testing (Week 1)

🎯 **Mục tiêu:** Bắt đầu shadow testing — AI chạy song song, không ảnh hưởng quyết định thật

📘 **MUST KNOW:**  
- Shadow testing methodology  
- Parallel run setup  
- Data collection  
- Daily monitoring  
- Communication với Credit Officers

💡 **Vì sao:**  
Shadow testing = AI học từ real data mà **không có risk**.  
Credit Officers học làm quen với AI output mà **không có áp lực**.

⚠️ **Chú ý:**  
Communicate rõ với Credit Officers:  
“AI đang học, chưa quyết định. Bạn vẫn quyết định như bình thường.”

🔧 **Áp dụng:**  
- Setup shadow testing environment (live)  
- Bật logging đầy đủ (scores, decisions, manual decisions)  
- Build daily monitoring dashboard  
- Chuẩn bị briefing materials cho Credit Officers

📦 **Output:**  
- Shadow testing environment (live)  
- Daily monitoring dashboard  
- Credit Officer briefing materials  
- Daily results log

📊 **Tracking:**  
Integration working với real data? Credit Officers comfortable? First results?

---

### Week 38 — Shadow Testing: Week 2

🎯 **Mục tiêu:** Monitor shadow testing, collect data, identify issues

🔧 **Áp dụng:**  
- Thu thập metrics: alignment giữa AI recommendation vs manual decision  
- Ghi issue log (data issues, UX issues, model issues)  
- Điều chỉnh nhỏ nếu cần (không thay đổi lớn giữa tuần)

📦 **Output:**  
- Week 2 shadow testing report  
- Issue log  
- Model performance vs manual baseline  
- Iteration log

📊 **Tracking:**  
Có pattern nào rõ ràng về chỗ AI disagree với humans?

---

### Week 39 — Shadow Testing: Week 3 + Mid-review

🎯 **Mục tiêu:** Mid-point review của shadow testing + decision về có tiếp tục không

🔧 **Áp dụng:**  
- Phân tích 3 tuần data  
- Tổ chức mid-review với Risk, Business, IT  
- Đề xuất điều chỉnh threshold, feature, UX nếu cần  
- Quyết định: tiếp tục thêm 1 tuần, kéo dài shadow, hoặc điều chỉnh scope

📦 **Output:**  
- Mid-point analysis  
- Go/no-go for limited deployment  
- Adjustments needed

📊 **Tracking:**  
Stakeholders đã đủ tin để chuyển sang limited deployment chưa?

---

### Week 40 — Shadow Testing: Week 4 + Results Analysis

🎯 **Mục tiêu:** Analyze shadow testing results, prepare limited deployment proposal

🔧 **Áp dụng:**  
- Hoàn thiện Shadow testing final report  
- AI vs manual comparison (loss, approval rate, time)  
- Chuẩn bị limited deployment proposal (scope, risk mitigation)

📦 **Output:**  
- Shadow testing final report  
- AI vs manual comparison  
- Limited deployment proposal  
- Updated success criteria

📊 **Tracking:**  
AI đang outperform manual ở đâu? Underperform ở đâu?

---

### Week 41 — Phase 2 Kickoff: Limited Deployment

🎯 **Mục tiêu:** AI bắt đầu recommend decisions, Credit Officers review và approve/override

📘 **MUST KNOW:**  
- Limited deployment scope (1 product line, subset of applications)  
- Override governance  
- Escalation procedures  
- Real-time monitoring

⚠️ **Chú ý:**  
Start với **low-risk, high-confidence** cases chỉ.  
Không để AI touch complex cases ngay.

🔧 **Áp dụng:**  
- Enable AI recommendation cho subset khách hàng/hồ sơ  
- Track override rate, reasons  
- Build real-time monitoring dashboard  
- Daily stakeholder updates trong tuần đầu

📦 **Output:**  
- Limited deployment live  
- Real-time monitoring dashboard  
- Override rate tracking  
- Daily stakeholder updates

📊 **Tracking:**  
Override rate là bao nhiêu? Lý do override chính?

---

### Week 42 — Limited Deployment: Monitoring & Iteration

🎯 **Mục tiêu:** Monitor, collect feedback, iterate nhanh trên model

🔧 **Áp dụng:**  
- Weekly performance reports  
- User feedback synthesis (Credit Officers, Risk)  
- Model adjustments (nếu cần)  
- Communicate thay đổi rõ ràng

📦 **Output:**  
- Weekly performance reports  
- User feedback synthesis  
- Model adjustments  
- Stakeholder updates

📊 **Tracking:**  
Performance có ổn định / cải thiện không? Adoption tăng hay giảm?

---

### Week 43 — Limited Deployment: Results Analysis

🎯 **Mục tiêu:** Analyze limited deployment results, prepare full deployment proposal

🔧 **Áp dụng:**  
- So sánh kết quả limited deployment với baseline & shadow test  
- Tính lại ROI với real numbers  
- Soạn full deployment proposal (scope, timeline, risk)

📦 **Output:**  
- Limited deployment results report  
- Full deployment proposal  
- Updated ROI với real numbers

📊 **Tracking:**  
Risk & Business có đồng thuận để scale full không?

---

### Week 44 — Full Deployment Approval

🎯 **Mục tiêu:** Present kết quả Phase 2 và xin approve full deployment

🔧 **Áp dụng:**  
- C-level presentation (Phase 2 results)  
- Trình bày rõ ROI, risk, incident history, mitigation  
- Xin full deployment approval

📦 **Output:**  
- C-level presentation (Phase 2 results)  
- Full deployment approval  
- Full deployment plan (chi tiết hơn)

📊 **Tracking:**  
Approval có điều kiện (conditions) gì?

---

### Week 45 — Phase 3 Kickoff: Full Deployment

🎯 **Mục tiêu:** AI-Native CRDS live toàn bộ CC origination workflow tại Bank X

🔧 **Áp dụng:**  
- Rollout full deployment theo plan  
- Đảm bảo tất cả users được train  
- Kích hoạt full monitoring & incident response on-call

📦 **Output:**  
- Full deployment live  
- All users trained  
- Full monitoring active  
- Incident response on-call

📊 **Tracking:**  
Có incident major nào trong 1–2 tuần đầu?

---

### Week 46 — Full Deployment: Stabilization

🎯 **Mục tiêu:** Stabilize full deployment, address issues, optimize

🔧 **Áp dụng:**  
- Collect issues từ users & monitoring  
- Fix high-priority bugs / UX issues  
- Tối ưu performance hệ thống  
- Chạy user satisfaction survey

📦 **Output:**  
- Stabilization report  
- Performance optimization log  
- User satisfaction survey

📊 **Tracking:**  
User satisfaction score? Major pain points còn lại?

---

### Week 47 — Impact Measurement & Feedback Loop Integration 🔰

🎯 **Mục tiêu:** Đo impact thật 30 ngày sau full deployment + thiết lập feedback loop / ground truth để nuôi mô hình

📘 **MUST KNOW:**  
- Feedback loop methodology  
- Labeling ground truth (default / non-default, delinquency)  
- Statistical significance  
- Lag giữa quyết định & outcome (e.g., 30–90 ngày)

💡 **Vì sao:**  
AI-Native = system **học từ thực tế**. Không có ground truth feedback loop → model sẽ chết dần.

🔧 **Áp dụng:**  
- Thu thập dữ liệu repayment / default của cohort sau full deployment  
- Định nghĩa schema cho ground truth labels  
- Liên kết decision logs ↔ outcomes  
- Thiết kế `feedback-loop-schema.md` + process vận hành (ai cập nhật, khi nào)

📦 **Output:**  
- 30-day impact report  
- Actual vs projected comparison  
- Lessons learned  
- `feedback-loop-schema.md`  
- Next optimization priorities

📊 **Tracking:**  
Đã có đủ data để retrain / recalibrate chưa?

---

### Week 48 — Buffer + Health Week #2

🎯 **Mục tiêu:** Rest + optimize + prepare Phase 4

🔧 **Áp dụng:**  
- Cleanup nhỏ, doc, monitoring tuning  
- Retro Phase 3  
- Chuẩn bị cho scale & lifecycle maturity (Phase 4)

📦 **Output:**  
- Phase 3 retrospective  
- Updated backlog cho Phase 4

📊 **Tracking:**  
Team health? Remaining critical risks?

---

## PHASE 4 — SCALE & LIFECYCLE MATURITY (Week 49–60)

---

### Week 49 — Scale Assessment: Bank X Full Portfolio

🎯 **Mục tiêu:** Expand AI-Native CRDS sang segments và products mới tại Bank X

📘 **MUST KNOW:**  
- Bank X's product portfolio  
- Next highest pain point  
- Data availability per segment  
- Resource capacity

🔧 **Áp dụng:**  
Xem xét **Expansion options (theo thứ tự ưu tiên):**
1. CC Salaried → CC Self-employed (cùng product, khác segment)  
2. CC → Consumer Loan (cùng segment, khác product)  
3. Origination → Early Warning System (upsell logic)  
4. Retail → SME (khác segment hoàn toàn)

📦 **Output:**  
- Expansion roadmap  
- Next segment business case  
- Resource request for expansion

📊 **Tracking:**  
Segment nào cho incremental ROI cao nhất?

---

### Week 50 — Early Warning System: Business Case

🎯 **Mục tiêu:** Evaluate Early Warning System như product mở rộng tự nhiên từ Origination Scoring

💡 **Vì sao:**  
Data từ origination scoring feeds trực tiếp vào EWS.  
NPL đang đau → EWS là natural upsell.

🔧 **Áp dụng:**  
- Phân tích data availability cho EWS  
- Xác định use cases (pre-delinquency alerts, cross-sell)  
- Soạn EWS business case & proposal

📦 **Output:**  
- EWS business case  
- Data availability assessment  
- EWS proposal (nếu viable)

📊 **Tracking:**  
Business có quan tâm & willing sponsor EWS không?

---

### Week 51 — Internal Thought Leadership

🎯 **Mục tiêu:** Document và share learnings nội bộ — position AI-Native PM role

📘 **MUST KNOW:**  
- Internal knowledge sharing  
- Building AI culture at Bank X  
- Personal brand as AI-Native PM

💡 **Vì sao:**  
Thought leadership nội bộ = được nhìn nhận là AI expert, mở cơ hội cho các dự án tiếp theo.

🔧 **Áp dụng:**  
- Internal presentation/workshop về AI-Native CRDS learnings  
- Document methodology cho Bank X knowledge base  
- Mentor colleagues về AI product thinking

📦 **Output:**  
- Internal presentation  
- Methodology documentation  
- Knowledge sharing sessions

📊 **Tracking:**  
Có bao nhiêu team khác bắt đầu chủ động reach out về AI projects?

---

### Week 52–53 — Packaging Assessment (Optionality)

🎯 **Mục tiêu:** Đánh giá khả năng đóng gói AI-Native CRDS thành SaaS bán bên ngoài

📘 **MUST KNOW:**  
- Differentiators từ Bank X implementation  
- IP ownership (Bank X vs personal)  
- Regulatory constraints khi commercialize  
- Market opportunity ngoài Bank X

💡 **Vì sao:**  
Nếu AI-Native CRDS proven tại Bank X → có real case study, real data, real ROI → strong foundation cho SaaS play.

⚠️ **Chú ý:**  
Phải clarify IP ownership với Bank X trước bất kỳ commercial step nào.  
Đây là câu hỏi legal và HR.

🔧 **Áp dụng:**  
- IP ownership assessment  
- Packaging feasibility analysis (multi-tenant? configurable rules? data isolation?)  
- Market opportunity reassessment (với Bank X as proof point)  
- Decision: pursue SaaS or focus inhouse

📦 **Output:**  
- IP ownership memo  
- Packaging feasibility report  
- Go/no-go decision for SaaS optionality

📊 **Tracking:**  
IP / legal risk level? Bank X stance?

---

### Week 54 — 90-Day Impact Report (C-Level)

🎯 **Mục tiêu:** 90-day post full deployment impact report cho C-level

🔧 **Áp dụng:**  
- Thu thập impact metrics 90 ngày  
- So sánh với 30-day & baseline  
- Validate ROI  
- Đề xuất next phase (expansion, infra, DS team)

📦 **Output:**  
- 90-day impact report (actual numbers)  
- ROI validation  
- Next phase recommendations  
- Budget request for expansion

📊 **Tracking:**  
ROI có đạt / vượt kỳ vọng ban đầu?

---

### Week 55–56 — Next Segment Deployment (nếu approved)

🎯 **Mục tiêu:** Apply learnings từ CC Salaried deployment cho segment tiếp theo

🔧 **Áp dụng:**  
- Reuse components (features, workflows, infra)  
- Adapt thresholds, rules cho segment mới  
- Train & onboard users mới

📦 **Output:**  
- Next segment deployment  
- Reuse rate assessment (vs CC Salaried)  
- Onboarding playbook update

📊 **Tracking:**  
Bao nhiêu phần trăm code / components được reuse?

---

### Week 57 — Model Lifecycle Maturity & CI/CD for ML 🔰

🎯 **Mục tiêu:** Mature governance framework — từ “đang build” sang “production grade” với CI/CD for ML

📘 **MUST KNOW:**  
- Model risk management (MRM) best practices  
- CAB process  
- SBV model validation requirements  
- Long-term monitoring plan  
- CI/CD for ML patterns

💡 **Vì sao:**  
Khi hệ thống sống lâu, rủi ro model & ops tăng.  
Cần khung lifecycle rõ: **build → validate → deploy → monitor → retire**.

🔧 **Áp dụng:**  
- Hoàn thiện **Model governance framework v2** (roles, approvals, documentation, periodic review)  
- Thiết kế & document **ML lifecycle runbook**:  
  - Data ingestion  
  - Feature store  
  - Training pipeline  
  - Validation  
  - Deployment (canary / blue-green / shadow)  
  - Monitoring & alerts  
  - Decommissioning

📦 **Output:**  
- `model-governance-v2.md`  
- `ml-lifecycle-runbook.md`

📊 **Tracking:**  
MRM / Risk có approve lifecycle framework chưa?

---

### Week 58 — AI-Native PM Portfolio Documentation

🎯 **Mục tiêu:** Document toàn bộ journey như AI-Native PM portfolio

📘 **MUST KNOW:**  
- Portfolio writing  
- Case study structure  
- Outcome-first narrative  
- Showing AI-native thinking

💡 **Vì sao:**  
60 tuần build AI system từ 0 → production tại bank = strong portfolio evidence cho AI-Native PM positioning.

🔧 **Áp dụng:**  
- Viết AI-Native PM case study (e.g., trên website cá nhân)  
- Document methodology (framework, mental models)  
- Personal positioning statement

📦 **Output:**  
- AI-Native PM case study  
- Methodology documentation  
- Personal positioning statement  
- Portfolio update

📊 **Tracking:**  
Portfolio có kể rõ “so what / impact” hay chỉ liệt kê tasks?

---

### Week 59 — Internal Documentation & Knowledge Transfer

🎯 **Mục tiêu:** Đảm bảo system có thể run mà không phụ thuộc 100% vào bạn

🔧 **Áp dụng:**  
- Hoàn thiện system documentation (architecture, configs, ops)  
- Runbook cho operations team  
- Training materials v3 (updated)  
- Handover plan nếu cần

📦 **Output:**  
- Complete system documentation  
- Runbook cho operations team  
- Training materials v3  
- Handover plan

📊 **Tracking:**  
Nếu bạn nghỉ 1–2 tháng, system có chạy ổn không?

---

### Week 60 — Retrospective + Next 60 Weeks Plan

🎯 **Mục tiêu:** Tổng kết 60 tuần + kế hoạch tiếp theo

📘 **MUST KNOW:**  
- Retrospective methodology  
- Strategic planning  
- Career planning as AI-Native PM

🔧 **Áp dụng:**  
- Retro: what worked / what failed / what learned / what's next  
- 60-week plan update (next phase)  
- Personal career assessment  
- SaaS optionality decision (pursue hoặc not)  
- Bank X relationship assessment

📦 **Output:**  
- Retrospective document  
- Next 60-week plan  
- SaaS optionality decision  
- Personal AI-Native PM roadmap

📊 **Tracking:**  
Bạn muốn hệ thống & sự nghiệp AI-Native PM của mình ở đâu sau 60 tuần tiếp theo?

---

## GHI CHÚ TRIỂN KHAI (giữ từ bản gốc, tinh chỉnh theo v2)

**1. Inhouse Advantage — Tận dụng tối đa:**
- Access real data ngay từ đầu (với proper governance, DPIA)  
- Real users available cho testing  
- IT support available  
- Regulatory context đã biết  
- Stakeholder relationships đã có  

**2. Inhouse Challenge — Cần manage:**
- Internal politics quan trọng hơn product quality đôi khi  
- Change management phức tạp hơn khi affect đồng nghiệp  
- IP ownership cần clarify sớm  
- Career risk nếu project fail visible hơn  

**3. Approval Gates bắt buộc:**
```
Week 16: Phase 0 approval (C-level)
Week 31: Phase 1 approval (all stakeholders)
Week 44: Full deployment approval (C-level)
Week 54: Expansion approval (C-level)
```

**4. SaaS Optionality:**  
Giữ option mở. Build inhouse với architecture có thể package.  
Document everything như thể sẽ bán sau này.  
Nhưng không distract khỏi inhouse deployment goal trong 60 tuần đầu.

**5. AI-Native PM Positioning:**  
Mỗi deliverable trong roadmap này là evidence cho AI-Native PM capability.  
Document journey. Share learnings. Build reputation song song với build product.

**6. Human-in-the-Loop — Không thể thỏa hiệp:**  
SBV requirement. Bank X compliance requirement.  
AI chỉ là support — Credit Officer vẫn là final decision maker.  
Không được thay đổi nguyên tắc này dù bị pressure từ business để “automate more.”

**7. MLOps & Lifecycle:**  
- Champion–Challenger, drift monitoring, feedback loop, CI/CD for ML là core.  
- Không chỉ “làm xong model” mà phải duy trì **system sống, học, và an toàn**.

