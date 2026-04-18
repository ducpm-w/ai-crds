import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";

// ─── DOCS: load từ /docs/**/*.md via Vite glob ────────────────────────────────
const MD_FILES = import.meta.glob("/docs/**/*.md", { query: "?raw", import: "default", eager: true });

function getDocContent(fileId) {
  if (!fileId) return null;
  return MD_FILES[`/docs/${fileId}`] ?? null;
}

// ─── PHASE METADATA ────────────────────────────────────────────────────────────
const PHASE_META = {
  "phase-1": { label: "Phase 1 — Foundation",      weeks: "Week 1–16"  },
  "phase-2": { label: "Phase 2 — MLOps & Workflow", weeks: "Week 17–32" },
  "phase-3": { label: "Phase 3 — Deployment",       weeks: "Week 33–48" },
  "phase-4": { label: "Phase 4 — Scale & Maturity", weeks: "Week 49–60" },
};

// ─── AUTO-BUILD DOCS TREE từ Vite glob ────────────────────────────────────────
function buildDocsTree(mdFiles) {
  const phases = {};

  Object.keys(mdFiles)
    .sort()
    .forEach(path => {
      const relative = path.replace("/docs/", "");
      const parts = relative.split("/");

      if (parts.length !== 3) return;

      const [phaseId, weekId, filename] = parts;

      if (!PHASE_META[phaseId]) return;

      if (!phases[phaseId]) {
        phases[phaseId] = {
          id: phaseId,
          label: PHASE_META[phaseId].label,
          weeks: PHASE_META[phaseId].weeks,
          folders: {},
        };
      }

      if (!phases[phaseId].folders[weekId]) {
        phases[phaseId].folders[weekId] = {
          id: `${phaseId}/${weekId}`,
          label: weekId.replace("week-", "Week "),
          files: [],
        };
      }

      phases[phaseId].folders[weekId].files.push({
        id: relative,
        label: filename.replace(/\.md$/, ""),
      });
    });

  return Object.keys(phases)
    .sort()
    .map(phaseId => ({
      ...phases[phaseId],
      folders: Object.keys(phases[phaseId].folders)
        .sort()
        .map(weekId => phases[phaseId].folders[weekId]),
    }));
}

