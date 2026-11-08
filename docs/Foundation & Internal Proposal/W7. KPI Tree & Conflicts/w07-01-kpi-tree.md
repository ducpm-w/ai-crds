# KPI Tree — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## Mục đích

KPI tree gồm 3 tầng, bám theo các scorecard hiện có của Bank X. Cây chỉ tiêu cân bằng ba nhóm lợi ích: Kinh doanh (doanh thu), Rủi ro (NPL, gian lận) và Tuân thủ (audit, thiên lệch).

Các baseline và target trong tài liệu là giả định lập kế hoạch, được tính từ mô hình thiệt hại (w04-01-damage-model-bank-x) và sẽ được thay bằng dữ liệu thực của Bank X khi có.

---

## 1. KPI Tree — 3 tầng

```
┌─────────────────────────────────────────────────────────────────┐
│ LEVEL 1 — NORTH STAR METRIC                                     │
│                                                                  │
│   Risk-Adjusted Revenue per CC Application (RARPA)               │
│   = (Revenue generated - Credit loss - Fraud loss - Ops cost)    │
│     ÷ Total applications                                        │
│                                                                  │
│   Baseline (giả định): (64.8 tỷ - 26.5 tỷ - 14.4 tỷ - 2.95 tỷ)  │
│                         ÷ 36,000 apps/năm                       │
│                       = 583K VND/application                     │
│   Target AI-CRDS:     ≥ 700K VND/application (+20%)             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   BUSINESS    │    │      RISK        │    │   OPERATIONS     │
│   METRICS     │    │    METRICS       │    │   METRICS        │
│               │    │                  │    │                  │
│ L2-B1 Approval│    │ L2-R1 NPL rate   │    │ L2-O1 Manual     │
│   rate (%)    │    │   (%)            │    │   review rate (%)│
│               │    │                  │    │                  │
│ L2-B2 Time-to-│    │ L2-R2 Fraud rate │    │ L2-O2 CO capacity│
│   decision (h)│    │   origination (%)│    │   utilization (%)│
│               │    │                  │    │                  │
│ L2-B3 Volume  │    │ L2-R3 Expected   │    │ L2-O3 SLA        │
│   issued/tháng│    │   Loss per app   │    │   compliance (%) │
└───────┬───────┘    └────────┬─────────┘    └────────┬─────────┘
        │                     │                       │
        ▼                     ▼                       ▼
┌───────────────────────────────────────────────────────────────┐
│ LEVEL 3 — DIAGNOSTIC METRICS (giải thích vì sao L2 thay đổi)  │
│                                                               │
│ Model Performance          Workflow Health        Compliance  │
│ ├── AI confidence dist.    ├── State distribution ├── Audit   │
│ ├── Model Gini/AUC/KS      ├── Override rate (%)    trail     │
│ ├── False positive rate    ├── Escalation rate      completeness│
│ ├── False negative rate    ├── Queue depth/age    ├── Adverse │
│ ├── Score stability (PSI)  └── Avg review time      action    │
│ └── Feature drift                                   compliance│
│                                                   ├── Bias    │
│                                                     metrics   │
│                                                   └── Opt-out │
│                                                     rate      │
└───────────────────────────────────────────────────────────────┘
```

---

## 2. Level 1 — North Star

### Risk-Adjusted Revenue per Application (RARPA)

| Thuộc tính | Chi tiết |
|-----------|----------|
| Công thức | (CC Revenue - Credit Loss - Fraud Loss - Ops Cost) ÷ Total Applications |
| Lý do chọn | Đây là chỉ tiêu duy nhất cân bằng được cả ba nhóm. Kinh doanh muốn doanh thu tăng, Rủi ro muốn tổn thất giảm, Vận hành muốn chi phí giảm. RARPA chỉ tăng khi tổng thể cải thiện nên không thể tối ưu một phía để "lách" chỉ tiêu. |
| Baseline | Khoảng 583K VND/application (giả định, xem w04-01-damage-model-bank-x) |
| Target | ≥ 700K VND/application (+20%) sau 6 tháng triển khai đầy đủ |
| Owner | Head of Cards (chính) + Risk Manager (đồng sở hữu) |
| Tần suất | Hàng tháng |
| Nguồn dữ liệu | Tổng hợp từ CBS (doanh thu), CIC (NPL), hồ sơ gian lận, chi phí vận hành |

