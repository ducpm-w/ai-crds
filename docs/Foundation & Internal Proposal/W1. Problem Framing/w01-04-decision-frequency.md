# Operational Baseline — Credit Card Origination tại Bank X
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## 1. Định nghĩa "Decision" trong AI-CRDS

Trong bối cảnh credit card origination:

- **Một decision** là một hồ sơ CC được đưa qua hệ thống scoring và fraud detection, với một trong ba kết quả:
  - **Auto-approve:** hồ sơ rõ ràng tốt, đủ điều kiện, chuyển sang phát hành.
  - **Auto-reject:** hồ sơ rõ ràng xấu (CIC nhóm nợ xấu, fraud flag), từ chối.
  - **Route to manual review:** hồ sơ ở ngưỡng biên, thiếu dữ liệu hoặc cần xác minh, chuyển Credit Officer.

- **Decision frequency** là số hồ sơ CC nộp mỗi ngày. Trong giai đoạn pilot, 100% hồ sơ đi qua AI scoring (kết quả cuối có thể là tự động hoặc manual). Credit Officer chỉ review các ca AI-CRDS chuyển lên.

- Quyết định "Route to manual review" vẫn là một decision của AI-CRDS (quyết định chuyển cấp), và Credit Officer là người đóng decision cuối cùng.

---

## 2. Volume phát hành thẻ tín dụng — tham chiếu thị trường

### 2.1. Tổng quan thị trường

- Cuối Q1/2025: khoảng 157 triệu thẻ ngân hàng lưu hành tại Việt Nam, tăng 1 triệu so với cuối 2024. Thẻ quốc tế đạt 50.2 triệu (gấp 3 lần đầu 2021). Riêng Q1/2025 phát hành thêm 1.8 triệu thẻ quốc tế (VIR, trích Vụ Thanh toán NHNN, 5/2025).
- Toàn thị trường có khoảng 10.2 triệu thẻ tín dụng (Vietnam Banking Association, trích TPBank website, 2024).

### 2.2. Thẻ mới phát hành — các ngân hàng lớn

| Bank | Thẻ CC lưu hành | Thẻ mới phát hành (12 tháng gần nhất) | Doanh số giao dịch CC | Nguồn |
|------|-----------------|---------------------------------------|----------------------|-------|
| VPBank | >1.7 triệu (cuối 2024) | >500,000 thẻ mới trong 2024 | >100 nghìn tỷ VND (2024) | vietnam.vn, 11/2025 |
| Techcombank | >1 triệu (Q2/2025) | +224,000 trong 12 tháng | >100 nghìn tỷ VND (2024) | vietnam.vn, 11/2025 |
| VIB | 1 triệu (8/2025) | +142,000 so với cuối 2024 | >100 nghìn tỷ VND (2024) | vietnam.vn, 11/2025 |
| Sacombank | >1 triệu (đầu 2025) | Không công bố cụ thể | Không công bố | vietnam.vn, 11/2025 |
| TPBank | Không công bố | Tăng ~140% trong 2023; doanh số 29 nghìn tỷ VND | Riêng Visa >$1 tỷ/năm (2023) | TPBank website, 2024 |

VPBank phát hành gấp 2–3 lần Techcombank và VIB. Visa xếp TPBank trong Top 3 tăng trưởng giao dịch CC. Bốn ngân hàng (VPBank, Techcombank, VIB, Sacombank) đã gia nhập "câu lạc bộ triệu thẻ" (vietnam.vn, 11/2025).

### 2.3. Market share tham khảo (H1/2021)

| Bank | Market share CC quốc tế |
|------|------------------------|
| TPBank | 17% |
| VPBank | 16% |
| Techcombank | 15.7% |
| VIB | 8% |
| Sacombank | 6% |

*Nguồn: VIR, 12/2021. Thị phần đã thay đổi đáng kể đến 2025; VPBank hiện dẫn đầu.*

---

## 3. Ước tính số hồ sơ (decisions) mỗi ngày

### Phương pháp tính

```
Hồ sơ approve/ngày = Thẻ mới phát hành/năm ÷ ~250 ngày làm việc
Tổng hồ sơ nộp/ngày = Hồ sơ approve/ngày ÷ Approval Rate (giả định)
Decisions/ngày = Tổng hồ sơ nộp/ngày (100% đi qua AI scoring)
```

Approval rate cho CC tại Việt Nam chưa được công bố. Benchmark toàn cầu cho credit card là 30–50%. Tài liệu dùng hai kịch bản giả định: approval rate 40% (trung bình) và 30% (thận trọng, phù hợp giai đoạn NPL cao).

### Bảng ước tính cho các ngân hàng tham chiếu

Số liệu dưới đây là ước tính suy ra từ số thẻ phát hành công bố và giả định approval rate; không phải số liệu vận hành thực.

