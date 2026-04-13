# Tech Stack Assessment — AI-CRDS × Bank X
> **Tags:** `[Tech]` `[Architecture]` `[Infrastructure]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 10
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Document tech stack Bank X — cần confirm với IT/CTO trước Week 12 MVP build. Tất cả ❓ items phải được fill sau IT meeting.

**⚠️ STATUS: CHƯA CÓ IT MEETING.** Tất cả values là placeholder/ước tính. Book meeting NGAY.

---

## 1. CORE BANKING SYSTEM (CBS)

| Attribute | Value | Status |
|-----------|-------|--------|
| **Vendor** | ❓ T24 (Temenos) / Flexcube (Oracle) / FIS Profile / Homegrown | ❓ Cần confirm |
| **Version** | ❓ | ❓ |
| **API availability** | ❓ Options: (a) REST API via ESB/API Gateway. (b) SOAP Web Services. (c) Direct DB (risky). (d) Batch export only. | ❓ **Critical — blocking** |
| **ESB / API Gateway** | ❓ Có không? Vendor? (MuleSoft / Kong / WSO2 / IBM / in-house) | ❓ |
| **API documentation** | ❓ Có sẵn? Format? Sandbox? | ❓ |
| **Data warehouse** | ❓ Có không? Technology? (Oracle DWH / Teradata / BigQuery / Hadoop) | ❓ |
| **Database** | ❓ Oracle / DB2 / SQL Server / PostgreSQL | ❓ |
| **Encoding** | ❓ UTF-8? (Vietnamese diacritics critical) | ❓ |
| **Maintenance windows** | ❓ Khi nào? Bao lâu? Frequency? | ❓ |
| **SLA** | ❓ Uptime commitment? | ❓ |

### CBS Impact on AI-CRDS

| If CBS has... | AI-CRDS approach | Timeline impact |
|-------------|-----------------|----------------|
| REST API via ESB | ✅ Ideal — direct integration | On schedule |
| SOAP only | ⚠️ Need SOAP adapter | +2 weeks |
| Direct DB only | ⚠️ Build read-only adapter, careful performance | +4 weeks |
| Batch export only | 🔴 Major issue — no real-time scoring possible | +8 weeks, architecture redesign |
| No API at all | 🔴 Need to build CBS adapter from scratch | +8-12 weeks |

---

## 2. CIC INTEGRATION

| Attribute | Value | Status |
|-----------|-------|--------|
| **Method** | ❓ H2H API / Web portal / Batch | ❓ **Critical** |
| **H2H connected?** | ❓ CIC conference 02/2026: ~95% banks have H2H. Bank X? | ❓ |
| **API format** | ❓ XML / JSON | ❓ |
| **Response time** | ❓ Ước tính: H2H 5-30s, portal 1-5 min | ❓ |
| **Per-query cost** | ❓ Ước tính 5-20K VND/query | ❓ |
| **Test environment** | ❓ CIC sandbox available? | ❓ |
| **Query volume limit** | ❓ Rate limit? Daily max? | ❓ |
| **Downtime schedule** | ❓ CIC maintenance windows? | ❓ |

---

## 3. eKYC PROVIDER

| Attribute | Value | Status |
|-----------|-------|--------|
| **Vendor** | ❓ VNPT / FPT.AI / VNG / Napas / In-house | ❓ |
| **API type** | REST API (standard for all providers) | ✅ Assumed |
| **API documentation** | ❓ Available? | ❓ |
| **Output fields** | ❓ Minimum: pass/fail, confidence, face_match, liveness, doc_authentic | ❓ |
| **Face match threshold** | ❓ Provider default? Bank customized? | ❓ |
| **Liveness detection** | ❓ Active (user action) or passive? | ❓ |
| **BCA connection** | ❓ Provider connects to CSDL quốc gia BCA? (VNPT = yes) | ❓ |
| **TT 45/2025 compliance** | ❓ Provider certified? | ❓ |
| **Biometric data storage** | ❓ Stored at provider? At bank? Both? | ❓ **PDPD critical** |
| **Cost per verification** | ❓ | ❓ |
| **Uptime SLA** | ❓ | ❓ |

---

## 4. INTERNAL INFRASTRUCTURE

| Attribute | Value | Status |
|-----------|-------|--------|
| **Hosting** | ❓ On-premise / VN cloud (Viettel/FPT) / Hybrid | ❓ |
| **Cloud provider** (nếu có) | ❓ Viettel Cloud / FPT Cloud / VNPT Cloud / CMC | ❓ |
| **GPU availability** | ❓ Cho model inference (nếu cần). Logistic regression = no GPU. GBM = no GPU. Deep learning = GPU. | ❓ |
| **Database** | ❓ Oracle / PostgreSQL / MySQL / MongoDB | ❓ |
| **Container support** | ❓ Docker / Kubernetes / None | ❓ |
| **CI/CD** | ❓ Jenkins / GitLab CI / GitHub Actions / None | ❓ |
| **Monitoring** | ❓ Prometheus / Grafana / Datadog / ELK / None | ❓ |
| **Dev environment** | ❓ Sandbox / Staging available? Separate from production? | ❓ |
| **Network** | ❓ VPN required? Firewall rules? DMZ? | ❓ |
| **Security** | ❓ HSM for keys? WAF? IDS/IPS? | ❓ |

### AI-CRDS Infrastructure Requirements

| Component | Minimum (MVP) | Recommended (Production) |
|----------|-------------|----------------------|
| **Compute** | 2 vCPU, 4GB RAM (scoring API) | 4 vCPU, 8GB RAM (redundant) |
| **Storage** | 50GB (audit trail + model artifacts) | 200GB (3-year retention) |
| **Database** | PostgreSQL 14+ (audit trail, application data) | PostgreSQL 14+ with replication |
| **GPU** | Not needed (logistic regression / XGBoost) | Not needed unless deep learning |
| **Network** | Outbound to CIC, eKYC APIs. Inbound from CBS. | Same + load balancer |

---

## 5. NOTIFICATION SYSTEM

| Attribute | Value | Status |
|-----------|-------|--------|
| **SMS gateway** | ❓ Vendor? (Viettel, VNPT, FPT, etc.) | ❓ |
| **SMS API** | ❓ REST? Can send structured messages? | ❓ |
| **SMS Unicode** | ❓ Support Vietnamese characters? (~70 chars/SMS) | ❓ |
| **Push notification** | ❓ Bank app supports push? FCM/APNs? | ❓ |
| **Email gateway** | ❓ SMTP? SendGrid? In-house? | ❓ |
| **Email HTML** | ❓ Support HTML templates? | ❓ |

---

## 6. SIMO (TT 45/2025)

| Attribute | Value | Status |
|-----------|-------|--------|
| **Integration status** | ❓ Fully integrated / Partial / Not yet | ❓ |
| **Method** | ❓ Real-time API / Batch download / Through NAPAS | ❓ |
| **Query capability** | ❓ Can query per-application? Or batch only? | ❓ |
| **Report capability** | ❓ Can submit fraud reports programmatically? | ❓ |

---

## 7. AI-CRDS TECH STACK (Proposed)

| Component | Technology | Rationale |
|----------|-----------|----------|
| **Language** | Python 3.11+ | ML ecosystem (scikit-learn, XGBoost, SHAP). Industry standard. |
| **ML Framework** | scikit-learn (MVP), XGBoost/LightGBM (v2) | Logistic regression MVP → gradient boosting v2. |
| **Explainability** | SHAP (SHapley Additive exPlanations) | Model-agnostic. Generates top-N feature contributions per decision. |
| **API Framework** | FastAPI (Python) | Async, high performance, auto-docs (OpenAPI). |
| **Database** | PostgreSQL 14+ | Audit trail (append-only), application data, model metadata. |
| **Feature Store** | Simple: PostgreSQL tables. Future: Feast/Tecton. | MVP: no need for dedicated feature store. Production: evaluate. |
| **Model Serving** | FastAPI endpoint (MVP). Future: MLflow / Seldon. | MVP: simple. Production: evaluate MLOps tools. |
| **Monitoring** | Prometheus + Grafana (metrics). ELK (logs). | Standard observability stack. ❓ Align with Bank X existing tools. |
| **Frontend** | React / Next.js (CO Review UI) | Modern, responsive. ❓ Align with Bank X frontend standards. |
| **Deployment** | Docker containers. ❓ K8s if Bank X supports. | Containerized for portability. |

### Tech Stack Alignment Questions (for IT meeting)

| # | Question | Why it matters |
|---|---------|---------------|
| 1 | Bank X dùng programming language nào cho internal tools? | Align AI-CRDS language nếu possible (maintainability). |
| 2 | Bank X có existing ML infrastructure không? | Reuse vs build. |
| 3 | Bank X frontend framework? (React/Angular/Vue) | CO Review UI phải match. |
| 4 | Bank X có DevOps team không? CI/CD capabilities? | Deployment process. |
| 5 | Bank X security team: pen test required before production? | Timeline impact. |

---

## 8. IT MEETING AGENDA

**⚠️ BOOK MEETING NGAY TUẦN NÀY.** Duration: 60-90 phút. Attendees: CTO/IT Manager, CBS admin, Security lead.

| # | Topic | Time | Priority |
|---|-------|------|---------|
| 1 | CBS system + API availability | 15 min | 🔴 Blocking |
| 2 | CIC H2H status | 10 min | 🔴 Blocking |
| 3 | eKYC provider + API docs | 10 min | 🟡 |
| 4 | Infrastructure: hosting, DB, containers | 10 min | 🟡 |
| 5 | SIMO integration status | 5 min | 🟡 |
| 6 | Notification system capabilities | 5 min | 🟢 |
| 7 | Security policies: VPN, firewall, pen test | 10 min | 🟡 |
| 8 | Dev environment access | 5 min | 🔴 Blocking |
| 9 | AI-CRDS tech stack compatibility | 10 min | 🟡 |

---

## Tracking

- [ ] ⚠️ **IT meeting booked?**
- [ ] CBS API method confirmed?
- [ ] CIC H2H confirmed?
- [ ] eKYC provider + API docs?
- [ ] Dev environment access?
- [ ] All ❓ items in this document filled?

---

## Ghi Chú

1. **CBS API availability là single biggest technical risk.** Nếu no API → timeline +8-12 weeks.
2. **AI-CRDS tech stack (Section 7) là proposed** — may adjust after IT meeting (align with Bank X standards).
3. **Cross-reference:** integration-point-map.md (integration details), api-availability-assessment.md (API status per endpoint).