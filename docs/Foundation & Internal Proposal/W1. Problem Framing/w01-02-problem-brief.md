# Problem Brief — AI Credit Risk Decision Support
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## 1. Problem Statement

Bank X đang đối mặt với một nghịch lý: cần phát hành thẻ tín dụng nhanh hơn trong khi rủi ro tín dụng của thị trường đang tăng.

**Phía cầu: thị trường mở rộng nhanh**

- Credit card penetration khoảng 3% tổng dân số, tương đương khoảng 14–15% dân số có tài khoản ngân hàng (GFT/AWS Financial Services Industry Symposium Hanoi 2025, trích ReportLinker & VIRAC Q1/2025; InsightAsia Q1/2025, trích SBV Annual Banking Report 2024).
- Thị trường credit card Việt Nam đạt khoảng $3.8 tỷ giá trị giao dịch năm 2024, tăng trưởng 12.5% mỗi năm (InsightAsia Q1/2025, trích SBV Annual Banking Report 2024 & Oxford Economics).
- Card payments dự kiến đạt CAGR 14% giai đoạn 2024–2028, hướng tới $100.5 tỷ vào 2028 (GlobalData, Electronic Payments International, 8/2024).

Các ngân hàng đang đẩy mạnh phát hành, volume hồ sơ origination tăng nhanh và tạo áp lực lên năng lực thẩm định.

**Phía rủi ro: NPL tăng, fraud nghiêm trọng**

- NPL ratio toàn hệ thống đầu 2025 ở mức khoảng 4.3% (ainvest.com, 8/2025); NPL trung bình 28 ngân hàng niêm yết cuối 2025 là 2.01% (vietnam.vn, trích báo cáo 28 ngân hàng niêm yết, 1/2026). Tổng NPL 27 ngân hàng niêm yết tăng 16.5% YTD, đạt gần 266 nghìn tỷ VND trong Q2/2025 (MAS Vietnam Banking Sector Q2/2025 Report).
- Các ngân hàng tập trung bán lẻ (VPB, VIB, OCB) có NPL và nợ nhóm 2 cao hơn trung bình ngành (ACBS Banking Sector 2025 Report). Số liệu NPL riêng mảng credit card chưa được công bố công khai; do thẻ tín dụng là khoản vay không có tài sản bảo đảm, NPL của segment này thường cao hơn các khoản vay có bảo đảm.
- 93% gian lận phát hành thẻ (card issuance fraud) đến từ giao dịch online, chủ yếu xuyên biên giới (Visa Vietnam, trích vietnam.vn, 11/2025). Gian lận xảy ra ngay tại thời điểm nộp hồ sơ và phát hành, đúng điểm AI-CRDS can thiệp.

**Điểm nghẽn: manual review không mở rộng được theo volume**

- Các loan team dành tới 70% thời gian làm việc để thu thập và nhập liệu từ hồ sơ, bảng kê ngân hàng và tài liệu tài chính (Fluxforce/McKinsey, 12/2025). Đây là tỷ lệ thời gian, không phải tỷ lệ hồ sơ cần manual review. Phần lớn hồ sơ có thể auto-approve/auto-reject nếu khâu thu thập dữ liệu được tự động hóa. Tỷ lệ hồ sơ cần manual review ước tính 40–70% tại các ngân hàng thuần bán lẻ (xem `w01-04-decision-frequency`).
- Thẩm định tín dụng thủ công mất nhiều ngày, trong khi các đối thủ fintech phê duyệt trong vài phút (McKinsey, "The future is agentic", 12/2025).
- Khi volume tăng 2–3 lần do campaign phát hành, ngân hàng phải chọn giữa tuyển thêm người (tốn chi phí), giảm chất lượng review (tăng NPL) hoặc từ chối nhiều hơn (mất doanh thu). Cả ba lựa chọn đều không bền vững.

**Tóm lại:** Bank X cần duyệt nhanh hơn để cạnh tranh, nhưng duyệt nhanh hơn bằng manual dẫn đến sai sót nhiều hơn, NPL tăng và áp lực từ SBV tăng theo. Bài toán này được giải quyết bằng hệ thống hỗ trợ quyết định (decision support) tại điểm origination.

---

