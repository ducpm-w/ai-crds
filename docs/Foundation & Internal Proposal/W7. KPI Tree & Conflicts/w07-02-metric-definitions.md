# Metric Definitions — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## Mục đích

Định nghĩa chính xác từng metric gồm công thức, nguồn dữ liệu, cửa sổ đo và lưu ý khi đọc. Mục tiêu là để Business, Risk và Compliance của Bank X đo cùng một thứ khi nói cùng một tên. Định nghĩa được thống nhất trước khi bắt đầu đo, vì thay đổi định nghĩa giữa chừng sẽ làm dữ liệu không so sánh được.

Các giá trị baseline và target là giả định lập kế hoạch, sẽ được thay bằng dữ liệu thực của Bank X khi có.

---

## 1. North Star

### RARPA — Risk-Adjusted Revenue per Application

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `(CC_Revenue_12M - Credit_Loss_12M - Fraud_Loss_12M - Ops_Cost_12M) ÷ Total_Applications_12M` |
| CC_Revenue | Thu nhập lãi (dư nợ quay vòng × lãi suất) + phí thường niên + phí interchange (phần của đơn vị phát hành). Nguồn: CBS P&L theo từng sản phẩm thẻ. |
| Credit_Loss | Xóa nợ + trích lập dự phòng cho danh mục thẻ phát sinh trong kỳ đo. Nguồn: sổ cái Finance/Risk. |
| Fraud_Loss | Gian lận origination đã xác nhận × toàn bộ hạn mức. Nguồn: cơ sở dữ liệu gian lận. |
| Ops_Cost | Lương CO (phân bổ cho khâu cấp thẻ) + chi phí hệ thống AI-CRDS. Nguồn: Finance. |
| Total_Applications | Số hồ sơ thẻ tín dụng nhận được (mọi kênh). Nguồn: hệ thống tiếp nhận hồ sơ. |
| Cửa sổ đo | Cuộn 12 tháng, báo cáo hàng tháng. Số đọc có ý nghĩa đầu tiên: 12 tháng sau triển khai. |
| Lưu ý | Tổn thất tín dụng có độ trễ trên 90 ngày (định nghĩa DPD 90). RARPA ở tháng thứ 6 sẽ thấp hơn thực tế về mặt tổn thất. RARPA thực cần vintage trưởng thành 12 tháng. |
| Đơn vị | VND mỗi hồ sơ |

---

## 2. Level 2 — Chỉ tiêu chính

### L2-B1: Approval Rate

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `Approved_Applications ÷ Total_Applications × 100%` |
| Tử số | Số hồ sơ có trạng thái cuối là APPROVED, gồm mọi kênh. |
| Mẫu số | Số hồ sơ nhận được, gồm APPROVED + REJECTED + REJECTED_FRAUD + EXPIRED + WITHDRAWN. |
| Loại trừ | Hồ sơ trùng (cùng CCCD trong 30 ngày, chỉ tính một lần). Hồ sơ test/nội bộ. |
| Cửa sổ đo | Cuộn theo tuần, báo cáo hàng tuần. |
| Phân tách | Tổng thể, theo kênh (online/chi nhánh/app), theo loại khách hàng (hiện hữu/mới). |
| Lưu ý | Approval rate không tự nó nói lên chất lượng. Approval rate tăng cùng NPL tăng là xấu; approval rate tăng cùng NPL ổn định là tốt. Luôn đọc cùng L2-R1. |

### L2-B2: Time-to-Decision

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `Median(Decision_Timestamp - Application_Received_Timestamp)` |
| Bắt đầu tính giờ | Application_Received_Timestamp là thời điểm hệ thống nhận đủ hồ sơ (đầy đủ các trường bắt buộc). |
| Dừng tính giờ | Decision_Timestamp là thời điểm CO ký quyết định cuối cùng (duyệt/từ chối). |
| Tạm dừng | Khi hồ sơ ở State 5 (Need-More-Info). Thời gian chờ của khách hàng được loại trừ. |
| Cửa sổ đo | Cuộn theo tuần, báo cáo hàng tuần. |
| Báo cáo | Median (không dùng mean vì giá trị ngoại lai làm lệch mean). Báo cáo thêm P75 và P95. |
| Phân tách | Theo state: S1 ≤ 4h, S2 ≤ 8h, S3 ≤ 4h, S4 ≤ 24h. |
| Owner | Ops Manager |
| Nguồn dữ liệu | Audit trail của AI-CRDS (application_received_timestamp, decision_timestamp) |
| Target | Median ≤ 4h (tổng thể). P95 ≤ 24h. |
| Đơn vị | Giờ |

