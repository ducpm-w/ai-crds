# Override Governance — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Quy định quyền override, quy tắc chuyển cấp, cơ chế giám sát và vòng phản hồi cải thiện mô hình khi Credit Officer (CO) của Bank X thay đổi đề xuất của AI-CRDS.

Các ngưỡng, thời hạn xử lý và tỷ lệ trong tài liệu là giả định thiết kế ban đầu; sẽ được hiệu chỉnh bằng dữ liệu vận hành thực tế của Bank X.

---

## 1. QUYỀN OVERRIDE

### 1.1 Chính sách cốt lõi

Mọi CO đều có quyền override đề xuất của AI. AI là công cụ hỗ trợ quyết định, không phải người ra quyết định (Luật AI 134/2025 Điều 4, Luật TCTD 2024). Override là việc CO vận dụng phán đoán chuyên môn.

Mọi override phải được ghi nhận: nhóm lý do (chọn từ danh sách) và chi tiết (nhập tự do, tối thiểu 20 ký tự) là bắt buộc, không có ngoại lệ.

### 1.2 Ma trận thẩm quyền override

| Loại override | Người thực hiện | Cần Supervisor phê duyệt? | Điều kiện |
|--------------|----------------|--------------------------|----------|
| Xác nhận AI đề xuất duyệt (S1 batch) | Mọi CO | Không | Là đồng thuận, không phải override |
| Từ chối khi AI đề xuất duyệt | Mọi CO | Thông báo Supervisor (không chặn) | Ghi lý do; Supervisor xem xét trong 24 giờ |
| Duyệt khi AI đề xuất review (S2) | Mọi CO | Không | Kết quả bình thường sau khi CO xem xét, trong hạn mức thẩm quyền |
| Từ chối khi AI đề xuất review (S2) | Mọi CO | Không | Kết quả review bình thường |
| Duyệt khi AI đề xuất từ chối | Mọi CO trong thẩm quyền | Có, Supervisor đồng ký | Override rủi ro cao; Supervisor xem xét và đồng ký trong 4 giờ |
| Duyệt vượt hạn mức thẩm quyền của CO | Senior CO hoặc Hội đồng | Có, theo phân cấp chuẩn của Bank X | Theo chính sách hiện hành của Bank X, không riêng cho AI |
| Duyệt khi fraud flag lớn hơn 0.3 (chưa được xử lý) | Không cho phép với CO thông thường | Bộ phận fraud phải xử lý trước | Fraud flag phải được xử lý xong trước khi quyết định tín dụng; chuyển về State 3 trước |
| Xử lý (clear) fraud flag | Chỉ Fraud Analyst hoặc Senior CO đã được đào tạo về fraud | Không (thuộc thẩm quyền fraud) | Ghi nhận hoàn tất danh mục EDD |

### 1.3 Nhóm lý do override

| Mã | Nhóm | Khi nào dùng | Ví dụ |
|----|------|-------------|-------|
| `REL` | Relationship knowledge | CO biết trực tiếp khách hàng và có thông tin AI không có | "Khách hàng VIP 5 năm, thu nhập xác minh qua payroll, tình huống chỉ mang tính tạm thời" |
| `INC` | Income verification | CO đã xác minh thu nhập bằng cách khác | "Sao kê ngân hàng xác nhận thu nhập 25M/tháng, cao hơn khai báo 18M" |
| `EMP` | Employer verification | CO đã xác minh độ tin cậy và ổn định của nơi làm việc | "Nơi làm việc là cơ quan nhà nước, ổn định dù có nhiều truy vấn CIC" |
| `TMP` | Temporary situation | DPD hoặc nợ xấu do sự kiện tạm thời và khách hàng đã phục hồi | "DPD 30 do nằm viện cách đây 6 tháng, đã phục hồi và thanh toán đúng hạn từ đó" |
| `ERR` | AI error suspected | CO cho rằng kết quả AI không đúng (lỗi dữ liệu, lỗi mô hình) | "Điểm AI 0.45 nhưng mọi chỉ số đều tích cực, có thể do lỗi nhập dữ liệu" |
| `POL` | Policy concern | Hồ sơ nằm ngoài chính sách chuẩn, cần phán đoán | "Đề nghị hạn mức 80M với thu nhập 15M: DTI cao nhưng nơi làm việc là doanh nghiệp FDI có thưởng" |
| `OTH` | Other | Không thuộc các nhóm trên | Bắt buộc nhập chi tiết, tối thiểu 50 ký tự |

---

## 2. CHUYỂN CẤP LÊN SUPERVISOR

### 2.1 Trường hợp cần Supervisor phê duyệt

