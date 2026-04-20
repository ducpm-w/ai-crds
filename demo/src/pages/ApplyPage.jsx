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

function Field({ label, children }) {
  return <div className="form-field"><label className="form-lbl">{label}</label>{children}</div>;
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
    setMsg('✓ Đã reset — 12 hồ sơ');
    setTimeout(()=>setMsg(''),2500);
  }

  const SC = [
    { label:'▶ A — STATE_1', data:SCENARIO_A, color:'#22C55E', bg:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.25)' },
    { label:'▶ B — STATE_2', data:SCENARIO_B, color:'#F59E0B', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' },
    { label:'▶ C — FRAUD',   data:SCENARIO_C, color:'#E8001D', bg:'rgba(232,0,29,0.08)',  border:'rgba(232,0,29,0.25)' },
  ];

  return (
    <div className="ap-page">
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
          <button className="nav-link" onClick={()=>nav('/review/batch')}>Batch Queue</button>
          <button className="nav-link" onClick={()=>nav('/audit')}>Audit Log</button>
        </div>
      </nav>

      <AILabel />
      <DemoWatermark />

      <div className="ap-wrap">
        <div className="ap-header">
          <div className="ap-eyebrow">
            <span className="eb-code">R/002</span>
            <span className="eb-sep"/>
            <span className="eb-text">E-KYC ONBOARDING</span>
          </div>
          <h1 className="ap-h1">Hồ sơ <i>tín dụng thẻ bán lẻ</i></h1>
          <p className="ap-sub">AI chấm điểm & phân tuyến trong {'<'}30 giây — dữ liệu 100% synthetic.</p>
        </div>

        <div className="ap-scRow">
          <span className="ap-scLbl">Điền nhanh:</span>
          {SC.map(sc=>(
            <button key={sc.label} onClick={()=>setForm(toForm(sc.data))}
              style={{ color:sc.color, background:sc.bg, border:`1px solid ${sc.border}` }}
              className="ap-scBtn">
              {sc.label}
            </button>
          ))}
          <button onClick={reset} className="btn-ghost btn-sm ap-reset">
            {msg||'↺ Reset demo data'}
          </button>
        </div>

        <form onSubmit={submit} className="ap-form">
          <div className="ap-card">
            <div className="ap-corner ct-tl"/><div className="ap-corner ct-tr"/>
            <div className="ap-corner ct-bl"/><div className="ap-corner ct-br"/>
            <div className="ap-sec">Thông tin cá nhân</div>
            <div className="ap-g2">
              <Field label="Họ và tên *"><input className="ap-inp" value={form.full_name} onChange={e=>set('full_name',e.target.value)} placeholder="SYN-Nguyễn Văn An" required /></Field>
              <Field label="Số CCCD *"><input className="ap-inp" value={form.cccd} onChange={e=>set('cccd',e.target.value)} placeholder="SYN-079xxxxxx" required /></Field>
              <Field label="Ngày sinh"><input className="ap-inp" type="date" value={form.dob} onChange={e=>set('dob',e.target.value)} /></Field>
              <Field label="Giới tính">
                <select className="ap-inp" value={form.gender} onChange={e=>set('gender',e.target.value)}>
                  <option>Nam</option><option>Nữ</option><option>Khác</option>
                </select>
              </Field>
              <Field label="Tỉnh / Thành phố">
                <select className="ap-inp" value={form.province} onChange={e=>set('province',e.target.value)}>
                  {PROVINCES.map(p=><option key={p}>{p}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div className="ap-card">
            <div className="ap-sec">Tài chính & việc làm</div>
            <div className="ap-g2">
              <Field label="Thu nhập / tháng (VND) *"><input className="ap-inp" type="number" value={form.monthly_income} onChange={e=>set('monthly_income',e.target.value)} placeholder="25000000" required /></Field>
              <Field label="Thâm niên (tháng) *"><input className="ap-inp" type="number" value={form.employment_months} onChange={e=>set('employment_months',e.target.value)} placeholder="36" required /></Field>
              <Field label="Tên đơn vị"><input className="ap-inp" value={form.employer_name} onChange={e=>set('employer_name',e.target.value)} placeholder="FPT Software" /></Field>
              <Field label="Loại hình">
                <select className="ap-inp" value={form.employer_type} onChange={e=>set('employer_type',e.target.value)}>
                  {EMP_TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}
                </select>
              </Field>
            </div>
            <div className="ap-chkRow">
              <label className="ap-chk"><input type="checkbox" checked={form.is_existing_customer} onChange={e=>set('is_existing_customer',e.target.checked)} /><span>Khách hàng hiện tại</span></label>
              <label className="ap-chk ap-chk-warn"><input type="checkbox" checked={form.employer_unverifiable} onChange={e=>set('employer_unverifiable',e.target.checked)} /><span>Đơn vị không xác minh được</span></label>
            </div>
          </div>

          <div className="ap-card">
            <div className="ap-sec">Dữ liệu CIC (Mock)</div>
            <div className="ap-g3">
              <Field label="CIC Score (0-850)"><input className="ap-inp" type="number" value={form.cic_score} onChange={e=>set('cic_score',e.target.value)} placeholder="740" min="0" max="850" /></Field>
              <Field label="Tổng dư nợ (VND)"><input className="ap-inp" type="number" value={form.cic_total_debt} onChange={e=>set('cic_total_debt',e.target.value)} placeholder="0" /></Field>
              <Field label="DPD tối đa 12T"><input className="ap-inp" type="number" value={form.cic_max_dpd_12m} onChange={e=>set('cic_max_dpd_12m',e.target.value)} placeholder="0" /></Field>
              <Field label="Tra cứu CIC/6T"><input className="ap-inp" type="number" value={form.cic_inquiries_6m} onChange={e=>set('cic_inquiries_6m',e.target.value)} placeholder="0" /></Field>
              <Field label="Nhóm nợ (1-5)">
                <select className="ap-inp" value={form.cic_debt_group} onChange={e=>set('cic_debt_group',e.target.value)}>
                  {[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div className="ap-card">
            <div className="ap-sec">eKYC Mock & Tín hiệu gian lận</div>
            <div className="ap-g2">
              <Field label="Face Match (0.00–1.00)"><input className="ap-inp" type="number" step="0.01" min="0" max="1" value={form.face_match} onChange={e=>set('face_match',e.target.value)} /></Field>
              <Field label="App Velocity (/24h)"><input className="ap-inp" type="number" min="1" value={form.app_velocity_24h} onChange={e=>set('app_velocity_24h',e.target.value)} /></Field>
            </div>
            <div className="ap-chkRow">
              <label className="ap-chk"><input type="checkbox" checked={form.ekyk_pass} onChange={e=>set('ekyk_pass',e.target.checked)} /><span>eKYC Pass</span></label>
              <label className="ap-chk ap-chk-warn"><input type="checkbox" checked={form.opt_out_ai} onChange={e=>set('opt_out_ai',e.target.checked)} /><span>Từ chối AI (→ STATE_5 Manual)</span></label>
            </div>
          </div>

          <button className="btn-primary btn-lg ap-submit" type="submit" disabled={loading}>
            {loading ? 'Đang chấm điểm AI...' : 'Chấm điểm & Phân tuyến hồ sơ'}
            {!loading && <span className="btn-arrow" style={{marginLeft: 12}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/></svg>
            </span>}
          </button>
          
          <div className="ap-note">Dữ liệu 100% synthetic — theo mẫu chuẩn của Bank X.</div>
        </form>
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

.ap-page {
  min-height: 100vh;
  background: var(--canvas);
  color: var(--ink);
  font-family: var(--f-sans);
  font-feature-settings: "ss01", "cv11";
  -webkit-font-smoothing: antialiased;
  position: relative;
  z-index: 2;
}

.ap-page::before {
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
.ap-wrap { max-width: 840px; margin: 0 auto; padding: 60px 32px 100px; }

.ap-header { margin-bottom: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; }
.ap-eyebrow { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 24px; }
.eb-code { font-family: var(--f-mono); font-size: 10.5px; color: var(--signal); letter-spacing: 0.14em; font-weight: 500; }
.eb-sep { width: 28px; height: 1px; background: var(--ink); opacity: 0.3; }
.eb-text { font-family: var(--f-mono); font-size: 10.5px; color: var(--ink); letter-spacing: 0.18em; font-weight: 500; }
.ap-h1 { font-family: var(--f-sans); font-size: 48px; font-weight: 800; color: var(--ink); letter-spacing: -0.04em; margin-bottom: 20px; span { color: var(--signal); } }
.ap-h1 i { font-family: var(--f-serif); font-weight: 400; color: var(--signal); }
.ap-sub { font-size: 16px; color: var(--ink-2); line-height: 1.6; max-width: 480px; }

.ap-scRow { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; padding: 16px 20px; background: #fff; border: 1px solid var(--line); box-shadow: 0 4px 14px rgba(0,0,0,0.01); }
.ap-scLbl { font-family: var(--f-mono); font-size: 10.5px; font-weight: 500; color: var(--mute); letter-spacing: 0.14em; margin-right: 8px; }
.ap-scBtn { font-family: var(--f-mono); font-size: 10.5px; font-weight: 600; padding: 6px 12px; cursor: pointer; transition: transform .15s; }
.ap-scBtn:hover { transform: translateY(-1px); }
.ap-reset { margin-left: auto; font-family: var(--f-mono); font-size: 10.5px; letter-spacing: 0.05em; color: var(--mute); }

.ap-form { display: flex; flex-direction: column; gap: 24px; }
.ap-card { background: #fff; border: 1px solid var(--line); padding: 32px; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.015); }

.ap-corner { position: absolute; width: 6px; height: 6px; border: 1px solid var(--ink); opacity: 0.2; }
.ap-corner.ct-tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.ap-corner.ct-tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
.ap-corner.ct-bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
.ap-corner.ct-br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

.ap-sec { font-family: var(--f-mono); font-size: 11.5px; font-weight: 600; color: var(--signal); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px dashed var(--line); }

.ap-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.ap-g3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

.form-field { margin-bottom: 4px; }
.form-lbl { display: block; font-family: var(--f-mono); font-size: 10.5px; font-weight: 500; color: var(--mute); margin-bottom: 8px; letter-spacing: 0.04em; }

.ap-inp {
  width: 100%; background: var(--canvas); border: 1px solid var(--line); color: var(--ink);
  font-family: var(--f-sans); font-size: 14px; padding: 12px 14px; outline: none; transition: all .2s; border-radius: 0;
}
.ap-inp:focus { border-color: var(--signal); box-shadow: 0 0 0 2px rgba(232,0,29,0.1); background: #fff; }

.ap-chkRow { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 20px; }
.ap-chk { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ink-2); cursor: pointer; }
.ap-chk input[type="checkbox"] { accent-color: var(--ink); width: 16px; height: 16px; }
.ap-chk-warn { color: var(--signal); }
.ap-chk-warn input[type="checkbox"] { accent-color: var(--signal); }

.ap-submit { width: 100%; justify-content: center; margin-top: 12px; }
.ap-note { text-align: center; font-family: var(--f-mono); font-size: 10.5px; color: var(--mute); margin-top: 16px; letter-spacing: 0.05em; }

/* Buttons global */
.btn-primary {
  background: var(--ink); color: #fff; border: 1px solid var(--ink);
  cursor: pointer; font-weight: 500; letter-spacing: -0.01em;
  display: inline-flex; align-items: center; transition: all .28s cubic-bezier(.2,.7,.2,1); position: relative; overflow: hidden;
}
.btn-primary:hover:not(:disabled) { background: var(--signal); border-color: var(--signal); transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); cursor: pointer; font-weight: 500; transition: all .2s; }
.btn-ghost:hover { border-color: var(--ink); }
.btn-sm { font-size: 12.5px; padding: 8px 14px; }
.btn-lg { font-size: 15px; padding: 16px 24px; }
.btn-primary .btn-arrow { display: flex; align-items: center; transition: transform .3s; }
.btn-primary:hover .btn-arrow { transform: translateX(4px); }
`;
