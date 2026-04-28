import { Routes, Route, useNavigate } from 'react-router-dom';
import ApplyPage from './pages/ApplyPage.jsx';
import ScorePage from './pages/ScorePage.jsx';
import BatchQueuePage from './pages/BatchQueuePage.jsx';
import IndividualReviewPage from './pages/IndividualReviewPage.jsx';

function HomePage() {
  const nav = useNavigate();
  const S = {
    page: { minHeight:'100vh', background:'#0A0A0A', color:'#E8E8E8', fontFamily:"'DM Sans',sans-serif",
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32 },
    hero: { textAlign:'center', maxWidth:600, marginBottom:48 },
    badge: { display:'inline-block', background:'rgba(232,0,29,0.1)', border:'1px solid rgba(232,0,29,0.3)',
      color:'#E8001D', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20,
      letterSpacing:'0.08em', marginBottom:18, fontFamily:"'Sora',sans-serif" },
    h1: { fontSize:40, fontWeight:900, color:'#E8E8E8', fontFamily:"'Sora',sans-serif",
      lineHeight:1.15, letterSpacing:'-1.5px', marginBottom:14 },
    sub: { fontSize:15, color:'#555', lineHeight:1.7, marginBottom:32 },
    btnRow: { display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' },
    primaryBtn: { background:'#E8001D', border:'none', color:'#fff', padding:'12px 28px', borderRadius:7,
      cursor:'pointer', fontSize:14, fontWeight:700, fontFamily:"'DM Sans',sans-serif" },
    secBtn: { background:'none', border:'1px solid #2A2A2A', color:'#888', padding:'12px 28px', borderRadius:7,
      cursor:'pointer', fontSize:14, fontWeight:600, fontFamily:"'DM Sans',sans-serif" },
    grid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, maxWidth:700, width:'100%' },
    card: { background:'#111', border:'1px solid #1A1A1A', borderRadius:10, padding:'20px 22px', cursor:'pointer' },
    cardIcon: { fontSize:24, marginBottom:10 },
    cardTitle: { fontSize:14, fontWeight:700, color:'#E8E8E8', marginBottom:4, fontFamily:"'Sora',sans-serif" },
    cardSub: { fontSize:12, color:'#555', lineHeight:1.55 },
    stateTag: (c) => ({ display:'inline-block', background:`${c}18`, border:`1px solid ${c}40`,
      color:c, fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:3, marginBottom:6,
      fontFamily:"'JetBrains Mono',monospace" }),
    aiLabel: { background:'#1E3A5F', border:'1px solid #2563EB', borderRadius:7, padding:'9px 16px',
      fontSize:12, color:'#93C5FD', marginTop:40, maxWidth:660, textAlign:'center', lineHeight:1.6 },
    watermark: { position:'fixed', top:16, right:16,
      background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)',
      borderRadius:4, padding:'3px 9px', fontSize:10, fontWeight:700,
      color:'rgba(239,68,68,0.5)', fontFamily:"'JetBrains Mono',monospace",
      letterSpacing:'0.1em', pointerEvents:'none' },
  };

  const SCENARIOS = [
    { icon:'✅', title:'Scenario A — STATE_1', sub:'Hồ sơ tốt → Batch approve (3–5 phút vs 35 phút thủ công)', state:'STATE_1', stateColor:'#22C55E', to:'/apply' },
    { icon:'⚖️', title:'Scenario B — STATE_2', sub:'Borderline → CO review → Từ chối + Adverse action', state:'STATE_2', stateColor:'#3B82F6', to:'/apply' },
    { icon:'🚨', title:'Scenario C — STATE_3', sub:'Face match 0.58, velocity 3/24h → Fraud priority review', state:'STATE_3', stateColor:'#EF4444', to:'/apply' },
  ];

  return (
    <div style={S.page}>
      <div style={S.watermark}>SYNTHETIC DATA — DEMO ONLY</div>
      <div style={S.hero}>
        <div style={S.badge}>MVP v0.1.0 · DEMO INTERNAL</div>
        <h1 style={S.h1}>AI-CRDS<br/><span style={{color:'#E8001D'}}>Credit Risk</span><br/>Decision Support</h1>
        <p style={S.sub}>
          Hệ thống AI hỗ trợ quyết định tín dụng thẻ bán lẻ — auto-route 30–50% hồ sơ,
          giảm thời gian xử lý 85%, phát hiện gian lận đa tín hiệu.
          CO ký quyết định cuối cùng.
        </p>
        <div style={S.btnRow}>
          <button style={S.primaryBtn}
            onMouseEnter={e=>e.currentTarget.style.background='#C80019'}
            onMouseLeave={e=>e.currentTarget.style.background='#E8001D'}
            onClick={()=>nav('/apply')}>→ Bắt đầu Demo</button>
          <button style={S.secBtn} onClick={()=>nav('/review/batch')}>Batch Queue</button>
        </div>
      </div>

      <div style={S.grid}>
        {SCENARIOS.map(sc=>(
          <div key={sc.title} style={S.card}
            onClick={()=>nav(sc.to)}
            onMouseEnter={e=>e.currentTarget.style.borderColor='#2A2A2A'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='#1A1A1A'}>
            <div style={S.cardIcon}>{sc.icon}</div>
            <div style={S.stateTag(sc.stateColor)}>{sc.state}</div>
            <div style={S.cardTitle}>{sc.title}</div>
            <div style={S.cardSub}>{sc.sub}</div>
          </div>
        ))}
      </div>

      <div style={S.aiLabel}>
        <strong style={{color:'#BFDBFE'}}>ⓘ Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo</strong><br/>
        Nhân viên tín dụng chịu trách nhiệm ký quyết định cuối cùng — Luật AI 134/2025, Điều 22
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/"               element={<ApplyPage />} />
      <Route path="/score/:id"      element={<ScorePage />} />
      <Route path="/review/batch"   element={<BatchQueuePage />} />
      <Route path="/review/:id"     element={<IndividualReviewPage />} />
    </Routes>
  );
}
