# Problem Framing
> **Dự án:** AI Credit Risk Decision Support (AI-CRDS) — Bank X

---

## Problem Statement

Bank X đang đối mặt với 2 vấn đề xảy ra đồng thời tại cùng một điểm: khi khách hàng nộp hồ sơ vay.

1. **Chất lượng tín dụng:** NPL của nhóm ngân hàng bán lẻ cao hơn trung bình ngành, trong khi volume hồ sơ mới tiếp tục tăng. Quy trình thẩm định thủ công không đủ tốc độ và độ chính xác để kiểm soát rủi ro.
2. **Gian lận tại origination:** 93% gian lận thẻ xảy ra ở giao dịch online. Hồ sơ giả mạo lọt qua quy trình thẩm định là nguồn gốc của cả NPL lẫn fraud loss.

Hiện tại, hai vấn đề này thường được xử lý bởi hai hệ thống riêng biệt, làm tăng chi phí vận hành và bỏ sót các tín hiệu rủi ro xuất hiện đồng thời.

---

## Quy trình hiện tại và điểm can thiệp

Quy trình origination thẻ tín dụng (CC) tại Bank X:

```
Khách nộp hồ sơ (online/app)
    │
    ▼
[1] Thu thập & verify documents (CMND/CCCD, sao kê lương, HĐLĐ)
    │                                          70% thời gian nằm ở bước này
    ▼                                          (Fluxforce/McKinsey, 12/2025)
[2] Query CIC + eKYC check
    │
    ▼
[3] Rule-based filtering (income threshold, blacklist, basic eligibility)
    │
    ▼
[4] Manual review & credit decision (Credit Officer)
    │
    ▼
[5] Approve → set limit → phát hành  /  Reject → adverse action notice
```

AI-CRDS can thiệp tại bước 2–4: tự động scoring và fraud detection ngay sau khi dữ liệu được thu thập, đưa ra khuyến nghị (approve/reject/escalate) kèm giải thích. Credit Officer review các hồ sơ có mức tin cậy thấp thay vì review 100% hồ sơ.

Chi tiết thiết kế luồng được mô tả tại `w05-01-decision-architecture` và `w08-01-workflow-as-is`.

---

## Use Case được chọn

```
Use case:  Origination Scoring + Fraud Detection layer
Segment:   Retail Credit Card — Salaried
Product:   AI-CRDS
Đơn vị:    Bank X
```

---

## Core Value Proposition

### Tóm tắt trong một câu

> "Tự động xử lý 30–50% hồ sơ credit card trong dưới 5 phút mà không tăng NPL, đo được trong 30 ngày pilot."

### Theo stakeholder

| Stakeholder | Value Proposition | Metric quan tâm |
|------------|-------------------|-----------------|
| Risk Manager / CRO | Giảm 20–30% manual review mà không tăng NPL. Mọi quyết định có audit trail đầy đủ cho SBV. | NPL ratio, override rate, audit completeness |
| Head of Cards | Tăng 5–10% approval rate mà giữ nguyên mức rủi ro; mỗi điểm phần trăm approval tăng thêm là doanh thu bổ sung trên portfolio hiện có. | Approval rate, time-to-decision, revenue per approved card |
| CTO / IT | API scoring trả kết quả dưới 5 giây, tích hợp với Core Banking trong 4–6 tuần, đáp ứng PDPD. | Integration time, latency, uptime SLA, security audit pass |
| Credit Officer | AI xử lý các hồ sơ rõ ràng (auto-approve/auto-reject), Credit Officer chỉ review các ca cần phán đoán, giải phóng 40–50% thời gian. | Cases/ngày, thời gian review/case, override rate |
| Compliance Officer | Quyết định có thể giải thích, adverse action notice tự động, dữ liệu lưu tại Việt Nam, đáp ứng PDPD, sẵn sàng cho SBV audit. | Audit trail completeness, PDPD compliance, explainability |

Các con số mục tiêu (30–50% tự động, giảm 20–30% manual review, tăng 5–10% approval) là ước tính thận trọng dựa trên benchmark quốc tế, điều chỉnh theo bối cảnh Việt Nam. Đây là giả định lập kế hoạch, sẽ được thay bằng dữ liệu thực của Bank X khi có. Chi tiết benchmark và nguồn xem `w01-02-problem-brief`.

---

## Lý do chọn

### Origination Scoring — vấn đề cốt lõi