| Bank | Thẻ mới/năm | Approve/ngày | Decisions/ngày (AR 40%) | Decisions/ngày (AR 30%) |
|------|-------------|-------------|------------------------|------------------------|
| VPBank | ~500,000 | ~2,000 | ~5,000 | ~6,700 |
| Techcombank | ~224,000 | ~900 | ~2,250 | ~3,000 |
| VIB | ~142,000 | ~570 | ~1,425 | ~1,900 |
| TPBank | ~150,000–200,000 (ước tính) | ~600–800 | ~1,500–2,000 | ~2,000–2,700 |
| Digital bank nhỏ (Timo, Cake, TNEX) | ~10,000–50,000 (ước tính) | ~40–200 | ~100–500 | ~130–670 |

### Giả định cho Bank X

Bộ tài liệu dùng giả định Bank X nhận khoảng 3,000 hồ sơ CC mỗi tháng (khoảng 140 hồ sơ mỗi ngày làm việc), nằm trong nhóm digital bank và ngân hàng bán lẻ quy mô vừa. Con số này là giả định lập kế hoạch và sẽ được thay bằng dữ liệu thực của Bank X khi có (xem `w04-04-assumptions-log`).

### Peak và Average

Volume thực tế dao động theo ngày và mùa:

- **Ngày cao điểm** (cuối tháng, campaign phát hành CC, mùa Tết, thời điểm thưởng): ước tính gấp 1.5–2 lần trung bình.
- **Cuối tuần:** thấp hơn 30–50% so với ngày thường đối với ngân hàng truyền thống. Digital bank có thể phẳng hơn vì khách nộp hồ sơ 24/7 qua app.

Ví dụ với VPBank: trung bình khoảng 5,000 decisions/ngày, ngày cao điểm có thể đạt 7,500–10,000 decisions/ngày. Với Bank X, ngày cao điểm được lập kế hoạch ở mức 1.5–2 lần trung bình.

Đây là ước tính dựa trên hành vi chung của CC origination, không phải số liệu công bố tại Việt Nam.

Với các digital bank nhỏ (Timo, Cake, TNEX), không có số liệu phát hành CC công bố. Cake by VPBank xử lý trên 1 triệu đơn tín dụng mỗi tháng (VIR, 1/2026) nhưng bao gồm cả consumer loan và BNPL, nên không dùng trực tiếp làm số liệu CC.

---

## 4. Thời gian review một hồ sơ

Thời gian review một hồ sơ CC là dữ liệu vận hành nội bộ của từng ngân hàng và không được công bố. Tài liệu dùng giả định 15–30 phút mỗi hồ sơ cho Bank X, tham chiếu các benchmark quốc tế dưới đây, và sẽ thay bằng số liệu thực khi có.

### Benchmark quốc tế

| Metric | Benchmark | Nguồn |
|--------|-----------|-------|
| % thời gian cho data gathering | 70% thời gian loan team dành cho thu thập và nhập liệu | Fluxforce, trích McKinsey, 12/2025 |
| Thời gian underwriting manual (SME) | 3 ngày (trước AI) giảm xuống 30 phút (sau AI) | Fluxforce, trích UK fintech case, 12/2025 |
| Credit review truyền thống | Nhiều ngày, gần real time với agentic AI | McKinsey, "The future is agentic", 12/2025 |
| AI scoring mỗi ca (rủi ro thấp) | Thời gian phê duyệt giảm tới 90% | NeonTri, trích Autonomous Research, 9/2025 |

### TPBank — trường hợp tại Việt Nam

- TPBank triển khai 15+ mô hình ML trong 2024 cho hoạt động kinh doanh (IBM Case Study — TPBank, 2024).
- Thời gian triển khai model giảm từ 36 xuống 30 ngày làm việc, giảm khoảng 17% (IBM Case Study — TPBank, 2024).
- Conversion rate của khách hàng tăng 24% (IBM Case Study — TPBank, 2024).
- 75–80% khách hàng mới đến từ kênh digital; 20–25% từ chi nhánh (The Asian Banker, 2025).

TPBank dùng ML chủ yếu cho propensity model (dự đoán khách hàng sẽ mở CC), chưa phải credit scoring hay decision support tại origination. Đây là khoảng trống mà AI-CRDS giải quyết.

---

## 5. Số Credit Officer

Số lượng Credit Officer/Analyst tại từng ngân hàng không được công bố. Tài liệu dùng ước tính gián tiếp từ tổng nhân sự:

| Bank | Tổng nhân viên (ước tính) | Credit/Risk operations (ước tính 5–10% tổng) | Nguồn |
|------|--------------------------|---------------------------------------------|-------|
| Vietcombank | ~20,000+ | ~1,000–2,000 | Báo cáo thường niên |
| VPBank | ~25,000+ | ~1,250–2,500 | Báo cáo thường niên |
| Techcombank | ~12,000+ | ~600–1,200 | Báo cáo thường niên |

