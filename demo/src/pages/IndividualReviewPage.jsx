import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AILabel from '../components/AILabel.jsx';
import DemoWatermark from '../components/DemoWatermark.jsx';
import GaugeChart from '../components/GaugeChart.jsx';
import OverrideModal from '../components/OverrideModal.jsx';
import { getApplication, getDecision, updateDecision, writeAudit } from '../lib/db.js';
import { generateAdverseAction } from '../lib/adverseAction.js';

const FRAUD_C = { CLEAR:'#22C55E', ELEVATED:'#F59E0B', HIGH:'#EF4444' };

const F = {
  page:{ minHeight:'100vh', background:'#0A0A0A', color:'#E8E8E8', fontFamily:"'DM Sans',sans-serif" },
  nav:{ background:'#111', borderBottom:'1px solid #1E1E1E', padding:'0 28px', height:52,
    display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 },
  brand:{ color:'#E8001D', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Sora',sans-serif", background:'none', border:'none' },
  navBtn:{ background:'none', border:'none', color:'#555', fontSize:13, cursor:'pointer', padding:'5px 10px', fontFamily:"'DM Sans',sans-serif" },
  wrap:{ maxWidth:1100, margin:'0 auto', padding:'22px 20px 60px' },
  grid:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, alignItems:'start' },
  card:{ background:'#111', border:'1px solid #1E1E1E', borderRadius:10, padding:'20px 22px', marginBottom:14 },
  sec:{ fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12, fontFamily:"'Sora',sans-serif" },
  row:{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:9 },
  rLbl:{ fontSize:12, color:'#555' },
  rVal:{ fontSize:13, color:'#E8E8E8', fontWeight:600, textAlign:'right', maxWidth:'58%' },
  factor:(r)=>({ padding:'6px 10px',
    background:r?'rgba(239,68,68,0.07)':'rgba(34,197,94,0.07)',
    border:`1px solid ${r?'rgba(239,68,68,0.15)':'rgba(34,197,94,0.15)'}`,
    borderRadius:5, marginBottom:5, fontSize:12, color:r?'#FCA5A5':'#86EFAC' }),
  signal:{ padding:'6px 9px', background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.18)',
    borderRadius:5, marginBottom:5, fontSize:12, color:'#FCA5A5', display:'flex', alignItems:'center', gap:6 },
  actions:{ background:'#0D0D0D', border:'1px solid #1A1A1A', borderRadius:10, padding:'16px 20px', marginTop:4 },
  actRow:{ display:'flex', gap:8 },
  actBtn:(bg,cl)=>({ flex:1, padding:'10px 6px', borderRadius:6, border:'none', cursor:'pointer',
    background:bg, color:cl, fontSize:12, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }),
  ta:{ width:'100%', background:'#1A1A1A', border:'1px solid #252525', borderRadius:6,
    color:'#E8E8E8', fontSize:13, padding:'9px 11px', resize:'vertical', minHeight:65,
    outline:'none', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box', marginTop:10 },
  advBox:{ background:'#080818', border:'1px solid #2563EB', borderRadius:10, padding:'20px 22px', marginTop:18 },
};

