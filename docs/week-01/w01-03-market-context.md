# Market Context — Credit Card Origination tại VN
> **Dự án:** AI Credit Risk Decision Support (AI-CRDS)  
> **Use case:** Origination Scoring + Fraud Detection Layer  
> **Segment:** Retail Credit Card — Salaried  
> **Mục đích:** Tổng hợp toàn bộ dữ liệu thị trường đã verified — phục vụ problem framing, target bank selection, và pitch deck  
> **Nguyên tắc:** Mỗi số liệu ghi rõ nguồn + thời điểm. Không có con số nào không có nguồn.  
> **Version:** 1.0

---

## 1. Thị trường Credit Card VN — Tổng quan

### 1.1. Penetration & Market Size

- Credit card penetration chỉ **~3% tổng dân số**, tương đương khoảng **14–15% dân số có tài khoản ngân hàng** *(GFT/AWS Financial Services Industry Symposium Hanoi 2025, trích ReportLinker & VIRAC Q1/2025; InsightAsia Q1/2025, trích SBV Annual Banking Report 2024)*.
- Toàn thị trường có khoảng **10.2 triệu** thẻ tín dụng *(Vietnam Banking Association, trích TPBank website, 2024)*.
- Thị trường credit card VN đạt khoảng **$3.8 tỷ** giao dịch năm 2024, tăng trưởng **12.5%/năm** *(InsightAsia Q1/2025, trích SBV Annual Banking Report 2024 & Oxford Economics)*.
- Card payments dự kiến đạt CAGR **14%** giai đoạn 2024–2028, hướng tới **$100.5 tỷ** vào 2028 *(GlobalData, Electronic Payments International, 8/2024)*.

### 1.2. Tổng thẻ ngân hàng

- Cuối Q1/2025: tổng khoảng **157 triệu** thẻ ngân hàng lưu hành tại VN, tăng 1 triệu so với cuối 2024. Thẻ quốc tế đạt **50.2 triệu** (gấp 3 lần đầu 2021). Riêng Q1/2025 phát hành thêm **1.8 triệu** thẻ quốc tế *(VIR, trích Vụ Thanh toán NHNN, 5/2025)*.

### 1.3. Competitive landscape — BNPL

- Thị trường BNPL VN tăng CAGR **58.3%** giai đoạn 2021–2024, dự kiến đạt **$2.6 tỷ** năm 2025 *(PayNXT360, trích Research and Markets)* — cạnh tranh trực tiếp với credit card, đặc biệt ở phân khúc trẻ và digital-first.

### 1.4. Nhận xét

Penetration 3% = thị trường còn rất lớn. Các bank đang chạy đua phát hành → volume hồ sơ origination tăng nhanh → áp lực lên capacity thẩm định. Đồng thời, BNPL approve trong phút trong khi CC mất ngày → mất khách nếu chậm.

---

## 2. Volume phát hành — Top banks

### 2.1. Thẻ mới phát hành ✅ Verified

| Bank | Thẻ CC lưu hành | Thẻ mới phát hành (12 tháng gần nhất) | Doanh số giao dịch CC | Nguồn |
|------|-----------------|---------------------------------------|----------------------|-------|
| **VPBank** | >1.7 triệu (cuối 2024) | >500,000 thẻ mới trong 2024 | >100 nghìn tỷ VND (2024) | vietnam.vn, 11/2025 |
| **Techcombank** | >1 triệu (Q2/2025) | +224,000 trong 12 tháng | >100 nghìn tỷ VND (2024) | vietnam.vn, 11/2025 |
| **VIB** | 1 triệu (8/2025) | +142,000 so với cuối 2024 | >100 nghìn tỷ VND (2024) | vietnam.vn, 11/2025 |
| **Sacombank** | >1 triệu (đầu 2025) | Không công bố cụ thể | Không công bố | vietnam.vn, 11/2025 |
| **TPBank** | Không công bố | Tăng ~140% trong 2023; doanh số 29 nghìn tỷ VND | Riêng Visa >$1 tỷ/năm (2023) | TPBank website, 2024 |

