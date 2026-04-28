# Problem Brief — AI Credit Risk Decision Support
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## 1. Problem Statement

Digital banks tại Việt Nam đang đối mặt với một nghịch lý: phải phát hành thẻ tín dụng nhanh hơn trong khi rủi ro tín dụng đang tăng.

**Phía cầu — thị trường đang mở rất nhanh:**

- Credit card penetration chỉ **~3% tổng dân số**, tương đương khoảng **14–15% dân số có tài khoản ngân hàng** *(GFT/AWS Financial Services Industry Symposium Hanoi 2025, trích ReportLinker & VIRAC Q1/2025; InsightAsia Q1/2025, trích SBV Annual Banking Report 2024)*.
- Thị trường credit card VN đạt khoảng **$3.8 tỷ** giao dịch năm 2024, tăng trưởng **12.5%/năm** *(InsightAsia Q1/2025, trích SBV Annual Banking Report 2024 & Oxford Economics)*.
- Card payments dự kiến đạt CAGR **14%** giai đoạn 2024–2028, hướng tới **$100.5 tỷ** vào 2028 *(GlobalData, Electronic Payments International, 8/2024)*.

Các bank đang chạy đua phát hành → volume hồ sơ origination tăng nhanh, áp lực lên capacity thẩm định.

**Phía rủi ro — NPL tăng, fraud nghiêm trọng:**

- NPL ratio toàn hệ thống đầu 2025 ở mức **~4.3%** *(ainvest.com, 8/2025)*; NPL trung bình 28 ngân hàng niêm yết cuối 2025 là **2.01%** *(vietnam.vn, trích báo cáo 28 ngân hàng niêm yết, 1/2026)*. Tổng NPL 27 ngân hàng niêm yết tăng **16.5% YTD**, đạt gần **266 nghìn tỷ VND** trong Q2/2025 *(MAS Vietnam Banking Sector Q2/2025 Report)*.
- Các bank chuyên retail (VPB, VIB, OCB) có NPL và nợ nhóm 2 **cao hơn trung bình ngành** *(ACBS Banking Sector 2025 Report)*. NPL riêng mảng credit card chưa có nguồn public tại VN — cần validate trực tiếp với bank partner, nhưng credit card là khoản vay unsecured nên NPL segment này thường cao hơn secured lending.
- **93%** gian lận phát hành thẻ (card issuance fraud) đến từ giao dịch online, chủ yếu xuyên biên giới *(Visa Vietnam, trích vietnam.vn, 11/2025)* — tức fraud xảy ra ngay tại thời điểm nộp hồ sơ và phát hành, chính xác là điểm AI-CRDS can thiệp.

**Điểm nghẽn — manual review không scale được:**

- Loan teams dành tới **70% thời gian làm việc** chỉ để thu thập và nhập liệu từ hồ sơ, bảng kê ngân hàng, và tài liệu tài chính *(Fluxforce/McKinsey, 12/2025)*. Đây là tỷ lệ **thời gian**, không phải tỷ lệ hồ sơ cần manual review — một phần lớn hồ sơ vẫn có thể auto-approve/auto-reject nếu data gathering được tự động hóa bởi AI. Tỷ lệ hồ sơ thực tế cần manual review tùy ngân hàng (ước tính 40–70% tại các bank thuần retail, chưa verified — xem decision-frequency.md).
- Credit reviews thủ công mất **nhiều ngày** — trong khi fintech competitors approve trong vài phút *(McKinsey, "The future is agentic", 12/2025)*.
- Khi volume tăng 2–3x do campaign phát hành, bank phải chọn: tuyển thêm người (tốn tiền), giảm quality review (tăng NPL), hoặc reject nhiều hơn (mất revenue). Cả 3 đều không bền.

**Tóm lại:** Bank cần duyệt nhanh hơn để cạnh tranh, nhưng duyệt nhanh hơn bằng manual → sai nhiều hơn → NPL tăng → SBV siết. Đây là bài toán chỉ giải được bằng AI-assisted decision support tại điểm origination.

---

## 2. Ai bị ảnh hưởng — vai trò cụ thể

### Credit Officer / Credit Analyst — người dùng chính

