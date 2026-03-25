import { useState, useEffect, useRef } from "react";

// ─── DOCS DATA ────────────────────────────────────────────────────────────────
const DOCS_TREE = [
  {
    id: "phase-1", label: "Phase 1 — Foundation", weeks: "Week 1–16",
    files: [
      { id: "p1-overview", label: "Overview & Mục tiêu" },
      { id: "p1-w1", label: "Week 1 — Problem Framing" },
      { id: "p1-w2", label: "Week 2 — Regulatory Landscape" },
      { id: "p1-w3", label: "Week 3 — Data Landscape" },
      { id: "p1-w4", label: "Week 4 — Damage Model" },
      { id: "p1-w5", label: "Week 5 — Decision Architecture" },
      { id: "p1-w6", label: "Week 6 — Threshold Design" },
      { id: "p1-w7", label: "Week 7 — KPI Tree" },
      { id: "p1-w8", label: "Week 8 — Workflow Modeling" },
      { id: "p1-w9", label: "Week 9 — Human-AI Interaction" },
      { id: "p1-w10", label: "Week 10 — Tech Stack & DPIA 🔰" },
      { id: "p1-w11", label: "Week 11 — Internal Proposal" },
      { id: "p1-w12", label: "Week 12 — MVP Build v1" },
      { id: "p1-w16", label: "Week 16 — C-Level Presentation" },
    ]
  },
  {
    id: "phase-2", label: "Phase 2 — MLOps & Workflow", weeks: "Week 17–32",
    files: [
      { id: "p2-overview", label: "Overview & Mục tiêu" },
      { id: "p2-w17", label: "Week 17 — Multi-role Architecture" },
      { id: "p2-w18", label: "Week 18 — State Machine" },
      { id: "p2-w20", label: "Week 20 — Integration Build" },
      { id: "p2-w23", label: "Week 23 — Governance Layer" },
      { id: "p2-w24", label: "Week 24 — Stress Test Scenarios" },
      { id: "p2-w26", label: "Week 26 — MLOps & Champion-Challenger 🔰" },
      { id: "p2-w27", label: "Week 27 — Internal Validation" },
      { id: "p2-w32", label: "Week 32 — Buffer & Health Week" },
    ]
  },
  {
    id: "phase-3", label: "Phase 3 — Deployment", weeks: "Week 33–48",
    files: [
      { id: "p3-overview", label: "Overview & Mục tiêu" },
      { id: "p3-w35", label: "Week 35 — Audit Trail Design" },
      { id: "p3-w36", label: "Week 36 — Compliance Simulation" },
      { id: "p3-w37", label: "Week 37–40 — Shadow Testing" },
      { id: "p3-w41", label: "Week 41 — Limited Deployment" },
      { id: "p3-w45", label: "Week 45 — Full Deployment" },
      { id: "p3-w47", label: "Week 47 — Impact & Feedback Loop 🔰" },
    ]
  },
  {
    id: "phase-4", label: "Phase 4 — Scale & Maturity", weeks: "Week 49–60",
    files: [
      { id: "p4-overview", label: "Overview & Mục tiêu" },
      { id: "p4-w49", label: "Week 49 — Scale Assessment" },
      { id: "p4-w50", label: "Week 50 — Early Warning System" },
      { id: "p4-w52", label: "Week 52–53 — Packaging Assessment" },
      { id: "p4-w57", label: "Week 57 — ML Lifecycle & CI/CD 🔰" },
      { id: "p4-w58", label: "Week 58 — PM Portfolio" },
      { id: "p4-w60", label: "Week 60 — Retrospective & Next Plan" },
    ]
  }
];