### Các chỉ tiêu ứng viên không được chọn làm North Star

| Ứng viên | Lý do không chọn |
|----------|-----------------|
| Approval rate | Chỉ phản ánh góc nhìn Kinh doanh. Tăng tỷ lệ duyệt bằng cách hạ ngưỡng làm NPL tăng, không phải cải thiện thực chất. |
| NPL rate | Chỉ phản ánh góc nhìn Rủi ro. Giảm NPL bằng cách từ chối nhiều hơn làm mất doanh thu. |
| Time-to-decision | Chỉ phản ánh góc nhìn Vận hành và trải nghiệm. Quyết định nhanh nhưng sai kém hơn quyết định chậm nhưng đúng. |
| Volume issued | Chỉ số bề nổi. Phát hành nhiều thẻ nhưng NPL cao dẫn đến lỗ ròng. |

---

## 3. Level 2 — Chỉ tiêu chính

### 3.1 Business Metrics

| ID | Metric | Công thức | Baseline (giả định) | Target | Owner | Tần suất |
|----|--------|---------|-----------------|--------|-------|-----------|
| L2-B1 | Approval rate | Approved ÷ Total applications | 60% | 60-65% (duy trì hoặc tăng nhẹ) | Head of Cards | Hàng tuần |
| L2-B2 | Time-to-decision | Median số giờ từ lúc nhận hồ sơ đến lúc ra quyết định | 24-48h (thủ công) | ≤ 4h (State 1), ≤ 8h (State 2) | Ops Manager | Hàng tuần |
| L2-B3 | Volume issued/tháng | Số thẻ tín dụng phát hành | ~1,800/tháng | ≥ 1,800 (duy trì) | Head of Cards | Hàng tháng |

### 3.2 Risk Metrics

| ID | Metric | Công thức | Baseline (giả định) | Target | Owner | Tần suất |
|----|--------|---------|-----------------|--------|-------|-----------|
| L2-R1 | NPL rate | DPD 90+ ÷ Tổng dư nợ thẻ | 3.5% | ≤ 3.5% (không xấu đi). Mục tiêu: 2.8% (-20%) | Risk Manager | Hàng tháng (độ trễ 90 ngày) |
| L2-R2 | Fraud rate at origination | Gian lận được xác nhận ÷ Tổng hồ sơ | 0.8% | ≤ 0.56% (-30%) | Head of Fraud | Hàng tháng |
| L2-R3 | Expected Loss per approved app | EL = PD × LGD × EAD | 1.225M VND | ≤ 1.0M VND | Risk Manager | Hàng tháng |

### 3.3 Operations Metrics

| ID | Metric | Công thức | Baseline (giả định) | Target | Owner | Tần suất |
|----|--------|---------|-----------------|--------|-------|-----------|
| L2-O1 | Manual review rate | Khối lượng State 2+3+4 ÷ Tổng hồ sơ | 100% (toàn bộ thủ công) | ≤ 55% (từ 45% hồ sơ trở lên được duyệt theo lô) | Ops Manager | Hàng tuần |
| L2-O2 | CO capacity utilization | Giờ làm việc thực tế của CO ÷ Giờ khả dụng | ~95% (quá tải) | 70-80% (có vùng đệm hợp lý) | Ops Manager | Hàng tuần |
| L2-O3 | SLA compliance rate | Quyết định đúng hạn ÷ Tổng quyết định | Chưa có SLA hiện hành | ≥ 90% (trung bình theo trọng số các state) | Ops Manager | Hàng tuần |

---

## 4. Level 3 — Chỉ tiêu chẩn đoán

### 4.1 Model Performance

