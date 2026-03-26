# Operational Baseline — Credit Card Origination tại VN
> **Phụ lục cho Problem Brief**  
> **Mục đích:** Ước tính volume hồ sơ, thời gian xử lý, nhân sự, tỷ lệ approve — phục vụ thiết kế sản phẩm AI-CRDS  
> **Nguyên tắc:** Mỗi số liệu ghi rõ: ✅ Verified (có nguồn public) / 🔶 Derived (tính từ data verified) / ❌ Gap (chưa có, cần validate với bank)  
> **Version:** 1.1 — Bổ sung decision definition, peak pattern, forward references

---

## 1. Định nghĩa "Decision" trong AI-CRDS

Trong bối cảnh credit card origination:

- **1 decision** = 1 hồ sơ CC được đưa qua hệ thống scoring + fraud detection, với 1 trong 3 kết quả:
  - **Auto-approve** — hồ sơ rõ ràng tốt, đủ điều kiện → phát hành
  - **Auto-reject** — hồ sơ rõ ràng xấu, CIC đen, fraud flag → từ chối
  - **Route to manual review** — borderline, thiếu data, cần xác minh → Credit Officer xem

- **Decision frequency** = số hồ sơ CC nộp/ngày. Ở giai đoạn pilot, 100% hồ sơ sẽ đi qua AI scoring (dù kết quả cuối có thể là auto hoặc manual). AI score mọi hồ sơ → Credit Officer chỉ review cases AI không chắc chắn.

- **Lưu ý:** "Manual review" vẫn là 1 decision của AI (quyết định escalate), chỉ là chưa đóng — Credit Officer là người đóng decision cuối cùng.

---

## 2. Volume phát hành thẻ tín dụng — So sánh các bank lớn

### 2.1. Tổng quan thị trường

- Cuối Q1/2025: tổng khoảng **157 triệu** thẻ ngân hàng lưu hành tại VN, tăng 1 triệu so với cuối 2024. Thẻ quốc tế đạt **50.2 triệu** (gấp 3 lần đầu 2021). Riêng Q1/2025 phát hành thêm **1.8 triệu** thẻ quốc tế. *(VIR, trích Vụ Thanh toán NHNN, 5/2025)*

- Toàn thị trường có khoảng **10.2 triệu** thẻ tín dụng. *(Vietnam Banking Association, trích TPBank website, 2024)*

### 2.2. Thẻ mới phát hành — Top banks ✅ Verified

| Bank | Thẻ CC lưu hành | Thẻ mới phát hành (12 tháng gần nhất) | Doanh số giao dịch CC | Nguồn |
|------|-----------------|---------------------------------------|----------------------|-------|
| **VPBank** | >1.7 triệu (cuối 2024) | >500,000 thẻ mới trong 2024 | >100 nghìn tỷ VND (2024) | vietnam.vn, 11/2025 |
| **Techcombank** | >1 triệu (Q2/2025) | +224,000 trong 12 tháng | >100 nghìn tỷ VND (2024) | vietnam.vn, 11/2025 |
| **VIB** | 1 triệu (8/2025) | +142,000 so với cuối 2024 | >100 nghìn tỷ VND (2024) | vietnam.vn, 11/2025 |
| **Sacombank** | >1 triệu (đầu 2025) | Không công bố cụ thể | Không công bố | vietnam.vn, 11/2025 |
| **TPBank** | Không công bố | Tăng ~140% trong 2023; doanh số 29 nghìn tỷ VND | Riêng Visa >$1 tỷ/năm (2023) | TPBank website, 2024 |

**Nhận xét:** VPBank phát hành gấp 2–3 lần Techcombank và VIB. Visa xếp TPBank Top 3 tăng trưởng giao dịch CC. 4 bank (VPBank, Techcombank, VIB, Sacombank) đã gia nhập "câu lạc bộ triệu thẻ". *(vietnam.vn, 11/2025)*

### 2.3. Market share tham khảo (2021, dữ liệu cũ nhất có nguồn)

| Bank | Market share CC quốc tế (H1/2021) |
|------|-----------------------------------|
| TPBank | 17% |
| VPBank | 16% |
| Techcombank | 15.7% |
| VIB | 8% |
| Sacombank | 6% |

*Nguồn: VIR, 12/2021. Lưu ý: market share có thể đã thay đổi đáng kể đến 2025 — VPBank đã vượt lên dẫn đầu.*

