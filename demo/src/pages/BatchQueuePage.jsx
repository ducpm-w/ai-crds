import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AILabel from '../components/AILabel.jsx';
import DemoWatermark from '../components/DemoWatermark.jsx';
import { listByState, updateDecision, writeAudit } from '../lib/db.js';

const MAX = 10;

export default function BatchQueuePage() {
  const nav = useNavigate();
  const [items, setItems]   = useState([]);
  const [sel, setSel]       = useState(new Set());
  const [expanded, setExp]  = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(()=>{ setItems(listByState('STATE_1')); },[]);

  const toggleSel = id => setSel(prev=>{
    const n=new Set(prev);
    if(n.has(id)) n.delete(id); else if(n.size<MAX) n.add(id);
    return n;
  });

  function confirm() {
    if (!sel.size) return;
    const ts = Date.now();
    for (const appId of sel) {
      const item = items.find(i=>i.id===appId);
      if (!item?.decision) continue;
      updateDecision(item.decision.id, { status:'DECIDED', human_decision:'APPROVE', co_id:'CO-001',
        decided_at:new Date().toISOString(), batch_review:true, batch_id:`BATCH-${ts}` });
      writeAudit({
        decision_id:item.decision.id, application_id:appId,
        app_full_name:item.full_name, app_cccd:item.cccd,
        ai_risk_score:item.decision.final_score, ai_fraud_score:item.decision.fraud_score,
        ai_confidence:item.decision.confidence, ai_recommendation:item.decision.recommendation,
        state_routed:'STATE_1', ai_risk_factors:item.decision.risk_factors??[],
        ai_positive_factors:item.decision.positive_factors??[], ai_fraud_signals:item.decision.signals??[],
        human_decision:'APPROVE', approved_limit:item.decision.suggested_limit, override_flag:false,
        model_version:item.decision.model_version, threshold_version:item.decision.threshold_version,
      });
    }
    setSuccess(sel.size);
    setSel(new Set());
    setItems(listByState('STATE_1'));
  }

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
        <div className="nav-right">
          <button className="nav-link" onClick={()=>nav('/apply')}>Hồ sơ mới</button>
        </div>
      </nav>
      <AILabel />
      <DemoWatermark />

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 20px 100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 26, color: 'var(--ink)' }}>Hàng đợi Batch — STATE_1</div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--mute)', marginTop: 4 }}>Điểm cao ≥75, độ tin cậy ≥85% — sẵn sàng duyệt lô</div>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8,
            padding: '13px 18px', marginBottom: 16, fontSize: 13, color: '#166534', fontWeight: 600 }}>
            ✓ Đã xác nhận <strong>{success} hồ sơ</strong> — xử lý batch 3–5 phút vs {success*35} phút duyệt thủ công.{' '}
            <span style={{ color: 'var(--mute)', fontWeight: 400 }}>Audit log đã ghi nhận.</span>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {[
            { num: items.length, color: '#059669', lbl: 'Trong hàng đợi' },
            { num: `${sel.size}/${MAX}`, color: '#2563EB', lbl: 'Đã chọn' },
            { num: '3–5 phút', color: '#D97706', lbl: 'Thời gian AI xử lý' },
            { num: '35 phút', color: 'var(--ink)', lbl: 'Nếu thủ công' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: '#fff', border: '1px solid var(--line)', borderRadius: 8, padding: '16px', position: 'relative' }}>
              <div className="cp-corner ct-tl"/><div className="cp-corner ct-tr"/><div className="cp-corner ct-bl"/><div className="cp-corner ct-br"/>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 12, color: 'var(--mute)', fontWeight: 500 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--mute)' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>📭</div>
            <div style={{ marginBottom: 16, fontSize: 14 }}>Không có hồ sơ STATE_1 — tạo mới hoặc nhấn "Điền nhanh" rủi ro thấp trong trang Apply</div>
            <button className="btn-primary btn-lg" onClick={()=>nav('/apply')}>→ Tạo hồ sơ mới</button>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid var(--line)', padding: '2px', position: 'relative' }}>
            <table className="d-table" style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Họ tên</th>
                  <th>Điểm AI</th>
                  <th>Tin cậy</th>
                  <th>Yếu tố tích cực</th>
                  <th>Hạn mức đề xuất</th>
                  <th>Đơn vị</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const d = item.decision;
                  const sc = d?.final_score ?? 0;
                  const co = Math.round((d?.confidence ?? 0) * 100);
                  const isS = sel.has(item.id);
                  const isE = expanded === item.id;
                  const scoreColor = sc >= 0.75 ? '#166534' : sc >= 0.35 ? '#B45309' : '#B91C1C';
                  
                  return (
                    <React.Fragment key={item.id}>
                      <tr style={{ background: isS ? 'var(--canvas-2)' : 'transparent', cursor: 'pointer' }}
                        onClick={()=>setExp(e=>e===item.id?null:item.id)}>
                        <td onClick={e=>{e.stopPropagation();toggleSel(item.id);}} style={{ textAlign: 'center' }}>
                          <input type="checkbox" checked={isS} onChange={()=>toggleSel(item.id)} disabled={!isS && sel.size>=MAX}
                            style={{ accentColor: 'var(--ink)', width: 14, height: 14, cursor: 'pointer' }} />
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{item.full_name}</div>
                          <div style={{ fontSize: 11, color: 'var(--mute)', fontFamily: 'var(--f-mono)' }}>{item.cccd}</div>
                        </td>
                        <td style={{ fontFamily: 'var(--f-mono)' }}>
                          <span style={{ color: scoreColor, fontSize: 15, fontWeight: 700 }}>{Math.round(sc*100)}</span>
                          <span style={{ color: 'var(--mute-2)', fontSize: 11 }}>/100</span>
                        </td>
                        <td>
                          <span style={{ fontSize: 13, color: co>=85?'#059669':'#D97706', fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{co}%</span>
                          <div style={{ background: 'var(--line)', borderRadius: 99, height: 6, display: 'inline-block', width: 60, verticalAlign: 'middle', marginLeft: 8, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${co}%`, background: co>=85?'#10B981':'#F59E0B' }}/>
                          </div>
                        </td>
                        <td style={{ fontSize: 12, color: '#059669', maxWidth: 160 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                            {(d?.positive_factors??[])[0]?.label??'—'}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--f-mono)', color: 'var(--ink)', fontWeight: 600 }}>
                          {d?.suggested_limit>0?`${(d.suggested_limit/1e6).toFixed(0)}M`:'—'}
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--mute)' }}>{item.employer_name??'—'}</td>
                        <td style={{ fontSize: 11, color: 'var(--mute)', textAlign: 'right' }}>{isE?'▲':'▼'}</td>
                      </tr>
                      {isE && (
                        <tr style={{ background: 'var(--canvas)' }}>
                          <td colSpan={8} style={{ padding: '0' }}>
                            <div style={{ padding: '20px 48px', borderBottom: '1px solid var(--line-2)' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <div>
                                  <div style={{ fontSize: 11, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, fontWeight: 600 }}>Thông tin tài chính</div>
                                  <div style={{ fontSize: 13, color: 'var(--mute)', marginBottom: 4 }}>Thu nhập: <strong style={{ color: 'var(--ink)' }}>{((item.monthly_income??0)/1e6).toFixed(0)}M/tháng</strong></div>
                                  <div style={{ fontSize: 13, color: 'var(--mute)', marginBottom: 4 }}>Thâm niên: <strong style={{ color: 'var(--ink)' }}>{item.employment_months??0} tháng</strong></div>
                                  <div style={{ fontSize: 13, color: 'var(--mute)' }}>CIC Score: <strong style={{ color: 'var(--ink)' }}>{item.cic_score??0}/850</strong></div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, fontWeight: 600 }}>Các yếu tố tích cực AI ghi nhận</div>
                                  {(d?.positive_factors??[]).map((f,i)=><div key={i} style={{ fontSize: 12, color: '#166534', marginBottom: 4, background: 'rgba(34,197,94,0.1)', padding: '4px 8px', borderRadius: 4, display: 'inline-block', marginRight: 8 }}>✓ {f.label}</div>)}
                                </div>
                              </div>
                              <button className="btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={()=>nav(`/review/${item.id}`)}>Xem chi tiết toàn bộ hồ sơ →</button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--line)', zIndex: 100 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--mute)' }}>
            Đã chọn <strong style={{ color: 'var(--ink)' }}>{sel.size}</strong>/{MAX}
            {sel.size>0 && <span> — tiết kiệm ~{sel.size*30}–{sel.size*35} phút thẩm định</span>}
          </span>
          <button onClick={confirm} disabled={!sel.size} className="btn-primary"
            style={{ background: sel.size ? '#059669' : '#E4E2DC', borderColor: sel.size ? '#059669' : '#E4E2DC', color: sel.size ? '#fff' : '#A0A0A0', cursor: sel.size ? 'pointer' : 'not-allowed', padding: '10px 24px', borderRadius: 6, fontWeight: 700 }}>
            ✓ Duyệt{sel.size>0?` ${sel.size} hồ sơ`:''}
          </button>
          <button disabled={!sel.size}
            style={{ background: 'none', border: `1px solid ${sel.size ? '#D97706' : '#E4E2DC'}`, color: sel.size ? '#D97706' : '#A0A0A0', cursor: sel.size ? 'pointer' : 'not-allowed', padding: '10px 24px', borderRadius: 6, fontWeight: 600, fontSize: 14 }}>
            ⚑ Cần xem xét lại
          </button>
        </div>
      </div>
    </div>
  );
}
