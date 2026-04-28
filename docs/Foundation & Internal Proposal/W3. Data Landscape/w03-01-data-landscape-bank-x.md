# Data Landscape Assessment — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Map toàn bộ data sources mà AI-CRDS có thể sử dụng cho CC origination scoring + fraud detection tại ngân hàng thương mại VN. Đánh giá availability, quality, và gaps cho từng source.

**Ký hiệu:**
- ✅ Available — có thể dùng ngay
- ⚠️ Available nhưng cần thêm work (API, permission, format, cleaning)
- ❌ Not available — gap cần address
- ❓ Unknown — cần confirm với IT/Data team tại bank partner

**⚠️ Document này dựa trên generic Vietnamese commercial bank.** Mỗi bank khác nhau đáng kể. Tất cả items đánh dấu ❓ phải validate với bank partner's IT/Data team.

---

## PHẦN A — INTERNAL DATA SOURCES

---

### 1. Core Banking System (CBS)

| Mục | Nội dung |
|-----|---------|
| **Loại hệ thống** | ❓ **Cần confirm.** VN banks thường dùng: Temenos T24 (Techcombank, VPBank, MSB), Oracle Flexcube (VietinBank, BIDV), FIS Profile, hoặc homegrown. Một số bank nhỏ dùng SilverLake hoặc Infosys Finacle. |
| **Data có trong CBS** | Customer profile (demographics, KYC data), account history, existing products (savings, loans, CC hiện tại), transaction history, relationship tenure, internal rating |
| **Availability** | ⚠️ **Có nhưng cần work.** CBS là source-of-truth cho customer data. Hầu hết bank có CBS nhưng access method và data quality khác nhau lớn. |

#### 1.1 Data fields từ CBS

| # | Data field | Mô tả | Dùng cho | Availability | Quality concern |
|---|-----------|-------|---------|-------------|----------------|
| 1 | Customer ID | Unique identifier trong CBS | Matching, dedup | ✅ | Có thể có duplicate nếu bank merge history |
| 2 | Full name | Họ tên khách hàng | Matching CIC, eKYC | ✅ | Unicode/diacritics inconsistency (Nguyễn vs Nguyen) |
| 3 | CCCD/CMND | Số căn cước | Primary key, CIC query, eKYC | ✅ | Một số records còn CMND cũ (9 số) chưa update CCCD (12 số) |
| 4 | Date of birth | Ngày sinh | Age feature, fraud check | ✅ | Format inconsistency (DD/MM/YYYY vs YYYY-MM-DD) |
| 5 | Gender | Giới tính | Bias monitoring ONLY (không dùng cho scoring) | ✅ | |
| 6 | Address | Địa chỉ | Geography feature, fraud check | ⚠️ | Free-text, không chuẩn hóa. Cần parsing/geocoding. |
| 7 | Phone number | SĐT | Contact, SIM verification (TT 45) | ✅ | Có thể outdated nếu khách đổi SĐT |
| 8 | Email | Email | Contact | ⚠️ | Coverage thấp (~40-60% khách có email trong CBS) |
| 9 | Employer / occupation | Nơi làm việc | Employment stability feature | ⚠️ | Thường không update khi khách đổi việc. Self-reported. |
| 10 | Monthly income | Thu nhập khai báo | Core scoring feature | ⚠️ | Self-reported tại thời điểm mở TK. Không auto-update. Cần cross-check với sao kê lương. |
| 11 | Existing products | Danh sách sản phẩm đang có | Cross-sell signal, relationship depth | ✅ | |
| 12 | Account open date | Ngày mở TK | Relationship tenure feature | ✅ | |
| 13 | Account balance history | Lịch sử số dư | Income verification, stability | ⚠️ | Cần aggregate (avg, min, max, std) — raw data volume lớn |
| 14 | Transaction history | Lịch sử giao dịch | Behavioral scoring, income verification | ⚠️ | Volume rất lớn. Cần feature engineering. DLCN nhạy cảm theo NĐ 356. Consent riêng. |
| 15 | Internal risk rating | Xếp hạng rủi ro nội bộ | Scoring input nếu có | ❓ | Không phải bank nào cũng có. Format khác nhau. |
| 16 | Previous CC history | Lịch sử CC cũ (nếu có) | Repayment behavior | ❓ | Chỉ applicable cho existing CC customers |

