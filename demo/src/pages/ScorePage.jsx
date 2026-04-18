import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AILabel from '../components/AILabel.jsx';
import DemoWatermark from '../components/DemoWatermark.jsx';
import GaugeChart from '../components/GaugeChart.jsx';
import { getApplication, getDecision } from '../lib/db.js';

const STATE_META = {
  STATE_1:{ label:'BATCH REVIEW',         sub:'Hàng đợi xét duyệt lô',            color:'#22C55E', bg:'rgba(34,197,94,0.08)',  border:'rgba(34,197,94,0.25)' },
  STATE_2:{ label:'STANDARD REVIEW',      sub:'Xét duyệt cá nhân',                color:'#3B82F6', bg:'rgba(59,130,246,0.08)', border:'rgba(59,130,246,0.25)' },
  STATE_3:{ label:'PRIORITY FRAUD REVIEW',sub:'Ưu tiên xem xét gian lận',         color:'#EF4444', bg:'rgba(239,68,68,0.08)',  border:'rgba(239,68,68,0.25)' },
  STATE_4:{ label:'ESCALATE',             sub:'Cần leo thang — độ tin cậy thấp',  color:'#F59E0B', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' },
  STATE_5:{ label:'MANUAL REVIEW',        sub:'Xử lý thủ công (khách từ chối AI)',color:'#888',    bg:'rgba(136,136,136,0.08)',border:'rgba(136,136,136,0.25)' },
};
const FRAUD_META = {
  CLEAR:   { color:'#22C55E', bg:'rgba(34,197,94,0.08)',  border:'rgba(34,197,94,0.25)' },
  ELEVATED:{ color:'#F59E0B', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' },
  HIGH:    { color:'#EF4444', bg:'rgba(239,68,68,0.08)',  border:'rgba(239,68,68,0.25)' },
};

const F = {
  page:{ minHeight:'100vh', background:'#0A0A0A', color:'#E8E8E8', fontFamily:"'DM Sans',sans-serif" },
  nav:{ background:'#111', borderBottom:'1px solid #1E1E1E', padding:'0 28px', height:52,
    display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 },
  brand:{ color:'#E8001D', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Sora',sans-serif", background:'none', border:'none' },
  btn:{ background:'none', border:'none', color:'#555', fontSize:13, cursor:'pointer', padding:'5px 10px', fontFamily:"'DM Sans',sans-serif" },
  wrap:{ maxWidth:820, margin:'0 auto', padding:'24px 20px 60px' },
  card:{ background:'#111', border:'1px solid #1E1E1E', borderRadius:10, padding:'20px 22px', marginBottom:14 },
  sec:{ fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12, fontFamily:"'Sora',sans-serif" },
  badge:(m)=>({ display:'inline-flex', alignItems:'center', gap:6, background:m.bg, border:`1px solid ${m.border}`, borderRadius:6, padding:'6px 12px', marginBottom:7 }),
  bar:{ background:'#1A1A1A', borderRadius:99, height:7, overflow:'hidden', marginTop:5 },
  factor:(r)=>({ padding:'7px 10px', background:r?'rgba(239,68,68,0.07)':'rgba(34,197,94,0.07)',
    border:`1px solid ${r?'rgba(239,68,68,0.15)':'rgba(34,197,94,0.15)'}`,
    borderRadius:5, marginBottom:5, fontSize:12, color:r?'#FCA5A5':'#86EFAC' }),
  signal:{ padding:'7px 10px', background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.18)',
    borderRadius:5, marginBottom:5, fontSize:12, color:'#FCA5A5', display:'flex', alignItems:'center', gap:7 },
  cta:{ display:'flex', gap:10, marginTop:22 },
  ctaBtn:(c)=>({ flex:1, padding:'11px 16px', borderRadius:7, border:'none', cursor:'pointer',
    fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif",
    background:c, color:c==='#1A1A1A'?'#555':'#fff' }),
};

export default function ScorePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [app, setApp] = useState(null);
  const [dec, setDec] = useState(null);

  useEffect(()=>{ setApp(getApplication(id)); setDec(getDecision(id)); },[id]);

  if (!app || !dec) return (
    <div style={{...F.page, display:'flex', alignItems:'center', justifyContent:'center', color:'#555'}}>
      Không tìm thấy hồ sơ.{' '}
      <button style={{marginLeft:10, color:'#3B82F6', background:'none', border:'none', cursor:'pointer'}} onClick={()=>nav('/apply')}>← Tạo mới</button>
    </div>
  );

  const sm = STATE_META[dec.state_routed] ?? STATE_META.STATE_2;
  const fm = FRAUD_META[dec.fraud_level]  ?? FRAUD_META.CLEAR;
  const conf = Math.round((dec.confidence??0)*100);
  const isFraud = dec.state_routed === 'STATE_3';

  return (
    <div style={F.page}>
      <nav style={F.nav}>
        <button style={F.brand} onClick={()=>nav('/')}>AI-CRDS</button>
        <div>
          <button style={F.btn} onClick={()=>nav('/apply')}>Hồ sơ mới</button>
          <button style={F.btn} onClick={()=>nav('/review/batch')}>Batch</button>
          <button style={F.btn} onClick={()=>nav('/audit')}>Audit</button>
        </div>
      </nav>
      <AILabel />
      <DemoWatermark />

      <div style={F.wrap}>
        {/* App header */}
        <div style={F.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontSize:18, fontWeight:700, color:'#E8E8E8', fontFamily:"'Sora',sans-serif"}}>{app.full_name}</div>
              <div style={{fontSize:11, color:'#444', fontFamily:"'JetBrains Mono',monospace", marginTop:2}}>CCCD: {app.cccd} · ID: {id.slice(0,8)}...</div>
            </div>
            <div style={{fontSize:11, color:'#333', fontFamily:"'JetBrains Mono',monospace", textAlign:'right'}}>
              <div>{dec.model_version}</div><div>{dec.threshold_version}</div>
            </div>
          </div>
        </div>

        {/* Fraud banner */}
        {isFraud && (
          <div style={{background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.35)', borderRadius:8,
            padding:'11px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:9}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{fontSize:13, color:'#FCA5A5', fontWeight:600}}>🔴 TÍN HIỆU GIAN LẬN PHÁT HIỆN — Phân tuyến ưu tiên xem xét</span>
          </div>
        )}

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
          {/* Left */}
          <div style={F.card}>
            <div style={F.sec}>Điểm tín dụng AI</div>
            <GaugeChart value={dec.final_score} size={192} />

            <div style={{marginTop:12}}>
              {/* State badge */}
              <div style={F.badge(sm)}>
                <span style={{width:7,height:7,borderRadius:'50%',background:sm.color,display:'inline-block',flexShrink:0}}/>
                <div>
                  <span style={{fontSize:12,fontWeight:800,color:sm.color,fontFamily:"'JetBrains Mono',monospace"}}>{sm.label}</span>
                  <span style={{fontSize:11,color:'#555',display:'block'}}>{sm.sub}</span>
                </div>
              </div>
              {/* Fraud badge */}
              <div style={F.badge(fm)}>
                <span style={{width:7,height:7,borderRadius:'50%',background:fm.color,display:'inline-block',flexShrink:0}}/>
                <div>
                  <span style={{fontSize:12,fontWeight:800,color:fm.color,fontFamily:"'JetBrains Mono',monospace"}}>FRAUD: {dec.fraud_level}</span>
                  <span style={{fontSize:11,color:'#555',display:'block'}}>Score: {Math.round(dec.fraud_score*100)}/100</span>
                </div>
              </div>

              {/* Confidence */}
              <div style={{marginTop:10}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'#555', marginBottom:3}}>
                  <span>Độ tin cậy</span>
                  <span style={{color:'#E8E8E8', fontFamily:"'JetBrains Mono',monospace"}}>{conf}%</span>
                </div>
                <div style={F.bar}>
                  <div style={{height:'100%', borderRadius:99,
                    width:`${conf}%`, background:conf>=85?'#22C55E':conf>=60?'#F59E0B':'#EF4444'}} />
                </div>
              </div>

              {dec.suggested_limit > 0 && (
                <div style={{marginTop:10, padding:'8px 11px', background:'#1A1A1A', border:'1px solid #222', borderRadius:6}}>
                  <div style={{fontSize:10,color:'#444',marginBottom:2}}>Hạn mức đề xuất</div>
                  <div style={{fontSize:15,fontWeight:700,color:'#E8E8E8',fontFamily:"'JetBrains Mono',monospace"}}>
                    {(dec.suggested_limit/1e6).toFixed(0)}M VND
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — factors */}
          <div>
            <div style={F.card}>
              <div style={F.sec}>✅ Yếu tố tích cực</div>
              {(dec.positive_factors??[]).length===0
                ? <div style={{fontSize:12,color:'#444'}}>Không có yếu tố tích cực đáng kể</div>
                : (dec.positive_factors??[]).map((f,i)=><div key={i} style={F.factor(false)}>✓ {f.label}</div>)
              }
            </div>
            <div style={F.card}>
              <div style={F.sec}>⚠️ Yếu tố rủi ro</div>
              {(dec.risk_factors??[]).length===0
                ? <div style={{fontSize:12,color:'#444'}}>Không có yếu tố rủi ro đáng kể</div>
                : (dec.risk_factors??[]).map((f,i)=><div key={i} style={F.factor(true)}>! {f.label}</div>)
              }
            </div>
            {(dec.signals??[]).length > 0 && (
              <div style={F.card}>
                <div style={F.sec}>🔴 Tín hiệu gian lận</div>
                {dec.signals.map((s,i)=>(
                  <div key={i} style={F.signal}>
                    <span style={{background:s.severity==='HIGH'?'#7F1D1D':'#78350F',
                      color:s.severity==='HIGH'?'#FCA5A5':'#FDE68A',
                      fontSize:9,fontWeight:700,padding:'2px 5px',borderRadius:2,
                      fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{s.severity}</span>
                    {s.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div style={F.cta}>
          <button style={F.ctaBtn('#1A1A1A')} onClick={()=>nav('/apply')}>← Hồ sơ mới</button>
          <button style={{...F.ctaBtn(sm.color), flex:2}} onClick={()=>{
            if (dec.state_routed==='STATE_1') nav('/review/batch');
            else nav(`/review/${id}`);
          }}>
            {dec.state_routed==='STATE_1' && '→ Xem hàng đợi Batch'}
            {dec.state_routed==='STATE_2' && '→ Xét duyệt chi tiết'}
            {dec.state_routed==='STATE_3' && '🔴 → Xem xét ưu tiên Fraud'}
            {dec.state_routed==='STATE_4' && '→ Escalate hồ sơ'}
            {dec.state_routed==='STATE_5' && '→ Xử lý thủ công'}
          </button>
          <button style={F.ctaBtn('#1A1A1A')} onClick={()=>nav('/audit')}>Audit Log</button>
        </div>
      </div>
    </div>
  );
}
