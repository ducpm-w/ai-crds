# Risks & Mitigation — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## Mục đích

Tài liệu trình bày 7 rủi ro chính của dự án. Mỗi rủi ro gồm mô tả, khả năng xảy ra, mức độ tác động, biện pháp giảm thiểu và rủi ro còn lại. Tỷ lệ khả năng xảy ra là ước tính lập kế hoạch, sẽ được hiệu chỉnh theo dữ liệu thực của Bank X khi có.

---

## 1. Ma trận rủi ro

```
                    TÁC ĐỘNG
                    Thấp        Trung bình    Cao        Rất cao
              ┌──────────┬──────────────┬──────────┬────────────┐
  KHẢ NĂNG    │          │              │          │            │
              │          │              │          │            │
  Cao         │          │              │   R2     │            │
              │          │              │   CO     │            │
              │          │              │  chấp    │            │
              │          │              │  nhận    │            │
              ├──────────┼──────────────┼──────────┼────────────┤
  Trung bình  │          │   R4         │   R1     │   R3       │
              │          │  Tích hợp    │  Hiệu    │  Tuân thủ  │
              │          │              │  năng AI │            │
              ├──────────┼──────────────┼──────────┼────────────┤
  Thấp        │   R6     │   R7         │   R5     │            │
              │  Phụ     │   Lộ dữ liệu │  NPL     │            │
              │  thuộc   │              │  tăng    │            │
              │  vendor  │              │          │            │
              └──────────┴──────────────┴──────────┴────────────┘
```

---

## 2. Chi tiết từng rủi ro

### Rủi ro 1: Hiệu năng AI chưa đạt kỳ vọng

| Thuộc tính | Nội dung |
|------------|----------|
| Mô tả | Độ chính xác của AI scoring thấp hơn kỳ vọng, mô hình không vượt trội so với review thủ công của CO, ROI không đạt. |
| Khả năng | Trung bình (30%) |
| Tác động | Cao: đầu tư không mang lại giá trị, uy tín dự án bị ảnh hưởng |
| Nguyên nhân | Chất lượng dữ liệu kém, bộ đặc trưng thiếu sức dự báo, kiến trúc mô hình chưa phù hợp, dữ liệu CIC cũ |

Biện pháp giảm thiểu:

| # | Hành động | Thời điểm | Hiệu quả |
|---|-----------|-----------|----------|
| 1 | Shadow testing 4 tuần trước khi cam kết Giai đoạn 1 | Giai đoạn 0, tuần 5-8 | Kiểm chứng AI so với thủ công bằng dữ liệu thực |
| 2 | Điểm dừng tại Cổng 0→1 | Giai đoạn 0, tuần 8 | Nếu mức thống nhất giữa AI và CO dưới 50% thì dừng; chi phí đã chi tối đa 365M |
| 3 | Bắt đầu bằng mô hình đơn giản (logistic regression) | Giai đoạn 0 | Dễ giải thích; nếu mô hình đơn giản hiệu quả thì mô hình phức tạp sẽ tốt hơn |
| 4 | Cải tiến mô hình theo phiên bản v1, v2, v3 trong shadow testing | Giai đoạn 0-1 | Cải thiện liên tục thay vì triển khai một lần |

Rủi ro còn lại: thấp. Cách làm theo giai đoạn giới hạn thiệt hại ở 365M và shadow testing cung cấp bằng chứng trước khi cam kết thêm.

---

### Rủi ro 2: Credit Officer chưa chấp nhận hệ thống

| Thuộc tính | Nội dung |
|------------|----------|
| Mô tả | CO bỏ qua khuyến nghị của AI (override trên 50%), né tránh hệ thống hoặc duyệt hình thức không review thực chất, làm lợi ích vận hành không đạt. |
| Khả năng | Trung bình-cao (40%): kháng cự thay đổi là tự nhiên |
| Tác động | Cao: đầu tư AI không có giá trị vận hành nếu CO không dùng |
| Nguyên nhân | Lo ngại mất việc, thiếu tin tưởng AI, trải nghiệm sử dụng kém, thay đổi áp đặt không có sự tham gia |

Biện pháp giảm thiểu:

| # | Hành động | Thời điểm | Hiệu quả |
|---|-----------|-----------|----------|
| 1 | Phỏng vấn CO trước khi thiết kế | Trước thiết kế | Thiết kế dựa trên nhu cầu thực, không dựa trên giả định |
| 2 | Chuỗi onboarding 4 tuần | Trước triển khai giới hạn | Shadow, Dual, AI-First, Standard: xây dựng niềm tin dần dần |
| 3 | Thông điệp "AI hỗ trợ, không thay thế" | Trước và trong triển khai | Giải quyết chủ động lo ngại về việc làm; CO ký mọi quyết định nên vẫn giữ thẩm quyền |
| 4 | CO luôn có quyền override | Nguyên tắc thiết kế | CO có thể override mọi khuyến nghị, không phát sinh thủ tục phụ; override là thực hiện phán đoán chuyên môn |
| 5 | Buổi hiệu chỉnh hằng tháng | Sau triển khai | Cho CO thấy AI đúng và sai ở đâu, xây dựng niềm tin được hiệu chỉnh |
| 6 | Chuyển năng lực được giải phóng sang công việc giá trị cao | HR và quản lý | CO được chuyển sang thẩm định phức tạp, thu hồi nợ, quan hệ khách hàng, không cắt giảm |

Rủi ro còn lại: trung bình. Quản trị thay đổi cần thời gian, dự kiến 3-6 tháng để chấp nhận hoàn toàn. Tỷ lệ override là chỉ báo sớm cần theo dõi.

---

### Rủi ro 3: Không tuân thủ quy định

| Thuộc tính | Nội dung |
|------------|----------|
| Mô tả | Vi phạm Luật AI 134/2025, Luật BVDLCN 91/2025 hoặc yêu cầu của SBV, dẫn đến xử phạt, tổn hại uy tín, buộc ngừng hệ thống. |
| Khả năng | Thấp (15%): AI-CRDS được thiết kế theo quy định Việt Nam ngay từ đầu |
| Tác động | Rất cao: xử lý của cơ quan quản lý, uy tín, khả năng buộc ngừng hệ thống |
| Nguyên nhân | Luật AI 134/2025 mới (hiệu lực 01/03/2026), nghị định hướng dẫn đang hoàn thiện nên có thể có khác biệt trong cách diễn giải |

Biện pháp giảm thiểu:

| # | Hành động | Thời điểm | Hiệu quả |
|---|-----------|-----------|----------|
| 1 | Con người tham gia quyết định bắt buộc | Nguyên tắc thiết kế | CO ký mọi quyết định, AI chỉ hỗ trợ, không thỏa hiệp |
| 2 | Gắn nhãn AI | Mọi kết quả có AI tham gia | "Quyết định được hỗ trợ bởi AI" theo Luật AI 134/2025 |
| 3 | DPIA | Soạn thảo ở Giai đoạn 0, nộp A05 trước khi dùng dữ liệu thực ở Giai đoạn 1 | Tuân thủ NĐ 356/2025 Đ.19 |
| 4 | Cơ chế từ chối AI | Thiết kế mẫu đồng ý | Khách hàng có thể chọn xử lý hoàn toàn thủ công (NĐ 356 Đ.9) |
| 5 | Audit trail 24 trường, bất biến | Thiết kế cốt lõi | Sẵn sàng thanh tra SBV trong dưới 15 phút |
| 6 | Giám sát thiên lệch | Liên tục (giới tính, địa lý, độ tuổi) | Luật AI Đ.4: không phân biệt đối xử; chủ động thay vì bị động |
| 7 | Compliance Officer tham gia từ tuần 2 | Liên tục | Tham gia sớm để trở thành đồng minh |

Rủi ro còn lại: thấp. AI-CRDS tuân thủ tốt hơn quy trình thủ công hiện tại (chưa có audit trail, giải thích hay giám sát thiên lệch).

---

### Rủi ro 4: Tích hợp CBS/CIC phức tạp hơn dự kiến

| Thuộc tính | Nội dung |
|------------|----------|
| Mô tả | CBS không có API, định dạng CIC H2H khó phân tích, thay đổi nhà cung cấp eKYC. Tiến độ tích hợp kéo dài gấp 2-3 lần. |
| Khả năng | Trung bình (35%): thường gặp trong ngân hàng Việt Nam |
| Tác động | Trung bình: làm chậm Giai đoạn 1 nhưng không làm dừng dự án |
| Nguyên nhân | CBS cũ (phiên bản T24/Flexcube khác nhau), giao thức CIC thay đổi, hạn chế nguồn lực IT |

Biện pháp giảm thiểu:

| # | Hành động | Thời điểm | Hiệu quả |
|---|-----------|-----------|----------|
| 1 | Giai đoạn 0 dùng dữ liệu tổng hợp | Giai đoạn 0 | Không phụ thuộc tích hợp; MVP chạy không cần API của Bank X |
| 2 | Đánh giá IT ở tuần 1-2 | Đầu Giai đoạn 0 | Nắm rõ thực tế tích hợp trước khi cam kết ngân sách Giai đoạn 1 |
| 3 | Kiến trúc mẫu adapter | Nguyên tắc thiết kế | AI-CRDS qua Adapter tới CBS; thay adapter khi phương thức CBS đổi, không viết lại lõi |
| 4 | Ngân sách Giai đoạn 1 bao gồm tích hợp IT | Ngân sách Giai đoạn 1 | 180M cho hỗ trợ tích hợp IT (40% IT FTE, 16 tuần) |
| 5 | Dự phòng: batch/DWH nếu không có API | Phương án kiến trúc dự phòng | Kém lý tưởng hơn (dữ liệu chậm) nhưng vẫn hoạt động; tiến độ kéo dài 4-8 tuần |

Rủi ro còn lại: thấp đến trung bình. Trường hợp xấu nhất là Giai đoạn 1 chậm 4-8 tuần, Giai đoạn 0 không bị ảnh hưởng.

---

### Rủi ro 5: NPL tăng sau triển khai

| Thuộc tính | Nội dung |
|------------|----------|
| Mô tả | AI scoring dẫn đến phê duyệt nhầm nhiều hồ sơ xấu hơn, NPL vượt baseline, gây tổn thất tài chính và sự chú ý của cơ quan quản lý. |
| Khả năng | Thấp (15%) |
| Tác động | Cao: tổn thất tài chính, SBV giám sát, uy tín |
| Nguyên nhân | Ngưỡng quá thấp (nới tín dụng), drift của mô hình, người nộp đơn lách hệ thống, CO duyệt hình thức |

Biện pháp giảm thiểu:

| # | Hành động | Thời điểm | Hiệu quả |
|---|-----------|-----------|----------|
| 1 | Ngưỡng do Risk Committee phê duyệt | Trước triển khai | Quản lý dự án đề xuất, Hội đồng quyết định |
| 2 | Guardrail: NPL tăng 200bps thì dừng khẩn cấp | Liên tục | Tự động tạm dừng nhóm duyệt tự động, mọi hồ sơ chuyển review thủ công đầy đủ |
| 3 | Shadow testing 4 tuần trước khi AI ảnh hưởng quyết định | Giai đoạn 0 | Kiểm chứng độ chính xác trên dữ liệu thực, không có rủi ro trong giai đoạn chạy bóng |
| 4 | Triển khai giới hạn (một tập hồ sơ con) trước khi triển khai đầy đủ | Giai đoạn 1 | Bắt đầu với hồ sơ rủi ro thấp, độ tin cậy cao, mở rộng dần |
| 5 | Cảnh báo sớm DPD 30+ | Giám sát hằng tháng (Giai đoạn 1 trở đi) | Phát hiện xu hướng NPL trước DPD 90 khoảng 60 ngày để phản ứng sớm |
| 6 | Champion-Challenger | Giai đoạn 2 trở đi | Mô hình mới chạy song song và phải vượt mô hình hiện hành trước khi triển khai |

Rủi ro còn lại: thấp. Có nhiều lớp bảo vệ; trường hợp xấu nhất là quay về quy trình thủ công (như hiện trạng, không tệ hơn).

---

### Rủi ro 6: Phụ thuộc vendor (nếu chuyển sang mua vendor)

| Thuộc tính | Nội dung |
|------------|----------|
| Mô tả | Đề xuất AI-CRDS là xây dựng nội bộ. Rủi ro phụ thuộc vendor chỉ phát sinh nếu sau này chuyển sang phương án mua. |
| Khả năng | Thấp (10%): xây dựng nội bộ không có phụ thuộc vendor |
| Tác động | Thấp: Bank X sở hữu 100% IP |
| Nguyên nhân | Không áp dụng cho phương án xây dựng nội bộ |

Biện pháp giảm thiểu: xây dựng nội bộ, Bank X sở hữu mã nguồn, mô hình, dữ liệu và kiến trúc, có thể thay đổi hướng tiếp cận bất cứ lúc nào.

Rủi ro còn lại: gần như bằng không.

---

### Rủi ro 7: Lộ dữ liệu và sự cố an ninh