- **Volume tăng, rủi ro tăng theo:** Credit card penetration chỉ khoảng 3% dân số (GFT/AWS Financial Services Industry Symposium Hanoi 2025, trích ReportLinker & VIRAC Q1/2025), thị trường còn nhiều dư địa và các ngân hàng đang đẩy mạnh phát hành. VPBank phát hành 500,000 thẻ mới trong năm 2024 (vietnam.vn, 11/2025).
- **Áp lực NPL thực tế:** NPL nhóm ngân hàng bán lẻ (VPB, VIB, OCB) cao hơn trung bình ngành. NPL toàn hệ thống 27 ngân hàng niêm yết tăng 16.5% YTD, đạt gần 266 nghìn tỷ VND trong Q2/2025 (MAS Vietnam Banking Sector Q2/2025 Report), tạo nhu cầu kiểm soát rủi ro ngay từ đầu vào.
- **Khung pháp lý đã có:** Nghị định 94/2025 tạo sandbox cho credit scoring, open API và P2P lending (ainvest.com, 8/2025; IFLR Banking & Finance Guide 2025), giảm rủi ro tuân thủ khi triển khai.
- **Kết quả đo được trong ngắn hạn:** NPL ratio, approval rate, time-to-decision, manual review rate đều có thể quan sát trong 30–90 ngày pilot.
- **Thị trường đã kiểm chứng:** Cake by VPBank xử lý hơn 1 triệu đơn tín dụng mỗi tháng với 40+ AI models và đã có lãi (VIR, 1/2026; The Asian Banker, 2024). AI credit scoring tại origination ở Việt Nam đã vận hành thực tế.

### Fraud Detection layer — tích hợp thay vì xây riêng

- **Mức độ nghiêm trọng:** Thiệt hại lừa đảo trực tuyến vượt 6,000 tỷ VND trong 11 tháng đầu 2025 (Bộ Công an, trích vietnam.vn, 1/2026). 71% tổng số tấn công mạng nhắm vào lĩnh vực tài chính–ngân hàng (Viettel Cyber Security Threat Report 2024, trích VietnamPlus, 4/2025).
- **Fraud tập trung tại điểm origination:** 93% gian lận phát hành thẻ đến từ giao dịch online, chủ yếu xuyên biên giới (Visa Vietnam, trích vietnam.vn, 11/2025). Gian lận xảy ra ngay lúc nộp hồ sơ.
- **Cùng một workflow, cùng một touchpoint:** Origination scoring và fraud detection đều được kích hoạt khi khách hàng nộp hồ sơ, nên không cần xây hai hệ thống riêng. Tích hợp fraud signal vào scoring pipeline vừa tiết kiệm chi phí, vừa cho phép đánh giá tín dụng và phát hiện gian lận trong cùng một lần xử lý hồ sơ.
- **Fraud signal cải thiện quyết định tín dụng:** Thu nhập khai khống vừa là tín hiệu gian lận vừa làm tăng xác suất vỡ nợ; danh tính tổng hợp vừa gây fraud loss vừa gây NPL. Tách thành hai hệ thống nghĩa là xử lý cùng một hồ sơ hai lần và bỏ sót tín hiệu chéo.
- **Thị trường đã áp dụng cách làm này:** Cake by VPBank gộp 11 AI models cho credit scoring và fraud vào cùng một pipeline (The Asian Banker, 2024).

### Bối cảnh cạnh tranh

So với hiện trạng (manual cộng scorecard truyền thống) và các phương án thay thế (giải pháp FICO phổ thông qua đối tác, tự xây), AI-CRDS khác biệt ở ba điểm: tích hợp scoring và fraud trong một pipeline, tuân thủ quy định Việt Nam ngay từ thiết kế (PDPD, SBV audit trail, Nghị định 94), và tích hợp sẵn CIC/eKYC cho thị trường Việt Nam. Phân tích Build vs Buy được trình bày tại `w04-02-break-even-analysis`.

---

## Use case chưa triển khai ở giai đoạn này và lộ trình mở rộng

Các use case dưới đây được xếp vào các giai đoạn sau, mỗi use case có mốc thời gian rõ ràng.

### Early Warning System — Phase 2

- Giá trị rõ ràng nhưng kết quả chỉ nhìn thấy sau 3–6 tháng (NPL theo vintage), khó chứng minh ROI nhanh trong giai đoạn pilot.
- Cần dữ liệu hành vi sau giải ngân, phụ thuộc vào chất lượng dữ liệu nội bộ.
- **Logic mở rộng:** Dữ liệu từ origination scoring cấp trực tiếp cho EWS. NPL đang là điểm đau lớn nhất (NPL tăng 16.5% YTD, khoảng 266 nghìn tỷ VND, MAS Q2/2025), và EWS giải quyết đúng vấn đề đó.
- **Mốc thời gian:** Bắt đầu sau khi origination scoring vận hành ổn định tối thiểu 6 tháng, có dữ liệu thực để huấn luyện mô hình EWS.

### Limit Setting — Phase 3

