# Trust Calibration Guide — CO × AI-CRDS
> Dự án: AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Credit Officer (CO) của Bank X cần ở vùng niềm tin được hiệu chỉnh: không tin AI quá mức dẫn tới xác nhận máy móc, không ngờ vực quá mức dẫn tới bỏ qua AI. Tài liệu mô tả ba vùng niềm tin, các biện pháp phòng ngừa lệch vùng và chương trình làm quen dành cho CO.

Các ngưỡng, tỷ lệ và thời lượng trong tài liệu là giả định thiết kế ban đầu; sẽ được hiệu chỉnh theo dữ liệu vận hành thực tế của Bank X.

---

## 1. BA VÙNG NIỀM TIN

```
Phổ niềm tin:

UNDER-TRUST          CALIBRATED TRUST           OVER-TRUST
(ignoring AI)        (vùng mục tiêu)              (rubber-stamping)
     │                    │                          │
     ▼                    ▼                          ▼
├─────────────────┤ ├──────────────────────┤ ├───────────────────┤
│ Override >50%   │ │  Override 10-20%      │ │ Override <5%      │
│ AI panel ignored│ │  AI = starting point  │ │ Review <2 min     │
│ No time saving  │ │  CO adds judgment     │ │ Never questions AI│
│ Lãng phí đầu tư │ │  Both add value       │ │ AI errors missed  │
├─────────────────┤ ├──────────────────────┤ ├───────────────────┤
     Không phù hợp       Phù hợp                   Không phù hợp
```

---

## 2. LỆCH VÙNG 1: TIN QUÁ MỨC (XÁC NHẬN MÁY MÓC)

### Dấu hiệu

| Tín hiệu | Cách phát hiện | Ngưỡng |
|--------|-----------------|----------|
| Override rate extremely low | Giám sát L3-W2 | < 5% sustained 2 weeks |
| Review time too fast | `co_review_time_seconds` | State 1 batch: < 30 sec/record. State 2: < 3 min. |
| Never expands detail in batch | UI interaction log | < 20% records expanded in batch review |
| Never uses escalate/need-info | State 4/5 from CO = 0 | 0 escalations in 1 month |
| Agrees with AI 100% | Override rate = 0% | 0 overrides in 2+ weeks |

### Rủi ro

- CO không phát hiện lỗi của AI, dẫn tới NPL tăng do các hồ sơ AI đánh giá sai không bị phát hiện
- Violated spirit of human-in-the-loop (Luật AI 134/2025 Điều 4)
- Khi SBV thanh tra, có thể bị đặt câu hỏi: hồ sơ được CO xem xét trong 20 giây thì có phải là xem xét thực chất không
- Lỗi mô hình tích lũy do thiếu tín hiệu hiệu chỉnh từ con người, mô hình không được cải thiện

### Biện pháp phòng ngừa

| # | Biện pháp | Cách thực hiện | Thời điểm |
|---|---------|---------------|------|
| 1 | Kiểm tra ngẫu nhiên | Lấy mẫu ngẫu nhiên 10 lần xác nhận hàng loạt mỗi tuần; Supervisor kiểm tra CO có xem các trường thông tin chính hay không | Hàng tuần (Supervisor) |
| 2 | Cảnh báo thời gian review | Hệ thống cảnh báo khi thời gian review trung bình ở State 1 dưới 2 phút và thông báo Supervisor | Thời gian thực (dashboard) |
| 3 | Buổi "AI was wrong" hàng tháng | Trình bày cho CO 5-10 hồ sơ AI đề xuất duyệt nhưng khách hàng vỡ nợ hoặc gian lận, kèm thông điệp: đây là điểm AI bỏ sót và là lý do việc review của CO quan trọng | Hàng tháng (quản lý dự án và DS điều phối) |
| 4 | Không có nút "chọn tất cả" trong giao diện duyệt hàng loạt | CO phải đánh dấu từng dòng trong duyệt hàng loạt, không thể chọn tất cả rồi xác nhận tất cả | Thiết kế (w09-02-ux-wireframes-v1) |
| 5 | Bắt buộc mở chi tiết cho ít nhất 20% lô | Hệ thống yêu cầu CO mở chi tiết ít nhất 2/10 hồ sơ trong lô, chọn ngẫu nhiên, trước khi nút xác nhận được kích hoạt | Thiết kế (từ Phase 1) |
| 6 | Thử thách override | DS chọn 5 hồ sơ AI ở vùng biên (confidence 0.60-0.70) và hỏi CO có override hồ sơ nào không; nếu CO không override hồ sơ nào thì đó có thể là dấu hiệu tin quá mức | Hàng tháng (DS và Supervisor) |