const DOCS_TREE = buildDocsTree(MD_FILES);


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
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav style={{
      position:"sticky", top:0, zIndex:100,
      background:"#fff", borderBottom:"1px solid #E8E8E8",
      padding:"0 40px", height:"56px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      <button onClick={()=>navigate("/")} style={{
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
        {[{id:"home",label:"Home",path:"/"},{id:"docs",label:"Docs",path:"/docs"}].map(p=>(
          <button key={p.id} onClick={()=>navigate(p.path)} style={{
            background: location.pathname===p.path ? "#F5F5F3" : "none",
            border:"none", cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif", fontWeight: location.pathname===p.path ? 600 : 400,
            fontSize:14, color: location.pathname===p.path ? "#1A1A1A" : "#777",
            padding:"7px 14px", borderRadius:5, transition:"all 0.15s",
          }}>
            {p.label}
          </button>
        ))}
        <button onClick={()=>window.location.href="/demo/apply"} style={{
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
function Homepage() {
  const navigate = useNavigate();
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
            }}>Decision Support</span>
          </h1>

          {/* Right: description + CTA */}
          <div style={{ paddingBottom:4 }}>
            <p style={{ fontSize:15, color:"#555", lineHeight:1.8, margin:"0 0 28px" }}>
              Hệ thống AI hỗ trợ quyết định tín dụng thế hệ mới — Origination Scoring + Fraud Detection tại điểm phát hành thẻ tín dụng retail. Inhouse, compliant, production-grade.
            </p>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"flex-end" }}>
              <button onClick={()=>navigate("/docs")} style={{
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
              <button onClick={()=>window.location.href="/demo/apply"} style={{
                background:"#E8001D", color:"#fff", border:"none", cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15,
                padding:"8px 12px 8px 20px", borderRadius:7,
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
                {label:"Risk Score", val:"0.73", color:"#E8001D", sub:"Default probability"},
                {label:"Recommendation", val:"Review", color:"#F59E0B", sub:"Cần xét duyệt thủ công"},
                {label:"Model Confidence", val:"92%", color:"#22C55E", sub:"Prediction reliability"},
              ].map((c,i)=>(
                <div key={i} style={{ background:"rgba(255,255,255,0.05)",borderRadius:8,padding:"16px",border:"1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:8,fontFamily:"'DM Sans',sans-serif" }}>{c.label}</div>
                  <div style={{ fontFamily:"'Sora',sans-serif",fontSize:24,fontWeight:900,color:c.color }}>{c.val}</div>
                  <div style={{ fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:4 }}>{c.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ flex:1, background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"16px 18px",border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:10,fontFamily:"'Sora',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase" }}>Top Feature Contributions</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {[{name:"Lịch sử thanh toán",pct:78},{name:"Dư nợ / Hạn mức",pct:54},{name:"Thu nhập ổn định",pct:43}].map((f,i)=>(
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
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"48px 40px 0" }}>
        <div style={{ background:"#F7F7F5", border:"1px solid #E8E8E8", borderRadius:12, display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
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
        <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:36 }}>
          <div>
            <div style={{ fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:"#E8001D",textTransform:"uppercase",marginBottom:8,fontFamily:"'Sora',sans-serif" }}>Roadmap Overview</div>
            <h2 style={{ fontFamily:"'Sora',sans-serif",fontSize:34,fontWeight:900,color:"#1A1A1A",margin:0,letterSpacing:"-1.2px" }}>4 Phases — 60 Weeks</h2>
          </div>
          <button onClick={()=>navigate("/docs")} style={{
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
  const [openWeeks, setOpenWeeks] = useState({ "phase-1/week-01": true });
  const [selectedDoc, setSelectedDoc] = useState("phase-1/week-01/w01-01-use-case-shortlist.md");
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

  const selectFile = (fileId) => {
    setSelectedDoc(fileId);
    contentRef.current?.scrollTo({ top: 0 });
  };

  const docContent = getDocContent(selectedDoc);

  return (
    <div style={{ display:"flex", height:"calc(100vh - 56px)", fontFamily:"'DM Sans',sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{ width:268,minWidth:268,height:"100%",overflowY:"auto",background:"#fff",borderRight:"1px solid #E8E8E8",flexShrink:0 }}>
        <div style={{ padding:"16px 20px 12px",borderBottom:"1px solid #F0F0F0" }}>
          <div style={{ fontSize:10,fontWeight:700,letterSpacing:"0.12em",color:"#E8001D",textTransform:"uppercase",fontFamily:"'Sora',sans-serif",marginBottom:3 }}>Documentation</div>
          <div style={{ fontSize:11,color:"#999" }}>AI-Native CRDS · 60 Weeks · 337 files</div>
        </div>

        <div style={{ padding:"6px 0 24px" }}>
          {DOCS_TREE.map((phase, pi) => {
            const isPhaseOpen = openPhases[phase.id];
            const pc = PHASE_COLORS[pi];
            return (
              <div key={phase.id}>
                {/* ── Phase header ── */}
                <button onClick={() => setOpenPhases(p => ({...p, [phase.id]: !p[phase.id]}))} style={{
                  width:"100%",display:"flex",alignItems:"center",gap:8,
                  padding:"9px 20px",background:"none",border:"none",cursor:"pointer",textAlign:"left",
                }}>
                  <span style={{ color:pc,display:"flex",flexShrink:0 }}><FolderIcon/></span>
                  <span style={{ flex:1,fontSize:12,fontWeight:700,color:"#1A1A1A",lineHeight:1.3,fontFamily:"'Sora',sans-serif" }}>{phase.label}</span>
                  <span style={{ color:"#bbb",transform:isPhaseOpen?"rotate(0)":"rotate(-90deg)",transition:"transform 0.2s",display:"flex" }}><ChevronDown/></span>
                </button>
                <div style={{ fontSize:10,fontWeight:600,color:pc,padding:"0 20px 4px 42px",fontFamily:"'Sora',sans-serif",letterSpacing:"0.05em" }}>{phase.weeks}</div>

                {isPhaseOpen && (
                  <div style={{ paddingBottom:4 }}>
                    {phase.folders.map(folder => {
                      const isWeekOpen = openWeeks[folder.id];
                      return (
                        <div key={folder.id}>
                          {/* ── Week folder ── */}
                          <button onClick={() => setOpenWeeks(w => ({...w, [folder.id]: !w[folder.id]}))} style={{
                            width:"100%",display:"flex",alignItems:"center",gap:7,
                            padding:"5px 16px 5px 32px",background:"none",border:"none",cursor:"pointer",textAlign:"left",
                          }}>
                            <span style={{ color:"#bbb",display:"flex",flexShrink:0 }}><FolderIcon/></span>
                            <span style={{ flex:1,fontSize:11,fontWeight:600,color:"#444",lineHeight:1.3 }}>{folder.label}</span>
                            <span style={{ color:"#ccc",transform:isWeekOpen?"rotate(0)":"rotate(-90deg)",transition:"transform 0.15s",display:"flex" }}><ChevronDown/></span>
                          </button>

                          {isWeekOpen && (
                            <div style={{ paddingBottom:2 }}>
                              {folder.files.map(file => {
                                const isSel = selectedDoc === file.id;
                                return (
                                  <button key={file.id} onClick={() => selectFile(file.id)} style={{
                                    width:"100%",display:"flex",alignItems:"center",gap:7,
                                    padding:"4px 12px 4px 48px",
                                    background: isSel ? "#FFF0F2" : "none",
                                    border:"none",
                                    borderLeft: isSel ? `2px solid ${pc}` : "2px solid transparent",
                                    cursor:"pointer",textAlign:"left",transition:"all 0.12s",
                                  }}>
                                    <span style={{ color:isSel?pc:"#ddd",display:"flex",flexShrink:0 }}><FileIcon/></span>
                                    <span style={{ fontSize:11,color:isSel?pc:"#666",fontWeight:isSel?700:400,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
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
        {docContent ? (
          <div style={{ maxWidth:740,margin:"0 auto",padding:"48px 48px 64px" }}>
            <div className="md-body" dangerouslySetInnerHTML={{ __html:renderMarkdown(docContent) }}/>
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
function DemoPage() {
  const navigate = useNavigate();
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
        <button onClick={()=>navigate("/")} style={{
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
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/demo" element={<DemoPage />} />
      </Routes>
    </>
  );
}