---

## 3. Ước tính hồ sơ (decisions) / ngày 🔶 Derived

### Phương pháp tính

```
Hồ sơ approve/ngày = Thẻ mới phát hành/năm ÷ ~250 ngày làm việc
Tổng hồ sơ nộp/ngày = Hồ sơ approve/ngày ÷ Approval Rate (ước tính)
Decisions/ngày = Tổng hồ sơ nộp/ngày (100% đi qua AI scoring)
```

Approval rate cho CC tại VN chưa có nguồn public. Industry benchmark toàn cầu cho credit card: **30–50%** approval rate *(không có nguồn cụ thể cho VN — cần validate)*. Dùng 2 scenario: AR 40% (trung bình) và AR 30% (thận trọng, phù hợp giai đoạn NPL cao).

### Bảng ước tính

| Bank | Thẻ mới/năm ✅ | Approve/ngày 🔶 | Decisions/ngày (AR 40%) 🔶 | Decisions/ngày (AR 30%) 🔶 |
|------|---------------|----------------|---------------------------|---------------------------|
| **VPBank** | ~500,000 | ~2,000 | ~5,000 | ~6,700 |
| **Techcombank** | ~224,000 | ~900 | ~2,250 | ~3,000 |
| **VIB** | ~142,000 | ~570 | ~1,425 | ~1,900 |
| **TPBank** | ~150,000–200,000 (est.) | ~600–800 | ~1,500–2,000 | ~2,000–2,700 |
| **Digital bank nhỏ** (Timo, Cake, TNEX) | ~10,000–50,000 (est.) | ~40–200 | ~100–500 | ~130–670 |

### Peak vs Average 🔶 Derived

Volume thực tế không phẳng đều — dao động lớn theo ngày và mùa:

- **Peak day** (cuối tháng, campaign phát hành CC, mùa Tết, bonus season): ước tính gấp **1.5–2x** trung bình.
- **Cuối tuần** (Thứ Bảy–Chủ Nhật): thấp hơn **30–50%** so với ngày thường (đối với bank truyền thống). Digital banks (Cake, TNEX) có thể phẳng hơn vì users nộp hồ sơ 24/7 qua app.

Ví dụ VPBank: average ~5,000 decisions/ngày → peak có thể **7,500–10,000 decisions/ngày**.

⚠️ Không có nguồn VN cụ thể cho traffic pattern — đây là ước tính dựa trên hành vi chung của CC origination. Cần validate với bank partner.

⚠️ **Digital bank nhỏ** (Timo, Cake, TNEX): không có data phát hành CC public. Riêng Cake by VPBank xử lý >1 triệu đơn tín dụng/tháng *(VIR, 1/2026)* nhưng bao gồm cả consumer loan, BNPL, không chỉ CC — nên không dùng trực tiếp.

---

## 4. Thời gian review 1 hồ sơ ❌ Gap + Global benchmark

### Không có nguồn VN cụ thể

Không tìm được nguồn public nào nói rõ "1 credit officer VN mất X phút để review 1 hồ sơ CC". Đây là data operational nội bộ.

### Global benchmark (để tham chiếu)

| Metric | Benchmark | Nguồn |
|--------|-----------|-------|
| % thời gian cho data gathering | **70%** thời gian loan team dành cho thu thập & nhập liệu | Fluxforce, trích McKinsey, 12/2025 |
| Thời gian underwriting manual (SME) | **3 ngày** (trước AI) → **30 phút** (sau AI) | Fluxforce, trích UK fintech case, 12/2025 |
| Credit review truyền thống | **Nhiều ngày** → gần **real time** với agentic AI | McKinsey, "The future is agentic", 12/2025 |
| AI scoring per case (low-risk) | Approval time giảm tới **90%** | NeonTri, trích Autonomous Research, 9/2025 |

### TPBank — Case cụ thể tại VN ✅ Verified

- TPBank triển khai **15+ mô hình ML** trong 2024 cho hoạt động kinh doanh. *(IBM Case Study — TPBank, 2024)*
- Thời gian deploy model giảm từ **36 → 30 ngày** làm việc (giảm ~17%). *(IBM Case Study — TPBank, 2024)*
- Customer conversion rate tăng **24%**. *(IBM Case Study — TPBank, 2024)*
- **75–80%** khách hàng mới đến từ kênh digital; chỉ 20–25% từ chi nhánh. *(The Asian Banker, 2025)*