### L2-B3: Volume Issued per Month

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `Count(Applications where terminal_state = APPROVED AND card_issued = TRUE)` |
| Tử số | Hồ sơ có trạng thái cuối APPROVED và cờ card_issued = TRUE |
| Mẫu số | Không áp dụng (chỉ tiêu đếm) |
| Cửa sổ đo | Tháng lịch, báo cáo hàng tháng. |
| Owner | Head of Cards |
| Nguồn dữ liệu | CBS (hồ sơ phát hành thẻ) + audit trail của AI-CRDS |
| Target | ≥ 1,800/tháng (duy trì mức hiện tại) |
| Lưu ý | Được duyệt không đồng nghĩa với đã phát hành, vì khách có thể không kích hoạt thẻ. Theo dõi cả hai chỉ tiêu. |

### L2-R1: NPL Rate

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `Outstanding_DPD90+ ÷ Total_CC_Outstanding × 100%` |
| Tử số | Tổng dư nợ có DPD ≥ 90 ngày của danh mục thẻ phát hành qua AI-CRDS. |
| Mẫu số | Tổng dư nợ thẻ của danh mục phát hành qua AI-CRDS. |
| Định nghĩa nợ xấu | DPD 90+ (theo Basel II), thống nhất với định nghĩa của Bank X. |
| Cửa sổ đo | Snapshot hàng tháng, báo cáo hàng tháng. |
| Độ trễ | Độ trễ đo 90+ ngày. Hồ sơ được duyệt hôm nay thì tín hiệu NPL sớm nhất xuất hiện sau 90 ngày. Vintage trưởng thành đầy đủ sau 12 tháng. |
| Phân tách | Theo vintage (tháng duyệt), theo nhóm điểm AI lúc duyệt, theo state lúc duyệt (S1 so với S2). |
| Owner | Risk Manager |
| Nguồn dữ liệu | Core Banking System, theo dõi DPD. Lọc: hồ sơ phát hành qua AI-CRDS. |
| Target | ≤ 3.5% (baseline hiện tại). Mục tiêu: ≤ 2.8% (-20%). |
| Lưu ý | Trong 3 tháng đầu sau triển khai chưa có dữ liệu NPL cho nhóm hồ sơ AI-CRDS, nên dùng DPD 30+ làm cảnh báo sớm. |

### L2-R2: Fraud Rate at Origination

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `Confirmed_Origination_Fraud ÷ Total_Applications × 100%` |
| Tử số | Số hồ sơ mà điều tra sau duyệt xác nhận gian lận danh tính, gian lận giấy tờ hoặc gian lận hồ sơ. |
| Mẫu số | Tổng số hồ sơ (cùng mẫu số với L2-B1). |
| Cửa sổ đo | Cuộn theo tháng, báo cáo hàng tháng. |
| Độ trễ phát hiện | Gian lận có thể được phát hiện sau 1 đến 6 tháng. Một số trường hợp chỉ lộ ra khi khách khiếu nại giao dịch hoặc tài khoản chuyển sang thu hồi nợ. |

### L2-R3: Expected Loss per Approved Application

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `(Total_Credit_Loss_12M + Total_Fraud_Loss_12M) ÷ Approved_Applications_12M` |
| Tử số | Tổng xóa nợ tín dụng và tổn thất gian lận đã xác nhận của danh mục thẻ phát hành qua AI-CRDS, 12 tháng gần nhất |
| Mẫu số | Số hồ sơ được duyệt qua AI-CRDS trong cùng 12 tháng |
| Cửa sổ đo | Cuộn 12 tháng, báo cáo hàng tháng. |
| Owner | Risk Manager |
| Nguồn dữ liệu | Sổ cái Finance (xóa nợ, trích lập) + cơ sở dữ liệu gian lận + audit trail của AI-CRDS |
| Target | ≤ 1.225M VND (EL hiện tại). Mục tiêu: ≤ 1.0M VND. |
| Đơn vị | VND mỗi hồ sơ được duyệt |

