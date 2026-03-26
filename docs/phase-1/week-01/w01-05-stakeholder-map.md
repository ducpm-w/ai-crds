# Stakeholder Map — AI Credit Risk Decision Support
> **Tags:** `[Product]` `[Business]` `[Governance]`
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)
> **Use case:** Origination Scoring + Fraud Detection Layer
> **Segment:** Retail Credit Card — Salaried
> **Tuần:** Week 1
> **Version:** v1.1 — Applied 3 feedback items (Compliance blocker, CTO metric, Comms KPI ref)

---

## 1. Tổng Quan Stakeholder

```
                        ┌─────────────────┐
                        │   Khách hàng    │
                        │   nộp hồ sơ     │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  Credit Officer │  ← Người dùng chính
                        │  (AI-assisted)  │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
     ┌────────▼───────┐ ┌───────▼────────┐ ┌──────▼──────────┐
     │  Risk Manager  │ │ Head of Cards  │ │   Compliance    │
     │  (NPL owner)   │ │ (P&L owner)    │ │   Officer       │
     └────────────────┘ └────────────────┘ └─────────────────┘
                                 │
                        ┌────────▼────────┐
                        │      CTO / IT   │
                        │  (Integration)  │
                        └─────────────────┘
                                 │
                        ┌────────▼────────┐
                        │      SBV        │
                        │   (Regulator)   │
                        └─────────────────┘
```

---

## 2. Chi Tiết Từng Stakeholder

---

### 2.1 Credit Officer / Credit Analyst
> **Vai trò:** Người dùng chính hàng ngày

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Review hồ sơ, đưa ra recommendation approve/reject/escalate |
| **Báo cáo cho** | Risk Manager / Head of Credit |
| **Lương** | 18–22 triệu VND/tháng *(Glassdoor VN 8/2025; SalaryExplorer VN 2024)* |
| **Volume xử lý hiện tại** | ~40–60 hồ sơ/ngày (manual) |
| **Pain point** | Quá tải khi volume tăng, 70% thời gian dành cho data gathering thay vì judgment *(Fluxforce/McKinsey, 12/2025)* |
| **Kỳ vọng với AI** | AI giảm thời gian thu thập data, đưa ra risk score + lý do rõ ràng để quyết định nhanh hơn |
| **Rủi ro adoption** | Không tin AI → override hết → system vô nghĩa. Tin quá → không catch errors |
| **Success metric** | Xử lý được 80–100 hồ sơ/ngày thay vì 40–60 |

---

### 2.2 Risk Manager / Head of Credit
> **Vai trò:** Economic buyer — người có động lực mua nhất

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Chịu trách nhiệm NPL ratio toàn danh mục, approve credit policy và threshold |
| **Báo cáo cho** | C-level (CEO/CFO) |
| **Pain point** | NPL tăng → phải tăng provision → ăn vào lợi nhuận. Chỉ 4 ngân hàng duy trì tỷ lệ phủ nợ xấu >100% *(VIR, 3/2025)* |
| **Kỳ vọng với AI** | Giảm NPL ratio, tăng consistency trong credit decision, có audit trail đầy đủ cho SBV |
| **Quyết định** | Approve threshold, credit policy, escalation rules trong AI system |
| **Success metric** | NPL giữ nguyên hoặc giảm khi tăng volume và tốc độ duyệt |

---

### 2.3 Head of Cards / Business Owner
> **Vai trò:** Budget owner — người quyết định mua SaaS

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Chịu P&L mảng thẻ, chịu target phát hành và revenue |
| **Báo cáo cho** | CEO / CFO |
| **Pain point** | Phải tăng approval rate và tốc độ phát hành để đạt target, nhưng nếu approve nhầm → NPL tăng → P&L xấu |
| **Kỳ vọng với AI** | Tăng approval rate mà không tăng NPL, giảm time-to-decision để cạnh tranh với BNPL/fintech |
| **Quyết định** | Approve budget mua SaaS, set business KPI cho system |
| **Tension** | Business muốn approve nhiều hơn ↔ Risk muốn thận trọng hơn → AI phải balance được |
| **Success metric** | Approval rate +5–15% mà NPL không tăng |