#### 1.2 Access method

| Method | Mô tả | Latency | Availability |
|--------|-------|---------|-------------|
| **Real-time API** | REST/SOAP API query CBS | Milliseconds — seconds | ❓ Cần confirm. Bank lớn (TCB, VPB) thường có API layer (ESB/API Gateway). Bank nhỏ có thể chưa. |
| **Direct DB query** | Query trực tiếp database CBS | Seconds | ⚠️ Thường có nhưng risky — impact performance CBS. Không recommended cho production. |
| **Batch export** | Export file hàng ngày/tuần | T+1 hoặc chậm hơn | ✅ Hầu hết bank có ETL/batch export. Nhưng stale data cho real-time scoring. |
| **Data warehouse** | Query từ DWH/data lake | Minutes — hours | ❓ Bank lớn có DWH (Oracle, Teradata, BigQuery). Bank nhỏ có thể chưa. |

**Đề xuất cho AI-CRDS:** Real-time API cho critical fields (customer profile, existing products). Batch/DWH cho historical data (transaction history, balance history). Cần discuss với bank IT team.

#### 1.3 Status tại Bank X

❓ **Toàn bộ cần validate:**
- [ ] CBS là hệ thống gì? (T24/Flexcube/homegrown?)
- [ ] Có API layer (ESB/API Gateway) không?
- [ ] API documentation có sẵn không?
- [ ] Data warehouse có không? Technology gì?
- [ ] Có data quality issues đã biết không?
- [ ] Rate limits / maintenance windows?

---

### 2. CIC Integration (Trung tâm Thông tin Tín dụng Quốc gia)

| Mục | Nội dung |
|-----|---------|
| **Tổ chức** | CIC (Credit Information Center) — trực thuộc NHNN |
| **Vai trò** | Cung cấp lịch sử tín dụng, score, nợ hiện tại của khách hàng tại tất cả TCTD |
| **Bắt buộc** | SBV yêu cầu TCTD tra cứu CIC trước khi cấp tín dụng |
| **Availability** | ✅ Tất cả NHTM đều có kết nối CIC |

#### 2.1 Data fields từ CIC

| # | Data field | Mô tả | Dùng cho | Quality |
|---|-----------|-------|---------|---------|
| 1 | CIC Score | Điểm tín dụng CIC (300-900) | Core scoring feature | ✅ Standardized |
| 2 | Credit history | Lịch sử vay + trả nợ tại tất cả TCTD | Core scoring feature | ✅ |
| 3 | Outstanding debt | Tổng dư nợ hiện tại | DTI calculation | ✅ |
| 4 | Number of credit facilities | Số khoản vay đang có | Over-indebtedness check | ✅ |
| 5 | Delinquency history | Lịch sử chậm trả (DPD 30/60/90+) | Core scoring feature | ✅ |
| 6 | Number of inquiries | Số lần bị tra cứu CIC gần đây | Credit hunger signal | ✅ |
| 7 | Credit card utilization | Tỷ lệ sử dụng hạn mức CC hiện tại | Risk signal | ⚠️ Có thể T+1 (không real-time) |
| 8 | Group debt (nếu có) | Nợ liên đới (bảo lãnh) | Hidden liability | ⚠️ Coverage không đầy đủ |

#### 2.2 Integration details

| Mục | Nội dung | Status |
|-----|---------|--------|
| **Phương thức** | ❓ Cần confirm: API (Web Service) hay Web Portal query manual? Bank lớn thường có API tự động. Bank nhỏ có thể query manual qua portal CIC. | ❓ |
| **Response time** | API: 5-30 giây. Manual portal: 1-5 phút. | ❓ |
| **Coverage** | ~70-80% applicants có CIC record (ước tính). Khách new-to-credit sẽ không có → cần xử lý "thin file" case. | ⚠️ |
| **Update frequency** | TCTD báo cáo cho CIC hàng tháng hoặc hàng ngày (tùy bank). Data có thể delay 1-30 ngày. | ⚠️ |
| **Cost** | Mỗi query CIC có phí. Cần budget cho volume scoring. | ❓ |
| **Retry/fallback** | CIC timeout → cần retry logic. Nếu CIC down → manual fallback? | ❌ Cần design |

