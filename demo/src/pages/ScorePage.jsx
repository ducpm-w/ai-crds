import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AILabel from '../components/AILabel.jsx';
import DemoWatermark from '../components/DemoWatermark.jsx';
import GaugeChart from '../components/GaugeChart.jsx';
import { getApplication, getDecision } from '../lib/db.js';

const STATE_META = {
  STATE_1:{ label:'BATCH REVIEW',         sub:'Hàng đợi xét duyệt lô',            color:'#22C55E', bg:'rgba(34,197,94,0.08)',  border:'rgba(34,197,94,0.25)' },
  STATE_2:{ label:'STANDARD REVIEW',      sub:'Xét duyệt cá nhân',                color:'#3B82F6', bg:'rgba(59,130,246,0.08)', border:'rgba(59,130,246,0.25)' },
  STATE_3:{ label:'PRIORITY FRAUD REVIEW',sub:'Ưu tiên xem xét gian lận',         color:'#E8001D', bg:'rgba(232,0,29,0.08)',  border:'rgba(232,0,29,0.25)' },
  STATE_4:{ label:'ESCALATE',             sub:'Cần leo thang — độ tin cậy thấp',  color:'#F59E0B', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' },
  STATE_5:{ label:'MANUAL REVIEW',        sub:'Xử lý thủ công (khách từ chối AI)',color:'#8A8680', bg:'rgba(138,134,128,0.08)',border:'rgba(138,134,128,0.25)' },
};
const FRAUD_META = {
  CLEAR:   { color:'#22C55E', bg:'rgba(34,197,94,0.08)',  border:'rgba(34,197,94,0.25)' },
  ELEVATED:{ color:'#F59E0B', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' },
  HIGH:    { color:'#E8001D', bg:'rgba(232,0,29,0.08)',  border:'rgba(232,0,29,0.25)' },
};

export default function ScorePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [app, setApp] = useState(null);
  const [dec, setDec] = useState(null);

  useEffect(()=>{ setApp(getApplication(id)); setDec(getDecision(id)); },[id]);

  if (!app || !dec) return (
    <div className="sp-page" style={{display:'flex', alignItems:'center', justifyContent:'center', color:'#555'}}>
      <style>{STYLES}</style>
      Không tìm thấy hồ sơ.{' '}
      <button style={{marginLeft:10, color:'#3B82F6', background:'none', border:'none', cursor:'pointer'}} onClick={()=>nav('/apply')}>← Tạo mới</button>
    </div>
  );

  const sm = STATE_META[dec.state_routed] ?? STATE_META.STATE_2;
  const fm = FRAUD_META[dec.fraud_level]  ?? FRAUD_META.CLEAR;
  const conf = Math.round((dec.confidence??0)*100);
  const isFraud = dec.state_routed === 'STATE_3';

  return (
    <div className="sp-page">
      <style>{STYLES}</style>
      
      <nav className="nav">
        <button onClick={() => nav("/")} className="brand">
          <div className="brand-mark">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span className="brand-name">AI–CRDS</span>
          <span className="brand-tag">BANK X · INTERNAL</span>
        </button>
        <div className="nav-right">
          <button className="nav-link" onClick={()=>nav('/apply')}>Hồ sơ mới</button>
          <button className="nav-link" onClick={()=>nav('/review/batch')}>Batch</button>
        </div>
      </nav>

      <AILabel />
      <DemoWatermark />

      <div className="sp-wrap">
        {/* Fraud banner */}
        {isFraud && (
          <div className="sp-fraud-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8001D" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>🔴 TÍN HIỆU GIAN LẬN PHÁT HIỆN — Phân tuyến ưu tiên xem xét</span>
          </div>
        )}

        <div className="sp-g2">
          {/* Left */}
          <div className="sp-card">
            <div className="sp-corner ct-tl"/><div className="sp-corner ct-tr"/>
            <div className="sp-corner ct-bl"/><div className="sp-corner ct-br"/>
            {/* Applicant info — moved from header card */}
            <div style={{marginBottom:20}}>
              <div className="sp-name">{app.full_name}</div>
              <div className="sp-ident" style={{marginTop:4}}>CCCD: {app.cccd} · ID: {id.slice(0,8)}...</div>
              <div className="sp-meta-info" style={{textAlign:'left', marginTop:6}}>
                {dec.model_version} · {dec.threshold_version}
              </div>
            </div>
            <div className="sp-sec">Điểm tín dụng AI</div>
            <GaugeChart value={dec.final_score} size={220} />

            <div style={{marginTop:12}}>
              {/* State badge */}
              <div className="sp-badge" style={{background:sm.bg, border:`1px solid ${sm.border}`}}>
                <span className="badge-dot" style={{background:sm.color}}/>
                <div>
                  <span className="badge-title" style={{color:sm.color}}>{sm.label}</span>
                  <span className="badge-sub">{sm.sub}</span>
                </div>
              </div>
              {/* Fraud badge */}
              <div className="sp-badge" style={{background:fm.bg, border:`1px solid ${fm.border}`}}>
                <span className="badge-dot" style={{background:fm.color}}/>
                <div>
                  <span className="badge-title" style={{color:fm.color}}>FRAUD: {dec.fraud_level}</span>
                  <span className="badge-sub">Score: {Math.round(dec.fraud_score*100)}/100</span>
                </div>
              </div>

              {/* Confidence */}
              <div style={{marginTop:18}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--mute)', marginBottom:6}}>
                  <span style={{fontWeight:500}}>Độ tin cậy</span>
                  <span style={{color:'var(--ink)', fontFamily:"var(--f-mono)", fontWeight:600}}>{conf}%</span>
                </div>
                <div className="sp-bar-track">
                  <div className="sp-bar-fill" style={{
                    width:`${conf}%`, background:conf>=85?'#22C55E':conf>=60?'#F59E0B':'#E8001D'}} />
                </div>
              </div>

              {dec.suggested_limit > 0 && (
                <div className="sp-limit-box">
                  <div className="limit-lbl">Hạn mức đề xuất</div>
                  <div className="limit-val">{(dec.suggested_limit/1e6).toFixed(0)}M VND</div>
                </div>
              )}
            </div>
          </div>

          {/* Right — metrics + factors */}
          <div>
            {/* Scoring dimensions */}
            <div className="sp-card" style={{marginBottom:14}}>
              <div className="sp-corner ct-tl"/><div className="sp-corner ct-tr"/>
              <div className="sp-corner ct-bl"/><div className="sp-corner ct-br"/>
              <div className="sp-sec">Chỉ số chấm điểm</div>
              {(() => {
                const cic    = +(app?.cic_score)        || 0;
                const dpd    = +(app?.cic_max_dpd_12m)  || 0;
                const months = +(app?.employment_months) || 0;
                const incM   = (+(app?.monthly_income)  || 0) / 1_000_000;
                const dti    = dec.dti || 0;
                const fraud  = dec.fraud_score || 0;

                const metrics = [
                  {
                    key: 'CIC Score',
                    val: cic > 0 ? `${cic} / 850` : 'Không có',
                    score: cic >= 720 ? 1 : cic >= 650 ? 0.78 : cic >= 500 ? 0.45 : cic > 0 ? 0.25 : 0.28,
                  },
                  {
                    key: 'Lịch sử thanh toán',
                    val: dpd === 0 ? 'Không nợ quá hạn' : `DPD max ${dpd} ngày`,
                    score: dpd === 0 ? 1 : dpd < 30 ? 0.60 : dpd < 90 ? 0.25 : 0.05,
                  },
                  {
                    key: 'Ổn định việc làm',
                    val: months > 0 ? `${months} tháng` : 'Chưa rõ',
                    score: months >= 36 ? 1 : months >= 12 ? 0.68 : months >= 6 ? 0.38 : 0.15,
                  },
                  {
                    key: 'Thu nhập',
                    val: incM > 0 ? `${incM.toFixed(0)}M VND/tháng` : 'Chưa rõ',
                    score: Math.min(1, incM / 28),
                  },
                  {
                    key: 'Tỷ lệ nợ / DTI',
                    val: dti > 0 ? `${dti.toFixed(0)}%` : '0%',
                    score: dti === 0 ? 0.80 : dti < 30 ? 1 : dti < 40 ? 0.68 : dti < 50 ? 0.35 : 0.12,
                  },
                  {
                    key: 'Tín hiệu gian lận',
                    val: dec.fraud_level || 'CLEAR',
                    score: Math.max(0, 1 - fraud * 1.35),
                  },
                ];

                const mc = (s) => s >= 0.70 ? '#22C55E' : s >= 0.38 ? '#F59E0B' : '#E8001D';
                const micon = (s) => s >= 0.70 ? '✓' : s >= 0.38 ? '△' : '✕';

                return metrics.map((m) => (
                  <div key={m.key} className="metric-row">
                    <div className="metric-key">{m.key}</div>
                    <div className="metric-val-wrap">
                      <span className="metric-val">{m.val}</span>
                      <span className="metric-icon" style={{color: mc(m.score)}}>{micon(m.score)}</span>
                    </div>
                    <div className="metric-bar-track">
                      <div className="metric-bar-fill" style={{width:`${Math.round(m.score*100)}%`, background: mc(m.score)}} />
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="sp-card" style={{marginBottom:14}}>
              <div className="sp-corner ct-tl"/><div className="sp-corner ct-tr"/>
              <div className="sp-corner ct-bl"/><div className="sp-corner ct-br"/>
              <div className="sp-sec">✅ Yếu tố tích cực</div>
              {(dec.positive_factors??[]).length===0
                ? <div style={{fontSize:13,color:'var(--mute)'}}>Không có yếu tố tích cực đáng kể</div>
                : (dec.positive_factors??[]).map((f,i)=><div key={i} className="factor f-pos">✓ {f.label}</div>)
              }
            </div>
            
            <div className="sp-card" style={{marginBottom: (dec.signals??[]).length > 0 ? 14 : 0}}>
              <div className="sp-corner ct-tl"/><div className="sp-corner ct-tr"/>
              <div className="sp-corner ct-bl"/><div className="sp-corner ct-br"/>
              <div className="sp-sec">⚠️ Yếu tố rủi ro</div>
              {(dec.risk_factors??[]).length===0
                ? <div style={{fontSize:13,color:'var(--mute)'}}>Không có yếu tố rủi ro đáng kể</div>
                : (dec.risk_factors??[]).map((f,i)=><div key={i} className="factor f-neg">! {f.label}</div>)
              }
            </div>

            {(dec.signals??[]).length > 0 && (
              <div className="sp-card">
                <div className="sp-corner ct-tl"/><div className="sp-corner ct-tr"/>
                <div className="sp-corner ct-bl"/><div className="sp-corner ct-br"/>
                <div className="sp-sec">🔴 Tín hiệu gian lận</div>
                {dec.signals.map((s,i)=>(
                  <div key={i} className="signal">
                    <span className={`sig-badge ${s.severity}`}>{s.severity}</span>
                    {s.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="sp-cta">
          <button className="btn-ghost btn-lg" onClick={()=>nav('/apply')}>← Hồ sơ mới</button>
          
          <button className="btn-primary btn-lg sp-main-cta" onClick={()=>{
            if (dec.state_routed==='STATE_1') nav('/review/batch');
            else nav(`/review/${id}`);
          }} style={{ background:sm.color, borderColor:sm.color, flex:2 }}>
            <span style={{color: sm.color === '#22C55E' ? '#fff' : '#fff'}}>{
              dec.state_routed==='STATE_1' ? '→ Xem hàng đợi Batch' :
              dec.state_routed==='STATE_2' ? '→ Xét duyệt chi tiết' :
              dec.state_routed==='STATE_3' ? '🔴 → Xem xét ưu tiên Fraud' :
              dec.state_routed==='STATE_4' ? '→ Escalate hồ sơ' : '→ Xử lý thủ công'
            }</span>
            <span className="btn-arrow" style={{marginLeft:12}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/></svg>
            </span>
          </button>
          
        </div>
      </div>
    </div>
  );
}

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
  --f-sans:   'Geist', system-ui, -apple-system, sans-serif;
  --f-serif:  'Instrument Serif', 'Times New Roman', serif;
  --f-mono:   'JetBrains Mono', ui-monospace, monospace;
}

.sp-page {
  min-height: 100vh;
  background: var(--canvas);
  color: var(--ink);
  font-family: var(--f-sans);
  font-feature-settings: "ss01", "cv11";
  -webkit-font-smoothing: antialiased;
  position: relative;
  z-index: 2;
}

.sp-page::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: -1;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.5; mix-blend-mode: multiply;
}

/* ───────── NAV ───────── */
.nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(250,250,247,0.85); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
  padding: 0 40px; height: 64px;
  display: flex; justify-content: space-between; align-items: center;
}
.brand { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 12px; padding: 0; }
.brand-mark { width: 26px; height: 26px; background: var(--signal); border-radius: 4px; display: flex; align-items: center; justify-content: center; }
.brand-name { font-family: var(--f-serif); font-style: italic; font-size: 22px; color: var(--ink); letter-spacing: -0.5px; line-height: 1; }
.brand-tag { font-family: var(--f-mono); font-size: 9.5px; font-weight: 500; color: var(--mute); letter-spacing: 0.12em; padding-left: 10px; border-left: 1px solid var(--line); }
.nav-right { display: flex; gap: 8px; }
.nav-link { background: none; border: none; cursor: pointer; font-family: var(--f-sans); font-size: 13px; color: var(--mute); font-weight: 500; padding: 8px 14px; border-radius: 4px; transition: color .2s; }
.nav-link:hover { color: var(--ink); }

/* ───────── CONTENT ───────── */
.sp-wrap { max-width: 900px; margin: 0 auto; padding: 40px 32px 100px; }

.sp-card { background: #fff; border: 1px solid var(--line); padding: 28px; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.015); }
.sp-header-card { padding: 20px 28px; margin-bottom: 20px; }

.sp-corner { position: absolute; width: 6px; height: 6px; border: 1px solid var(--ink); opacity: 0.2; }
.sp-corner.ct-tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.sp-corner.ct-tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
.sp-corner.ct-bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
.sp-corner.ct-br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

.sp-name { font-family: var(--f-serif); font-style: italic; font-size: 28px; font-weight: 400; color: var(--ink); margin-bottom: 4px; letter-spacing: -0.02em; }
.sp-ident { font-family: var(--f-mono); font-size: 11px; color: var(--mute); letter-spacing: 0.05em; }
.sp-meta-info { font-family: var(--f-mono); font-size: 10px; color: var(--mute-2); text-align: right; letter-spacing: 0.1em; line-height: 1.6; }

.sp-sec { font-family: var(--f-mono); font-size: 11.5px; font-weight: 600; color: var(--signal); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px dashed var(--line); }

.sp-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* Badges */
.sp-badge { display: inline-flex; alignItems: center; gap: 8px; border-radius: 6px; padding: 8px 14px; margin-bottom: 8px; width: 100%; align-items: center; }
.badge-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.badge-title { font-family: var(--f-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.04em; display: block; margin-bottom: 2px; }
.badge-sub { font-size: 12.5px; color: var(--ink-2); display: block; }

/* Progress bar */
.sp-bar-track { background: var(--line); border-radius: 99px; height: 6px; overflow: hidden; }
.sp-bar-fill { height: 100%; border-radius: 99px; transition: width 1s cubic-bezier(.2,.7,.2,1); }

.sp-limit-box { margin-top: 20px; padding: 14px 18px; background: var(--canvas-2); border: 1px solid var(--line); border-radius: 6px; }
.limit-lbl { font-size: 11px; color: var(--mute); margin-bottom: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
.limit-val { font-family: var(--f-mono); font-size: 20px; font-weight: 700; color: var(--ink); letter-spacing: -0.02em; }

/* Factors */
.factor { padding: 9px 12px; border-radius: 6px; margin-bottom: 8px; font-size: 13.5px; font-weight: 500; }
.f-pos { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: #166534; }
.f-neg { background: rgba(232,0,29,0.06); border: 1px solid rgba(232,0,29,0.15); color: #991B1B; }

.signal { padding: 10px 12px; background: rgba(232,0,29,0.06); border: 1px solid rgba(232,0,29,0.2); border-radius: 6px; margin-bottom: 8px; font-size: 13px; color: #991B1B; display: flex; align-items: center; gap: 10px; font-weight: 500; }
.sig-badge { font-family: var(--f-mono); font-size: 9.5px; font-weight: 700; padding: 3px 6px; border-radius: 4px; }
.sig-badge.HIGH { background: #E8001D; color: #fff; }
.sig-badge.ELEVATED { background: #F59E0B; color: #fff; }

.sp-fraud-banner { background: rgba(232,0,29,0.08); border: 1px solid rgba(232,0,29,0.3); border-radius: 8px; padding: 14px 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
.sp-fraud-banner span { font-size: 14px; color: #B91C1C; font-weight: 600; letter-spacing: -0.01em; }

.sp-cta { display: flex; gap: 16px; margin-top: 32px; }

/* Metric rows */
.metric-row { margin-bottom: 14px; }
.metric-row:last-child { margin-bottom: 0; }
.metric-val-wrap { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
.metric-key { font-family: var(--f-mono); font-size: 10.5px; color: var(--mute); letter-spacing: 0.04em; font-weight: 500; margin-bottom: 4px; }
.metric-val { font-size: 13px; font-weight: 600; color: var(--ink-2); }
.metric-icon { font-family: var(--f-mono); font-size: 12px; font-weight: 700; }
.metric-bar-track { background: var(--line); height: 4px; border-radius: 99px; overflow: hidden; }
.metric-bar-fill { height: 100%; border-radius: 99px; transition: width 0.8s cubic-bezier(.2,.7,.2,1); }

/* Buttons global */
.btn-primary { background: var(--ink); color: #fff; border: 1px solid var(--ink); cursor: pointer; font-weight: 500; letter-spacing: -0.01em; display: inline-flex; align-items: center; justify-content: center; transition: all .28s cubic-bezier(.2,.7,.2,1); position: relative; overflow: hidden; }
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); cursor: pointer; font-weight: 500; transition: all .2s; }
.btn-ghost:hover { border-color: var(--ink); background: #fff; }
.btn-sm { font-size: 12.5px; padding: 8px 14px; border-radius: 4px; }
.btn-lg { font-size: 14.5px; padding: 14px 24px; border-radius: 6px; }
.btn-primary .btn-arrow { display: flex; align-items: center; transition: transform .3s; }
.btn-primary:hover .btn-arrow { transform: translateX(4px); }
`;
