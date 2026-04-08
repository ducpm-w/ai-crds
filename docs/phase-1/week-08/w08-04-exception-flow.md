# Exception Flow — AI-CRDS
> **Tags:** `[Architecture]` `[Product]` `[Ops]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 8
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Chi tiết 6 exception types + handling logic + audit requirements. Mở rộng từ decision-state-spec.md Section 5 (system + business exceptions).

---

## 1. EXCEPTION SUMMARY

| # | Exception | Trigger | Severity | Frequency (est.) | State impact | Recovery |
|---|----------|---------|---------|-----------------|-------------|---------|
| EX-1 | CIC timeout/unavailable | CIC API fail after retries | 🟡 Medium | ~2-5% of queries (CIC maintenance, network) | → State 5 | Auto-retry + manual fallback |
| EX-2 | eKYC provider down | eKYC API fail after retries | 🟡 Medium | ~1-3% of calls (provider maintenance) | → State 5 | Customer retry + branch fallback |
| EX-3 | CBS unreachable | CBS API timeout/error | 🔴 High | Rare (~0.1% but impacts all applications) | → State 4 (all apps) | IT incident response |
| EX-4 | AI model error/timeout | Scoring model fails | 🔴 High | Rare (~0.05%) | → State 4 | Fallback to manual |
| EX-5 | Duplicate application | Same CCCD + product within 30 days | 🟡 Medium | ~1-3% of applications | → State 3 or merge | CO review |
| EX-6 | Customer opt-out AI | Customer requests manual review | 🟢 Low | ~2-5% of applications (ước tính) | → State 2 (100% manual) | Normal processing |

---

## 2. DETAILED EXCEPTION FLOWS

### EX-1: CIC Timeout / Unavailable

```
CIC API call initiated
    │
    ├── Attempt 1: timeout (30s) or error response
    │   → Wait 10s
    │
    ├── Attempt 2: timeout or error
    │   → Wait 20s
    │
    ├── Attempt 3: timeout or error
    │   → CIC declared UNAVAILABLE
    │
    ▼
┌─────────────────────────────────────┐
│ ROUTE TO STATE 5 (Need-More-Info)   │
│                                     │
│ Flag: CIC_UNAVAILABLE               │
│ SLA clock: CONTINUES (không pause)  │
│                                     │
│ Parallel actions:                   │
│ ├── Auto-retry CIC every 30 min    │
│ │   (max 4 retries = 2 hours)      │
│ │                                   │
│ ├── If auto-retry succeeds:        │
│ │   → Re-enter pipeline Stage 3    │
│ │   → Resume normal scoring        │
│ │                                   │
│ ├── If all auto-retries fail:      │
│ │   → Notify CO: "CIC unavailable" │
│ │   → CO manual CIC query via      │
│ │     web portal                    │
│ │   → CO enters CIC data manually  │
│ │   → Resume scoring with manual   │
│ │     CIC data                     │
│ │                                   │
│ └── If CIC down > 4 hours:         │
│     → Escalate to IT + Supervisor  │
│     → Consider: process without    │
│       CIC? → NO for credit scoring │
│       (CIC is must-have feature)    │
│     → Applications queue until     │
│       CIC restored                 │
└─────────────────────────────────────┘
```

| Attribute | Value |
|-----------|-------|
| **Retry config** | 3 attempts × 30s timeout. Backoff: 10s, 20s. |
| **Auto-retry** | Every 30 min × 4 = 2 hours total |
| **Manual fallback** | CO queries CIC web portal manually. Time: 1-5 min. |
| **Audit log** | `exception_type: "CIC_UNAVAILABLE"`, `retry_count: 3`, `auto_retry_count: X`, `resolution: "auto_recovered" / "manual_cic" / "queued"` |
| **Guardrail** | If CIC unavailable > 4 hours → G-O4 system availability guardrail triggered |
| **KHÔNG approve without CIC** | CIC data is must-have (Tier 1 features). Cannot score without CIC. Exception: thin-file model (no CIC record) is different from CIC unavailable (system down). |

### EX-2: eKYC Provider Down

```
eKYC API call initiated
    │
    ├── Attempt 1: timeout (15s) or error
    │   → Wait 5s
    │
    ├── Attempt 2: timeout or error
    │   → eKYC declared DOWN
    │
    ▼