Người trực tiếp review hồ sơ, chịu áp lực volume. Lương trung bình **15–22 triệu VND/tháng**, median khoảng **18.3 triệu** *(Glassdoor Vietnam, Credit Analyst, dữ liệu đến 8/2025 — 13 mẫu lương)*, hoặc **21.7 triệu VND/tháng** median theo khảo sát rộng hơn *(SalaryExplorer Vietnam, Banking — Credit Risk Analyst, 2024)*. Bị quá tải khi volume tăng → quyết định kém hoặc chậm → ảnh hưởng NPL và customer experience.

### Risk Manager / Head of Credit — buyer tiềm năng

Chịu trách nhiệm NPL ratio toàn danh mục. Khi NPL tăng → phải tăng provision → ăn vào lợi nhuận. Chỉ **4 ngân hàng** (Vietcombank, VietinBank, BIDV, Techcombank) duy trì được tỷ lệ phủ nợ xấu trên 100% *(VIR, 3/2025)*. Đây là người có động lực lớn nhất để tìm giải pháp.

### Head of Cards / Business Owner — người quyết định budget

Chịu P&L mảng thẻ. Áp lực tăng approval rate và phát hành nhanh để đạt target. Nhưng nếu approve nhầm → NPL tăng → ảnh hưởng trực tiếp P&L. Thường là người quyết định budget mua SaaS.

### Compliance Officer — blocker nếu không comply

SBV siết chặt hơn. Luật Bảo vệ dữ liệu cá nhân (PDPD) có hiệu lực **tháng 1/2026** *(IFLR Banking & Finance Guide 2025)*. Nghị định 94/2025 tạo sandbox cho credit scoring *(IFLR, 9/2025)*. Mọi quyết định credit cần audit trail và explainability.

### CTO / IT — blocker nếu integration phức tạp

Chịu trách nhiệm integration với Core Banking (T24, Flexcube, homegrown). CTO sẽ block deal nếu integration quá phức tạp hoặc security không đạt chuẩn.

### Khách hàng — người chờ đợi và bỏ đi

Approval time chậm (3–7 ngày) trong khi BNPL approve trong phút → khách bỏ sang đối thủ. Thị trường BNPL VN tăng CAGR **58.3%** giai đoạn 2021–2024, dự kiến đạt **$2.6 tỷ** năm 2025 *(PayNXT360, trích Research and Markets)* — cạnh tranh trực tiếp với credit card.

---

## 3. Hậu quả nếu không giải — con số thiệt hại

### Thiệt hại từ NPL

- Tổng NPL 27 ngân hàng niêm yết: gần **266 nghìn tỷ VND** (~$10.6 tỷ) trong Q2/2025 *(MAS Vietnam Banking Sector Q2/2025 Report)*.
- Provision expenses dự kiến tăng **22.2% YoY** năm 2025 *(ACBS Banking Sector 2025 Report)*.
- Ví dụ cụ thể: Sacombank có NPL **tổng** gần **7%** cho dư nợ khách hàng (4.95% cho tổng dư nợ tín dụng), tỷ lệ phủ nợ xấu chỉ **49.2%**, chi phí trích lập dự phòng năm 2025: **11,157 tỷ VND** — là nguyên nhân chính khiến bank không đạt kế hoạch kinh doanh *(vietnam.vn, 1/2026)*. Đây là NPL tổng bao gồm tất cả sản phẩm tín dụng, không riêng credit card — nhưng cho thấy áp lực provision khi NPL cao tác động trực tiếp đến profitability.
- Credit card là khoản vay unsecured → LGD (Loss Given Default) thường **60–80%** — mất gần hết khi khách default. Đây là lý do NPL credit card đặc biệt đau: không có tài sản bảo đảm để thu hồi.

### Thiệt hại từ fraud

- Thiệt hại lừa đảo trực tuyến: hơn **6,000 tỷ VND** trong 11 tháng đầu 2025 *(Bộ Công an, trích vietnam.vn, 1/2026)*.
- Q3/2025: hơn **6.5 triệu** tài khoản cá nhân bị đánh cắp (tăng 64% QoQ), hơn **502 triệu** bản ghi dữ liệu doanh nghiệp bị rò rỉ. Tài chính-ngân hàng bị ảnh hưởng nặng nhất *(Viettel Cyber Security, trích VietnamNet, 10/2025)*.
- **71%** tổng tấn công mạng nhắm vào ngành tài chính-ngân hàng *(Viettel Cyber Security Threat Report 2024, trích VietnamPlus, 4/2025)*.
- NHNN đã phát hiện **592,000** tài khoản thanh toán/ví điện tử có dấu hiệu gian lận tính đến 12/2025 *(Vụ Thanh toán NHNN, trích vietnam.vn, 12/2025)*.
- **93%** gian lận phát hành thẻ đến từ giao dịch online *(Visa VN, 11/2025)* — fraud xảy ra ngay tại thời điểm nộp hồ sơ và phát hành, chính xác là điểm AI-CRDS can thiệp để chặn trước khi giải ngân/phát hành thẻ.

