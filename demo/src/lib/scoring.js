// ─── AI-CRDS Scoring Engine v0.1.0-synthetic ─────────────────────────────────
// Rule-based per w12-04-mvp-build-note.md  |  0=high risk, 1=low risk

export function calculateRiskScore(app) {
  let score = 0.50;
  const factors = [], positives = [];

  // CIC Score
  const cic = +app.cic_score || 0;
  if (cic >= 720)       { score += 0.20; positives.push({ key:'cic', label:`CIC ${cic} — Lịch sử tín dụng tốt`, impact:+0.20 }); }
  else if (cic >= 650)  { score += 0.10; positives.push({ key:'cic', label:`CIC ${cic} — Lịch sử tín dụng ổn định`, impact:+0.10 }); }
  else if (cic > 0 && cic < 550) { score -= 0.20; factors.push({ key:'cic', label:`CIC ${cic} — Lịch sử tín dụng yếu`, impact:-0.20 }); }
  else if (cic === 0)   { score -= 0.10; factors.push({ key:'cic', label:'Không có hồ sơ CIC (thin file)', impact:-0.10 }); }

  // DPD
  const dpd = +app.cic_max_dpd_12m || 0;
  if (dpd === 0)        { score += 0.10; positives.push({ key:'dpd', label:'Không có nợ quá hạn 12 tháng qua', impact:+0.10 }); }
  else if (dpd >= 90)   { score -= 0.30; factors.push({ key:'dpd', label:`Nợ quá hạn ${dpd} ngày — Rủi ro rất cao`, impact:-0.30 }); }
  else if (dpd >= 30)   { score -= 0.15; factors.push({ key:'dpd', label:`Nợ quá hạn ${dpd} ngày`, impact:-0.15 }); }

  // DTI
  const income = +app.monthly_income || 0;
  const totalDebt = +app.cic_total_debt || 0;
  const dti = income > 0 ? (totalDebt / (income * 12)) * 100 : 0;
  if (dti > 0 && dti < 30)  { score += 0.10; positives.push({ key:'dti', label:`DTI ${dti.toFixed(0)}% — Tỷ lệ nợ thấp`, impact:+0.10 }); }
  else if (dti > 50)         { score -= 0.15; factors.push({ key:'dti', label:`DTI ${dti.toFixed(0)}% — Tỷ lệ nợ cao`, impact:-0.15 }); }
  else if (dti > 40)         { score -= 0.05; factors.push({ key:'dti', label:`DTI ${dti.toFixed(0)}% — Tỷ lệ nợ borderline`, impact:-0.05 }); }

  // Employment
  const months = +app.employment_months || 0;
  if (months >= 36)     { score += 0.08; positives.push({ key:'emp', label:`${months} tháng — Ổn định dài hạn`, impact:+0.08 }); }
  else if (months >= 12){ score += 0.03; positives.push({ key:'emp', label:`${months} tháng làm việc`, impact:+0.03 }); }
  else if (months < 6)  { score -= 0.10; factors.push({ key:'emp', label:`${months} tháng làm việc — Thâm niên ngắn`, impact:-0.10 }); }

  // Income
  const incM = income / 1e6;
  if (incM >= 25)       { score += 0.05; positives.push({ key:'income', label:`Thu nhập ${incM.toFixed(0)}M/tháng — Cao`, impact:+0.05 }); }
  else if (incM < 10)   { score -= 0.10; factors.push({ key:'income', label:`Thu nhập ${incM.toFixed(0)}M/tháng — Thấp`, impact:-0.10 }); }

  // Inquiries
  const inq = +app.cic_inquiries_6m || 0;
  if (inq >= 4)         { score -= 0.10; factors.push({ key:'inq', label:`${inq} tra cứu CIC/6T — Bất thường`, impact:-0.10 }); }
  else if (inq >= 2)    { score -= 0.03; factors.push({ key:'inq', label:`${inq} tra cứu CIC/6T — Nhiều`, impact:-0.03 }); }

  // Existing customer
  if (app.is_existing_customer) { score += 0.05; positives.push({ key:'existing', label:'Khách hàng hiện tại — Lịch sử quan hệ', impact:+0.05 }); }

  score = Math.min(1, Math.max(0, score));

  // Confidence
  let conf = 0.60;
  if (cic > 0)          conf += 0.12;
  if (app.ekyk_pass)    conf += 0.05;
  if (months >= 12)     conf += 0.05;
  if (income > 0)       conf += 0.05;
  conf = Math.min(0.95, conf);

  factors.sort((a,b) => Math.abs(b.impact) - Math.abs(a.impact));
  positives.sort((a,b) => Math.abs(b.impact) - Math.abs(a.impact));

  return {
    final_score: Math.round(score * 1000) / 1000,
    confidence: Math.round(conf * 100) / 100,
    risk_factors: factors.slice(0, 3),
    positive_factors: positives.slice(0, 3),
    dti: Math.round(dti * 10) / 10,
  };
}

