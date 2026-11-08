# Implementation Roadmap — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

> Ngân sách, thời gian và nhân sự trong tài liệu là giả định lập kế hoạch, sẽ được điều chỉnh theo dữ liệu thực của Bank X khi có.

## 1. Tổng quan 3 giai đoạn

```
GIAI ĐOẠN 0                GIAI ĐOẠN 1                  GIAI ĐOẠN 2
KHẢO SÁT & CHẠY BÓNG       TRIỂN KHAI GIỚI HẠN          TRIỂN KHAI ĐẦY ĐỦ
8 tuần │ 365M VND          16 tuần │ 1.32 tỷ VND        Liên tục │ 2-4 tỷ/năm

Tuần 1-2 Tuần 3-4 Tuần 5-8 Tuần 9-12 Tuần 13-16 Tuần 17-20 Tuần 21-24 Tuần 25+
┌──────┐┌──────┐┌────────┐┌───────┐┌────────┐┌────────┐┌────────┐┌──────┐
│Đánh  ││Xây   ││Shadow  ││Đào tạo││Triển   ││Giám sát││Kết quả ││Triển │
│giá DL││MVP   ││testing ││& tích ││khai    ││& cải   ││& mở    ││khai  │
│      ││      ││        ││hợp    ││giới hạn││tiến    ││rộng    ││đầy đủ│
└──────┘└──────┘└────────┘└───────┘└────────┘└────────┘└────────┘└──────┘
         │               │                   │                    │
     DEMO NỘI BỘ     CỔNG 0→1            CỔNG 1→2             CỔNG 2→MỞ RỘNG
                     Go/No-Go            Triển khai đầy đủ?   Mở rộng?
```

---

## 2. Giai đoạn 0: Khảo sát dữ liệu và chạy bóng (8 tuần, 365M)

Đây là giai đoạn đề xuất phê duyệt.

| Tuần | Hoạt động | Sản phẩm bàn giao | Rủi ro và cách xử lý |
|------|-----------|-------------------|----------------------|
| 1-2 | Đánh giá chất lượng dữ liệu. Xác nhận khả năng cung cấp dữ liệu từ CBS/CIC/eKYC và lộ trình tích hợp IT. | Báo cáo chất lượng dữ liệu, đánh giá khả năng tích hợp | Nếu CBS chưa có API, áp dụng phương án dự phòng đã được tài liệu hóa |
| 3-4 | Xây MVP với dữ liệu tổng hợp: mô hình logistic regression, giao diện review cơ bản cho CO, audit trail. | Bản demo chạy được: hồ sơ, điểm AI, giải thích, CO review, audit log | Khả thi về kỹ thuật với dữ liệu tổng hợp |
| 5 | Demo nội bộ cho các bên liên quan. Kiểm thử khả năng sử dụng với 3-5 CO. Thu thập phản hồi và cập nhật MVP. | Bản demo, phản hồi của CO, MVP v1.1 | Phản kháng của CO được xử lý qua quản trị thay đổi |
| 6-8 | Shadow testing 4 tuần: AI chạy song song trên hồ sơ thực, điểm AI được ghi nhận và không ảnh hưởng quyết định. CO có thể xem điểm AI. | Báo cáo shadow testing: so sánh AI và thủ công (độ chính xác, tính nhất quán, tốc độ) | Vấn đề chất lượng dữ liệu thực được ghi nhận trong báo cáo |
| 8 | Phân tích Go/No-Go, trình bày kết quả, chuẩn bị đề xuất Giai đoạn 1 nếu Go. | Báo cáo Go/No-Go và kế hoạch Giai đoạn 1 | Nếu kết quả chưa đủ kết luận, kéo dài shadow testing thêm 2-4 tuần |

### Tiêu chí đạt của Giai đoạn 0 (Cổng 0→1)

| Tiêu chí | Ngưỡng | Cách đo |
|----------|--------|---------|
| AI scoring hoạt động | Tạo điểm và giải thích cho ít nhất 95% hồ sơ | Log hệ thống |
| Mức độ thống nhất giữa AI và thủ công | AI đồng ý với quyết định của CO ít nhất 70% | So sánh shadow testing |
| AI phát hiện trường hợp CO bỏ sót | Ít nhất 5 trường hợp AI cảnh báo rủi ro mà CO không phát hiện | Review shadow testing |
| Độ ổn định hệ thống | Uptime ít nhất 99%, độ trễ dưới 30 giây, tỷ lệ lỗi dưới 1% | Monitoring |
| Sự ủng hộ của các bên liên quan | Risk Manager và Head of Cards ủng hộ Giai đoạn 1 | Xác nhận bằng văn bản hoặc lời nói |
| Không có trở ngại tuân thủ | DPIA đang tiến hành, không có vấn đề pháp lý nghiêm trọng | Xác nhận của Compliance |

