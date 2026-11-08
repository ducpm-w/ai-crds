# Budget Estimate v0 — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## Mục đích

Budget estimate phục vụ đề xuất gửi C-level, chia thành 3 giai đoạn với mức đề xuất rõ ràng:
- **Phase 0 (Discovery):** đề xuất phê duyệt ngay, ngân sách nhỏ, rủi ro thấp
- **Phase 1 (Limited Deployment):** đề xuất sau khi có kết quả Phase 0, ngân sách trung bình
- **Full Deployment:** chỉ nêu khoảng chi phí, cam kết sau khi có kết quả Phase 1

Cách tiếp cận là đề xuất từng bước nhỏ: một phê duyệt cho 8 tuần shadow testing dễ được thông qua hơn một cam kết 60 tuần và 15 tỷ VND.

Số liệu trong tài liệu là giả định lập kế hoạch dựa trên mặt bằng thị trường 2025-2026 tại Hà Nội/TP.HCM. Số liệu sẽ được thay bằng đơn giá thực của Bank X (chi phí IT, giá cloud, phí CIC, mức lương nội bộ) khi có.

---

## PHASE 0 — DISCOVERY & SHADOW TESTING (8 tuần)

Phase 0 là khoản ngân sách đề xuất chính tại buổi trình C-level.

**Mục tiêu Phase 0:**
1. Đánh giá khả năng sẵn có và chất lượng dữ liệu tại Bank X
2. Xây dựng MVP demo (dữ liệu tổng hợp)
3. Shadow test: AI chấm điểm song song với quyết định thủ công, chỉ quan sát và không ảnh hưởng quyết định
4. Thu thập bằng chứng cho đề xuất Phase 1

**Rủi ro đối với Bank X:** gần bằng 0. AI chỉ quan sát, không ra quyết định, không ảnh hưởng khách hàng và không thay đổi quy trình hiện tại.

### Phase 0 — Headcount

| Role | FTE | Duration | Monthly all-in | Total | Ghi chú |
|------|-----|----------|---------------|-------|---------|
| Project Manager | 1.0 | 8 tuần (2 tháng) | 40M | 80M | Toàn thời gian. Quản lý stakeholder, roadmap, tài liệu. |
| Data Scientist (senior) | 1.0 | 8 tuần | 55M | 110M | Phát triển model, feature engineering, thiết lập shadow testing. |
| Backend Developer | 0.5 | 8 tuần | 35M | 35M | Tích hợp CIC API, audit trail prototype, data pipeline. |
| IT Support (phía Bank X) | 0.3 | 8 tuần | 20M | 12M | Truy cập CBS, môi trường test CIC, thiết lập mạng. |
| Subtotal Headcount | 2.8 FTE | | | 237M | |

### Phase 0 — Infrastructure

| Item | Cost | Ghi chú |
|------|------|---------|
| Development environment (VN cloud) | 15M | Viettel/FPT Cloud: instance dev/staging, GPU nhỏ nếu cần. |
| CIC API test access | 10M | Truy vấn test với khối lượng nhỏ, có thể dùng sandbox CIC. |
| Tools & licenses | 5M | GitHub, monitoring, CI/CD. Có thể dùng gói miễn phí. |
| Subtotal Infra | 30M | |

### Phase 0 — Compliance & Legal

| Item | Cost | Ghi chú |
|------|------|---------|
| DPIA preparation (draft) | 30M | Soạn DPIA theo Mẫu 10 NĐ 356. Bản nháp, hoàn thiện ở Phase 1. |
| Legal review (initial) | 20M | Rà soát luồng consent, khung trách nhiệm, đánh giá theo Luật AI 134/2025. |
| Compliance Officer time (Bank X) | 0 | Nguồn lực nội bộ, không tính vào ngân sách dự án. |
| Subtotal Compliance | 50M | |

### Phase 0 — Other

| Item | Cost | Ghi chú |
|------|------|---------|
| Training materials (draft) | 10M | Tài liệu briefing cho CO về shadow testing. |
| Synthetic data generation | 5M | 10K bản ghi: compute và kiểm tra. Chi phí tối thiểu. |
| Contingency (10%) | 33M | Dự phòng cho phát sinh. |
| Subtotal Other | 48M | |

