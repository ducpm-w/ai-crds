# Stakeholder Map — AI Credit Risk Decision Support
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## 1. Tổng quan stakeholder

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

## 2. Chi tiết từng stakeholder

Các chỉ số vận hành của Bank X trong mục này (khối lượng hồ sơ, mức tăng năng suất) là giả định lập kế hoạch và sẽ được thay bằng dữ liệu thực của Bank X khi có.

---

### 2.1 Credit Officer / Credit Analyst
> **Vai trò:** Người dùng chính hàng ngày

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Review hồ sơ, đưa ra recommendation approve/reject/escalate |
| **Báo cáo cho** | Risk Manager / Head of Credit |
| **Lương** | 18–22 triệu VND/tháng *(Glassdoor VN 8/2025; SalaryExplorer VN 2024)* |
| **Volume xử lý hiện tại** | Khoảng 40–60 hồ sơ/ngày (manual, giả định) |
| **Pain point** | Quá tải khi volume tăng, 70% thời gian dành cho data gathering thay vì judgment *(Fluxforce/McKinsey, 12/2025)* |
| **Kỳ vọng với AI** | AI giảm thời gian thu thập data, đưa ra risk score + lý do rõ ràng để quyết định nhanh hơn |
| **Rủi ro adoption** | Nếu không tin hệ thống, Credit Officer override toàn bộ khuyến nghị và hệ thống không tạo giá trị; nếu tin quá mức thì không phát hiện được sai sót |
| **Success metric** | Xử lý 80–100 hồ sơ/ngày thay vì 40–60 |

---

### 2.2 Risk Manager / Head of Credit
> **Vai trò:** Người đề xuất giải pháp — có động lực lớn nhất

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Chịu trách nhiệm NPL ratio toàn danh mục, approve credit policy và threshold |
| **Báo cáo cho** | C-level (CEO/CFO) |
| **Pain point** | NPL tăng khiến phải tăng provision và làm giảm lợi nhuận. Chỉ 4 ngân hàng duy trì tỷ lệ phủ nợ xấu >100% *(VIR, 3/2025)* |
| **Kỳ vọng với AI** | Giảm NPL ratio, tăng consistency trong credit decision, có audit trail đầy đủ cho SBV |
| **Quyết định** | Approve threshold, credit policy, escalation rules trong AI system |
| **Success metric** | NPL giữ nguyên hoặc giảm khi tăng volume và tốc độ duyệt |

---

### 2.3 Head of Cards / Business Owner
> **Vai trò:** Chủ sở hữu ngân sách — người quyết định đầu tư

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Chịu P&L mảng thẻ, chịu target phát hành và revenue |
| **Báo cáo cho** | CEO / CFO |
| **Pain point** | Phải tăng approval rate và tốc độ phát hành để đạt target, nhưng nếu approve nhầm thì NPL tăng và P&L giảm |
| **Kỳ vọng với AI** | Tăng approval rate mà không tăng NPL, giảm time-to-decision để cạnh tranh với BNPL/fintech |
| **Quyết định** | Phê duyệt ngân sách, đặt business KPI cho hệ thống |
| **Cân bằng cần đạt** | Bên kinh doanh muốn approve nhiều hơn, bên rủi ro muốn thận trọng hơn; AI-CRDS cần cân bằng được hai yêu cầu này |
| **Success metric** | Approval rate +5–15% mà NPL không tăng |

---

### 2.4 Compliance Officer
> **Vai trò:** Đảm bảo tuân thủ — tham gia từ giai đoạn thiết kế

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Đảm bảo mọi quyết định credit tuân thủ SBV, PDPD, và internal policy |
| **Báo cáo cho** | Chief Compliance Officer / Board |
| **Pain point** | PDPD có hiệu lực 1/2026 *(IFLR, 9/2025)* — tuân thủ là yêu cầu bắt buộc. SBV siết audit trail cho automated decisions |
| **Kỳ vọng với AI** | Explainable decisions, audit trail đầy đủ, adverse action notice cho khách bị từ chối, data residency comply PDPD |
| **Điều kiện bắt buộc** | Audit trail đầy đủ; giải thích được lý do từ chối; dữ liệu lưu nước ngoài phải có cơ sở pháp lý; có tài liệu mô hình (explainability, danh sách feature, bias audit) |
| **Success metric** | Pass SBV audit, không có PDPD violation |

---

### 2.5 CTO / IT Team
> **Vai trò:** Chịu trách nhiệm kỹ thuật — tích hợp, bảo mật, vận hành

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Chịu trách nhiệm integration với Core Banking, security, và uptime |
| **Pain point** | Integration với Core Banking (T24, Flexcube, homegrown) thường phức tạp và tốn thời gian. Security audit trước khi approve production deployment |
| **Kỳ vọng với AI** | API đơn giản, documentation đầy đủ, security đạt chuẩn banking, SLA rõ ràng |
| **Điều kiện bắt buộc** | Đạt chuẩn bảo mật; tích hợp trong phạm vi đã thống nhất; có cam kết SLA |
| **Success metric** | Integration hoàn thành trong timeline, uptime >99.5%, pass security audit, không incident nghiêm trọng (P1/P2) trong 3 tháng đầu |

---

### 2.6 Khách Hàng Vay (End User)
> **Vai trò:** Người chịu ảnh hưởng trực tiếp bởi quyết định AI

