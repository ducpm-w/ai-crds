# Security Policy Alignment — AI-CRDS × Bank X
> **Tags:** `[Tech]` `[Security]` `[Compliance]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 10
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

AI-CRDS phải align với Bank X security policies. Document các yêu cầu + gap analysis. Fill sau IT Security meeting.

**⚠️ STATUS: CHƯA CONFIRM VỚI IT SECURITY.** Values là standard banking requirements + ước tính.

---

## 1. AUTHENTICATION

| Requirement | Bank X policy (❓) | AI-CRDS design | Gap? | Action |
|-----------|-------------------|---------------|------|--------|
| **SSO integration** | ❓ Có SSO không? (AD/LDAP/SAML/OAuth?) | AI-CRDS CO login via Bank X SSO. Không tạo credential riêng. | ❓ | Confirm SSO type. Build SSO adapter. |
| **MFA (Multi-factor)** | ❓ Bank X yêu cầu MFA cho internal apps? | AI-CRDS support MFA nếu bank policy yêu cầu. OTP via SMS/authenticator app. | ❓ | Confirm MFA requirement + method. |
| **Session timeout** | ❓ Bank X session timeout policy? (30 min? 60 min?) | AI-CRDS follows bank policy. Auto-logout after timeout. Warn 5 min trước. | ❓ | Confirm timeout duration. |
| **Password policy** | ❓ Bank X password complexity? Rotation? | N/A nếu SSO (password managed by SSO). Nếu separate login → follow bank policy. | ❓ | Confirm. Prefer SSO (no separate password). |
| **Login audit** | ❓ Bank X log all logins? | AI-CRDS log: user_id, login_time, IP, device, success/fail. | ✅ Standard | Implement login audit table. |

---

## 2. AUTHORIZATION (RBAC)

| Role | Permissions | Bank X equivalent (❓) | Gap? |
|------|-----------|---------------------|------|
| **CO (Junior/Mid)** | View assigned applications. Approve/reject within authority. Override AI. Cannot change thresholds. Cannot view other CO decisions (except own queue). | ❓ Existing CO role in CBS? | ❓ |
| **Senior CO** | All CO permissions + escalated cases. Higher authority limit. Can clear fraud flags. Can review other CO overrides. | ❓ Existing Senior CO role? | ❓ |
| **Supervisor** | All Senior CO + override approval. View all CO performance metrics. Batch size adjustment. | ❓ Existing Supervisor role? | ❓ |
| **Fraud Analyst** | State 3 cases. EDD checklist. Fraud clearing. SIMO reporting. Cannot approve credit (only clear fraud → route back to CO). | ❓ Existing Fraud role? | ❓ |
| **Risk Manager** | View all dashboards + guardrails. Emergency threshold change (±0.05). Pause/resume AI. Cannot make individual credit decisions. | ❓ Existing Risk role? | ❓ |
| **Compliance** | View audit trail. View bias metrics. Export SBV reports. View DPIA compliance status. Read-only (no decision authority). | ❓ Existing Compliance role? | ❓ |
| **System Admin** | System configuration. User management. No access to PII/decisions (separation of duties). | ❓ Existing IT admin? | ❓ |
| **Data Science** | Model deployment. Feature monitoring. Drift analysis. Access to aggregated/anonymized data only (no raw PII in production). | ❓ New role? | ❓ Map to Bank X IT/Analytics team |

### RBAC Implementation

| Principle | Implementation |
|----------|---------------|
| **Least privilege** | Each role has minimum permissions needed. CO cannot see threshold settings. DS cannot see individual customer PII. |
| **Separation of duties** | System admin ≠ decision maker. DS ≠ CO. Compliance = read-only. |
| **Maker-checker** | Threshold changes: DS propose → Risk Manager approve (threshold-framework.md). Override-to-approve when AI says reject: CO → Supervisor co-sign (override-governance.md). |
| **Delegation** | When Senior CO absent → Supervisor can delegate authority to designated CO. Logged. Time-limited. |
| **Audit trail** | All permission changes logged: who changed, what, when, approved by whom. |

---

## 3. NETWORK SECURITY

| Requirement | Bank X policy (❓) | AI-CRDS design | Gap? |
|-----------|-------------------|---------------|------|
| **Hosting location** | ❓ On-premise / VN cloud / Hybrid | Proposed: VN cloud (Viettel/FPT) for AI-CRDS compute + storage. Data stays in VN (avoid XLBG). | ❓ Bank X preference? |
| **Network segmentation** | ❓ DMZ? Separate VLAN for internal apps? | AI-CRDS in separate network segment from CBS. API Gateway mediates. | ❓ |
| **Firewall rules** | ❓ Outbound: which external APIs allowed? (CIC, eKYC). Inbound: which IP ranges can access AI-CRDS? | Whitelist: CIC API endpoint, eKYC API endpoint, notification gateways. Block all other outbound. | ❓ |
| **VPN requirement** | ❓ Remote access to AI-CRDS via VPN? CO working from home? | AI-CRDS accessible only via bank internal network or VPN. No public internet access. | ❓ |
| **TLS version** | ❓ Bank X minimum TLS version? | AI-CRDS: TLS 1.2+ for all connections. TLS 1.3 preferred. | ✅ Standard |
| **API Gateway** | ❓ Bank X has existing API Gateway? | AI-CRDS APIs behind API Gateway: rate limiting, auth, logging, TLS termination. | ❓ Reuse existing or deploy new? |

---

## 4. DATA SECURITY

| Requirement | Bank X policy (❓) | AI-CRDS design | Gap? |
|-----------|-------------------|---------------|------|
| **Encryption at rest** | ❓ Algorithm? (AES-256 standard) | AES-256 for all databases containing PII. PostgreSQL: pgcrypto or TDE. | ❓ Confirm algorithm |
| **Encryption at transit** | TLS 1.2+ (standard) | All API calls TLS 1.2+. Internal service-to-service: mTLS preferred. | ✅ |
| **Key management** | ❓ HSM? KMS? Who manages keys? | Production keys in HSM or cloud KMS. Dev keys separate from prod. Key rotation: annually or per bank policy. | ❓ Bank X HSM available? |
| **Data masking (non-prod)** | ❓ Bank X policy cho dev/staging? | MVP: synthetic data (no real PII). Staging: masked real data (CCCD → hash, name → pseudonym). Production: real data. | ❓ Confirm masking requirements |
| **Backup policy** | ❓ Frequency? Retention? Encryption? | Audit trail: daily backup. Encrypted. Retained per data lifecycle (5-10 năm). Backup tested quarterly. | ❓ Align with Bank X SOP |
| **Data destruction** | ❓ Bank X secure deletion standard? | When Tầng 1 PII deleted: cryptographic erasure (delete encryption key) or DoD 5220.22-M overwrite. | ❓ |
| **PII in logs** | ❓ Bank X logging policy re: PII? | AI-CRDS application logs: NO PII. Use application_id, customer_hash_id. Never log CCCD, name, income in app logs. | ✅ Design principle |

---

## 5. AUDIT & MONITORING

| Requirement | Bank X policy (❓) | AI-CRDS design | Gap? |
|-----------|-------------------|---------------|------|
| **SIEM integration** | ❓ Bank X has SIEM? (Splunk/QRadar/ELK?) | AI-CRDS security logs feed into bank SIEM. Format: syslog/CEF/JSON. | ❓ Confirm SIEM + format |
| **Intrusion detection** | ❓ IDS/IPS in place? | AI-CRDS behind bank IDS/IPS. Application-level: rate limiting, anomaly detection on login patterns. | ❓ |
| **Security logging** | ❓ Bank X logging requirements? | AI-CRDS logs: (a) Access logs (who accessed what, when). (b) Authentication logs (login/logout/fail). (c) Authorization logs (permission changes). (d) Data access logs (PII access tracked). | ✅ Design principle |
| **Security incident response** | ❓ Bank X SOP for security incidents? | AI-CRDS follows bank SOP. Additional: if AI system compromised → pause AI → fallback to manual. Notify Risk Manager + IT Security. | ❓ Get bank SOP |
| **Penetration testing** | ❓ Required before production? Frequency? | Recommended: pen test before shadow testing (Week 35). Annually thereafter. | ❓ Confirm requirement |
| **Vulnerability scanning** | ❓ Bank X scanning policy? | AI-CRDS: dependency scanning (OWASP), container scanning, code scanning (SAST). Monthly. | ❓ Align with bank schedule |

---

## 6. COMPLIANCE-SPECIFIC SECURITY

| Requirement | Source | AI-CRDS implementation |
|-----------|--------|----------------------|
| **Audit trail immutability** | TT 13/2018, SBV | Append-only database. No UPDATE/DELETE on audit records. Hash chain for tamper detection (future). |
| **24-field audit per decision** | sbv-requirements.md | PostgreSQL table with 24+ mandatory fields. NOT NULL constraints. Write-once. |
| **SBV inspection readiness** | Luật TCTD | Export any decision full trace within 15 minutes. Pre-built SBV report queries. |
| **Breach notification 72h** | NĐ 356/2025 | Process: detect → assess → notify A05 + affected customers within 72h. Pre-drafted notification template. |
| **DPIA security controls** | NĐ 356 Mẫu 10 | Document all security measures in DPIA. This document = source for DPIA security section. |

---

## 7. SECURITY GAP SUMMARY

| # | Gap | Severity | Depends on | Action | Target |
|---|-----|---------|-----------|--------|--------|
| 1 | SSO integration method unknown | 🔴 High | IT meeting | Confirm SSO type. Build adapter. | Week 10 (confirm), Week 20 (build) |
| 2 | MFA requirement unknown | 🟡 Medium | IT meeting | Confirm. Implement if required. | Week 10 |
| 3 | Network architecture unknown | 🔴 High | IT meeting | Confirm hosting, firewall, VPN. | Week 10 |
| 4 | Key management infrastructure unknown | 🟡 Medium | IT meeting | Confirm HSM/KMS availability. | Week 10 |
| 5 | SIEM integration unknown | 🟡 Medium | IT meeting | Confirm SIEM + log format. | Week 10 |
| 6 | Pen test requirement unknown | 🟡 Medium | IT Security | Confirm. Schedule if required (Week 35). | Week 10 |
| 7 | Breach notification process undocumented | 🔴 High | Compliance | Design AI-CRDS specific breach process aligned with bank SOP. | Week 23 |
| 8 | Data destruction method unconfirmed | 🟡 Medium | IT Security | Confirm bank standard. Implement for Tầng 1 PII deletion. | Week 20 |

---

## 8. IT SECURITY MEETING QUESTIONS

| # | Question | Priority |
|---|---------|---------|
| 1 | SSO system type? (AD/LDAP/SAML/OAuth2) | 🔴 |
| 2 | MFA required for internal apps? Method? | 🟡 |
| 3 | Session timeout policy? | 🟡 |
| 4 | Can AI-CRDS be hosted on VN cloud? Or must be on-premise? | 🔴 |
| 5 | Existing API Gateway? Can AI-CRDS use? | 🟡 |
| 6 | HSM or KMS available for key management? | 🟡 |
| 7 | SIEM system? Can AI-CRDS feed logs? | 🟡 |
| 8 | Pen test required before production? When? | 🟡 |
| 9 | Security incident response SOP — can we get a copy? | 🔴 |
| 10 | Any security policies that would BLOCK a Python/FastAPI/PostgreSQL stack? | 🔴 |

---

## Tracking

- [ ] IT Security meeting completed?
- [ ] SSO integration confirmed?
- [ ] Network architecture confirmed?
- [ ] All security gaps (Section 7) addressed?
- [ ] Security section ready for DPIA inclusion?
- [ ] Pen test scheduled (if required)?

---

## Ghi Chú

1. **Security policies are NON-NEGOTIABLE.** AI-CRDS adapts to Bank X security, not the other way around.
2. **"No PII in logs"** is critical design principle. Application logs use IDs only. PII only in audit trail DB (encrypted, access-controlled).
3. **Cross-reference:** pdpd-checklist.md (NHÓM 5 Security), tech-stack-assessment.md (infrastructure), data-flow-diagram.md (PII flows requiring protection), guardrail-definitions.md (G-O4/G-O5 system guardrails).