## 2. Ai bị ảnh hưởng

### Credit Officer / Credit Analyst — người dùng chính

Người trực tiếp review hồ sơ và chịu áp lực volume. Lương trung bình 15–22 triệu VND/tháng, median khoảng 18.3 triệu (Glassdoor Vietnam, Credit Analyst, dữ liệu đến 8/2025, 13 mẫu lương), hoặc 21.7 triệu VND/tháng median theo khảo sát rộng hơn (SalaryExplorer Vietnam, Banking — Credit Risk Analyst, 2024). Khi volume tăng, quá tải dẫn đến quyết định kém hoặc chậm, ảnh hưởng NPL và trải nghiệm khách hàng.

### Risk Manager / Head of Credit — người đề xuất giải pháp

Chịu trách nhiệm NPL ratio toàn danh mục. Khi NPL tăng, ngân hàng phải tăng provision và lợi nhuận giảm. Chỉ 4 ngân hàng (Vietcombank, VietinBank, BIDV, Techcombank) duy trì tỷ lệ phủ nợ xấu trên 100% (VIR, 3/2025). Đây là vai trò có động lực lớn nhất trong việc tìm giải pháp.

### Head of Cards / Business Owner — người quyết định ngân sách

Chịu P&L mảng thẻ. Chịu áp lực tăng approval rate và phát hành nhanh để đạt chỉ tiêu, nhưng nếu approve nhầm thì NPL tăng và ảnh hưởng trực tiếp P&L.

### Compliance Officer — đảm bảo tuân thủ

SBV ngày càng siết chặt quản lý. Luật Bảo vệ dữ liệu cá nhân (PDPD) có hiệu lực từ tháng 1/2026 (IFLR Banking & Finance Guide 2025). Nghị định 94/2025 tạo sandbox cho credit scoring (IFLR, 9/2025). Mọi quyết định tín dụng cần có audit trail và khả năng giải thích.

### CTO / IT — đảm bảo tích hợp

Chịu trách nhiệm tích hợp với Core Banking (T24, Flexcube hoặc hệ thống tự phát triển) và các tiêu chuẩn bảo mật.

### Khách hàng — người chờ đợi và rời đi

Thời gian phê duyệt chậm (3–7 ngày) trong khi BNPL phê duyệt trong vài phút khiến khách hàng chuyển sang đối thủ. Thị trường BNPL Việt Nam tăng CAGR 58.3% giai đoạn 2021–2024, dự kiến đạt $2.6 tỷ năm 2025 (PayNXT360, trích Research and Markets), cạnh tranh trực tiếp với credit card.

---

## 3. Hậu quả nếu không giải quyết

### Thiệt hại từ NPL

- Tổng NPL 27 ngân hàng niêm yết: gần 266 nghìn tỷ VND (khoảng $10.6 tỷ) trong Q2/2025 (MAS Vietnam Banking Sector Q2/2025 Report).
- Chi phí provision dự kiến tăng 22.2% YoY năm 2025 (ACBS Banking Sector 2025 Report).
- Ví dụ: Sacombank có NPL tổng gần 7% dư nợ khách hàng (4.95% tổng dư nợ tín dụng), tỷ lệ phủ nợ xấu chỉ 49.2%, chi phí trích lập dự phòng năm 2025 là 11,157 tỷ VND, là nguyên nhân chính khiến ngân hàng không đạt kế hoạch kinh doanh (vietnam.vn, 1/2026). Đây là NPL tổng của mọi sản phẩm tín dụng, không riêng credit card, nhưng cho thấy áp lực provision khi NPL cao tác động trực tiếp đến lợi nhuận.
- Credit card là khoản vay không có tài sản bảo đảm nên LGD (Loss Given Default) thường 60–80%, tức mất gần hết khi khách hàng vỡ nợ.

### Thiệt hại từ fraud