#### 2.3 "Thin File" Problem

Khách hàng không có CIC record (~20-30% applicants dự kiến):

| Scenario | Xử lý đề xuất |
|---------|---------------|
| New-to-credit (chưa bao giờ vay) | Scoring dựa trên alternative data: employment, income, bank transaction history (nếu existing customer) |
| New-to-country | Rất hiếm cho salaried segment. Route to manual review. |
| CIC data outdated (>6 tháng) | Flag cho CO. Weight CIC score thấp hơn trong model. |
| CIC timeout/error | Retry 3 lần. Nếu vẫn fail → route to manual review với flag "CIC unavailable." |

#### 2.4 Status tại Bank X

❓ **Cần validate:**
- [ ] CIC integration: API tự động hay manual query?
- [ ] Response time trung bình?
- [ ] Bao nhiêu % applicants có CIC record?
- [ ] Chi phí per query?
- [ ] CIC downtime frequency?
- [ ] Thin file rate hiện tại?

---

### 3. eKYC System

| Mục | Nội dung |
|-----|---------|
| **Chức năng** | Xác minh danh tính khách hàng: đối chiếu CCCD, sinh trắc học (khuôn mặt), liveness detection |
| **Bắt buộc** | TT 45/2025: bắt buộc đối chiếu sinh trắc khi phát hành thẻ. Digital bank: online biometric OK. |
| **Availability** | ✅ Hầu hết bank có eKYC (bắt buộc từ TT 45). Provider khác nhau. |

#### 3.1 eKYC Output

| # | Output field | Mô tả | Dùng cho |
|---|-------------|-------|---------|
| 1 | Identity verification result | Pass / Fail | Gate check (fail → reject hoặc manual) |
| 2 | Confidence score | 0-100% | Fraud risk signal |
| 3 | Liveness detection result | Pass / Fail | Anti-spoofing |
| 4 | CCCD data extraction | OCR từ ảnh CCCD: tên, CCCD, ngày sinh | Auto-fill application, cross-check CBS |
| 5 | Face match score | Đối chiếu khuôn mặt vs ảnh CCCD | Fraud detection |
| 6 | Document authenticity | Thật / Giả / Nghi ngờ | Document fraud |

#### 3.2 Provider landscape

| Provider | Market share (ước tính) | Lưu ý |
|---------|----------------------|-------|
| VNPT | Lớn nhất — kết nối CSDL quốc gia BCA | Độ chính xác cao nhờ data gốc BCA |
| FPT.AI | Phổ biến ở bank | AI-powered, nhiều bank dùng |
| VNG / Zalo AI | Đang mở rộng | Ecosystem Zalo |
| Napas eKYC | Mới | Liên kết với hạ tầng thanh toán quốc gia |
| In-house | Một số bank lớn build riêng | Control nhưng cost cao |

#### 3.3 AI-CRDS integration design

**AI-CRDS KHÔNG lưu raw biometric data.** Chỉ nhận kết quả từ eKYC:

```
eKYC Provider
    │
    │  [Raw biometric data xử lý tại eKYC provider]
    │
    ▼
AI-CRDS nhận:
├── identity_verified: true/false
├── confidence_score: 0.95
├── liveness_passed: true/false
├── face_match_score: 0.92
├── document_authentic: true/false
└── extracted_data: {name, cccd, dob} (for cross-check only)
```

**Lý do:** Data minimization (Luật BVDLCN). AI-CRDS không cần raw biometric để scoring. Pass/fail + confidence đủ cho fraud detection layer.

#### 3.4 Status tại Bank X

❓ **Cần validate:**
- [ ] eKYC provider hiện tại là gì?
- [ ] Output format: API response hay file?
- [ ] Biometric data lưu ở đâu? (eKYC provider / bank / cả hai?)
- [ ] TT 45/2025 compliance status?
- [ ] Uptime / reliability?
- [ ] Cost per verification?

---

### 4. Existing Scoring System

| Mục | Nội dung |
|-----|---------|
| **Loại** | ❓ **Cần confirm.** Có thể: (a) Rules engine (if-then), (b) Statistical scorecard (logistic regression), (c) Vendor solution (FICO, Experian), (d) Homegrown ML, (e) 100% manual (không có scoring system) |
| **Availability** | ❓ Phụ thuộc bank. Bank lớn thường có scorecard. Bank nhỏ/mới có thể chưa. |

