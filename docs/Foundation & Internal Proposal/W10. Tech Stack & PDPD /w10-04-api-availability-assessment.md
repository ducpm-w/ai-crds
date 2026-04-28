# API Availability Assessment — AI-CRDS × Bank X
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Status từng API cần cho AI-CRDS. Fill sau IT meeting. **Phải hoàn chỉnh trước Week 12 MVP build.**

**⚠️ STATUS: CHƯA CÓ IT MEETING.** Tất cả values = ❓. Book IT meeting NGAY.

---

## 1. API STATUS MATRIX

| # | API | Purpose | Status | Method | Latency | Auth | Format | MVP Blocking? | Production Blocking? | Owner |
|---|-----|---------|--------|--------|---------|------|--------|-------------|--------------------|-|
| 1 | **CBS — Customer profile** | Demographics, KYC data, existing products | ❓ | ❓ REST/SOAP/DB | ❓ | ❓ | ❓ | ❌ No (synthetic) | ✅ Yes | IT — CBS admin |
| 2 | **CBS — Transaction history** | Salary detection, balance patterns, behavioral features | ❓ | ❓ REST/Batch/DWH | ❓ | ❓ | ❓ | ❌ No | ⚠️ Partial (existing cust only) | IT — CBS admin |
| 3 | **CBS — Write (decision)** | Update application status, set CC limit, trigger issuance | ❓ | ❓ REST/SOAP | ❓ | ❓ | ❓ | ❌ No | ✅ Yes | IT — CBS admin |
| 4 | **CIC — H2H query** | Credit score, debt, DPD, inquiries | ❓ | ❓ H2H/Portal | 5-30s est. | ❓ | XML est. | ❌ No (synthetic) | ✅ Yes | IT + CIC relationship |
| 5 | **eKYC — Verification** | Identity, face match, liveness, doc auth | ❓ | REST (standard) | 5-15s est. | API key est. | JSON est. | ❌ No (mock) | ✅ Yes | IT + eKYC vendor |
| 6 | **SIMO — Blacklist check** | Fraud blacklist inter-bank | ❓ | ❓ | ❓ | ❓ | ❓ | ❌ No | ⚠️ Required (TT 45) | Compliance + IT |
| 7 | **SIMO — Fraud report** | Report confirmed fraud | ❓ | ❓ | ❓ | ❓ | ❓ | ❌ No | ⚠️ Required (TT 45) | Compliance + IT |
| 8 | **SMS gateway** | Customer notifications | ❓ | ❓ REST/SMPP | ❓ | ❓ | ❓ | ❌ No | ✅ Yes | IT |
| 9 | **Push notification** | App notification (if bank has app) | ❓ | ❓ FCM/APNs | ❓ | ❓ | ❓ | ❌ No | ⚠️ Nice-to-have | IT + Mobile team |
| 10 | **Email gateway** | Email notifications | ❓ | ❓ SMTP/API | ❓ | ❓ | ❓ | ❌ No | ⚠️ Nice-to-have | IT |

---

## 2. DEPENDENCY MAP — What Blocks What

```
MVP (Week 12) — Synthetic data, no external APIs needed
├── Audit Trail DB (internal build) ← ONLY real dependency
└── Everything else mocked

Shadow Testing (Week 37) — Real data, APIs needed
├── CBS Customer profile ← BLOCKING
├── CIC H2H ← BLOCKING
├── eKYC ← BLOCKING
├── Audit Trail DB ← BLOCKING (already built)
└── Notification, SIMO ← nice-to-have

Full Production (Week 45+) — All APIs needed
├── All of above ← BLOCKING
├── CBS Write (decision) ← BLOCKING
├── SIMO ← REQUIRED (TT 45)
├── SMS + Push + Email ← REQUIRED (adverse action)
└── CBS Transaction history ← REQUIRED (behavioral features)
```

### Critical Path

```
Week 10: Confirm CBS API + CIC H2H + eKYC with IT
    │
Week 12: MVP build (synthetic data, mocked APIs)
    │
Week 17-20: Integration build
    ├── CBS adapter (4-8 weeks depending on API availability)
    ├── CIC H2H integration (2-4 weeks)
    ├── eKYC integration (2-3 weeks)
    └── Parallel builds possible
    │
Week 21-22: Integration testing
    │
Week 37: Shadow testing (all APIs live)
```