### L2-O1: Manual Review Rate

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `(State2 + State3 + State4) volume ÷ Total_Applications × 100%` |
| Tử số | Số hồ sơ được chuyển đến State 2, 3 hoặc 4 (cần CO xem xét từng hồ sơ) |
| Mẫu số | Tổng số hồ sơ nhận được |
| Khái niệm "thủ công" | Mọi hồ sơ cần CO xem xét riêng lẻ (không phải duyệt lô). Duyệt lô State 1 không tính là thủ công. |
| Cửa sổ đo | Cuộn theo tuần. |
| Owner | Ops Manager |
| Nguồn dữ liệu | Routing log của AI-CRDS (phân bổ state) |
| Target | ≤ 55% (≥ 45% hồ sơ tự động chuyển State 1) |

### L2-O2: CO Capacity Utilization

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `Actual_CO_Review_Hours ÷ Available_CO_Hours × 100%` |
| Tử số | Tổng `co_review_time_seconds` từ audit trail ÷ 3600. |
| Mẫu số | CO_Count × Working_Days × Productive_Hours_Per_Day (6h). |
| Cửa sổ đo | Hàng tuần. |
| Owner | Ops Manager |
| Nguồn dữ liệu | Audit trail của AI-CRDS (thời gian duyệt) + HR (số lượng CO, ngày công) |
| Target | 70-80%. Dưới 60% là dư nhân sự. Trên 90% là quá tải, có rủi ro trễ SLA. |

### L2-O3: SLA Compliance Rate

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `On_Time_Decisions ÷ Total_Decisions × 100%` |
| Tử số | Số quyết định được đưa ra trong SLA của từng state (S1: 4h, S2: 8h, S3: 4h, S4: 24h) |
| Mẫu số | Tổng số quyết định ở mọi state |
| Đúng hạn | Quyết định được đưa ra trong SLA của state tương ứng. |
| Cửa sổ đo | Hàng tuần. |
| Owner | Ops Manager |
| Nguồn dữ liệu | Audit trail của AI-CRDS (thời điểm vào state, thời điểm quyết định) |
| Target | ≥ 90% (trung bình theo trọng số các state) |
| Phân tách | Theo state. Chỉ số tổng thể tính theo trọng số khối lượng từng state. |

---

## 3. Level 3 — Chỉ tiêu chẩn đoán (định nghĩa chính)

### L3-M2: Gini Coefficient

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `2 × AUC - 1` (suy ra từ AUC-ROC) |
| Diễn giải | 0 là mô hình ngẫu nhiên, 1 là hoàn hảo. Mức điển hình của ngân hàng Việt Nam: 0.30-0.50 với logistic regression, 0.45-0.65 với gradient boosting. |
| Điều kiện | Chỉ có ý nghĩa với dữ liệu thực và kết quả vỡ nợ thực tế (độ trễ 90+ ngày). Gini trên dữ liệu tổng hợp không đại diện cho thực tế. |

### L3-M7: PSI (Population Stability Index)

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `Σ (Actual_% - Expected_%) × ln(Actual_% / Expected_%)` trên các khoảng điểm |
| Expected | Phân phối điểm tại thời điểm huấn luyện mô hình (mẫu phát triển). |
| Actual | Phân phối điểm hiện tại (chấm điểm thực tế). |
| Diễn giải | < 0.10: ổn định. 0.10-0.20: dịch chuyển vừa, cần xem xét. > 0.20: dịch chuyển đáng kể, cần retrain. |

### L3-W2: Override Rate

| Thuộc tính | Định nghĩa |
|-----------|-----------|
| Công thức | `Overrides ÷ Total_CO_Decisions × 100%` |
| Override | Quyết định của CO khác với khuyến nghị của AI, gồm CO duyệt khi AI khuyến nghị từ chối/xem xét và CO từ chối khi AI khuyến nghị duyệt. |
| Phân tách | Theo hướng (đổi sang duyệt hoặc đổi sang từ chối), theo từng CO. |
| Diễn giải | 10-20% là lành mạnh (CO bổ sung giá trị). > 30% cho thấy mô hình và CO lệch nhau, cần xem xét. < 5% cho thấy CO có thể duyệt theo quán tính, cần xem xét. |

Phát hiện duyệt theo quán tính:
- Nếu override rate < 5% và `co_review_time_seconds` trung bình < 120 giây (2 phút) với duyệt lô State 1, hệ thống phát cảnh báo CO duyệt lô mà chưa thực sự xem xét.
- Hành động: kiểm tra ngẫu nhiên 10 lượt duyệt lô mỗi tuần, xem CO có mở chi tiết hồ sơ và tóm tắt CIC hay chỉ bấm "confirm all" ngay.
- Khi xác định có duyệt theo quán tính: (a) tổ chức lại đào tạo bắt buộc cho CO, (b) giảm kích thước lô tối đa, (c) yêu cầu CO mở từng hồ sơ trước khi nút duyệt lô được kích hoạt (guardrail trên giao diện).