4 bank (VPBank, Techcombank, VIB, Sacombank) đã gia nhập "câu lạc bộ triệu thẻ" *(vietnam.vn, 11/2025)*.

### 2.2. Market share tham khảo (H1/2021 — dữ liệu cũ nhất có nguồn)

| Bank | Market share CC quốc tế |
|------|------------------------|
| TPBank | 17% |
| VPBank | 16% |
| Techcombank | 15.7% |
| VIB | 8% |
| Sacombank | 6% |

*Nguồn: VIR, 12/2021. Market share có thể đã thay đổi đáng kể đến 2025 — VPBank đã vượt lên dẫn đầu về volume.*

### 2.3. Digital bank nổi bật

**Cake by VPBank** — proof point cho AI credit scoring tại VN:
- 6.2 triệu khách hàng *(VIR, 1/2026)*
- >1 triệu đơn tín dụng/tháng (bao gồm CC + consumer loan + BNPL, không chỉ CC) *(VIR, 1/2026)*
- 40+ AI models, bao gồm 11 cho credit scoring & fraud, 7 cho eKYC, 4 generative AI *(The Asian Banker, 2024)*
- Total income +225% trong 9 tháng đầu 2025; lợi nhuận Q3 gấp 4x cùng kỳ. Digital bank profitable đầu tiên VN *(VIR, 1/2026)*
- Self-built core banking + card management system in-house. Google Vertex AI, Visa Cloud Connect *(Google Cloud case study; Visa VN, 11/2024)*

**TNEX (MSB):**
- 3.9 triệu users (6/2025) *(The Asian Banker, 2025)*
- Approve khoản vay trong **5 giây**; credit volume digital +343% *(vietnam.vn, 2/2026)*
- Focus micro-lending (max 25M VND), licensed finance company *(The Asian Banker, 2025)*

---

## 3. NPL — Nợ xấu

### 3.1. NPL toàn hệ thống

| Metric | Số liệu | Nguồn |
|--------|---------|-------|
| NPL ratio toàn hệ thống đầu 2025 | **~4.3%** | ainvest.com, 8/2025 |
| NPL trung bình 28 ngân hàng niêm yết cuối 2025 | **2.01%** | vietnam.vn, trích báo cáo 28 NHTM niêm yết, 1/2026 |
| Tổng NPL 27 ngân hàng niêm yết Q2/2025 | Gần **266 nghìn tỷ VND** (~$10.6 tỷ), tăng **16.5% YTD** | MAS Vietnam Banking Sector Q2/2025 Report |
| Provision expenses dự kiến 2025 | Tăng **22.2% YoY** | ACBS Banking Sector 2025 Report |

### 3.2. NPL theo nhóm bank

| Nhóm | NPL | Ghi chú | Nguồn |
|------|-----|---------|-------|
| **Retail banks (VPB, VIB, OCB)** | Cao hơn trung bình ngành | Nợ nhóm 2 cũng cao hơn | ACBS Banking Sector 2025 |
| **Sacombank** | ~7% dư nợ khách hàng (4.95% tổng tín dụng) | Coverage ratio chỉ 49.2%; provision 11,157 tỷ VND | vietnam.vn, 1/2026 |
| **Vietcombank** | ~1% | Chỉ 4 bank giữ coverage >100% | vietnam.vn, 1/2026; VIR, 3/2025 |
| **BIDV** | 1.2% | LN 36,000 tỷ (+12.5%) | vietnam.vn, 1/2026 |
| **VietinBank** | 1% | LN 41,000 tỷ (+37%) | vietnam.vn, 1/2026 |

### 3.3. NPL credit card

**Chưa có nguồn public tại VN.** Không bank nào publish NPL riêng cho segment credit card. Tuy nhiên, credit card là khoản vay unsecured → LGD thường **60–80%** → NPL segment này thường cao hơn secured lending. Cần validate trực tiếp với bank partner.

---

## 4. Fraud — Gian lận