### Thiệt hại từ thẩm định chậm (lost revenue)

- BNPL tăng CAGR **58.3%** (2021–2024), đạt **$2.6 tỷ** năm 2025 *(PayNXT360)* — đối thủ trực tiếp cạnh tranh khách hàng credit card.
- Với penetration chỉ ~3% dân số, mỗi khách hàng bỏ đi vì chờ lâu là revenue mất vĩnh viễn trong thị trường đang tăng trưởng.

### Chi phí vận hành manual

- 1 Credit Analyst lương ~**18–22 triệu/tháng** *(Glassdoor Vietnam 8/2025; SalaryExplorer Vietnam Banking 2024)*.
- Loan teams dành tới **70% thời gian làm việc** cho data gathering & entry *(Fluxforce/McKinsey, 12/2025)* — phần lớn thời gian này có thể tự động hóa, giải phóng analyst cho judgment thực sự.
- Muốn tăng volume gấp đôi bằng manual → tuyển thêm tương ứng → team 10 analysts tốn ~**2.2–2.6 tỷ VND/năm** chỉ riêng nhân sự.

---

## 4. Outcome Target — muốn đạt gì

4 outcomes chính, xếp theo thứ tự ưu tiên:

1. **Giảm manual review rate** — giải phóng capacity Credit Officer cho cases cần human judgment. Đo được ngay tuần đầu pilot.
2. **Giảm time-to-decision** — cạnh tranh được với fintech/BNPL. Đo được ngay khi deploy.
3. **Giữ hoặc giảm NPL** — chứng minh AI không tăng rủi ro. Early signals 30–90 ngày, confirm 6–12 tháng.
4. **Phát hiện fraud tại origination** — giảm fraud loss, đo bằng fraud cases caught vs missed.

**Metric ownership trong bank:**

| Metric | Owner chính trong bank |
|--------|----------------------|
| NPL ratio, fraud loss | Risk Manager / CRO |
| Approval rate, time-to-decision | Head of Cards / Business Owner |
| Manual review rate, analyst productivity | Credit Head / Head of Credit Operations |
| Audit trail, PDPD compliance | Compliance Officer |
| System uptime, integration SLA | CTO / IT |

---

## 5. Con số target cụ thể

Target chia thành **Conservative** (thận trọng, phù hợp pilot) và **Optimistic** (lạc quan, khi đã proven). Lý do conservative hơn benchmark global: data VN chưa chuẩn hóa bằng US/EU, CIC coverage một số segment còn thấp, bank VN thận trọng hơn khi pilot.

### 5.1. Manual Review Reduction

| | Benchmark | Target VN Conservative | Target VN Optimistic |
|---|-----------|----------------------|---------------------|
| Mức giảm | Tới **60%** *(NeonTri, trích Autonomous Research, 9/2025)* | **20–30%** | **40–50%** |
| Benchmark khác | MNT-Halan tự động hóa **>50%** phê duyệt khoản vay *(World Economic Forum, 10/2025)* | | |

### 5.2. Time-to-Decision

| | Benchmark | Target VN Conservative | Target VN Optimistic |
|---|-----------|----------------------|---------------------|
| Tốc độ | Approval times giảm tới **90%** cho low-risk *(NeonTri, 9/2025)* | Toàn bộ flow: **3–7 ngày → 1–2 ngày** | Toàn bộ flow: **vài giờ** cho auto-cases |
| Benchmark khác | Credit reviews mất nhiều ngày → có thể hoàn thành gần **real time** với AI *(McKinsey, 12/2025)* | AI scoring per case: **<5 phút** | AI scoring per case: **<1 phút** |

### 5.3. NPL Impact

