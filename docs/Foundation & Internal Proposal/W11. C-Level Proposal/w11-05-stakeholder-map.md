# Stakeholder Map — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## 1. Ma trận các bên liên quan

| Bên liên quan | Vai trò trong dự án | Mức ảnh hưởng | Mối quan tâm chính | Mối quan tâm thứ hai | Thông điệp chính |
|---------------|---------------------|---------------|--------------------|----------------------|------------------|
| CEO | Phê duyệt cuối cùng | Quyết định | ROI: có đáng đầu tư không | Rủi ro nếu AI sai | Giai đoạn 0 chi 365M trong 8 tuần, rủi ro rất thấp. Triển khai đầy đủ tiết kiệm khoảng 26 tỷ/năm. Có điểm dừng tại mỗi cổng. |
| CFO | Phê duyệt ngân sách | Quyết định | Cơ sở của ngân sách | Thời gian hòa vốn | Hòa vốn tháng 11, NPV +33.56 tỷ. Giải ngân theo giai đoạn: 365M trước, 1.32 tỷ sau và chỉ khi Giai đoạn 0 đạt. |
| Head of Cards | Đơn vị bảo trợ nghiệp vụ | Quyết định | Tỷ lệ phê duyệt, doanh thu | Tốc độ ra quyết định | Tỷ lệ phê duyệt duy trì khoảng 60% hoặc tăng nhẹ. Thời gian quyết định giảm từ 3-7 ngày xuống dưới 1 ngày. Giảm từ chối nhầm 30% thu hồi khoảng 15 tỷ/năm doanh thu. |
| Chief Risk Officer / Risk Manager | Phê duyệt rủi ro | Quyết định | NPL có tăng không | Tuân thủ, sẵn sàng thanh tra SBV | NPL không vượt baseline hiện tại. Ngưỡng do Risk Committee phê duyệt. Audit trail 24 trường, sẵn sàng thanh tra trong dưới 15 phút. |
| CTO / Head of IT | Phê duyệt kỹ thuật | Ảnh hưởng | Độ phức tạp tích hợp | Gánh nặng bảo trì | Giai đoạn 0 dùng dữ liệu tổng hợp nên không tác động hệ thống IT. Giai đoạn 1 tích hợp theo từng bước. Stack Python/PostgreSQL phổ biến, IT làm chủ khâu triển khai. |
| Compliance Officer | Xác nhận tuân thủ | Ảnh hưởng | Luật AI 134/2025 | BVDLCN, PDPD | Nhãn AI hiển thị, bắt buộc có con người quyết định, hồ sơ DPIA, cơ chế từ chối AI và giám sát thiên lệch. |
| Head of Fraud | Chuyên gia nghiệp vụ gian lận | Ảnh hưởng | Độ chính xác phát hiện gian lận | Tuân thủ SIMO (TT 45) | Bổ sung lớp phát hiện gian lận mới, chấm điểm đa tín hiệu, tích hợp SIMO, giảm bỏ sót gian lận 30%. |
| Credit Officer (người dùng cuối) | Sử dụng hằng ngày | Sử dụng | Việc làm | Tính dễ dùng | AI hỗ trợ, không thay thế. CO ký mọi quyết định. Khối lượng công việc giảm nhờ review theo lô 3-5 phút. CO luôn có quyền override. |
| Internal Audit | Giám sát sau triển khai | Giám sát | Tính đầy đủ của audit trail | Quản trị override | 24 trường, bất biến, có thể phát lại. Override được ghi nhận kèm lý do. Sẵn sàng thanh tra SBV. |

---

## 2. Bản đồ ảnh hưởng và quan tâm

```
                     ẢNH HƯỞNG CAO
                          │
       GIỮ HÀI LÒNG       │    QUẢN LÝ SÁT SAO
       (CTO, Head of IT)  │    (CEO, CFO, Head of Cards,
                          │     CRO/Risk Manager)
                          │
    THẤP ─────────────────┼───────────────── CAO
    QUAN TÂM              │                  QUAN TÂM
                          │
       THEO DÕI           │    CẬP NHẬT THƯỜNG XUYÊN
       (Internal Audit)   │    (Compliance, Head of Fraud,
                          │     Credit Officer)
                          │
                     ẢNH HƯỞNG THẤP
```

---

## 3. Chiến lược làm việc với các bên liên quan

### 3.1 Trao đổi trước buổi trình bày C-level

