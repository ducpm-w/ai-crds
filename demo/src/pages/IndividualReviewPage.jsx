import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AILabel from '../components/AILabel.jsx';
import DemoWatermark from '../components/DemoWatermark.jsx';
import GaugeChart from '../components/GaugeChart.jsx';
import OverrideModal from '../components/OverrideModal.jsx';
import { getApplication, getDecision, updateDecision, writeAudit } from '../lib/db.js';
import { generateAdverseAction } from '../lib/adverseAction.js';

const FRAUD_C = { CLEAR:'#10B981', ELEVATED:'#F59E0B', HIGH:'#E8001D' };

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
    <div className="pg-page" style={{display:'flex',alignItems:'center',justifyContent:'center',color:'var(--mute)'}}>
      Không tìm thấy hồ sơ.
      <button className="btn-ghost btn-sm" style={{marginLeft:10}} onClick={()=>nav('/apply')}>← Chọn hồ sơ khác</button>
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
    <div className="pg-page">
      <nav className="nav">
        <button onClick={() => nav("/")} className="brand">
          <div className="brand-mark">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <span className="brand-name">AI–CRDS</span>
          <span className="brand-tag">BANK X · INTERNAL</span>
        </button>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <span style={{fontSize:11,color:'var(--mute)',fontFamily:"var(--f-mono)",fontWeight:600}}>CO-001</span>
          <div className="nav-right">
            <button className="nav-link" onClick={()=>nav('/apply')}>Hồ sơ mới</button>
            <button className="nav-link" onClick={()=>nav('/review/batch')}>Batch</button>
            <button className="nav-link" onClick={()=>nav('/audit')}>Audit</button>
          </div>
        </div>
      </nav>
      <AILabel />
      <DemoWatermark />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 32, color: 'var(--ink)' }}>{app.full_name}</div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--mute)', marginTop: 4 }}>
              CCCD: {app.cccd} · Phân tuyến: {dec.state_routed}
            </div>
          </div>
          {decided && (
            <div style={{
              background: decidedAction==='APPROVE' ? 'rgba(16,185,129,0.1)' : decidedAction==='REJECT' ? 'rgba(232,0,29,0.1)' : 'rgba(59,130,246,0.1)',
              border: `1px solid ${decidedAction==='APPROVE' ? 'rgba(16,185,129,0.3)' : decidedAction==='REJECT' ? 'rgba(232,0,29,0.3)' : 'rgba(59,130,246,0.3)'}`,
              borderRadius: 6, padding: '10px 16px', fontSize: 13, fontWeight: 700, fontFamily: 'var(--f-mono)',
              color: decidedAction==='APPROVE' ? '#059669' : decidedAction==='REJECT' ? '#E8001D' : '#2563EB',
            }}>✓ ĐÃ QUYẾT ĐỊNH: {decidedAction}</div>
          )}
        </div>

        {isFraud && (
          <div style={{ background: 'rgba(232,0,29,0.08)', border: '1px solid rgba(232,0,29,0.3)', borderRadius: 8,
            padding: '12px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8001D" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{ fontSize: 14, color: '#B91C1C', fontWeight: 600 }}>
              🔴 ƯU TIÊN FRAUD — {dec.signals?.length??0} tín hiệu gian lận. Yêu cầu EDD.
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* LEFT — AI panel */}
          <div>
            <div style={{ background: '#fff', border: '1px solid var(--line)', padding: '28px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
              <div className="cp-corner ct-tl"/><div className="cp-corner ct-tr"/><div className="cp-corner ct-bl"/><div className="cp-corner ct-br"/>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, fontWeight: 600, color: 'var(--signal)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24, paddingBottom: 12, borderBottom: '1px dashed var(--line)' }}>Kết quả AI Scoring</div>
              
              <GaugeChart value={dec.final_score} size={200} />
              
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--mute)' }}>Fraud Score</span>
                  <span style={{ color: FRAUD_C[dec.fraud_level]??'var(--mute)', fontWeight: 700, fontFamily: 'var(--f-mono)' }}>{Math.round((dec.fraud_score??0)*100)}/100 — {dec.fraud_level}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--mute)' }}>Độ tin cậy</span>
                  <span style={{ color: 'var(--ink)', fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{Math.round((dec.confidence??0)*100)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--mute)' }}>Khuyến nghị AI</span>
                  <span style={{ color: dec.recommendation==='APPROVE' ? '#10B981' : '#F59E0B', fontWeight: 700 }}>{dec.recommendation}</span>
                </div>
                {dec.suggested_limit>0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: 'var(--mute)' }}>Hạn mức đề xuất</span>
                    <span style={{ color: 'var(--ink)', fontWeight: 700, fontFamily: 'var(--f-mono)' }}>{(dec.suggested_limit/1e6).toFixed(0)}M VND</span>
                  </div>
                )}
              </div>
              
              <div style={{ borderTop: '1px solid var(--line-2)', marginTop: 20, paddingTop: 20 }}>
                <div style={{ fontSize: 10, color: 'var(--mute)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Yếu tố tích cực</div>
                {(dec.positive_factors??[]).map((f,i)=><div key={i} style={{ padding: '8px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, marginBottom: 8, fontSize: 13, color: '#166534', fontWeight: 500 }}>✓ {f.label}</div>)}
                
                <div style={{ fontSize: 10, color: 'var(--mute)', marginTop: 16, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Yếu tố rủi ro</div>
                {(dec.risk_factors??[]).map((f,i)=><div key={i} style={{ padding: '8px 12px', background: 'rgba(232,0,29,0.06)', border: '1px solid rgba(232,0,29,0.15)', borderRadius: 6, marginBottom: 8, fontSize: 13, color: '#991B1B', fontWeight: 500 }}>! {f.label}</div>)}
              </div>
              
              {(dec.signals??[]).length>0 && (
                <div style={{ borderTop: '1px solid var(--line-2)', marginTop: 16, paddingTop: 16 }}>
                  <div style={{ fontSize: 10, color: '#E8001D', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>🔴 Tín hiệu gian lận</div>
                  {dec.signals.map((s,i)=>(
                    <div key={i} style={{ padding: '8px 12px', background: 'rgba(232,0,29,0.06)', border: '1px solid rgba(232,0,29,0.2)', borderRadius: 6, marginBottom: 8, fontSize: 13, color: '#991B1B', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500 }}>
                      <span style={{ background: s.severity==='HIGH'?'#E8001D':'#F59E0B', color: '#fff', fontSize: 9.5, fontWeight: 700, padding: '3px 6px', borderRadius: 4, fontFamily: 'var(--f-mono)', flexShrink: 0 }}>{s.severity}</span>
                      {s.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 8, padding: '24px', marginTop: 24 }}>
              <div style={{ fontSize: 11, color: 'var(--mute)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase' }}>Quyết định cuối cùng — CO-001</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="ctaBtn" style={{ background: decided ? '#F3F1EA' : '#10B981', color: decided ? '#A0A0A0' : '#fff', flex: 1, padding: '12px 6px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'var(--f-sans)' }} onClick={()=>handleAction('APPROVE')} disabled={decided}>✓ DUYỆT</button>
                <button className="ctaBtn" style={{ background: decided ? '#F3F1EA' : '#E8001D', color: decided ? '#A0A0A0' : '#fff', flex: 1, padding: '12px 6px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'var(--f-sans)' }} onClick={()=>handleAction('REJECT')} disabled={decided}>✗ TỪ CHỐI</button>
                <button className="ctaBtn" style={{ background: decided ? '#F3F1EA' : '#F59E0B', color: decided ? '#A0A0A0' : '#fff', flex: 1, padding: '12px 6px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'var(--f-sans)' }} onClick={()=>handleAction('ESCALATE')} disabled={decided}>↑ ESCALATE</button>
                <button className="ctaBtn" style={{ background: decided ? '#F3F1EA' : 'var(--canvas-2)', color: decided ? '#A0A0A0' : 'var(--ink)', border: '1px solid var(--line)', flex: 1, padding: '12px 6px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'var(--f-sans)' }} onClick={()=>handleAction('NEED_INFO')} disabled={decided}>? THÊM TT</button>
              </div>
              <textarea style={{ width: '100%', background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 6, color: 'var(--ink)', fontSize: 13, padding: '12px', resize: 'vertical', minHeight: 80, outline: 'none', fontFamily: 'var(--f-sans)', boxSizing: 'border-box', marginTop: 16 }} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Ghi chú thẩm định của CO (tuỳ chọn)..." disabled={decided} />
            </div>
          </div>

          {/* RIGHT — applicant data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#fff', border: '1px solid var(--line)', padding: '24px', borderRadius: 8 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 600, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Thông tin cá nhân & tài chính</div>
              {[
                ['Họ và tên', app.full_name],
                ['CCCD', app.cccd],
                ['Ngày sinh', app.dob??'—'],
                ['Giới tính', app.gender??'—'],
                ['Tỉnh/Thành', app.province??'—'],
                ['Thu nhập/tháng', `${incM}M VND`],
                ['Đơn vị', app.employer_name??'—'],
                ['Loại hình', app.employer_type??'—'],
                ['Thâm niên làm việc', `${app.employment_months??0} tháng`],
              ].map(([l,v])=>(
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, borderBottom: '1px solid var(--line-2)', paddingBottom: 6 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--mute)' }}>{l}</span>
                  <span style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--line)', padding: '24px', borderRadius: 8 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 600, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Dữ liệu CIC (Synthetic Mock)</div>
              {[
                ['CIC Score', `${app.cic_score??0}/850`],
                ['Tổng dư nợ đang có', `${((app.cic_total_debt??0)/1e6).toFixed(0)}M VND`],
                ['DPD tối đa 12T qua', `${app.cic_max_dpd_12m??0} ngày`],
                ['Tra cứu CIC/6T', `${app.cic_inquiries_6m??0} lần`],
                ['DTI ước tính', `${(dec.dti??0).toFixed(1)}%`],
                ['Nhóm nợ cao nhất', `Nhóm ${app.cic_debt_group??1}`],
              ].map(([l,v])=>(
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, borderBottom: '1px solid var(--line-2)', paddingBottom: 6 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--mute)' }}>{l}</span>
                  <span style={{ color: 'var(--ink)', fontFamily: 'var(--f-mono)', fontWeight: 600, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--line)', padding: '24px', borderRadius: 8 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 600, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Dữ liệu eKYC & Anti-Fraud</div>
              {[
                ['eKYC Status',    app.ekyk_pass?'✓ SUCCESS':'✗ FAILED'],
                ['Face Match Score',     `${Math.round((app.face_match??1)*100)}%`],
                ['Application Velocity',   `${app.app_velocity_24h??1} đơn/24h`],
                ['Xác minh đơn vị CT',  app.employer_unverifiable?'✗ Không xác minh được':'✓ Verified'],
              ].map(([l,v])=>(
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, borderBottom: '1px solid var(--line-2)', paddingBottom: 6 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--mute)' }}>{l}</span>
                  <span style={{
                    color: v.startsWith('✗') ? '#E8001D' : v.startsWith('✓') ? '#10B981' : 'var(--ink)',
                    fontFamily: 'var(--f-mono)', fontWeight: 600, textAlign: 'right'
                  }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Adverse action */}
        {adverse && (
          <div style={{ background: '#fff', border: '2px solid rgba(232,0,29,0.3)', borderRadius: 12, padding: '24px 32px', marginTop: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: '#E8001D' }}/>
            <div style={{ fontSize: 11, color: '#E8001D', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              📄 THÔNG BÁO TỪ CHỐI — ADVERSE ACTION NOTICE (Template NĐ 356/2025)
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Kính gửi: {adverse.applicant_name}</div>
            <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 16, lineHeight: 1.6 }}>
              Sau khi xem xét hồ sơ, chúng tôi rất tiếc phải thông báo Quý khách hiện tại: <strong style={{ color: '#E8001D' }}>CHƯA ĐÁP ỨNG ĐIỀU KIỆN MỞ THẺ</strong>.
            </div>
            <div style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 8, fontWeight: 600 }}>LÝ DO CHÍNH (ĐƯỢC TẠO TỰ ĐỘNG BỞI AI XAI):</div>
            {adverse.reasons.map((r,i)=>(
              <div key={i} style={{ padding: '10px 14px', background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 6, marginBottom: 8, fontSize: 13, color: 'var(--ink)', display: 'flex', gap: 12 }}>
                <span style={{ color: '#E8001D', fontWeight: 700, flexShrink: 0 }}>({i+1})</span>
                {r}
              </div>
            ))}
            {adverse.customer_rights.length>0 && (
              <>
                <div style={{ fontSize: 12, color: 'var(--mute)', margin: '20px 0 10px', fontWeight: 600 }}>QUYỀN CỦA QUÝ KHÁCH:</div>
                {adverse.customer_rights.map((r,i)=>(
                  <div key={i} style={{ fontSize: 13, color: 'var(--ink-2)', padding: '4px 0 4px 16px', borderLeft: '2px solid var(--line-2)', marginBottom: 6 }}>• {r}</div>
                ))}
              </>
            )}
            <div style={{ marginTop: 24, padding: '12px 16px', background: 'var(--canvas-2)', border: '1px solid var(--line)', borderRadius: 6, fontSize: 12, color: 'var(--mute)' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>ⓘ {adverse.ai_label}</div>
              {adverse.ai_law_ref}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--mute-2)', fontFamily: 'var(--f-mono)' }}>
              {adverse.hotline} · {adverse.email} · {adverse.decision_date}
            </div>
          </div>
        )}
      </div>

      <OverrideModal isOpen={modal.open} onClose={()=>setModal({open:false,action:null})}
        onConfirm={onOverrideConfirm} aiRec={dec.recommendation} humanDecision={modal.action} />
    </div>
  );
}