### Phase 0 — TOTAL

```
┌─────────────────────────────────────────┐
│          PHASE 0 BUDGET                 │
│                                         │
│  Headcount:     237M VND                │
│  Infrastructure:  30M VND               │
│  Compliance:      50M VND               │
│  Other:           48M VND               │
│  ─────────────────────────              │
│  TOTAL:         365M VND                │
│                                         │
│  ≈ $14,500 USD                          │
│  Thời gian: 8 tuần                      │
│  Rủi ro: gần bằng 0                     │
│                                         │
│  Deliverables:                          │
│  - Đánh giá chất lượng dữ liệu (thực)   │
│  - MVP demo (dữ liệu tổng hợp)          │
│  - Kết quả shadow testing (4 tuần)      │
│  - Đề xuất Phase 1 kèm bằng chứng       │
│  - Bản nháp DPIA                        │
└─────────────────────────────────────────┘
```

Để so sánh, 365M VND tương đương chi phí khoảng 4 hồ sơ thẻ phê duyệt sai (4 × 50M hạn mức × 70% LGD × 100% PD). Nếu Phase 0 ngăn được 4 trường hợp fraud hoặc phê duyệt sai, khoản đầu tư đã hòa vốn.

---

## PHASE 1 — LIMITED DEPLOYMENT (16 tuần)

Phase 1 được đề xuất sau khi có kết quả Phase 0.

**Mục tiêu Phase 1:**
1. AI đề xuất quyết định cho một nhóm hồ sơ, CO vẫn review tất cả
2. Đo lường: độ chính xác AI so với thủ công, tỷ lệ override, phản hồi từ CO
3. Xây dựng hạ tầng sẵn sàng cho production
4. Hoàn tất DPIA và phê duyệt tuân thủ

**Điều kiện kích hoạt Phase 1:** kết quả Phase 0 cho thấy (a) chất lượng dữ liệu đủ cho model, (b) độ chính xác AI trong shadow test không thấp hơn baseline thủ công, (c) không có vấn đề tuân thủ mang tính chặn.

### Phase 1 — Headcount

| Role | FTE | Duration | Monthly all-in | Total | Ghi chú |
|------|-----|----------|---------------|-------|---------|
| Project Manager | 1.0 | 16 tuần (4 tháng) | 40M | 160M | Toàn thời gian. |
| Data Scientist (senior) | 1.0 | 16 tuần | 55M | 220M | Hoàn thiện model, thiết lập champion-challenger. |
| Data Scientist (mid) | 0.5 | 16 tuần | 35M | 70M | Feature engineering, giám sát bias. |
| Backend Developer | 1.0 | 16 tuần | 35M | 140M | Production API, audit trail, hoàn thiện tích hợp. |
| Frontend Developer | 0.5 | 12 tuần (3 tháng) | 30M | 90M | Giao diện review production cho CO. |
| QA / Testing | 0.3 | 12 tuần | 25M | 22.5M | Kiểm thử tích hợp, hỗ trợ UAT. |
| IT Support (Bank X) | 0.5 | 16 tuần | 20M | 40M | Môi trường production, tích hợp CBS. |
| Subtotal Headcount | 4.8 FTE | | | 742.5M | |

### Phase 1 — Infrastructure

| Item | Cost | Ghi chú |
|------|------|---------|
| Production environment (VN cloud) | 120M | Chuẩn production: dự phòng, SLA 99.9%, GPU inference. |
| CIC API (production queries) | 80M | ~3,000 queries/tháng × 4 tháng × ~7K/query. |
| eKYC integration cost | 30M | Nỗ lực tích hợp và truy vấn test. |
| Monitoring & alerting | 20M | Phát hiện drift, giám sát hiệu năng, hạ tầng cảnh báo. |
| Subtotal Infra | 250M | |

### Phase 1 — Compliance & Training