| ID | Metric | Ý nghĩa | Target | Tần suất | Cảnh báo khi |
|----|--------|-------------|--------|-----------|---------|
| L3-M1 | AI confidence distribution | Độ chắc chắn của mô hình | Mean > 0.70 | Hàng tuần | Mean giảm hơn 0.05 so với baseline |
| L3-M2 | Model Gini coefficient | Khả năng phân biệt tổng thể | ≥ 0.40 (logistic), ≥ 0.55 (GBM) | Hàng tháng (chu kỳ retrain) | Giảm hơn 0.05 so với baseline |
| L3-M3 | AUC-ROC | Độ chính xác phân loại | ≥ 0.75 | Hàng tháng | Xuống dưới 0.70 |
| L3-M4 | KS statistic | Mức tách biệt tối đa giữa nhóm tốt và xấu | ≥ 0.30 | Hàng tháng | Xuống dưới 0.25 |
| L3-M5 | False positive rate (ước tính) | Tỷ lệ khách tốt bị từ chối | ≤ 10% (baseline), mục tiêu 7% | Hàng tháng (so sánh AI từ chối với CO duyệt) | Tăng hơn 2pp so với baseline |
| L3-M6 | False negative rate (ước tính) | Tỷ lệ khách xấu được duyệt | ≤ 3.5% (xấp xỉ NPL) | Hàng tháng (độ trễ 90 ngày) | Tăng hơn 0.5pp |
| L3-M7 | PSI (Population Stability Index) | Mức dịch chuyển phân phối điểm | < 0.10 (ổn định) | Hàng tháng | > 0.20 (dịch chuyển đáng kể) |
| L3-M8 | Feature drift | Mức dịch chuyển phân phối từng đặc trưng | CSI < 0.10 mỗi đặc trưng | Hàng tháng | Bất kỳ đặc trưng nào có CSI > 0.25 |

### 4.2 Workflow Health

| ID | Metric | Ý nghĩa | Target | Tần suất | Cảnh báo khi |
|----|--------|-------------|--------|-----------|---------|
| L3-W1 | State distribution (S1/S2/S3/S4/S5 %) | Mức hiệu chỉnh ngưỡng | S1: 35-45%, S2: 25-35%, S3: 2-5%, S4: 5-10%, S5: 8-15% | Hàng tuần | Bất kỳ state nào lệch ±10pp so với target |
| L3-W2 | Override rate | Mức đồng thuận giữa CO và AI | 10-20% | Hàng tuần | > 30% kéo dài 2 tuần |
| L3-W3 | Override direction | CO đổi quyết định sang duyệt hay sang từ chối | Cân bằng (60% đổi sang duyệt, 40% đổi sang từ chối) | Hàng tháng | > 80% theo một hướng |
| L3-W4 | Escalation rate (L1→L2) | Mức tự tin của CO cấp 1 | 10-15% | Hàng tuần | > 25% |
| L3-W5 | Queue depth (max pending) | Áp lực năng lực xử lý | ≤ 50 hồ sơ mỗi CO | Hàng ngày (dashboard) | > 100 hồ sơ mỗi CO |
| L3-W6 | Avg review time per state | Hiệu suất của CO | S1: 4 phút, S2: 25 phút, S3: 45 phút | Hàng tuần | S1 > 10 phút (không duyệt theo lô) |
| L3-W7 | Batch confirm ratio | Mức CO dùng duyệt lô so với duyệt từng hồ sơ | S1: ≥ 80% duyệt lô | Hàng tuần | < 50% (CO chưa tin tưởng duyệt lô) |

### 4.3 Compliance Metrics