| Điều kiện | Hành động của Supervisor | SLA | Lý do |
|----------|-------------------------|-----|-------|
| CO override sang duyệt khi AI đề xuất từ chối | Đồng ký phê duyệt | 4 giờ | Rủi ro cao: AI từ chối nhưng CO duyệt, cần ý kiến thứ hai |
| CO duyệt với hạn mức trên 50% thẩm quyền của CO | Đồng ký | 4 giờ | Mức phơi nhiễm lớn; theo chính sách hiện hành của Bank X |
| CO duyệt khi fraud score từ 0.2 đến 0.3 (chưa ở mức cao nhưng khác 0) | Xem xét và đồng ký | 4 giờ | Tín hiệu fraud ở vùng biên; áp dụng cách tiếp cận thận trọng |
| Tỷ lệ override của CO lớn hơn 2 lần mức trung bình của nhóm, kéo dài 2 tuần | Xem xét hiệu quả làm việc của CO | 1 tuần | Có thể do khoảng trống đào tạo hoặc CO có thêm thông tin hợp lệ |

### 2.2 Quy trình Supervisor xem xét override

```
CO gửi override (duyệt khi AI đề xuất từ chối)
    │
    ├── Hệ thống tự động thông báo Supervisor (push + email)
    │   Nội dung: tóm tắt hồ sơ, đề xuất của AI,
    │   lý do override của CO, hồ sơ khách hàng
    │
    ├── Supervisor xem xét trong 4 giờ:
    │   ├── [Chấp thuận override] → Quyết định cuối cùng. Ghi nhận đồng ký.
    │   ├── [Bác bỏ override] → Quay lại đề xuất của AI.
    │   │   CO được thông báo. Hồ sơ được chuyển cho CO khác hoặc Senior CO.
    │   └── [Chuyển cấp] → Lên Hội đồng. Dành cho hồ sơ phức tạp.
    │
    └── Nếu Supervisor không xử lý trong 4 giờ:
        → Tự động chuyển lên cấp cao hơn.
        → Ghi nhận vi phạm SLA.
```

---

## 3. GIÁM SÁT OVERRIDE

### 3.1 Chỉ số theo dõi

| Chỉ số | Mức chi tiết | Tần suất | Ngưỡng cảnh báo |
|--------|-------------|----------|----------------|
| Tỷ lệ override tổng thể | Cấp nhóm | Hàng tuần | Trên 30%: rà soát; trên 60%: kích hoạt guardrail G-O1 |
| Tỷ lệ override theo từng CO | Từng CO | Hàng tháng | Trên 2 lần mức trung bình của nhóm: Supervisor xem xét |
| Hướng override | Override sang duyệt so với sang từ chối | Hàng tháng | Trên 80% theo một hướng: rà soát |
| NPL của nhóm override sang duyệt | Nhóm hồ sơ được override duyệt | Hàng quý (độ trễ 90 ngày) | NPL của nhóm override lớn hơn 2 lần NPL của nhóm AI đề xuất duyệt: cần đào tạo CO |
| Phân bố nhóm lý do | Theo nhóm lý do | Hàng tháng | Trên 50% là "Other": nhóm lý do chưa đủ, bổ sung nhóm mới |
| Override và vỡ nợ | CO override đề xuất từ chối của AI và khách hàng vỡ nợ | Hàng quý | Theo dõi từng CO; override sai có hệ thống thì đào tạo và có thể giảm thẩm quyền |

### 3.2 Dashboard override (góc nhìn Supervisor)

Số liệu trong dashboard dưới đây là dữ liệu minh họa.

```
┌─────────────────────────────────────────────────────────┐
│ OVERRIDE MONITORING — Tháng 04/2026                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Tỷ lệ override của nhóm: 16% (mục tiêu: 10-20%)  Ổn định │
│                                                         │
│ Theo hướng:                                             │
│ Override sang duyệt:    62% ████████████░░░░░░          │
│ Override sang từ chối:  38% ████████░░░░░░░░░░          │
│                                                         │
│ Theo CO:                                                │
│ CO-001 (Nguyễn A): 12% ████░░░░░░  Bình thường          │
│ CO-002 (Trần B):   18% ██████░░░░  Bình thường          │
│ CO-003 (Lê C):     35% ████████████ CAO                 │
│ CO-004 (Phạm D):    4% ██░░░░░░░░  THẤP (nguy cơ xác nhận máy móc)│
│                                                         │
│ Kết quả override (90 ngày gần nhất):                    │
│ Override sang duyệt → vỡ nợ: 8% (AI đề xuất duyệt: 3%) │
│ Override của CO đang kém hơn AI                         │
│                                                         │
│ Lý do override hàng đầu:                                │
│ 1. Relationship knowledge (35%)                         │
│ 2. Income verification (25%)                            │
│ 3. Temporary situation (20%)                            │
│ 4. AI error suspected (12%)                             │
│ 5. Other (8%)                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 4. VÒNG PHẢN HỒI: OVERRIDE ĐẾN CẢI THIỆN MÔ HÌNH

### 4.1 Override là tín hiệu huấn luyện

```
Dữ liệu override được thu thập
    │
    ├── Ngắn hạn (hàng tuần):
    │   Quản lý dự án và Data Scientist (DS) xem xét mẫu override:
    │   - CO bất đồng với mô hình nhiều nhất ở đặc trưng nào?
    │   - Có override lặp lại theo hệ thống không (cùng một loại)?
    │   - CO có sử dụng dữ liệu mới mà mô hình chưa có không?
    │
    ├── Trung hạn (hàng tháng):
    │   DS phân tích:
    │   - Nhóm override sang duyệt: bao nhiêu phần trăm vỡ nợ?
    │   - Nếu override của CO hiệu quả HƠN → mô hình đang thiếu thông tin
    │     → xem xét bổ sung đặc trưng hoặc điều chỉnh ngưỡng
    │   - Nếu override của CO kém hơn → vấn đề đào tạo CO
    │     → phản hồi cho CO
    │
    └── Dài hạn (hàng quý):
        Chu kỳ huấn luyện lại mô hình:
        - Dữ liệu override đưa vào tập huấn luyện lại
        - Lý do override gợi ý các đặc trưng mới
        - Override có hệ thống là tín hiệu để hiệu chỉnh lại ngưỡng
        - Báo cáo Risk Committee: "Phân tích override Q2 2026"