┌─────────────────────────────────────┐
│ ROUTE TO STATE 5 (Need-More-Info)   │
│                                     │
│ Flag: EKYC_PROVIDER_DOWN            │
│                                     │
│ Customer communication:             │
│ "Hệ thống xác minh danh tính đang  │
│  bảo trì. Vui lòng thử lại sau     │
│  30 phút hoặc đến chi nhánh."      │
│                                     │
│ ├── Auto-retry: every 15 min × 8   │
│ │   (total 2 hours)                │
│ │                                   │
│ ├── If auto-retry succeeds:        │
│ │   → Notify customer: "retry now" │
│ │   → Customer submits eKYC again  │
│ │   → Resume pipeline              │
│ │                                   │
│ ├── Branch fallback:               │
│ │   → Customer visits branch       │
│ │   → Manual identity verification │
│ │     (CCCD original + photo match)│
│ │   → Staff enters manual verify   │
│ │     result: pass/fail            │
│ │   → Resume pipeline              │
│ │                                   │
│ └── If customer no action 14 days: │
│     → Application EXPIRED          │
└─────────────────────────────────────┘
```

| Attribute | Value |
|-----------|-------|
| **Retry config** | 2 attempts × 15s timeout. |
| **Auto-retry** | Every 15 min × 8 = 2 hours |
| **Branch fallback** | Manual identity verification by branch staff. Less secure than eKYC biometric — acceptable as exception fallback. |
| **Audit log** | `exception_type: "EKYC_PROVIDER_DOWN"`, `resolution: "auto_recovered" / "branch_manual" / "expired"`, `manual_verify_staff_id` (if branch) |
| **TT 45/2025 note** | TT 45 requires biometric verification. Branch manual fallback may not fully comply. ❓ Cần confirm với Compliance: is manual CCCD verification acceptable as temporary fallback? |

### EX-3: CBS Unreachable

```
CBS API call initiated (read customer data)
    │
    ├── Attempt 1: timeout (10s) or error
    │   → Wait 5s
    │
    ├── Attempt 2: timeout or error
    │   → Wait 10s
    │
    ├── Attempt 3: timeout or error
    │   → CBS declared UNREACHABLE
    │
    ▼
┌─────────────────────────────────────┐
│ 🔴 SEVERITY: HIGH                   │
│                                     │
│ CBS unreachable = CANNOT process    │
│ ANY application (no customer data)  │
│                                     │
│ Immediate actions:                  │
│ ├── ALL new applications → State 4  │
│ │   (Escalate — manual processing)  │
│ ├── IT incident response triggered  │
│ ├── Ops Manager + IT Manager alerted│
│ ├── SLA clock: PAUSED for all apps  │
│ │   affected by CBS outage          │
│ └── Dashboard: system status =      │
│     "CBS UNREACHABLE — manual mode" │
│                                     │
│ CO actions during CBS outage:       │
│ ├── CAN still access CIC (separate) │
│ ├── CAN still do eKYC (separate)    │
│ ├── CANNOT access customer profile  │
│ ├── CANNOT check existing products  │
│ └── Process only with available data│
│     → Senior CO full manual review  │
│                                     │
│ Recovery:                           │
│ ├── CBS restored → auto-resume      │
│ ├── Re-process queued applications  │
│ └── Post-incident report within 24h │
└─────────────────────────────────────┘
```

| Attribute | Value |
|-----------|-------|
| **Severity** | 🔴 HIGH — affects ALL applications |
| **Retry config** | 3 attempts × 10s timeout. Backoff: 5s, 10s. |
| **Fallback** | Senior CO manual processing with limited data. No auto-route (State 1) during outage. |
| **Audit log** | `exception_type: "CBS_UNREACHABLE"`, `outage_start`, `outage_end`, `applications_affected_count`, `resolution: "auto_recovered" / "manual_processed"` |
| **Guardrail** | G-O4 (System availability ≥ 99%) triggered. If > 1 hour → Ops Manager + CTO notified. |
| **Post-incident** | Root cause analysis within 24h. Report to Risk Committee if > 2 hours. |

### EX-4: AI Model Error / Timeout

```
AI scoring model called
    │
    ├── Model response > 30 giây (timeout)
    │   OR
    ├── Model returns error / null / invalid output
    │   OR
    ├── Model returns score outside expected range (< 0 or > 1)
    │
    ▼
