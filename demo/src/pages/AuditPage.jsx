import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AILabel from '../components/AILabel.jsx';
import DemoWatermark from '../components/DemoWatermark.jsx';
import { listAudit, exportCSV } from '../lib/db.js';

const STATES = ['','STATE_1','STATE_2','STATE_3','STATE_4','STATE_5'];
const DECISIONS = ['','APPROVE','REJECT','ESCALATE','NEED_INFO'];

const STATE_C = { STATE_1:'#22C55E', STATE_2:'#3B82F6', STATE_3:'#EF4444', STATE_4:'#F59E0B', STATE_5:'#888' };
const DEC_C   = { APPROVE:'#22C55E', REJECT:'#EF4444', ESCALATE:'#F59E0B', NEED_INFO:'#3B82F6' };

const F = {
  page:{ minHeight:'100vh', background:'#0A0A0A', color:'#E8E8E8', fontFamily:"'DM Sans',sans-serif" },
  nav:{ background:'#111', borderBottom:'1px solid #1E1E1E', padding:'0 28px', height:52,
    display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 },
  brand:{ color:'#E8001D', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Sora',sans-serif", background:'none', border:'none' },
  navBtn:{ background:'none', border:'none', color:'#555', fontSize:13, cursor:'pointer', padding:'5px 10px', fontFamily:"'DM Sans',sans-serif" },
  wrap:{ maxWidth:1200, margin:'0 auto', padding:'24px 20px 60px' },
  filterRow:{ display:'flex', gap:10, flexWrap:'wrap', margin:'16px 0', alignItems:'center' },
  sel:{ background:'#111', border:'1px solid #1A1A1A', borderRadius:6, color:'#888', fontSize:12,
    padding:'7px 10px', outline:'none', fontFamily:"'DM Sans',sans-serif" },
  chk:{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#666', cursor:'pointer' },
  exportBtn:{ background:'none', border:'1px solid #1A1A1A', color:'#555', borderRadius:6,
    padding:'7px 13px', cursor:'pointer', fontSize:12, fontFamily:"'DM Sans',sans-serif', marginLeft:'auto" },
  tbl:{ width:'100%', borderCollapse:'collapse' },
  th:{ background:'#0D0D0D', padding:'9px 13px', textAlign:'left', fontSize:10, fontWeight:700,
    color:'#444', textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:'1px solid #1A1A1A', fontFamily:"'Sora',sans-serif" },
  td:{ padding:'10px 13px', fontSize:12, color:'#AAA', borderBottom:'1px solid #0F0F0F', cursor:'pointer' },
  pill:(c)=>({ display:'inline-block', background:`${c}18`, border:`1px solid ${c}40`,
    color:c, borderRadius:4, padding:'2px 7px', fontSize:11, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }),
  drawer:{ background:'#0D0D0D', borderBottom:'1px solid #1A1A1A' },
  drawCell:{ padding:'16px 20px' },
  grid3:{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 },
  dSec:{ fontSize:10, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 },
  dRow:{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 },
  dLbl:{ color:'#444' },
  dVal:{ color:'#AAA', textAlign:'right', maxWidth:'60%', wordBreak:'break-all' },
  pager:{ display:'flex', gap:8, justifyContent:'center', marginTop:18 },
  pgBtn:(active)=>({ background:active?'#3B82F6':'#111', border:'1px solid #1A1A1A',
    color:active?'#fff':'#555', borderRadius:5, padding:'6px 12px', cursor:'pointer',
    fontSize:12, fontFamily:"'DM Sans',sans-serif" }),
  emptyWrap:{ textAlign:'center', padding:'60px 0', color:'#444' },
};

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
    <div style={F.page}>
      <nav style={F.nav}>
        <button style={F.brand} onClick={()=>nav('/')}>AI-CRDS</button>
        <div>
          <button style={F.navBtn} onClick={()=>nav('/apply')}>Hồ sơ mới</button>
          <button style={F.navBtn} onClick={()=>nav('/review/batch')}>Batch</button>
        </div>
      </nav>
      <AILabel />
      <DemoWatermark />

      <div style={F.wrap}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:4}}>
          <div>
            <div style={{fontSize:21, fontWeight:800, color:'#E8E8E8', fontFamily:"'Sora',sans-serif"}}>Audit Log</div>
            <div style={{fontSize:13, color:'#444', marginTop:2}}>
              {total} bản ghi — append-only, 28 fields — SBV audit ready
            </div>
          </div>
          <button onClick={doExport} style={{background:'none', border:'1px solid #1A1A1A', color:'#555',
            borderRadius:6, padding:'7px 13px', cursor:'pointer', fontSize:12, fontFamily:"'DM Sans',sans-serif"}}>
            ↓ Export CSV
          </button>
        </div>

        {/* Filters */}
        <div style={F.filterRow}>
          <span style={{fontSize:12,color:'#444'}}>Lọc:</span>
          <select style={F.sel} value={filter.state} onChange={e=>setF('state',e.target.value)}>
            <option value="">Tất cả State</option>
            {STATES.filter(Boolean).map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select style={F.sel} value={filter.decision} onChange={e=>setF('decision',e.target.value)}>
            <option value="">Tất cả quyết định</option>
            {DECISIONS.filter(Boolean).map(d=><option key={d} value={d}>{d}</option>)}
          </select>
          <label style={F.chk}>
            <input type="checkbox" checked={filter.overrideOnly} onChange={e=>setF('overrideOnly',e.target.checked)} />
            Override only
          </label>
          {(filter.state||filter.decision||filter.overrideOnly) && (
            <button style={{...F.sel, color:'#EF4444', cursor:'pointer'}}
              onClick={()=>{setFilter({state:'',decision:'',overrideOnly:false});setPage(1);}}>
              ✕ Xoá lọc
            </button>
          )}
        </div>

        {data.length === 0 ? (
          <div style={F.emptyWrap}>
            <div style={{fontSize:28,marginBottom:10}}>📋</div>
            <div style={{marginBottom:10}}>Chưa có audit log — hãy tạo và xét duyệt một số hồ sơ</div>
            <button style={{background:'#3B82F6',border:'none',color:'#fff',padding:'9px 18px',borderRadius:6,cursor:'pointer',fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}
              onClick={()=>nav('/apply')}>→ Tạo hồ sơ</button>
          </div>
        ) : (
          <div style={{background:'#0D0D0D', border:'1px solid #1A1A1A', borderRadius:10, overflow:'hidden'}}>
            <table style={F.tbl}>
              <thead>
                <tr>
                  <th style={F.th}>Thời gian</th>
                  <th style={F.th}>Tên khách</th>
                  <th style={F.th}>Điểm AI</th>
                  <th style={F.th}>State</th>
                  <th style={F.th}>Quyết định</th>
                  <th style={F.th}>CO</th>
                  <th style={F.th}>Override</th>
                  <th style={F.th}></th>
                </tr>
              </thead>
              <tbody>
                {data.map(e=>{
                  const isE = expanded===e.id;
                  return [
                    <tr key={e.id} style={{background:isE?'rgba(59,130,246,0.04)':'transparent'}}
                      onClick={()=>setExp(ex=>ex===e.id?null:e.id)}>
                      <td style={{...F.td, fontFamily:"'JetBrains Mono',monospace", fontSize:11}}>
                        {new Date(e.created_at).toLocaleString('vi-VN',{dateStyle:'short',timeStyle:'short'})}
                      </td>
                      <td style={F.td}>
                        <div style={{fontWeight:600,color:'#CCC'}}>{e.app_full_name}</div>
                        <div style={{fontSize:10,color:'#333',fontFamily:"'JetBrains Mono',monospace"}}>{e.app_cccd}</div>
                      </td>
                      <td style={{...F.td, fontFamily:"'JetBrains Mono',monospace"}}>
                        <span style={{color:e.ai_risk_score>=0.75?'#22C55E':e.ai_risk_score>=0.35?'#F59E0B':'#EF4444',fontWeight:700}}>
                          {Math.round((e.ai_risk_score??0)*100)}
                        </span>
                        <span style={{color:'#333',fontSize:10}}>/100</span>
                      </td>
                      <td style={F.td}>
                        <span style={F.pill(STATE_C[e.state_routed]??'#555')}>{e.state_routed}</span>
                      </td>
                      <td style={F.td}>
                        {e.human_decision
                          ? <span style={F.pill(DEC_C[e.human_decision]??'#888')}>{e.human_decision}</span>
                          : <span style={{color:'#333',fontSize:11}}>—</span>
                        }
                      </td>
                      <td style={{...F.td, fontSize:11, color:'#444', fontFamily:"'JetBrains Mono',monospace"}}>{e.co_id??'—'}</td>
                      <td style={F.td}>
                        {e.override_flag
                          ? <span style={F.pill('#F59E0B')}>OVERRIDE</span>
                          : <span style={{color:'#2A2A2A',fontSize:11}}>—</span>
                        }
                      </td>
                      <td style={{...F.td,fontSize:11,color:'#3B82F6',textAlign:'right'}}>{isE?'▲':'▼'}</td>
                    </tr>,
                    isE && (
                      <tr key={`${e.id}-d`} style={F.drawer}>
                        <td colSpan={8} style={F.drawCell}>
                          <div style={F.grid3}>
                            {/* AI output */}
                            <div>
                              <div style={F.dSec}>AI Output</div>
                              {[
                                ['Risk Score', `${Math.round((e.ai_risk_score??0)*100)}/100`],
                                ['Fraud Score', `${Math.round((e.ai_fraud_score??0)*100)}/100`],
                                ['Confidence', `${Math.round((e.ai_confidence??0)*100)}%`],
                                ['Recommendation', e.ai_recommendation??'—'],
                                ['Model', e.model_version??'—'],
                              ].map(([l,v])=>(
                                <div key={l} style={F.dRow}>
                                  <span style={F.dLbl}>{l}</span>
                                  <span style={{...F.dVal,fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                                </div>
                              ))}
                              <div style={{marginTop:8}}>
                                <div style={{fontSize:10,color:'#333',marginBottom:4}}>Risk factors</div>
                                {(e.ai_risk_factors??[]).map((f,i)=><div key={i} style={{fontSize:11,color:'#FCA5A5',marginBottom:2}}>! {f.label}</div>)}
                              </div>
                            </div>
                            {/* Human decision */}
                            <div>
                              <div style={F.dSec}>Quyết định CO</div>
                              {[
                                ['CO ID', e.co_id??'—'],
                                ['Quyết định', e.human_decision??'—'],
                                ['Hạn mức', e.approved_limit?`${(e.approved_limit/1e6).toFixed(0)}M VND`:'—'],
                                ['Thời gian review', e.review_seconds?`${e.review_seconds}s`:'—'],
                                ['Override', e.override_flag?'CÓ':'KHÔNG'],
                              ].map(([l,v])=>(
                                <div key={l} style={F.dRow}>
                                  <span style={F.dLbl}>{l}</span>
                                  <span style={F.dVal}>{v}</span>
                                </div>
                              ))}
                              {e.override_flag && (
                                <div style={{marginTop:8, padding:'8px 10px', background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:5}}>
                                  <div style={{fontSize:11,color:'#FDE68A',marginBottom:3}}>{e.override_reason_category}</div>
                                  <div style={{fontSize:11,color:'#888',lineHeight:1.5}}>{e.override_reason_text}</div>
                                </div>
                              )}
                            </div>
                            {/* Compliance */}
                            <div>
                              <div style={F.dSec}>Compliance & Meta</div>
                              {[
                                ['AI Label displayed', e.ai_label_displayed?'✓ CÓ':'✗ KHÔNG'],
                                ['Opt-out AI', e.opt_out_ai?'CÓ':'KHÔNG'],
                                ['Supervisor required', e.override_supervisor_required?'CÓ':'KHÔNG'],
                                ['Record Hash', e.record_hash??'—'],
                                ['Decided at', e.decided_at ? new Date(e.decided_at).toLocaleString('vi-VN',{dateStyle:'short',timeStyle:'short'}) : '—'],
                              ].map(([l,v])=>(
                                <div key={l} style={F.dRow}>
                                  <span style={F.dLbl}>{l}</span>
                                  <span style={{...F.dVal,fontFamily:l==='Record Hash'?"'JetBrains Mono',monospace":undefined}}>{v}</span>
                                </div>
                              ))}
                              {(e.ai_fraud_signals??[]).length>0 && (
                                <div style={{marginTop:8}}>
                                  <div style={{fontSize:10,color:'#EF4444',marginBottom:4}}>Fraud signals</div>
                                  {e.ai_fraud_signals.map((s,i)=><div key={i} style={{fontSize:11,color:'#FCA5A5',marginBottom:2}}>⚠ {s.label}</div>)}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  ];
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={F.pager}>
            <button style={F.pgBtn(false)} onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>←</button>
            {Array.from({length:pages},(_,i)=>i+1).map(p=>(
              <button key={p} style={F.pgBtn(p===page)} onClick={()=>setPage(p)}>{p}</button>
            ))}
            <button style={F.pgBtn(false)} onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}