```

### 4.2 Hành động phản hồi theo mẫu override

| Mẫu override | Tín hiệu | Hành động |
|-------------|---------|----------|
| Nhiều override về "loại nơi làm việc" | Mô hình đánh giá thấp mức ổn định của nơi làm việc | DS xem xét bổ sung tuổi doanh nghiệp hoặc doanh thu làm đặc trưng |
| Nhiều override về "DPD tạm thời" | Mô hình phạt quá nặng DPD trong quá khứ với trường hợp đã phục hồi | DS bổ sung đặc trưng "mức gần đây của DPD" (DPD gần so với DPD cũ) |
| Nhiều override "AI error suspected" | Kết quả mô hình không nhất quán với dữ liệu đầu vào | DS kiểm tra từng hồ sơ; có thể do lỗi pipeline dữ liệu |
| Override của CO liên tục hiệu quả hơn AI | CO có thông tin mà AI không có | Quản lý dự án trao đổi với CO về thông tin đó và khả năng đưa thành đặc trưng |
| Override của CO liên tục kém hơn AI | Phán đoán của CO bị lệch hoặc lỗi thời | Đào tạo: cung cấp dữ liệu kết quả cho CO để hiệu chỉnh niềm tin |

---

## 5. QUY TẮC CHỐNG LẠM DỤNG

| Rủi ro | Cách phát hiện | Biện pháp phòng ngừa |
|--------|---------------|---------------------|
| CO luôn override sang duyệt để tăng số hồ sơ duyệt | Tỷ lệ override sang duyệt của từng CO trên 80% | Theo dõi hướng override theo từng CO; cảnh báo khi trên 80% theo một hướng |
| CO không bao giờ override (xác nhận máy móc theo AI) | Tỷ lệ override dưới 3% và thời gian review dưới 2 phút | Kiểm tra ngẫu nhiên; kiểm tra co_review_time_seconds; cảnh báo xác nhận máy móc (w07-02-metric-definitions, L3-W2) |
| CO chỉ override cho người quen hoặc khách VIP | Override sang duyệt tập trung ở một nhóm khách hàng hoặc quan hệ nhất định | Theo dõi tỷ lệ override theo loại khách hàng; cảnh báo nếu tỷ lệ cho nhóm VIP hoặc quan hệ lớn hơn 3 lần các nhóm khác |
| CO và Supervisor thông đồng khi override | Cả hai luôn đồng ký mà không xem xét thực chất | Hàng quý, Internal Audit kiểm tra ngẫu nhiên các override có Supervisor đồng ký |

---

## 6. NGUYÊN TẮC TRIỂN KHAI

1. Override là quyền của CO, không phải vi phạm. Trong đào tạo, override được trình bày là việc CO bổ sung giá trị chuyên môn.
2. Override sang duyệt khi AI đề xuất từ chối có rủi ro cao nhất nên cần Supervisor đồng ký; chấp nhận việc một số hồ sơ chậm tối đa 4 giờ để kiểm soát rủi ro.
3. Theo dõi override theo từng CO là dữ liệu hỗ trợ cải thiện hiệu quả công việc, không nhằm xử phạt; CO được xem kết quả override của chính mình (cả tốt và chưa tốt) như công cụ học tập.
4. Tài liệu liên quan: w05-01-decision-architecture (phần override), w07-02-metric-definitions (L3-W2 tỷ lệ override), w07-04-guardrail-definitions (G-O1, G-O2), w09-05-trust-calibration-guide (vùng niềm tin được hiệu chỉnh), w05-03-escalation-tree-v1 (điều kiện chuyển cấp L1 sang L2).