| # | Cuộc làm việc | Đối tượng | Thời lượng | Mục đích | Nội dung chính |
|---|---------------|-----------|------------|----------|----------------|
| 1 | Làm việc riêng với Head of Cards | Đơn vị bảo trợ nghiệp vụ | 45 phút | Thống nhất business case và mức sàn tỷ lệ phê duyệt | Đơn vị bảo trợ ủng hộ đề xuất tại buổi trình bày |
| 2 | Làm việc riêng với Risk Manager | Người kiểm soát rủi ro | 45 phút | Thống nhất ràng buộc NPL và quản trị ngưỡng | Trần NPL 3.5% |
| 3 | Làm việc riêng với CTO | Người kiểm soát kỹ thuật | 30 phút | Thống nhất hướng kỹ thuật và khả năng tích hợp | API CBS, hỗ trợ IT cho Giai đoạn 0 |
| 4 | Làm việc riêng với Compliance | Xác nhận tuân thủ | 30 phút | Thống nhất cách tiếp cận DPIA và tuân thủ Luật AI | Nội dung nhãn AI |
| 5 | Làm việc riêng với CFO | Phê duyệt ngân sách | 30 phút | Trình bày ROI và các kịch bản "ngay cả khi" | Ngân sách Giai đoạn 0 là 365M |
| 6 | Làm việc riêng với CEO | Phê duyệt cuối cùng | 15-30 phút | Trình bày tóm tắt điều hành | Các vấn đề cần giải đáp trước buổi trình bày |

Nguyên tắc: không có nội dung bất ngờ tại buổi trình bày C-level. Mọi bên liên quan nắm đề xuất từ trước, ý kiến được giải đáp và các bên ủng hộ đã thống nhất.

### 3.2 Mạng lưới ủng hộ

| Bên ủng hộ | Lý do ủng hộ | Lợi ích nhận được |
|------------|--------------|-------------------|
| Head of Cards | Tăng doanh thu (tỷ lệ phê duyệt tăng, thời gian quyết định giảm), nâng vị thế cạnh tranh với fintech | Nhiều hồ sơ được duyệt hơn, quyết định nhanh hơn, trải nghiệm khách hàng tốt hơn |
| Risk Manager | Tiềm năng giảm NPL, audit trail cho SBV, lớp phát hiện gian lận mới | Công cụ quản trị rủi ro tốt hơn, sẵn sàng tuân thủ |

### 3.3 Mối quan ngại dự kiến và phản hồi

| Bên liên quan | Mối quan ngại | Phản hồi |
|---------------|---------------|----------|
| CFO | Ngân sách hạn chế, có nhiều ưu tiên khác | Đề xuất chỉ 365M (Giai đoạn 0), bằng 0.38% thiệt hại hằng năm, là mức đầu tư nhỏ nhất có ý nghĩa. |
| CTO | Tích hợp phức tạp, CBS không có API | Giai đoạn 0 dùng dữ liệu tổng hợp nên không cần tích hợp CBS. Giai đoạn 1 tích hợp theo từng bước với mẫu adapter. |
| Risk Manager | NPL có thể tăng | Ngưỡng do Risk Committee phê duyệt. Guardrail: NPL tăng 200bps thì dừng khẩn cấp. Shadow testing trước khi ảnh hưởng quyết định thực. |
| Compliance | Luật AI mới, quy định hướng dẫn đang hoàn thiện | AI-CRDS được thiết kế theo Luật AI 134/2025 ngay từ đầu: gắn nhãn, con người quyết định, từ chối AI, DPIA. |
| Credit Officer | AI sẽ thay thế CO | CO ký mọi quyết định. AI xử lý hồ sơ thường quy theo lô, CO xử lý hồ sơ phức tạp. Chuyên môn của CO càng quan trọng hơn. |

---

## 4. Kế hoạch truyền thông

### Trước buổi trình bày

| Đối tượng | Kênh | Thông điệp | Tần suất |
|-----------|------|------------|----------|
| C-level (từng người) | Làm việc riêng | Điều chỉnh theo từng bên liên quan (mục 3.1) | Một lần mỗi người |
| Bên ủng hộ | Email/chat và gặp trực tiếp | Chia sẻ đề xuất và thu thập phản hồi | 2-3 lần |
| Credit Officer | Trao đổi thân mật | Giới thiệu hướng hỗ trợ quy trình bằng AI và lắng nghe nhu cầu | 1-2 lần |
| Đội IT | Họp | Giai đoạn 1 cần hỗ trợ từ IT, Giai đoạn 0 không tác động IT | Một lần |

### Sau buổi trình bày

| Kết quả | Hành động truyền thông |
|---------|------------------------|
| Được phê duyệt | Cảm ơn các bên ủng hộ, gửi email tóm tắt đến tất cả bên liên quan, lên lịch khởi động Giai đoạn 0. |
| Phê duyệt có điều kiện | Ghi nhận điều kiện, đưa vào kế hoạch Giai đoạn 0, thông báo các điều chỉnh. |
| Hoãn | Tìm hiểu yếu tố cần thay đổi, giải đáp mối quan ngại, trình bày lại sau 4-8 tuần. |
| Không được phê duyệt | Trao đổi lại với các bên ủng hộ, ghi nhận ý kiến phản đối, xem xét phạm vi nhỏ hơn hoặc thời điểm khác. |
