# Problem Framing — Week 1
> **Tags:** `[Product]` `[Business]` `[Market]`  
> **Dự án:** AI Credit Risk Decision Support (AI-CRDS)  
> **Ngày chốt:** Week 1

---

## Problem Statement

Digital bank tại Việt Nam đang đối mặt với 2 vấn đề xảy ra đồng thời tại cùng một điểm — khi khách hàng nộp hồ sơ vay:

1. **Chất lượng tín dụng thấp:** NPL của retail bank cao hơn trung bình ngành, trong khi volume hồ sơ mới tiếp tục tăng. Quy trình thẩm định thủ công không đủ tốc độ và độ chính xác để kiểm soát rủi ro.
2. **Gian lận tại origination:** 93% gian lận thẻ xảy ra ở giao dịch online. Hồ sơ giả mạo lọt qua quy trình thẩm định là nguồn gốc của cả NPL lẫn fraud loss.

Hiện tại, hai vấn đề này thường được xử lý bởi hai hệ thống riêng biệt — làm tăng chi phí vận hành và bỏ sót tín hiệu rủi ro xuất hiện đồng thời.

---

## Current Flow — AI can thiệp ở đâu

Quy trình origination CC hiện tại tại đa số bank VN:

```
Khách nộp hồ sơ (online/app)
    │
    ▼
[1] Thu thập & verify documents (CMND/CCCD, sao kê lương, HĐLĐ)
    │                                          ← 70% thời gian nằm ở đây
    ▼                                            (Fluxforce/McKinsey, 12/2025)
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

**AI-CRDS can thiệp tại bước 2–4:** tự động scoring + fraud detection ngay sau khi data được thu thập, đưa ra recommendation (approve/reject/escalate) kèm explanation — Credit Officer review cases AI không chắc chắn thay vì review 100% hồ sơ.

*Chi tiết workflow breakdown sẽ được thiết kế tại Week 5 (Decision Architecture) và Week 8 (Workflow Modeling) sau khi interview Credit Officers thật.*

---

## Use Case Được Chọn

```
Use case:  Origination Scoring + Fraud Detection layer
Segment:   Retail Credit Card — Salaried
Product:   AI-CRDS
Market:    Digital bank VN → Traditional bank → Finance companies
```

---

## Core Value Proposition

### Một câu — pitch 10 giây

> **"Tự động xử lý 30–50% hồ sơ credit card trong <5 phút mà không tăng NPL — đo được trong 30 ngày pilot."**

### Theo stakeholder — pitch 30 giây

| Stakeholder | Value Proposition | Metric họ quan tâm |
|------------|-------------------|-------------------|
| **Risk Manager / CRO** | Giảm 20–30% manual review mà không tăng NPL. Mọi quyết định có audit trail đầy đủ cho SBV. | NPL ratio, override rate, audit completeness |
| **Head of Cards** | Tăng 5–10% approval rate mà giữ nguyên risk — mỗi % approval tăng = thêm revenue/năm trên portfolio hiện có. | Approval rate, time-to-decision, revenue per approved card |
| **CTO / IT** | API scoring trả kết quả <5 giây, integrate với Core Banking trong 4–6 tuần, PDPD compliant out-of-the-box. | Integration time, latency, uptime SLA, security audit pass |
| **Credit Officer** | AI xử lý hồ sơ rõ ràng (auto-approve/auto-reject), bạn chỉ review cases thực sự cần judgment. Giải phóng 40–50% thời gian. | Cases/ngày, thời gian review/case, override rate |
| **Compliance Officer** | Explainable decisions, adverse action notice tự động, data residency VN, PDPD compliant. Sẵn sàng cho SBV audit. | Audit trail completeness, PDPD compliance, explainability |

*Lưu ý: Các con số target (30–50% auto, 20–30% manual reduction, 5–10% approval increase) là conservative estimates dựa trên benchmark global đã được điều chỉnh cho VN context. Xem problem-brief.md Section 5 cho chi tiết benchmark và nguồn.*

---

## Lý Do Chọn

### Origination Scoring — core problem

- **Volume tăng, risk tăng theo:** Credit card penetration chỉ **3% dân số** *(GFT/AWS Financial Services Industry Symposium Hanoi 2025, trích ReportLinker & VIRAC Q1/2025)* → thị trường còn rất lớn, các bank đang đẩy mạnh phát hành → volume hồ sơ origination tăng nhanh. VPBank phát hành **500,000 thẻ mới** chỉ trong 2024 *(vietnam.vn, 11/2025)*.
- **Bank đang chịu áp lực NPL thật:** NPL retail bank (VPB, VIB, OCB) cao hơn trung bình ngành. NPL toàn hệ thống 27 ngân hàng niêm yết tăng **16.5% YTD**, đạt gần **266 nghìn tỷ VND** trong Q2/2025 *(MAS Vietnam Banking Sector Q2/2025 Report)* → có động lực thực sự để tìm giải pháp kiểm soát rủi ro tại đầu vào.
- **Pháp lý đã có framework:** Nghị định 94/2025 tạo sandbox cho credit scoring, open API, và P2P lending *(ainvest.com, 8/2025; IFLR Banking & Finance Guide 2025)* → giảm rủi ro compliance khi triển khai, không còn là vùng xám pháp lý.
- **Outcome đo được trong ngắn hạn:** NPL ratio, approval rate, time-to-decision, manual review rate — đều có thể quan sát trong vòng 30–90 ngày pilot.
- **Market đã validate:** Cake by VPBank xử lý **>1 triệu đơn tín dụng/tháng** với **40+ AI models** và đã profitable *(VIR, 1/2026; The Asian Banker, 2024)* → AI credit scoring tại origination ở VN đang chạy production, không còn là lý thuyết.

### Fraud Detection layer — tích hợp thay vì build riêng

- **Fraud đang ở mức nghiêm trọng:** Thiệt hại lừa đảo trực tuyến **>6,000 tỷ VND** trong 11 tháng đầu 2025 *(Bộ Công an, trích vietnam.vn, 1/2026)*. **71%** tổng tấn công mạng nhắm vào tài chính–ngân hàng *(Viettel Cyber Security Threat Report 2024, trích VietnamPlus, 4/2025)*.
- **Fraud tập trung đúng tại điểm origination:** **93%** gian lận phát hành thẻ đến từ giao dịch online, chủ yếu xuyên biên giới *(Visa Vietnam, trích vietnam.vn, 11/2025)* → fraud xảy ra ngay tại thời điểm nộp hồ sơ, không phải sau đó.
- **Cùng 1 workflow, cùng 1 touchpoint:** Origination scoring và fraud detection đều được kích hoạt khi khách hàng nộp hồ sơ vay → không cần build 2 system riêng biệt. Tích hợp fraud signal layer vào scoring pipeline vừa tiết kiệm chi phí build, vừa tăng value proposition: *"đánh giá tín dụng + phát hiện gian lận trong cùng một lần xử lý hồ sơ"*.
- **Fraud signal cải thiện credit decision:** Fake income vừa là fraud signal vừa tăng default probability. Synthetic identity vừa gây fraud loss vừa gây NPL. Tách 2 system = xử lý cùng 1 hồ sơ 2 lần, bỏ sót cross-signal.
- **Market đã validate cách làm này:** Cake by VPBank gộp 11 AI models cho credit scoring VÀ fraud vào cùng pipeline *(The Asian Banker, 2024)*.

### Competitive context

So với status quo (manual + scorecard truyền thống) và alternatives (FICO generic qua partner, bank tự build), AI-CRDS differentiate bằng: tích hợp scoring + fraud trong 1 pipeline, VN compliance built-in (PDPD, SBV audit trail, Nghị định 94), và CIC/eKYC integration native cho market VN. Chi tiết competitive positioning sẽ được phân tích tại Week 33–34 khi đã có pilot data.

---

## Use Cases Loại Bỏ & Expansion Roadmap

Các use case dưới đây không phải "loại bỏ vĩnh viễn" mà là "chưa làm ở giai đoạn này". Mỗi use case có timeline quay lại rõ ràng.

### Early Warning System → Phase 2 (sau khi có origination traction)

- Giá trị rõ ràng nhưng **outcome chỉ nhìn thấy sau 3–6 tháng** (NPL by vintage) — khó chứng minh ROI nhanh cho bank trong giai đoạn pilot.
- Đòi hỏi dữ liệu hành vi sau giải ngân — phụ thuộc nhiều vào chất lượng data nội bộ của từng bank, khó chuẩn hóa cho SaaS.
- **Expansion logic:** Data từ origination scoring feed trực tiếp vào EWS. Bank đã dùng origination → upsell EWS là natural next step. NPL đang là pain lớn nhất *(NPL tăng 16.5% YTD, ~266 nghìn tỷ VND — MAS Q2/2025)* → EWS giải quyết đúng chỗ đó.
- **Timeline:** Bắt đầu build sau khi có bank #1 dùng origination scoring 6+ tháng (có data thật để train EWS model).

### Limit Setting → Phase 3 (sau origination + EWS)

- Xảy ra **sau** origination — phụ thuộc vào origination scoring đã chạy tốt trước.
- Volume quyết định ít hơn, outcome khó đo ngắn hạn hơn.
- Không phải điểm đau cấp thiết nhất của bank trong bối cảnh NPL đang cao và volume hồ sơ mới tăng.
- **Expansion logic:** Khi origination scoring đã chạy, limit optimization là natural extension — cùng data, thêm 1 output (optimal limit thay vì chỉ approve/reject).
- **Timeline:** Phase 3, sau khi origination + EWS đã proven.

### Collection Priority → Phase 4 (long-term)

- Hoạt động ở cuối vòng đời tín dụng — xa điểm origination.
- Thị trường collection VN còn phân mảnh, quy trình mỗi bank khác nhau lớn → khó productize thành SaaS chuẩn.
- Regulatory risk cao hơn (quy định về thu hồi nợ đang thay đổi — Luật TCTD sửa đổi 2025 có provisions mới về xử lý nợ xấu *(IFLR, 9/2025)*).
- Không phải ưu tiên của digital bank — phân khúc mục tiêu ban đầu.
- **Timeline:** Phase 4, chỉ xem xét khi đã có 3+ bank customers và product platform đủ mature.

### Expansion Roadmap tổng hợp

```
Phase 1 (now)     Origination Scoring + Fraud Detection — CC Salaried
      │
      ▼
