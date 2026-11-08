# Guardrail Definitions — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## Mục đích

Định nghĩa các guardrail cứng: ranh giới của metric mà AI-CRDS không được vượt qua. Guardrail khác với target: target là mục tiêu (có thể chưa đạt), guardrail là trần hoặc sàn (vi phạm thì phải hành động ngay).

Các giá trị baseline và giới hạn trong tài liệu là giả định lập kế hoạch cho Bank X, sẽ được hiệu chỉnh theo dữ liệu thực khi có. Giới hạn guardrail do Risk Committee phê duyệt và được rà soát định kỳ.

---

## 1. Các loại guardrail

| Loại | Mô tả | Khi vi phạm |
|------|-------|----------|
| Hard guardrail | Ràng buộc quy định hoặc ràng buộc sống còn. Vi phạm là thất bại về tuân thủ hoặc rủi ro không chấp nhận được với ngân hàng. | Hành động ngay lập tức. Có thể tạm dừng hệ thống AI. |
| Soft guardrail | Ranh giới vận hành. Vi phạm thì điều tra và lập kế hoạch khắc phục trong thời hạn quy định. | Điều tra trong 1 tuần. Khắc phục trong 1 tháng. |
| Monitor | Mang tính thông tin. Theo dõi xu hướng, không có hành động tự động, nhưng lệch kéo dài thì phải điều tra. | Ghi nhận trong báo cáo hàng tháng. Điều tra nếu kéo dài từ 2 tháng. |

---

## 2. Bảng guardrail đầy đủ

### 2.1 Risk Guardrails

| ID | Guardrail | Metric | Hard limit | Soft limit | Baseline hiện tại | Owner | Hành động khi vi phạm |
|----|----------|--------|-----------|-----------|-----------------|-------|-----------------|
| G-R1 | Trần NPL | L2-R1 NPL rate | ≤ 4.0% (tối đa tuyệt đối) | ≤ 3.5% (baseline hiện tại) | 3.5% | Risk Manager | Hard: siết TH_high thêm 0.05 ngay (thẩm quyền của Risk Manager), rà soát toàn bộ hồ sơ duyệt gần đây. Soft: điều tra nguyên nhân gốc trong 1 tuần. |
| G-R2 | Trần gian lận | L2-R2 Fraud rate | ≤ 1.5% | ≤ 0.8% (baseline hiện tại) | 0.8% | Head of Fraud | Hard: siết TH_fraud thêm 0.05, rà soát gian lận khẩn cấp. Soft: điều tra xem do mô hình hay do phương thức tấn công mới. |
| G-R3 | Trần EL mỗi hồ sơ | L2-R3 Expected Loss | ≤ 2.0M VND | ≤ 1.225M (hiện tại) | 1.225M | Risk Manager | Hard: rà soát ngưỡng và có thể tạm dừng AI cho phân khúc mới. |
| G-R4 | Mức tập trung theo khách hàng | Hạn mức thẻ tối đa phát hành qua AI-CRDS | ≤ 200M VND mỗi khách (hoặc mức tối đa theo chính sách của Bank X) | Không áp dụng | Theo chính sách hạn mức của Bank X | Risk Committee | Hard: hồ sơ vượt hạn mức phải chuyển Committee (State 4). AI không được khuyến nghị hạn mức vượt mức này. |
| G-R5 | Đột biến gian lận | L2-R2 so với trung bình cuộn 30 ngày | > 2 lần trung bình cuộn 30 ngày | > 1.5 lần trung bình cuộn 30 ngày | 0.8% | Head of Fraud + Risk Manager | Hard: siết TH_fraud_elevated thêm 0.05 ngay, báo đội Fraud, điều tra phương thức tấn công mới, mô hình suy giảm hoặc rò rỉ dữ liệu, rà soát gian lận khẩn cấp các hồ sơ duyệt gần đây. Soft: điều tra mẫu hình, theo dõi hàng ngày trong 1 tuần. |

### 2.2 Business Guardrails

| ID | Guardrail | Metric | Hard limit | Soft limit | Baseline hiện tại | Owner | Hành động khi vi phạm |
|----|----------|--------|-----------|-----------|-----------------|-------|-----------------|
| G-B1 | Sàn approval rate | L2-B1 | ≥ 45% | ≥ 55% | ~60% | Head of Cards | Hard: ngưỡng quá cao, hạ TH_high (Risk Committee họp khẩn). AI đang từ chối quá nhiều. Soft: điều tra do mô hình hay do chất lượng hồ sơ thay đổi. |
| G-B2 | Trần approval rate | L2-B1 | ≤ 75% | ≤ 65% | ~60% | Risk Manager | Hard: ngưỡng quá thấp, nâng TH_high. Đang duyệt quá nhiều. Soft: kiểm tra xu hướng NPL, nếu NPL ổn định thì có thể chấp nhận. |
| G-B3 | Trần time-to-decision | L2-B2 (P95) | ≤ 72h (P95) | ≤ 24h (P95) | 24-48h (thủ công) | Ops Manager | Hard: lỗi hệ thống hoặc tồn đọng lớn, kích hoạt phương án dự phòng. Soft: vấn đề năng lực, bổ sung giờ CO hoặc điều chỉnh ngưỡng. |