#### 4.1 Scenarios tùy bank

| Scenario | Impact lên AI-CRDS | Strategy |
|---------|-------------------|---------|
| **(a) Bank có scorecard mature** | Có benchmark để so sánh. Có historical performance data. Champion-Challenger dễ setup. | AI-CRDS chạy song song (shadow mode) rồi so sánh với scorecard hiện tại. |
| **(b) Bank có rules engine đơn giản** | Có baseline nhưng không có statistical model. | AI-CRDS thay thế rules engine. Cần historical data để train model. |
| **(c) Bank dùng vendor (FICO)** | Vendor lock-in concern. Cần hiểu vendor output format. | AI-CRDS có thể complement (không thay thế ngay). |
| **(d) Bank chưa có scoring** | Không có benchmark. Không có historical performance data. Cold start problem. | Cần synthetic data hoặc industry benchmark. Pilot cautiously. |

#### 4.2 Nếu bank có scoring system — cần lấy thông tin

- [ ] Loại model: rules / scorecard / ML?
- [ ] Features đang dùng? (danh sách)
- [ ] Output format: score range? decision categories?
- [ ] Performance metrics hiện tại: Gini? KS? AUC?
- [ ] Approval rate hiện tại?
- [ ] NPL rate theo vintage?
- [ ] Override rate (CO override scoring recommendation)?
- [ ] Scorecard được develop bởi ai? (internal / vendor?)
- [ ] Lần cuối update/recalibrate?

---

### 5. Historical Credit Data

| Mục | Nội dung |
|-----|---------|
| **Vai trò** | Training data cho ML model. Đây là data quan trọng nhất cho model quality. |
| **Availability** | ❓ Phụ thuộc bank. Bank lớn có nhiều năm data. Bank nhỏ/mới có thể ít. |

#### 5.1 Data requirements cho model training

| Requirement | Minimum | Ideal | Lý do |
|------------|---------|-------|-------|
| **Vintage depth** | 2 năm | 5+ năm | Cần ít nhất 1 full credit cycle. 2 năm = minimum statistical significance. 5+ năm cover economic cycles (COVID, etc.) |
| **Sample size** | 10,000 labeled records | 50,000+ | Logistic regression: 10K ok. Gradient boosting: 50K+ tốt hơn. Deep learning: 100K+. |
| **Default definition** | DPD 90+ | Align Basel II definition | DPD 90+ là standard. Nhưng cần confirm bank dùng definition nào. |
| **Label quality** | Default / Non-default binary | + Write-off, + Recovery rate | Binary minimum. Thêm granularity (DPD 30/60/90/write-off) tốt hơn. |
| **Class imbalance** | Default rate 2-8% (CC typical) | N/A | CC default rate VN ước tính 3-6%. Class imbalance → cần SMOTE / undersampling / cost-sensitive learning. |
| **Feature completeness** | >80% non-null cho core features | >95% | Missing data > 20% → feature có thể unusable. |

#### 5.2 Data quality scorecard template

| # | Dimension | Question | Score (1-5) | Status |
|---|----------|---------|------------|--------|
| 1 | **Completeness** | Bao nhiêu % records có đủ core features? | ❓ | Cần validate |
| 2 | **Accuracy** | Data có khớp với source-of-truth (CIC, eKYC)? | ❓ | Cần validate |
| 3 | **Consistency** | Format nhất quán across years? (date format, currency, encoding) | ❓ | Cần validate |
| 4 | **Timeliness** | Data update frequency? Stale data rate? | ❓ | Cần validate |
| 5 | **Uniqueness** | Duplicate records? Customer dedup? | ❓ | Cần validate |
| 6 | **Validity** | Values within expected ranges? Outliers? | ❓ | Cần validate |
| **Overall** | | | ❓ | **Target: ≥3.5/5 để train model** |

#### 5.3 Status tại Bank X