Tỷ lệ 5–10% là ước tính chung của ngành. Phần credit/risk operations bao gồm cả fraud, collection và policy, không chỉ review origination. Với Bank X, tài liệu giả định team 10 Credit Analyst xử lý origination CC (xem `w04-01-damage-model-bank-x`).

---

## 6. Tỷ lệ Approve / Reject / Manual Review

Các ngân hàng Việt Nam không công bố approval rate, reject rate hay manual review rate cho CC. Tài liệu dùng ước tính dựa trên logic nghiệp vụ.

Quy trình origination CC thường gồm:

```
Hồ sơ nộp → Auto-check (CIC, eKYC, rules) → Kết quả:
  ├── Auto-approve (rõ ràng tốt, đủ điều kiện) → phát hành
  ├── Auto-reject (rõ ràng xấu, CIC nhóm nợ xấu, fraud flag) → từ chối
  └── Manual review (ngưỡng biên, thiếu dữ liệu, cần xác minh) → Credit Officer xem
```

| Kịch bản | Auto-approve | Manual review | Auto-reject | Ghi chú |
|----------|-------------|---------------|-------------|---------|
| Ngân hàng có scorecard hoàn thiện (VPBank, Techcombank) | 20–30% | 40–50% | 20–30% | Ước tính |
| Ngân hàng chưa có AI scoring | 10–15% | 50–60% | 25–35% | Ước tính |
| Bank X sau khi triển khai AI-CRDS | 40–50% | 20–30% | 20–30% | Mục tiêu conservative |

Các con số trong bảng là giả định lập kế hoạch dựa trên hiểu biết về quy trình ngân hàng, sẽ được thay bằng dữ liệu thực của Bank X khi có.

---

## 7. Tổng hợp

| Metric | Loại số liệu | Số liệu sử dụng |
|--------|-------------|-----------------|
| Thẻ CC phát hành/năm mỗi ngân hàng | Công bố | VPBank 500K, TCB 224K, VIB 142K (vietnam.vn, 11/2025) |
| Doanh số giao dịch CC mỗi ngân hàng | Công bố | VPBank, TCB, VIB đều >100 nghìn tỷ VND (vietnam.vn, 11/2025) |
| Tổng thẻ lưu hành toàn thị trường | Công bố | ~157 triệu thẻ ngân hàng, ~10.2 triệu CC (VIR 5/2025; VBA 2024) |
| AI đã dùng tại ngân hàng Việt Nam | Công bố | TPBank: 15+ ML models, conversion +24% (IBM 2024) |
| Tỷ lệ digital acquisition | Công bố | TPBank: 75–80% digital (Asian Banker 2025) |
| Decisions/ngày | Ước tính | Thẻ phát hành ÷ ngày làm việc ÷ approval rate giả định |
| Peak so với average | Ước tính | Peak khoảng 1.5–2 lần average; cuối tuần giảm 30–50% |
| Thời gian review mỗi hồ sơ | Giả định | 15–30 phút, tham chiếu benchmark quốc tế |
| Số Credit Officer | Giả định | Ước tính từ tổng nhân sự |
| Approval / reject / manual rate | Giả định | Ước tính theo logic nghiệp vụ |

---

## Nguồn tham khảo

| # | Nguồn | Nội dung | Thời điểm |
|---|-------|----------|-----------|
| 1 | vietnam.vn — "Thị trường thẻ tín dụng bứt tốc" | VPBank 1.7M CC, 500K mới; TCB 1M CC; VIB 1M CC; doanh số >100 nghìn tỷ | 11/2025 |
| 2 | TPBank website — "Thẻ TPBank phát triển bùng nổ" | CC mới +140% (2023), doanh số 29 nghìn tỷ VND, Visa >$1B/năm | 2024 |
| 3 | VIR — "Bank card circulation hit 157 million in Q1" | 157M thẻ tổng, 50.2M quốc tế, +1.8M Q1/2025 | 5/2025 |
| 4 | IBM Case Study — TPBank | 15+ ML models, deploy time -17%, conversion +24% | 2024 |
| 5 | The Asian Banker — TPBank digital banking | 14M khách, 75–80% digital acquisition, 2M mới trong 2024 | 2025 |
| 6 | McKinsey — "The future is agentic" | Agentic AI: 40–80% productivity uplift, credit review từ nhiều ngày xuống gần real time | 12/2025 |
| 7 | Fluxforce, trích McKinsey | 70% thời gian dành cho thu thập dữ liệu; UK fintech: 3 ngày xuống 30 phút | 12/2025 |
| 8 | VIR — "Banks reposition for trend transition" | Market share CC quốc tế H1/2021: TPBank 17%, VPBank 16%, TCB 15.7% | 12/2021 |
| 9 | VIR — "Cake by VPBank posts strong gains" | >1M đơn tín dụng/tháng (bao gồm CC, consumer loan, BNPL) | 1/2026 |