### 2.3 Operations Guardrails

| ID | Guardrail | Metric | Hard limit | Soft limit | Baseline hiện tại | Owner | Hành động khi vi phạm |
|----|----------|--------|-----------|-----------|-----------------|-------|-----------------|
| G-O1 | Trần override rate | L3-W2 | ≤ 60% kéo dài 2 tuần | ≤ 30% | Chưa có baseline (chỉ tiêu mới) | Quản lý dự án + Risk | Hard: mô hình lệch căn bản so với phán đoán của CO. Tạm dừng khuyến nghị AI, điều tra mô hình và CO. Soft: vấn đề đào tạo hoặc cần hiệu chỉnh mô hình. |
| G-O2 | Sàn override rate | L3-W2 | ≥ 2% kéo dài 1 tháng | Không áp dụng | Không áp dụng | Quản lý dự án + Risk | Hard: CO có thể duyệt theo quán tính (không thực sự xem xét). Kiểm tra bắt buộc việc duyệt của CO, giảm kích thước lô. |
| G-O3 | Sàn SLA compliance | L2-O3 | ≥ 75% | ≥ 90% | Chưa có SLA hiện hành | Ops Manager | Hard: SLA thất bại có tính hệ thống, bổ sung năng lực hoặc điều chỉnh target SLA. Soft: điều tra điểm nghẽn (state nào, CO nào hay hệ thống). |
| G-O4 | Khả dụng hệ thống | Uptime | ≥ 99.0% (trong giờ làm việc) | ≥ 99.5% | Không áp dụng | IT | Hard: kích hoạt phương án thủ công (100% theo quy trình hiện tại), sửa hệ thống. Soft: điều tra và sửa trong khung bảo trì. |
| G-O5 | Hiệu năng Scoring API | Độ trễ API + tỷ lệ lỗi | Độ trễ > 30 giây hoặc tỷ lệ lỗi > 1% | Độ trễ > 10 giây hoặc tỷ lệ lỗi > 0.5% | Không áp dụng | IT + DS | Hard: chuyển sang xử lý thủ công, toàn bộ hồ sơ vào State 2/4 (duyệt đầy đủ), xử lý sự cố IT, tạm dừng đồng hồ SLA cho hồ sơ bị ảnh hưởng. Soft: DS điều tra phần phục vụ mô hình, IT kiểm tra hạ tầng, sửa trong 24h. |

### 2.4 Compliance Guardrails

| ID | Guardrail | Metric | Hard limit | Soft limit | Owner | Hành động khi vi phạm |
|----|----------|--------|-----------|-----------|-------|-----------------|
| G-C1 | Audit trail đầy đủ | L3-C1 | = 100% | Không áp dụng | Compliance | Không khoan nhượng. Mọi quyết định thiếu audit trail đầy đủ là lỗi hệ thống. Dừng xử lý đến khi sửa xong. Có rủi ro khi SBV thanh tra. |
| G-C2 | Tuân thủ adverse action | L3-C2 | = 100% | Không áp dụng | Compliance | Không khoan nhượng. Mọi hồ sơ từ chối phải có thông báo adverse action theo NĐ 356 và Luật AI. |
| G-C3 | Tuân thủ nhãn AI | L3-C3 | = 100% | Không áp dụng | Compliance | Không khoan nhượng. Mọi quyết định có AI tham gia phải hiển thị nhãn AI theo Luật AI 134/2025. |
| G-C4 | Thiên lệch giới tính | L3-C4 | Chênh lệch ≤ 8pp | Chênh lệch ≤ 5pp | Compliance + Risk | Hard: điều tra ngay, có thể phải loại bỏ hoặc điều chỉnh đặc trưng, báo cáo Risk Committee. Soft: giám sát và điều tra. |
| G-C5 | Thiên lệch địa lý | L3-C5 | Chênh lệch ≤ 12pp | Chênh lệch ≤ 8pp | Compliance + Risk | Xử lý như G-C4. Lưu ý chênh lệch địa lý có thể phản ánh khác biệt rủi ro thực, cần phân biệt thiên lệch với rủi ro. |
| G-C6 | Thiên lệch độ tuổi | L3-C6 | Chênh lệch ≤ 15pp | Chênh lệch ≤ 10pp | Compliance + Risk | Xử lý như G-C4. Độ tuổi là yếu tố rủi ro hợp lệ nên biên độ cho phép rộng hơn. |
| G-C7 | SLA xóa dữ liệu khách hàng | Thời gian xử lý yêu cầu xóa | ≤ 30 ngày lịch | ≤ 15 ngày lịch | DPO | Hard: vi phạm NĐ 356, ưu tiên xử lý ngay. Soft: cần cải tiến quy trình. |

