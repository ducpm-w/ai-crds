# Integration Point Map — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Map từng integration point AI-CRDS cần với Bank X systems. Với mỗi integration: status, method, owner, dependency, risk, timeline.

**⚠️ Tất cả integration methods đánh dấu ❓ cần confirm với IT team Bank X.**

---

## 1. INTEGRATION OVERVIEW

```
                    ┌──────────────────────┐
                    │      AI-CRDS         │
                    │   Application Core   │
                    └──────────┬───────────┘
                               │
        ┌────────┬─────────┬───┼───┬──────────┬──────────┐
        │        │         │   │   │          │          │
        ▼        ▼         ▼   │   ▼          ▼          ▼
   ┌────────┐┌────────┐┌──────┴─┐┌────────┐┌────────┐┌────────┐
   │  INT-1 ││  INT-2 ││ INT-3  ││ INT-4  ││ INT-5  ││ INT-6  │
   │  CBS   ││  CIC   ││ eKYC   ││ SIMO   ││ Audit  ││ Notify │
   │        ││ Bureau ││Provider ││        ││ Trail  ││ System │
   └────────┘└────────┘└────────┘└────────┘└────────┘└────────┘
    Customer   Credit    Identity   Fraud     Immutable  Customer
    profile    history   verify     blacklist decision   comms
    + products + score   + biomet.  check     log
```

---

## 2. INTEGRATION DETAILS

### INT-1: Core Banking System (CBS)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Customer profile, existing products, transaction history, relationship data, account balances |
| **Data needed** | Demographics (name, DOB, CCCD, address, phone), existing products, account open date, transaction history (nếu existing customer), salary deposits, internal risk rating (nếu có). Full list: feature-availability-matrix.md Nhóm 1, 2, 4. |
| **Method** | ❓ **Cần confirm.** Options: (a) REST API via ESB/API Gateway — preferred. (b) Direct DB query — risky, affects CBS performance. (c) Batch export to DWH/data lake — stale data. (d) Combination: API for real-time fields + DWH for historical. |
| **Latency requirement** | ≤ 5 giây for customer profile lookup. ≤ 30 giây for transaction history aggregation. |
| **Data format** | ❓ JSON/XML/proprietary? Encoding: UTF-8 (Vietnamese characters). |
| **Auth** | ❓ API key / OAuth / Certificate-based? |
| **Direction** | **Read** (scoring) + **Write** (decision result, limit set, card issuance trigger) |
| **Volume** | ~3,000 reads/tháng (scoring) + ~1,800 writes/tháng (approvals) |
| **Status** | ❓ **Unknown** — needs IT meeting |
| **MVP blocking?** | ✅ **Yes** — cannot score without customer data. MVP workaround: synthetic data (no CBS needed for demo). Production: blocking. |
| **Owner** | IT team Bank X (CBS admin) |
| **Risk** | (1) CBS API may not exist → need to build adapter. (2) Direct DB query → performance impact on CBS. (3) Data format inconsistency across CBS versions. (4) CBS maintenance windows → AI-CRDS unavailable during maintenance. |
| **Timeline** | ❓ Confirm method by Week 10. Integration build Week 17-20. Test Week 21-22. |

### INT-2: CIC Bureau

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Credit history, CIC score, outstanding debt, DPD history, inquiries, debt group classification |
| **Data needed** | feature-availability-matrix.md Nhóm 3: CIC Score, total debt, # active loans, max DPD 12M, NPL history, inquiries 6M, credit history length |
| **Method** | ❓ **Cần confirm.** (a) Host-to-Host API (H2H) — CIC conference 02/2026: ~95% banks connected H2H. Preferred. (b) Web portal (manual query by CO) — fallback. |
| **Latency** | H2H API: 5-30 giây acceptable. Portal: 1-5 phút. |
| **Retry logic** | 3 retries × 30 sec timeout → if fail: route to State 5 ("CIC unavailable"). Auto-retry CIC every 30 min × 4. If still down → CO manual query via portal. |
| **Cost** | ❓ Per-query fee. Ước tính 5-20K VND/query. Need to budget: ~3,000 queries/tháng. |
| **CIC data format** | ❓ XML/JSON response? Structured fields or PDF report? |
| **Status** | ⚠️ **Likely available** (95% banks have H2H) — but needs confirmation for Bank X specifically. |
| **MVP blocking?** | ✅ **Yes** for production. MVP demo: use synthetic CIC data. |
| **Owner** | IT team Bank X + CIC relationship manager |
| **Risk** | (1) CIC downtime → queue blocked. Need robust retry + fallback. (2) CIC data update lag (1-2 weeks) → model scores on slightly stale data. (3) Query cost scales with volume. (4) CIC format changes → parser update needed. |
| **Timeline** | Confirm H2H status Week 8-10. Integration build Week 17-20. |

