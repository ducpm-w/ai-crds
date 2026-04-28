# PDPD Compliance Checklist — AI-CRDS
> **Tags:** `[Compliance]` `[Legal]` `[PDPD]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 10
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Checklist theo Luật BVDLCN 91/2025 + NĐ 356/2025 + Luật AI 134/2025. Dùng cho DPIA preparation và compliance gate trước khi dùng real customer data (Week 37).

**Timeline:** DPIA phải submit A05 trước Week 29 (60 ngày trước shadow testing Week 37).

---

## NHÓM 1: LEGAL BASIS — Cơ sở pháp lý xử lý DLCN

| # | Requirement | Status | Detail | Action needed | Target |
|---|-----------|--------|--------|-------------|--------|
| 1.1 | **Consent form** nêu rõ mục đích chấm điểm tín dụng bằng AI | ❌ Chưa | Consent phải nêu: (a) mục đích, (b) loại DLCN thu thập, (c) AI involvement, (d) quyền khách hàng | Design consent form. Wording review bởi Legal. | Week 11 (draft), Week 23 (final) |
| 1.2 | Consent **tách biệt** với T&C chung | ❌ Chưa | NĐ 356: consent cho xử lý DLCN phải riêng, không gộp vào T&C | Thiết kế consent flow riêng (opt-in checkbox riêng cho AI scoring) | Week 11 |
| 1.3 | Consent **lưu trữ**: format, nơi lưu, retention | ❌ Chưa | Lưu: consent timestamp, version, method (app/branch/online), content | Database table: `consent_records`. Retention: suốt quan hệ KH + 3 năm sau. | Week 12 (schema), Week 20 (build) |
| 1.4 | **Withdrawal mechanism**: khách rút consent | ❌ Chưa | Luật BVDLCN: khách có quyền rút consent bất kỳ lúc nào. Rút consent → stop AI scoring → route 100% manual (State 2, opt-out flow). | Design withdrawal flow. Connect to opt-out AI mechanism (exception-flow.md EX-6). | Week 20 |
| 1.5 | **Consent cho PII-S** (nhạy cảm) riêng biệt | ❌ Chưa | NĐ 356: DLCN nhạy cảm (thu nhập, nợ, tín dụng) cần consent riêng | Thiết kế layered consent: Tầng 1 (PII-B basic), Tầng 2 (PII-S sensitive cho AI scoring) | Week 11 |

**Compliance status: 0/5 ❌**

---

## NHÓM 2: DPIA — Đánh giá tác động xử lý DLCN

| # | Requirement | Status | Detail | Action needed | Target |
|---|-----------|--------|--------|-------------|--------|
| 2.1 | **DPIA template** (Mẫu 10 NĐ 356) đã soạn | ⚠️ Framework done | pdpd-impact-assessment.md v1.1 có framework. Chưa hoàn chỉnh theo Mẫu 10. | Chuyển pdpd-impact-assessment.md → format Mẫu 10 chính thức | Week 23 |
| 2.2 | DPIA **identify tất cả PII types** | ✅ Done | data-flow-diagram.md: 20 fields classified (PII-B, PII-S, BIO, DRV, ANON) | Review + update nếu có thêm fields | Ongoing |
| 2.3 | DPIA **assess risk per PII type** | ⚠️ Partial | pdpd-impact-assessment.md §6.4: 9 risks identified. Cần expand per field. | Detail risk per each of 20 fields | Week 23 |
| 2.4 | DPIA **submission plan**: nộp A05 | ❌ Chưa | NĐ 356 Điều 19: nộp cho Bộ Công an (A05) trong 60 ngày từ khi bắt đầu xử lý. Shadow testing Week 37 = "bắt đầu xử lý" real data → submit trước Week 29. | Schedule: finalize Week 23, legal review Week 25-27, submit Week 29. | Week 29 |
| 2.5 | **Biện pháp bảo vệ** per risk documented | ❌ Chưa | Mẫu 10 yêu cầu: mỗi risk → biện pháp giảm thiểu + effectiveness assessment | Document per risk in DPIA | Week 23 |

**Compliance status: 1/5 ✅, 2/5 ⚠️, 2/5 ❌**

---

## NHÓM 3: DATA SUBJECT RIGHTS — Quyền chủ thể dữ liệu

| # | Requirement | Status | Detail | Action needed | Target |
|---|-----------|--------|--------|-------------|--------|
| 3.1 | **Right to access**: khách xem data | ❌ Chưa | Luật BVDLCN Điều 13: chủ thể có quyền truy cập DLCN của mình. AI-CRDS cần: endpoint/process cho khách request xem data bank giữ. | Design data access request flow. Define: what data shown? Format? Channel? | Week 20 |
| 3.2 | **Right to explanation**: adverse action notice | ✅ Done | adverse-action-template.md: 3 templates, 19 reasons, AI label, rights info. NĐ 356 Điều 9 + Luật AI 134/2025: giải thích quyết định tự động. | Review templates với Legal | Week 11 |
| 3.3 | **Right to opt-out**: 100% manual option | ✅ Done | exception-flow.md EX-6: customer opt-out AI → State 2 (100% manual). adverse-action-flow.md §7: opt-out flow pre-application + post-rejection. | Validate flow with Compliance | Week 11 |
| 3.4 | **Right to deletion**: process khi khách yêu cầu xóa | ⚠️ Framework done | pdpd-impact-assessment.md v1.1 §4.4: Tiered Data Lifecycle. decision-architecture.md: terminal state retention. 7-step deletion workflow. | Implement deletion workflow. Legal confirm "nghĩa vụ pháp luật" exception cho Tầng 2. | Week 20 (implement), Week 23 (legal confirm) |
| 3.5 | **Right to correction**: sửa data sai | ❌ Chưa | Luật BVDLCN Điều 14: chủ thể có quyền yêu cầu sửa DLCN sai. Nếu CIC data sai → khách dispute trực tiếp CIC. Nếu bank data sai → correction process. | Design data correction request flow | Week 20 |
| 3.6 | **Right to portability**: export data | ❌ Chưa | Luật BVDLCN Điều 16: chủ thể có quyền nhận DLCN dạng có thể đọc được. Format: JSON/CSV. | Design data export function. Define scope: what data exportable? | Week 20 |
| 3.7 | **Right to complain**: khiếu nại | ✅ Done | adverse-action-flow.md §5: 5-type complaint handling. escalation-tree.md §7: complaint escalation. Contact info in adverse action notices. | Validate with Compliance | Week 11 |

**Compliance status: 3/7 ✅, 1/7 ⚠️, 3/7 ❌**

---

## NHÓM 4: DATA RESIDENCY — Dữ liệu lưu ở đâu

| # | Requirement | Status | Detail | Action needed | Target |
|---|-----------|--------|--------|-------------|--------|
| 4.1 | **Data residency decision** | ⚠️ Proposed | pdpd-impact-assessment.md §5: 3 options analyzed. Recommendation: VN cloud (Viettel/FPT). Avoid cross-border complexity. | ❓ Confirm với IT team. Nếu VN cloud → no XLBG needed. | Week 10 (IT meeting) |
| 4.2 | **Cross-border transfer assessment** | ⚠️ Conditional | Nếu VN cloud → không applicable. Nếu foreign cloud → Mẫu 09 + thông báo A05 cần. | Depends on 4.1 decision | Week 10 |
| 4.3 | **eKYC data residency** | ❓ Unknown | eKYC provider processes BIO data ở đâu? VN server hay foreign? | Confirm với eKYC provider. Include in vendor DPA. | Week 10 |

**Compliance status: 0/3 ✅, 2/3 ⚠️, 1/3 ❓**

---

## NHÓM 5: SECURITY — Bảo mật dữ liệu

| # | Requirement | Status | Detail | Action needed | Target |
|---|-----------|--------|--------|-------------|--------|
| 5.1 | **Encryption at rest** | ❓ | Database encryption. AES-256 recommended. | Confirm Bank X standard. Implement for AI-CRDS DB. | Week 20 |
| 5.2 | **Encryption in transit** | ⚠️ Standard | TLS 1.2+ cho tất cả API calls. Standard practice. | Confirm: all integrations (CBS, CIC, eKYC) use TLS. | Week 10 |
| 5.3 | **Access control (RBAC)** | ⚠️ Designed | decision-architecture.md: role-based access. override-governance.md: authority matrix. | Implement RBAC in AI-CRDS. Align with Bank X IAM. | Week 20 |
| 5.4 | **Breach notification** (72h) | ❌ Chưa | NĐ 356 Điều 25: thông báo vi phạm DLCN trong 72 giờ cho A05 + chủ thể. | Design breach notification process. Align with Bank X existing incident response. | Week 23 |
| 5.5 | **Data masking** in non-prod | ❌ Chưa | Dev/staging environments KHÔNG được dùng real PII. Synthetic data (synthetic-data-plan.md) cho MVP. Real data chỉ production. | Implement data masking pipeline cho non-prod. | Week 20 |
| 5.6 | **Backup encryption** | ❓ | Backup phải encrypted. Key management separate from data. | Confirm Bank X backup policy. Align AI-CRDS. | Week 20 |
| 5.7 | **Key management** | ❓ | HSM (Hardware Security Module) cho production keys? Bank X policy? | Confirm with IT security team. | Week 10 |

**Compliance status: 0/7 ✅, 2/7 ⚠️, 2/7 ❌, 3/7 ❓**

---

## NHÓM 6: AI-SPECIFIC — Luật AI 134/2025 + NĐ 356 Điều 9

| # | Requirement | Status | Detail | Action needed | Target |
|---|-----------|--------|--------|-------------|--------|
| 6.1 | **Automated decision disclosure** | ✅ Done | Consent form + adverse action notice + AI label: "hỗ trợ bởi AI." adverse-action-template.md. | Legal review wording | Week 11 |
| 6.2 | **Algorithm explanation** (plain language) | ✅ Done | adverse-action-template.md: 19 reasons library, top 3 per rejection, plain language. SHAP-based explanation design. | Validate with CO (understandable?) | Week 12 |
| 6.3 | **Opt-out automated scoring** | ✅ Done | exception-flow.md EX-6: opt-out mechanism pre-application + post-rejection. | Implement in application form | Week 12 |
| 6.4 | **Human review right** | ✅ Done | adverse-action-flow.md §3.3 + §7.2: right to human review (different CO, AI hidden). SLA ≤ 8 BD. | Implement complaint handling flow | Week 20 |
| 6.5 | **AI label** on all AI-involved outputs | ✅ Done | ux-wireframes-notes.md: persistent AI label top of screen. adverse-action-template.md: label in all notices. | Implement in UI + notification templates | Week 12 |
| 6.6 | **Bias monitoring** | ⚠️ Designed | guardrail-definitions.md: G-C4/C5/C6 bias guardrails (gender ≤5pp, geography ≤8pp, age ≤10pp). kpi-tree.md: L3-C4/C5/C6 metrics. | Implement monitoring dashboard. Define remediation process. | Week 23 |
| 6.7 | **AI risk classification** (Luật AI Điều 9) | ⚠️ Pending | sbv-requirements.md v1.1 §5.3: AI-CRDS = likely "rủi ro cao." Danh mục do Thủ tướng ban hành (target 02/2026). | Monitor: đã ban hành chưa? Nếu có → assess requirements cho "rủi ro cao." | Ongoing |

**Compliance status: 5/7 ✅, 2/7 ⚠️**

---

## NHÓM 7: DPO — Data Protection Officer

| # | Requirement | Status | Detail | Action needed | Target |
|---|-----------|--------|--------|-------------|--------|
| 7.1 | **DPO assigned** at Bank X | ❓ | NĐ 356 Điều 28: bên kiểm soát DLCN (bank) phải chỉ định DPO. | Confirm với HR: Bank X có DPO chưa? Ai? | Week 10 |
| 7.2 | **DPO qualifications** | ❓ | NĐ 356: trình độ cao đẳng+, kinh nghiệm 2 năm+, được đào tạo về BVDLCN. | Confirm DPO qualifications meet NĐ 356. | Week 10 |
| 7.3 | **DPO contact** published internally | ❓ | DPO contact phải known internally cho data protection queries. | Confirm + publish DPO contact for AI-CRDS team. | Week 10 |
| 7.4 | **DPO involved in DPIA** | ❌ Chưa | DPO should review DPIA before submission. | Include DPO in DPIA review process. Schedule review Week 25. | Week 25 |

**Compliance status: 0/4 ✅, 0/4 ⚠️, 1/4 ❌, 3/4 ❓**

---

## OVERALL COMPLIANCE DASHBOARD

| Nhóm | Total items | ✅ Done | ⚠️ Partial | ❌ Not started | ❓ Unknown |
|------|-----------|--------|-----------|-------------|----------|
| 1. Legal Basis | 5 | 0 | 0 | 5 | 0 |
| 2. DPIA | 5 | 1 | 2 | 2 | 0 |
| 3. Data Subject Rights | 7 | 3 | 1 | 3 | 0 |
| 4. Data Residency | 3 | 0 | 2 | 0 | 1 |
| 5. Security | 7 | 0 | 2 | 2 | 3 |
| 6. AI-Specific | 7 | 5 | 2 | 0 | 0 |
| 7. DPO | 4 | 0 | 0 | 1 | 3 |
| **TOTAL** | **38** | **9 (24%)** | **9 (24%)** | **13 (34%)** | **7 (18%)** |

**Assessment: 24% complete.** AI-specific items strongest (Luật AI design done). Legal basis + security + DPO weakest (need bank partner input).

### DPIA Timeline

```
Week 10 ── DPIA draft started (this document + pdpd-impact-assessment.md)
Week 12 ── MVP (synthetic data — DPIA not blocking)
Week 23 ── DPIA finalized (Mẫu 10 format). Legal review.
Week 25 ── DPO review
Week 27 ── Final DPIA approved
Week 29 ── Submit A05 (Bộ Công an)
Week 37 ── Shadow testing with real data ← PDPD compliant ✅
```

---

## Tracking

- [ ] DPO at Bank X confirmed?
- [ ] Consent form draft started?
- [ ] Data residency decision confirmed with IT?
- [ ] DPIA Mẫu 10 template obtained from Legal/Compliance?
- [ ] Breach notification process aligned with Bank X SOP?
- [ ] All ❓ items resolved after IT + Compliance meetings?

---

## Ghi Chú

1. **DPIA phải submit A05 trước Week 29** — non-negotiable timeline nếu shadow testing planned Week 37.
2. **MVP Week 12 dùng synthetic data** → DPIA chưa cần hoàn chỉnh. Nhưng framework phải ready.
3. **Cross-reference:** pdpd-impact-assessment.md (detailed analysis), sbv-requirements.md (Luật AI section), data-flow-diagram.md (PII flows), adverse-action-template.md (rights implementation), exception-flow.md (opt-out implementation).