| Metric | Số liệu | Nguồn |
|--------|---------|-------|
| **93%** gian lận phát hành thẻ (card issuance fraud) đến từ giao dịch online | Chủ yếu xuyên biên giới | Visa Vietnam, trích vietnam.vn, 11/2025 |
| Thiệt hại lừa đảo trực tuyến 11 tháng đầu 2025 | >**6,000 tỷ VND** | Bộ Công an, trích vietnam.vn, 1/2026 |
| Tài khoản cá nhân bị đánh cắp Q3/2025 | >**6.5 triệu** (tăng 64% QoQ) | Viettel Cyber Security, trích VietnamNet, 10/2025 |
| Bản ghi dữ liệu doanh nghiệp bị rò rỉ Q3/2025 | >**502 triệu** bản ghi | Viettel Cyber Security, trích VietnamNet, 10/2025 |
| Tổng tấn công mạng nhắm vào tài chính–ngân hàng | **71%** tổng tấn công | Viettel Cyber Security Threat Report 2024, trích VietnamPlus, 4/2025 |
| Tài khoản thanh toán/ví điện tử có dấu hiệu gian lận | **592,000** (tính đến 12/2025) | Vụ Thanh toán NHNN, trích vietnam.vn, 12/2025 |

**Nhận xét:** Fraud tập trung đúng tại điểm origination (93% từ online khi phát hành thẻ). Đây chính xác là điểm AI-CRDS can thiệp — fraud detection layer tích hợp với scoring tại cùng thời điểm nộp hồ sơ.

---

## 5. AI & Digital Banking tại VN

### 5.1. AI đã được triển khai

| Bank/Tổ chức | AI deployment | Chi tiết | Nguồn |
|-------------|--------------|---------|-------|
| **TPBank** | 15+ mô hình ML (IBM Watson) trong 2024 | Deploy time -17% (36→30 ngày); conversion +24%. Chủ yếu propensity model, chưa phải credit scoring tại origination | IBM Case Study, 2024 |
| **TPBank** | 75–80% khách mới từ kênh digital | Chỉ 20–25% từ chi nhánh | The Asian Banker, 2025 |
| **Cake by VPBank** | 40+ AI models | 11 cho credit scoring & fraud, 7 eKYC, 4 generative AI. Pipeline tích hợp scoring + fraud trong 1 flow | The Asian Banker, 2024 |
| **CIC** | Đang áp dụng AI nâng cao hệ thống scoring | Chi tiết chưa public | Nhiều nguồn tham chiếu |

### 5.2. Digital transformation

- **80%+** người trưởng thành sở hữu smartphone; **87%** có tài khoản thanh toán *(GFT/AWS 2025, trích ReportLinker)*
- Giao dịch mobile banking tăng gấp đôi mỗi năm *(GFT/AWS 2025)*
- Digital banking revenue dự kiến vượt **$1 tỷ** *(Statista Market Forecast, trích GFT/AWS 2025)*

---

## 6. Regulatory Landscape — Quy định liên quan

### 6.1. Thông tư 45/2025/TT-NHNN — Quy định mới về thẻ ngân hàng ✅ Verified

**Ban hành:** 19/11/2025 bởi Thống đốc NHNN  
**Hiệu lực:** 5/1/2026  
**Sửa đổi:** Thông tư 18/2024/TT-NHNN về hoạt động thẻ ngân hàng

**Nội dung chính ảnh hưởng đến AI-CRDS:**

**a) Bắt buộc đối chiếu sinh trắc học khi phát hành thẻ:**
- Tổ chức phát hành thẻ (TCPHT) phải gặp mặt trực tiếp khách hàng cá nhân để kiểm tra đối chiếu giấy tờ tùy thân và thông tin sinh trắc học *(Điều 2, Thông tư 45/2025 — luatvietnam.vn; cafef.vn, 26/11/2025)*.

**b) Ngoại lệ cho kênh digital — quan trọng cho digital banks:**
- Nếu khách hàng đăng ký giao dịch trên app/phần mềm ứng dụng cung cấp dịch vụ trực tuyến trong ngành ngân hàng: TCPHT **không bắt buộc gặp mặt trực tiếp** nhưng vẫn phải thực hiện đối chiếu sinh trắc học online + kiểm tra số điện thoại chính chủ *(tapsanluatsunoibo.com, 14/1/2026, trích Thông tư 45 Điều 9 sửa đổi)*.
- Tức là: **digital banks vẫn có thể phát hành thẻ qua app**, nhưng phải có sinh trắc học online (face matching với CCCD chip/VNeID) + verify SĐT chính chủ.