### 2.5 Model Guardrails

| ID | Guardrail | Metric | Hard limit | Soft limit | Owner | Hành động khi vi phạm |
|----|----------|--------|-----------|-----------|-------|-----------------|
| G-M1 | Model drift | L3-M7 PSI | ≤ 0.25 | ≤ 0.10 | Data Science | Hard: đầu ra mô hình không đáng tin cậy, retrain khẩn cấp, cân nhắc tạm dừng nếu > 0.30. Soft: lên lịch retrain trong 1 tháng. |
| G-M2 | Sàn độ chính xác mô hình | L3-M3 AUC | ≥ 0.65 | ≥ 0.75 | Data Science | Hard: mô hình kém hơn scorecard cơ bản, tạm dừng AI và retrain. Soft: điều tra đặc trưng và retrain. |
| G-M3 | Phân phối confidence | L3-M1 mean confidence | ≥ 0.55 | ≥ 0.65 | Data Science | Hard: mô hình rất kém chắc chắn trên toàn tập, có vấn đề đặc trưng hoặc dữ liệu. Soft: điều tra chất lượng dữ liệu và mức sẵn có của đặc trưng. |

---

## 3. Dashboard giám sát guardrail

Dashboard dưới đây minh họa giá trị mẫu để mô tả cách trình bày.

```
╔══════════════════════════════════════════════════════════════╗
║              AI-CRDS GUARDRAIL DASHBOARD                     ║
║              Cập nhật lần cuối: [timestamp]                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  RISK                          TRẠNG THÁI                    ║
║  G-R1 NPL rate     3.2%       [████████░░] OK < 3.5% soft    ║
║  G-R2 Fraud rate   0.6%       [████░░░░░░] OK < 0.8% soft    ║
║  G-R3 EL/app       1.05M      [██████░░░░] OK < 1.225M soft  ║
║  G-R5 Fraud spike   1.1x      [████░░░░░░] OK < 1.5x soft    ║
║                                                              ║
║  BUSINESS                                                    ║
║  G-B1 Approval     61%        [██████░░░░] OK > 55% soft     ║
║  G-B2 Approval     61%        [██████░░░░] OK < 65% soft     ║
║  G-B3 TTD (P95)    6h         [██░░░░░░░░] OK < 24h soft     ║
║                                                              ║
║  OPERATIONS                                                  ║
║  G-O1 Override      18%       [████░░░░░░] OK < 30% soft     ║
║  G-O3 SLA compl.    92%       [█████████░] OK > 90% soft     ║
║  G-O4 Uptime        99.8%     [██████████] OK > 99.5% soft   ║
║  G-O5 API latency   2.1s      [█░░░░░░░░░] OK < 10s soft     ║
║  G-O5 Error rate    0.1%      [█░░░░░░░░░] OK < 0.5% soft    ║
║                                                              ║
║  COMPLIANCE                                                  ║
║  G-C1 Audit trail   100%      [██████████] OK = 100% hard    ║
║  G-C2 Adverse act.  100%      [██████████] OK = 100% hard    ║
║  G-C3 AI label      100%      [██████████] OK = 100% hard    ║
║  G-C4 Gender gap    3pp       [███░░░░░░░] OK < 5pp soft     ║
║                                                              ║
║  MODEL                                                       ║
║  G-M1 PSI           0.07      [████░░░░░░] OK < 0.10 soft    ║
║  G-M2 AUC           0.78      [████████░░] OK > 0.75 soft    ║
║                                                              ║
║  CẢNH BÁO: 0         VI PHẠM: 0                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 4. Quy trình phản hồi khi vi phạm

### 4.1 Mức độ nghiêm trọng

| Mức | Kích hoạt | Thời gian phản hồi | Người phản hồi |
|-------|---------|-------------|----------|
| SEV-1 (Nghiêm trọng) | Bất kỳ hard guardrail nào bị vi phạm | ≤ 4 giờ | Risk Manager + Quản lý dự án + IT. Có thể tạm dừng AI. |
| SEV-2 (Cao) | Bất kỳ soft guardrail nào bị vi phạm | ≤ 24 giờ (điều tra) | Quản lý dự án + owner liên quan. Khắc phục trong 1 tháng. |
| SEV-3 (Theo dõi) | Metric có xu hướng tiến gần guardrail (trong vòng 20% giới hạn) | ≤ 1 tuần (phân tích xu hướng) | Quản lý dự án + DS. Báo cáo tại buổi rà soát kế tiếp. |

### 4.2 Playbook phản hồi SEV-1

```
HARD GUARDRAIL BỊ VI PHẠM
    │
    ├── T+0: Cảnh báo tự động gửi Risk Manager + Quản lý dự án + IT + Compliance
    │
    ├── T+1h: Họp khẩn (trực tuyến)
    │   ├── Xác nhận vi phạm là thật (không phải lỗi dữ liệu)
    │   ├── Đánh giá phạm vi (bao nhiêu hồ sơ bị ảnh hưởng)
    │   ├── Quyết định: tạm dừng AI hay xử lý có mục tiêu
    │   └── Giao owner và thời hạn
    │
    ├── T+4h: Triển khai phản hồi đầu tiên
    │   ├── G-C1/C2/C3 (tuân thủ): tạm dừng xử lý đến khi sửa xong
    │   ├── G-R1/R2 (rủi ro): siết ngưỡng (Risk Manager điều chỉnh ±0.05)
    │   ├── G-R5 (đột biến gian lận): siết TH_fraud thêm 0.05, báo đội Fraud, rà soát mẫu hình gian lận của các hồ sơ duyệt gần đây
    │   ├── G-B1 (approval quá thấp): hạ ngưỡng
    │   ├── G-M1/M2 (mô hình): quay về phiên bản mô hình trước hoặc xử lý thủ công
    │   ├── G-O4 (hệ thống ngừng): kích hoạt phương án thủ công
    │   └── G-O5 (độ trễ/lỗi API): chuyển sang thủ công, toàn bộ hồ sơ vào State 2/4, tạm dừng đồng hồ SLA, xử lý sự cố IT
    │
    ├── T+24h: Bắt đầu phân tích nguyên nhân gốc
    │
    ├── T+1 tuần: Hoàn tất RCA và kế hoạch khắc phục vĩnh viễn
    │
    └── T+1 tháng: Triển khai khắc phục vĩnh viễn và lập báo cáo post-mortem