- Thiệt hại lừa đảo trực tuyến hơn 6,000 tỷ VND trong 11 tháng đầu 2025 (Bộ Công an, trích vietnam.vn, 1/2026).
- Q3/2025: hơn 6.5 triệu tài khoản cá nhân bị đánh cắp (tăng 64% QoQ), hơn 502 triệu bản ghi dữ liệu doanh nghiệp bị rò rỉ; tài chính–ngân hàng bị ảnh hưởng nặng nhất (Viettel Cyber Security, trích VietnamNet, 10/2025).
- 71% tổng số tấn công mạng nhắm vào ngành tài chính–ngân hàng (Viettel Cyber Security Threat Report 2024, trích VietnamPlus, 4/2025).
- NHNN đã phát hiện 592,000 tài khoản thanh toán/ví điện tử có dấu hiệu gian lận tính đến 12/2025 (Vụ Thanh toán NHNN, trích vietnam.vn, 12/2025).
- 93% gian lận phát hành thẻ đến từ giao dịch online (Visa VN, 11/2025). AI-CRDS can thiệp để chặn trước khi giải ngân hoặc phát hành thẻ.

### Thiệt hại từ thẩm định chậm (mất doanh thu)

- BNPL tăng CAGR 58.3% (2021–2024), đạt $2.6 tỷ năm 2025 (PayNXT360), là đối thủ trực tiếp cạnh tranh khách hàng credit card.
- Với penetration chỉ khoảng 3% dân số, mỗi khách hàng rời đi vì chờ lâu là doanh thu mất đi trong một thị trường đang tăng trưởng.

### Chi phí vận hành manual

- Một Credit Analyst có lương khoảng 18–22 triệu/tháng (Glassdoor Vietnam 8/2025; SalaryExplorer Vietnam Banking 2024).
- Loan team dành tới 70% thời gian cho thu thập và nhập liệu (Fluxforce/McKinsey, 12/2025); phần lớn khối lượng này có thể tự động hóa, giải phóng analyst cho việc phán đoán.
- Nếu tăng volume gấp đôi bằng manual, cần tuyển thêm tương ứng; một team 10 analyst tốn khoảng 2.2–2.6 tỷ VND/năm chỉ riêng chi phí nhân sự.

---

## 4. Mục tiêu kết quả (Outcome Target)

Bốn kết quả chính, xếp theo thứ tự ưu tiên:

1. **Giảm manual review rate:** giải phóng năng lực của Credit Officer cho các ca cần phán đoán. Đo được ngay tuần đầu pilot.
2. **Giảm time-to-decision:** cạnh tranh được với fintech/BNPL. Đo được ngay khi triển khai.
3. **Giữ hoặc giảm NPL:** chứng minh AI không làm tăng rủi ro. Tín hiệu sớm sau 30–90 ngày, xác nhận sau 6–12 tháng.
4. **Phát hiện fraud tại origination:** giảm fraud loss, đo bằng số ca fraud phát hiện so với bỏ sót.

**Chủ sở hữu metric tại Bank X:**

| Metric | Chủ sở hữu |
|--------|-----------|
| NPL ratio, fraud loss | Risk Manager / CRO |
| Approval rate, time-to-decision | Head of Cards / Business Owner |
| Manual review rate, analyst productivity | Credit Head / Head of Credit Operations |
| Audit trail, PDPD compliance | Compliance Officer |
| System uptime, integration SLA | CTO / IT |

---

## 5. Con số mục tiêu

Mục tiêu chia thành hai mức: Conservative (thận trọng, phù hợp giai đoạn pilot) và Optimistic (khi đã được chứng minh). Mức conservative thấp hơn benchmark quốc tế vì dữ liệu Việt Nam chưa được chuẩn hóa bằng thị trường Mỹ/EU, độ phủ CIC ở một số phân khúc còn thấp, và các ngân hàng Việt Nam thận trọng hơn khi pilot.

Các con số mục tiêu và baseline dưới đây là giả định lập kế hoạch dựa trên dữ liệu ngành, sẽ được thay bằng dữ liệu thực của Bank X khi có.

### 5.1. Manual Review Reduction

| | Benchmark | Target Conservative | Target Optimistic |
|---|-----------|--------------------|-------------------|
| Mức giảm | Tới 60% (NeonTri, trích Autonomous Research, 9/2025) | 20–30% | 40–50% |
| Benchmark khác | MNT-Halan tự động hóa trên 50% phê duyệt khoản vay (World Economic Forum, 10/2025) | | |

### 5.2. Time-to-Decision