### INT-3: eKYC Provider

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Identity verification: CCCD verification, face match, liveness detection, document authenticity |
| **Data needed** | eKYC result (pass/fail), confidence score, face match score, liveness result, document authenticity, extracted CCCD data (name, DOB, CCCD number for cross-check) |
| **AI-CRDS stores** | **Results only — NOT raw biometric data** (data minimization, BVDLCN). |
| **Method** | REST API (standard for all eKYC providers) |
| **Provider** | ❓ **Cần confirm.** Options: VNPT (BCA connected, highest accuracy), FPT.AI, VNG/Zalo AI, Napas eKYC, in-house. |
| **TT 45/2025** | Bắt buộc biometric verification cho CC issuance. Provider phải comply. |
| **Latency** | 5-15 giây (typical) |
| **Retry** | 2 retries → fail: route to State 5 (customer retry in 30 min or branch visit) |
| **Status** | ✅ **Likely available** — bank already has eKYC for other products (TT 45 requirement since 2025). Need to confirm: (a) which provider, (b) API access for AI-CRDS, (c) output format. |
| **MVP blocking?** | ⚠️ **Partial** — MVP demo can mock eKYC response. Production: blocking. |
| **Owner** | IT team Bank X + eKYC vendor |
| **Risk** | (1) Provider downtime → cannot verify identity → State 5 queue grows. (2) Provider switch → API adapter change. (3) Accuracy varies by provider. |
| **Timeline** | Confirm provider + API format Week 8-10. Integration Week 17-20. |

### INT-4: SIMO (TT 45/2025 — Fraud Blacklist)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Check applicant against inter-bank fraud blacklist (SIMO) + report confirmed fraud |
| **Data needed** | Read: CCCD/phone blacklist check result (match/no match). Write: fraud report for confirmed fraud cases. |
| **Method** | ❓ **Cần confirm.** (a) Real-time API query per application. (b) Batch download daily blacklist file → local check. (c) Through NAPAS/SBV intermediary. |
| **TT 45/2025** | Thông tư 45/2025: bắt buộc TCTD tham gia hệ thống báo cáo gian lận liên ngân hàng. |
| **Latency** | API: < 5 giây. Batch: T+1 (stale). |
| **Status** | ❓ **Unknown** — SIMO integration status varies greatly between banks. Some banks fully integrated, some still manual. |
| **MVP blocking?** | ❌ **No** — MVP can function without SIMO. Use internal blacklist only. Add SIMO in Phase 1. |
| **Owner** | Compliance + IT team Bank X |
| **Risk** | (1) SIMO integration may not exist yet at Bank X → need to build from scratch. (2) Regulatory risk if not integrated (TT 45 requirement). (3) SIMO data format/protocol may evolve. |
| **Timeline** | Confirm status Week 8-10. If not available → plan integration Week 20-25. |

### INT-5: Audit Trail Database

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Immutable log of all decisions for SBV inspection + internal audit + model improvement |
| **Fields** | ≥ 24 fields per decision (sbv-requirements.md Section 3): application_id, customer_id (pseudonymized for reporting), decision_id, timestamp, model_version, threshold_version, AI score, fraud score, confidence, recommendation, explanation, human_decision, CO_id, override_flag, override_reason, state, SLA compliance, adverse_action_id, channels, etc. |
| **Method** | Internal write API → dedicated audit database (NOT CBS). Append-only, immutable. |
| **Immutability** | **Critical requirement:** Once written, records cannot be modified or deleted. Implemented via: (a) append-only database design, OR (b) write-once storage, OR (c) blockchain/hash chain (overkill for v1). |
| **Retention** | 5-10 năm per terminal state (decision-architecture.md Terminal States section). Tiered: raw → pseudonymized → anonymized. |
| **Query** | SBV inspection: retrieve full decision trace within 15 minutes. Replay: reconstruct decision with same inputs + model + threshold → same output. |
| **Volume** | ~3,000 writes/tháng. Storage: ~5-10 KB/record × 3,000 × 12 = ~180-360 MB/năm. Minimal. |
| **Status** | ❌ **Needs to be built** — this is new infrastructure. No existing equivalent at most VN banks. |
| **MVP blocking?** | ✅ **Yes** — audit trail is core requirement (SBV, Luật AI 134/2025). MVP: simple DB (PostgreSQL). Production: hardened immutable store. |
| **Owner** | AI-CRDS dev team + IT team Bank X |
| **Risk** | (1) DB write failure → HALT decision processing (guardrail G-C1: zero tolerance). (2) Storage growth over 10 years → archival strategy needed. (3) Pseudonymization must be implemented correctly (reversible for authorized access, irreversible for external). |
| **Timeline** | Design Week 10. MVP build Week 12. Production hardening Week 35. |