---

## 4. Ngưỡng cảnh báo — thang leo cấp cho từng metric

Mỗi metric có 3 mức cảnh báo: Warning, Review và Emergency.

| Metric | Bình thường | Warning (Owner xem xét) | Review (Risk Manager + Quản lý dự án) | Emergency (Risk Committee) |
|--------|----------|----------------------------|--------------------------------|--------------------------------|
| L2-B1 Approval rate | 55-65% | < 55% hoặc > 65% | < 50% hoặc > 70% | < 45% hoặc > 75% |
| L2-B2 Time-to-decision (P95) | ≤ 24h | > 24h | > 48h | > 72h |
| L2-B3 Volume issued | ≥ 1,800/tháng | < 1,500 (-17%) | < 1,200 (-33%) | < 900 (-50%) |
| L2-R1 NPL rate | ≤ 3.0% | +50 bps so với baseline (3.5% lên 4.0%) | +100 bps (3.5% lên 4.5%) | +200 bps (3.5% lên 5.5%), dừng khẩn cấp |
| L2-R2 Fraud rate | ≤ 0.56% | +30 bps (0.8% lên 1.1%) | +60 bps (0.8% lên 1.4%) | > 1.5%, rà soát gian lận khẩn cấp |
| L2-R3 EL per app | ≤ 1.0M | > 1.225M (baseline) | > 1.5M (+22%) | > 2.0M (+63%), rà soát ngưỡng |
| L2-O1 Manual review rate | ≤ 55% | > 60% | > 70% | > 80% (AI đóng góp rất ít) |
| L2-O2 CO utilization | 70-80% | > 85% hoặc < 60% | > 90% | > 95%, khẩn cấp về năng lực |
| L2-O3 SLA compliance | ≥ 90% | < 90% | < 80% | < 75%, quy trình thất bại |
| L3-W2 Override rate | 10-20% | > 30% hoặc < 5% | > 40% hoặc < 3% | > 60% hoặc < 2% |
| L3-M7 PSI (drift) | < 0.10 | > 0.10 | > 0.20 | > 0.25, retrain |
| L3-C4 Gender gap | ≤ 5pp | > 5pp | > 8pp | > 12pp, điều tra theo Luật AI |

### Quy trình phản hồi cảnh báo

```
WARNING:   Owner nhận cảnh báo trên dashboard, điều tra trong 48h
REVIEW:    Risk Manager và Quản lý dự án được thông báo, phân tích nguyên nhân gốc trong 1 tuần
EMERGENCY: Triệu tập Risk Committee, phản hồi trong 4h
           Hành động có thể gồm: siết/nới ngưỡng, tạm dừng AI, retrain mô hình
```

### Ví dụ cảnh báo NPL (chỉ tiêu quan trọng nhất)

```
THANG CẢNH BÁO NPL

Baseline: 3.5%

    3.5% ── Vận hành bình thường
    │
    4.0% ── WARNING (+50 bps)
    │       - Risk Manager xem xét báo cáo NPL hàng tháng
    │       - Kiểm tra mức tăng đến từ nhóm AI hay nhóm hiện hữu
    │       - Kiểm tra xu hướng DPD 30+ (chỉ tiêu dẫn dắt)
    │
    4.5% ── REVIEW (+100 bps)
    │       - Kích hoạt rà soát ngưỡng
    │       - Phân tích vintage: nhóm duyệt của tháng nào xấu hơn
    │       - Cân nhắc siết TH_high thêm 0.03-0.05
    │
    5.5% ── EMERGENCY (+200 bps)
            - Risk Committee họp khẩn
            - Tạm dừng State 1 (tự động chuyển duyệt lô), chuyển toàn bộ sang State 2 (duyệt đầy đủ)
            - Phân tích nguyên nhân gốc: lỗi mô hình, cú sốc bên ngoài hay vấn đề dữ liệu
            - Chỉ khôi phục sau khi Committee phê duyệt
```

---

## 5. Tài liệu liên quan

w07-01-kpi-tree (cấu trúc phân cấp), w07-03-metric-conflict-memo (xung đột giữa các metric), w07-04-guardrail-definitions (ngưỡng chấp nhận).