Phase 2 (6-12m)   Early Warning System — upsell cho bank đã dùng Phase 1
      │
      ▼
Phase 3 (12-18m)  Limit Setting + Segment mở rộng (Self-employed, Consumer Loan)
      │
      ▼
Phase 4 (18m+)    Collection Priority + SME lending
```

---

## Tóm Tắt Đánh Giá

| Tiêu chí | Đánh giá | Dẫn chứng |
|----------|---------|-----------|
| Pain point | Rõ — NPL retail cao hơn trung bình, volume hồ sơ tăng nhanh | MAS Q2/2025; ACBS 2025; vietnam.vn 11/2025 |
| Outcome đo được | Có — NPL ratio, approval rate, time-to-decision, manual review rate | Đo được trong 30–90 ngày pilot |
| Pháp lý | Thuận lợi — sandbox credit scoring đã có, PDPD có hiệu lực | Nghị định 94/2025; IFLR 9/2025 |
| Timing | Tốt — penetration 3%, tăng trưởng 14% CAGR, banks đang push CC | GlobalData, EPI 8/2024; vietnam.vn 11/2025 |
| Scope | Manageable — 1 workflow, 1 touchpoint, 2 giá trị (scoring + fraud) | — |
| Market validation | Có — Cake by VPBank đã prove AI scoring tại origination ở VN, profitable | VIR 1/2026; Asian Banker 2024 |
| Competitive context | Differentiate bằng tích hợp 2-in-1 + VN compliance + CIC native | Chi tiết Week 33–34 |
| Market entry | Digital bank VN → Traditional bank → Finance companies | Xem target-bank-profile.md |

---

## Next Steps

| Tuần | Action | Output |
|------|--------|--------|
| **Week 2** | VN Regulatory Landscape Mapping — map toàn bộ constraints ảnh hưởng product | Regulatory mapping doc, PDPD impact assessment, data residency decision |
| **Week 3** | Data Landscape Assessment — đánh giá CIC, eKYC, alternative data tại VN | Data source inventory, feature availability matrix, synthetic data plan |
| **Week 4** | Damage Model & Break-even — biến risk thành bảng thiệt hại bằng tiền | Damage model, break-even sheet, SaaS pricing draft v0 |
| **Week 5** | Decision Architecture — thiết kế chi tiết decision states + escalation | Decision state spec, escalation tree, adverse action flow |

*Theo lộ trình 60 tuần — xem Roadmap.md cho full timeline.*

---

## Nguồn Tham Khảo

| # | Nguồn | Nội dung chính | Thời điểm |
|---|-------|---------------|-----------|
| 1 | GFT/AWS Financial Services Symposium Hanoi, trích ReportLinker & VIRAC | CC penetration 3% dân số | 2025 |
| 2 | MAS Vietnam Banking Sector Q2/2025 Report | NPL 27 banks +16.5% YTD, ~266 nghìn tỷ VND | Q2/2025 |
| 3 | ACBS Banking Sector 2025 Report | Retail banks (VPB, VIB, OCB) NPL cao hơn trung bình | 2025 |
| 4 | ainvest.com | Nghị định 94/2025 sandbox credit scoring | 8/2025 |
| 5 | IFLR Banking & Finance Guide 2025 | PDPD hiệu lực 1/2026; Luật TCTD sửa đổi 2025 | 9/2025 |
| 6 | vietnam.vn — "Thị trường thẻ tín dụng bứt tốc" | VPBank 500K thẻ mới 2024; TCB, VIB, Sacombank >1M CC | 11/2025 |
| 7 | VIR — "Cake by VPBank posts strong gains" | >1M đơn tín dụng/tháng, income +225%, profitable | 1/2026 |
| 8 | The Asian Banker — Cake digital bank | 40+ AI models (11 credit scoring/fraud) | 2024 |
| 9 | Bộ Công an, trích vietnam.vn | >6,000 tỷ VND thiệt hại lừa đảo 11 tháng 2025 | 1/2026 |
| 10 | Viettel Cyber Security Threat Report 2024, trích VietnamPlus | 71% attack nhắm vào tài chính–ngân hàng | 4/2025 |
| 11 | Visa Vietnam, trích vietnam.vn | 93% fraud CC từ online; fraud giảm 3 quý liên tiếp | 11/2025 |
| 12 | GlobalData, Electronic Payments International | Card payments CAGR 14%, $100.5B by 2028 | 8/2024 |
| 13 | Fluxforce, trích McKinsey | 70% thời gian loan team = data gathering | 12/2025 |