**Nhận xét:** TPBank đã dùng ML nhưng chủ yếu cho propensity model (predict ai sẽ mở CC) — chưa phải credit scoring/decision support tại origination. Đây là gap mà sản phẩm AI-CRDS nhắm tới.

---

## 5. Số Credit Officer ❌ Gap

Không có nguồn public nào công bố số Credit Officer hoặc Credit Analyst tại từng bank VN.

### Tham chiếu gián tiếp

| Bank | Tổng nhân viên (ước tính) | Credit/Risk operations (est. 5–10% tổng) | Nguồn |
|------|--------------------------|----------------------------------------|-------|
| Vietcombank | ~20,000+ | ~1,000–2,000 | Annual report references |
| VPBank | ~25,000+ | ~1,250–2,500 | Annual report references |
| Techcombank | ~12,000+ | ~600–1,200 | Annual report references |

⚠️ Tỷ lệ 5–10% là ước tính industry chung, không phải số cụ thể cho VN. Phần credit/risk operations bao gồm cả fraud, collection, policy — không chỉ origination review.

---

## 6. Tỷ lệ Approve / Reject / Manual Review ❌ Gap

### Không có nguồn VN cụ thể

Không bank VN nào publish approval rate, reject rate, hoặc manual review rate cho CC.

### Ước tính dựa trên logic nghiệp vụ 🔶

Quy trình origination CC tại bank VN thường gồm:

```
Hồ sơ nộp → Auto-check (CIC, eKYC, rules) → Kết quả:
  ├── Auto-approve (rõ ràng tốt, đủ điều kiện) → phát hành
  ├── Auto-reject (rõ ràng xấu, CIC đen, fraud flag) → từ chối
  └── Manual review (borderline, thiếu data, cần xác minh) → Credit Officer xem
```

| Scenario | Auto-approve | Manual review | Auto-reject | Ghi chú |
|----------|-------------|---------------|-------------|---------|
| Bank có scorecard mature (VPBank, Techcombank) | 20–30% | 40–50% | 20–30% | Ước tính, chưa verified |
| Bank chưa có AI scoring | 10–15% | 50–60% | 25–35% | Ước tính, chưa verified |
| Target sau khi có AI-CRDS | 40–50% | 20–30% | 20–30% | Target conservative |

⚠️ **Tất cả con số trong bảng này là ước tính** dựa trên hiểu biết về quy trình banking, chưa có nguồn public xác thực cho VN. Cần validate với bank partner.

---

## 7. Tổng hợp — Cái gì biết, cái gì chưa

| Metric | Status | Data tốt nhất hiện có |
|--------|--------|----------------------|
| Thẻ CC phát hành/năm per bank | ✅ **Verified** | VPBank 500K, TCB 224K, VIB 142K *(vietnam.vn, 11/2025)* |
| Doanh số giao dịch CC per bank | ✅ **Verified** | VPBank, TCB, VIB đều >100 nghìn tỷ VND *(vietnam.vn, 11/2025)* |
| Tổng thẻ lưu hành toàn thị trường | ✅ **Verified** | ~157 triệu thẻ ngân hàng, ~10.2 triệu CC *(VIR 5/2025; VBA 2024)* |
| AI đã dùng tại bank VN | ✅ **Verified** | TPBank: 15+ ML models, conversion +24% *(IBM 2024)* |
| Digital acquisition ratio | ✅ **Verified** | TPBank: 75–80% digital *(Asian Banker 2025)* |
| Decisions/ngày per bank | 🔶 **Derived** | Tính từ thẻ phát hành ÷ ngày ÷ est. AR |
| Peak vs average pattern | 🔶 **Derived** | Peak ~1.5–2x average; cuối tuần -30–50% |
| Thời gian review/hồ sơ | ❌ **Gap** | Chỉ có global benchmark (McKinsey, Fluxforce) |
| Số Credit Officer per bank | ❌ **Gap** | Chỉ có ước tính từ tổng nhân sự |
| Approval / reject / manual rate | ❌ **Gap** | Chỉ có ước tính nghiệp vụ, chưa verified |

---

## 8. Action Items — Cần validate khi có bank partner

Các data gaps ở trên cần được fill trong giai đoạn **Discovery (Week 13)** và **Pilot Negotiation (Week 40)**. Câu hỏi cụ thể cần hỏi bank:

1. **Volume:** Bao nhiêu hồ sơ CC mới nộp/ngày (trung bình và peak)? Ngày nào trong tuần nhiều nhất?
2. **Thời gian:** 1 hồ sơ CC mất bao lâu từ nộp → quyết định approve/reject? Chia bao nhiêu % thời gian cho data gathering vs analysis vs quyết định?
3. **Nhân sự:** Bao nhiêu Credit Officer/Analyst xử lý CC origination? Mỗi người xử lý bao nhiêu hồ sơ/ngày?
4. **Tỷ lệ:** Approval rate hiện tại? Bao nhiêu % auto-approve vs manual review vs auto-reject?
5. **Pain point cụ thể:** Điểm nào trong quy trình mất thời gian nhất? Loại hồ sơ nào khó quyết định nhất?
6. **Technology:** Đang dùng scorecard/model nào? Rules engine hay ML? Có CIC integration tự động chưa? Scoring system chạy batch hay real-time?

### Forward references — topics cho các tuần sau

Một số technical decisions phụ thuộc vào data từ bank partner, sẽ được thiết kế ở các tuần sau trong roadmap:

| Topic | Thuộc Week | Phụ thuộc vào |
|-------|-----------|--------------|
| API latency SLA (target p95/p99) | Week 10 — Technical Fluency | Bank's current SLA, CIC/eKYC API latency thực tế |
| QPS planning & infra sizing | Week 11 — Coding Ramp-up | Decisions/ngày thực tế, peak pattern confirmed |
| Model update frequency (batch/realtime) | Week 26 — Drift & Monitoring | Model architecture, data pipeline, bank IT constraints |
| ROI calculation chi tiết | Week 4 — Damage Model & Break-even | Baseline confirmed từ bank: time/case, cost/analyst, NPL CC |

---

## Changelog

| Version | Thay đổi | Lý do |
|---------|---------|-------|
| v1.0 | Bản gốc | — |
| v1.1 | Thêm Section 1: định nghĩa "1 decision" | Clarify unit of measurement cho toàn bộ document |
| v1.1 | Thêm "Peak vs Average" trong Section 3 | Input cho capacity planning, dù chưa cần design infra ở Week 1 |
| v1.1 | Đổi tên cột "Tổng hồ sơ nộp/ngày" → "Decisions/ngày" | Consistent với definition mới |
| v1.1 | Thêm Cake >1M đơn/tháng note trong Section 3 | Context quan trọng nhưng ghi rõ includes non-CC |
| v1.1 | Thêm "Forward references" trong Section 8 | Ghi nhận SLA, QPS, model update, ROI là topics cho Week 4/10/11/26 — không premature |

---

## Nguồn tham khảo

| # | Nguồn | Nội dung | Thời điểm |
|---|-------|----------|-----------|
| 1 | vietnam.vn — "Thị trường thẻ tín dụng bứt tốc" | VPBank 1.7M CC, 500K mới; TCB 1M CC; VIB 1M CC; doanh số >100 nghìn tỷ | 11/2025 |
| 2 | TPBank website — "Thẻ TPBank phát triển bùng nổ" | CC mới +140% (2023), doanh số 29 nghìn tỷ VND, Visa >$1B/năm | 2024 |
| 3 | VIR — "Bank card circulation hit 157 million in Q1" | 157M thẻ tổng, 50.2M quốc tế, +1.8M Q1/2025 | 5/2025 |
| 4 | IBM Case Study — TPBank | 15+ ML models, deploy time -17%, conversion +24% | 2024 |
| 5 | The Asian Banker — TPBank digital banking | 14M khách, 75–80% digital acquisition, 2M mới trong 2024 | 2025 |
| 6 | McKinsey — "The future is agentic" | Agentic AI: 40–80% productivity uplift, credit review ngày → real time | 12/2025 |
| 7 | Fluxforce, trích McKinsey | 70% thời gian = data gathering; UK fintech: 3 ngày → 30 phút | 12/2025 |
| 8 | VIR — "Banks reposition for trend transition" | Market share CC quốc tế H1/2021: TPBank 17%, VPBank 16%, TCB 15.7% | 12/2021 |
| 9 | VIR — "Cake by VPBank posts strong gains" | >1M đơn tín dụng/tháng (bao gồm CC + consumer loan + BNPL) | 1/2026 |