┌─────────────────────────────────────┐
│ ROUTE TO STATE 4 (Escalate)         │
│ NOT State 2                          │
│                                     │
│ Why State 4, not State 2:           │
│ State 2 shows AI recommendation —   │
│ but AI failed → no recommendation   │
│ to show. CO would see blank AI      │
│ panel → confusing. State 4 = Senior │
│ CO does full manual underwriting    │
│ WITHOUT AI output.                   │
│                                     │
│ Parallel:                           │
│ ├── IT alert: model error logged    │
│ ├── DS team notified                │
│ ├── If error rate > 1% (G-O5):     │
│ │   → All applications → State 4   │
│ │   → Manual mode until fixed      │
│ │                                   │
│ └── CO sees:                        │
│     "AI scoring unavailable.        │
│      Full manual review required."  │
│     CO has: CIC data, eKYC data,    │
│     customer profile — everything   │
│     except AI score.                │
└─────────────────────────────────────┘
```

| Attribute | Value |
|-----------|-------|
| **Timeout** | 30 giây (model inference should take 2-5s; 30s = generous timeout) |
| **Error types** | Timeout, HTTP 5xx, null response, invalid output (score outside [0,1]), model version mismatch |
| **Fallback** | State 4 (Senior CO manual) — NOT State 2 (no AI output to display) |
| **Audit log** | `exception_type: "MODEL_ERROR"`, `error_detail: "timeout" / "http_500" / "null_response" / "invalid_score"`, `model_version`, `latency_ms` |
| **Guardrail** | G-O5: error rate > 1% → ALL apps to State 4. G-M2: if persistent → model rollback to previous version. |
| **Customer impact** | None visible — customer doesn't know AI failed. CO processes manually. May take longer (State 4 SLA: 24h instead of State 1: 4h). |

### EX-5: Duplicate Application

```
Application received
    │
    ├── System check: same CCCD + same CC product
    │   within 30 calendar days?
    │
    ├── YES — DUPLICATE DETECTED
    │
    ▼