**c) Thẻ chỉ được giao dịch điện tử sau khi đối chiếu sinh trắc học:**
- Thẻ chỉ được sử dụng giao dịch bằng phương tiện điện tử khi đã hoàn thành đối chiếu giấy tờ tùy thân và sinh trắc học *(Điều 16 sửa đổi, Thông tư 45/2025 — thuvienphapluat.vn)*.
- Khách hàng chưa hoàn tất trước 5/1/2026 sẽ bị tạm dừng giao dịch điện tử *(etime.danviet.vn, 5/1/2026)*.

**d) Hạn chế sử dụng thẻ tín dụng:**
- Thẻ tín dụng **không được chuyển khoản** vào tài khoản thanh toán, thẻ ghi nợ, thẻ trả trước, **ví điện tử** *(Điều 16 sửa đổi — thuvienphapluat.vn)*. Quy định mới này ảnh hưởng đến BNPL/fintech dùng CC funding.
- Tổng hạn mức rút tiền mặt tối đa **100 triệu VND/tháng** per BIN *(luatvietnam.vn)*.

**e) Báo cáo gian lận định kỳ:**
- TCPHT phải báo cáo NHNN (trước ngày 10 hàng tháng) qua hệ thống SIMO về các thẻ/chủ thẻ nghi ngờ gian lận *(tapsanluatsunoibo.com, 14/1/2026)*.

**Tác động lên AI-CRDS:**

| Quy định | Impact lên AI-CRDS | Cơ hội |
|----------|-------------------|--------|
| Sinh trắc học bắt buộc | Không ảnh hưởng trực tiếp đến AI scoring logic | Có thể tích hợp biometric matching score như fraud signal trong scoring pipeline |
| Digital bank miễn gặp mặt nếu có sinh trắc online | Digital banks vẫn có thể dùng AI-CRDS trong full digital flow | Value prop AI-CRDS cho digital bank không bị ảnh hưởng |
| CC không chuyển khoản vào ví điện tử | Không ảnh hưởng trực tiếp | Giảm 1 kênh abuse CC → có thể giảm fraud pattern liên quan |
| Báo cáo gian lận qua SIMO | AI-CRDS cần log fraud flags exportable cho SIMO compliance | Thêm 1 compliance feature vào product roadmap |

### 6.2. Các quy định khác đã mapping

| Quy định | Nội dung liên quan | Impact lên AI-CRDS | Nguồn |
|----------|-------------------|-------------------|-------|
| **Nghị định 13/2023/NĐ-CP (PDPD)** | Bảo vệ dữ liệu cá nhân, hiệu lực 1/2026 | Data residency, consent management, DSAR handling, cross-border data transfer rules | IFLR Banking & Finance Guide 2025 |
| **Nghị định 94/2025** | Sandbox cho credit scoring, open API, P2P lending | Giảm rào cản compliance khi triển khai AI scoring — không còn vùng xám pháp lý | ainvest.com, 8/2025; IFLR, 9/2025 |
| **Thông tư 13/2018/TT-NHNN** | Quản lý rủi ro hệ thống thông tin trong ngân hàng | IT security requirements cho AI system tại bank | SBV |
| **Thông tư 41/2016/TT-NHNN** | Basel II capital adequacy | Model risk management, internal rating requirements | SBV |
| **Luật Tổ chức Tín dụng sửa đổi 2025** | Hiệu lực 15/10/2025, provisions mới về xử lý nợ xấu | Collection priority use case (Phase 4) bị ảnh hưởng | IFLR, 9/2025 |

*Chi tiết regulatory mapping sẽ được thiết kế đầy đủ tại Week 2 theo roadmap.*

---

## 7. Nhân sự Credit — Benchmark

### 7.1. Lương Credit Analyst tại VN