| ID | Metric | Ý nghĩa | Target | Tần suất | Cảnh báo khi |
|----|--------|-------------|--------|-----------|---------|
| L3-C1 | Audit trail completeness | Sẵn sàng cho thanh tra SBV | 100% (24 trường mỗi quyết định) | Hàng ngày (tự động) | Bất kỳ bản ghi nào dưới 24 trường |
| L3-C2 | Adverse action compliance | NĐ 356 và Luật AI | 100% hồ sơ từ chối có thông báo | Hàng ngày (tự động) | Bất kỳ hồ sơ từ chối nào thiếu thông báo |
| L3-C3 | AI label compliance | Luật AI 134/2025 | 100% quyết định có AI tham gia được gắn nhãn | Hàng ngày (tự động) | Bất kỳ quyết định AI nào thiếu nhãn |
| L3-C4 | Gender approval rate gap | Thiên lệch theo Luật AI 134/2025 | Chênh lệch ≤ 5pp giữa nam và nữ | Hàng tháng | > 5pp |
| L3-C5 | Geography approval rate gap | Thiên lệch | Chênh lệch ≤ 8pp giữa đô thị và nông thôn | Hàng tháng | > 8pp |
| L3-C6 | Age approval rate gap | Thiên lệch | Chênh lệch ≤ 10pp giữa các nhóm tuổi | Hàng tháng | > 10pp |
| L3-C7 | Opt-out AI rate | Mức tin tưởng của khách hàng vào AI | < 5% | Hàng tháng | > 10% |
| L3-C8 | Human review request rate | Quyền yêu cầu người xem xét theo NĐ 356 | < 3% số hồ sơ bị từ chối | Hàng tháng | > 5% |

---

## 5. Quan hệ giữa các chỉ tiêu

```
NORTH STAR: RARPA
    │
    ├── Doanh thu tăng (L2-B1 approval rate × L2-B3 volume × LTV)
    │   │
    │   ├── Approval rate chịu tác động của:
    │   │   ├── L3-W1 State distribution (nhiều S1 hơn → duyệt nhiều hơn)
    │   │   ├── L3-M5 False positive rate (thấp hơn → duyệt nhiều khách tốt hơn)
    │   │   └── L3-W2 Override rate (CO đổi từ từ chối sang duyệt → duyệt nhiều hơn)
    │   │
    │   └── Volume chịu tác động của:
    │       ├── L2-B2 Time-to-decision (nhanh hơn → ít khách bỏ giữa chừng)
    │       └── Marketing và kênh bán (ngoài phạm vi AI-CRDS)
    │
    ├── Tổn thất tín dụng giảm (L2-R1 NPL × LGD × dư nợ)
    │   │
    │   └── NPL chịu tác động của:
    │       ├── L3-M2/M3/M4 Độ chính xác mô hình (mô hình tốt hơn → bắt được nhiều hồ sơ xấu hơn)
    │       ├── L3-M6 False negative rate (thấp hơn → ít hồ sơ xấu được duyệt)
    │       └── L3-W2 Override rate (CO đổi sang duyệt hồ sơ xấu → NPL tăng)
    │
    ├── Tổn thất gian lận giảm (L2-R2 fraud rate × hạn mức bình quân)
    │   │
    │   └── Fraud rate chịu tác động của:
    │       ├── L3-W1 Khối lượng State 3 (gắn cờ nhiều hơn → bắt được nhiều hơn)
    │       └── Chất lượng mô hình gian lận (tách biệt với mô hình tín dụng)
    │
    └── Chi phí vận hành giảm (L2-O1 manual review rate × chi phí mỗi lần duyệt)
        │
        └── Manual review rate chịu tác động của:
            ├── L3-W1 Tỷ lệ State 1 (tự động chuyển duyệt lô nhiều hơn → ít thủ công hơn)
            ├── L3-W7 Batch confirm ratio (duyệt lô → nhanh hơn mỗi hồ sơ)
            └── L2-O2 CO utilization (quá tải → trễ SLA → chi phí tăng)
```

### Chỉ tiêu dẫn dắt và chỉ tiêu trễ

| Loại | Chỉ tiêu | Độ trễ | Mục đích sử dụng |
|------|---------|-----|-----|
| Leading (dự báo) | L3-M7 PSI, L3-M8 feature drift, L3-W2 override rate, L3-W4 escalation rate, xu hướng DPD 30+ | Vài ngày đến vài tuần | Cảnh báo sớm, hành động trước khi vấn đề xuất hiện |
| Coincident (thời gian thực) | L2-B1 approval rate, L2-B2 time-to-decision, L3-W1 state distribution, L2-O3 SLA compliance | Thời gian thực | Giám sát vận hành |
| Lagging (xác nhận kết quả) | L2-R1 NPL rate, L2-R3 EL per app, North Star RARPA | 3-12 tháng | Xác nhận hiệu quả thực tế của AI-CRDS |

