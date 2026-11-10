import { useState, useEffect, useRef, useMemo } from "react";
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
      sections[sectionId].folders[folderId] = { id: `${sectionId}/${folderId}`, label: folderId.trim(), files: [] };
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
const FLAT_DOCS = DOCS_TREE.flatMap(p => p.folders.flatMap(f => f.files.map(file => ({ ...file, folder: f.label, folderId: f.id, phaseId: p.id }))));

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Svg = ({ size = 14, sw = 1.8, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const ChevronDown = () => <Svg sw={2}><polyline points="6 9 12 15 18 9"/></Svg>;
const FileIcon = () => <Svg size={12} sw={1.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></Svg>;
const FolderIcon = () => <Svg sw={1.5}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></Svg>;
const Arrow = ({ size = 14 }) => <Svg size={size}><line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/></Svg>;
const ArrowLeft = () => <Svg size={13}><line x1="20" y1="12" x2="4" y2="12"/><polyline points="11 5 4 12 11 19"/></Svg>;
const ArrowUp = () => <Svg size={16} sw={2}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></Svg>;
const SearchIcon = () => <Svg size={13}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></Svg>;
const MenuIcon = () => <Svg size={15}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></Svg>;
const PulseIcon = ({ size = 13 }) => <Svg size={size} sw={2.4}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></Svg>;

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

function useCountUp(target, duration = 1400, trigger = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setVal(target); return; }
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      setVal(target * (1 - Math.pow(1 - p, 4)));
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

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const now = useNow();

  return (
    <nav className="nav" aria-label="Điều hướng chính">
      <button onClick={() => navigate("/")} className="brand" aria-label="AI-CRDS, về trang chủ">
        <span className="brand-mark"><PulseIcon/></span>
        <span className="brand-name">AI-CRDS</span>
        <span className="brand-tag">BANK X · INTERNAL</span>
      </button>

      <span className="nav-clock" aria-hidden="true"><span className="dot dot-ok"/>{fmtTime(now)} GMT+7</span>

      <div className="nav-right">
        {[{ id: "home", label: "Home", path: "/" }, { id: "docs", label: "Docs", path: "/docs" }].map(p => (
          <button
            key={p.id}
            onClick={() => navigate(p.path)}
            aria-current={location.pathname === p.path ? "page" : undefined}
            className={`nav-link ${location.pathname === p.path ? "nav-link-active" : ""}`}
          >
            {p.label}
          </button>
        ))}
        <button onClick={() => { window.location.href = "/demo/"; }} className="btn btn-primary btn-sm">
          Try Demo <Arrow size={12}/>
        </button>
      </div>
    </nav>
  );
}

// ─── DECISION CONSOLE (hero right) ────────────────────────────────────────────
const QUEUE = [
  { id: "APPL-2845", score: 0.18, key: "approve", label: "AUTO-APPROVE" },
  { id: "APPL-2846", score: 0.81, key: "reject",  label: "REJECT" },
  { id: "APPL-2847", score: 0.58, key: "review",  label: "REVIEW", selected: true },
  { id: "APPL-2848", score: 0.92, key: "escalate", label: "ESCALATE · FRAUD" },
];

function DecisionConsole() {
  const score = useCountUp(58, 1400);
  const conf = useCountUp(92, 1400);
  const f1 = useCountUp(78, 1500);
  const f2 = useCountUp(54, 1600);
  const f3 = useCountUp(43, 1700);

  return (
    <div className="console" role="img" aria-label="Minh họa một ca thẩm định: điểm rủi ro 0,58, quyết định Review, độ tin cậy 92%">
      <div className="console-head">
        <span className="console-title"><PulseIcon size={12}/> DECISION CONSOLE</span>
        <span className="badge badge-mute">DỮ LIỆU MINH HỌA</span>
      </div>

      <div className="console-case">
        <div>
          <div className="k">CASE</div>
          <div className="case-id">APPL-2847</div>
        </div>
        <div className="case-score">
          <div className="k">RISK PROBABILITY · DEFAULT</div>
          <div className="score-num">0.{String(Math.round(score)).padStart(2, "0")}</div>
        </div>
      </div>

      <div className="scale" aria-hidden="true">
        <div className="scale-track">
          <span className="zone zone-approve" style={{ width: "30%" }}/>
          <span className="zone zone-review" style={{ width: "40%" }}/>
          <span className="zone zone-reject" style={{ width: "30%" }}/>
          <span className="marker" style={{ left: `${score}%` }}/>
        </div>
        <div className="scale-ticks"><span>0.00</span><span>0.30</span><span>0.70</span><span>1.00</span></div>
      </div>

      <div className="lanes">
        {[
          { key: "approve", name: "AUTO-APPROVE", range: "0.00–0.29" },
          { key: "review",  name: "REVIEW",       range: "0.30–0.69", active: true },
          { key: "reject",  name: "REJECT",       range: "0.70–1.00" },
          { key: "escalate", name: "ESCALATE",    range: "FRAUD" },
        ].map(l => (
          <div key={l.key} className={`lane lane-${l.key} ${l.active ? "lane-active" : ""}`}>
            <div className="lane-k">{l.name}</div>
            <div className="lane-r">{l.range}</div>
          </div>
        ))}
      </div>

      <div className="feat-block">
        <div className="feat-head">
          <span>TOP SIGNAL CONTRIBUTIONS</span>
          <span className="feat-conf">CONF {Math.round(conf)}%</span>
        </div>
        {[
          { n: "payment_history_12m", v: f1 },
          { n: "utilization_ratio", v: f2 },
          { n: "income_stability_score", v: f3 },
        ].map((f, i) => (
          <div key={i} className="feat-row">
            <span className="feat-n">{f.n}</span>
            <span className="feat-bar"><span className="feat-fill" style={{ width: `${f.v}%` }}/></span>
            <span className="feat-v">{String(Math.round(f.v)).padStart(2, "0")}</span>
          </div>
        ))}
      </div>

      <table className="queue">
        <thead><tr><th>HỒ SƠ</th><th>ĐIỂM</th><th>QUYẾT ĐỊNH</th></tr></thead>
        <tbody>
          {QUEUE.map(q => (
            <tr key={q.id} className={q.selected ? "queue-sel" : ""}>
              <td>{q.id}</td>
              <td>{q.score.toFixed(2)}</td>
              <td><span className={`pill pill-${q.key}`}>{q.label}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── HOMEPAGE ─────────────────────────────────────────────────────────────────
function Homepage() {
  const navigate = useNavigate();

  const [statsRef, statsIn] = useInView(0.3);
  const v30 = useCountUp(30, 1200, statsIn);
  const v50 = useCountUp(50, 1400, statsIn);
  const v60 = useCountUp(60, 1200, statsIn);
  const v4  = useCountUp(4,  900,  statsIn);

  const principles = [
    { n: "P/01", title: "Human-in-the-Loop", tag: "SBV REQUIRED",
      body: "Credit Officer là final decision maker. AI chỉ là support — SBV requirement, không thể bypass." },
    { n: "P/02", title: "Privacy by Design", tag: "NĐ13/2023",
      body: "DPIA theo Nghị định 13/2023 từ ngày đầu. Không dùng real data trước khi governance được approve." },
    { n: "P/03", title: "Champion–Challenger", tag: "MLOPS CORE",
      body: "Không auto-deploy model mới. Validate → Risk review → CAB approval → Canary → Monitor." },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="eyebrow rise" style={{ animationDelay: "40ms" }}>
              <span className="dot dot-ok"/>
              <span>INTERNAL ROADMAP</span>
              <span className="eb-sep"/>
              <span>v0.1.0 · MVP</span>
            </div>

            <h1 className="headline rise" style={{ animationDelay: "120ms" }}>
              Credit Risk<br/>Decision Support<span className="hl-dot">.</span>
            </h1>

            <p className="lede rise" style={{ animationDelay: "200ms" }}>
              Hệ thống AI hỗ trợ quyết định tín dụng thế hệ mới. Origination Scoring và Fraud Detection tại điểm phát hành thẻ tín dụng retail — inhouse, compliant, production-grade.
            </p>

            <div className="cta-row rise" style={{ animationDelay: "280ms" }}>
              <button onClick={() => { window.location.href = "/demo/"; }} className="btn btn-primary btn-lg">
                Try Demo <Arrow size={15}/>
              </button>
              <button onClick={() => navigate("/docs")} className="btn btn-ghost btn-lg">
                View Docs
              </button>
            </div>
          </div>

          <div className="hero-right rise" style={{ animationDelay: "160ms" }}>
            <DecisionConsole/>
          </div>
        </div>

        <dl className="spec rise" style={{ animationDelay: "360ms" }}>
          {[
            ["USE CASE", "Credit Card · Retail Origination"],
            ["LAYER 1", "Origination Scoring"],
            ["LAYER 2", "Fraud Detection"],
            ["DECISIONS", "Auto-Approve · Review · Reject · Escalate"],
          ].map(([k, v]) => (
            <div key={k} className="spec-cell"><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </section>

      <section ref={statsRef} className="block" aria-labelledby="stats-h">
        <div className="block-head">
          <span className="sec-code">§ 02 / METRICS</span>
          <h2 id="stats-h" className="sec-title">Target Outcomes</h2>
        </div>
        <div className="stats-row">
          {[
            { prefix: "−", val: v30, suffix: "%", k: "MANUAL REVIEW RATE", note: "target reduction" },
            { prefix: "−", val: v50, suffix: "%", k: "TIME-TO-DECISION", note: "target improvement" },
            { prefix: "", val: v60, suffix: "", k: "WEEKS", note: "total roadmap" },
            { prefix: "", val: v4, suffix: "", k: "PHASES", note: "foundation → scale" },
          ].map((s, i) => (
            <div key={i} className="stat">
              <div className="stat-k">{s.k}</div>
              <div className="stat-num">
                <span className="sn-prefix">{s.prefix}</span>
                <span>{Math.round(s.val)}</span>
                <span className="sn-suffix">{s.suffix}</span>
              </div>
              <div className="stat-note">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="principles-h">
        <div className="block-head">
          <span className="sec-code">§ 04 / NON-NEGOTIABLES</span>
          <h2 id="principles-h" className="sec-title">Nguyên tắc cốt lõi</h2>
        </div>
        <p className="block-lede">
          Ba nguyên tắc neo toàn bộ hệ thống — governance, privacy, model safety. Tất cả engineering decision phải thông qua các constraint này.
        </p>
        <div className="principle-grid">
          {principles.map((p, i) => <PrincipleCard key={i} {...p} idx={i}/>)}
        </div>
      </section>

      <footer className="foot">
        <div className="foot-inner">
          <div className="foot-left">
            <span className="brand-mark foot-mark"><PulseIcon size={11}/></span>
            <span className="foot-brand">AI-CRDS</span>
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

function PrincipleCard({ n, title, body, tag, idx }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} className={`principle ${inView ? "in" : ""}`} style={{ transitionDelay: `${idx * 90}ms` }}>
      <div className="principle-head">
        <span className="principle-n">{n}</span>
        <span className="badge badge-mute">{tag}</span>
      </div>
      <h3 className="principle-title">{title}</h3>
      <p className="principle-body">{body}</p>
    </div>
  );
}

// ─── DOCS PAGE ────────────────────────────────────────────────────────────────
const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function DocsPage() {
  const [openPhases, setOpenPhases] = useState({ "Foundation & Internal Proposal": true });
  const [openWeeks, setOpenWeeks] = useState({ "Foundation & Internal Proposal/W1. Problem Framing": true });
  const [selectedDoc, setSelectedDoc] = useState("Foundation & Internal Proposal/W1. Problem Framing/w01-01-use-case-shortlist.md");
  const [query, setQuery] = useState("");
  const [sideOpen, setSideOpen] = useState(false);
  const [toc, setToc] = useState([]);
  const [activeId, setActiveId] = useState("");
  const contentRef = useRef(null);
  const articleRef = useRef(null);
  const [showTop, setShowTop] = useState(false);

  const docContent = getDocContent(selectedDoc);
  const html = useMemo(() => renderMarkdown(docContent), [docContent]);
  const idx = FLAT_DOCS.findIndex(d => d.id === selectedDoc);
  const cur = FLAT_DOCS[idx];
  const prev = idx > 0 ? FLAT_DOCS[idx - 1] : null;
  const next = idx >= 0 && idx < FLAT_DOCS.length - 1 ? FLAT_DOCS[idx + 1] : null;

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    const used = new Set();
    const items = [];
    root.querySelectorAll("h2, h3").forEach(h => {
      let id = slugify(h.textContent) || "muc";
      while (used.has(id)) id += "-";
      used.add(id);
      h.id = id;
      items.push({ id, text: h.textContent, level: h.tagName === "H2" ? 2 : 3 });
    });
    setToc(items);
    setActiveId(items[0]?.id ?? "");
  }, [html]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const h = () => {
      setShowTop(el.scrollTop > 280);
      const heads = articleRef.current?.querySelectorAll("h2[id], h3[id]") ?? [];
      let a = "";
      heads.forEach(n => { if (n.offsetTop - 96 <= el.scrollTop) a = n.id; });
      setActiveId(a || heads[0]?.id || "");
    };
    el.addEventListener("scroll", h, { passive: true });
    return () => el.removeEventListener("scroll", h);
  }, [html]);

  const PHASE_COLORS = ["#FF5C6C", "#6CB6FF", "#B794F6", "#F5B73B", "#3DDC97", "#4FD1C5", "#F687B3", "#F6AD55", "#A3E635", "#63B3ED", "#FC8181", "#9F7AEA"];
  const selectFile = (fileId) => {
    setSelectedDoc(fileId);
    setSideOpen(false);
    contentRef.current?.scrollTo({ top: 0 });
  };
  const jump = (id) => {
    const el = articleRef.current?.querySelector(`#${CSS.escape(id)}`);
    if (el) contentRef.current?.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  const q = query.trim().toLowerCase();

  return (
    <div className="docs">
      <button className="docs-toggle" onClick={() => setSideOpen(o => !o)} aria-expanded={sideOpen} aria-controls="docs-side">
        <MenuIcon/> <span>Mục lục tài liệu</span>
        <span className="docs-toggle-cur">{cur?.label}</span>
      </button>

      <aside id="docs-side" className={`docs-side ${sideOpen ? "open" : ""}`}>
        <div className="docs-side-head">
          <div className="sec-code">§ DOCUMENTATION</div>
          <div className="docs-side-note">Foundation · W1–W12 · {FLAT_DOCS.length} tài liệu</div>
          <label className="docs-search">
            <SearchIcon/>
            <input
              type="search" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Tìm tài liệu" aria-label="Tìm tài liệu"
            />
          </label>
        </div>
        <div className="docs-side-body">
          {DOCS_TREE.map((phase, pi) => {
            const pc = PHASE_COLORS[pi % PHASE_COLORS.length];
            const isPhaseOpen = q ? true : openPhases[phase.id];
            return (
              <div key={phase.id}>
                <button onClick={() => setOpenPhases(p => ({ ...p, [phase.id]: !p[phase.id] }))} className="docs-phase" aria-expanded={isPhaseOpen}>
                  <span style={{ color: pc }}><FolderIcon/></span>
                  <span className="docs-phase-lbl">{phase.label}</span>
                  <span className={`docs-chev ${isPhaseOpen ? "" : "closed"}`}><ChevronDown/></span>
                </button>
                <div className="docs-phase-weeks">{phase.note}</div>

                {isPhaseOpen && phase.folders.map(folder => {
                  const files = q ? folder.files.filter(f => (f.label + " " + folder.label).toLowerCase().includes(q)) : folder.files;
                  if (q && files.length === 0) return null;
                  const isWeekOpen = q ? true : openWeeks[folder.id];
                  return (
                    <div key={folder.id}>
                      <button onClick={() => setOpenWeeks(w => ({ ...w, [folder.id]: !w[folder.id] }))} className="docs-week" aria-expanded={isWeekOpen}>
                        <span><FolderIcon/></span>
                        <span className="docs-week-lbl">{folder.label}</span>
                        <span className={`docs-chev ${isWeekOpen ? "" : "closed"}`}><ChevronDown/></span>
                      </button>
                      {isWeekOpen && files.map(file => {
                        const isSel = selectedDoc === file.id;
                        return (
                          <button
                            key={file.id}
                            onClick={() => selectFile(file.id)}
                            aria-current={isSel ? "page" : undefined}
                            className={`docs-file ${isSel ? "sel" : ""}`}
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
          {q && !FLAT_DOCS.some(f => (f.label + " " + f.folder).toLowerCase().includes(q)) && (
            <div className="docs-none">Không có tài liệu khớp “{query}”.</div>
          )}
        </div>
      </aside>
      {sideOpen && <div className="docs-scrim" onClick={() => setSideOpen(false)} aria-hidden="true"/>}

      <main ref={contentRef} className="docs-main">
        {docContent ? (
          <div className="docs-layout">
            <article className="docs-article">
              <div className="crumbs">
                <span>Docs</span><span className="crumb-sep">/</span>
                <span>{cur?.folder}</span><span className="crumb-sep">/</span>
                <span className="crumb-cur">{cur?.label}</span>
              </div>
              <div ref={articleRef} className="md-body" dangerouslySetInnerHTML={{ __html: html }}/>
              <nav className="pager" aria-label="Điều hướng tài liệu">
                {prev ? (
                  <button className="pager-btn" onClick={() => selectFile(prev.id)}>
                    <span className="pager-k"><ArrowLeft/> TRƯỚC</span>
                    <span className="pager-v">{prev.label}</span>
                  </button>
                ) : <span/>}
                {next ? (
                  <button className="pager-btn pager-next" onClick={() => selectFile(next.id)}>
                    <span className="pager-k">SAU <Arrow size={13}/></span>
                    <span className="pager-v">{next.label}</span>
                  </button>
                ) : <span/>}
              </nav>
            </article>

            {toc.length > 1 && (
              <aside className="toc" aria-label="Trên trang này">
                <div className="toc-k">TRÊN TRANG NÀY</div>
                <ul>
                  {toc.map(t => (
                    <li key={t.id}>
                      <button
                        onClick={() => jump(t.id)}
                        className={`toc-link toc-l${t.level} ${activeId === t.id ? "on" : ""}`}
                        aria-current={activeId === t.id ? "location" : undefined}
                      >
                        {t.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
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
        <div className="demo-ph-mark"><PulseIcon size={22}/></div>
        <h2 className="demo-ph-h">Demo Coming Soon</h2>
        <p className="demo-ph-p">Demo MVP v1 đang được build tại Week 12 milestone. Synthetic data modeled theo Bank X data structure.</p>
        <button onClick={() => navigate("/")} className="btn btn-primary btn-lg"><ArrowLeft/> Back to Home</button>
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
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Geist:wght@300;400;500;600;700&display=swap');

:root {
  --bg:       #0B0D10;
  --panel:    #11151A;
  --panel-2:  #171C22;
  --line:     #232A33;
  --line-2:   #1A2028;
  --text:     #E6E9ED;
  --text-2:   #B4BCC6;
  --mute:     #8B95A1;
  --accent:   #FF3B4E;
  --accent-2: #FF5C6C;
  --link:     #6CB6FF;
  --ok:       #3DDC97;
  --warn:     #F5B73B;
  --bad:      #FF5C6C;
  --esc:      #B794F6;
  --f-sans:   'Geist', system-ui, -apple-system, sans-serif;
  --f-mono:   'JetBrains Mono', ui-monospace, monospace;
  --nav-h:    56px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; color-scheme: dark; }
body { font-family: var(--f-sans); background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }
button { font-family: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--link); outline-offset: 2px; }
.k { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.12em; color: var(--mute); }

.dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.dot-ok { background: var(--ok); box-shadow: 0 0 0 3px rgba(61,220,151,0.15); }

/* ───────── NAV ───────── */
.nav {
  position: sticky; top: 0; z-index: 100; height: var(--nav-h);
  background: rgba(11,13,16,0.9); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
  padding: 0 32px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
}
.brand { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px; padding: 0; justify-self: start; }
.brand-mark { width: 24px; height: 24px; background: var(--accent); color: #fff; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; }
.brand-name { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.brand-tag { font-family: var(--f-mono); font-size: 10px; color: var(--mute); letter-spacing: 0.1em; padding-left: 10px; border-left: 1px solid var(--line); }
.nav-clock { font-family: var(--f-mono); font-size: 11px; color: var(--mute); letter-spacing: 0.06em; display: flex; align-items: center; gap: 8px; font-variant-numeric: tabular-nums; }
.nav-right { justify-self: end; display: flex; align-items: center; gap: 4px; }
.nav-link { background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 500; color: var(--mute); padding: 8px 12px; border-radius: 6px; transition: color .15s, background .15s; }
.nav-link:hover { color: var(--text); background: var(--panel); }
.nav-link-active { color: var(--text); background: var(--panel-2); }

/* ───────── BUTTONS ───────── */
.btn { cursor: pointer; font-weight: 500; display: inline-flex; align-items: center; justify-content: center; gap: 10px; border-radius: 6px; border: 1px solid transparent; transition: background .15s, border-color .15s, transform .15s; }
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: var(--accent-2); }
.btn-primary svg { transition: transform .2s; }
.btn-primary:hover svg { transform: translateX(3px); }
.btn-ghost { background: transparent; color: var(--text); border-color: var(--line); }
.btn-ghost:hover { background: var(--panel-2); border-color: var(--mute); }
.btn-sm { font-size: 12.5px; padding: 8px 14px; margin-left: 6px; }
.btn-lg { font-size: 14.5px; padding: 0 22px; height: 48px; min-width: 148px; }

.badge { font-family: var(--f-mono); font-size: 9.5px; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 4px; border: 1px solid var(--line); }
.badge-mute { color: var(--mute); }

/* ───────── MOTION ───────── */
.rise { opacity: 0; transform: translateY(10px); animation: rise .6s cubic-bezier(.2,.7,.2,1) forwards; }
@keyframes rise { to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .rise { animation: none; opacity: 1; transform: none; }
  html { scroll-behavior: auto; }
  * { transition-duration: 0.01ms !important; }
}

/* ───────── HERO ───────── */
.home { position: relative; }
.hero { max-width: 1280px; margin: 0 auto; padding: 72px 40px 40px; }
.hero-grid { display: grid; grid-template-columns: 1fr 1.02fr; gap: 64px; align-items: center; }
.eyebrow { display: inline-flex; align-items: center; gap: 12px; font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.12em; color: var(--text-2); padding: 6px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--panel); margin-bottom: 32px; }
.eb-sep { width: 1px; height: 11px; background: var(--line); }
.headline { font-size: clamp(40px, 5.4vw, 76px); font-weight: 700; line-height: 1.02; letter-spacing: -0.04em; margin-bottom: 28px; }
.hl-dot { color: var(--accent); }
.lede { font-size: 16.5px; line-height: 1.7; color: var(--text-2); max-width: 540px; margin-bottom: 36px; }
.cta-row { display: flex; gap: 12px; flex-wrap: wrap; }

.spec { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 56px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); overflow: hidden; }
.spec-cell { padding: 16px 20px; border-right: 1px solid var(--line); }
.spec-cell:last-child { border-right: none; }
.spec dt { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.12em; color: var(--mute); margin-bottom: 6px; }
.spec dd { font-size: 13.5px; color: var(--text); font-weight: 500; line-height: 1.45; }

/* ───────── DECISION CONSOLE ───────── */
.console { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; font-family: var(--f-mono); box-shadow: 0 24px 60px -30px rgba(0,0,0,0.8); }
.console-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-bottom: 1px solid var(--line); background: var(--panel-2); }
.console-title { display: inline-flex; align-items: center; gap: 8px; font-size: 10.5px; letter-spacing: 0.14em; color: var(--text); font-weight: 500; }
.console-case { display: flex; align-items: flex-end; justify-content: space-between; padding: 20px 20px 4px; gap: 16px; }
.case-id { font-size: 15px; font-weight: 500; margin-top: 6px; }
.case-score { text-align: right; }
.score-num { font-family: var(--f-sans); font-size: 56px; font-weight: 600; letter-spacing: -0.04em; line-height: 1; margin-top: 6px; font-variant-numeric: tabular-nums; color: var(--warn); }

.scale { padding: 18px 20px 4px; }
.scale-track { position: relative; display: flex; height: 8px; border-radius: 4px; overflow: visible; }
.zone { height: 100%; opacity: 0.85; }
.zone-approve { background: var(--ok); border-radius: 4px 0 0 4px; }
.zone-review { background: var(--warn); }
.zone-reject { background: var(--bad); border-radius: 0 4px 4px 0; }
.marker { position: absolute; top: -5px; width: 3px; height: 18px; background: var(--text); border-radius: 2px; transform: translateX(-50%); box-shadow: 0 0 0 3px rgba(11,13,16,0.9); }
.scale-ticks { position: relative; height: 14px; font-size: 9.5px; color: var(--mute); margin-top: 8px; font-variant-numeric: tabular-nums; }
.scale-ticks span { position: absolute; top: 0; transform: translateX(-50%); }
.scale-ticks span:nth-child(1) { left: 0; transform: none; }
.scale-ticks span:nth-child(2) { left: 30%; }
.scale-ticks span:nth-child(3) { left: 70%; }
.scale-ticks span:nth-child(4) { right: 0; transform: none; }

.lanes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 14px 20px 0; }
.lane { padding: 10px; border: 1px solid var(--line); border-radius: 6px; display: flex; flex-direction: column; gap: 4px; background: var(--bg); }
.lane-k { font-size: 9px; letter-spacing: 0.08em; color: var(--mute); font-weight: 500; }
.lane-r { font-size: 10.5px; color: var(--text-2); font-variant-numeric: tabular-nums; }
.lane-active { background: rgba(245,183,59,0.1); border-color: var(--warn); }
.lane-active .lane-k { color: var(--warn); }
.lane-active .lane-r { color: var(--text); }

.feat-block { padding: 20px 20px 4px; }
.feat-head { display: flex; justify-content: space-between; font-size: 9.5px; color: var(--mute); letter-spacing: 0.12em; margin-bottom: 10px; }
.feat-conf { color: var(--ok); font-weight: 500; }
.feat-row { display: grid; grid-template-columns: 148px 1fr 26px; gap: 12px; align-items: center; padding: 5px 0; font-size: 11px; }
.feat-n { color: var(--text-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.feat-bar { background: var(--line-2); height: 5px; border-radius: 3px; position: relative; overflow: hidden; }
.feat-fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--link); border-radius: 3px; }
.feat-v { text-align: right; color: var(--text); font-weight: 500; font-variant-numeric: tabular-nums; }

.queue { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 11.5px; border-top: 1px solid var(--line); }
.queue th { text-align: left; font-size: 9.5px; font-weight: 500; letter-spacing: 0.12em; color: var(--mute); padding: 10px 20px 8px; }
.queue td { padding: 9px 20px; border-top: 1px solid var(--line-2); color: var(--text-2); font-variant-numeric: tabular-nums; }
.queue-sel td { background: var(--panel-2); color: var(--text); }
.pill { font-size: 9.5px; letter-spacing: 0.06em; padding: 2px 8px; border-radius: 999px; border: 1px solid currentColor; white-space: nowrap; }
.pill-approve { color: var(--ok); } .pill-review { color: var(--warn); } .pill-reject { color: var(--bad); } .pill-escalate { color: var(--esc); }

/* ───────── SECTIONS ───────── */
.block { max-width: 1280px; margin: 0 auto; padding: 72px 40px 0; }
.block-head { display: flex; align-items: baseline; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--line); margin-bottom: 28px; flex-wrap: wrap; }
.sec-code { font-family: var(--f-mono); font-size: 10.5px; color: var(--accent-2); letter-spacing: 0.14em; font-weight: 500; }
.sec-title { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; }
.block-lede { font-size: 15px; line-height: 1.7; color: var(--text-2); max-width: 620px; margin: -8px 0 28px; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid var(--line); border-radius: 8px; background: var(--panel); overflow: hidden; }
.stat { padding: 28px 24px; border-right: 1px solid var(--line); }
.stat:last-child { border-right: none; }
.stat-k { font-family: var(--f-mono); font-size: 10.5px; letter-spacing: 0.12em; color: var(--mute); margin-bottom: 18px; }
.stat-num { display: flex; align-items: baseline; font-size: 56px; font-weight: 600; letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums; margin-bottom: 12px; }
.sn-prefix, .sn-suffix { color: var(--accent-2); font-size: 36px; font-weight: 500; }
.stat-note { font-size: 13px; color: var(--mute); }

.principle-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.principle { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 28px 24px; opacity: 0; transform: translateY(12px); transition: opacity .6s, transform .6s, border-color .2s; }
.principle.in { opacity: 1; transform: none; }
.principle:hover { border-color: var(--mute); }
.principle-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.principle-n { font-family: var(--f-mono); font-size: 11px; color: var(--accent-2); letter-spacing: 0.12em; font-weight: 500; }
.principle-title { font-size: 21px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 12px; }
.principle-body { font-size: 14px; line-height: 1.7; color: var(--text-2); }

.foot { border-top: 1px solid var(--line); margin-top: 88px; padding: 24px 0; }
.foot-inner { max-width: 1280px; margin: 0 auto; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.foot-left, .foot-right { display: flex; align-items: center; gap: 12px; }
.foot-mark { width: 20px; height: 20px; border-radius: 4px; }
.foot-brand { font-size: 14px; font-weight: 600; }
.foot-bank { font-family: var(--f-mono); font-size: 10.5px; color: var(--mute); letter-spacing: 0.1em; padding-left: 12px; border-left: 1px solid var(--line); }
.foot-k { font-family: var(--f-mono); font-size: 10px; color: var(--mute); letter-spacing: 0.12em; }
.foot-v { font-family: var(--f-mono); font-size: 11px; color: var(--text); }

/* ───────── DOCS ───────── */
.docs { display: flex; height: calc(100vh - var(--nav-h)); position: relative; }
.docs-toggle { display: none; }
.docs-side { width: 296px; min-width: 296px; height: 100%; overflow-y: auto; background: var(--bg); border-right: 1px solid var(--line); flex-shrink: 0; }
.docs-side-head { padding: 18px 20px 14px; border-bottom: 1px solid var(--line); position: sticky; top: 0; background: var(--bg); z-index: 2; }
.docs-side-note { font-family: var(--f-mono); font-size: 10.5px; color: var(--mute); letter-spacing: 0.06em; margin: 4px 0 12px; }
.docs-search { display: flex; align-items: center; gap: 8px; padding: 0 10px; height: 34px; background: var(--panel); border: 1px solid var(--line); border-radius: 6px; color: var(--mute); }
.docs-search:focus-within { border-color: var(--link); }
.docs-search input { flex: 1; min-width: 0; background: none; border: none; outline: none; color: var(--text); font: inherit; font-size: 13px; }
.docs-side-body { padding: 8px 0 32px; }
.docs-phase { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 20px; background: none; border: none; cursor: pointer; text-align: left; }
.docs-phase-lbl { flex: 1; font-size: 13.5px; font-weight: 600; }
.docs-chev { color: var(--mute); transition: transform .2s; display: flex; }
.docs-chev.closed { transform: rotate(-90deg); }
.docs-phase-weeks { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--mute); padding: 0 20px 6px 44px; }
.docs-week { width: 100%; display: flex; align-items: center; gap: 8px; padding: 6px 16px 6px 32px; background: none; border: none; cursor: pointer; text-align: left; color: var(--mute); }
.docs-week:hover, .docs-phase:hover { background: var(--panel); }
.docs-week-lbl { flex: 1; font-size: 12.5px; color: var(--text-2); font-weight: 500; }
.docs-file { width: 100%; display: flex; align-items: center; gap: 8px; padding: 5px 14px 5px 50px; background: none; border: none; border-left: 2px solid transparent; cursor: pointer; text-align: left; color: var(--mute); font-family: var(--f-mono); transition: background .12s, color .12s; }
.docs-file:hover { background: var(--panel); color: var(--text); }
.docs-file.sel { background: rgba(255,59,78,0.08); border-left-color: var(--accent); color: var(--text); }
.docs-file-lbl { font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; letter-spacing: 0.02em; }
.docs-none { padding: 20px; font-size: 13px; color: var(--mute); }
.docs-scrim { display: none; }

.docs-main { flex: 1; min-width: 0; overflow-y: auto; background: var(--bg); }
.docs-layout { display: flex; gap: 48px; justify-content: center; padding: 40px 40px 96px; max-width: 1180px; margin: 0 auto; }
.docs-article { flex: 1; min-width: 0; max-width: 760px; }
.docs-empty { display: flex; align-items: center; justify-content: center; height: 60%; color: var(--mute); font-size: 14px; }

.crumbs { display: flex; flex-wrap: wrap; gap: 8px; font-family: var(--f-mono); font-size: 10.5px; letter-spacing: 0.06em; color: var(--mute); margin-bottom: 24px; }
.crumb-cur { color: var(--text-2); }
.crumb-sep { color: var(--line); }

.toc { width: 210px; flex-shrink: 0; position: sticky; top: 40px; align-self: flex-start; max-height: calc(100vh - var(--nav-h) - 80px); overflow-y: auto; }
.toc-k { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.12em; color: var(--mute); margin-bottom: 12px; }
.toc ul { list-style: none; border-left: 1px solid var(--line); }
.toc-link { display: block; width: 100%; text-align: left; background: none; border: none; cursor: pointer; font-size: 12.5px; line-height: 1.45; color: var(--mute); padding: 5px 0 5px 14px; margin-left: -1px; border-left: 2px solid transparent; }
.toc-link:hover { color: var(--text); }
.toc-l3 { padding-left: 26px; font-size: 12px; }
.toc-link.on { color: var(--text); border-left-color: var(--accent); }

.pager { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 56px; padding-top: 24px; border-top: 1px solid var(--line); }
.pager-btn { display: flex; flex-direction: column; gap: 6px; text-align: left; padding: 14px 16px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; cursor: pointer; min-width: 0; transition: border-color .15s; }
.pager-btn:hover { border-color: var(--mute); }
.pager-next { text-align: right; align-items: flex-end; grid-column: 2; }
.pager-k { display: inline-flex; align-items: center; gap: 6px; font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.12em; color: var(--mute); }
.pager-v { font-family: var(--f-mono); font-size: 12px; color: var(--text); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.md-body h1 { font-size: 38px; font-weight: 700; letter-spacing: -0.035em; line-height: 1.1; margin: 0 0 20px; }
.md-body h2 { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; margin: 44px 0 14px; padding-bottom: 10px; border-bottom: 1px solid var(--line); scroll-margin-top: 80px; }
.md-body h3 { font-size: 17px; font-weight: 600; letter-spacing: -0.01em; margin: 28px 0 10px; scroll-margin-top: 80px; }
.md-body h4 { font-family: var(--f-mono); font-size: 10.5px; font-weight: 500; color: var(--accent-2); text-transform: uppercase; letter-spacing: 0.12em; margin: 20px 0 8px; }
.md-body p { font-size: 15px; color: var(--text-2); line-height: 1.8; margin: 0 0 14px; }
.md-body strong { color: var(--text); font-weight: 600; }
.md-body em { font-style: italic; color: var(--text); }
.md-body code { font-family: var(--f-mono); font-size: 12.5px; background: var(--panel-2); color: #FFB3BA; padding: 2px 6px; border-radius: 4px; }
.md-body pre { background: #080A0C; border: 1px solid var(--line); border-radius: 8px; padding: 18px 20px; margin: 18px 0; overflow-x: auto; }
.md-body pre code { background: none; color: #D5DAE0; font-size: 12.5px; padding: 0; line-height: 1.7; }
.md-body blockquote { border-left: 3px solid var(--accent); padding: 12px 18px; background: var(--panel); border-radius: 0 6px 6px 0; margin: 18px 0; color: var(--text-2); font-size: 15px; line-height: 1.7; }
.md-body ul, .md-body ol { padding-left: 24px; margin: 0 0 14px; color: var(--text-2); }
.md-body li { font-size: 15px; line-height: 1.8; margin-bottom: 4px; }
.md-body hr { border: none; border-top: 1px solid var(--line); margin: 32px 0; }
.md-body table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; font-size: 13.5px; margin: 18px 0; border: 1px solid var(--line); border-radius: 8px; }
.md-body th { background: var(--panel-2); font-family: var(--f-mono); font-size: 10.5px; font-weight: 500; color: var(--text); padding: 10px 14px; text-align: left; letter-spacing: 0.1em; border-bottom: 1px solid var(--line); text-transform: uppercase; white-space: nowrap; }
.md-body td { padding: 10px 14px; border-bottom: 1px solid var(--line-2); color: var(--text-2); font-size: 13.5px; vertical-align: top; min-width: 90px; }
.md-body tr:last-child td { border-bottom: none; }
.md-body a { color: var(--link); text-decoration: underline; text-underline-offset: 2px; }
.md-body ul.cl-ul { list-style: none; padding-left: 0; }
.md-body li.checklist { display: flex; align-items: flex-start; gap: 10px; padding: 3px 0; }
.md-body li.checklist::before { content: '☐'; color: var(--mute); flex-shrink: 0; margin-top: 2px; }
.md-body li.checked::before { content: '☑'; color: var(--ok); }

.docs-side::-webkit-scrollbar, .docs-main::-webkit-scrollbar, .toc::-webkit-scrollbar { width: 6px; height: 6px; }
.docs-side::-webkit-scrollbar-thumb, .docs-main::-webkit-scrollbar-thumb, .toc::-webkit-scrollbar-thumb, .md-body table::-webkit-scrollbar-thumb { background: var(--line); border-radius: 3px; }

.back-top { position: fixed; bottom: 28px; right: 28px; z-index: 50; background: var(--panel-2); color: var(--text); border: 1px solid var(--line); border-radius: 8px; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .15s, border-color .15s; }
.back-top:hover { background: var(--accent); border-color: var(--accent); }

/* ───────── DEMO PLACEHOLDER ───────── */
.demo-ph { min-height: calc(100vh - var(--nav-h)); display: flex; align-items: center; justify-content: center; padding: 24px; }
.demo-ph-inner { text-align: center; max-width: 440px; }
.demo-ph-mark { width: 52px; height: 52px; background: var(--panel); color: var(--accent-2); border: 1px solid var(--line); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
.demo-ph-h { font-size: 32px; font-weight: 600; letter-spacing: -0.03em; margin-bottom: 14px; }
.demo-ph-p { font-size: 14.5px; color: var(--text-2); line-height: 1.75; margin-bottom: 28px; }

/* ───────── RESPONSIVE ───────── */
@media (max-width: 1180px) {
  .toc { display: none; }
}
@media (max-width: 1000px) {
  .hero-grid { grid-template-columns: 1fr; gap: 48px; }
  .spec { grid-template-columns: repeat(2, 1fr); }
  .spec-cell:nth-child(2) { border-right: none; }
  .spec-cell:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .stat:nth-child(2) { border-right: none; }
  .stat:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
  .principle-grid { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .docs { flex-direction: column; height: auto; min-height: calc(100vh - var(--nav-h)); }
  .docs-toggle { display: flex; align-items: center; gap: 10px; width: 100%; padding: 12px 20px; background: var(--panel); border: none; border-bottom: 1px solid var(--line); cursor: pointer; font-size: 13px; font-weight: 500; position: sticky; top: var(--nav-h); z-index: 20; }
  .docs-toggle-cur { margin-left: auto; font-family: var(--f-mono); font-size: 10.5px; color: var(--mute); max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .docs-side { position: fixed; top: calc(var(--nav-h) + 45px); left: 0; bottom: 0; height: auto; z-index: 40; transform: translateX(-100%); transition: transform .2s; width: min(320px, 86vw); }
  .docs-side.open { transform: none; }
  .docs-scrim { display: block; position: fixed; inset: calc(var(--nav-h) + 45px) 0 0 0; background: rgba(0,0,0,0.5); z-index: 30; }
  .docs-main { overflow: visible; }
  .docs-layout { padding: 28px 20px 72px; }
  .md-body h1 { font-size: 30px; }
}
@media (max-width: 720px) {
  .nav { padding: 0 16px; grid-template-columns: 1fr auto; }
  .nav-clock, .brand-tag { display: none; }
  .nav-link { padding: 8px 8px; }
  .hero { padding: 40px 16px 24px; }
  .block { padding: 56px 16px 0; }
  .foot-inner { padding: 0 16px; }
  .lede { font-size: 15.5px; }
  .cta-row .btn-lg { flex: 1; }
  .console-case { flex-wrap: wrap; }
  .score-num { font-size: 44px; }
  .lanes { grid-template-columns: repeat(2, 1fr); }
  .feat-row { grid-template-columns: 1fr 70px 24px; }
  .queue th, .queue td { padding-left: 14px; padding-right: 14px; }
  .spec { margin-top: 36px; }
  .stat { padding: 22px 16px; }
  .stat-num { font-size: 44px; }
  .sn-prefix, .sn-suffix { font-size: 28px; }
}
@media (max-width: 480px) {
  .spec, .stats-row { grid-template-columns: 1fr; }
  .spec-cell, .stat { border-right: none; border-bottom: 1px solid var(--line); }
  .spec-cell:last-child, .stat:last-child { border-bottom: none; }
  .pager { grid-template-columns: 1fr; }
  .pager-next { grid-column: 1; }
}
`;