### INT-6: Notification System

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Customer notifications: approval confirmation, rejection (adverse action), document requests, CC issuance |
| **Channels** | (a) Push notification (app — if bank has app). (b) SMS (fallback — all customers have phone). (c) Email (if customer has email — ~40-60% coverage). (d) In-branch letter (branch applications). |
| **Method** | ❓ **Cần confirm:** (a) Bank's existing notification system (SMS gateway, push notification service) — prefer reuse. (b) Build dedicated notification service — if bank's system can't handle structured adverse action notices. |
| **Triggers** | Decision made (approve/reject), documents requested (State 5), CC issued (post-approval), complaint acknowledgment. |
| **Content** | Adverse action notice template (adverse-action-flow.md): top 3 reasons + AI label + customer rights + contact info. |
| **TT 45/2025** | SMS Unicode: Vietnamese characters = ~70 chars/SMS (not 160). Template must fit or link to full notice. |
| **Status** | ⚠️ **Partially available** — bank has SMS gateway for OTP. Need to confirm: (a) can send structured messages, (b) push notification capability, (c) email gateway. |
| **MVP blocking?** | ❌ **No** — MVP demo can show notification template on screen. Production: blocking. |
| **Owner** | IT team Bank X (existing notification infra) + AI-CRDS team (templates) |
| **Risk** | (1) SMS gateway rate limits during peak. (2) Push notification requires bank app update. (3) Email deliverability issues. |
| **Timeline** | Confirm capabilities Week 8-10. Integration Week 20-25. |

---

## 3. INTEGRATION STATUS SUMMARY

| # | Integration | Status | MVP Blocking? | Production Blocking? | Biggest Risk |
|---|-----------|--------|-------------|--------------------|-|
| INT-1 | CBS | ❓ Unknown | ❌ (synthetic data) | ✅ Yes | API may not exist |
| INT-2 | CIC | ⚠️ Likely available | ❌ (synthetic data) | ✅ Yes | Downtime + cost |
| INT-3 | eKYC | ✅ Likely available | ⚠️ Partial (mock) | ✅ Yes | Provider dependency |
| INT-4 | SIMO | ❓ Unknown | ❌ No | ⚠️ Required (TT 45) | May not exist yet |
| INT-5 | Audit Trail | ❌ Build new | ✅ Yes (simple DB) | ✅ Yes | Immutability design |
| INT-6 | Notification | ⚠️ Partial | ❌ No | ✅ Yes | Template support |

### Critical Path for Production

```
INT-1 (CBS) ─── Must confirm API method by Week 10 ─── Build Week 17-20
INT-2 (CIC) ─── Must confirm H2H status by Week 10 ─── Build Week 17-20
INT-5 (Audit) ── Design Week 10 ───────────────────── Build Week 12 (MVP)
INT-3 (eKYC) ── Confirm provider by Week 10 ────────── Build Week 17-20
INT-4 (SIMO) ── Confirm status by Week 10 ──────────── Build Week 20-25 (if available)
INT-6 (Notify) ─ Confirm capabilities by Week 10 ───── Build Week 20-25
```

---

## 4. IT MEETING AGENDA — Week 8-10

**Book meeting with Bank X IT team ASAP.** Agenda:

| # | Question | Why it matters | Who to ask |
|---|---------|---------------|-----------|
| 1 | CBS system type + API availability | Determines entire integration architecture | CBS admin / CTO |
| 2 | CIC H2H API status | Blocking for real-time scoring | IT + CIC relationship |
| 3 | eKYC provider + API docs | Needed for fraud detection layer | IT + eKYC vendor |
| 4 | SIMO integration current state | TT 45/2025 compliance | Compliance + IT |
| 5 | Existing notification infrastructure | Reuse vs build | IT |
| 6 | Network/firewall constraints | API latency, VPN requirements | IT security |
| 7 | Development environment access | Sandbox/staging for AI-CRDS | IT |
| 8 | Maintenance windows + SLA | AI-CRDS availability planning | IT ops |

---

## Tracking

- [ ] ⚠️ **IT meeting booked?** → Nếu chưa, book NGAY tuần này.
- [ ] CBS integration method confirmed?
- [ ] CIC H2H API confirmed?
- [ ] eKYC provider + API docs received?
- [ ] SIMO integration status confirmed?
- [ ] Notification system capabilities confirmed?
- [ ] Development environment access granted?
- [ ] All blocking risks identified + mitigation planned?

---

## Ghi Chú

1. **INT-1 (CBS) là riskiest integration.** Nếu CBS không có API → need to build adapter hoặc use DWH. Timeline extends 4-8 weeks.
2. **INT-5 (Audit Trail) là only integration AI-CRDS team builds from scratch.** All others = integrate with existing Bank X systems.
3. **MVP (Week 12) chỉ cần INT-5 (Audit Trail) live.** All others mocked with synthetic data. Production requires all 6.
4. **Cross-reference:** data-landscape-assessment.md (data sources), feature-availability-matrix.md (data fields per integration), sbv-requirements.md (audit trail spec), workflow-to-be.md (integration in context).