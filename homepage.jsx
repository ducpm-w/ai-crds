import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";

// ─── DOCS: load từ /docs/**/*.md via Vite glob ────────────────────────────────
const MD_FILES = import.meta.glob("/docs/**/*.md", { query: "?raw", import: "default", eager: true });

function getDocContent(fileId) {
  if (!fileId) return null;
  return MD_FILES[`/docs/${fileId}`] ?? null;
}

const SECTION_META = {
  "Foundation & Internal Proposal": { label: "Foundation & Internal Proposal", note: "W1–W12" },
};

function buildDocsTree(mdFiles) {
  const sections = {};
  Object.keys(mdFiles).sort().forEach(path => {
    const relative = path.replace("/docs/", "");
    const parts = relative.split("/");
    if (parts.length !== 3) return;
    const [sectionId, folderId, filename] = parts;
    if (!SECTION_META[sectionId]) return;
    if (!sections[sectionId]) {
      sections[sectionId] = { id: sectionId, label: SECTION_META[sectionId].label, note: SECTION_META[sectionId].note, folders: {} };
    }
    if (!sections[sectionId].folders[folderId]) {
      sections[sectionId].folders[folderId] = { id: `${sectionId}/${folderId}`, label: folderId, files: [] };
    }
    sections[sectionId].folders[folderId].files.push({ id: relative, label: filename.replace(/\.md$/, "") });
  });
  return Object.keys(sections).sort().map(sectionId => ({
    ...sections[sectionId],
    folders: Object.keys(sections[sectionId].folders)
      .sort((a, b) => {
        const numA = parseInt(a.match(/^W(\d+)/)?.[1] ?? "0");
        const numB = parseInt(b.match(/^W(\d+)/)?.[1] ?? "0");
        return numA - numB;
      })
      .map(folderId => sections[sectionId].folders[folderId]),
  }));
}

const DOCS_TREE = buildDocsTree(MD_FILES);

// ─── ICONS ────────────────────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const FileIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);
const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const Arrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/>
  </svg>
);
const ArrowUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCountUp(target, duration = 1600, trigger = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, trigger]);
  return val;
}

function useNow() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function fmtTime(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

// ─── MARKDOWN RENDERER (giữ nguyên logic cũ) ──────────────────────────────────
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
    `<pre><code>${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`);
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

// ─── TICKER ───────────────────────────────────────────────────────────────────
const TICKER_EVENTS = [
  "MODEL-CC-01 · SCORED APPL-2847 · RISK 0.34 · AUTO-APPROVE",
  "MODEL-FR-02 · ANOMALY APPL-2848 · CONF 0.92 · ESCALATE",
  "CAB-REVIEW · CHAMPION-CHALLENGER · CC-02 APPROVED",
  "DPIA-V3 · SUBMITTED · 2026-Q2 · NĐ13-COMPLIANT",
  "DRIFT CHECK · PSI 0.08 · STABLE · MODEL-CC-01",
  "SHADOW-BATCH-0421 · N=2400 · AGREEMENT 94.2%",
  "AUDIT-LOG · OVERRIDE #1187 · CREDIT-OFFICER-032",
  "GOVERNANCE · ADVERSE-ACTION-NOTICE · GENERATED",
];