| | Benchmark | Target Conservative | Target Optimistic |
|---|-----------|--------------------|-------------------|
| Tốc độ | Thời gian phê duyệt giảm tới 90% cho hồ sơ rủi ro thấp (NeonTri, 9/2025) | Toàn bộ flow: 3–7 ngày xuống 1–2 ngày | Toàn bộ flow: vài giờ cho các ca tự động |
| Benchmark khác | Thẩm định mất nhiều ngày có thể hoàn thành gần real time với AI (McKinsey, 12/2025) | AI scoring mỗi ca: dưới 5 phút | AI scoring mỗi ca: dưới 1 phút |

### 5.3. NPL Impact

| | Benchmark | Target Conservative | Target Optimistic |
|---|-----------|--------------------|-------------------|
| Accuracy | AI cải thiện 15–25% độ chính xác dự đoán default, giảm credit losses 30% (NeonTri, 9/2025) | Giữ nguyên NPL hoặc giảm 10 bps | Giảm 20–30 bps |
| Benchmark khác | WeBank, MYBank: trên 10 triệu khoản vay/năm, NPL chỉ 1% (CTO Magazine, 7/2025) | | |
| Approval rate | Zest AI: tăng 20–30% approval mà giữ nguyên rủi ro (Netguru, trích Zest AI, 1/2026) | +5% mà không tăng NPL | +10–15% mà không tăng NPL |

### 5.4. Analyst Productivity

| | Benchmark | Target Conservative | Target Optimistic |
|---|-----------|--------------------|-------------------|
| Uplift | Agentic AI tạo 40–80% productivity uplift mỗi use case (McKinsey, "The future is agentic", 12/2025) | +40–50% | +80–100% |
| Benchmark khác | AI scoring models giảm default rates tới 15%, đảm bảo nhất quán cho audit (Fluxforce, trích McKinsey, 12/2025) | | |

### 5.5. Fraud Detection tại Origination

| | Benchmark | Target Conservative | Target Optimistic |
|---|-----------|--------------------|-------------------|
| False positives | AI-driven fraud detection giảm 50% false positives (Fluxforce, trích McKinsey & ING case, 12/2025) | Catch rate 70–80% | Catch rate 85%+ |
| Benchmark khác | 93% fraud phát hành thẻ từ online, tập trung tại origination (Visa Vietnam, 11/2025) | | |

### Tổng hợp Target Card

| Metric | Baseline ước tính | Target Conservative | Target Optimistic | Thời gian đo | Owner |
|--------|-------------------|--------------------|--------------------|-------------|-------|
| Manual review rate | Khoảng 70–80% hồ sơ qua manual | Giảm xuống 50–60% | Giảm xuống 30–40% | 30 ngày | Credit Head |
| Time-to-decision (full flow) | 3–7 ngày | 1–2 ngày | Vài giờ (ca tự động) | Ngay khi triển khai | Head of Cards |
| AI scoring time mỗi ca | 15–30 phút manual | Dưới 5 phút (ca tự động) | Dưới 1 phút (ca tự động) | Ngay khi triển khai | CTO / IT |
| NPL ratio (credit card) | Giả định theo NPL retail bank 2.0–4.0% | Giữ nguyên hoặc giảm 10 bps | Giảm 20–30 bps | 6–12 tháng | Risk Manager / CRO |
| Approval rate | Giả định theo mặt bằng ngành | +5% mà không tăng NPL | +10–15% mà không tăng NPL | 3–6 tháng | Head of Cards |
| Analyst productivity | Giả định theo mặt bằng ngành | +40–50% | +80–100% | 30 ngày | Credit Head |
| Fraud detection tại origination | Thủ công | Catch rate 70–80% | Catch rate 85%+ | 90 ngày | Risk Manager / CRO |

---

## Lưu ý về cách đặt mục tiêu