| | Benchmark | Target VN Conservative | Target VN Optimistic |
|---|-----------|----------------------|---------------------|
| Accuracy | AI cải thiện **15–25%** độ chính xác default prediction, giảm credit losses **30%** *(NeonTri, 9/2025)* | Giữ nguyên NPL hoặc **-10 bps** | **-20 đến -30 bps** |
| Benchmark khác | WeBank, MYBank: **>10 triệu** khoản vay/năm, NPL chỉ **1%** *(CTO Magazine, 7/2025)* | | |
| Approval rate | Zest AI: tăng **20–30%** approval mà giữ nguyên risk *(Netguru, trích Zest AI, 1/2026)* | **+5%** mà không tăng NPL | **+10–15%** mà không tăng NPL |

### 5.4. Analyst Productivity

| | Benchmark | Target VN Conservative | Target VN Optimistic |
|---|-----------|----------------------|---------------------|
| Uplift | Agentic AI tạo **40–80%** productivity uplift per use case *(McKinsey, "The future is agentic", 12/2025)* | **+40–50%** | **+80–100%** |
| Benchmark khác | AI scoring models giảm default rates tới **15%**, đảm bảo consistency cho audit *(Fluxforce, trích McKinsey, 12/2025)* | | |

### 5.5. Fraud Detection tại Origination

| | Benchmark | Target VN Conservative | Target VN Optimistic |
|---|-----------|----------------------|---------------------|
| False positives | AI-driven fraud detection giảm **50%** false positives *(Fluxforce, trích McKinsey & ING case, 12/2025)* | Catch rate **70–80%** | Catch rate **85%+** |
| Benchmark khác | **93%** fraud phát hành thẻ từ online — tập trung đúng tại origination *(Visa Vietnam, 11/2025)* | | |

### Tổng hợp Target Card

| Metric | Baseline ước tính | Target Conservative | Target Optimistic | Thời gian đo | Owner |
|--------|-------------------|--------------------|--------------------|-------------|-------|
| Manual review rate | ~70–80% hồ sơ qua manual | Giảm xuống 50–60% | Giảm xuống 30–40% | 30 ngày | Credit Head |
| Time-to-decision (full flow) | 3–7 ngày | 1–2 ngày | Vài giờ (auto-cases) | Ngay khi deploy | Head of Cards |
| AI scoring time per case | 15–30 phút manual | <5 phút auto-cases | <1 phút auto-cases | Ngay khi deploy | CTO / IT |
| NPL ratio (credit card) | Chưa có public data riêng CC; NPL retail bank 2.0–4.0%+ tùy bank | Giữ nguyên hoặc -10bps | -20 đến -30bps | 6–12 tháng | Risk Manager / CRO |
| Approval rate | Baseline tùy bank | +5% mà không tăng NPL | +10–15% mà không tăng NPL | 3–6 tháng | Head of Cards |
| Analyst productivity | Baseline tùy bank | +40–50% | +80–100% | 30 ngày | Credit Head |
| Fraud detection at origination | Thủ công hoặc chưa có | Catch rate 70–80% | Catch rate 85%+ | 90 ngày | Risk Manager / CRO |

---

## Lưu ý quan trọng

- Các benchmark từ Upstart, Zest AI, WeBank, MNT-Halan đều là thị trường có data infrastructure tốt hơn VN. Target VN nên conservative hơn **30–50%** so với benchmark global, đặc biệt giai đoạn pilot.
- **"Không tăng NPL khi tăng tốc độ và volume"** đã là win lớn cho pilot đầu tiên — không cần hứa giảm NPL 30% ngay.
- Baseline chính xác (manual review rate, time-to-decision, NPL hiện tại) sẽ được xác định khi có bank partner cụ thể. Các con số ở đây là ước tính hợp lý dựa trên industry data.
- Một số baseline (thời gian review/hồ sơ, số hồ sơ/analyst/ngày, NPL riêng credit card) chưa có nguồn public xác thực cho VN cụ thể — cần validate trực tiếp với bank partner trong quá trình discovery (Week 13 theo roadmap). Xem decision-frequency.md cho chi tiết gaps và validation plan.
- Executive Summary version cho pitch deck: xem 1-pager (tạo ở Week 30 theo roadmap).

---

## Changelog