| Mục | Nội dung |
|-----|---------|
| **Vai trò trong credit decision** | Người nộp hồ sơ, chờ quyết định approve/reject |
| **Pain point** | Approval time 3–7 ngày trong khi BNPL approve trong phút nên khách hàng chuyển sang đối thủ |
| **Kỳ vọng** | Quyết định nhanh, lý do từ chối rõ ràng nếu bị reject |
| **Quyền theo PDPD** | Có quyền biết lý do từ chối (adverse action notice), quyền yêu cầu human review |
| **Rủi ro nếu AI sai** | Bị reject nhầm → mất cơ hội tín dụng, có thể khiếu nại |
| **Context cạnh tranh** | BNPL tăng CAGR 58.3% (2021–2024), đạt $2.6B năm 2025 *(PayNXT360)* — cạnh tranh trực tiếp |

---

### 2.7 SBV — State Bank of Vietnam
> **Vai trò:** Cơ quan quản lý — không phải người dùng nhưng đặt khuôn khổ quy định

| Mục | Nội dung |
|-----|---------|
| **Vai trò** | Giám sát toàn bộ hoạt động tín dụng, ban hành quy định |
| **Yêu cầu liên quan** | AI không được là decision maker cuối — bắt buộc human-in-the-loop |
| **Audit requirements** | Mọi credit decision phải có audit trail đầy đủ: ai quyết định, dựa trên data gì, lúc nào |
| **Framework mới** | Nghị định 94/2025: sandbox cho credit scoring, open API *(IFLR, 9/2025)* |
| **Hệ quả nếu không tuân thủ** | Bị xử phạt hoặc bị yêu cầu dừng hệ thống |

---

## 3. Ma trận Influence & Interest

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
| High Influence + High Interest | Risk Manager, Head of Cards | Làm việc chặt chẽ, cập nhật thường xuyên |
| High Influence + Low Interest | CTO / IT, Credit Officer | Đảm bảo hài lòng, giải quyết sớm các vấn đề kỹ thuật |
| Low Influence + High Interest | Compliance Officer | Thông tin đầy đủ, xử lý các yêu cầu tuân thủ trước |
| Low Influence + Low Interest | Khách hàng vay | Theo dõi, đảm bảo adverse action notice đầy đủ |

---

## 4. Accountability Map

> Khi AI-CRDS đưa khuyến nghị sai, trách nhiệm thuộc về ai?
> Theo yêu cầu của SBV, AI chỉ là công cụ hỗ trợ quyết định và con người là người ra quyết định cuối cùng.

| Tình huống | Người chịu trách nhiệm | Ghi chú |
|-----------|----------------------|---------|
| AI approve nhầm, khách default | Credit Officer (ký approval) + Risk Manager (policy owner) | AI chỉ khuyến nghị, Credit Officer là người ký |
| AI reject nhầm, mất doanh thu | Head of Cards (P&L owner) | Credit Officer có thể override nếu có lý do |
| AI confident cao nhưng sai | Risk Manager → review threshold và policy | Threshold do Risk Manager set và approve |
| System downtime, trễ quyết định | CTO / IT (SLA owner) | Chuyển sang quy trình manual dự phòng |
| Vi phạm PDPD, rò rỉ dữ liệu | Compliance Officer + CTO | Data handling responsibility |
| Bias trong AI decision | Risk Manager + Compliance Officer | Bias monitoring là governance responsibility |
| Khách khiếu nại bị reject sai | Compliance Officer xử lý → Credit Officer review lại | Adverse action notice phải đầy đủ |
| SBV audit thiếu audit trail | CTO (hệ thống) + Compliance Officer (quy trình) | Audit trail là yêu cầu bắt buộc |

---

## 5. Yêu cầu Human-in-the-Loop

Theo yêu cầu của SBV và thiết kế AI-CRDS:

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

**Nguyên tắc bắt buộc:**
- AI-CRDS không phải là người ra quyết định cuối cùng.
- Mọi quyết định đều có người chịu trách nhiệm.
- Mọi override được ghi log kèm lý do.
- Adverse action notice bắt buộc khi từ chối.

---

## 6. Kế hoạch truyền thông với stakeholder

| Stakeholder | Frequency | Channel | Nội dung |
|------------|-----------|---------|---------|
| Credit Officer | Daily | In-app dashboard | Performance metrics, queue status |
| Risk Manager | Weekly | Report | NPL signals, threshold performance, override rate |
| Head of Cards | Bi-weekly | Dashboard + brief | Approval rate, time-to-decision, revenue impact |
| Compliance Officer | Monthly | Compliance report | Audit trail summary, PDPD compliance status |
| CTO / IT | As needed | Technical docs | API updates, incident reports, SLA status |
| SBV | On request | Formal report | Full audit trail, model documentation |

Định nghĩa và công thức của các KPI trong báo cáo xem `w07-02-metric-definitions`.

---

---

## Nguồn dữ liệu

- Lương Credit Analyst: Glassdoor VN 8/2025 (13 mẫu, median khoảng 18.3 triệu); SalaryExplorer VN Banking 2024 (median khoảng 21.7 triệu).
- Ma trận Influence/Interest là đánh giá của nhóm dự án cho bối cảnh Bank X.