❓ **Cần validate (quan trọng nhất cho model development):**
- [ ] Bao nhiêu năm historical CC data?
- [ ] Bao nhiêu records (approved + rejected)?
- [ ] Default rate theo vintage?
- [ ] Default definition đang dùng? (DPD 30/60/90/write-off?)
- [ ] Reject inference: có data cho rejected applicants không? (survivorship bias issue)
- [ ] Data lưu ở đâu? (CBS / DWH / files?)
- [ ] Có thể export không? Format gì?
- [ ] Data quality issues đã biết?

---

## PHẦN B — EXTERNAL DATA SOURCES

---

### 6. CIC Bureau Data (External perspective)

Đã cover chi tiết tại Section 2. Tóm tắt từ góc external:

| Mục | Nội dung |
|-----|---------|
| **Score types** | CIC Score (300-900), Credit History Report, Debt Summary Report |
| **History depth** | Tối đa 5 năm lịch sử (tùy data availability) |
| **Update frequency** | TCTD report monthly hoặc daily → CIC data có thể delay 1-30 ngày |
| **Availability** | ✅ Bắt buộc cho mọi TCTD. API hoặc portal. |
| **Limitation** | Chỉ cover formal credit (TCTD). Không cover informal lending, buy-now-pay-later, etc. |

---

### 7. Government Data

| # | Data source | Cơ quan | Data content | Dùng cho | Availability | Lưu ý |
|---|-----------|--------|-------------|---------|-------------|-------|
| 7.1 | **CCCD verification** | Bộ Công an (BCA) | Xác minh CCCD qua CSDL quốc gia về dân cư | Identity verification, fraud detection | ⚠️ **Qua eKYC provider** — VNPT có kết nối trực tiếp BCA. Bank không query trực tiếp. | Đã cover qua eKYC (Section 3) |
| 7.2 | **Tax records** | Tổng cục Thuế (GDT) | Thông tin thuế TNCN, thu nhập khai thuế | Income verification | ❌ **Không available** cho TCTD query trực tiếp. Khách có thể cung cấp tờ khai thuế bản cứng. | Không có API. Manual only nếu khách cung cấp. |
| 7.3 | **Social insurance (BHXH)** | Bảo hiểm Xã hội VN | Đóng BHXH → verify employment + income | Employment verification, income cross-check | ⚠️ **Hạn chế.** VssID app cho phép tra cứu cá nhân. Chưa có API cho TCTD. Một số bank hợp tác lấy data qua consent khách hàng. | Potential future source. Cần monitor. |
| 7.4 | **Business registration** | Sở KH&ĐT | Đăng ký doanh nghiệp | Verify employer existence | ⚠️ Tra cứu online tại dangkykinhdoanh.gov.vn nhưng không có API chính thức. | Dùng cho fraud check (employer có tồn tại không) |
| 7.5 | **Court records** | Tòa án | Bản án, quyết định thi hành án | Fraud / legal risk | ❌ **Không có API.** Tra cứu thủ công congbobanan.toaan.gov.vn. Coverage thấp. | Không practical cho automated scoring |

---

### 8. Alternative Data

| # | Data source | Data content | Dùng cho | Availability | Quality | Legal concern |
|---|-----------|-------------|---------|-------------|---------|-------------|
| 8.1 | **Telco data** | Call/SMS patterns, data usage, top-up behavior, contract type | Credit risk proxy cho thin-file customers | ❌ **Không available trực tiếp.** Viettel/Mobifone/Vinaphone chưa có data sharing agreement chuẩn cho credit scoring. Một số fintech (FE Credit, Home Credit) có deal riêng. | ⚠️ Noisy, privacy concerns | NĐ 356: dữ liệu viễn thông = nhạy cảm. Consent riêng bắt buộc. NĐ 94 sandbox có thể enable. |
| 8.2 | **Utility payments** | Lịch sử thanh toán điện/nước/internet | Payment discipline proxy | ❌ **Không available.** EVN, cấp nước chưa có API cho TCTD. | ⚠️ Coverage thấp (không phải ai cũng đứng tên) | Consent cần |
| 8.3 | **E-commerce** | Purchase history, return rate, spending pattern | Behavioral signal | ❌ **Không available.** Shopee/Lazada/Tiki không chia sẻ data với bank. | ❓ | Privacy concerns lớn |
| 8.4 | **Social media** | Profile data, connections, activity | Fraud detection, identity verification | ❌ **KHÔNG SỬ DỤNG.** | N/A | NĐ 356: dữ liệu hành vi online = nhạy cảm. Luật AI 134/2025: không phân biệt đối xử. Social media scoring có bias risk rất cao. **Không recommend.** |
| 8.5 | **Device/browser data** | Device fingerprint, IP, geolocation | Fraud detection (not scoring) | ⚠️ **Có thể thu thập** khi khách apply online. | OK cho fraud | Chỉ dùng cho fraud detection, không dùng cho credit scoring. Consent cần. |
| 8.6 | **Payroll data** | Sao kê lương từ bank (nếu existing customer nhận lương qua bank) | Income verification — gold standard | ⚠️ **Conditional.** Chỉ available nếu khách nhận lương qua bank partner. | ✅ Rất tốt | Internal data nếu existing customer. Target segment "salaried" → data này rất valuable. |