| Item | Cost | Ghi chú |
|------|------|---------|
| DPIA finalization + nộp A05 | 50M | Tư vấn pháp lý rà soát cuối và nộp hồ sơ. |
| Legal (contracts, liability) | 40M | Hợp đồng vendor-ngân hàng, phân bổ trách nhiệm (Luật AI 134/2025). |
| Compliance audit | 30M | Kiểm toán nội bộ trước khi triển khai. |
| CO training (10-15 buổi) | 40M | Tài liệu đào tạo, các buổi huấn luyện, hướng dẫn sử dụng. 2-3 buổi/tuần × 5 tuần. |
| Change management | 25M | Kế hoạch truyền thông, FAQ, cập nhật cho stakeholder. |
| Subtotal Compliance & Training | 185M | |

### Phase 1 — Other

| Item | Cost | Ghi chú |
|------|------|---------|
| Stress testing infrastructure | 20M | Kiểm thử tải, kiểm thử kịch bản lỗi. |
| Contingency (10%) | 120M | Dự phòng cho phát sinh. |
| Subtotal Other | 140M | |

### Phase 1 — TOTAL

```
┌─────────────────────────────────────────┐
│        PHASE 1 BUDGET ESTIMATE          │
│    (đề xuất sau Phase 0, có điều kiện)  │
│                                         │
│  Headcount:      742.5M VND             │
│  Infrastructure:   250M VND             │
│  Compliance:       185M VND             │
│  Other:            140M VND             │
│  ─────────────────────────              │
│  TOTAL:          1.32 tỷ VND            │
│                                         │
│  ≈ $52,500 USD                          │
│  Thời gian: 16 tuần                     │
│  Điều kiện: Phase 0 đạt                 │
│                                         │
│  Deliverables:                          │
│  - Hệ thống AI scoring sẵn sàng         │
│    cho production                       │
│  - Kết quả limited deployment           │
│  - Tuân thủ đầy đủ (DPIA, Luật AI)      │
│  - Đội CO đã được đào tạo               │
│  - Đề xuất full deployment              │
└─────────────────────────────────────────┘
```

---

## FULL DEPLOYMENT — KHOẢNG CHI PHÍ

Chi phí Full Deployment được nêu theo khoảng, phụ thuộc kết quả Phase 0 và Phase 1.

**Mục tiêu:** AI-CRDS vận hành cho toàn bộ quy trình mở thẻ tín dụng.

### Full Deployment — Cost Range

| Category | Low | Mid | High | Assumption |
|---------|-----|-----|------|-----------|
| Headcount (phần còn lại Year 1) | 400M | 800M | 1.5 tỷ | Đội vận hành: 2-3 FTE (PM + ML engineer + hỗ trợ). 6-8 tháng sau Phase 1. |
| Infrastructure (hàng năm) | 300M | 600M | 1.2 tỷ | Quy mô production. Phụ thuộc khối lượng và lựa chọn cloud. |
| CIC/eKYC (hàng năm) | 200M | 500M | 1 tỷ | 3,000-5,000 queries/tháng. Tăng theo khối lượng phê duyệt. |
| Compliance ongoing | 100M | 200M | 400M | Báo cáo quý, cập nhật DPIA, tuân thủ Luật AI, hỗ trợ kiểm toán. |
| Model lifecycle (hàng năm) | 200M | 400M | 700M | Huấn luyện lại, kiểm định, giám sát drift, champion-challenger. |
| TOTAL ANNUAL (sau triển khai) | 1.2 tỷ | 2.5 tỷ | 4.8 tỷ | |

### Full Deployment — Total Project Cost (Phase 0 đến Full Year 1)

| Phase | Duration | Cost |
|-------|----------|------|
| Phase 0 (Discovery) | 8 tuần | 365M |
| Phase 1 (Limited) | 16 tuần | 1.32 tỷ |
| Full Deployment setup | 8-12 tuần | ~800M-1.5 tỷ (tăng thêm) |
| Annual run (Year 1, một phần) | 6-8 tháng | ~1.0-2.0 tỷ |
| TOTAL YEAR 1 | ~12 tháng | 3.5 tỷ - 5.2 tỷ |

So với phân tích break-even (w04-02-break-even-analysis): khoản đầu tư 3.5-5.2 tỷ so với mức tiết kiệm kỳ vọng 26.64 tỷ/năm (khi đạt ramp-up đầy đủ), tương ứng hòa vốn trong 3-5 tháng sau full deployment.