| Version | Thay đổi | Lý do |
|---------|---------|-------|
| v1.1 | Gộp "3% dân số" và "14–15% banked" thành 1 câu (Section 1) | Tránh confusion 2 metrics từ 2 nguồn |
| v1.1 | Phân biệt NPL tổng / listed banks / retail; ghi rõ "NPL CC chưa có public data" (Section 1) | Tránh hiểu nhầm AI-CRDS impact lên NPL toàn hệ thống |
| v1.1 | Clarify "70% thời gian" ≠ "70% hồ sơ manual" (Section 1) | Tránh hiểu nhầm time spent vs % decisions |
| v1.1 | Clarify Sacombank NPL = NPL tổng (7% dư nợ KH / 4.95% tổng tín dụng) (Section 3) | Tránh hiểu nhầm scope NPL |
| v1.1 | Gắn rõ "93% fraud card issuance = fraud tại origination" (Section 1, 3) | Gắn fraud data vào đúng use case AI-CRDS |
| v1.1 | Thêm bảng Metric Ownership + cột Owner trong Target Card (Section 4, 5) | Bank map metric → người chịu trách nhiệm |

---

## Nguồn tham khảo

| # | Nguồn | Nội dung chính | Thời điểm |
|---|-------|---------------|-----------|
| 1 | InsightAsia, trích SBV Annual Banking Report 2024 & Oxford Economics | CC market $3.8B, penetration ~14.3% banked population | Q1/2025 |
| 2 | GFT/AWS Financial Services Symposium Hanoi, trích ReportLinker & VIRAC | CC penetration ~3% dân số | 2025 |
| 3 | GlobalData, Electronic Payments International | Card payments CAGR 14%, $100.5B by 2028 | 8/2024 |
| 4 | MAS Vietnam Banking Sector Q2/2025 Report | NPL 27 banks +16.5% YTD, ~266 nghìn tỷ VND; credit growth 9.9% YTD H1/2025 | Q2/2025 |
| 5 | ACBS Banking Sector 2025 Report | Retail banks (VPB, VIB, OCB) NPL cao hơn; provision +22.2% YoY | 2025 |
| 6 | ainvest.com | NPL ~4.3% đầu 2025 → dự kiến <3% giữa 2026 | 8/2025 |
| 7 | vietnam.vn, trích báo cáo 28 ngân hàng niêm yết | NPL 2.01% cuối 2025; Sacombank NPL tổng ~7% (4.95% tổng tín dụng); BIDV 1.2%; VietinBank 1% | 1/2026 |
| 8 | Visa Vietnam, trích vietnam.vn | 93% fraud card issuance từ online; fraud giảm 3 quý liên tiếp | 11/2025 |
| 9 | Bộ Công an, trích vietnam.vn | >6,000 tỷ VND thiệt hại lừa đảo 11 tháng 2025 | 1/2026 |
| 10 | Viettel Cyber Security, trích VietnamNet | 6.5M tài khoản bị đánh cắp Q3/2025; 71% attack vào finance | 10/2025 |
| 11 | Vụ Thanh toán NHNN, trích vietnam.vn | 592,000 tài khoản gian lận phát hiện đến 12/2025 | 12/2025 |
| 12 | IFLR Banking & Finance Guide 2025 | PDPD hiệu lực 1/2026; Decree 94/2025 sandbox credit scoring | 9/2025 |
| 13 | PayNXT360, trích Research and Markets | BNPL CAGR 58.3%, $2.6B 2025 | 2025 |
| 14 | Glassdoor Vietnam — Credit Analyst | Lương median ~18.3 triệu VND/tháng | 8/2025 |
| 15 | SalaryExplorer Vietnam — Credit Risk Analyst | Lương median ~21.7 triệu VND/tháng | 2024 |
| 16 | McKinsey — "The future is agentic" | Agentic AI: 40–80% productivity uplift; credit reviews từ ngày → near real time | 12/2025 |
| 17 | NeonTri, trích Autonomous Research & nhiều nguồn | AI: 15–25% accuracy improvement, 30% credit loss reduction, 90% approval time cut, 60% manual review reduction | 9/2025 |
| 18 | CTO Magazine | WeBank/MYBank: >10M loans/năm, NPL 1% | 7/2025 |
| 19 | Netguru, trích Zest AI case studies | +20–30% approval giữ nguyên risk | 1/2026 |
| 20 | World Economic Forum — MNT-Halan | Tự động hóa >50% loan approvals | 10/2025 |
| 21 | Fluxforce, trích McKinsey | Loan teams dành 70% thời gian data gathering; AI fraud detection giảm 50% false positives | 12/2025 |