**If CBS has NO API (worst case):** +8-12 weeks to build adapter. Shadow testing shifts to Week 45-49. Full production shifts to Week 53+. **This is the single biggest schedule risk.**

---

## 3. PER-API DETAIL — Fill After IT Meeting

### API #1: CBS Customer Profile

| Attribute | Value (fill after IT meeting) |
|-----------|-----|
| Endpoint URL | ❓ |
| HTTP Method | ❓ GET / POST |
| Authentication | ❓ API key / OAuth / Certificate / Basic |
| Request format | ❓ JSON / XML / Query params |
| Request sample | ❓ `GET /api/v1/customer?cccd=012345678901` |
| Response format | ❓ JSON / XML |
| Response sample | ❓ |
| Fields available | ❓ (cross-check with feature-availability-matrix.md) |
| Rate limit | ❓ Requests/second, requests/day |
| Error codes | ❓ 400/401/404/500 |
| SLA (uptime) | ❓ |
| Test environment | ❓ Sandbox URL? Test credentials? |
| Documentation | ❓ Swagger/OpenAPI doc? PDF? |

*(Copy template trên cho mỗi API #2-#10)*

---

## 4. RISK ASSESSMENT

| API | Risk if unavailable | Mitigation | Probability |
|-----|-------------------|-----------|-------------|
| CBS Customer profile | Cannot score (no input data) | DWH fallback (batch, stale). Worst case: manual data entry by CO. | ❓ Low (most banks have some API) |
| CBS Transaction history | No behavioral features (Nhóm 4). Model runs on Nhóm 1-3 only. | Acceptable for v1. Behavioral features = "nice-to-have" for existing customers. | 🟡 Medium |
| CIC H2H | Cannot get credit history for scoring. | Manual CIC portal query (slow, not scalable). Significantly degrades operational benefit. | ❓ Low (95% banks have H2H) |
| eKYC | Cannot verify identity. Cannot process any application. | Branch manual verify (slow, not scalable, may not comply TT 45). | ❓ Low (TT 45 requires eKYC) |
| SIMO | Cannot check fraud blacklist. Compliance risk (TT 45). | Internal blacklist only (incomplete). Accept risk for MVP. Must have for production. | 🟡 Medium (SIMO integration varies) |
| Notification | Cannot notify customer of decision. | Manual notification by CO/branch (not scalable). Acceptable short-term. | ❓ Low (most banks have SMS gateway) |

---

## 5. QUESTIONS FOR IT MEETING

| # | Question | Priority | Reason |
|---|---------|---------|--------|
| 1 | **CBS: Is there a REST API for customer profile lookup?** If not, what's available? | 🔴 | Architecture decision depends on this |
| 2 | **CIC: Are you connected H2H?** Can we call CIC API programmatically? | 🔴 | Core scoring feature source |
| 3 | **eKYC: Which provider? Can we get API documentation?** | 🔴 | Integration design |
| 4 | **Can we get sandbox/test credentials** for CBS + CIC + eKYC? | 🔴 | Development needs test environment |
| 5 | **SIMO: Current integration status?** Real-time or batch? | 🟡 | TT 45 compliance planning |
| 6 | **Network: VPN required for API access? Firewall rules?** | 🟡 | Development environment setup |
| 7 | **Maintenance windows** for CBS, CIC? (When are APIs unavailable?) | 🟡 | SLA + exception handling design |
| 8 | **Rate limits** on any API? Daily query limits? | 🟡 | Capacity planning |

---

## Tracking

- [ ] ⚠️ **IT meeting completed?** All ❓ must be filled.
- [ ] CBS API method confirmed? (REST/SOAP/DB/Batch)
- [ ] CIC H2H confirmed?
- [ ] eKYC API docs received?
- [ ] Test/sandbox credentials received?
- [ ] All blocking APIs confirmed available?
- [ ] Integration timeline estimated per API?

---

## Ghi Chú

1. **File phải được hoàn chỉnh (tất cả ❓ → answered) trước Week 12.** MVP build cần biết target integration architecture.
2. **MVP (Week 12) không cần any external API live** — tất cả mocked. Nhưng architecture decisions bây giờ affect code structure.
3. **Cross-reference:** integration-point-map.md (integration design), tech-stack-assessment.md (infrastructure), exception-flow.md (API failure handling).