Budget v0 thấp hơn mức ước tính trong w04-02-break-even-analysis (9.65 tỷ ở kịch bản cơ sở) vì:
1. Phân tích break-even tính toàn bộ chi phí đội ngũ và dự phòng rộng rãi
2. Budget v0 giả định tăng nhân sự theo từng giai đoạn, không tuyển đủ đội từ ngày đầu
3. Budget v0 giả định sử dụng nhân sự IT của Bank X, không thuê riêng
4. Cả hai con số đều nằm trong khoảng chấp nhận được: một bên thận trọng, một bên sát thực tế

---

## TỔNG HỢP — ĐẦU TƯ THEO GIAI ĐOẠN

### Ngân sách theo bậc thang: đề xuất nhỏ trước, tăng dần

```
Phase 0:   ████░░░░░░░░░░░░░░░░  365M VND    (đề xuất phê duyệt ngay)
Phase 1:   ████████░░░░░░░░░░░░  1.32 tỷ     (đề xuất sau Phase 0)
Full:      ████████████████░░░░  2-4 tỷ/năm  (đề xuất sau Phase 1)
           ─────────────────────
           0     1     2     3     4 tỷ VND

Timeline:  Tuần 1-8   Tuần 9-24   Tuần 25+
           ═════════  ═════════   ═════════════
           Phase 0    Phase 1     Full Deploy
```

### Gate Conditions — Ngân sách chỉ được giải ngân khi qua cổng

| Gate | Condition | Who approves | Budget unlocked |
|------|----------|-------------|----------------|
| Gate 0 → 1 | Kết quả Phase 0: chất lượng dữ liệu ≥ 3.5/5, độ chính xác shadow test ≥ baseline, không có vấn đề tuân thủ mang tính chặn | Risk Manager + CTO | Phase 1: 1.32 tỷ |
| Gate 1 → Full | Kết quả Phase 1: AI vượt thủ công ở ≥2/4 chỉ số (NPL, fraud, approval rate, time-to-decision), CO adoption ≥70%, đã được phê duyệt tuân thủ | C-level + Risk Committee | Full: 2-4 tỷ/năm |
| Dừng dự án | Bất kỳ cổng nào không đạt thì dự án tạm dừng. Chi phí đã chi = Phase 0 (365M) hoặc Phase 0+1 (1.68 tỷ). | C-level | Không áp dụng |

### Mức thiệt hại tối đa

| Scenario | Sunk cost | Outcome |
|---------|----------|---------|
| Phase 0 không đạt, dừng dự án | 365M | Có đánh giá thực trạng chất lượng dữ liệu. Bản nháp DPIA tái sử dụng được. |
| Phase 1 không đạt, dừng dự án | 1.68 tỷ | Có dữ liệu shadow test. Đội CO đã được đào tạo. Hạ tầng production tái sử dụng được. Hoàn tất phần tuân thủ. |
| Full deploy dưới kỳ vọng | 3.5-5 tỷ | Hệ thống đang chạy, có thể tinh chỉnh. Khó xảy ra tổn thất toàn phần vì vẫn thu được một phần lợi ích. |

Thiệt hại tối đa ở Phase 0 là 365M VND, trong khi lợi ích tối đa là hơn 27 tỷ VND/năm. Đây là khoản đầu tư có mức lợi ích vượt trội so với rủi ro.

---

## BUILD vs BUY — SO SÁNH CHI PHÍ

| | Build In-house | Buy Vendor |
|--|---------------|-----------|
| Phase 0 tương đương | 365M | ~500M-1 tỷ (phí POC vendor + tích hợp) |
| Phase 1 tương đương | 1.32 tỷ | ~2-3 tỷ (license + tích hợp + tùy biến) |
| Annual run | 2-4 tỷ | 4-8 tỷ (license định kỳ: 2-4 tỷ/năm) |
| 3-year TCO | 8-14 tỷ | 14-27 tỷ |
| IP ownership | Bank X sở hữu | Vendor sở hữu |
| VN regulatory fit | Thiết kế cho Luật AI, BVDLCN, SBV | Cần điều chỉnh |
| Explainability | Minh bạch đầy đủ | Rủi ro hộp đen |
| Time to first value | 6-8 tháng | 3-5 tháng |