| Thuộc tính | Nội dung |
|------------|----------|
| Mô tả | Hệ thống AI-CRDS bị xâm nhập, lộ thông tin cá nhân khách hàng, dẫn đến xử phạt, tổn hại uy tín và mất niềm tin khách hàng. |
| Khả năng | Thấp (10%) khi có kiểm soát an ninh phù hợp |
| Tác động | Rất cao: pháp lý, uy tín, tài chính |
| Nguyên nhân | Kiểm soát an ninh chưa đủ, rủi ro nội bộ, tấn công từ bên ngoài |

Biện pháp giảm thiểu:

| # | Hành động | Thời điểm | Hiệu quả |
|---|-----------|-----------|----------|
| 1 | Tuân thủ chính sách an ninh của Bank X | Giai đoạn thiết kế | SSO, MFA, RBAC, mã hóa khi lưu trữ và truyền tải |
| 2 | Tối thiểu hóa PII | Nguyên tắc thiết kế | Chỉ lưu PII cần thiết, không lưu sinh trắc học gốc, audit trail được giả danh hóa |
| 3 | Kiểm thử xâm nhập | Trước production (Giai đoạn 1) | Pentest độc lập và khắc phục các phát hiện nghiêm trọng |
| 4 | Quy trình thông báo sự cố | Hoàn thiện ở Giai đoạn 0 | Thông báo trong 72 giờ theo NĐ 356, quy trình sẵn sàng trước go-live |
| 5 | Môi trường dev/staging chỉ dùng dữ liệu tổng hợp | Bắt buộc | Không có PII thực ngoài môi trường production |

Rủi ro còn lại: thấp. AI-CRDS thêm bề mặt tấn công mới nhưng được kiểm soát phù hợp. Quy trình thủ công hiện tại cũng có rủi ro lộ dữ liệu (hồ sơ giấy, truy cập CBS không mã hóa).

---

## 3. Tổng hợp giảm thiểu rủi ro

| Rủi ro | Trước giảm thiểu | Sau giảm thiểu | Kiểm soát chính |
|--------|------------------|----------------|-----------------|
| R1: Hiệu năng AI | Trung bình × Cao | Thấp × Trung bình | Shadow testing và điểm dừng |
| R2: CO chấp nhận | Trung bình × Cao | Trung bình × Trung bình | Onboarding 4 tuần và quyền override |
| R3: Tuân thủ | Thấp × Rất cao | Thấp × Trung bình | Thiết kế tuân thủ từ đầu |
| R4: Tích hợp | Trung bình × Trung bình | Thấp × Thấp | Dữ liệu tổng hợp ở Giai đoạn 0 và mẫu adapter |
| R5: NPL tăng | Thấp × Cao | Thấp × Trung bình | Ngưỡng do Risk Committee phê duyệt và guardrail |
| R6: Phụ thuộc vendor | Thấp × Thấp | Gần bằng không | Xây dựng nội bộ |
| R7: Lộ dữ liệu | Thấp × Rất cao | Thấp × Trung bình | Chính sách an ninh Bank X, pentest, tối thiểu hóa PII |

---

## 4. Trường hợp dự án không đạt kết quả

Phạm vi thiệt hại tối đa theo từng giai đoạn:

- **Dừng tại Cổng 0 (Giai đoạn 0, 8 tuần, 365M):** 365M tương đương khoảng 1.5 ngày thiệt hại hiện tại (95.65 tỷ ÷ 365 ≈ 262M/ngày). Bank X vẫn nhận được: đánh giá chất lượng dữ liệu (dùng được cho các dự án khác), đánh giá tính khả thi của AI, hiểu biết về quy trình làm việc của CO (cải thiện quy trình thủ công), tiến độ chuẩn bị tuân thủ (DPIA, đánh giá Luật AI).
- **Dừng tại Cổng 1 (Giai đoạn 1):** chi phí đã chi 1.68 tỷ, tương đương khoảng 6.5 ngày thiệt hại hiện tại. Bank X vẫn có: toàn bộ sản phẩm Giai đoạn 0, dữ liệu shadow testing thực (bằng chứng hiệu năng mô hình), CO đã được đào tạo, khung tuân thủ đầy đủ có thể tái sử dụng.
- **Triển khai đầy đủ không đạt:** quay về quy trình thủ công (hiện trạng), không tệ hơn hiện nay. Hệ thống có thể tạm dừng ngay lập tức nhờ điểm dừng khẩn cấp.