### Tiêu chí dừng của Giai đoạn 0

| Tiêu chí dừng | Lý do |
|---------------|-------|
| Mức thống nhất giữa AI và CO dưới 50% | Mô hình sai về cơ bản, cần hướng tiếp cận khác |
| Chất lượng dữ liệu CBS/CIC không sử dụng được | Không thể xây mô hình tin cậy, cần cải thiện dữ liệu trước |
| Risk Manager phủ quyết | Mối quan ngại về rủi ro quá lớn, cần giải quyết trước khi tiếp tục |
| CO đồng loạt từ chối | Quản trị thay đổi thất bại, cần thiết kế lại cách tiếp cận |

---

## 3. Giai đoạn 1: Triển khai giới hạn (16 tuần, 1.32 tỷ)

Chỉ thực hiện khi Giai đoạn 0 đạt Cổng 0→1.

| Tuần | Hoạt động | Sản phẩm bàn giao |
|------|-----------|-------------------|
| 9-10 | Đào tạo CO (4 tuần onboarding), khởi động quản trị thay đổi, hoàn thiện DPIA. | CO được đào tạo, DPIA nộp A05 |
| 11-12 | Tích hợp production (CBS, CIC, eKYC), củng cố audit trail, rà soát an ninh. | Hệ thống sẵn sàng production |
| 13-14 | Triển khai giới hạn: AI khuyến nghị trên một tập hồ sơ con (rủi ro thấp, độ tin cậy cao). CO review toàn bộ khuyến nghị của AI. | Triển khai giới hạn đi vào hoạt động, giám sát hằng ngày |
| 15-16 | Giám sát, cải tiến, thu thập bằng chứng, chuẩn bị đề xuất triển khai đầy đủ. | Kết quả triển khai giới hạn, đề xuất Giai đoạn 2 |
| 17-20 | Giám sát mở rộng, tối ưu ngưỡng, cải thiện mô hình. | ROI cập nhật theo số liệu thực |
| 21-24 | Quy trình phê duyệt triển khai đầy đủ, mở rộng phạm vi, ổn định. | Phê duyệt triển khai đầy đủ, báo cáo tác động 30 ngày |

### Tiêu chí đạt của Giai đoạn 1 (Cổng 1→2)

| Tiêu chí | Ngưỡng |
|----------|--------|
| NPL của nhóm hồ sơ do AI khuyến nghị | Không vượt baseline hiện tại (3.5%) |
| Tỷ lệ override | 10-30% (vùng tin cậy được hiệu chỉnh) |
| Mức hài lòng của CO | Ít nhất 3/5 trong khảo sát niềm tin |
| Tuân thủ SLA | Ít nhất 90% |
| Độ ổn định hệ thống (production) | Uptime ít nhất 99.5%, tỷ lệ lỗi dưới 0.5% |
| Không có sự cố tuân thủ | Không có phát hiện của SBV, không có khiếu nại PDPD |

---

## 4. Giai đoạn 2: Triển khai đầy đủ và mở rộng (liên tục, 2-4 tỷ/năm)

| Giai đoạn thời gian | Hoạt động |
|---------------------|-----------|
| Tuần 25-28 | Triển khai đầy đủ cho toàn bộ hồ sơ origination thẻ tín dụng, giám sát đầy đủ. |
| Tuần 29-32 | Ổn định, lập báo cáo tác động 90 ngày, kiểm chứng ROI. |
| Tuần 33 trở đi | Vận hành liên tục: chu kỳ cải thiện mô hình, champion-challenger, giám sát drift. |
| Tuần 37 trở đi | Đánh giá mở rộng: thẻ cho khách hàng tự doanh, vay tiêu dùng, hệ thống cảnh báo sớm. |

---

## 5. Kế hoạch nguồn lực

### Giai đoạn 0 (8 tuần)

| Vai trò | Nguồn | Mức phân bổ | Chi phí |
|---------|-------|-------------|---------|
| Quản lý dự án | Nội bộ (hiện hữu) | 50% | 72M (phân bổ nội bộ) |
| Senior Data Scientist | Thuê hợp đồng | 100% | 160M |
| Hỗ trợ tích hợp IT | Nội bộ | 20% | 45M |
| Hạ tầng | Cloud và công cụ | Không áp dụng | 48M |
| Dự phòng | | | 40M |
| **Tổng** | | 2.8 FTE-eq | 365M |