| Nguồn | Median | Range | Ghi chú |
|-------|--------|-------|---------|
| Glassdoor Vietnam — Credit Analyst | **18.3 triệu VND/tháng** | 15–22 triệu | 13 mẫu lương, dữ liệu đến 8/2025 |
| SalaryExplorer Vietnam — Credit Risk Analyst | **21.7 triệu VND/tháng** | — | Khảo sát rộng hơn, 2024 |

### 7.2. Productivity benchmark (global — chưa có VN specific)

| Metric | Benchmark | Nguồn |
|--------|-----------|-------|
| % thời gian cho data gathering | **70%** thời gian loan team dành cho thu thập & nhập liệu | Fluxforce, trích McKinsey, 12/2025 |
| Underwriting manual (SME) | **3 ngày** (trước AI) → **30 phút** (sau AI) | Fluxforce, trích UK fintech case, 12/2025 |
| Credit review truyền thống | **Nhiều ngày** → gần **real time** với agentic AI | McKinsey, "The future is agentic", 12/2025 |
| Agentic AI productivity uplift | **40–80%** per use case | McKinsey, "The future is agentic", 12/2025 |
| AI approval time reduction (low-risk) | Tới **90%** | NeonTri, trích Autonomous Research, 9/2025 |
| AI false positive reduction (fraud) | Giảm **50%** false positives | Fluxforce, trích McKinsey & ING case, 12/2025 |

⚠️ Tất cả benchmark trên là global. VN context cần discount **30–50%** do data quality thấp hơn, CIC coverage không đồng đều, bank VN thận trọng hơn khi pilot.

---

## 8. AI Credit Scoring — Global Benchmarks (để tham chiếu, không phải VN)

| Metric | Benchmark | Nguồn | Lưu ý |
|--------|-----------|-------|-------|
| Manual review reduction | Tới **60%** | NeonTri, trích Autonomous Research, 9/2025 | Target VN conservative: 20–30% |
| Loan automation | MNT-Halan: >**50%** phê duyệt tự động | World Economic Forum, 10/2025 | Egypt market, khác VN |
| Default prediction accuracy improvement | **15–25%** so với scorecard truyền thống | NeonTri, 9/2025 | Phụ thuộc data quality |
| Credit loss reduction | Tới **30%** | NeonTri, 9/2025 | Target VN: giữ nguyên NPL đã là win |
| Approval rate increase (giữ nguyên risk) | **+20–30%** | Netguru, trích Zest AI case studies, 1/2026 | Target VN: +5% conservative |
| Scale reference | WeBank, MYBank: >**10 triệu** khoản vay/năm, NPL chỉ **1%** | CTO Magazine, 7/2025 | China market, infrastructure khác VN rất lớn |

⚠️ Đây là benchmark để tham chiếu khi pitch — **KHÔNG phải target promise cho bank VN**. Khi pitch, dùng range conservative và ghi rõ "benchmark global, target VN sẽ được xác định sau pilot."

---

## 9. Tổng hợp — Data có vs Data thiếu

### Có (Verified)

| Metric | Data | Nguồn |
|--------|------|-------|
| CC penetration | ~3% dân số, ~14–15% banked | GFT/AWS 2025; InsightAsia Q1/2025 |
| CC market size | $3.8B giao dịch 2024, +12.5%/năm | InsightAsia Q1/2025 |
| CC market CAGR | 14% (2024–2028), target $100.5B | GlobalData, EPI 8/2024 |
| CC issuance per bank | VPBank 500K, TCB 224K, VIB 142K | vietnam.vn, 11/2025 |
| NPL hệ thống | 4.3% đầu 2025 → 2.01% cuối 2025 (listed banks) | ainvest.com 8/2025; vietnam.vn 1/2026 |
| NPL retail banks | VPB, VIB, OCB cao hơn trung bình | ACBS 2025 |
| Fraud CC | 93% từ online, >6,000 tỷ VND thiệt hại 11 tháng | Visa VN 11/2025; Bộ Công an 1/2026 |
| AI đã dùng tại bank VN | TPBank 15+ ML; Cake 40+ AI models | IBM 2024; Asian Banker 2024 |
| Thông tư 45/2025 | Sinh trắc học bắt buộc, hiệu lực 5/1/2026 | luatvietnam.vn; cafef.vn; thuvienphapluat.vn |
| PDPD | Hiệu lực 1/2026 | IFLR 2025 |
| Nghị định 94/2025 | Sandbox credit scoring | IFLR 9/2025 |
| BNPL | CAGR 58.3%, $2.6B 2025 | PayNXT360 |