---

### 2.4 Compliance Officer
> **Vai trò:** Blocker nếu không comply — phải thuyết phục sớm

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Đảm bảo mọi quyết định credit tuân thủ SBV, PDPD, và internal policy |
| **Báo cáo cho** | Chief Compliance Officer / Board |
| **Pain point** | PDPD có hiệu lực 1/2026 *(IFLR, 9/2025)* — compliance không còn là nice-to-have. SBV siết audit trail cho automated decisions |
| **Kỳ vọng với AI** | Explainable decisions, audit trail đầy đủ, adverse action notice cho khách bị từ chối, data residency comply PDPD |
| **Blocker conditions** | Không có audit trail → block. Không giải thích được lý do từ chối → block. Data lưu nước ngoài không có legal basis → block. Không có model documentation (explainability, feature list, bias audit) → block |
| **Success metric** | Pass SBV audit, không có PDPD violation |

---

### 2.5 CTO / IT Team
> **Vai trò:** Technical gatekeeper — blocker nếu integration phức tạp

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Chịu trách nhiệm integration với Core Banking, security, và uptime |
| **Pain point** | Integration với Core Banking (T24, Flexcube, homegrown) thường phức tạp và tốn thời gian. Security audit trước khi approve production deployment |
| **Kỳ vọng với AI** | API đơn giản, documentation đầy đủ, security đạt chuẩn banking, SLA rõ ràng |
| **Blocker conditions** | Security không đạt → block. Integration quá phức tạp → block. No SLA commitment → block |
| **Success metric** | Integration hoàn thành trong timeline, uptime >99.5%, pass security audit, không incident nghiêm trọng (P1/P2) trong 3 tháng đầu |

---

### 2.6 Khách Hàng Vay (End User)
> **Vai trò:** Người chịu ảnh hưởng trực tiếp bởi quyết định AI

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Người nộp hồ sơ, chờ quyết định approve/reject |
| **Pain point** | Approval time 3–7 ngày trong khi BNPL approve trong phút → bỏ sang đối thủ |
| **Kỳ vọng** | Quyết định nhanh, lý do từ chối rõ ràng nếu bị reject |
| **Quyền theo PDPD** | Có quyền biết lý do từ chối (adverse action notice), quyền yêu cầu human review |
| **Rủi ro nếu AI sai** | Bị reject nhầm → mất cơ hội tín dụng, có thể khiếu nại |
| **Context cạnh tranh** | BNPL tăng CAGR 58.3% (2021–2024), đạt $2.6B năm 2025 *(PayNXT360)* — cạnh tranh trực tiếp |

---

### 2.7 SBV — State Bank of Vietnam
> **Vai trò:** Regulator — không phải user nhưng define luật chơi

| Mục | Nội dung |
|-----|---------|
| **Vai trò** | Giám sát toàn bộ hoạt động tín dụng, ban hành quy định |
| **Yêu cầu liên quan** | AI không được là decision maker cuối — bắt buộc human-in-the-loop |
| **Audit requirements** | Mọi credit decision phải có audit trail đầy đủ: ai quyết định, dựa trên data gì, lúc nào |
| **Framework mới** | Nghị định 94/2025: sandbox cho credit scoring, open API *(IFLR, 9/2025)* |
| **Rủi ro không comply** | Bị phạt, bị yêu cầu dừng hệ thống, mất deal với bank partner |

---

## 3. Influence & Interest Matrix

```
                    HIGH INTEREST
                          │
          Compliance ─────┼───── Risk Manager
          Officer         │      Head of Cards
                          │
LOW       ────────────────┼──────────────────  HIGH
INFLUENCE                 │                    INFLUENCE
                          │
          Khách hàng ─────┼───── CTO / IT
          vay             │      Credit Officer
                          │
                    LOW INTEREST
```