export default function IndividualReviewPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [app, setApp]       = useState(null);
  const [dec, setDec]       = useState(null);
  const [notes, setNotes]   = useState('');
  const [modal, setModal]   = useState({ open:false, action:null });
  const [decided, setDecided] = useState(false);
  const [decidedAction, setDecidedAction] = useState(null);
  const [adverse, setAdverse] = useState(null);
  const startRef = useRef(Date.now());

  useEffect(()=>{
    const a=getApplication(id), d=getDecision(id);
    setApp(a); setDec(d);
    if (d?.status==='DECIDED') { setDecided(true); setDecidedAction(d.human_decision); }
  },[id]);

  if (!app||!dec) return (
    <div style={{...F.page,display:'flex',alignItems:'center',justifyContent:'center',color:'#444'}}>
      Không tìm thấy hồ sơ.
      <button style={{marginLeft:10,color:'#3B82F6',background:'none',border:'none',cursor:'pointer'}} onClick={()=>nav('/apply')}>← Tạo mới</button>
    </div>
  );

  const isFraud = dec.state_routed==='STATE_3';
  const isOverride = (action) =>
    (action==='APPROVE' && dec.recommendation!=='APPROVE') ||
    (action==='REJECT'  && dec.recommendation==='APPROVE');

  function finalize(action, overrideData={}) {
    const secs = Math.round((Date.now()-startRef.current)/1000);
    const updated = updateDecision(dec.id, {
      status:'DECIDED', human_decision:action, co_id:'CO-001',
      decided_at:new Date().toISOString(), review_seconds:secs, co_notes:notes, ...overrideData,
    });
    writeAudit({
      decision_id:dec.id, application_id:id,
      app_full_name:app.full_name, app_cccd:app.cccd,
      ai_risk_score:dec.final_score, ai_fraud_score:dec.fraud_score,
      ai_confidence:dec.confidence, ai_recommendation:dec.recommendation,
      state_routed:dec.state_routed, ai_risk_factors:dec.risk_factors??[],
      ai_positive_factors:dec.positive_factors??[], ai_fraud_signals:dec.signals??[],
      human_decision:action,
      approved_limit:action==='APPROVE'?dec.suggested_limit:null,
      review_seconds:secs, ...overrideData,
      model_version:dec.model_version, threshold_version:dec.threshold_version,
    });
    if (action==='REJECT') setAdverse(generateAdverseAction({...dec,...overrideData}, app));
    setDecided(true); setDecidedAction(action);
    setDec(d=>({...d,...updated}));
  }

  function handleAction(action) {
    if (decided) return;
    if ((action==='APPROVE'||action==='REJECT') && isOverride(action)) {
      setModal({ open:true, action });
    } else {
      finalize(action);
    }
  }

  function onOverrideConfirm(data) {
    setModal({open:false,action:null});
    finalize(modal.action, data);
  }

  const incM = ((app.monthly_income??0)/1e6).toFixed(1);

  return (
    <div style={F.page}>
      <nav style={F.nav}>
        <button style={F.brand} onClick={()=>nav('/')}>AI-CRDS</button>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:11,color:'#333',fontFamily:"'JetBrains Mono',monospace"}}>CO-001</span>
          <button style={F.navBtn} onClick={()=>nav('/apply')}>Hồ sơ mới</button>
          <button style={F.navBtn} onClick={()=>nav('/review/batch')}>Batch</button>
          <button style={F.navBtn} onClick={()=>nav('/audit')}>Audit</button>
        </div>
      </nav>
      <AILabel />
      <DemoWatermark />

      <div style={F.wrap}>
        {/* Header */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
          <div>
            <div style={{fontSize:19, fontWeight:800, color:'#E8E8E8', fontFamily:"'Sora',sans-serif"}}>{app.full_name}</div>
            <div style={{fontSize:11, color:'#444', fontFamily:"'JetBrains Mono',monospace", marginTop:2}}>
              CCCD: {app.cccd} · {dec.state_routed}
            </div>
          </div>
          {decided && (
            <div style={{
              background:decidedAction==='APPROVE'?'rgba(34,197,94,0.1)':decidedAction==='REJECT'?'rgba(239,68,68,0.1)':'rgba(59,130,246,0.1)',
              border:`1px solid ${decidedAction==='APPROVE'?'rgba(34,197,94,0.3)':decidedAction==='REJECT'?'rgba(239,68,68,0.3)':'rgba(59,130,246,0.3)'}`,
              borderRadius:6, padding:'7px 14px', fontSize:13, fontWeight:700,
              color:decidedAction==='APPROVE'?'#22C55E':decidedAction==='REJECT'?'#EF4444':'#3B82F6',
            }}>✓ ĐÃ QUYẾT ĐỊNH: {decidedAction}</div>
          )}
        </div>

        {isFraud && (
          <div style={{background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8,
            padding:'10px 15px', marginBottom:14, display:'flex', alignItems:'center', gap:8}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{fontSize:13,color:'#FCA5A5',fontWeight:600}}>
              🔴 ƯU TIÊN FRAUD — {dec.signals?.length??0} tín hiệu gian lận. Yêu cầu EDD.
            </span>
          </div>
        )}

        <div style={F.grid}>
          {/* LEFT — AI panel */}
          <div>
            <div style={F.card}>
              <div style={F.sec}>Kết quả AI Scoring</div>
              <GaugeChart value={dec.final_score} size={176} />
              <div style={{marginTop:10}}>
                <div style={F.row}><span style={F.rLbl}>Fraud Score</span>
                  <span style={{color:FRAUD_C[dec.fraud_level]??'#888', fontWeight:700, fontFamily:"'JetBrains Mono',monospace"}}>
                    {Math.round((dec.fraud_score??0)*100)}/100 — {dec.fraud_level}</span></div>
                <div style={F.row}><span style={F.rLbl}>Độ tin cậy</span>
                  <span style={{color:'#E8E8E8',fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{Math.round((dec.confidence??0)*100)}%</span></div>
                <div style={F.row}><span style={F.rLbl}>Khuyến nghị AI</span>
                  <span style={{color:dec.recommendation==='APPROVE'?'#22C55E':'#F59E0B',fontWeight:700}}>{dec.recommendation}</span></div>
                {dec.suggested_limit>0 && (
                  <div style={F.row}><span style={F.rLbl}>Hạn mức đề xuất</span>
                    <span style={{color:'#E8E8E8',fontWeight:700}}>{(dec.suggested_limit/1e6).toFixed(0)}M VND</span></div>
                )}
              </div>
              <div style={{borderTop:'1px solid #1A1A1A',marginTop:12,paddingTop:12}}>
                <div style={{fontSize:10,color:'#444',marginBottom:6}}>Yếu tố tích cực</div>
                {(dec.positive_factors??[]).map((f,i)=><div key={i} style={F.factor(false)}>✓ {f.label}</div>)}
                <div style={{fontSize:10,color:'#444',marginTop:10,marginBottom:6}}>Yếu tố rủi ro</div>
                {(dec.risk_factors??[]).map((f,i)=><div key={i} style={F.factor(true)}>! {f.label}</div>)}
              </div>
              {(dec.signals??[]).length>0 && (
                <div style={{borderTop:'1px solid #1A1A1A',marginTop:12,paddingTop:12}}>
                  <div style={{fontSize:10,color:'#EF4444',marginBottom:6}}>🔴 Tín hiệu gian lận</div>
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

            {/* Actions */}
            <div style={F.actions}>
              <div style={{fontSize:11,color:'#444',marginBottom:10}}>Quyết định — CO-001</div>
              <div style={F.actRow}>
                <button style={F.actBtn(decided?'#111':'#166534','#fff')} onClick={()=>handleAction('APPROVE')} disabled={decided}>✓ DUYỆT</button>
                <button style={F.actBtn(decided?'#111':'#7F1D1D','#fff')} onClick={()=>handleAction('REJECT')} disabled={decided}>✗ TỪ CHỐI</button>
                <button style={F.actBtn(decided?'#111':'#78350F','#FDE68A')} onClick={()=>handleAction('ESCALATE')} disabled={decided}>↑ ESCALATE</button>
                <button style={F.actBtn(decided?'#111':'#1E3A5F','#93C5FD')} onClick={()=>handleAction('NEED_INFO')} disabled={decided}>? THÊM TT</button>
              </div>
              <textarea style={F.ta} value={notes} onChange={e=>setNotes(e.target.value)}
                placeholder="Ghi chú của CO (tuỳ chọn)..." disabled={decided} />
            </div>
          </div>

          {/* RIGHT — applicant data */}
          <div>
            <div style={F.card}>
              <div style={F.sec}>Thông tin cá nhân & tài chính</div>
              {[
                ['Họ và tên', app.full_name],
                ['CCCD', app.cccd],
                ['Ngày sinh', app.dob??'—'],
                ['Giới tính', app.gender??'—'],
                ['Tỉnh/Thành', app.province??'—'],
                ['Thu nhập/tháng', `${incM}M VND`],
                ['Đơn vị', app.employer_name??'—'],
                ['Loại hình', app.employer_type??'—'],
                ['Thâm niên', `${app.employment_months??0} tháng`],
              ].map(([l,v])=>(
                <div key={l} style={F.row}>
                  <span style={F.rLbl}>{l}</span>
                  <span style={F.rVal}>{v}</span>
                </div>
              ))}
            </div>

            <div style={F.card}>
              <div style={F.sec}>Dữ liệu CIC (Mock)</div>
              {[
                ['CIC Score', `${app.cic_score??0}/850`],
                ['Tổng dư nợ', `${((app.cic_total_debt??0)/1e6).toFixed(0)}M VND`],
                ['DPD tối đa 12T', `${app.cic_max_dpd_12m??0} ngày`],
                ['Tra cứu CIC/6T', `${app.cic_inquiries_6m??0} lần`],
                ['DTI tính toán', `${(dec.dti??0).toFixed(1)}%`],
                ['Nhóm nợ', `Nhóm ${app.cic_debt_group??1}`],
              ].map(([l,v])=>(
                <div key={l} style={F.row}>
                  <span style={F.rLbl}>{l}</span>
                  <span style={{...F.rVal, fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                </div>
              ))}
            </div>

            <div style={F.card}>
              <div style={F.sec}>eKYC (Mock)</div>
              {[
                ['eKYC Status',    app.ekyk_pass?'✓ PASS':'✗ FAIL'],
                ['Face Match',     `${Math.round((app.face_match??1)*100)}%`],
                ['App Velocity',   `${app.app_velocity_24h??1} đơn/24h`],
                ['Employer ĐKKD',  app.employer_unverifiable?'✗ Không xác minh':'✓ Xác minh được'],
              ].map(([l,v])=>(
                <div key={l} style={F.row}>
                  <span style={F.rLbl}>{l}</span>
                  <span style={{...F.rVal,
                    color:v.startsWith('✗')?'#EF4444':v.startsWith('✓')?'#22C55E':'#E8E8E8',
                    fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Adverse action */}
        {adverse && (
          <div style={F.advBox}>
            <div style={{fontSize:10,color:'#3B82F6',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:12}}>
              📄 Thông báo từ chối — Adverse Action Notice (NĐ 356/2025)
            </div>
            <div style={{fontSize:14,fontWeight:700,color:'#E8E8E8',marginBottom:5}}>Kính gửi: {adverse.applicant_name}</div>
            <div style={{fontSize:13,color:'#666',marginBottom:12,lineHeight:1.6}}>
              Sau khi xem xét hồ sơ: <strong style={{color:'#EF4444'}}>CHƯA ĐÁP ỨNG ĐIỀU KIỆN PHÁT HÀNH THẺ TÍN DỤNG</strong>
            </div>
            <div style={{fontSize:11,color:'#444',marginBottom:7}}>Lý do cụ thể:</div>
            {adverse.reasons.map((r,i)=>(
              <div key={i} style={{padding:'7px 11px', background:'#111', border:'1px solid #1A1A1A',
                borderRadius:5, marginBottom:5, fontSize:13, color:'#CCC', display:'flex', gap:9}}>
                <span style={{color:'#3B82F6',fontWeight:700,flexShrink:0}}>({i+1})</span>{r}
              </div>
            ))}
            {adverse.customer_rights.length>0 && (
              <>
                <div style={{fontSize:11,color:'#444',margin:'12px 0 7px'}}>Quyền của Quý khách:</div>
                {adverse.customer_rights.map((r,i)=>(
                  <div key={i} style={{fontSize:12,color:'#555',padding:'3px 0 3px 12px',borderLeft:'2px solid #1A1A1A',marginBottom:3}}>• {r}</div>
                ))}
              </>
            )}
            <div style={{marginTop:14,padding:'9px 12px',background:'#1E3A5F',border:'1px solid #2563EB',borderRadius:6,fontSize:12,color:'#93C5FD'}}>
              ⓘ {adverse.ai_label} — {adverse.ai_law_ref}
            </div>
            <div style={{marginTop:7,fontSize:11,color:'#333'}}>{adverse.hotline} · {adverse.email} · {adverse.decision_date}</div>
          </div>
        )}
      </div>

      <OverrideModal isOpen={modal.open} onClose={()=>setModal({open:false,action:null})}
        onConfirm={onOverrideConfirm} aiRec={dec.recommendation} humanDecision={modal.action} />
    </div>
  );
}