### Giai đoạn 1 (16 tuần)

| Vai trò | Nguồn | Mức phân bổ | Chi phí |
|---------|-------|-------------|---------|
| Quản lý dự án | Nội bộ | 80% | 230M |
| Senior Data Scientist | Gia hạn hợp đồng, có thể chuyển nhân sự chính thức | 100% | 320M |
| ML Engineer | Tuyển mới | 100% | 260M |
| Frontend Developer | Nội bộ hoặc hợp đồng | 50% | 130M |
| Tích hợp IT | Nội bộ | 40% | 180M |
| Hạ tầng | Cloud production | Không áp dụng | 120M |
| Đào tạo và quản trị thay đổi | Nội bộ | | 80M |
| **Tổng** | | Khoảng 5 FTE-eq | 1.32 tỷ |

### Vị trí tuyển dụng then chốt: Senior Data Scientist

- Vị trí cần thiết để bắt đầu Giai đoạn 0.
- Thời gian tuyển dụng 4-8 tuần, bắt đầu ngay khi Giai đoạn 0 được phê duyệt.
- Hồ sơ: ít nhất 3 năm kinh nghiệm credit scoring hoặc ML trong ngân hàng; Python, scikit-learn, XGBoost; ưu tiên có kinh nghiệm với dữ liệu tài chính Việt Nam.
- Hình thức hợp đồng 8 tuần giúp giảm cam kết, gia hạn nếu Giai đoạn 0 đạt.

---

## 6. Các mốc chính

```
Số tuần sau phê duyệt:

 0     2     4     5     8     12    16    20    24    28    32
 │     │     │     │     │     │     │     │     │     │     │
 ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼
Bắt đầu Dữ liệu MVP  Demo  Cổng  Đào tạo Triển khai     Triển khai Báo cáo
       xong    v1   nội bộ 0→1   xong   giới hạn       đầy đủ    90 ngày
                                 DPIA        Cổng
                                 nộp         1→2
```

| Mốc | Tuần | Ý nghĩa |
|-----|------|---------|
| Bắt đầu Giai đoạn 0 | 0 | Giải ngân ngân sách, bắt đầu tuyển dụng |
| Hoàn tất đánh giá dữ liệu | 2 | Xác định chất lượng dữ liệu và tính khả thi của mô hình |
| Demo MVP | 5 | Các bên liên quan nội bộ xem hệ thống chạy thực |
| Cổng 0→1 | 8 | Go/No-Go cho Giai đoạn 1. Thiệt hại tối đa 365M. |
| Nộp DPIA | 12 | Điều kiện tuân thủ để sử dụng dữ liệu thực |
| Triển khai giới hạn đi vào hoạt động | 16 | Khuyến nghị AI đầu tiên trên hồ sơ thực |
| Cổng 1→2 | 24 | Go/No-Go cho triển khai đầy đủ |
| Triển khai đầy đủ | 25 | AI-CRDS vận hành trên toàn bộ origination thẻ tín dụng |
| Báo cáo tác động 90 ngày | 37 | Kiểm chứng ROI thực tế và quyết định mở rộng |

---

## 7. Phụ thuộc và đường găng

| Phụ thuộc | Ảnh hưởng đến | Thời gian chuẩn bị | Đầu mối | Biện pháp nếu chậm |
|-----------|---------------|--------------------|---------|--------------------|
| Tuyển Senior DS | Xây MVP, phát triển mô hình | 4-8 tuần | HR và quản lý dự án | Bắt đầu tuyển dụng trước khi phê duyệt Giai đoạn 0, ưu tiên hợp đồng ngắn hạn |
| Xác nhận API CBS | Tích hợp production | Đánh giá IT (tuần 1-2) | IT | Nếu chưa có API, dùng mẫu adapter; Giai đoạn 1 kéo dài 4-8 tuần, Giai đoạn 0 không bị ảnh hưởng (dữ liệu tổng hợp) |
| Xác nhận CIC H2H | Chấm điểm thời gian thực | Đánh giá IT (tuần 1-2) | IT | Nếu chưa có H2H, tra CIC thủ công; độ chính xác mô hình giảm |
| Hoàn tất DPIA | Sử dụng dữ liệu thực (Giai đoạn 1) | 8-12 tuần (soạn thảo, pháp chế, nộp A05) | Compliance và Pháp chế | Bắt đầu DPIA từ tuần 1 của Giai đoạn 0, chạy song song |
| Risk Committee phê duyệt ngưỡng | Triển khai giới hạn | 1-2 kỳ họp | Risk Manager | Thống nhất sớm trong Giai đoạn 0, trình khung ngưỡng từ đầu |