**Quadrant mapping:**

| Quadrant | Stakeholder | Chiến lược |
|---------|-------------|-----------|
| High Influence + High Interest | Risk Manager, Head of Cards | Engage chặt, update thường xuyên |
| High Influence + Low Interest | CTO / IT, Credit Officer | Keep satisfied, giải quyết technical blockers sớm |
| Low Influence + High Interest | Compliance Officer | Keep informed, address compliance concerns trước |
| Low Influence + Low Interest | Khách hàng vay | Monitor, ensure adverse action notice đầy đủ |

---

## 4. Accountability Map

> Câu hỏi cốt lõi: **Khi AI sai, ai chịu trách nhiệm?**
> Theo SBV requirement: AI chỉ là decision support — human phải là final decision maker.

| Tình huống | Người chịu trách nhiệm | Ghi chú |
|-----------|----------------------|---------|
| AI approve nhầm → khách default | Credit Officer (ký approval) + Risk Manager (policy owner) | AI chỉ recommend — Credit Officer là người ký |
| AI reject nhầm → lost revenue | Head of Cards (P&L owner) | Credit Officer có thể override nếu có lý do |
| AI confident cao nhưng sai | Risk Manager → review threshold và policy | Threshold do Risk Manager set và approve |
| System downtime → delay decision | CTO / IT (SLA owner) | Cần fallback manual process |
| PDPD violation → data breach | Compliance Officer + CTO | Data handling responsibility |
| Bias trong AI decision | Risk Manager + Compliance Officer | Bias monitoring là governance responsibility |
| Khách khiếu nại bị reject sai | Compliance Officer xử lý → Credit Officer review lại | Adverse action notice phải đầy đủ |
| SBV audit → không có audit trail | CTO (system) + Compliance Officer (process) | Audit trail là non-negotiable |

---

## 5. Human-in-the-Loop Requirement

Theo SBV và thiết kế AI-CRDS:

```
Khách hàng nộp hồ sơ
        │
        ▼
AI scoring + fraud detection
        │
        ▼
   ┌────┴────┐
   │         │
High        Low/Medium
confidence  confidence
   │         │
   ▼         ▼
Auto-route  Credit Officer
to approve  review
or reject   │
            ▼
        Final decision
        (Human signs)
            │
            ▼
        Audit log
        ghi nhận:
        - AI recommendation
        - Human decision
        - Lý do nếu override
        - Timestamp
        - Model version
```

**Nguyên tắc bất biến:**
- AI **không bao giờ** là final decision maker
- Mọi quyết định đều có human owner
- Override phải được log với lý do
- Adverse action notice bắt buộc khi reject

---

## 6. Stakeholder Communication Plan

| Stakeholder | Frequency | Channel | Nội dung |
|------------|-----------|---------|---------|
| Credit Officer | Daily | In-app dashboard | Performance metrics, queue status |
| Risk Manager | Weekly | Report | NPL signals, threshold performance, override rate |
| Head of Cards | Bi-weekly | Dashboard + brief | Approval rate, time-to-decision, revenue impact |
| Compliance Officer | Monthly | Compliance report | Audit trail summary, PDPD compliance status |
| CTO / IT | As needed | Technical docs | API updates, incident reports, SLA status |
| SBV | On request | Formal report | Full audit trail, model documentation |

*Nội dung report kèm KPI metrics cụ thể — chi tiết metric definitions và công thức sẽ được thiết kế tại Week 7 (KPI Tree).*

---

## Ghi Chú

- Stakeholder map này sẽ được validate và cập nhật khi có bank partner cụ thể (Week 13+)
- Lương Credit Analyst: Glassdoor VN 8/2025 (13 mẫu, median ~18.3M); SalaryExplorer VN Banking 2024 (median ~21.7M)
- Influence/Interest matrix là ước tính — có thể khác nhau giữa digital bank vs traditional bank
- Accountability map cần được confirm với bank legal team trước khi pilot (Week 40)