function Ticker() {
  const loop = [...TICKER_EVENTS, ...TICKER_EVENTS];
  return (
    <div className="ticker">
      <div className="ticker-tag">
        <span className="pulse-dot"/>LIVE · SIGNAL
      </div>
      <div className="ticker-viewport">
        <div className="ticker-track">
          {loop.map((e, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-arrow">›</span>{e}
            </span>
          ))}
        </div>
      </div>
      <div className="ticker-tail">BANK-X / AI-CRDS / TERMINAL</div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const now = useNow();

  return (
    <>
      <nav className="nav">
        <button onClick={() => navigate("/")} className="brand">
          <div className="brand-mark">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span className="brand-name">AI–CRDS</span>
          <span className="brand-tag">BANK X · INTERNAL</span>
        </button>

        <div className="nav-center">
          <span className="nav-clock"><span className="pulse-dot-sm"/>{fmtTime(now)} GMT+7</span>
        </div>

        <div className="nav-right">
          {[{id:"home",label:"Home",path:"/"},{id:"docs",label:"Docs",path:"/docs"}].map(p => (
            <button
              key={p.id}
              onClick={() => navigate(p.path)}
              className={`nav-link ${location.pathname === p.path ? "nav-link-active" : ""}`}
            >
              {p.label}
            </button>
          ))}
          <button onClick={() => window.location.href = "/demo/"} className="btn-primary btn-sm">
            Try Demo <Arrow size={12}/>
          </button>
        </div>
      </nav>
    </>
  );
}

// ─── INSTRUMENT PANEL (hero right) ────────────────────────────────────────────
function InstrumentPanel() {
  const score = useCountUp(73, 1800);
  const conf = useCountUp(92, 1600);
  const f1 = useCountUp(78, 1700);
  const f2 = useCountUp(54, 1800);
  const f3 = useCountUp(43, 1900);

  const arcLen = 251.3; // π * r for r=80
  const dash = (score / 100) * arcLen;

  return (
    <div className="instrument">
      {/* Corner ticks */}
      <span className="ct ct-tl"/><span className="ct ct-tr"/>
      <span className="ct ct-bl"/><span className="ct ct-br"/>

      <div className="instr-head">
        <span className="instr-label">FIG · 01</span>
        <span className="instr-title">DECISION SIGNAL</span>
        <span className="instr-live"><span className="pulse-dot-sm"/>ACTIVE</span>
      </div>

      {/* Gauge */}
      <div className="gauge-wrap">
        <svg viewBox="0 0 220 140" className="gauge">
          {/* tick marks */}
          {Array.from({ length: 21 }).map((_, i) => {
            const a = Math.PI * (i / 20);
            const x1 = 110 + Math.cos(Math.PI - a) * 92;
            const y1 = 118 - Math.sin(a) * 92;
            const x2 = 110 + Math.cos(Math.PI - a) * (i % 5 === 0 ? 100 : 96);
            const y2 = 118 - Math.sin(a) * (i % 5 === 0 ? 100 : 96);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0A0A0A" strokeWidth={i % 5 === 0 ? 1.2 : 0.5} opacity={i % 5 === 0 ? 0.6 : 0.25} />;
          })}
          {/* background arc */}
          <path d="M 30 118 A 80 80 0 0 1 190 118" fill="none" stroke="#E4E2DC" strokeWidth="8" strokeLinecap="butt"/>
          {/* value arc */}
          <path
            d="M 30 118 A 80 80 0 0 1 190 118"
            fill="none"
            stroke="#E8001D"
            strokeWidth="8"
            strokeDasharray={`${dash} ${arcLen}`}
            strokeLinecap="butt"
            style={{ transition: "stroke-dasharray 80ms linear" }}
          />
          {/* needle */}
          <g transform={`rotate(${-90 + (score/100)*180} 110 118)`} style={{ transition: "transform 80ms linear" }}>
            <line x1="110" y1="118" x2="110" y2="38" stroke="#0A0A0A" strokeWidth="1.5"/>
            <circle cx="110" cy="118" r="4" fill="#0A0A0A"/>
            <circle cx="110" cy="118" r="1.5" fill="#E8001D"/>
          </g>
          {/* axis labels */}
          <text x="28" y="134" className="axis-lbl">0.00</text>
          <text x="106" y="22" className="axis-lbl" textAnchor="middle">0.50</text>
          <text x="192" y="134" className="axis-lbl" textAnchor="end">1.00</text>
        </svg>
        <div className="gauge-readout">
          <div className="readout-main">0.{String(Math.round(score)).padStart(2,"0")}</div>
          <div className="readout-cap">RISK PROBABILITY · DEFAULT</div>
        </div>
      </div>

      {/* Decision lanes */}
      <div className="lanes">
        {[
          { key:"AUTO-APPROVE", range:"0.00–0.29", active:false },
          { key:"REVIEW",       range:"0.30–0.69", active:true  },
          { key:"REJECT",       range:"0.70–1.00", active:false },
          { key:"ESCALATE",     range:"FRAUD",     active:false },
        ].map(l => (
          <div key={l.key} className={`lane ${l.active ? "lane-active" : ""}`}>
            <div className="lane-k">{l.key}</div>
            <div className="lane-r">{l.range}</div>
          </div>
        ))}
      </div>

      {/* Feature contributions */}
      <div className="feat-block">
        <div className="feat-head">
          <span>TOP SIGNAL CONTRIBUTIONS</span>
          <span className="conf">CONF {Math.round(conf)}%</span>
        </div>
        {[
          { n:"payment_history_12m",    v: f1 },
          { n:"utilization_ratio",      v: f2 },
          { n:"income_stability_score", v: f3 },
        ].map((f, i) => (
          <div key={i} className="feat-row">
            <span className="feat-n">{f.n}</span>
            <span className="feat-bar">
              <span className="feat-fill" style={{ width: `${f.v}%` }}/>
            </span>
            <span className="feat-v">{String(Math.round(f.v)).padStart(2,"0")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HOMEPAGE ─────────────────────────────────────────────────────────────────
function Homepage() {
  const navigate = useNavigate();

  const [statsRef, statsIn] = useInView(0.3);
  const v30 = useCountUp(30, 1400, statsIn);
  const v50 = useCountUp(50, 1600, statsIn);
  const v60 = useCountUp(60, 1400, statsIn);
  const v4  = useCountUp(4,  1000, statsIn);

  const phases = [
    { num:"01", weeks:"Week 1–16",  title:"Foundation",        sub:"Problem framing · DPIA · MVP build · internal proposal · C-level approval" },
    { num:"02", weeks:"Week 17–32", title:"MLOps & Workflow",  sub:"Multi-role workflow · Champion–Challenger setup · integration · validation" },
    { num:"03", weeks:"Week 33–48", title:"Deployment",        sub:"Shadow testing · limited rollout · full deployment · feedback loop" },
    { num:"04", weeks:"Week 49–60", title:"Scale & Maturity",  sub:"CI/CD for ML · expansion roadmap · lifecycle governance · SaaS optionality" },
  ];

  const principles = [
    { n:"P/01", title:"Human-in-the-Loop", tag:"SBV REQUIRED",
      body:"Credit Officer là final decision maker. AI chỉ là support — SBV requirement, không thể bypass." },
    { n:"P/02", title:"Privacy by Design", tag:"NĐ13/2023",
      body:"DPIA theo Nghị định 13/2023 từ ngày đầu. Không dùng real data trước khi governance được approve." },
    { n:"P/03", title:"Champion–Challenger", tag:"MLOPS CORE",
      body:"Không auto-deploy model mới. Validate → Risk review → CAB approval → Canary → Monitor." },
  ];

  return (
    <div className="home">
      {/* ─── HERO ────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="eyebrow reveal" style={{animationDelay:"80ms"}}>
              <span className="eb-code">R/001</span>
              <span className="eb-sep"/>
              <span className="eb-text">AI-NATIVE · INTERNAL ROADMAP</span>
            </div>

            <h1 className="headline">
              <span className="hl-line reveal" style={{animationDelay:"180ms"}}>Credit Risk</span>
              <span className="hl-line hl-serif reveal" style={{animationDelay:"320ms"}}>
                <span className="hl-serif-inner">Decision</span>
                <span className="hl-dash"/>
              </span>
              <span className="hl-line reveal" style={{animationDelay:"460ms"}}>
                Support<span className="hl-dot">.</span>
              </span>
            </h1>

            <div className="lede-wrap reveal" style={{animationDelay:"620ms"}}>
              <div className="lede-rule"/>
              <p className="lede">
                Hệ thống AI hỗ trợ quyết định tín dụng thế hệ mới. <em>Origination Scoring</em> và <em>Fraud Detection</em> tại điểm phát hành thẻ tín dụng retail — inhouse, compliant, production-grade.
              </p>
            </div>

            <div className="cta-row reveal" style={{animationDelay:"760ms"}}>
              <button onClick={() => window.location.href="/demo/"} className="btn-primary btn-lg">
                Try Demo
                <span className="btn-arrow"><Arrow size={14}/></span>
              </button>
              <button onClick={() => navigate("/docs")} className="btn-ghost btn-lg">
                View Docs
              </button>
              <div className="hero-meta">
                <span className="hero-meta-k">VERSION</span>
                <span className="hero-meta-v">v0.1.0 · MVP</span>
              </div>
            </div>
          </div>

          <div className="hero-right reveal" style={{animationDelay:"320ms"}}>
            <InstrumentPanel/>
          </div>
        </div>

        <div className="hero-foot">
          <span className="hf-k">USE CASE</span>
          <span className="hf-v">Credit Card · Retail Origination</span>
          <span className="hf-sep"/>
          <span className="hf-k">LAYER 1</span>
          <span className="hf-v">Origination Scoring</span>
          <span className="hf-sep"/>
          <span className="hf-k">LAYER 2</span>
          <span className="hf-v">Fraud Detection</span>
          <span className="hf-sep"/>
          <span className="hf-k">DECISIONS</span>
          <span className="hf-v">Auto-Approve · Review · Reject · Escalate</span>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────── */}
      <section ref={statsRef} className="stats">
        <div className="stats-head">
          <span className="sec-code">§ 02 / METRICS</span>
          <span className="sec-title">Target Outcomes</span>
        </div>
        <div className="stats-row">
          {[
            { prefix:"−", val: v30, suffix:"%", k:"MANUAL REVIEW RATE",  note:"target reduction"   },
            { prefix:"−", val: v50, suffix:"%", k:"TIME-TO-DECISION",    note:"target improvement" },
            { prefix:"",  val: v60, suffix:"",  k:"WEEKS",               note:"total roadmap"      },
            { prefix:"",  val: v4,  suffix:"",  k:"PHASES",              note:"foundation → scale" },
          ].map((s, i) => (
            <div key={i} className="stat">
              <div className="stat-ix">0{i+1}</div>
              <div className="stat-num">
                <span className="sn-prefix">{s.prefix}</span>
                <span className="sn-val">{Math.round(s.val)}</span>
                <span className="sn-suffix">{s.suffix}</span>
              </div>
              <div className="stat-k">{s.k}</div>
              <div className="stat-note">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PHASES ──────────────────────────────────────── */}
      {/* ─── PRINCIPLES ──────────────────────────────────── */}
      <section className="principles">
        <div className="principles-inner">
          <div className="principles-head">
            <span className="sec-code sec-code-dark">§ 04 / NON-NEGOTIABLES</span>
            <h2 className="sec-h sec-h-dark">
              Nguyên tắc <span className="sec-h-serif sec-h-serif-dark">cốt lõi</span>.
            </h2>
            <p className="principles-lede">
              Ba nguyên tắc neo toàn bộ hệ thống — governance, privacy, model safety. Tất cả engineering decision phải thông qua các constraint này.
            </p>
          </div>

          <div className="principle-grid">
            {principles.map((p, i) => <PrincipleCard key={i} {...p} idx={i}/>)}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="foot">
        <div className="foot-inner">
          <div className="foot-left">
            <div className="brand-mark foot-mark">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span className="foot-brand">AI–CRDS</span>
            <span className="foot-bank">Bank X · Internal</span>
          </div>
          <div className="foot-right">
            <span className="foot-k">INTERNAL ROADMAP</span>
            <span className="foot-v">v3 · 60 weeks · 4 phases</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── PHASE ROW ────────────────────────────────────────────────────────────────
function PhaseRow({ num, weeks, title, sub, idx }) {
  const [ref, inView] = useInView(0.25);
  return (
    <li ref={ref} className={`phase-row ${inView ? "in" : ""}`} style={{ transitionDelay: `${idx * 90}ms` }}>
      <div className="pr-line"><span/></div>
      <div className="pr-num">{num}</div>
      <div className="pr-body">
        <div className="pr-head">
          <span className="pr-weeks">{weeks}</span>
          <h3 className="pr-title">{title}</h3>
        </div>
        <p className="pr-sub">{sub}</p>
      </div>
      <div className="pr-tag">PHASE</div>
    </li>
  );
}

// ─── PRINCIPLE CARD ──────────────────────────────────────────────────────────
function PrincipleCard({ n, title, body, tag, idx }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} className={`principle ${inView ? "in" : ""}`} style={{ transitionDelay: `${idx * 120}ms` }}>
      <div className="principle-corner ct-tl"/>
      <div className="principle-corner ct-tr"/>
      <div className="principle-corner ct-bl"/>
      <div className="principle-corner ct-br"/>

      <div className="principle-head">
        <span className="principle-n">{n}</span>
        <span className="principle-tag">{tag}</span>
      </div>
      <h3 className="principle-title">{title}</h3>
      <p className="principle-body">{body}</p>
      <div className="principle-foot">
        <span className="principle-seal">◉ LOCKED</span>
      </div>
    </div>
  );
}

// ─── DOCS PAGE (layout giữ nguyên, style đồng bộ) ────────────────────────────
function DocsPage() {
  const [openPhases, setOpenPhases] = useState({ "Foundation & Internal Proposal": true });
  const [openWeeks, setOpenWeeks] = useState({ "Foundation & Internal Proposal/W1. Problem Framing": true });
  const [selectedDoc, setSelectedDoc] = useState("Foundation & Internal Proposal/W1. Problem Framing/w01-01-use-case-shortlist.md");
  const contentRef = useRef(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const h = () => setShowTop(el.scrollTop > 280);
    el.addEventListener("scroll", h);
    return () => el.removeEventListener("scroll", h);
  }, []);

  const PHASE_COLORS = ["#E8001D","#0A0A0A","#6B4FBB","#B45309","#0369A1","#059669","#D97706","#7C3AED","#DB2777","#0891B2","#65A30D","#DC2626"];
  const selectFile = (fileId) => { setSelectedDoc(fileId); contentRef.current?.scrollTo({ top: 0 }); };
  const docContent = getDocContent(selectedDoc);

  return (
    <div className="docs">
      <aside className="docs-side">
        <div className="docs-side-head">
          <div className="sec-code sec-code-s">§ DOCUMENTATION</div>
          <div className="docs-side-note">Foundation · W1–W12</div>
        </div>
        <div className="docs-side-body">
          {DOCS_TREE.map((phase, pi) => {
            const isPhaseOpen = openPhases[phase.id];
            const pc = PHASE_COLORS[pi];
            return (
              <div key={phase.id}>
                <button onClick={() => setOpenPhases(p => ({...p, [phase.id]: !p[phase.id]}))} className="docs-phase">
                  <span style={{ color: pc }}><FolderIcon/></span>
                  <span className="docs-phase-lbl">{phase.label}</span>
                  <span className={`docs-chev ${isPhaseOpen ? "" : "closed"}`}><ChevronDown/></span>
                </button>
                <div className="docs-phase-weeks" style={{ color: pc }}>{phase.note}</div>

                {isPhaseOpen && phase.folders.map(folder => {
                  const isWeekOpen = openWeeks[folder.id];
                  return (
                    <div key={folder.id}>
                      <button onClick={() => setOpenWeeks(w => ({...w, [folder.id]: !w[folder.id]}))} className="docs-week">
                        <span><FolderIcon/></span>
                        <span className="docs-week-lbl">{folder.label}</span>
                        <span className={`docs-chev ${isWeekOpen ? "" : "closed"}`}><ChevronDown/></span>
                      </button>
                      {isWeekOpen && folder.files.map(file => {
                        const isSel = selectedDoc === file.id;
                        return (
                          <button
                            key={file.id}
                            onClick={() => selectFile(file.id)}
                            className={`docs-file ${isSel ? "sel" : ""}`}
                            style={isSel ? { borderLeftColor: pc, color: pc } : null}
                          >
                            <span><FileIcon/></span>
                            <span className="docs-file-lbl">{file.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </aside>

      <main ref={contentRef} className="docs-main">
        {docContent ? (
          <div className="docs-article">
            <div className="md-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(docContent) }}/>
          </div>
        ) : (
          <div className="docs-empty">Chọn một tài liệu từ sidebar</div>
        )}
      </main>

      {showTop && (
        <button onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top" className="back-top">
          <ArrowUp/>
        </button>
      )}
    </div>
  );
}

// ─── DEMO PLACEHOLDER ─────────────────────────────────────────────────────────
function DemoPage() {
  const navigate = useNavigate();
  return (
    <div className="demo-ph">
      <div className="demo-ph-inner">
        <div className="demo-ph-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8001D" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <h2 className="demo-ph-h">Demo Coming Soon</h2>
        <p className="demo-ph-p">Demo MVP v1 đang được build tại Week 12 milestone. Synthetic data modeled theo Bank X data structure.</p>
        <button onClick={() => navigate("/")} className="btn-primary btn-lg">← Back to Home</button>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{STYLES}</style>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/docs" element={<DocsPage/>}/>
        <Route path="/demo" element={<DemoPage/>}/>
      </Routes>
    </>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Geist:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --ink:      #0A0A0A;
  --ink-2:    #2A2A2A;
  --mute:     #8A8680;
  --mute-2:   #B6B2AA;
  --line:     #E4E2DC;
  --line-2:   #EFEDE6;
  --canvas:   #FAFAF7;
  --canvas-2: #F3F1EA;
  --signal:   #E8001D;
  --signal-2: #C80019;
  --f-sans:   'Geist', system-ui, -apple-system, sans-serif;
  --f-serif:  'Instrument Serif', 'Times New Roman', serif;
  --f-mono:   'JetBrains Mono', ui-monospace, monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--f-sans); background: var(--canvas); color: var(--ink);
  font-feature-settings: "ss01", "cv11";
  -webkit-font-smoothing: antialiased;
}
button { font-family: inherit; }

/* grain overlay */
body::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 1;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.5;
  mix-blend-mode: multiply;
}

/* ───────── NAV ───────── */
.nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(250,250,247,0.82); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
  padding: 0 40px; height: 64px;
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
}
.brand { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 12px; padding: 0; justify-self: start; }
.brand-mark { width: 26px; height: 26px; background: var(--signal); border-radius: 4px; display: flex; align-items: center; justify-content: center; }
.brand-name { font-family: var(--f-serif); font-style: italic; font-size: 22px; color: var(--ink); letter-spacing: -0.5px; line-height: 1; }
.brand-tag { font-family: var(--f-mono); font-size: 9.5px; font-weight: 500; color: var(--mute); letter-spacing: 0.12em; padding-left: 10px; border-left: 1px solid var(--line); }
.nav-center { justify-self: center; }
.nav-clock { font-family: var(--f-mono); font-size: 11px; color: var(--mute); letter-spacing: 0.08em; display: flex; align-items: center; gap: 8px; font-variant-numeric: tabular-nums; }
.nav-right { justify-self: end; display: flex; align-items: center; gap: 6px; }
.nav-link {
  background: none; border: none; cursor: pointer;
  font-size: 13px; color: var(--mute); font-weight: 500;
  padding: 8px 14px; border-radius: 4px; transition: color .2s;
}
.nav-link:hover { color: var(--ink); }
.nav-link-active { color: var(--ink); font-weight: 600; }

/* pulse dot */
.pulse-dot, .pulse-dot-sm {
  width: 7px; height: 7px; border-radius: 50%; background: var(--signal);
  box-shadow: 0 0 0 0 rgba(232,0,29,0.6);
  animation: pulse 1.8s ease-out infinite;
  display: inline-block;
}
.pulse-dot-sm { width: 5px; height: 5px; }
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(232,0,29,0.55); }
  70%  { box-shadow: 0 0 0 10px rgba(232,0,29,0); }
  100% { box-shadow: 0 0 0 0 rgba(232,0,29,0); }
}

/* ───────── TICKER ───────── */
.ticker {
  display: flex; align-items: center;
  border-bottom: 1px solid var(--line);
  background: var(--canvas);
  font-family: var(--f-mono); font-size: 11px; color: var(--mute);
  height: 34px;
}
.ticker-tag {
  display: flex; align-items: center; gap: 7px;
  padding: 0 16px; height: 100%;
  background: var(--ink); color: #fff;
  font-size: 10px; font-weight: 500; letter-spacing: 0.14em;
  border-right: 1px solid var(--line);
}
.ticker-viewport { flex: 1; overflow: hidden; position: relative; }
.ticker-viewport::before, .ticker-viewport::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 60px; z-index: 2; pointer-events: none;
}
.ticker-viewport::before { left: 0; background: linear-gradient(to right, var(--canvas), transparent); }
.ticker-viewport::after  { right: 0; background: linear-gradient(to left, var(--canvas), transparent); }
.ticker-track {
  display: flex; gap: 48px; white-space: nowrap;
  animation: tick 90s linear infinite;
  padding-left: 40px;
  will-change: transform;
}
.ticker-item { display: inline-flex; align-items: center; gap: 10px; height: 34px; letter-spacing: 0.04em; }
.ticker-arrow { color: var(--signal); font-weight: 700; }
@keyframes tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.ticker-tail {
  padding: 0 18px; height: 100%; display: flex; align-items: center;
  border-left: 1px solid var(--line);
  font-size: 10px; letter-spacing: 0.14em; color: var(--mute);
}

/* ───────── REVEAL ───────── */
.reveal { opacity: 0; transform: translateY(14px); filter: blur(6px); animation: reveal 1s cubic-bezier(.2,.7,.2,1) forwards; }
@keyframes reveal { to { opacity: 1; transform: translateY(0); filter: blur(0); } }

/* ───────── HOME ───────── */
.home { position: relative; z-index: 2; }

/* Hero */
.hero {
  max-width: 1320px; margin: 0 auto;
  padding: 120px 48px 48px;
  position: relative;
}
.hero::before, .hero::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 1px;
  background: var(--line); pointer-events: none;
}
.hero::before { left: 48px; }
.hero::after  { right: 48px; }

.hero-grid {
  display: grid; grid-template-columns: 1.15fr 1fr; gap: 80px; align-items: end;
  padding: 0 32px;
}
.hero-left { padding-bottom: 24px; }

.eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 48px; }
.eb-code { font-family: var(--f-mono); font-size: 10.5px; color: var(--signal); letter-spacing: 0.14em; font-weight: 500; }
.eb-sep { width: 28px; height: 1px; background: var(--ink); opacity: 0.5; }
.eb-text { font-family: var(--f-mono); font-size: 10.5px; color: var(--ink); letter-spacing: 0.18em; font-weight: 500; }

.headline {
  font-family: var(--f-sans);
  font-size: clamp(56px, 7.8vw, 120px);
  font-weight: 800;
  line-height: 0.94; letter-spacing: -0.045em;
  color: var(--ink);
  margin-bottom: 56px;
}
.hl-line { display: block; }
.hl-serif { font-family: var(--f-serif); font-style: italic; font-weight: 400; letter-spacing: -0.02em; color: var(--signal); display: flex; align-items: center; gap: 28px; }
.hl-serif-inner { display: inline-block; }
.hl-dash { flex: 1; height: 1px; background: var(--ink); opacity: 0.75; display: inline-block; max-width: 280px; margin-bottom: 0.25em; }
.hl-dot { color: var(--signal); }

.lede-wrap { display: flex; gap: 24px; margin-bottom: 56px; max-width: 560px; }
.lede-rule { width: 2px; background: var(--ink); flex-shrink: 0; }
.lede { font-size: 16px; color: var(--ink-2); line-height: 1.7; font-weight: 400; }
.lede em { font-family: var(--f-serif); font-style: italic; color: var(--ink); font-weight: 500; font-size: 18px; }

.cta-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.hero-meta { display: flex; flex-direction: column; gap: 2px; padding-left: 20px; margin-left: 12px; border-left: 1px solid var(--line); }
.hero-meta-k { font-family: var(--f-mono); font-size: 9.5px; color: var(--mute); letter-spacing: 0.14em; }
.hero-meta-v { font-family: var(--f-mono); font-size: 11px; color: var(--ink); font-weight: 500; }

/* hero foot spec strip */
.hero-foot {
  margin-top: 72px;
  padding: 20px 32px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  display: flex; flex-wrap: wrap; align-items: center; gap: 14px;
  font-family: var(--f-mono); font-size: 10.5px;
}
.hf-k { color: var(--mute); letter-spacing: 0.14em; font-weight: 500; }
.hf-v { color: var(--ink); letter-spacing: 0.02em; font-weight: 500; margin-right: 6px; }
.hf-sep { width: 1px; height: 11px; background: var(--line); }

/* Buttons */
.btn-primary {
  background: var(--ink); color: #fff; border: 1px solid var(--ink);
  cursor: pointer; font-weight: 500; letter-spacing: -0.01em;
  display: inline-flex; align-items: center; gap: 12px;
  transition: all .28s cubic-bezier(.2,.7,.2,1);
  position: relative; overflow: hidden;
}
.btn-primary:hover { background: var(--signal); border-color: var(--signal); transform: translateY(-1px); }
.btn-primary .btn-arrow, .btn-primary svg { transition: transform .3s; }
.btn-primary:hover .btn-arrow, .btn-primary:hover svg { transform: translateX(4px); }
.btn-ghost {
  background: transparent; color: var(--ink); border: 1px solid var(--ink);
  cursor: pointer; font-weight: 500; letter-spacing: -0.01em;
  transition: all .25s;
}
.btn-ghost:hover { background: var(--ink); color: #fff; }
.btn-sm { font-size: 12.5px; padding: 9px 16px; border-radius: 2px; display: inline-flex; align-items: center; gap: 8px; }
.btn-lg { font-size: 15px; padding: 16px 24px; border-radius: 2px; display: inline-flex; align-items: center; justify-content: center; }
.btn-primary.btn-lg { padding: 16px 20px 16px 28px; }
.btn-primary.btn-lg .btn-arrow { width: 28px; height: 28px; border-radius: 2px; background: rgba(255,255,255,0.14); display: flex; align-items: center; justify-content: center; }
.cta-row .btn-lg { min-width: 158px; height: 62px; }

/* ───────── INSTRUMENT PANEL ───────── */
.instrument {
  position: relative;
  background: #fff;
  border: 1px solid var(--line);
  padding: 28px 28px 24px;
  font-family: var(--f-mono);
}
.ct { position: absolute; width: 10px; height: 10px; border: 1px solid var(--ink); }
.ct-tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.ct-tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
.ct-bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
.ct-br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

.instr-head { display: flex; align-items: center; gap: 14px; font-size: 10px; letter-spacing: 0.14em; color: var(--mute); padding-bottom: 16px; border-bottom: 1px solid var(--line); margin-bottom: 20px; }
.instr-label { color: var(--signal); font-weight: 500; }
.instr-title { color: var(--ink); font-weight: 600; letter-spacing: 0.18em; }
.instr-live { margin-left: auto; display: flex; align-items: center; gap: 7px; color: var(--ink); font-weight: 500; }

/* gauge */
.gauge-wrap { position: relative; display: flex; flex-direction: column; align-items: center; padding: 8px 0 0; }
.gauge { width: 100%; max-width: 280px; height: auto; }
.axis-lbl { font-family: var(--f-mono); font-size: 8.5px; fill: var(--mute); letter-spacing: 0.1em; }
.gauge-readout { text-align: center; margin-top: -8px; }
.readout-main { font-family: var(--f-serif); font-style: italic; font-size: 52px; color: var(--ink); letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
.readout-cap { font-family: var(--f-mono); font-size: 9.5px; color: var(--mute); letter-spacing: 0.18em; margin-top: 10px; }

/* lanes */
.lanes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--line); margin: 24px 0 20px; border: 1px solid var(--line); }
.lane { background: #fff; padding: 12px 10px; display: flex; flex-direction: column; gap: 4px; transition: all .25s; }
.lane-k { font-size: 9px; letter-spacing: 0.1em; color: var(--mute); font-weight: 500; }
.lane-r { font-size: 10px; color: var(--ink); letter-spacing: 0.04em; font-variant-numeric: tabular-nums; }
.lane-active { background: var(--ink); }
.lane-active .lane-k { color: var(--signal); }
.lane-active .lane-r { color: #fff; }

/* features */
.feat-block { padding-top: 4px; }
.feat-head { display: flex; justify-content: space-between; font-size: 9.5px; color: var(--mute); letter-spacing: 0.14em; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px dashed var(--line); }
.feat-head .conf { color: var(--ink); font-weight: 500; }
.feat-row { display: grid; grid-template-columns: 150px 1fr 28px; gap: 14px; align-items: center; padding: 5px 0; font-size: 10.5px; }
.feat-n { color: var(--ink-2); font-size: 10.5px; letter-spacing: 0.02em; }
.feat-bar { background: var(--line-2); height: 4px; border-radius: 0; position: relative; overflow: hidden; }
.feat-fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--ink); transition: width .12s linear; }
.feat-row:nth-child(2) .feat-fill { background: var(--signal); }
.feat-v { text-align: right; color: var(--ink); font-weight: 500; font-variant-numeric: tabular-nums; }

/* ───────── STATS ───────── */
.stats {
  max-width: 1320px; margin: 0 auto;
  padding: 160px 80px 120px;
}
.stats-head { display: flex; align-items: baseline; gap: 20px; margin-bottom: 56px; padding-bottom: 20px; border-bottom: 1px solid var(--ink); }
.sec-code { font-family: var(--f-mono); font-size: 10.5px; color: var(--signal); letter-spacing: 0.16em; font-weight: 500; }
.sec-code-s { font-size: 9.5px; }
.sec-title { font-family: var(--f-serif); font-style: italic; font-size: 22px; color: var(--ink); }
.sec-h { font-family: var(--f-sans); font-size: clamp(36px, 4.5vw, 64px); font-weight: 700; color: var(--ink); letter-spacing: -0.035em; line-height: 1.05; margin-top: 14px; }
.sec-h-serif { font-family: var(--f-serif); font-style: italic; font-weight: 400; color: var(--signal); }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.stat { padding: 44px 28px; position: relative; border-right: 1px solid var(--line); }
.stat:last-child { border-right: none; }
.stat-ix { font-family: var(--f-mono); font-size: 10px; color: var(--mute); letter-spacing: 0.14em; margin-bottom: 24px; }
.stat-num { font-family: var(--f-sans); font-weight: 700; color: var(--ink); line-height: 0.9; letter-spacing: -0.05em; margin-bottom: 20px; display: flex; align-items: baseline; font-variant-numeric: tabular-nums; }
.sn-prefix { font-size: 48px; color: var(--signal); font-weight: 600; margin-right: 2px; }
.sn-val { font-size: 80px; }
.sn-suffix { font-size: 40px; color: var(--signal); font-weight: 500; margin-left: 2px; }
.stat-k { font-family: var(--f-mono); font-size: 10.5px; color: var(--ink); font-weight: 500; letter-spacing: 0.14em; margin-bottom: 4px; }
.stat-note { font-size: 12px; color: var(--mute); letter-spacing: 0.02em; }

/* ───────── PHASES ───────── */
.phases { max-width: 1320px; margin: 0 auto; padding: 80px 80px 120px; }
.phases-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; margin-bottom: 64px; padding-bottom: 20px; border-bottom: 1px solid var(--ink); }
.phases-head h2 { max-width: 680px; }

.phase-list { list-style: none; }
.phase-row {
  display: grid; grid-template-columns: 160px 1fr 80px;
  gap: 48px; align-items: start;
  padding: 56px 0;
  border-bottom: 1px solid var(--line);
  position: relative;
  opacity: 0; transform: translateY(20px);
  transition: all 1s cubic-bezier(.2,.7,.2,1);
}
.phase-row.in { opacity: 1; transform: translateY(0); }
.phase-row:hover { background: rgba(232,0,29,0.015); }
.phase-row:hover .pr-line span { width: 100%; }
.phase-row:hover .pr-num { color: var(--signal); }

.pr-line { position: absolute; top: 0; left: 0; height: 1px; width: 100%; pointer-events: none; overflow: hidden; }
.phase-row:first-child .pr-line { display: none; }
.pr-line span { display: block; height: 1px; background: var(--signal); width: 0%; transition: width 1s cubic-bezier(.2,.7,.2,1); }

.pr-num { font-family: var(--f-serif); font-style: italic; font-weight: 400; font-size: 140px; color: var(--ink); line-height: 0.85; letter-spacing: -0.04em; transition: color .4s; }
.pr-body { padding-top: 20px; }
.pr-head { display: flex; align-items: baseline; gap: 24px; margin-bottom: 20px; flex-wrap: wrap; }
.pr-weeks { font-family: var(--f-mono); font-size: 11px; color: var(--signal); letter-spacing: 0.16em; font-weight: 500; }
.pr-title { font-family: var(--f-sans); font-size: 36px; font-weight: 700; color: var(--ink); letter-spacing: -0.025em; }
.pr-sub { font-size: 15px; color: var(--ink-2); line-height: 1.75; max-width: 620px; }
.pr-tag { font-family: var(--f-mono); font-size: 10px; color: var(--mute); letter-spacing: 0.16em; padding-top: 24px; writing-mode: vertical-rl; transform: rotate(180deg); justify-self: end; }

/* ───────── PRINCIPLES ───────── */
.principles {
  background: var(--ink); color: #fff;
  padding: 140px 0 120px;
  position: relative; overflow: hidden;
  margin-top: 40px;
}
.principles::before {
  content: ""; position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
}
.principles-inner { max-width: 1320px; margin: 0 auto; padding: 0 80px; position: relative; z-index: 1; }
.principles-head { margin-bottom: 72px; max-width: 780px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.12); }
.sec-code-dark { color: var(--signal); }
.sec-h-dark { color: #fff; }
.sec-h-serif-dark { color: var(--signal); }
.principles-lede { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.75; margin-top: 28px; max-width: 560px; }

.principle-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.principle {
  position: relative;
  padding: 40px 32px 32px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  opacity: 0; transform: translateY(18px);
  transition: all 1s cubic-bezier(.2,.7,.2,1);
}
.principle.in { opacity: 1; transform: translateY(0); }
.principle:hover { background: rgba(255,255,255,0.06); border-color: rgba(232,0,29,0.4); }
.principle-corner { position: absolute; width: 8px; height: 8px; border: 1px solid var(--signal); }
.principle-corner.ct-tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.principle-corner.ct-tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
.principle-corner.ct-bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
.principle-corner.ct-br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

.principle-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.principle-n { font-family: var(--f-mono); font-size: 11px; color: var(--signal); letter-spacing: 0.16em; font-weight: 500; }
.principle-tag { font-family: var(--f-mono); font-size: 9px; color: rgba(255,255,255,0.4); letter-spacing: 0.14em; padding: 4px 9px; border: 1px solid rgba(255,255,255,0.15); }
.principle-title { font-family: var(--f-serif); font-style: italic; font-weight: 400; font-size: 34px; color: #fff; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 20px; }
.principle-body { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.75; min-height: 100px; }
.principle-foot { margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); }
.principle-seal { font-family: var(--f-mono); font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 0.14em; }

/* ───────── FOOTER ───────── */
.foot { border-top: 1px solid var(--line); padding: 32px 0; background: var(--canvas); }
.foot-inner { max-width: 1320px; margin: 0 auto; padding: 0 80px; display: flex; justify-content: space-between; align-items: center; }
.foot-left { display: flex; align-items: center; gap: 14px; }
.foot-mark { width: 22px; height: 22px; border-radius: 3px; }
.foot-brand { font-family: var(--f-serif); font-style: italic; font-size: 17px; color: var(--ink); letter-spacing: -0.3px; }
.foot-bank { font-family: var(--f-mono); font-size: 10.5px; color: var(--mute); letter-spacing: 0.12em; padding-left: 12px; border-left: 1px solid var(--line); }
.foot-right { display: flex; align-items: baseline; gap: 12px; }
.foot-k { font-family: var(--f-mono); font-size: 10px; color: var(--mute); letter-spacing: 0.14em; }
.foot-v { font-family: var(--f-mono); font-size: 11px; color: var(--ink); font-weight: 500; letter-spacing: 0.02em; }

/* ───────── DOCS ───────── */
.docs { display: flex; height: calc(100vh - 98px); font-family: var(--f-sans); position: relative; z-index: 2; }
.docs-side { width: 292px; min-width: 292px; height: 100%; overflow-y: auto; background: var(--canvas); border-right: 1px solid var(--line); flex-shrink: 0; }
.docs-side-head { padding: 20px 24px 16px; border-bottom: 1px solid var(--line); }
.docs-side-note { font-family: var(--f-mono); font-size: 10.5px; color: var(--mute); letter-spacing: 0.1em; margin-top: 4px; }
.docs-side-body { padding: 8px 0 32px; }
.docs-phase { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 24px; background: none; border: none; cursor: pointer; text-align: left; }
.docs-phase-lbl { flex: 1; font-family: var(--f-serif); font-style: italic; font-size: 15px; color: var(--ink); }
.docs-chev { color: var(--mute); transition: transform .2s; display: flex; }
.docs-chev.closed { transform: rotate(-90deg); }
.docs-phase-weeks { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.1em; padding: 0 24px 6px 46px; }
.docs-week { width: 100%; display: flex; align-items: center; gap: 8px; padding: 5px 18px 5px 36px; background: none; border: none; cursor: pointer; text-align: left; color: var(--mute); }
.docs-week-lbl { flex: 1; font-size: 12px; color: var(--ink-2); font-weight: 500; }
.docs-file { width: 100%; display: flex; align-items: center; gap: 8px; padding: 5px 14px 5px 52px; background: none; border: none; border-left: 2px solid transparent; cursor: pointer; text-align: left; color: var(--mute); transition: all .12s; font-family: var(--f-mono); }
.docs-file.sel { background: rgba(232,0,29,0.05); }
.docs-file-lbl { font-size: 11px; color: inherit; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; letter-spacing: 0.02em; }
.docs-main { flex: 1; overflow-y: auto; background: #fff; padding: 0 0 80px; }
.docs-article { max-width: 780px; margin: 0 auto; padding: 56px 56px 72px; }
.docs-empty { display: flex; align-items: center; justify-content: center; height: 60%; color: var(--mute); font-size: 14px; }

.md-body h1 { font-family: var(--f-serif); font-style: italic; font-size: 44px; font-weight: 400; color: var(--ink); letter-spacing: -0.025em; margin: 0 0 12px; line-height: 1.1; }
.md-body h2 { font-family: var(--f-sans); font-size: 22px; font-weight: 700; color: var(--ink); margin: 40px 0 14px; letter-spacing: -0.02em; padding-bottom: 10px; border-bottom: 1px solid var(--line); }
.md-body h3 { font-family: var(--f-sans); font-size: 17px; font-weight: 600; color: var(--ink); margin: 28px 0 10px; letter-spacing: -0.01em; }
.md-body h4 { font-family: var(--f-mono); font-size: 10.5px; font-weight: 500; color: var(--signal); text-transform: uppercase; letter-spacing: 0.14em; margin: 20px 0 8px; }
.md-body p { font-size: 15px; color: var(--ink-2); line-height: 1.8; margin: 0 0 14px; }
.md-body strong { color: var(--ink); font-weight: 600; }
.md-body em { font-family: var(--f-serif); font-style: italic; color: var(--ink); font-weight: 400; font-size: 17px; }
.md-body code { font-family: var(--f-mono); font-size: 12.5px; background: var(--canvas-2); color: var(--signal); padding: 2px 6px; border-radius: 2px; }
.md-body pre { background: var(--ink); border-radius: 4px; padding: 20px 22px; margin: 18px 0; overflow-x: auto; }
.md-body pre code { background: none; color: #E0E0E0; font-size: 12.5px; padding: 0; line-height: 1.7; }
.md-body blockquote { border-left: 2px solid var(--signal); padding: 12px 18px; background: rgba(232,0,29,0.04); margin: 18px 0; color: var(--signal-2); font-family: var(--f-serif); font-style: italic; font-size: 16px; line-height: 1.7; }
.md-body ul, .md-body ol { padding-left: 24px; margin: 0 0 14px; color: var(--ink-2); }
.md-body li { font-size: 15px; line-height: 1.8; margin-bottom: 4px; }
.md-body hr { border: none; border-top: 1px solid var(--line); margin: 32px 0; }
.md-body table { width: 100%; border-collapse: collapse; font-size: 13.5px; margin: 18px 0; border: 1px solid var(--line); }
.md-body th { background: var(--canvas-2); font-family: var(--f-mono); font-size: 10.5px; font-weight: 500; color: var(--ink); padding: 10px 14px; text-align: left; letter-spacing: 0.12em; border-bottom: 1px solid var(--line); text-transform: uppercase; }
.md-body td { padding: 10px 14px; border-bottom: 1px solid var(--line-2); color: var(--ink-2); font-size: 13.5px; }
.md-body tr:last-child td { border-bottom: none; }
.md-body a { color: var(--signal); text-decoration: underline; text-underline-offset: 2px; }
.md-body ul.cl-ul { list-style: none; padding-left: 0; }
.md-body li.checklist { display: flex; align-items: flex-start; gap: 10px; padding: 3px 0; }
.md-body li.checklist::before { content: '☐'; color: var(--mute-2); flex-shrink: 0; margin-top: 2px; }
.md-body li.checked::before { content: '☑'; color: var(--signal); }

aside::-webkit-scrollbar { width: 3px; }
aside::-webkit-scrollbar-thumb { background: var(--line); border-radius: 2px; }
main::-webkit-scrollbar { width: 4px; }
main::-webkit-scrollbar-thumb { background: var(--line); border-radius: 2px; }

/* Back top */
.back-top {
  position: fixed; bottom: 32px; right: 32px; z-index: 50;
  background: var(--ink); color: #fff; border: none; border-radius: 2px;
  width: 42px; height: 42px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .25s;
}
.back-top:hover { background: var(--signal); transform: translateY(-2px); }

/* ───────── DEMO PLACEHOLDER ───────── */
.demo-ph { min-height: calc(100vh - 98px); display: flex; align-items: center; justify-content: center; background: var(--canvas); position: relative; z-index: 2; }
.demo-ph-inner { text-align: center; max-width: 440px; }
.demo-ph-mark { width: 56px; height: 56px; background: #fff; border: 1px solid var(--line); border-radius: 2px; display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; }
.demo-ph-h { font-family: var(--f-serif); font-style: italic; font-size: 40px; font-weight: 400; color: var(--ink); margin-bottom: 16px; letter-spacing: -0.02em; }
.demo-ph-p { font-size: 14.5px; color: var(--ink-2); line-height: 1.75; margin-bottom: 32px; }

/* ───────── RESPONSIVE ───────── */
@media (max-width: 1100px) {
  .hero-grid { grid-template-columns: 1fr; gap: 56px; }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .stat:nth-child(2) { border-right: none; }
  .stat:nth-child(1), .stat:nth-child(2) { border-bottom: 1px solid var(--line); }
  .principle-grid { grid-template-columns: 1fr; }
  .phase-row { grid-template-columns: 100px 1fr; gap: 28px; }
  .pr-num { font-size: 88px; }
  .pr-title { font-size: 28px; }
  .pr-tag { display: none; }
}
@media (max-width: 720px) {
  .nav { padding: 0 20px; grid-template-columns: 1fr auto; }
  .nav-center { display: none; }
  .brand-tag { display: none; }
  .hero { padding: 56px 20px 32px; }
  .hero::before, .hero::after { display: none; }
  .hero-grid { padding: 0; }
  .stats, .phases, .principles-inner, .foot-inner { padding-left: 24px; padding-right: 24px; }
  .principles { padding: 80px 0; }
  .stats { padding-top: 80px; padding-bottom: 60px; }
  .phases { padding-top: 40px; padding-bottom: 60px; }
  .sn-val { font-size: 56px; }
  .sn-prefix { font-size: 32px; } .sn-suffix { font-size: 26px; }
  .stat { padding: 32px 20px; }
  .hero-foot { flex-direction: column; align-items: flex-start; gap: 8px; padding: 20px; }
  .hf-sep { display: none; }
  .phases-head, .foot-inner { flex-direction: column; align-items: flex-start; gap: 20px; }
}
`;