**Kết luận Alternative Data:** Đa số không available hoặc có quá nhiều legal/quality concerns. **AI-CRDS v1 nên focus 100% vào traditional data** (CBS + CIC + eKYC + payroll nếu có). Alternative data chỉ explore khi đã prove model v1 + có sandbox framework.

---

## PHẦN C — FEATURE AVAILABILITY MATRIX

Matrix tổng hợp features cho CC Salaried Origination Scoring:

### Core Features (MUST HAVE)

| # | Feature | Source | Type | Availability | Priority |
|---|---------|--------|------|-------------|----------|
| F1 | Age | CBS (DOB) | Numeric | ✅ | Core |
| F2 | Monthly income (declared) | Application form | Numeric | ✅ | Core |
| F3 | Income verified (payroll) | CBS transaction / payslip | Numeric | ⚠️ Chỉ existing customers nhận lương qua bank | Core nếu available |
| F4 | Employment tenure | Application form | Numeric (months) | ⚠️ Self-reported, cần verify | Core |
| F5 | Employer type | Application form | Categorical | ⚠️ Cần standardize (SOE / FDI / Private / etc.) | Core |
| F6 | CIC Score | CIC API | Numeric (300-900) | ✅ | Core |
| F7 | Total outstanding debt | CIC | Numeric | ✅ | Core |
| F8 | Debt-to-Income ratio | Calculated (F7 / F2) | Numeric | Derived | Core |
| F9 | Number of active loans | CIC | Numeric | ✅ | Core |
| F10 | Max DPD last 12 months | CIC | Numeric | ✅ | Core |
| F11 | Number of CIC inquiries (6M) | CIC | Numeric | ✅ | Core |
| F12 | Relationship tenure (bank) | CBS (account open date) | Numeric (months) | ✅ Nếu existing customer. 0 nếu new. | Core |

### Secondary Features (NICE TO HAVE)

| # | Feature | Source | Type | Availability | Priority |
|---|---------|--------|------|-------------|----------|
| F13 | Average account balance (3M) | CBS | Numeric | ⚠️ Existing customers only | Secondary |
| F14 | Salary credit frequency | CBS transaction | Numeric | ⚠️ Existing customers, nhận lương qua bank | Secondary |
| F15 | Number of existing bank products | CBS | Numeric | ✅ Existing customers | Secondary |
| F16 | CC utilization (existing CC) | CBS / CIC | Percentage | ⚠️ Nếu có CC hiện tại | Secondary |
| F17 | Geography (district/city) | CBS address | Categorical | ⚠️ Cần geocoding từ free-text address | Secondary |
| F18 | Education level | Application form | Categorical | ⚠️ Nhiều bank không thu thập | Secondary |
| F19 | Marital status | Application form | Categorical | ⚠️ Có thể unavailable hoặc self-reported | Secondary |
| F20 | eKYC confidence score | eKYC provider | Numeric | ✅ | Fraud feature |
| F21 | eKYC face match score | eKYC provider | Numeric | ✅ | Fraud feature |
| F22 | Device fingerprint | Online application | Categorical | ⚠️ Online channel only | Fraud feature |

### Protected Attributes (BIAS MONITORING ONLY — KHÔNG dùng cho scoring)

| # | Attribute | Source | Monitoring purpose |
|---|----------|--------|-------------------|
| P1 | Gender | CBS | Equal approval rate across gender |
| P2 | Geography (province) | CBS | Urban vs rural bias check |
| P3 | Age group | CBS | Age discrimination check |