### Thiếu (Gap — cần validate với bank partner)

| Metric | Tại sao thiếu | Khi nào fill |
|--------|--------------|-------------|
| NPL riêng credit card | Không bank VN nào publish | Week 13 (Discovery) |
| Approval / reject / manual review rate | Data operational nội bộ | Week 13 |
| Thời gian review 1 hồ sơ CC | Data operational nội bộ | Week 13 |
| Số Credit Officer per bank | Không có nguồn public | Week 13 |
| Hồ sơ CC nộp/ngày (thực tế) | Chỉ có derived estimate | Week 13 |
| Current scoring method per bank | Rules? Scorecard? ML? | Week 13 |
| CIC API latency thực tế | Cần test integration | Week 10 |

---

## Nguồn tham khảo

| # | Nguồn | Nội dung chính | Thời điểm |
|---|-------|---------------|-----------|
| 1 | InsightAsia, trích SBV Annual Banking Report 2024 & Oxford Economics | CC market $3.8B, penetration ~14.3% banked | Q1/2025 |
| 2 | GFT/AWS Financial Services Symposium Hanoi, trích ReportLinker & VIRAC | CC penetration ~3% dân số; 80%+ smartphone; 87% có payment account | 2025 |
| 3 | GlobalData, Electronic Payments International | Card payments CAGR 14%, $100.5B by 2028 | 8/2024 |
| 4 | vietnam.vn — "Thị trường thẻ tín dụng bứt tốc" | VPBank 1.7M CC, 500K mới; TCB 1M CC; VIB 1M CC; doanh số >100 nghìn tỷ mỗi bank | 11/2025 |
| 5 | TPBank website — "Thẻ TPBank phát triển bùng nổ" | CC mới +140% (2023), doanh số 29 nghìn tỷ VND, Visa >$1B/năm | 2024 |
| 6 | VIR — "Bank card circulation hit 157 million in Q1" | 157M thẻ tổng, 50.2M quốc tế, +1.8M Q1/2025 | 5/2025 |
| 7 | VIR — "Cake by VPBank posts strong gains" | 6.2M khách, >1M đơn tín dụng/tháng, income +225%, profitable | 1/2026 |
| 8 | The Asian Banker — Cake digital bank | 40+ AI models (11 credit/fraud, 7 eKYC, 4 genAI) | 2024 |
| 9 | Google Cloud — Cake case study | Vertex AI cho eKYC (FaceAuthen), Gemini Flash cho chatbot | 2024 |
| 10 | Visa VN — Cake card management | First fully cloud-based CMS in VN, Visa Cloud Connect | 11/2024 |
| 11 | IBM Case Study — TPBank | 15+ ML models, deploy time -17%, conversion +24% | 2024 |
| 12 | The Asian Banker — TPBank digital banking | 14M khách, 75–80% digital acquisition, 2M mới 2024 | 2025 |
| 13 | The Asian Banker — TNEX | 3.9M users, licensed finance company, digital-only | 2025 |
| 14 | vietnam.vn — TNEX platform | Approve 5 giây, credit volume digital +343% | 2/2026 |
| 15 | MAS Vietnam Banking Sector Q2/2025 Report | NPL 27 banks +16.5% YTD, ~266 nghìn tỷ VND | Q2/2025 |
| 16 | ACBS Banking Sector 2025 Report | Retail banks (VPB, VIB, OCB) NPL cao hơn; provision +22.2% YoY | 2025 |
| 17 | ainvest.com | NPL ~4.3% đầu 2025 → dự kiến <3% giữa 2026 | 8/2025 |
| 18 | vietnam.vn, trích báo cáo 28 NHTM niêm yết | NPL 2.01% cuối 2025; Sacombank ~7%; BIDV 1.2%; VietinBank 1% | 1/2026 |
| 19 | VIR — "Banks reposition for trend transition" | Market share CC quốc tế H1/2021 | 12/2021 |
| 20 | Vietnam Banking Association, trích TPBank website | ~10.2 triệu thẻ tín dụng toàn thị trường | 2024 |
| 21 | Visa Vietnam, trích vietnam.vn | 93% fraud card issuance từ online | 11/2025 |
| 22 | Bộ Công an, trích vietnam.vn | >6,000 tỷ VND thiệt hại lừa đảo 11 tháng 2025 | 1/2026 |
| 23 | Viettel Cyber Security, trích VietnamNet | 6.5M tài khoản bị đánh cắp Q3/2025; 71% attack vào finance | 10/2025 |
| 24 | Viettel Cyber Security Threat Report 2024, trích VietnamPlus | 71% tấn công mạng nhắm vào tài chính–ngân hàng | 4/2025 |
| 25 | Vụ Thanh toán NHNN, trích vietnam.vn | 592,000 tài khoản gian lận phát hiện đến 12/2025 | 12/2025 |
| 26 | IFLR Banking & Finance Guide 2025 | PDPD hiệu lực 1/2026; Decree 94/2025 sandbox | 9/2025 |
| 27 | PayNXT360, trích Research and Markets | BNPL CAGR 58.3%, $2.6B 2025 | 2025 |
| 28 | Glassdoor Vietnam — Credit Analyst | Lương median ~18.3 triệu VND/tháng | 8/2025 |
| 29 | SalaryExplorer Vietnam — Credit Risk Analyst | Lương median ~21.7 triệu VND/tháng | 2024 |
| 30 | McKinsey — "The future is agentic" | Agentic AI: 40–80% productivity uplift; credit reviews ngày → near real time | 12/2025 |
| 31 | NeonTri, trích Autonomous Research & nhiều nguồn | AI: 15–25% accuracy, 30% credit loss reduction, 90% approval time cut | 9/2025 |
| 32 | CTO Magazine | WeBank/MYBank: >10M loans/năm, NPL 1% | 7/2025 |
| 33 | Netguru, trích Zest AI case studies | +20–30% approval giữ nguyên risk | 1/2026 |
| 34 | World Economic Forum — MNT-Halan | Tự động hóa >50% loan approvals | 10/2025 |
| 35 | Fluxforce, trích McKinsey | 70% thời gian = data gathering; AI fraud detection giảm 50% FP | 12/2025 |
| 36 | FiinGroup — Vietnam Banking/Consumer Finance Report 2024 | Consumer finance: credit growth ì ạch, asset quality xấu | 2024 |
| 37 | Elevate Pay — Top 10 banks VN 2025 | Techcombank LN 24.45 nghìn tỷ; VPBank 18.26 nghìn tỷ (+35.6%) | 2025 |
| 38 | Thông tư 45/2025/TT-NHNN | Sinh trắc học bắt buộc khi phát hành thẻ; CC không chuyển vào ví | luatvietnam.vn |
| 39 | cafef.vn — "Ngân hàng phải gặp trực tiếp khách khi phát hành thẻ" | Thông tư 45 summary, hiệu lực 5/1/2026 | 26/11/2025 |
| 40 | tapsanluatsunoibo.com — Tăng tính bảo mật thẻ ngân hàng | Ngoại lệ digital: không bắt buộc gặp mặt nếu có sinh trắc online + SĐT chính chủ | 14/1/2026 |
| 41 | thuvienphapluat.vn — Sửa đổi phạm vi sử dụng thẻ | CC không chuyển khoản vào ví điện tử; rút tiền mặt max 100M/tháng | 2025 |
| 42 | etime.danviet.vn — Quy định mới nhất về thẻ tín dụng | Chưa hoàn tất sinh trắc trước 5/1/2026 → tạm dừng giao dịch điện tử | 5/1/2026 |

---

## Changelog

| Version | Thay đổi |
|---------|---------|
| v1.0 | Tổng hợp toàn bộ market data từ problem-brief.md, operational-baseline.md, target-bank-profile.md. Thêm Section 6: Thông tư 45/2025 (verified). Thêm Section 8: Global AI benchmarks tách riêng khỏi VN data. Thêm Section 9: Data có vs thiếu. |