- Các benchmark từ Upstart, Zest AI, WeBank, MNT-Halan đến từ các thị trường có hạ tầng dữ liệu tốt hơn Việt Nam. Mục tiêu của Bank X được đặt thấp hơn benchmark quốc tế khoảng 30–50%, đặc biệt trong giai đoạn pilot.
- Mục tiêu "không tăng NPL khi tăng tốc độ và volume" đã là kết quả có giá trị cho pilot đầu tiên; không đặt mục tiêu giảm NPL 30% ngay.
- Baseline của Bank X (manual review rate, time-to-decision, NPL hiện tại, thời gian review mỗi hồ sơ, số hồ sơ mỗi analyst mỗi ngày) được ước tính hợp lý từ dữ liệu ngành và sẽ được thay bằng số liệu nội bộ của Bank X khi có. Chi tiết xem `w01-04-decision-frequency`.

---

## Nguồn tham khảo

| # | Nguồn | Nội dung chính | Thời điểm |
|---|-------|---------------|-----------|
| 1 | InsightAsia, trích SBV Annual Banking Report 2024 & Oxford Economics | CC market $3.8B, penetration ~14.3% dân số có tài khoản ngân hàng | Q1/2025 |
| 2 | GFT/AWS Financial Services Symposium Hanoi, trích ReportLinker & VIRAC | CC penetration ~3% dân số | 2025 |
| 3 | GlobalData, Electronic Payments International | Card payments CAGR 14%, $100.5B vào 2028 | 8/2024 |
| 4 | MAS Vietnam Banking Sector Q2/2025 Report | NPL 27 ngân hàng +16.5% YTD, ~266 nghìn tỷ VND; credit growth 9.9% YTD H1/2025 | Q2/2025 |
| 5 | ACBS Banking Sector 2025 Report | Nhóm ngân hàng bán lẻ (VPB, VIB, OCB) NPL cao hơn; provision +22.2% YoY | 2025 |
| 6 | ainvest.com | NPL ~4.3% đầu 2025, dự kiến dưới 3% giữa 2026 | 8/2025 |
| 7 | vietnam.vn, trích báo cáo 28 ngân hàng niêm yết | NPL 2.01% cuối 2025; Sacombank NPL tổng ~7% (4.95% tổng tín dụng); BIDV 1.2%; VietinBank 1% | 1/2026 |
| 8 | Visa Vietnam, trích vietnam.vn | 93% fraud card issuance từ online; fraud giảm 3 quý liên tiếp | 11/2025 |
| 9 | Bộ Công an, trích vietnam.vn | >6,000 tỷ VND thiệt hại lừa đảo 11 tháng 2025 | 1/2026 |
| 10 | Viettel Cyber Security, trích VietnamNet | 6.5M tài khoản bị đánh cắp Q3/2025; 71% tấn công nhắm vào tài chính | 10/2025 |
| 11 | Vụ Thanh toán NHNN, trích vietnam.vn | 592,000 tài khoản gian lận phát hiện đến 12/2025 | 12/2025 |
| 12 | IFLR Banking & Finance Guide 2025 | PDPD hiệu lực 1/2026; Nghị định 94/2025 sandbox credit scoring | 9/2025 |
| 13 | PayNXT360, trích Research and Markets | BNPL CAGR 58.3%, $2.6B 2025 | 2025 |
| 14 | Glassdoor Vietnam — Credit Analyst | Lương median ~18.3 triệu VND/tháng | 8/2025 |
| 15 | SalaryExplorer Vietnam — Credit Risk Analyst | Lương median ~21.7 triệu VND/tháng | 2024 |
| 16 | McKinsey — "The future is agentic" | Agentic AI: 40–80% productivity uplift; thẩm định từ nhiều ngày xuống gần real time | 12/2025 |
| 17 | NeonTri, trích Autonomous Research & nhiều nguồn | AI: cải thiện 15–25% độ chính xác, giảm 30% credit loss, giảm 90% thời gian phê duyệt, giảm 60% manual review | 9/2025 |
| 18 | CTO Magazine | WeBank/MYBank: >10M khoản vay/năm, NPL 1% | 7/2025 |
| 19 | Netguru, trích Zest AI case studies | +20–30% approval giữ nguyên rủi ro | 1/2026 |
| 20 | World Economic Forum — MNT-Halan | Tự động hóa >50% phê duyệt khoản vay | 10/2025 |
| 21 | Fluxforce, trích McKinsey | Loan team dành 70% thời gian cho thu thập dữ liệu; AI fraud detection giảm 50% false positives | 12/2025 |