---

## PHẦN D — SYNTHETIC DATA STRATEGY

### Khi nào cần synthetic data?

| Scenario | Cần synthetic? | Approach |
|---------|---------------|---------|
| Bank chưa có historical data | ✅ Có | Generate synthetic dataset modeled theo VN banking distribution |
| Demo / internal presentation | ✅ Có | Synthetic + realistic (nhưng không phải real customer data) — comply PDPD |
| Model development / testing | ⚠️ Tùy | Prefer real (anonymized) data. Synthetic chỉ khi real không available. |
| Model training production | ❌ Không | Phải dùng real data (anonymized/pseudonymized) |

### Synthetic data principles

1. **Statistical properties phải match** VN market: income distribution, default rate (~3-6% CC), age distribution, geography distribution
2. **KHÔNG bao giờ dùng synthetic data cho production model training** — chỉ cho demo, testing, development
3. **Ghi nhãn rõ** "SYNTHETIC DATA — NOT REAL CUSTOMERS" trên mọi output
4. **Format phải match** real data format để code/pipeline có thể reuse khi chuyển sang real data

---

## PHẦN E — DATA GAPS & RECOMMENDATIONS

### Gap Summary

| # | Gap | Severity | Impact | Mitigation |
|---|-----|---------|--------|-----------|
| G1 | **Historical data depth unknown** | 🔴 HIGH | Không đủ data → model underperforms | Validate với bank IT. Minimum 2 năm. Nếu thiếu → explore data enrichment hoặc transfer learning. |
| G2 | **Income verification weak** | 🟡 MEDIUM | Self-reported income unreliable | Cross-check với payroll (nếu existing customer), CIC debt, bank balance |
| G3 | **Address not standardized** | 🟡 MEDIUM | Geography feature unusable | Build address parsing/geocoding pipeline |
| G4 | **Thin file (~20-30% applicants)** | 🔴 HIGH | Không có CIC data cho scoring | Alternative scoring model cho thin-file segment. Rely on CBS data + eKYC. |
| G5 | **CIC integration method unknown** | 🟡 MEDIUM | Manual query = bottleneck | Cần API. Nếu chưa có → priority IT project. |
| G6 | **Reject inference** | 🟡 MEDIUM | Survivorship bias nếu chỉ train trên approved applications | Explore reject inference techniques. Hoặc accept bias + monitor. |
| G7 | **Alternative data not available** | 🟢 LOW | Thin file scoring limited | V1 focus traditional data. V2 explore alternative (sandbox). |
| G8 | **Data quality unknown** | 🔴 HIGH | Bad data → bad model | Data quality audit trước khi train. Scorecard Section 5.2. |

---

## Tracking — Tự hỏi cuối tuần

- [ ] Đã meeting với IT/Data team chưa?
- [ ] CBS là hệ thống gì? Có API không?
- [ ] CIC integration: API hay manual?
- [ ] eKYC provider là gì? Output format?
- [ ] Có scoring system hiện tại không? Performance metrics?
- [ ] Historical data: bao nhiêu năm? Bao nhiêu records? Default rate?
- [ ] Data quality scorecard đã evaluate chưa?
- [ ] Thin file rate ước tính?
- [ ] Gaps G1, G4, G8 (HIGH) có plan address?

---

## Ghi Chú & Limitations

1. **Document này dựa trên generic VN bank.** Mỗi bank khác nhau rất lớn. Phải validate từng item.
2. **Alternative data (telco, e-commerce)** chưa practical tại VN cho CC scoring. Focus traditional data.
3. **Social media data: KHÔNG SỬ DỤNG** — bias risk, privacy risk, legal risk (NĐ 356 + Luật AI 134/2025).
4. **Data quality là risk lớn nhất** — "garbage in, garbage out." Data quality audit phải làm TRƯỚC khi train model.
5. **PDPD compliance** ảnh hưởng data access: mọi data từ CBS, CIC, eKYC phải có consent. Xem pdpd-impact-assessment.md v1.1.
6. **Cross-reference:** pdpd-impact-assessment.md (data inventory, consent), sbv-requirements.md (audit trail, CIC requirement), regulatory-mapping.md (TT 45 eKYC, NĐ 94 sandbox).