┌─────────────────────────────────────┐
│ FLAG: DUPLICATE_APPLICATION          │
│                                     │
│ Scenarios:                          │
│                                     │
│ A) Previous app STILL IN PROCESS    │
│    (State 1/2/3/4/5):              │
│    → Block new app                  │
│    → Notify customer: "Bạn đã có   │
│      hồ sơ đang xử lý."            │
│    → Show existing app status       │
│                                     │
│ B) Previous app REJECTED:           │
│    → Check re-application rules:    │
│      - Standard reject: 90 ngày     │
│        (adverse-action-flow.md)     │
│      - Fraud reject: 12 tháng      │
│    → If within re-apply window:     │
│      Block + notify reason + date   │
│    → If past window:                │
│      Allow as new application       │
│                                     │
│ C) Previous app APPROVED:           │
│    → Block — customer already has   │
│      this CC product                │
│    → Unless: upgrade/replace request│
│      → Route to separate flow      │
│                                     │
│ D) Previous app EXPIRED/WITHDRAWN:  │
│    → Allow as new application       │
│    → Flag for CO: "Previous app     │
│      expired/withdrawn [date]"      │
│                                     │
│ E) Same CCCD, DIFFERENT product:    │
│    → NOT duplicate. Process normal. │
│    → Flag: "Customer has pending    │
│      app for [other product]"       │
│                                     │
│ F) Same device/IP, DIFFERENT CCCD   │
│    (within 24h):                    │
│    → Potential fraud ring           │
│    → Route to State 3               │
│    → Fraud flag: APPLICATION_VELOCITY│
└─────────────────────────────────────┘
```

| Attribute | Value |
|-----------|-------|
| **Detection** | Automated: CCCD + product type + date window lookup on application database |
| **Scenario A** | Block immediately. Customer sees existing app status. No CO intervention needed. |
| **Scenario B** | Check re-application policy (90 days standard, 12 months fraud). System-enforced. |
| **Scenario F** | Fraud signal — route to State 3. Different from simple duplicate. |
| **Audit log** | `exception_type: "DUPLICATE_APPLICATION"`, `previous_app_id`, `previous_app_status`, `scenario: "A" / "B" / "C" / "D" / "E" / "F"`, `action: "blocked" / "allowed" / "fraud_flagged"` |

### EX-6: Customer Opt-Out AI

```
Customer filling CC application
    │
    ├── Consent screen displays:
    │   "Hồ sơ sẽ được xử lý có hỗ trợ AI.
    │    Quý khách có muốn xử lý hoàn toàn
    │    bởi nhân viên không?"
    │
    │   [✓ Đồng ý AI]  [✗ Yêu cầu thủ công]
    │
    ├── Customer chọn "Yêu cầu thủ công"
    │
    ▼
