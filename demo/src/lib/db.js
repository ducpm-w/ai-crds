// ─── localStorage data layer (no backend needed for demo) ────────────────────

const K = {
  apps: 'aicrd_apps',
  decisions: 'aicrd_decisions',
  audit: 'aicrd_audit',
};

const load = k => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
const save = (k, d) => localStorage.setItem(k, JSON.stringify(d));
const uid  = () => (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2,9)}`);

// ── Applications ──────────────────────────────────────────────────────────────
export function saveApplication(app) {
  const list = load(K.apps);
  const rec  = { ...app, id: uid(), created_at: new Date().toISOString() };
  list.push(rec);
  save(K.apps, list);
  return rec;
}

export function getApplication(id) {
  return load(K.apps).find(a => a.id === id) ?? null;
}

// ── Decisions ─────────────────────────────────────────────────────────────────
export function saveDecision(d) {
  const list = load(K.decisions);
  const idx  = list.findIndex(x => x.application_id === d.application_id);
  const rec  = { ...d, id: d.id ?? uid(), created_at: d.created_at ?? new Date().toISOString() };
  if (idx >= 0) list[idx] = rec; else list.push(rec);
  save(K.decisions, list);
  return rec;
}

export function getDecision(applicationId) {
  return load(K.decisions).find(d => d.application_id === applicationId) ?? null;
}

export function updateDecision(id, updates) {
  const list = load(K.decisions);
  const idx  = list.findIndex(d => d.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
  save(K.decisions, list);
  return list[idx];
}

export function listByState(state) {
  const apps = load(K.apps);
  const decs = load(K.decisions);
  return apps
    .map(a => ({ ...a, decision: decs.find(d => d.application_id === a.id) }))
    .filter(a => a.decision?.state_routed === state && a.decision?.status === 'PENDING')
    .sort((a, b) => (b.decision?.final_score ?? 0) - (a.decision?.final_score ?? 0));
}

// ── Audit Log ─────────────────────────────────────────────────────────────────
export function writeAudit(entry) {
  const list = load(K.audit);
  const rec  = {
    id: uid(),
    decision_id:              entry.decision_id,
    application_id:           entry.application_id,
    app_full_name:            entry.app_full_name,
    app_cccd:                 entry.app_cccd,
    ai_risk_score:            entry.ai_risk_score,
    ai_fraud_score:           entry.ai_fraud_score,
    ai_confidence:            entry.ai_confidence,
    ai_recommendation:        entry.ai_recommendation,
    state_routed:             entry.state_routed,
    ai_risk_factors:          entry.ai_risk_factors    ?? [],
    ai_positive_factors:      entry.ai_positive_factors ?? [],
    ai_fraud_signals:         entry.ai_fraud_signals   ?? [],
    human_decision:           entry.human_decision,
    co_id:                    entry.co_id ?? 'CO-001',
    approved_limit:           entry.approved_limit ?? null,
    review_seconds:           entry.review_seconds ?? null,
    override_flag:            entry.override_flag ?? false,
    override_reason_category: entry.override_reason_category ?? null,
    override_reason_text:     entry.override_reason_text ?? null,
    override_supervisor_required: entry.override_supervisor_required ?? false,
    ai_label_displayed:       true,
    opt_out_ai:               entry.opt_out_ai ?? false,
    model_version:            entry.model_version ?? 'v0.1.0-synthetic',
    threshold_version:        entry.threshold_version ?? 'v1.0',
    record_hash:              btoa(`${entry.application_id}|${Date.now()}`).slice(0, 16),
    decided_at:               entry.decided_at ?? new Date().toISOString(),
    created_at:               new Date().toISOString(),
  };
  list.push(rec);
  save(K.audit, list);
  return rec;
}

export function listAudit({ page = 1, limit = 20, filters = {} } = {}) {
  let list = load(K.audit);
  if (filters.state)        list = list.filter(e => e.state_routed === filters.state);
  if (filters.decision)     list = list.filter(e => e.human_decision === filters.decision);
  if (filters.overrideOnly) list = list.filter(e => e.override_flag === true);
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return { data: list.slice((page-1)*limit, page*limit), total: list.length };
}

export function exportCSV() {
  const list = load(K.audit);
  if (!list.length) return '';
  const headers = Object.keys(list[0]).join(',');
  const rows = list.map(e =>
    Object.values(e).map(v => String(typeof v === 'object' ? JSON.stringify(v) : v ?? '').replace(/,/g, ';')).join(',')
  );
  return [headers, ...rows].join('\n');
}

export function clearAll() {
  Object.values(K).forEach(k => localStorage.removeItem(k));
}
