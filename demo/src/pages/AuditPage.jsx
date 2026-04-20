import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AILabel from '../components/AILabel.jsx';
import DemoWatermark from '../components/DemoWatermark.jsx';
import { listAudit, exportCSV } from '../lib/db.js';

const STATES = ['','STATE_1','STATE_2','STATE_3','STATE_4','STATE_5'];
const DECISIONS = ['','APPROVE','REJECT','ESCALATE','NEED_INFO'];

const STATE_C = { STATE_1:'#10B981', STATE_2:'#3B82F6', STATE_3:'#EF4444', STATE_4:'#F59E0B', STATE_5:'#8A8680' };
const DEC_C   = { APPROVE:'#10B981', REJECT:'#EF4444', ESCALATE:'#F59E0B', NEED_INFO:'#3B82F6' };

export default function AuditPage() {
  const nav = useNavigate();
  const [page, setPage]     = useState(1);
  const [filter, setFilter] = useState({ state:'', decision:'', overrideOnly:false });
  const [data, setData]     = useState([]);
  const [total, setTotal]   = useState(0);
  const [expanded, setExp]  = useState(null);
  const LIMIT = 20;

  function load(p, f) {
    const res = listAudit({ page:p, limit:LIMIT, filters:f });
    setData(res.data); setTotal(res.total);
  }

  useEffect(()=>{ load(page, filter); },[page, filter]);

  function setF(k,v) {
    const nf = {...filter,[k]:v};
    setFilter(nf); setPage(1);
  }

  function doExport() {
    const csv = exportCSV();
    if (!csv) return alert('Không có dữ liệu audit');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download = `ai-crds-audit-${Date.now()}.csv`;
    a.click();
  }

  const pages = Math.max(1, Math.ceil(total/LIMIT));

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
          <button className="nav-link" onClick={()=>nav('/review/batch')}>Batch</button>
        </div>
      </nav>
      <AILabel />
      <DemoWatermark />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 28, color: 'var(--ink)' }}>Audit Log</div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--mute)', marginTop: 4 }}>
              {total} bản ghi — append-only, 28 fields — SBV audit ready
            </div>
          </div>
          <button onClick={doExport} className="btn-ghost btn-sm">
            ↓ Export CSV
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center', background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--line)' }}>
          <span style={{ fontSize: 12, color: 'var(--mute)', fontWeight: 500 }}>LỌC THEO:</span>
          
          <select style={{ background: 'var(--canvas-2)', border: '1px solid var(--line)', borderRadius: 4, color: 'var(--ink)', fontSize: 12, padding: '7px 10px', outline: 'none', cursor: 'pointer' }} value={filter.state} onChange={e=>setF('state',e.target.value)}>
            <option value="">Tất cả phân tuyến AI (State)</option>
            {STATES.filter(Boolean).map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          
          <select style={{ background: 'var(--canvas-2)', border: '1px solid var(--line)', borderRadius: 4, color: 'var(--ink)', fontSize: 12, padding: '7px 10px', outline: 'none', cursor: 'pointer' }} value={filter.decision} onChange={e=>setF('decision',e.target.value)}>
            <option value="">Tất cả quyết định cuối cùng</option>
            {DECISIONS.filter(Boolean).map(d=><option key={d} value={d}>{d}</option>)}
          </select>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink)', cursor: 'pointer', fontWeight: 500, paddingLeft: 8 }}>
            <input type="checkbox" checked={filter.overrideOnly} onChange={e=>setF('overrideOnly',e.target.checked)} style={{ accentColor: 'var(--ink)' }} />
            Chỉ xem hồ sơ có Override
          </label>
          
          {(filter.state||filter.decision||filter.overrideOnly) && (
            <button style={{ background: 'none', border: 'none', color: '#E8001D', fontSize: 12, cursor: 'pointer', fontWeight: 600, marginLeft: 8 }}
              onClick={()=>{setFilter({state:'',decision:'',overrideOnly:false});setPage(1);}}>
              ✕ Xoá lọc
            </button>
          )}
        </div>

        {data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--mute)' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>📋</div>
            <div style={{ marginBottom: 16, fontSize: 14 }}>Chưa có audit log (hoặc không khớp bộ lọc) — hãy tạo và xét duyệt một số hồ sơ</div>
            <button className="btn-primary btn-lg" onClick={()=>nav('/apply')}>→ Tạo hồ sơ</button>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid var(--line)', position: 'relative' }}>
            <table className="d-table" style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Tên khách</th>
                  <th>Điểm AI</th>
                  <th>State</th>
                  <th>Quyết định</th>
                  <th>CO ID</th>
                  <th>Override</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map(e => {
                  const isE = expanded === e.id;
                  const cState = STATE_C[e.state_routed] ?? 'var(--mute)';
                  const cDec = DEC_C[e.human_decision] ?? 'var(--mute)';
                  return (
                    <React.Fragment key={e.id}>
                      <tr style={{ background: isE ? 'var(--canvas-2)' : 'transparent', cursor: 'pointer' }}
                        onClick={()=>setExp(ex=>ex===e.id?null:e.id)}>
                        <td style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--mute)' }}>
                          {new Date(e.created_at).toLocaleString('vi-VN',{dateStyle:'short',timeStyle:'short'})}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{e.app_full_name}</div>
                          <div style={{ fontSize: 10, color: 'var(--mute)', fontFamily: 'var(--f-mono)' }}>{e.app_cccd}</div>
                        </td>
                        <td style={{ fontFamily: 'var(--f-mono)' }}>
                          <span style={{ color: e.ai_risk_score>=0.75?'#10B981':e.ai_risk_score>=0.35?'#D97706':'#E8001D', fontWeight: 700 }}>
                            {Math.round((e.ai_risk_score??0)*100)}
                          </span>
                          <span style={{ color: 'var(--mute-2)', fontSize: 10 }}>/100</span>
                        </td>
                        <td>
                          <span style={{ display: 'inline-block', color: cState, background: `${cState}15`, border: `1px solid ${cState}30`, padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--f-mono)', fontSize: 10, fontWeight: 700 }}>{e.state_routed}</span>
                        </td>
                        <td>
                          {e.human_decision
                            ? <span style={{ display: 'inline-block', color: cDec, background: `${cDec}15`, border: `1px solid ${cDec}30`, padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--f-mono)', fontSize: 10, fontWeight: 700 }}>{e.human_decision}</span>
                            : <span style={{ color: 'var(--mute)', fontSize: 11 }}>—</span>
                          }
                        </td>
                        <td style={{ fontSize: 11, color: 'var(--mute)', fontFamily: 'var(--f-mono)' }}>{e.co_id??'—'}</td>
                        <td>
                          {e.override_flag
                            ? <span style={{ display: 'inline-block', color: '#D97706', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--f-mono)', fontSize: 10, fontWeight: 700 }}>OVERRIDE</span>
                            : <span style={{ color: 'var(--mute-2)', fontSize: 11 }}>—</span>
                          }
                        </td>
                        <td style={{ fontSize: 11, color: 'var(--mute)', textAlign: 'right' }}>{isE?'▲':'▼'}</td>
                      </tr>
                      {isE && (
                        <tr style={{ background: 'var(--canvas)' }}>
                          <td colSpan={8} style={{ padding: '0' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--line-2)' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
                                
                                {/* AI output */}
                                <div>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>AI Prediction Snapshot</div>
                                  {[
                                    ['Risk Score', `${Math.round((e.ai_risk_score??0)*100)}/100`],
                                    ['Fraud Score', `${Math.round((e.ai_fraud_score??0)*100)}/100`],
                                    ['Confidence', `${Math.round((e.ai_confidence??0)*100)}%`],
                                    ['Recommendation', e.ai_recommendation??'—'],
                                    ['Model Version', e.model_version??'—'],
                                  ].map(([l,v])=>(
                                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                                      <span style={{ color: 'var(--mute-2)' }}>{l}</span>
                                      <span style={{ color: 'var(--ink)', fontFamily: 'var(--f-mono)', textAlign: 'right', fontWeight: 500 }}>{v}</span>
                                    </div>
                                  ))}
                                  <div style={{ marginTop: 12, borderTop: '1px solid var(--line-2)', paddingTop: 12 }}>
                                    <div style={{ fontSize: 10, color: 'var(--mute)', marginBottom: 6 }}>Risk factors recorded:</div>
                                    {(e.ai_risk_factors??[]).map((f,i)=><div key={i} style={{ fontSize: 11, color: '#B91C1C', marginBottom: 4 }}>! {f.label}</div>)}
                                  </div>
                                </div>

                                {/* Human decision */}
                                <div>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Human Interaction Context</div>
                                  {[
                                    ['CO ID', e.co_id??'—'],
                                    ['Quyết định', e.human_decision??'—'],
                                    ['Hạn mức cấp', e.approved_limit?`${(e.approved_limit/1e6).toFixed(0)}M VND`:'—'],
                                    ['Time-to-decision', e.review_seconds?`${e.review_seconds}s`:'—'],
                                    ['Override Flag', e.override_flag?'TRUE':'FALSE'],
                                  ].map(([l,v])=>(
                                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                                      <span style={{ color: 'var(--mute-2)' }}>{l}</span>
                                      <span style={{ color: 'var(--ink)', fontWeight: 500, fontFamily: l==='Time-to-decision' || l==='CO ID' ? 'var(--f-mono)' : 'var(--f-sans)' }}>{v}</span>
                                    </div>
                                  ))}
                                  {e.override_flag && (
                                    <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 6 }}>
                                      <div style={{ fontSize: 11, color: '#B45309', marginBottom: 4, fontWeight: 600 }}>Căn cứ Override: {e.override_reason_category}</div>
                                      <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.5 }}>"{e.override_reason_text}"</div>
                                    </div>
                                  )}
                                </div>

                                {/* Compliance */}
                                <div>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Compliance & Metadata</div>
                                  {[
                                    ['AI Label Displayed', e.ai_label_displayed?'YES':'NO'],
                                    ['Opt-out AI Selected', e.opt_out_ai?'YES':'NO'],
                                    ['Supervisor Present', e.override_supervisor_required?'YES':'NO/NA'],
                                    ['Record Hash', e.record_hash??'—'],
                                    ['Timestamp', e.decided_at ? new Date(e.decided_at).toLocaleString('vi-VN',{dateStyle:'short',timeStyle:'short'}) : '—'],
                                  ].map(([l,v])=>(
                                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                                      <span style={{ color: 'var(--mute-2)' }}>{l}</span>
                                      <span style={{ color: 'var(--ink)', fontFamily: 'var(--f-mono)', textAlign: 'right', fontWeight: 500 }}>{v}</span>
                                    </div>
                                  ))}
                                  {(e.ai_fraud_signals??[]).length>0 && (
                                    <div style={{ marginTop: 12, borderTop: '1px dashed rgba(232,0,29,0.3)', paddingTop: 12 }}>
                                      <div style={{ fontSize: 10, color: '#E8001D', marginBottom: 6, fontWeight: 700 }}>FRAUD SIGNALS FIRED</div>
                                      {e.ai_fraud_signals.map((s,i)=><div key={i} style={{ fontSize: 11, color: '#B91C1C', marginBottom: 4 }}>⚠ {s.label}</div>)}
                                    </div>
                                  )}
                                </div>

                              </div>
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

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
            <button className="btn-ghost btn-sm" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>←</button>
            {Array.from({length:pages},(_,i)=>i+1).map(p=>(
              <button key={p} className={p===page ? "btn-primary btn-sm" : "btn-ghost btn-sm"} onClick={()=>setPage(p)}>{p}</button>
            ))}
            <button className="btn-ghost btn-sm" onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}