Khuyến nghị: tự phát triển (in-house). TCO 3 năm thấp hơn 40-50%, sở hữu toàn bộ IP và tuân thủ quy định ngay từ thiết kế.

---

## NGUỒN NGÂN SÁCH

| Option | Mô tả | Ưu điểm | Hạn chế |
|--------|-------|---------|---------|
| IT Budget | Phân bổ từ ngân sách IT hàng năm | Quen thuộc, ít tầng phê duyệt | Ngân sách IT thường chặt, cạnh tranh với các dự án khác |
| Innovation Fund | Quỹ đổi mới sáng tạo nội bộ | Dành riêng cho loại dự án này | Không phải ngân hàng nào cũng có |
| Risk/Compliance Budget | Trình bày như khoản đầu tư giảm rủi ro | Giảm NPL là KPI của khối Rủi ro | Ít phổ biến, cần Risk Manager bảo trợ |
| Business Case (mới) | Đề xuất riêng dựa trên ROI | Rõ ràng, minh bạch, gắn với kết quả | Cần C-level bảo trợ |
| Phased from P&L | Hấp thụ Phase 0 vào chi phí vận hành | Phase 0 nhỏ (365M) có thể hấp thụ | Chỉ phù hợp với Phase 0 |

Đề xuất: Phase 0 hấp thụ vào ngân sách IT/Innovation (365M, quy mô nhỏ, dễ phê duyệt). Phase 1 trở đi dùng business case riêng với luận cứ ROI.

---

## KẾ HOẠCH NHÂN SỰ

### Phase 0 Team

```
PM (1.0 FTE) ─────────── Project Manager
                         ├── Quản lý stakeholder
                         ├── Roadmap & tài liệu
                         └── Báo cáo C-level

DS (1.0 FTE) ─────────── Senior Data Scientist
                         ├── Phát triển model
                         ├── Feature engineering
                         └── Phân tích shadow testing

Dev (0.5 FTE) ────────── Backend Developer
                         ├── Tích hợp CIC API
                         ├── Audit trail prototype
                         └── Data pipeline

IT (0.3 FTE) ─────────── Bank X IT Support
                         ├── Truy cập CBS
                         ├── Môi trường test CIC
                         └── Thiết lập mạng

Tổng: 2.8 FTE trong 8 tuần
```

### Nguồn nhân sự: tuyển mới hoặc điều động

| Role | Tuyển mới | Điều động nội bộ | Ghi chú |
|------|----------|------------------|---------|
| PM | Có thể | Ưu tiên PM có kinh nghiệm AI/ngân hàng | PM có kinh nghiệm AI/ngân hàng ít sẵn có tại VN |
| Senior DS | Dự kiến tuyển mới | ML engineer có kinh nghiệm ngân hàng hiếm tại VN | Lương 40-70M/tháng (Adecco 2025). Thời gian tuyển 4-8 tuần. |
| Backend Dev | Không | Điều động từ đội IT | Đội IT của ngân hàng thường có dev sẵn sàng. Phân bổ bán thời gian 0.5 FTE. |
| IT Support | Không | Nhân sự nội bộ Bank X | Phân bổ bán thời gian từ đội IT hiện có. |

---

## PHẠM VI VÀ LƯU Ý

1. Budget v0 là bản ước tính ban đầu, được hiệu chỉnh khi có đơn giá thực của Bank X (chi phí IT, giá cloud, phí CIC).
2. Chi phí nhân sự dựa trên mặt bằng thị trường Hà Nội/TP.HCM 2025-2026; mức lương nội bộ của Bank X có thể khác tùy loại hình ngân hàng.
3. Ngân sách Phase 0 (365M) được thiết kế ở mức thấp có chủ đích: đề xuất nhỏ, chứng minh giá trị, rồi mở rộng.
4. Phí CIC API mỗi truy vấn khác nhau giữa các ngân hàng; số liệu dùng ở đây là giả định lập kế hoạch.
5. Mức dự phòng 10% là thận trọng; thực tế dự án có thể vượt 20-30%.
6. Tài liệu liên quan: w04-02-break-even-analysis (luận cứ ROI), w04-01-damage-model-bank-x (chi phí khi không hành động), w02-04-sbv-requirements (cơ sở chi phí tuân thủ).
