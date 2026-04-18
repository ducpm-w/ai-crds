import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AILabel from '../components/AILabel.jsx';
import DemoWatermark from '../components/DemoWatermark.jsx';
import { scoreApplication } from '../lib/scoring.js';
import { saveApplication, saveDecision } from '../lib/db.js';
import { SCENARIO_A, SCENARIO_B, SCENARIO_C, seedDemoData } from '../data/seedData.js';

const PROVINCES = ['Hà Nội','TP. Hồ Chí Minh','Đà Nẵng','Hải Phòng','Cần Thơ','Bình Dương','Đồng Nai','Khánh Hoà','Nghệ An','Thanh Hoá'];
const EMP_TYPES = [{v:'SOE',l:'Doanh nghiệp nhà nước'},{v:'FDI',l:'Công ty FDI'},{v:'SME',l:'Tư nhân / SME'},{v:'GOV',l:'Cơ quan nhà nước'},{v:'OTHER',l:'Khác'}];

const DEF = {
  full_name:'', cccd:'', dob:'', gender:'Nam', province:'Hà Nội',
  monthly_income:'', employer_name:'', employer_type:'SOE', employment_months:'',
  cic_score:'', cic_total_debt:'', cic_max_dpd_12m:'0', cic_inquiries_6m:'0', cic_debt_group:'1',
  ekyk_pass:true, face_match:'0.95', app_velocity_24h:'1',
  employer_unverifiable:false, is_existing_customer:false, opt_out_ai:false,
};

const toForm = s => ({ ...DEF, ...Object.fromEntries(Object.entries(s).map(([k,v])=>[k,String(v)])),
  ekyk_pass:s.ekyk_pass??true, employer_unverifiable:s.employer_unverifiable??false,
  is_existing_customer:s.is_existing_customer??false, opt_out_ai:s.opt_out_ai??false });