- Diễn ra sau origination, phụ thuộc vào việc origination scoring đã chạy tốt.
- Volume quyết định thấp hơn, kết quả khó đo trong ngắn hạn.
- Không phải điểm đau cấp thiết nhất trong bối cảnh NPL đang cao và volume hồ sơ mới tăng.
- **Logic mở rộng:** Khi origination scoring đã chạy, tối ưu hạn mức là bước mở rộng tự nhiên: cùng dữ liệu, thêm một output (hạn mức tối ưu thay vì chỉ approve/reject).
- **Mốc thời gian:** Phase 3, sau khi origination và EWS đã được chứng minh hiệu quả.

### Collection Priority — Phase 4

- Hoạt động ở cuối vòng đời tín dụng, xa điểm origination.
- Quy trình thu hồi nợ khác nhau lớn giữa các đơn vị, khó chuẩn hóa.
- Rủi ro pháp lý cao hơn do quy định về thu hồi nợ đang thay đổi (Luật TCTD sửa đổi 2025 có các quy định mới về xử lý nợ xấu, IFLR, 9/2025).
- **Mốc thời gian:** Phase 4, khi nền tảng sản phẩm đã đủ ổn định.

### Lộ trình mở rộng tổng hợp

```
Phase 1 (hiện tại)  Origination Scoring + Fraud Detection — CC Salaried
      │
      ▼
Phase 2 (6–12 tháng) Early Warning System
      │
      ▼
Phase 3 (12–18 tháng) Limit Setting + mở rộng segment (Self-employed, Consumer Loan)
      │
      ▼
Phase 4 (18 tháng trở đi) Collection Priority + SME lending
```

---

## Tóm tắt đánh giá

| Tiêu chí | Đánh giá | Dẫn chứng |
|----------|---------|-----------|
| Pain point | Rõ: NPL retail cao hơn trung bình, volume hồ sơ tăng nhanh | MAS Q2/2025; ACBS 2025; vietnam.vn 11/2025 |
| Kết quả đo được | Có: NPL ratio, approval rate, time-to-decision, manual review rate | Đo được trong 30–90 ngày pilot |
| Pháp lý | Thuận lợi: sandbox credit scoring đã có, PDPD có hiệu lực | Nghị định 94/2025; IFLR 9/2025 |
| Timing | Tốt: penetration 3%, tăng trưởng 14% CAGR, các ngân hàng đang đẩy mạnh CC | GlobalData, EPI 8/2024; vietnam.vn 11/2025 |
| Scope | Kiểm soát được: 1 workflow, 1 touchpoint, 2 giá trị (scoring và fraud) | Nội bộ |
| Kiểm chứng thị trường | Có: Cake by VPBank đã triển khai AI scoring tại origination ở Việt Nam và có lãi | VIR 1/2026; Asian Banker 2024 |
| Bối cảnh cạnh tranh | Khác biệt nhờ tích hợp 2-trong-1, tuân thủ quy định Việt Nam, CIC native | `w04-02-break-even-analysis` |

---

## Nguồn tham khảo

| # | Nguồn | Nội dung chính | Thời điểm |
|---|-------|---------------|-----------|
| 1 | GFT/AWS Financial Services Symposium Hanoi, trích ReportLinker & VIRAC | CC penetration 3% dân số | 2025 |
| 2 | MAS Vietnam Banking Sector Q2/2025 Report | NPL 27 ngân hàng +16.5% YTD, khoảng 266 nghìn tỷ VND | Q2/2025 |
| 3 | ACBS Banking Sector 2025 Report | Nhóm ngân hàng bán lẻ (VPB, VIB, OCB) có NPL cao hơn trung bình | 2025 |
| 4 | ainvest.com | Nghị định 94/2025 sandbox credit scoring | 8/2025 |
| 5 | IFLR Banking & Finance Guide 2025 | PDPD hiệu lực 1/2026; Luật TCTD sửa đổi 2025 | 9/2025 |
| 6 | vietnam.vn — "Thị trường thẻ tín dụng bứt tốc" | VPBank 500K thẻ mới 2024; TCB, VIB, Sacombank >1M CC | 11/2025 |
| 7 | VIR — "Cake by VPBank posts strong gains" | >1M đơn tín dụng/tháng, thu nhập +225%, có lãi | 1/2026 |
| 8 | The Asian Banker — Cake digital bank | 40+ AI models (11 credit scoring/fraud) | 2024 |
| 9 | Bộ Công an, trích vietnam.vn | >6,000 tỷ VND thiệt hại lừa đảo 11 tháng 2025 | 1/2026 |
| 10 | Viettel Cyber Security Threat Report 2024, trích VietnamPlus | 71% tấn công nhắm vào tài chính–ngân hàng | 4/2025 |
| 11 | Visa Vietnam, trích vietnam.vn | 93% fraud CC từ online; fraud giảm 3 quý liên tiếp | 11/2025 |
| 12 | GlobalData, Electronic Payments International | Card payments CAGR 14%, $100.5B vào 2028 | 8/2024 |
| 13 | Fluxforce, trích McKinsey | 70% thời gian của loan team dành cho thu thập dữ liệu | 12/2025 |
