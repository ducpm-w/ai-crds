import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AILabel from '../components/AILabel.jsx';
import DemoWatermark from '../components/DemoWatermark.jsx';
import { listByState, updateDecision, writeAudit } from '../lib/db.js';

const MAX = 10;

const F = {
  page:{ minHeight:'100vh', background:'#0A0A0A', color:'#E8E8E8', fontFamily:"'DM Sans',sans-serif", paddingBottom:80 },
  nav:{ background:'#111', borderBottom:'1px solid #1E1E1E', padding:'0 28px', height:52,
    display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 },
  brand:{ color:'#E8001D', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Sora',sans-serif", background:'none', border:'none' },
  navBtn:{ background:'none', border:'none', color:'#555', fontSize:13, cursor:'pointer', padding:'5px 10px', fontFamily:"'DM Sans',sans-serif" },
  wrap:{ maxWidth:1080, margin:'0 auto', padding:'24px 20px' },
  h1:{ fontSize:21, fontWeight:800, color:'#E8E8E8', fontFamily:"'Sora',sans-serif" },
  sub:{ fontSize:13, color:'#555', marginTop:2 },
  stats:{ display:'flex', gap:12, margin:'18px 0' },
  stat:{ background:'#111', border:'1px solid #1E1E1E', borderRadius:8, padding:'11px 16px', minWidth:120 },
  sNum:{ fontSize:20, fontWeight:800, fontFamily:"'JetBrains Mono',monospace" },
  sLbl:{ fontSize:11, color:'#555', marginTop:2 },
  tbl:{ width:'100%', borderCollapse:'collapse' },
  th:{ background:'#0D0D0D', padding:'9px 13px', textAlign:'left', fontSize:10, fontWeight:700,
    color:'#444', textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:'1px solid #1A1A1A', fontFamily:"'Sora',sans-serif" },
  td:{ padding:'11px 13px', fontSize:13, color:'#CCC', borderBottom:'1px solid #111' },
  bar:{ background:'#1A1A1A', borderRadius:99, height:5, overflow:'hidden', display:'inline-block', width:64, verticalAlign:'middle', marginLeft:5 },
  confirmBar:{ position:'fixed', bottom:0, left:0, right:0, background:'#111', borderTop:'1px solid #1E1E1E',
    padding:'13px 28px', display:'flex', alignItems:'center', gap:14, zIndex:100 },
};

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
    <div style={F.page}>
      <nav style={F.nav}>
        <button style={F.brand} onClick={()=>nav('/')}>AI-CRDS</button>
        <div>
          <button style={F.navBtn} onClick={()=>nav('/apply')}>Hồ sơ mới</button>
          <button style={F.navBtn} onClick={()=>nav('/audit')}>Audit</button>
        </div>
      </nav>
      <AILabel />
      <DemoWatermark />

      <div style={F.wrap}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <div><div style={F.h1}>Hàng đợi Batch — STATE_1</div><div style={F.sub}>Điểm cao ≥75, độ tin cậy ≥85% — sẵn sàng xét duyệt lô</div></div>
          <button style={{background:'none', border:'1px solid #1E1E1E', color:'#555', borderRadius:6, padding:'7px 14px', cursor:'pointer', fontSize:13, fontFamily:"'DM Sans',sans-serif"}}
            onClick={()=>nav('/apply')}>+ Hồ sơ mới</button>
        </div>

        {/* Success */}
        {success && (
          <div style={{background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:8,
            padding:'13px 18px', margin:'16px 0', fontSize:13, color:'#86EFAC', fontWeight:600}}>
            ✓ Đã xác nhận <strong>{success} hồ sơ</strong> — xử lý batch 3–5 phút vs {success*35} phút thủ công.{' '}
            <span style={{color:'#555', fontWeight:400}}>Audit log đã ghi nhận.</span>
          </div>
        )}

        {/* Stats */}
        <div style={F.stats}>
          <div style={F.stat}><div style={{...F.sNum, color:'#22C55E'}}>{items.length}</div><div style={F.sLbl}>Trong queue</div></div>
          <div style={F.stat}><div style={{...F.sNum, color:'#3B82F6'}}>{sel.size}/{MAX}</div><div style={F.sLbl}>Đã chọn</div></div>
          <div style={F.stat}><div style={{...F.sNum, color:'#F59E0B'}}>3–5 phút</div><div style={F.sLbl}>Thời gian xử lý</div></div>
          <div style={F.stat}><div style={{...F.sNum, color:'#444'}}>35 phút</div><div style={F.sLbl}>Nếu thủ công</div></div>
        </div>

        {items.length === 0 ? (
          <div style={{textAlign:'center', padding:'50px 0', color:'#444'}}>
            <div style={{fontSize:28, marginBottom:10}}>📭</div>
            <div style={{marginBottom:12}}>Không có hồ sơ STATE_1 — tạo mới hoặc nhấn "Reset demo data" trong trang Apply</div>
            <button style={{background:'#3B82F6', border:'none', color:'#fff', padding:'9px 18px', borderRadius:6, cursor:'pointer', fontWeight:700, fontFamily:"'DM Sans',sans-serif"}}
              onClick={()=>nav('/apply')}>→ Tạo hồ sơ mới</button>
          </div>
        ) : (
          <div style={{background:'#0D0D0D', border:'1px solid #1A1A1A', borderRadius:10, overflow:'hidden'}}>
            <table style={F.tbl}>
              <thead>
                <tr>
                  <th style={F.th}></th>
                  <th style={F.th}>Họ tên</th>
                  <th style={F.th}>Điểm AI</th>
                  <th style={F.th}>Tin cậy</th>
                  <th style={F.th}>Yếu tố tích cực</th>
                  <th style={F.th}>Hạn mức đề xuất</th>
                  <th style={F.th}>Đơn vị</th>
                  <th style={F.th}></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item=>{
                  const d = item.decision;
                  const sc = d?.final_score??0;
                  const co = Math.round((d?.confidence??0)*100);
                  const isS = sel.has(item.id);
                  const isE = expanded===item.id;
                  const scoreColor = sc>=0.75?'#22C55E':sc>=0.35?'#F59E0B':'#EF4444';
                  return [
                    <tr key={item.id} style={{background:isS?'rgba(59,130,246,0.05)':'transparent', cursor:'pointer'}}
                      onClick={()=>setExp(e=>e===item.id?null:item.id)}>
                      <td style={{...F.td, width:40}} onClick={e=>{e.stopPropagation();toggleSel(item.id);}}>
                        <input type="checkbox" checked={isS}
                          onChange={()=>toggleSel(item.id)}
                          disabled={!isS && sel.size>=MAX}
                          style={{accentColor:'#3B82F6', width:14, height:14, cursor:'pointer'}} />
                      </td>
                      <td style={F.td}>
                        <div style={{fontWeight:600,color:'#E8E8E8'}}>{item.full_name}</div>
                        <div style={{fontSize:11,color:'#444',fontFamily:"'JetBrains Mono',monospace"}}>{item.cccd}</div>
                      </td>
                      <td style={{...F.td, fontFamily:"'JetBrains Mono',monospace"}}>
                        <span style={{color:scoreColor,fontSize:15,fontWeight:700}}>{Math.round(sc*100)}</span>
                        <span style={{color:'#333',fontSize:11}}>/100</span>
                      </td>
                      <td style={F.td}>
                        <span style={{fontSize:13,color:co>=85?'#22C55E':'#F59E0B',fontFamily:"'JetBrains Mono',monospace"}}>{co}%</span>
                        <div style={F.bar}><div style={{height:'100%',width:`${co}%`,background:co>=85?'#22C55E':'#F59E0B',borderRadius:99}} /></div>
                      </td>
                      <td style={{...F.td,fontSize:12,color:'#86EFAC',maxWidth:180}}>
                        <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block'}}>
                          {(d?.positive_factors??[])[0]?.label??'—'}
                        </span>
                      </td>
                      <td style={{...F.td,fontFamily:"'JetBrains Mono',monospace",color:'#E8E8E8'}}>
                        {d?.suggested_limit>0?`${(d.suggested_limit/1e6).toFixed(0)}M`:'—'}
                      </td>
                      <td style={{...F.td,fontSize:12,color:'#444'}}>{item.employer_name??'—'}</td>
                      <td style={{...F.td,fontSize:11,color:'#3B82F6',textAlign:'right'}}>{isE?'▲':'▼'}</td>
                    </tr>,
                    isE && (
                      <tr key={`${item.id}-exp`} style={{background:'#0A0A0A'}}>
                        <td colSpan={8} style={{padding:'14px 18px 14px 50px'}}>
                          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                            <div>
                              <div style={{fontSize:11,color:'#444',marginBottom:6}}>Thông tin hồ sơ</div>
                              <div style={{fontSize:13,color:'#888'}}>Thu nhập: <strong style={{color:'#E8E8E8'}}>{((item.monthly_income??0)/1e6).toFixed(0)}M/tháng</strong></div>
                              <div style={{fontSize:13,color:'#888'}}>Thâm niên: <strong style={{color:'#E8E8E8'}}>{item.employment_months??0} tháng</strong></div>
                              <div style={{fontSize:13,color:'#888'}}>CIC: <strong style={{color:'#E8E8E8'}}>{item.cic_score??0}</strong></div>
                            </div>
                            <div>
                              <div style={{fontSize:11,color:'#444',marginBottom:6}}>Yếu tố tích cực</div>
                              {(d?.positive_factors??[]).map((f,i)=><div key={i} style={{fontSize:12,color:'#86EFAC',marginBottom:2}}>✓ {f.label}</div>)}
                            </div>
                          </div>
                          <button style={{marginTop:10, background:'#3B82F6', border:'none', color:'#fff',
                            padding:'6px 13px', borderRadius:5, cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif"}}
                            onClick={()=>nav(`/review/${item.id}`)}>Xem đầy đủ →</button>
                        </td>
                      </tr>
                    )
                  ];
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm bar */}
      <div style={F.confirmBar}>
        <span style={{fontSize:13,color:'#555'}}>
          Đã chọn <strong style={{color:'#E8E8E8'}}>{sel.size}</strong>/{MAX} hồ sơ
          {sel.size>0 && <span> — tiết kiệm ~{sel.size*30}–{sel.size*35} phút thủ công</span>}
        </span>
        <button onClick={confirm} disabled={!sel.size}
          style={{background:sel.size?'#22C55E':'#1A1A1A', border:'none',
            color:sel.size?'#fff':'#555', padding:'9px 22px', borderRadius:6,
            cursor:sel.size?'pointer':'not-allowed', fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif"}}>
          ✓ Xác nhận {sel.size>0?`${sel.size} hồ sơ`:'batch'}
        </button>
        <button style={{background:'none',border:'none',color:'#444',cursor:'pointer',fontSize:13,fontFamily:"'DM Sans',sans-serif"}}
          onClick={()=>nav('/audit')}>Xem Audit →</button>
      </div>
    </div>
  );
}