const DOCS_CONTENT = {
  "p1-overview": `# Phase 1 — Foundation & Internal Proposal

**Tuần 1–16 | Mục tiêu: Từ zero đến C-level approval**

---

## Tổng quan

Phase 1 đặt nền tảng cho toàn bộ dự án AI-Native CRDS tại Bank X. Đây là giai đoạn quan trọng nhất — không có Phase 1 tốt, mọi thứ sau sẽ build trên nền bất ổn.

## Hai nhóm deliverable chính

### 1. Discovery & Analysis (Week 1–10)
Hiểu rõ context nội bộ Bank X trước khi viết 1 dòng code:
- **Problem framing** — xác định đúng pain point, đo được bằng tiền
- **Regulatory mapping** — NĐ13, TT13, NĐ94/2025, Basel II
- **Data landscape** — Core Banking, CIC, eKYC quality
- **Damage model** — PD × LGD × EAD, break-even analysis
- **Decision architecture** — 5-7 states, SLA per state
- **Tech stack & DPIA** — privacy by design từ ngày đầu

### 2. Proposal & Demo (Week 11–16)
Thuyết phục C-level với bằng chứng cụ thể:
- **Internal Formal Proposal** — 7 files, C-level ready
- **MVP Demo v1** — chạy end-to-end với synthetic data
- **Usability testing** — 3-5 Credit Officers
- **Stakeholder alignment** — Risk Manager + Head of Cards
- **C-Level Presentation** — xin Phase 0 approval

## Approval Gate

\`\`\`
Week 16: Phase 0 approval từ C-level
Ask: 8 tuần shadow testing để validate
Output: Written/email confirmation
\`\`\`

## Key Principle

> Inhouse PM có lợi thế lớn nhất ở Phase 1: biết context, có access data, có relationship với stakeholders. Tận dụng tối đa.

## Outputs chính

| Tuần | File | Mô tả |
|------|------|--------|
| W1 | problem-brief.md | Internal problem statement với số nội bộ |
| W2 | regulatory-mapping.md | Map toàn bộ regulatory constraints |
| W3 | data-landscape-bank-x.md | Data quality + feature availability |
| W4 | damage-model-bank-x.md | EL = PD × LGD × EAD, break-even |
| W10 | dpia-report-v1.md | DPIA theo NĐ13 — bắt buộc |
| W11 | Proposal v1 (7 files) | C-level ready proposal pack |
| W12 | MVP Demo v1 | Working demo với synthetic data |
| W16 | Phase 0 Approval | Written confirmation từ C-level |
`,

  "p1-w1": `# Week 1 — Problem Framing (Internal Context)

**🎯 Mục tiêu:** Xác định đúng problem tại Bank X + outcome đo được bằng tiền

---

## MUST KNOW

- Current state của Bank X (quy trình hiện tại, tools đang dùng, pain points nội bộ)
- Root cause vs symptom
- Decision frequency tại Bank X
- Cost per error (approve nhầm = loss, reject nhầm = lost revenue)

## Tại sao quan trọng

Inhouse proposal cần **số liệu nội bộ**, không chỉ industry benchmark.

> "Chúng ta đang mất bao nhiêu" thuyết phục hơn "industry đang mất bao nhiêu".

## ⚠️ Cảnh báo

Nếu chưa có số liệu nội bộ chính xác → thừa nhận gap và đề xuất Discovery Phase.

**Không bịa số.**

## Áp dụng

1. Use case shortlist (3–5 trong credit lifecycle) → chọn 1
2. Current state mapping (as-is process)
3. Pain point inventory từ team nội bộ
4. Industry benchmark để triangulate nếu thiếu internal data

## Outputs

| File | Nội dung |
|------|----------|
| \`use-case-shortlist.md\` | 3-5 use cases đã evaluate |
| \`problem-brief.md\` | Internal version — có số nội bộ |
| \`current-state-assessment.md\` | As-is process documentation |
| \`decision-frequency.md\` | Bao nhiêu decisions/ngày, cost/decision |

## Tracking Checklist

- [ ] Có ít nhất 1 internal data point chưa?
- [ ] Pain point đã được confirm bởi ≥1 colleague?
- [ ] Use case cuối cùng đã chọn chưa?
`,

  "p1-w2": `# Week 2 — VN Regulatory Landscape (Bank X Specific)

**🎯 Mục tiêu:** Map regulatory constraints ảnh hưởng đến AI-Native CRDS tại Bank X cụ thể

---

## Regulatory Framework

### Thông tư 13/2018/TT-NHNN
Quy định về hệ thống kiểm soát nội bộ. Ảnh hưởng đến audit trail và model governance requirements.

### Nghị định 13/2023/NĐ-CP (PDPD)
Bảo vệ dữ liệu cá nhân. **Critical cho AI-Native CRDS** vì hệ thống xử lý PII của khách hàng.

Yêu cầu chính:
- Consent management
- Right to explanation (quyết định tự động)
- Data deletion request
- DPIA (Đánh giá tác động xử lý dữ liệu)

### Nghị định 94/2025 (Sandbox Credit Scoring)
Cho phép thử nghiệm credit scoring AI trong sandbox. **Cơ hội tốt cho Bank X** nếu muốn regulatory cover.

### Thông tư 41/2016/TT-NHNN (Basel II)
Capital adequacy requirements. AI model phải đảm bảo không làm tăng rủi ro vốn bất ngờ.

## ⚠️ Key Action

Kết nối với **Compliance Officer** của Bank X ngay từ tuần này.

> Họ là **ally quan trọng**, không phải blocker nếu được involve sớm.

## Outputs

| File | Nội dung |
|------|----------|
| \`regulatory-mapping.md\` | Toàn bộ regulatory constraints mapped |
| \`compliance-gap-analysis.md\` | Current state vs AI requirements |
| \`pdpd-impact-bank-x.md\` | PDPD impact assessment cụ thể |
`,

  "p1-w10": `# Week 10 — Tech Stack & DPIA 🔰

**🎯 Mục tiêu:** Đảm bảo tuân thủ NĐ13/2023 ngay từ khâu thiết kế + hiểu rõ tech stack Bank X

---

## DPIA — Đánh Giá Tác Động Xử Lý Dữ Liệu Cá Nhân

DPIA là **bắt buộc** theo Nghị định 13/2023/NĐ-CP khi dùng AI để ra quyết định tự động ảnh hưởng đến quyền lợi người dùng.

## Data Flow trong AI-Native CRDS

\`\`\`
Khách hàng nộp đơn
      ↓
eKYC (identity verification) — PII
      ↓
CIC pull (credit history) — Financial PII
      ↓
Core Banking (transaction history) — Financial PII
      ↓
Feature Engineering — Derived data
      ↓
AI Model Scoring — Decision
      ↓
Credit Officer Review — Human oversight
      ↓
Lưu trữ Audit Log — Encrypted, access-controlled
\`\`\`

## Privacy by Design Requirements

- [ ] Cơ chế rút lại consent
- [ ] Right to explanation cho quyết định tự động
- [ ] Data minimization — chỉ collect data cần thiết
- [ ] Retention policy — xóa data sau X ngày

## ⚠️ Critical Warning

**KHÔNG dùng real customer data cho demo** trước khi DPIA + data governance được approve.

## Outputs

| File | Nội dung |
|------|----------|
| \`tech-stack-bank-x.md\` | Documented tech stack |
| \`data-flow-diagram.md\` | PII marked, end-to-end flow |
| \`dpia-report-v1.md\` | DPIA theo mẫu NĐ13 |
| \`pdpd-compliance-checklist.md\` | Checklist tuân thủ |
`,

  "p2-overview": `# Phase 2 — Workflow Design & MLOps

**Tuần 17–32 | Mục tiêu: Từ approval đến production-ready system**

---

## Tổng quan

Phase 2 biến approval từ C-level thành một hệ thống sẵn sàng deploy. Đây là giai đoạn kỹ thuật nặng nhất — MLOps, integrations, governance.

## Các nhóm công việc chính

### 1. Workflow Engineering (Week 17–22)
- **Multi-role architecture** — aligned với org structure Bank X
- **State machine v2** — retry, timeout, idempotency
- **Integration build** — Core Banking, CIC, eKYC

### 2. Governance & Compliance (Week 23–24)
- **Governance layer** — SBV + PDPD + Bank X internal
- **Bias assessment** — fairness metrics
- **Stress testing** — 10 Bank X specific scenarios

### 3. MLOps & Champion-Challenger (Week 26)
- **Drift monitoring** — PSI, stability indices
- **Champion-Challenger setup** — safe model updates

## Key Principle: Champion-Challenger

\`\`\`
Champion = model đang chạy production
Challenger = model mới (trained từ feedback data)

Không auto-deploy Challenger mà không có:
  1. Validation metrics vượt Champion
  2. Risk team review + CAB approval
  3. Rollback plan ready
\`\`\`

## Approval Gate

\`\`\`
Week 31: Phase 1 approval từ tất cả stakeholders
  Risk / Compliance / IT / Business
\`\`\`
`,

  "p2-w26": `# Week 26 — MLOps Pipeline & Champion-Challenger 🔰

**🎯 Mục tiêu:** Chống model drift + thiết lập cơ chế nâng cấp model an toàn

---

## Drift Monitoring

| Metric | Ý nghĩa | Alert threshold |
|--------|---------|-----------------|
| PSI (Population Stability Index) | Input feature drift | PSI > 0.2 → investigate |
| KS Score trend | Model discrimination | Drop >5% → retrain |
| Approval rate | Output distribution | Change >10% → investigate |
| Override rate | Credit Officer disagreement | >30% → model issue |

## Champion-Challenger Flow

\`\`\`
Production Traffic
      ↓
  90% Champion  +  10% Challenger
      ↓
  Comparison Dashboard (Risk review)
      ↓
  Promote? → CAB Approval → Deploy
\`\`\`

## MLOps Orchestration Pipeline

1. Data ingestion — daily batch từ Core Banking + CIC
2. Drift check — PSI per feature, KS on score distribution
3. Trigger — if drift > threshold → auto-create retrain ticket
4. Training — retrain với sliding window data (24 months)
5. Validation — backtesting, fairness check, vs Champion
6. Risk review — Risk team review validation report
7. CAB approval — Change Approval Board sign-off
8. Deploy Challenger — canary (10% traffic)
9. Monitor 2 weeks — compare Champion vs Challenger
10. Promote or rollback — based on metrics

## Outputs

| File | Nội dung |
|------|----------|
| \`mlops-orchestration-plan.md\` | Full pipeline documentation |
| \`drift-monitoring-spec.md\` | Metrics, thresholds, alert procedures |
`,

  "p3-overview": `# Phase 3 — Internal Deployment & Feedback Loop

**Tuần 33–48 | Mục tiêu: Từ approved system đến live production**

---

## Ba giai đoạn triển khai

### Stage 1: Shadow Testing (Week 37–40)
AI chạy song song — **không ảnh hưởng quyết định thật**. Zero risk, max learning.

### Stage 2: Limited Deployment (Week 41–43)
AI recommend decisions, Credit Officers **review và approve/override**. Chỉ low-risk cases.

### Stage 3: Full Deployment (Week 45–47)
AI-Native CRDS live toàn bộ CC origination workflow. Full monitoring active.

## Nguyên tắc không thể thỏa hiệp

> **Human-in-the-Loop là bắt buộc.** Credit Officer là final decision maker. Không thay đổi dù bị pressure "automate more."

## Feedback Loop

\`\`\`
Decision Made → Wait 30-90 days → Outcome Known
      ↓                                ↓
  Log stored                    Label created
      ↓                                ↓
      └──────── Ground Truth ──────────┘
                     ↓
              Retrain trigger → Model improves
\`\`\`
`,

  "p3-w47": `# Week 47 — Impact Measurement & Feedback Loop 🔰

**🎯 Mục tiêu:** Đo impact 30 ngày sau full deployment + thiết lập feedback loop

---

## Tại sao feedback loop là cốt lõi

> AI-Native = system **học từ thực tế**. Không có ground truth feedback loop → model sẽ chết dần.

## Ground Truth Schema

\`\`\`json
{
  "decision_id": "uuid",
  "ai_score": 0.73,
  "ai_recommendation": "approve",
  "final_decision": "approve",
  "override": false,
  "outcome": {
    "label_date": "2025-04-15",
    "days_to_label": 90,
    "delinquency_90d": false,
    "default": false
  },
  "model_version": "v1.2.0"
}
\`\`\`

## 30-Day Impact Report

| Metric | Before AI | After 30d | Target |
|--------|-----------|-----------|--------|
| Manual review rate | baseline | current | -30% |
| Time-to-decision | baseline | current | -50% |
| NPL rate (30d cohort) | baseline | pending | no increase |
| Override rate | N/A | current | <20% |

## Outputs

| File | Nội dung |
|------|----------|
| \`30-day-impact-report.md\` | Impact metrics sau 30 ngày |
| \`feedback-loop-schema.md\` | Schema + process documentation |
| \`lessons-learned.md\` | What worked, what didn't |
`,

  "p4-overview": `# Phase 4 — Scale & Lifecycle Maturity

**Tuần 49–60 | Mục tiêu: Từ working system đến institutional asset**

---

## Bốn hướng mở rộng

\`\`\`
1. CC Salaried → CC Self-employed
   (cùng product, khác segment — lowest risk)

2. CC → Consumer Loan
   (cùng segment, khác product)

3. Origination → Early Warning System
   (natural extension — data đã có sẵn)

4. Retail → SME
   (khác segment hoàn toàn — highest complexity)
\`\`\`

## ML Lifecycle

\`\`\`
Build → Validate → Deploy → Monitor → Retrain → Retire
  ↑                                                ↓
  └─────────────── Feedback Loop ─────────────────┘
\`\`\`

## Approval Gate cuối

\`\`\`
Week 54: Expansion approval (C-level)
  Input: 90-day impact report với real numbers
\`\`\`
`,

  "p4-w57": `# Week 57 — Model Lifecycle Maturity & CI/CD for ML 🔰

**🎯 Mục tiêu:** Mature governance — từ "đang build" sang "production grade"

---

## Deployment Options

| Strategy | Use case | Risk |
|----------|----------|------|
| **Shadow** | New model, unknown risk | Lowest |
| **Canary** | Challenger test (10% traffic) | Low |
| **Blue-Green** | Safe full cutover with instant rollback | Medium |
| **Hot swap** | Emergency patch | High — avoid |

## Monitoring Schedule

\`\`\`
Daily:     Score distribution, approval rate
Weekly:    PSI per feature, override rate trend
Monthly:   KS score, default rate by cohort
Quarterly: Full model review, retraining decision
\`\`\`

## CI/CD for ML Pipeline

\`\`\`
Git commit
      ↓ Automated tests
      ↓ Model validation (if model change)
      ↓ Staging deploy + smoke tests
      ↓ CAB review
      ↓ Production deploy (canary first)
      ↓ Monitoring active
\`\`\`

## Outputs

| File | Nội dung |
|------|----------|
| \`model-governance-v2.md\` | Full governance framework |
| \`ml-lifecycle-runbook.md\` | Step-by-step operational runbook |
`
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const FileIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);
const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ArrowUp = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);