Thành phần NPL của RARPA có độ trễ từ 3 đến 12 tháng, vì vậy các chỉ tiêu dẫn dắt (PSI, override rate, DPD 30+) được theo dõi song song.

---

## 6. Liên kết với scorecard hiện có của Bank X

### 6.1 Ánh xạ KPI AI-CRDS vào scorecard của Bank X

| Scorecard của Bank X | KPI của Bank X | KPI AI-CRDS tương ứng | Đóng góp của AI-CRDS |
|---------------|----------|---------------------|----------------------|
| Cards Business P&L | Doanh thu từ danh mục thẻ tín dụng | L2-B1 + L2-B3 | Duy trì hoặc tăng approval rate nên doanh thu tăng |
| Cards Business P&L | Cost-to-income ratio | L2-O1 + L2-O2 | Giảm chi phí duyệt thủ công nên C/I giảm |
| Risk Dashboard | NPL ratio | L2-R1 | Chấm điểm tốt hơn nên NPL thấp hơn |
| Risk Dashboard | Provision coverage | L2-R3 (EL per app) | EL thấp hơn nên cần trích lập ít hơn |
| Risk Dashboard | Fraud losses | L2-R2 | Phát hiện gian lận tốt hơn nên tổn thất gian lận giảm |
| Compliance Report | Mức sẵn sàng audit SBV | L3-C1, L3-C2, L3-C3 | Audit trail tự động nên luôn sẵn sàng |
| Compliance Report | Tuân thủ PDPD | L3-C7, L3-C8 | Cơ chế opt-out và quyền yêu cầu người xem xét |
| HR Dashboard | Hiệu suất nhân sự | L2-O2 | Giải phóng năng lực CO để phân bổ lại |
| Customer Experience | Thời gian xử lý hồ sơ | L2-B2 | Quyết định nhanh hơn nên NPS tốt hơn |

### 6.2 Báo cáo theo đối tượng

| Đối tượng | Chỉ tiêu hiển thị | Định dạng | Tần suất |
|---------|-------------|--------|-----------|
| C-level | North Star (RARPA) + tóm tắt L2 | Dashboard 1 trang | Hàng tháng |
| Head of Cards | L2-B1/B2/B3 + L2-O1/O2 + North Star | Business dashboard | Hàng tuần |
| Risk Manager | L2-R1/R2/R3 + L3-M1 đến M8 + L3-C4/C5/C6 | Risk dashboard | Hàng tuần (vận hành), hàng tháng (mô hình) |
| Compliance | L3-C1 đến C8 | Bảng kiểm tuân thủ | Hàng tháng và theo yêu cầu đột xuất của SBV |
| Data Science | L3-M1 đến M8 + L3-W1 đến W7 | Technical dashboard | Hàng ngày/hàng tuần |
| Credit Officers | L2-B2 (thời gian), L2-O3 (SLA), override rate cá nhân | Dashboard cá nhân của CO | Thời gian thực |

---

## 7. Phạm vi áp dụng

1. Các chỉ tiêu mô hình L3 (Gini, AUC, KS) chỉ có ý nghĩa khi mô hình được huấn luyện trên dữ liệu thực của Bank X. Trong giai đoạn MVP dùng dữ liệu tổng hợp, các chỉ tiêu này chỉ mang tính minh họa.
2. Ngưỡng chênh lệch thiên lệch (L3-C4/C5/C6: 5pp, 8pp, 10pp) là ngưỡng đề xuất của dự án, dựa trên nguyên tắc không phân biệt đối xử của Luật AI 134/2025. Luật hiện chưa quy định ngưỡng định lượng.
3. Tài liệu liên quan: w04-01-damage-model-bank-x (baseline chi phí), w06-01-threshold-framework (ngưỡng và approval rate), w06-02-cost-of-error-table (chi phí FP/FN), w05-01-decision-architecture (định nghĩa các state).
