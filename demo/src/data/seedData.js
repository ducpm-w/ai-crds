// Demo seed data — 3 kịch bản chính (A/B/C) + 9 batch records
// Values từ w12-01-demo-script.md

import { scoreApplication } from '../lib/scoring.js';
import { saveApplication, saveDecision, clearAll } from '../lib/db.js';

export const SCENARIO_A = {
  full_name:'SYN-Nguyễn Văn An', cccd:'SYN-079123456', dob:'1991-03-15', gender:'Nam', province:'Hà Nội',
  monthly_income:25_000_000, employer_name:'FPT Software', employer_type:'FDI', employment_months:36,
  cic_score:740, cic_total_debt:132_000_000, cic_max_dpd_12m:0, cic_inquiries_6m:0, cic_debt_group:1,
  ekyk_pass:true, face_match:0.96, app_velocity_24h:1, employer_unverifiable:false,
  is_existing_customer:false, opt_out_ai:false,
};

export const SCENARIO_B = {
  full_name:'SYN-Phạm Thị Bình', cccd:'SYN-024987654', dob:'1997-07-22', gender:'Nữ', province:'TP. Hồ Chí Minh',
  monthly_income:18_000_000, employer_name:'Công ty ABC', employer_type:'SME', employment_months:8,
  cic_score:650, cic_total_debt:91_296_000, cic_max_dpd_12m:0, cic_inquiries_6m:2, cic_debt_group:1,
  ekyk_pass:true, face_match:0.91, app_velocity_24h:1, employer_unverifiable:false,
  is_existing_customer:false, opt_out_ai:false,
};

export const SCENARIO_C = {
  full_name:'SYN-Trần Văn Cường', cccd:'SYN-036111222', dob:'1998-11-05', gender:'Nam', province:'Đà Nẵng',
  monthly_income:30_000_000, employer_name:'Tập đoàn XYZ', employer_type:'SME', employment_months:24,
  cic_score:0, cic_total_debt:0, cic_max_dpd_12m:0, cic_inquiries_6m:0, cic_debt_group:0,
  ekyk_pass:true, face_match:0.58, app_velocity_24h:3, employer_unverifiable:true,
  is_existing_customer:false, opt_out_ai:false,
};

const BATCH_EXTRAS = [
  { full_name:'SYN-Lê Minh Tuấn',   monthly_income:32e6, employment_months:60, cic_score:755, cic_total_debt:96e6,   employer_name:'Viettel',          employer_type:'SOE', face_match:0.94 },
  { full_name:'SYN-Ngô Thị Hương',  monthly_income:28e6, employment_months:48, cic_score:730, cic_total_debt:120e6,  employer_name:'Samsung Vietnam',  employer_type:'FDI', face_match:0.92 },
  { full_name:'SYN-Đặng Quốc Bảo',  monthly_income:40e6, employment_months:72, cic_score:780, cic_total_debt:240e6,  employer_name:'Vingroup',         employer_type:'SOE', face_match:0.97, is_existing_customer:true },
  { full_name:'SYN-Trần Thị Lan',   monthly_income:35e6, employment_months:40, cic_score:760, cic_total_debt:168e6,  employer_name:'Intel Vietnam',    employer_type:'FDI', face_match:0.95 },
  { full_name:'SYN-Hoàng Văn Dũng', monthly_income:22e6, employment_months:84, cic_score:720, cic_total_debt:79.2e6, employer_name:'EVN',              employer_type:'SOE', face_match:0.91 },
  { full_name:'SYN-Phạm Thị Thu',   monthly_income:27e6, employment_months:38, cic_score:748, cic_total_debt:97.2e6, employer_name:'Grab Vietnam',     employer_type:'FDI', face_match:0.93 },
  { full_name:'SYN-Vũ Đình Khoa',   monthly_income:30e6, employment_months:54, cic_score:771, cic_total_debt:108e6,  employer_name:'VNPT',             employer_type:'SOE', face_match:0.96, is_existing_customer:true },
  { full_name:'SYN-Lý Thanh Hà',    monthly_income:45e6, employment_months:96, cic_score:800, cic_total_debt:270e6,  employer_name:'Techcombank',      employer_type:'SOE', face_match:0.98 },
  { full_name:'SYN-Bùi Văn Minh',   monthly_income:26e6, employment_months:42, cic_score:735, cic_total_debt:93.6e6, employer_name:'Masan Group',      employer_type:'SOE', face_match:0.90 },
];

const DEFAULTS = {
  dob:'1990-01-01', gender:'Nam', province:'Hà Nội',
  cic_total_debt:0, cic_max_dpd_12m:0, cic_inquiries_6m:0, cic_debt_group:1,
  app_velocity_24h:1, employer_unverifiable:false, is_existing_customer:false, opt_out_ai:false,
  ekyk_pass:true,
};

export function seedDemoData() {
  clearAll();
  for (const raw of [SCENARIO_A, SCENARIO_B, SCENARIO_C, ...BATCH_EXTRAS]) {
    const data = { ...DEFAULTS, ...raw };
    const app  = saveApplication(data);
    const scored = scoreApplication(data);
    saveDecision({ ...scored, application_id: app.id });
  }
}
