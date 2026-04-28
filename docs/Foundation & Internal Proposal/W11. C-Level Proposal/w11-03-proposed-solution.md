# Proposed Solution — AI-Native CRDS
> **Dự án:** AI-Native Credit Risk Decision Support
> **File:** 03/07 — Internal Proposal
> **Ngày:** 09/04/2026

---

## 1. AI-CRDS LÀ GÌ

AI-Native CRDS là hệ thống **hỗ trợ quyết định tín dụng**, tích hợp AI scoring + fraud detection cho CC retail salaried tại Bank X.

**Không phải auto-approval.** AI đưa ra recommendation — Credit Officer xem xét, ký quyết định cuối cùng. Human-in-the-loop bắt buộc theo Luật TCTD 2024 và Luật AI 134/2025.

| Attribute | Detail |
|-----------|--------|
| **Scope** | CC origination — retail salaried segment |
| **Function** | Credit scoring + Fraud detection + Explainability + Audit trail |
| **Decision maker** | Credit Officer (luôn luôn) |
| **AI role** | Decision support — score, explain, recommend |
| **Compliance** | Yêu cầu SBV, Luật AI 134/2025, Luật BVDLCN 91/2025 |

---

## 2. CÁCH HOẠT ĐỘNG (Simplified)

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Hồ sơ    │───▶│ AI đánh  │───▶│ CO xem   │───▶│ Kết quả  │
│ nộp vào  │    │ giá <30s │    │ + quyết  │    │ + thông  │
│          │    │          │    │ định     │    │ báo      │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │
              ┌──────┴──────┐
              │ AI outputs: │
              │ • Risk score│
              │ • Fraud flag│
              │ • Top 3 lý  │
              │   do (plain │
              │   language) │
              │ • Recommend │
              │ • Confidence│
              └─────────────┘
```

**5 decision states** (thay vì 1 queue duy nhất):

| State | % Volume | CO Time | Mô tả |
|-------|---------|---------|-------|
| Auto-route approve | 35-45% | 3-5 phút | Score cao, confidence cao → CO batch confirm |
| Standard review | 25-35% | 20-35 phút | Score trung bình → CO full review |
| Priority fraud | 2-5% | 45 phút | Fraud signal → Senior CO/Fraud team |
| Escalate | 5-10% | 45 phút | AI uncertain → Senior CO |
| Need-more-info | 8-15% | 10 phút | Data thiếu → yêu cầu bổ sung |

**Kết quả:** Thời gian quyết định giảm từ 1-7 ngày → dưới 1 ngày. CO capacity giảm từ 10 FTE → 4.3 FTE.

---

## 3. TẠI SAO BUILD IN-HOUSE

| Tiêu chí | Build In-house | Mua Vendor (FICO/local) |
|----------|---------------|----------------------|
| **Chi phí 3 năm** | 8-14 tỷ | 14-27 tỷ |
| **IP ownership** | ✅ 100% Bank X | ❌ Vendor sở hữu |
| **Dữ liệu** | ✅ Tận dụng CBS, CIC, transaction history | ⚠️ Vendor không access internal data |
| **Regulatory fit** | ✅ Built cho VN (Luật AI, BVDLCN, SBV) | ⚠️ Cần adapt cho VN |
| **Explainability** | ✅ Full transparency | ⚠️ Black box risk |
| **Customization** | ✅ Full control | ⚠️ Vendor roadmap |
| **Time to deploy** | ⚠️ 8-12 tháng | ✅ 4-8 tháng |

**Recommendation:** Build in-house. Chi phí thấp hơn, IP ownership, regulatory fit tốt hơn. Trade-off: chậm hơn vendor 4 tháng — acceptable vì Phase 0 = shadow testing (không ảnh hưởng operations).

---

## 4. PHASED APPROACH — Không all-or-nothing

```
Phase 0              Phase 1                Phase 2
SHADOW TESTING       LIMITED DEPLOYMENT     FULL DEPLOYMENT
8 tuần               16 tuần               Ongoing
365M VND             1.32 tỷ               2-4 tỷ/năm

AI chỉ quan sát      AI recommend,          AI live toàn bộ
Không ảnh hưởng      CO review all.         CC origination.
quyết định thật.     Subset applications.   Full monitoring.

Risk: ~0             Risk: Low              Risk: Managed
───────────────── ── ─────────────────── ── ──────────────────
     GATE 0→1             GATE 1→2              GATE 2→SCALE
     Shadow test          Limited deploy        90-day impact
     results OK?          results OK?           report OK?
     
     FAIL → STOP          FAIL → STOP           Continue + expand
     Sunk: 365M           Sunk: 1.68 tỷ
```

**Kill switch tại mỗi gate.** Không commit budget tiếp nếu gate trước không pass. Maximum downside = Phase 0 budget (365M).

---

## 5. COMPLIANCE — SẴN SÀNG TỪ ĐẦU

| Requirement | AI-CRDS Status |
|------------|---------------|
| **Human-in-the-loop** (Luật TCTD + Luật AI) | ✅ CO ký mọi quyết định. AI chỉ recommend. |
| **AI labeling** (Luật AI 134/2025) | ✅ "Quyết định được hỗ trợ bởi AI" hiển thị trên mọi output. |
| **Explainability** (NĐ 356 Đ.9) | ✅ Top 3 lý do, plain language. Khách hiểu tại sao bị từ chối. |
| **Right to human review** (NĐ 356) | ✅ Khách có quyền yêu cầu CO khác review không dùng AI. |
| **Opt-out AI** (NĐ 356) | ✅ Khách có quyền chọn xử lý 100% thủ công. |
| **Audit trail** (TT 13 + SBV) | ✅ 24 fields, immutable, SBV inspection ready (<15 phút). |
| **DPIA** (NĐ 356 Đ.19) | ⚠️ Draft ready. Finalize trước shadow testing. |
| **Bias monitoring** (Luật AI Đ.4) | ✅ Gender/geography/age approval rate gaps monitored. |
| **Data residency** | ✅ Đề xuất VN cloud. Không cross-border. |

**Ghi chú:** Các trích dẫn “NĐ 356/2025”, “TT 13”, … là ký hiệu nội bộ trong bộ tài liệu này; sẽ được rà soát và chuẩn hoá theo văn bản pháp quy chính thức khi làm hồ sơ compliance ở Phase 0.
