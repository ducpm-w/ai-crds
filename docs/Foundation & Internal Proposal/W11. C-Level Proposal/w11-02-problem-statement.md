# Problem Statement — AI-Native CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## 1. CURRENT STATE — Quy trình hiện tại

### 1.1 Workflow

Bank X xử lý CC origination qua 9 bước thủ công:

```
Tiếp nhận → eKYC → Data entry → CIC query → CO review → Decision → Approval → Notify → Audit
   10-20'     2-5'    10-20'     5-30'       20-45'      5-10'      varies    T+1     manual
```

Thời gian end-to-end: **1-7 ngày** (typical: 3-5 ngày). Quy trình phụ thuộc hoàn toàn vào CO — không có scoring tự động, không có fraud detection layer, không có decision support.

### 1.2 Team & Capacity

| Resource | Current |
|---------|---------|
| Credit Officers | 10-12 FTE |
| Capacity per CO | ~10-15 hồ sơ/ngày |
| Total capacity | ~3,000 hồ sơ/tháng |
| Peak pressure | Tết, campaign → queue backlog 2-3x |

### 1.3 Baseline Metrics

| Metric | Current (ước tính) | Source |
|--------|-------------------|--------|
| Approval rate | ~60% | Industry average VN CC |
| NPL rate (CC) | ~3.5% | FiinRatings 2024, Statista 2023 |
| Fraud rate (origination) | ~0.8% | Visa VN Q2 2025 |
| False rejection rate | ~10% | Industry estimate — ❓ cần CO validate |
| Time-to-decision | 1-7 ngày | Process mapping |
| Manual review rate | 100% | By definition |
| Audit trail fields | ~5-8 | Industry observation |

---

## 2. COST OF CURRENT STATE — 95.65 tỷ VND/năm

Phân tích chi tiết: damage-model.md. Tóm tắt 4 tầng thiệt hại:

### Tier 1: Credit Loss (NPL) — 26.46 tỷ VND/năm

Mỗi bad applicant được approve → Expected Loss = PD × LGD × EAD = 3.5% × 70% × 50M = **1.225M VND/case.** Với 1,800 approvals/tháng → ~63 defaults/tháng → 26.46 tỷ/năm.

### Tier 2: Fraud Loss — 14.4 tỷ VND/năm

Fraud rate tại origination ~0.8%. Mỗi fraud case = full limit loss (~50M). ~24 fraud cases/tháng → 14.4 tỷ/năm. Hiện tại chỉ có eKYC pass/fail — không có AI fraud scoring layer.

### Tier 3: Opportunity Cost (Reject nhầm) — 51.84 tỷ VND/năm ← LỚN NHẤT

**Đây là thiệt hại lớn nhất và ít được nhận ra nhất.** Ước tính 10% rejections là false positive — good customers bị reject do CO inconsistency hoặc overly conservative criteria. Mỗi good customer bị reject = lifetime value lost ~36M VND (interest + fee + interchange × 3 năm).

~120 false rejections/tháng × 36M = **51.84 tỷ/năm** — chiếm 54% tổng thiệt hại.

**Cost asymmetry:** Reject nhầm 1 good customer (36M) đắt gấp **29.4 lần** approve nhầm 1 bad customer (1.225M).

### Tier 4: Operational Cost — 2.95 tỷ VND/năm

10-12 CO × 18M all-in/tháng, 100% manual review. Không có automation → chi phí tăng tuyến tính với volume.

### Tổng

| Tier | Annual cost | % |
|------|-----------|---|
| T1: Credit loss | 26.46 tỷ | 28% |
| T2: Fraud loss | 14.4 tỷ | 15% |
| **T3: Opportunity cost** | **51.84 tỷ** | **54%** |
| T4: Ops cost | 2.95 tỷ | 3% |
| **TOTAL** | **95.65 tỷ** | **100%** |

**Ghi chú chuẩn hoá số liệu:** Các tài liệu Week 11 dùng nhất quán tổng thiệt hại **95.65 tỷ/năm** (làm tròn: ~96 tỷ/năm) để tránh sai lệch do làm tròn giữa các file.

---

## 3. TREND — Nếu không làm gì

| Trend | Impact |
|-------|--------|
| **CC volume tăng** | VN CC market +12.5%/năm (SBV 2024). Thêm volume → thêm CO → chi phí tăng tuyến tính. |
| **BNPL/fintech cạnh tranh** | BNPL tăng 36.5%/năm (PayNXT360 2025). Approval trong phút. Bank X mất 3-7 ngày → mất khách. |
| **Luật AI 134/2025** | Hiệu lực 01/03/2026. Yêu cầu minh bạch, giải trình, không phân biệt. Bank X chưa sẵn sàng. |
| **SBV siết compliance** | TT 45/2025 (SIMO), Dự thảo TT AI banking. Audit trail hiện tại không đủ cho inspection. |
| **CO turnover** | Credit specialists 10-20M/tháng. Thị trường cạnh tranh. Mất 1 CO = 2-3 tháng train replacement. |

**Kết luận:** Status quo ngày càng đắt hơn. Chi phí tăng, cạnh tranh tăng, compliance risk tăng. Không hành động = chấp nhận thiệt hại 96 tỷ/năm và tệ hơn mỗi năm.