---

## 3. LỆCH VÙNG 2: NGỜ VỰC QUÁ MỨC (BỎ QUA AI)

### Dấu hiệu

| Tín hiệu | Cách phát hiện | Ngưỡng |
|--------|-----------------|----------|
| Override rate extremely high | Giám sát L3-W2 | > 50% sustained 2 weeks |
| AI panel not viewed | UI interaction log (future) | CO clicks decision without scrolling to AI panel |
| Takes same time as before AI | `co_review_time_seconds` State 2 | No reduction from as-is baseline (still 30-35 min) |
| Doesn't use AI explanation | CO notes don't reference AI factors | Manual review of CO notes |
| Escalation rate very high | L3-W4 | > 25% (CO doesn't trust any AI output, escalates everything) |

### Rủi ro

- AI không tạo giá trị vận hành, khoản đầu tư không phát huy tác dụng và năng lực của CO không được giải phóng
- C-level will question ROI: "We spent 10 tỷ and COs ignore the system?"
- Break-even pushed back indefinitely
- COs overworked (same workload as before AI)

### Biện pháp phòng ngừa

| # | Biện pháp | Cách thực hiện | Thời điểm |
|---|---------|---------------|------|
| 1 | Cho CO thấy hiệu quả của AI | Sau 1 tháng, cung cấp thống kê cho CO, ví dụ "Với các hồ sơ tương tự, AI đúng 87% số lần", để xây dựng niềm tin bằng dữ liệu | Từ Phase 1 (sau khi có dữ liệu shadow testing) |
| 2 | Phản hồi kết quả override | Hàng tháng cho CO xem kết quả override của chính mình, ví dụ "Trong 20 hồ sơ anh/chị override sang duyệt có 3 hồ sơ vỡ nợ (15%), trong khi hồ sơ AI đề xuất duyệt vỡ nợ 3,5%" | Hàng tháng (báo cáo của DS) |
| 3 | Làm quen từng bước | Không áp dụng AI ngay lập tức; chương trình làm quen 4 giai đoạn (mục 5) giúp CO xây dựng niềm tin dần | Làm quen |
| 4 | Giải đáp các lo ngại cụ thể | Các lo ngại phổ biến: "AI sẽ thay thế tôi" (CO vẫn là người ký quyết định), "AI sai" (cung cấp dữ liệu độ chính xác), "Tôi không hiểu AI" (đào tạo bằng ngôn ngữ đơn giản về những gì AI làm) | Đào tạo trước khi triển khai |
| 5 | CO tham gia cải thiện mô hình | Khi override của CO cho kết quả tốt hơn thì ghi nhận, ví dụ "Override của anh/chị giúp chúng tôi nhận ra một mẫu mới"; CO cảm thấy được trân trọng, không bị thay thế | Liên tục |
| 6 | So sánh nhẹ nhàng với đồng nghiệp | Ví dụ "Tỷ lệ override của anh/chị là 45%, mức trung bình của nhóm là 16%; anh/chị có muốn trao đổi thêm không?" Không mang tính xử phạt | Hàng tháng, trao đổi 1-1 (Supervisor) |

---

## 4. VÙNG MỤC TIÊU: NIỀM TIN ĐƯỢC HIỆU CHỈNH

### Chỉ dấu hành vi

| Hành vi | Biểu hiện | Chỉ số đại diện |
|---------|-------------------|-------------|
| Uses AI as starting point | CO reads AI score + explanation first, then reviews raw data. AI directs attention to key areas. | Review time reduced 30-50% from baseline |
| Overrides with specific reason | CO overrides when they have additional information AI doesn't have. Reason = specific, not "I disagree." | Override reason: REL/INC/EMP (specific) > OTH (vague) |
| Questions AI when signals conflict | Score says approve but CO sees red flag → escalates or investigates further instead of blindly following either. | Tỷ lệ chuyển cấp 10-15% |
| Acknowledges AI accuracy | CO says "AI was right on this one, I would have missed it." Not adversarial relationship. | Qualitative (interview feedback) |
| Reports AI errors | When CO believes AI output is wrong, selects "AI error suspected" → system logs → DS investigates. | Lý do ERR lớn hơn 0 nhưng dưới 10% số override |
| Batch reviews with attention | Ở State 1, CO mở chi tiết 30-50% số hồ sơ và dành 3-5 phút cho mỗi lô 10 hồ sơ, không xác nhận ngay lập tức. | Review time 3-5 min/batch. Expand rate 30-50%. |

### Mục tiêu định lượng

| Chỉ số | Ngờ vực quá mức | Hiệu chỉnh (mục tiêu) | Tin quá mức |
|--------|------------|----------------------|-----------|
| Override rate | > 40% | 10-20% | < 5% |
| Avg review time S1 (per record) | N/A (not using batch) | 2-4 min | < 30 sec |
| Avg review time S2 | > 30 min (same as manual) | 15-25 min | < 5 min |
| Expand rate (S1 batch) | N/A | 30-50% of records | < 10% |
| Override direction | All directions | 60-70% approve, 30-40% reject | N/A |
| Escalation rate | > 25% | 10-15% | < 3% |

---

## 5. CHƯƠNG TRÌNH LÀM QUEN CHO CO — 4 GIAI ĐOẠN

### Giai đoạn 1 — Shadow Mode (AI quan sát, CO quyết định như thường lệ)

```
Purpose: CO sees AI scores but doesn't need to use them.
Build familiarity without pressure.

Setup:
├── AI scoring runs on all applications
├── AI panel visible but labeled "Preview — cho tham khảo"
├── CO decides as normal (full manual review)
├── AI output NOT part of decision (no audit trail impact)
└── CO encouraged to note: "Tôi đồng ý/không đồng ý với AI"

Buổi tổng kết cuối giai đoạn:
├── Group discussion: "AI đúng bao nhiêu lần?"
├── Show aggregate: AI accuracy vs CO decisions
└── Address questions, concerns, fears
```

### Giai đoạn 2 — Dual Review (CO xem xét trước, sau đó mới xem AI)

```
Purpose: CO forms own judgment first, then compares with AI.
Prevents anchoring bias (CO influenced by AI score before reviewing).

Setup:
├── CO receives application WITHOUT AI panel visible
├── CO makes preliminary assessment (approve/reject/unsure)
├── CO clicks "Reveal AI Assessment" → AI panel appears
├── CO compares: "My assessment vs AI — same or different?"
├── CO makes final decision (can adjust after seeing AI)
└── Log: CO initial assessment + AI recommendation + final decision

Buổi tổng kết cuối giai đoạn:
├── Analyze: when did CO and AI agree/disagree?
├── When CO changed mind after seeing AI → was it good change?
├── When CO stuck with original despite AI → what was the outcome?
└── Build CO confidence: "My judgment + AI = better than either alone"
```

### Giai đoạn 3 — AI-First Mode (AI hiển thị trước, CO xem xét cùng thông tin AI)

```
Purpose: CO uses AI as starting point. Standard operational mode.

Setup:
├── AI panel visible from start (like production)
├── CO reviews with AI score + explanation
├── State routing active (S1/S2/S3/S4/S5)
├── Batch review enabled for State 1
├── Override flow active with logging
└── Supervisor monitoring active

Buổi tổng kết cuối giai đoạn:
├── Review: override rate, review time, batch behavior
├── Individual feedback per CO
├── Address any trust issues identified
└── Fine-tune: any UI changes needed?
```

### Giai đoạn 4 — Vận hành chuẩn

```
Purpose: Full production mode. AI-CRDS as designed.

Setup:
├── All features active
├── Full monitoring dashboard
├── Guardrails enforced
├── Override governance active
└── Monthly calibration sessions continue

Liên tục:
├── Monthly "AI was wrong" sessions
├── Monthly override outcome feedback
├── Quarterly trust assessment
└── Annual CO satisfaction survey
```

### Dòng thời gian làm quen

```
Giai đoạn 1     Giai đoạn 2     Giai đoạn 3     Giai đoạn 4
Shadow          Dual Review     AI-First        Vận hành chuẩn
──────────── ──────────────── ──────────── ────────────────
CO decides      CO first,       AI shows,       Full
normally.       then reveals    CO reviews      production.
AI observes.    AI. Compare.    with AI.        Monitor +
                                                calibrate.

Mức niềm tin:
Thấp ────── Đang xây dựng ────── Tăng dần ────── Được hiệu chỉnh
```

---

## 6. HIỆU CHỈNH LIÊN TỤC SAU KHI LÀM QUEN

### Buổi hiệu chỉnh hàng tháng (30 phút, do quản lý dự án và Data Scientist (DS) điều phối)

```
Agenda:
1. Override outcome review (10 min)
   - Show: "Last month you overrode X cases."
   - Outcome: "Y% of your overrides → good outcome, Z% → bad"
   - Compare: team average, AI-only outcome
   - Non-punitive. Learning opportunity.

2. "AI was wrong" cases (10 min)
   - Show: 3-5 cases where AI was clearly wrong
   - Discuss: what did CO see that AI missed?
   - Feeds into model improvement

3. "AI was right, you were wrong" cases (5 min)
   - Show: 2-3 cases where CO overrode AI and outcome was bad
   - Discuss: what could CO have done differently?
   - Gentle — framed as learning, not blame

4. Questions / feedback (5 min)
   - CO: "I wish AI could show me X"
   - CO: "AI keeps getting Y wrong"
   - → Action items for DS/PM
```

### Đánh giá niềm tin hàng quý

| Câu hỏi khảo sát (ẩn danh) | Thang điểm | Dấu hiệu cần xử lý |
|-----------------------------|-------|---------|
| "AI scoring giúp tôi quyết định tốt hơn" | 1-5 | Trung bình dưới 3: dấu hiệu ngờ vực quá mức |
| "Tôi hiểu tại sao AI đưa ra score này" | 1-5 | Trung bình dưới 3: vấn đề về khả năng giải thích |
| "Tôi cảm thấy thoải mái override AI khi cần" | 1-5 | Trung bình dưới 3: quy định override có thể quá chặt |
| "AI tiết kiệm thời gian cho tôi" | 1-5 | Trung bình dưới 3: quy trình chưa được tối ưu |
| "Tôi lo AI sẽ thay thế công việc của tôi" | 1-5 | Trung bình trên 3: lo ngại về công việc, cần xử lý |

---

## 7. KHUNG THÔNG ĐIỆP KHI TRAO ĐỔI VỚI CO VỀ AI

### Nên nói

| Thông điệp | Lý do |
|---------|-----|
| "AI giúp anh/chị tập trung vào cases quan trọng" | Framing: AI = assistant, not replacement |
| "Anh/chị là người quyết định cuối cùng — luôn luôn" | Khẳng định thẩm quyền của CO; là yêu cầu pháp lý. |
| "Override AI là quyền của anh/chị. Hãy override khi anh/chị có thêm thông tin" | Normalize override. Not rebellion. |
| "AI mạnh ở consistency. Anh/chị mạnh ở judgment. Kết hợp = tốt hơn cả hai" | Complementary, not competitive. |
| "Feedback của anh/chị giúp AI tốt hơn" | CO feels valued. True (feedback loop). |

### Không nên nói

| Thông điệp | Lý do không nên |
|---------|---------|
| ~~"AI chính xác hơn con người"~~ | Creates adversarial dynamic. CO feels threatened. |
| ~~"AI sẽ giúp giảm headcount"~~ | Gây lo ngại về công việc, dẫn tới ngờ vực AI. |
| ~~"Hãy tin AI"~~ | Trust is earned, not commanded. Sounds like propaganda. |
| ~~"Override rate của anh/chị cao nhất team"~~ | Punitive framing. Use 1-on-1, not public. |
| ~~"AI không bao giờ sai"~~ | Untrue. Destroys trust when first error discovered. |

---

## 8. NGUYÊN TẮC TRIỂN KHAI

1. Giai đoạn 2 (Dual Review) là giai đoạn quan trọng nhất của chương trình làm quen: CO hình thành nhận định riêng trước, sau đó so sánh với AI và học được khi nào AI bổ sung giá trị. Bỏ qua giai đoạn này dễ dẫn tới thiên kiến neo, khiến CO tin quá mức hoặc ngờ vực quá mức.
2. Các buổi "AI was wrong" cần thiết để phòng ngừa tin quá mức: nếu CO chỉ thấy thông điệp "AI rất tốt" thì sẽ xác nhận máy móc; việc cho thấy các lỗi của AI giúp hiệu chỉnh niềm tin đúng mức.
3. Thông điệp về công việc của CO cần được truyền đạt chủ động ngay từ giai đoạn 1: "AI xử lý các hồ sơ lô thường quy, CO xử lý các hồ sơ phức tạp; chuyên môn của CO càng có giá trị hơn."
4. Tài liệu liên quan: w09-03-override-governance (quy tắc override và giám sát), w07-02-metric-definitions (L3-W2 tỷ lệ override, thời gian review), w07-04-guardrail-definitions (G-O1 trần override, G-O2 sàn override), w09-02-ux-wireframes-v1 (thiết kế giao diện hỗ trợ niềm tin được hiệu chỉnh).