export function calculateFraudScore(app) {
  let fs = 0;
  const signals = [];

  const face = app.face_match !== undefined ? +app.face_match : 1.0;
  if (face < 0.70)      { fs += 0.35; signals.push({ key:'face', label:`Face match ${(face*100).toFixed(0)}% — Dưới ngưỡng eKYC (70%)`, severity:'HIGH' }); }
  else if (face < 0.85) { fs += 0.15; signals.push({ key:'face', label:`Face match ${(face*100).toFixed(0)}% — Thấp hơn mức an toàn`, severity:'MEDIUM' }); }

  const vel = +app.app_velocity_24h || 1;
  if (vel >= 3) { fs += 0.25; signals.push({ key:'velocity', label:`${vel} đơn từ cùng thiết bị/24h — Velocity bất thường`, severity:'HIGH' }); }

  const incM = (+app.monthly_income || 0) / 1e6;
  const cic  = +app.cic_score || 0;
  if (incM > 20 && cic === 0) { fs += 0.15; signals.push({ key:'mismatch', label:`Thu nhập ${incM.toFixed(0)}M/tháng nhưng không có hồ sơ CIC`, severity:'MEDIUM' }); }

  if (app.employer_unverifiable) { fs += 0.15; signals.push({ key:'employer', label:'Đơn vị công tác không xác minh được trên ĐKKD', severity:'MEDIUM' }); }

  fs = Math.min(1, Math.round(fs * 100) / 100);
  const fraud_level = fs >= 0.70 ? 'HIGH' : fs >= 0.40 ? 'ELEVATED' : 'CLEAR';
  return { fraud_score: fs, fraud_level, signals };
}

export function routeToState(riskScore, fraudScore, confidence, optOutAI = false) {
  if (optOutAI)                                              return 'STATE_5';
  if (fraudScore >= 0.40)                                    return 'STATE_3';
  if (riskScore >= 0.75 && confidence >= 0.85)               return 'STATE_1';
  if (confidence < 0.60 || Math.abs(riskScore - 0.75) <= 0.02) return 'STATE_4';
  return 'STATE_2';
}

export function scoreApplication(app) {
  const risk  = calculateRiskScore(app);
  const fraud = calculateFraudScore(app);
  const state = routeToState(risk.final_score, fraud.fraud_score, risk.confidence, app.opt_out_ai);

  const incM = (+app.monthly_income || 0) / 1e6;
  let limitM = incM * 3;
  if (risk.final_score < 0.50) limitM = 0;
  else if (risk.final_score < 0.65) limitM *= 0.5;
  limitM = Math.min(limitM, 100);

  const recommendation =
    state === 'STATE_1' ? 'APPROVE' :
    state === 'STATE_3' ? 'FRAUD_REVIEW' :
    state === 'STATE_4' ? 'ESCALATE' : 'REVIEW';

  return {
    ...risk, ...fraud,
    state_routed: state,
    recommendation,
    suggested_limit: Math.round(limitM) * 1_000_000,
    model_version: 'v0.1.0-synthetic',
    threshold_version: 'v1.0',
    scored_at: new Date().toISOString(),
    status: 'PENDING',
  };
}