// ─── MARKDOWN RENDERER ────────────────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/^#{4} (.+)$/gm, "<h4>$1</h4>")
    .replace(/^#{3} (.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2} (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`\n]+)`/g, "<code>$1</code>")
    .replace(/^---$/gm, "<hr/>")
    .replace(/^\> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="checklist unchecked">$1</li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="checklist checked">$1</li>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, '<li class="ordered">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, m => {
      if (m.includes('class="ordered"')) return `<ol>${m}</ol>`;
      if (m.includes('checklist')) return `<ul class="cl-ul">${m}</ul>`;
      return `<ul>${m}</ul>`;
    });

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code>${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`
  );

  html = html.replace(/(\|.+\|\n)+/g, table => {
    const rows = table.trim().split("\n");
    const headers = rows[0].split("|").filter(c=>c.trim()).map(h=>`<th>${h.trim()}</th>`).join("");
    const body = rows.slice(2).map(r=>{
      const cells = r.split("|").filter(c=>c.trim()).map(c=>`<td>${c.trim()}</td>`).join("");
      return `<tr>${cells}</tr>`;
    }).join("");
    return `<table><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table>`;
  });

  html = html.replace(/^(?!<[a-z])(.*\S.*)$/gm, "<p>$1</p>");
  html = html.replace(/<p><\/p>/g, "");
  return html;
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage }) {
  return (
    <nav style={{
      position:"sticky", top:0, zIndex:100,
      background:"#fff", borderBottom:"1px solid #E8E8E8",
      padding:"0 40px", height:"56px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      <button onClick={()=>setPage("home")} style={{
        background:"none", border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", gap:10, padding:0,
      }}>
        <div style={{ width:28,height:28,background:"#E8001D",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:15, color:"#1A1A1A", letterSpacing:"-0.4px" }}>AI-CRDS</span>
        <span style={{ fontSize:10, color:"#E8001D", fontFamily:"'DM Sans',sans-serif", fontWeight:700, background:"#FFF0F2", padding:"2px 7px", borderRadius:3, border:"1px solid #FFD0D6", letterSpacing:"0.04em" }}>BANK X</span>
      </button>

      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        {[{id:"home",label:"Home"},{id:"docs",label:"Docs"}].map(p=>(
          <button key={p.id} onClick={()=>setPage(p.id)} style={{
            background: page===p.id ? "#F5F5F3" : "none",
            border:"none", cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif", fontWeight: page===p.id ? 600 : 400,
            fontSize:14, color: page===p.id ? "#1A1A1A" : "#777",
            padding:"7px 14px", borderRadius:5, transition:"all 0.15s",
          }}>
            {p.label}
          </button>
        ))}
        <button onClick={()=>setPage("demo")} style={{
          background:"#E8001D", color:"#fff", border:"none", cursor:"pointer",
          fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13,
          padding:"8px 18px", borderRadius:5, marginLeft:8,
          display:"flex", alignItems:"center", gap:6, transition:"background 0.15s",
          letterSpacing:"-0.1px",
        }}
          onMouseEnter={e=>e.currentTarget.style.background="#C80019"}
          onMouseLeave={e=>e.currentTarget.style.background="#E8001D"}
        >
          Try Demo <ArrowRight size={13}/>
        </button>
      </div>
    </nav>
  );
}

// ─── HOMEPAGE ─────────────────────────────────────────────────────────────────
function Homepage({ setPage }) {
  const phases = [
    { num:"01", weeks:"Week 1–16", title:"Foundation", sub:"Problem framing, DPIA, MVP build, internal proposal & C-level approval" },
    { num:"02", weeks:"Week 17–32", title:"MLOps & Workflow", sub:"Multi-role workflow, Champion-Challenger setup, integration & validation" },
    { num:"03", weeks:"Week 33–48", title:"Deployment", sub:"Shadow testing, limited rollout, full deployment & feedback loop" },
    { num:"04", weeks:"Week 49–60", title:"Scale & Maturity", sub:"CI/CD for ML, expansion roadmap, lifecycle governance, SaaS optionality" },
  ];

  const stats = [
    { value:"−30%", label:"Manual Review Rate", note:"Target reduction" },
    { value:"−50%", label:"Time-to-Decision", note:"Target improvement" },
    { value:"60", label:"Weeks", note:"Total roadmap" },
    { value:"4", label:"Phases", note:"Foundation → Scale" },
  ];

  return (
    <div style={{ background:"#fff", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ padding:"64px 40px 0", maxWidth:1200, margin:"0 auto" }}>

        {/* Eyebrow */}
        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:28 }}>
          <div style={{ width:5,height:5,borderRadius:"50%",background:"#E8001D" }}/>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", color:"#E8001D", textTransform:"uppercase", fontFamily:"'Sora',sans-serif" }}>
            AI-Native Product · Internal Roadmap
          </span>
        </div>

        {/* Text + CTA — side by side */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:72, alignItems:"flex-end", marginBottom:52 }}>

          {/* Left: giant headline */}
          <h1 style={{
            fontFamily:"'Sora',sans-serif", fontWeight:900,
            fontSize:"clamp(40px,5vw,64px)", color:"#1A1A1A",
            lineHeight:1.05, margin:0, letterSpacing:"-2.5px",
          }}>
            Credit Risk<br/>
            <span style={{
              color:"#E8001D",
              WebkitTextStroke: "0px",
            }}>Decision</span><br/>
            Support
          </h1>

          {/* Right: description + CTA */}
          <div style={{ paddingBottom:4 }}>
            <p style={{ fontSize:15, color:"#555", lineHeight:1.8, margin:"0 0 28px" }}>
              Hệ thống AI hỗ trợ quyết định tín dụng thế hệ mới — Origination Scoring + Fraud Detection tại điểm phát hành thẻ tín dụng retail. Inhouse, compliant, production-grade.
            </p>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button onClick={()=>setPage("demo")} style={{
                background:"#E8001D", color:"#fff", border:"none", cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15,
                padding:"13px 26px", borderRadius:7,
                display:"flex", alignItems:"center", gap:10, transition:"all 0.2s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.background="#C80019"; e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#E8001D"; e.currentTarget.style.transform="none";}}
              >
                Try Demo
                <span style={{ background:"rgba(255,255,255,0.22)",borderRadius:5,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <ArrowRight size={14}/>
                </span>
              </button>
              <button onClick={()=>setPage("docs")} style={{
                background:"#fff", color:"#1A1A1A", border:"1.5px solid #E0E0E0",
                cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                fontWeight:600, fontSize:15, padding:"12px 22px", borderRadius:7,
                transition:"all 0.2s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#E8001D"; e.currentTarget.style.color="#E8001D";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#E0E0E0"; e.currentTarget.style.color="#1A1A1A";}}
              >
                View Docs
              </button>
            </div>
          </div>
        </div>

        {/* ── BANNER — full width ─────────────────── */}
        <div style={{
          background:"#1A1A1A", borderRadius:"12px 12px 0 0",
          overflow:"hidden", display:"flex", minHeight:320,
        }}>
          {/* Left info panel */}
          <div style={{ flex:"0 0 300px", padding:"40px 36px", display:"flex", flexDirection:"column", justifyContent:"space-between", borderRight:"1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <div style={{ fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:"#E8001D",textTransform:"uppercase",marginBottom:12,fontFamily:"'Sora',sans-serif" }}>Use Case</div>
              <div style={{ fontFamily:"'Sora',sans-serif",fontSize:26,fontWeight:900,color:"#fff",lineHeight:1.1,letterSpacing:"-0.8px" }}>
                CC Retail<br/>Origination
              </div>
              <p style={{ fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:12,lineHeight:1.65 }}>
                Tự động hóa quy trình phê duyệt thẻ tín dụng — từ data ingestion đến decision recommendation.
              </p>
            </div>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {["Auto-Approve","Manual Review","Auto-Reject","Escalate"].map(t=>(
                <span key={t} style={{ fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.6)",background:"rgba(255,255,255,0.07)",borderRadius:3,padding:"4px 9px",fontFamily:"'DM Sans',sans-serif" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Center: score grid */}
          <div style={{ flex:1, padding:"28px", display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
              {[
                {label:"AI Score", val:"0.73", color:"#E8001D", sub:"Risk probability"},
                {label:"Decision", val:"Review", color:"#F59E0B", sub:"Manual queue"},
                {label:"Confidence", val:"High", color:"#22C55E", sub:"Score band"},
              ].map((c,i)=>(
                <div key={i} style={{ background:"rgba(255,255,255,0.05)",borderRadius:8,padding:"16px",border:"1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:8,fontFamily:"'DM Sans',sans-serif" }}>{c.label}</div>
                  <div style={{ fontFamily:"'Sora',sans-serif",fontSize:24,fontWeight:900,color:c.color }}>{c.val}</div>
                  <div style={{ fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:4 }}>{c.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ flex:1, background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"16px 18px",border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:10,fontFamily:"'Sora',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase" }}>Top Contributing Features</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {[{name:"Payment History",pct:78},{name:"Credit Utilization",pct:54},{name:"Income Stability",pct:43}].map((f,i)=>(
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,0.55)",minWidth:130,fontFamily:"'DM Sans',sans-serif" }}>{f.name}</div>
                    <div style={{ flex:1,background:"rgba(255,255,255,0.08)",borderRadius:2,height:5 }}>
                      <div style={{ width:`${f.pct}%`,height:"100%",background:i===0?"#E8001D":i===1?"#F59E0B":"#22C55E",borderRadius:2 }}/>
                    </div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",minWidth:28,textAlign:"right" }}>{f.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: red accent panel */}
          <div style={{ flex:"0 0 180px",background:"#E8001D",padding:"36px 26px",display:"flex",flexDirection:"column",justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:"rgba(255,255,255,0.65)",textTransform:"uppercase",marginBottom:12,fontFamily:"'Sora',sans-serif" }}>Layer 2</div>
              <div style={{ fontFamily:"'Sora',sans-serif",fontSize:24,fontWeight:900,color:"#fff",lineHeight:1.1,letterSpacing:"-0.5px" }}>Fraud<br/>Detection</div>
            </div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.6 }}>Real-time anomaly scoring tại điểm phát hành</div>
          </div>
        </div>
      </section>

      {/* ── STATS — highlighted numbers ──────────────── */}
      <section style={{ background:"#F7F7F5", borderTop:"1px solid #E8E8E8", borderBottom:"1px solid #E8E8E8" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
          {stats.map((s,i)=>(
            <div key={i} style={{
              padding:"36px 20px", textAlign:"center",
              borderRight: i<3 ? "1px solid #E8E8E8" : "none",
              position:"relative",
            }}>
              {/* Accent line on top */}
              <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:32,height:3,background:"#E8001D",borderRadius:"0 0 3px 3px" }}/>
              {/* Large number */}
              <div style={{
                fontFamily:"'Sora',sans-serif", fontSize:50, fontWeight:900,
                color:"#1A1A1A", letterSpacing:"-3px", lineHeight:1,
                marginBottom:10,
              }}>
                <span style={{ color:"#E8001D" }}>{s.value}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:"#1A1A1A", letterSpacing:"-0.2px", fontFamily:"'Sora',sans-serif" }}>{s.label}</div>
              <div style={{ fontSize:11, color:"#999", marginTop:3 }}>{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PHASES ───────────────────────────────────── */}
      <section style={{ padding:"72px 40px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:36 }}>
          <div>
            <div style={{ fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:"#E8001D",textTransform:"uppercase",marginBottom:8,fontFamily:"'Sora',sans-serif" }}>Roadmap Overview</div>
            <h2 style={{ fontFamily:"'Sora',sans-serif",fontSize:34,fontWeight:900,color:"#1A1A1A",margin:0,letterSpacing:"-1.2px" }}>4 Phases — 60 Weeks</h2>
          </div>
          <button onClick={()=>setPage("docs")} style={{
            background:"none", border:"1.5px solid #E0E0E0", cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13,
            color:"#555", padding:"8px 16px", borderRadius:5,
            display:"flex", alignItems:"center", gap:6, transition:"all 0.15s",
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#E8001D"; e.currentTarget.style.color="#E8001D";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#E0E0E0"; e.currentTarget.style.color="#555";}}
          >
            View full docs <ArrowRight size={12}/>
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, border:"1px solid #E8E8E8", borderRadius:10, overflow:"hidden" }}>
          {phases.map((ph,i)=>(
            <div key={i} style={{
              padding:"28px 24px", background:"#fff",
              borderRight: i<3 ? "1px solid #E8E8E8" : "none",
              borderTop:"3px solid transparent",
              cursor:"pointer", transition:"all 0.2s", position:"relative",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.background="#FAFAFA"; e.currentTarget.style.borderTopColor="#E8001D"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="#fff"; e.currentTarget.style.borderTopColor="transparent"; }}
            >
              <div style={{ fontFamily:"'Sora',sans-serif",fontSize:52,fontWeight:900,color:"#F0F0EE",lineHeight:1,marginBottom:14,letterSpacing:"-3px" }}>{ph.num}</div>
              <div style={{ fontSize:10,fontWeight:700,color:"#E8001D",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6,fontFamily:"'Sora',sans-serif" }}>{ph.weeks}</div>
              <div style={{ fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:800,color:"#1A1A1A",marginBottom:10,letterSpacing:"-0.4px" }}>{ph.title}</div>
              <p style={{ fontSize:12,color:"#777",lineHeight:1.65,margin:0 }}>{ph.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRINCIPLES ───────────────────────────────── */}
      <section style={{ background:"#1A1A1A", padding:"64px 40px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:"#E8001D",textTransform:"uppercase",marginBottom:8,fontFamily:"'Sora',sans-serif" }}>Core Principles</div>
            <h2 style={{ fontFamily:"'Sora',sans-serif",fontSize:32,fontWeight:900,color:"#fff",margin:0,letterSpacing:"-1px" }}>Không thể thỏa hiệp</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2 }}>
            {[
              {n:"01",title:"Human-in-the-Loop",body:"Credit Officer là final decision maker. AI chỉ là support — SBV requirement, không thể bypass.",tag:"SBV Required"},
              {n:"02",title:"Privacy by Design",body:"DPIA theo NĐ13/2023 từ ngày đầu. Không dùng real data trước khi governance được approve.",tag:"NĐ13/2023"},
              {n:"03",title:"Champion-Challenger",body:"Không auto-deploy model mới. Validate → Risk review → CAB approval → Canary → Monitor.",tag:"MLOps Core"},
            ].map((p,i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",padding:"28px 24px" }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
                  <span style={{ fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:900,color:"#E8001D" }}>{p.n}</span>
                  <span style={{ fontSize:9,fontWeight:700,background:"rgba(232,0,29,0.15)",color:"#FF6B7A",padding:"3px 8px",borderRadius:3,letterSpacing:"0.08em",textTransform:"uppercase" }}>{p.tag}</span>
                </div>
                <div style={{ fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:800,color:"#fff",marginBottom:10,letterSpacing:"-0.3px" }}>{p.title}</div>
                <p style={{ fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.7,margin:0 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:"24px 40px",borderTop:"1px solid #E8E8E8",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ width:20,height:20,background:"#E8001D",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <span style={{ fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:12,color:"#1A1A1A" }}>AI-CRDS · Bank X</span>
        </div>
        <div style={{ fontSize:11,color:"#bbb" }}>Internal Roadmap v3 · 60 Weeks</div>
      </footer>
    </div>
  );
}

// ─── DOCS PAGE ────────────────────────────────────────────────────────────────
function DocsPage() {
  const [openPhases, setOpenPhases] = useState({ "phase-1": true });
  const [selectedDoc, setSelectedDoc] = useState("p1-overview");
  const contentRef = useRef(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const h = () => setShowTop(el.scrollTop > 280);
    el.addEventListener("scroll", h);
    return () => el.removeEventListener("scroll", h);
  }, []);

  const PHASE_COLORS = ["#E8001D","#1A73E8","#7C3AED","#B45309"];

  return (
    <div style={{ display:"flex", height:"calc(100vh - 56px)", fontFamily:"'DM Sans',sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{ width:258,minWidth:258,height:"100%",overflowY:"auto",background:"#fff",borderRight:"1px solid #E8E8E8",flexShrink:0 }}>
        <div style={{ padding:"16px 20px 12px",borderBottom:"1px solid #F0F0F0" }}>
          <div style={{ fontSize:10,fontWeight:700,letterSpacing:"0.12em",color:"#E8001D",textTransform:"uppercase",fontFamily:"'Sora',sans-serif",marginBottom:3 }}>Documentation</div>
          <div style={{ fontSize:11,color:"#999" }}>AI-Native CRDS · 60 Weeks Roadmap</div>
        </div>

        <div style={{ padding:"6px 0 24px" }}>
          {DOCS_TREE.map((phase,pi)=>{
            const isOpen = openPhases[phase.id];
            const pc = PHASE_COLORS[pi];
            return (
              <div key={phase.id}>
                <button onClick={()=>setOpenPhases(p=>({...p,[phase.id]:!p[phase.id]}))} style={{
                  width:"100%",display:"flex",alignItems:"center",gap:8,
                  padding:"9px 20px",background:"none",border:"none",cursor:"pointer",textAlign:"left",
                }}>
                  <span style={{ color:pc,display:"flex",flexShrink:0 }}><FolderIcon/></span>
                  <span style={{ flex:1,fontSize:12,fontWeight:700,color:"#1A1A1A",lineHeight:1.3,fontFamily:"'Sora',sans-serif" }}>{phase.label}</span>
                  <span style={{ color:"#bbb",transform:isOpen?"rotate(0)":"rotate(-90deg)",transition:"transform 0.2s",display:"flex" }}><ChevronDown/></span>
                </button>
                <div style={{ fontSize:10,fontWeight:600,color:pc,padding:"0 20px 6px 42px",fontFamily:"'Sora',sans-serif",letterSpacing:"0.05em" }}>{phase.weeks}</div>
                {isOpen && (
                  <div style={{ paddingBottom:4 }}>
                    {phase.files.map(file=>{
                      const isSel = selectedDoc===file.id;
                      return (
                        <button key={file.id} onClick={()=>{ setSelectedDoc(file.id); contentRef.current?.scrollTo({top:0}); }} style={{
                          width:"100%",display:"flex",alignItems:"center",gap:8,
                          padding:"6px 20px 6px 36px",
                          background: isSel ? "#FFF0F2" : "none",
                          border:"none",
                          borderLeft: isSel ? `2px solid ${pc}` : "2px solid transparent",
                          cursor:"pointer",textAlign:"left",transition:"all 0.12s",
                        }}>
                          <span style={{ color:isSel?pc:"#ccc",display:"flex",flexShrink:0 }}><FileIcon/></span>
                          <span style={{ fontSize:12,color:isSel?pc:"#555",fontWeight:isSel?700:400,lineHeight:1.4 }}>{file.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* CONTENT */}
      <main ref={contentRef} style={{ flex:1,overflowY:"auto",background:"#FAFAFA",padding:"0 0 80px" }}>
        {DOCS_CONTENT[selectedDoc] ? (
          <div style={{ maxWidth:740,margin:"0 auto",padding:"48px 48px 64px" }}>
            <div className="md-body" dangerouslySetInnerHTML={{ __html:renderMarkdown(DOCS_CONTENT[selectedDoc]) }}/>
          </div>
        ) : (
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"60%",color:"#bbb",fontSize:14 }}>
            Chọn một tài liệu từ sidebar
          </div>
        )}
      </main>

      {/* BACK TO TOP */}
      {showTop && (
        <button onClick={()=>contentRef.current?.scrollTo({top:0,behavior:"smooth"})}
          aria-label="Back to top"
          style={{
            position:"fixed",bottom:28,right:28,zIndex:50,
            background:"#E8001D",color:"#fff",border:"none",borderRadius:"50%",
            width:42,height:42,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 4px 16px rgba(232,0,29,0.4)",transition:"all 0.2s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.background="#C80019"; e.currentTarget.style.transform="translateY(-2px)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="#E8001D"; e.currentTarget.style.transform="none";}}
        >
          <ArrowUp/>
        </button>
      )}
    </div>
  );
}

// ─── DEMO PLACEHOLDER ─────────────────────────────────────────────────────────
function DemoPage({ setPage }) {
  return (
    <div style={{ minHeight:"calc(100vh - 56px)",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center",maxWidth:420 }}>
        <div style={{ width:60,height:60,background:"#FFF0F2",border:"1px solid #FFD0D6",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 22px" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E8001D" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <h2 style={{ fontFamily:"'Sora',sans-serif",fontSize:26,fontWeight:900,color:"#1A1A1A",margin:"0 0 10px",letterSpacing:"-0.8px" }}>Demo Coming Soon</h2>
        <p style={{ fontSize:14,color:"#666",lineHeight:1.75,marginBottom:28 }}>
          Demo MVP v1 đang được build tại Week 12 milestone. Synthetic data modeled theo Bank X data structure.
        </p>
        <button onClick={()=>setPage("home")} style={{
          background:"#E8001D",color:"#fff",border:"none",cursor:"pointer",
          fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,
          padding:"10px 22px",borderRadius:6,transition:"background 0.15s",
        }}
          onMouseEnter={e=>e.currentTarget.style.background="#C80019"}
          onMouseLeave={e=>e.currentTarget.style.background="#E8001D"}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #fff; color: #1A1A1A; }

        .md-body h1 { font-family:'Sora',sans-serif; font-size:30px; font-weight:900; color:#1A1A1A; letter-spacing:-1px; margin:0 0 6px; line-height:1.15; }
        .md-body h2 { font-family:'Sora',sans-serif; font-size:20px; font-weight:800; color:#1A1A1A; margin:34px 0 12px; letter-spacing:-0.4px; padding-bottom:10px; border-bottom:2px solid #E8E8E8; }
        .md-body h3 { font-family:'Sora',sans-serif; font-size:16px; font-weight:700; color:#1A1A1A; margin:24px 0 8px; }
        .md-body h4 { font-size:10px; font-weight:700; color:#E8001D; text-transform:uppercase; letter-spacing:0.12em; margin:16px 0 6px; font-family:'Sora',sans-serif; }
        .md-body p { font-size:14.5px; color:#333; line-height:1.8; margin:0 0 12px; }
        .md-body strong { color:#1A1A1A; font-weight:700; }
        .md-body em { color:#555; font-style:italic; }
        .md-body code { font-family:'JetBrains Mono',monospace; font-size:12px; background:#F5F5F3; color:#E8001D; padding:2px 6px; border-radius:3px; border:1px solid #E8E8E8; }
        .md-body pre { background:#1A1A1A; border-radius:8px; padding:18px 20px; margin:16px 0; overflow-x:auto; }
        .md-body pre code { background:none; color:#E0E0E0; font-size:12px; padding:0; border:none; line-height:1.65; }
        .md-body blockquote { border-left:3px solid #E8001D; padding:10px 16px; background:#FFF0F2; border-radius:0 5px 5px 0; margin:16px 0; color:#C80019; font-style:italic; font-size:14px; line-height:1.65; }
        .md-body ul, .md-body ol { padding-left:20px; margin:0 0 12px; color:#333; }
        .md-body li { font-size:14.5px; line-height:1.75; margin-bottom:4px; }
        .md-body hr { border:none; border-top:1px solid #E8E8E8; margin:26px 0; }
        .md-body table { width:100%; border-collapse:collapse; font-size:13px; margin:16px 0; border:1px solid #E8E8E8; border-radius:6px; overflow:hidden; }
        .md-body th { background:#F5F5F3; font-weight:700; color:#1A1A1A; padding:9px 13px; text-align:left; border-bottom:2px solid #E0E0E0; font-family:'Sora',sans-serif; font-size:11px; }
        .md-body td { padding:8px 13px; border-bottom:1px solid #F0F0F0; color:#333; font-size:13px; }
        .md-body tr:last-child td { border-bottom:none; }
        .md-body a { color:#E8001D; text-decoration:underline; }
        .md-body ul.cl-ul { list-style:none; padding-left:0; }
        .md-body li.checklist { display:flex; align-items:flex-start; gap:8px; padding:3px 0; }
        .md-body li.checklist::before { content:'☐'; color:#ccc; flex-shrink:0; margin-top:2px; }
        .md-body li.checked::before { content:'☑'; color:#E8001D; }

        aside::-webkit-scrollbar { width:3px; }
        aside::-webkit-scrollbar-thumb { background:#E0E0E0; border-radius:2px; }
        main::-webkit-scrollbar { width:4px; }
        main::-webkit-scrollbar-thumb { background:#E0E0E0; border-radius:2px; }
      `}</style>
      <Navbar page={page} setPage={setPage}/>
      {page==="home" && <Homepage setPage={setPage}/>}
      {page==="docs" && <DocsPage/>}
      {page==="demo" && <DemoPage setPage={setPage}/>}
    </>
  );
}