const F = {
  page:{ minHeight:'100vh', background:'#0A0A0A', color:'#E8E8E8', fontFamily:"'DM Sans',sans-serif" },
  nav:{ background:'#111', borderBottom:'1px solid #1E1E1E', padding:'0 28px', height:52,
    display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 },
  brand:{ color:'#E8001D', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Sora',sans-serif", background:'none', border:'none' },
  navBtn:{ background:'none', border:'none', color:'#555', fontSize:13, cursor:'pointer', padding:'6px 10px', fontFamily:"'DM Sans',sans-serif" },
  wrap:{ maxWidth:760, margin:'0 auto', padding:'28px 20px 60px' },
  h1:{ fontSize:22, fontWeight:800, color:'#E8E8E8', fontFamily:"'Sora',sans-serif", marginBottom:3 },
  sub:{ fontSize:13, color:'#555', marginBottom:16 },
  scRow:{ display:'flex', gap:7, flexWrap:'wrap', marginTop:12, alignItems:'center' },
  card:{ background:'#111', border:'1px solid #1E1E1E', borderRadius:10, padding:'22px 24px', marginBottom:14 },
  sec:{ fontSize:10, fontWeight:700, color:'#E8001D', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:14, fontFamily:"'Sora',sans-serif" },
  g2:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 18px' },
  g3:{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px 18px' },
  lbl:{ display:'block', fontSize:11, fontWeight:600, color:'#555', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' },
  inp:{ width:'100%', background:'#1A1A1A', border:'1px solid #252525', borderRadius:6, color:'#E8E8E8',
    fontSize:13, padding:'9px 11px', outline:'none', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' },
  chk:{ display:'flex', alignItems:'center', gap:7, marginRight:20 },
  chkLabel:{ fontSize:13, color:'#888', cursor:'pointer' },
  submit:{ width:'100%', background:'#3B82F6', border:'none', color:'#fff', padding:'13px',
    borderRadius:7, cursor:'pointer', fontSize:14, fontWeight:700, fontFamily:"'DM Sans',sans-serif", marginTop:18 },
  note:{ fontSize:11, color:'#333', textAlign:'center', marginTop:8 },
};

function Field({ label, children }) {
  return <div><label style={F.lbl}>{label}</label>{children}</div>;
}

export default function ApplyPage() {
  const nav = useNavigate();
  const [form, setForm] = useState(DEF);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  async function submit(e) {
    e.preventDefault(); setLoading(true);
    const data = {
      full_name:form.full_name||'SYN-Khách hàng', cccd:form.cccd, dob:form.dob,
      gender:form.gender, province:form.province,
      monthly_income:+form.monthly_income||0, employer_name:form.employer_name,
      employer_type:form.employer_type, employment_months:+form.employment_months||0,
      cic_score:+form.cic_score||0, cic_total_debt:+form.cic_total_debt||0,
      cic_max_dpd_12m:+form.cic_max_dpd_12m||0, cic_inquiries_6m:+form.cic_inquiries_6m||0,
      cic_debt_group:+form.cic_debt_group||1,
      ekyk_pass:form.ekyk_pass, face_match:+form.face_match||0.95,
      app_velocity_24h:+form.app_velocity_24h||1,
      employer_unverifiable:form.employer_unverifiable,
      is_existing_customer:form.is_existing_customer, opt_out_ai:form.opt_out_ai,
    };
    const app    = saveApplication(data);
    const scored = scoreApplication(data);
    saveDecision({ ...scored, application_id:app.id });
    setLoading(false);
    nav(`/score/${app.id}`);
  }

  function reset() {
    seedDemoData();
    setMsg('✓ Đã reset — 12 hồ sơ demo sẵn sàng');
    setTimeout(()=>setMsg(''),2500);
  }

  const SC = [
    { label:'▶ A — STATE_1', data:SCENARIO_A, color:'#22C55E', bg:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.25)' },
    { label:'▶ B — STATE_2', data:SCENARIO_B, color:'#F59E0B', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' },
    { label:'▶ C — FRAUD',   data:SCENARIO_C, color:'#EF4444', bg:'rgba(239,68,68,0.08)',  border:'rgba(239,68,68,0.25)' },
  ];

  return (
    <div style={F.page}>
      <nav style={F.nav}>
        <button style={F.brand} onClick={()=>nav('/')}>AI-CRDS</button>
        <div>
          <button style={F.navBtn} onClick={()=>nav('/review/batch')}>Batch Queue</button>
          <button style={F.navBtn} onClick={()=>nav('/audit')}>Audit Log</button>
        </div>
      </nav>
      <AILabel />
      <DemoWatermark />

      <div style={F.wrap}>
        <div style={F.h1}>Nhập hồ sơ tín dụng thẻ</div>
        <div style={F.sub}>AI chấm điểm & phân tuyến trong {'<'}30 giây — dữ liệu 100% synthetic</div>

        <div style={F.scRow}>
          <span style={{fontSize:12,color:'#444'}}>Điền nhanh:</span>
          {SC.map(sc=>(
            <button key={sc.label} onClick={()=>setForm(toForm(sc.data))}
              style={{ fontSize:12, fontWeight:700, padding:'5px 12px', borderRadius:5, cursor:'pointer',
                color:sc.color, background:sc.bg, border:`1px solid ${sc.border}`, fontFamily:"'DM Sans',sans-serif" }}>
              {sc.label}
            </button>
          ))}
          <button onClick={reset}
            style={{fontSize:12, fontWeight:600, padding:'5px 12px', borderRadius:5, cursor:'pointer',
              background:'none', border:'1px solid #2A2A2A', color:'#555', fontFamily:"'DM Sans',sans-serif", marginLeft:'auto'}}>
            {msg||'↺ Reset demo data'}
          </button>
        </div>

        <form onSubmit={submit} style={{marginTop:22}}>
          <div style={F.card}>
            <div style={F.sec}>Thông tin cá nhân</div>
            <div style={F.g2}>
              <Field label="Họ và tên *"><input style={F.inp} value={form.full_name} onChange={e=>set('full_name',e.target.value)} placeholder="SYN-Nguyễn Văn An" required /></Field>
              <Field label="Số CCCD *"><input style={F.inp} value={form.cccd} onChange={e=>set('cccd',e.target.value)} placeholder="SYN-079xxxxxx" required /></Field>
              <Field label="Ngày sinh"><input style={F.inp} type="date" value={form.dob} onChange={e=>set('dob',e.target.value)} /></Field>
              <Field label="Giới tính">
                <select style={F.inp} value={form.gender} onChange={e=>set('gender',e.target.value)}>
                  <option>Nam</option><option>Nữ</option><option>Khác</option>
                </select>
              </Field>
              <Field label="Tỉnh / Thành phố">
                <select style={F.inp} value={form.province} onChange={e=>set('province',e.target.value)}>
                  {PROVINCES.map(p=><option key={p}>{p}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div style={F.card}>
            <div style={F.sec}>Tài chính & việc làm</div>
            <div style={F.g2}>
              <Field label="Thu nhập / tháng (VND) *"><input style={F.inp} type="number" value={form.monthly_income} onChange={e=>set('monthly_income',e.target.value)} placeholder="25000000" required /></Field>
              <Field label="Thâm niên (tháng) *"><input style={F.inp} type="number" value={form.employment_months} onChange={e=>set('employment_months',e.target.value)} placeholder="36" required /></Field>
              <Field label="Tên đơn vị"><input style={F.inp} value={form.employer_name} onChange={e=>set('employer_name',e.target.value)} placeholder="FPT Software" /></Field>
              <Field label="Loại hình">
                <select style={F.inp} value={form.employer_type} onChange={e=>set('employer_type',e.target.value)}>
                  {EMP_TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}
                </select>
              </Field>
            </div>
            <div style={{display:'flex', flexWrap:'wrap', marginTop:12}}>
              <label style={F.chk}><input type="checkbox" checked={form.is_existing_customer} onChange={e=>set('is_existing_customer',e.target.checked)} /><span style={F.chkLabel}>Khách hàng hiện tại</span></label>
              <label style={F.chk}><input type="checkbox" checked={form.employer_unverifiable} onChange={e=>set('employer_unverifiable',e.target.checked)} /><span style={{...F.chkLabel,color:'#EF4444'}}>Đơn vị không xác minh được</span></label>
            </div>
          </div>

          <div style={F.card}>
            <div style={F.sec}>Dữ liệu CIC (Mock)</div>
            <div style={F.g3}>
              <Field label="CIC Score (0-850)"><input style={F.inp} type="number" value={form.cic_score} onChange={e=>set('cic_score',e.target.value)} placeholder="740" min="0" max="850" /></Field>
              <Field label="Tổng dư nợ (VND)"><input style={F.inp} type="number" value={form.cic_total_debt} onChange={e=>set('cic_total_debt',e.target.value)} placeholder="0" /></Field>
              <Field label="DPD tối đa 12T"><input style={F.inp} type="number" value={form.cic_max_dpd_12m} onChange={e=>set('cic_max_dpd_12m',e.target.value)} placeholder="0" /></Field>
              <Field label="Tra cứu CIC/6T"><input style={F.inp} type="number" value={form.cic_inquiries_6m} onChange={e=>set('cic_inquiries_6m',e.target.value)} placeholder="0" /></Field>
              <Field label="Nhóm nợ (1-5)">
                <select style={F.inp} value={form.cic_debt_group} onChange={e=>set('cic_debt_group',e.target.value)}>
                  {[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div style={F.card}>
            <div style={F.sec}>eKYC Mock & Tín hiệu gian lận</div>
            <div style={F.g2}>
              <Field label="Face Match (0.00–1.00)"><input style={F.inp} type="number" step="0.01" min="0" max="1" value={form.face_match} onChange={e=>set('face_match',e.target.value)} /></Field>
              <Field label="App Velocity (/24h)"><input style={F.inp} type="number" min="1" value={form.app_velocity_24h} onChange={e=>set('app_velocity_24h',e.target.value)} /></Field>
            </div>
            <div style={{display:'flex', flexWrap:'wrap', marginTop:12}}>
              <label style={F.chk}><input type="checkbox" checked={form.ekyk_pass} onChange={e=>set('ekyk_pass',e.target.checked)} /><span style={F.chkLabel}>eKYC Pass</span></label>
              <label style={F.chk}><input type="checkbox" checked={form.opt_out_ai} onChange={e=>set('opt_out_ai',e.target.checked)} /><span style={F.chkLabel}>Từ chối AI (→ STATE_5 Manual)</span></label>
            </div>
          </div>

          <button style={F.submit} type="submit" disabled={loading}
            onMouseEnter={e=>e.currentTarget.style.background='#2563EB'}
            onMouseLeave={e=>e.currentTarget.style.background='#3B82F6'}>
            {loading ? 'Đang chấm điểm AI...' : '→ Chấm điểm & Phân tuyến hồ sơ'}
          </button>
          <div style={F.note}>Dữ liệu 100% synthetic — không có thông tin khách hàng thực</div>
        </form>
      </div>
    </div>
  );
}