```

---

## 5. Chu kỳ rà soát guardrail

| Khi nào | Nội dung | Ai |
|------|------|-----|
| Hàng ngày | Kiểm tra dashboard (cảnh báo tự động khi vi phạm) | Hệ thống gửi Quản lý dự án |
| Hàng tuần | Rà soát xu hướng soft guardrail | Quản lý dự án + DS |
| Hàng tháng | Rà soát toàn bộ guardrail và metric thiên lệch | Risk Committee |
| Hàng quý | Rà soát giới hạn guardrail (có cần thay đổi không) | Risk Committee + Compliance |
| Khi retrain mô hình | Kiểm định lại toàn bộ guardrail mô hình (G-M1/M2/M3) | DS + Risk Manager |
| Khi quy định thay đổi | Rà soát guardrail tuân thủ (G-C1-C7) | Compliance + Legal |

---

## 6. Phân biệt guardrail, target và cảnh báo

| | Target | Soft Guardrail | Hard Guardrail |
|--|--------|-------------------|-------------------|
| Là gì | Mục tiêu cần đạt | Ranh giới cần theo dõi | Ranh giới không được vượt |
| Chưa đạt thì | Chấp nhận được, tiếp tục cải thiện | Điều tra và lập kế hoạch khắc phục (1 tháng) | Hành động ngay (4 giờ) |
| Ví dụ NPL | Target 2.8% | Soft ≤ 3.5% | Hard ≤ 4.0% |
| Ví dụ so sánh | "Hướng tới loại A" | "Không xuống dưới loại B" | "Không đạt là bị loại" |

---

## 7. Nguyên tắc áp dụng

1. Các guardrail tuân thủ G-C1, G-C2, G-C3 không khoan nhượng và không có soft limit. Audit trail, adverse action và nhãn AI phải đạt 100%; mọi sai lệch được xử lý như lỗi hệ thống.
2. Giới hạn hard của guardrail thiên lệch (8pp, 12pp, 15pp) rộng hơn soft (5pp, 8pp, 10pp) có chủ đích, vì một phần chênh lệch phản ánh khác biệt rủi ro thực. Hard limit là mức chắc chắn là thiên lệch chứ không chỉ là khác biệt rủi ro.
3. Override rate có cả trần và sàn (G-O1 và G-O2). Quá cao là mô hình sai, quá thấp là CO duyệt theo quán tính; cả hai đều là vấn đề.
4. Tài liệu liên quan: w07-01-kpi-tree (phân cấp metric), w07-02-metric-definitions (cách tính), w07-03-metric-conflict-memo (xung đột giữa các bên), w06-01-threshold-framework (guardrail của ngưỡng), w06-04-sensitivity-analysis (kết quả khi guardrail bị vi phạm).