┌─────────────────────────────────────┐
│ FLAG: OPT_OUT_AI = TRUE              │
│                                     │
│ Processing:                         │
│ ├── Skip AI scoring entirely        │
│ │   (Stage 3 bypassed)              │
│ ├── eKYC + CIC still run (not AI)   │
│ ├── Route directly to State 2       │
│ │   (Standard Review — full manual) │
│ ├── CO sees: "Customer opted out    │
│ │   of AI scoring. Full manual      │
│ │   review required."               │
│ ├── CO reviews as per as-is flow    │
│ │   (20-35 min, same as before AI)  │
│ └── If rejected:                    │
│     → Adverse action notice WITHOUT │
│       AI label (AI not involved)    │
│     → Customer still has right to   │
│       complain via normal channels  │
│                                     │
│ Compliance:                         │
│ NĐ 356/2025 Điều 9: quyền từ chối │
│ quyết định tự động. Respected.      │
└─────────────────────────────────────┘
```

| Attribute | Value |
|-----------|-------|
| **Trigger** | Customer explicit choice on consent form |
| **Impact** | Application processed 100% manually. No AI scoring, no AI recommendation, no AI label. |
| **CO experience** | Same as as-is flow. No AI panel displayed. Full manual review. |
| **Time impact** | 20-35 min (full manual) vs potential 3-5 min (State 1 batch) = slower. Customer chose this. |
| **Monitoring** | L3-C7 (Opt-out rate). Target < 5%. If > 10% → investigate: customers don't trust AI? Consent form confusing? |
| **Audit log** | `opt_out_ai: true`, `opt_out_timestamp`, `opt_out_reason: null` (no reason required from customer). AI-related audit fields: null. |
| **Re-application** | If rejected and customer re-applies → can choose differently (opt-in AI) next time. |

---

## 3. EXCEPTION HANDLING MATRIX

| Exception | Detection | Auto-handled? | CO intervention? | IT intervention? | SLA impact |
|----------|----------|-------------|-----------------|-----------------|-----------|
| EX-1 CIC down | API error after 3 retries | ✅ Auto-retry 2h | ⚠️ Manual CIC query if auto fails | ⚠️ If > 4h: IT investigate | SLA continues |
| EX-2 eKYC down | API error after 2 retries | ✅ Auto-retry 2h | ❌ | ⚠️ If > 2h: IT investigate | SLA paused (customer dependent) |
| EX-3 CBS down | API error after 3 retries | ❌ | ✅ Manual mode (all S4) | ✅ IT incident response | SLA paused for affected |
| EX-4 Model error | Timeout/error/invalid | ✅ Auto-route S4 | ✅ Senior CO manual | ✅ DS + IT investigate | SLA = S4 (24h) |
| EX-5 Duplicate | CCCD + product match | ✅ Auto-block (A,B,C) or auto-allow (D,E) | ⚠️ CO review for scenario F (fraud) | ❌ | N/A (blocked) or normal |
| EX-6 Opt-out | Customer choice | ✅ Auto-route S2 | ✅ Full manual review | ❌ | Normal S2 SLA |

---

## 4. CASCADING EXCEPTIONS

Khi nhiều exceptions xảy ra cùng lúc:

| Combination | Handling | Priority |
|------------|---------|---------|
| EX-3 (CBS) + EX-1 (CIC) | Both down → effectively no data. Queue ALL applications. IT emergency. | 🔴 Highest — dual outage |
| EX-4 (Model) + EX-1 (CIC) | No AI score + no CIC data → State 4 with very limited data. Senior CO decides with eKYC + application form only. | 🔴 High |
| EX-1 (CIC) + EX-5 (Duplicate) | Duplicate check still works (internal DB). CIC unavailable handled separately. | 🟡 Medium — process independently |
| EX-2 (eKYC) + EX-6 (Opt-out) | Customer opted out of AI anyway. eKYC still needed for identity (TT 45). Branch fallback for eKYC. | 🟡 Medium |
| EX-4 (Model) + volume spike (Tết) | Model timeout due to load. Scale inference infra. If cannot scale fast → increase State 4 SLA temporarily (Risk Committee emergency approval). | 🟡 Medium |

---

## 5. EXCEPTION MONITORING DASHBOARD

| Metric | Normal | Warning | Critical |
|--------|--------|---------|---------|
| CIC retry rate (EX-1) | < 2% | 2-5% | > 5% → CIC service degraded |
| eKYC retry rate (EX-2) | < 1% | 1-3% | > 3% → provider issue |
| CBS error rate (EX-3) | < 0.1% | 0.1-0.5% | > 0.5% → IT incident |
| Model error rate (EX-4) | < 0.05% | 0.05-0.5% | > 1% → G-O5 guardrail |
| Duplicate rate (EX-5) | 1-3% | > 5% | > 8% → possible system issue |
| Opt-out rate (EX-6) | < 5% | 5-10% | > 10% → trust issue |

---

## Tracking

- [ ] IT team confirmed CIC retry/fallback feasible?
- [ ] Compliance confirmed eKYC branch fallback acceptable under TT 45?
- [ ] CBS outage procedure aligned with IT incident response?
- [ ] Model error fallback (→ State 4) reviewed with DS team?
- [ ] Duplicate detection logic reviewed (6 scenarios)?
- [ ] Opt-out AI consent form wording reviewed with Compliance?
- [ ] Cascading exception scenarios reviewed with IT + Ops?

---

## Ghi Chú

1. **EX-3 (CBS unreachable) là most critical** — affects ALL applications. Other exceptions affect individual applications.
2. **"KHÔNG approve without CIC"** (EX-1) — CIC is must-have data. Different from thin-file (khách doesn't have CIC record = legitimate, scored differently). CIC down = system issue, not customer issue.
3. **EX-6 (Opt-out) expected < 5%** — nhưng nếu > 10%, root cause analysis: consent form confusing? Customers heard bad things about AI? Competitor marketing against AI decisions?
4. **Cross-reference:** decision-state-spec.md §5 (system + business exceptions), integration-point-map.md (integration risks), guardrail-definitions.md (G-O4, G-O5 triggers), workflow-to-be.md (Stage 2 exception handling).