# Executive Summary — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

> Số liệu trong tài liệu là giả định lập kế hoạch dựa trên benchmark thị trường, sẽ được thay bằng dữ liệu thực của Bank X khi có.

## Bối cảnh

Bank X xử lý khoảng 3,000 hồ sơ thẻ tín dụng mỗi tháng bằng quy trình thủ công. 10-12 Credit Officer (CO) review từng hồ sơ trong 20-45 phút, dựa trên kinh nghiệm cá nhân và báo cáo CIC. Quy trình mất 1-7 ngày từ nộp hồ sơ đến quyết định. Hiện chưa có hệ thống scoring tự động, chưa có lớp phát hiện gian lận và chưa có giải thích cho khách hàng bị từ chối.

Với NPL thẻ tín dụng khoảng 3.5%, tỷ lệ gian lận khoảng 0.8% và tỷ lệ từ chối nhầm ước tính khoảng 10%, tổng thiệt hại ước tính khoảng 95.65 tỷ VND/năm. Trong đó 54% đến từ việc từ chối nhầm khách hàng tốt (chi phí cơ hội), không phải từ nợ xấu.

## Vấn đề

Quy trình thủ công không mở rộng được khi volume thẻ tín dụng tăng: thêm CO làm chi phí tăng tuyến tính nhưng không cải thiện chất lượng quyết định. Thị trường thẻ tại Việt Nam cạnh tranh mạnh, BNPL tăng trưởng khoảng 36%/năm và fintech cho kết quả duyệt trong vài phút, trong khi Bank X cần 3-7 ngày.

Luật AI 134/2025 (hiệu lực 01/03/2026) yêu cầu minh bạch và trách nhiệm giải trình đối với quyết định có sự tham gia của AI. Bank X cần sẵn sàng để cạnh tranh và tuân thủ.

## Giải pháp

**AI-CRDS** là hệ thống hỗ trợ quyết định tín dụng, tích hợp chấm điểm origination và phát hiện gian lận cho thẻ tín dụng khách hàng cá nhân hưởng lương. Hệ thống đánh giá hồ sơ trong dưới 30 giây và đưa ra điểm số, giải thích và khuyến nghị. Credit Officer xem xét và ký quyết định cuối cùng: AI hỗ trợ, con người quyết định.

Hệ thống đáp ứng yêu cầu của SBV, Luật AI 134/2025 và Luật BVDLCN 91/2025. Phương án xây dựng nội bộ giúp Bank X sở hữu 100% IP, với chi phí 3 năm thấp hơn phương án mua vendor khoảng 40-50%.

## Đề xuất phê duyệt

**Phê duyệt Giai đoạn 0: Khảo sát dữ liệu và chạy bóng (shadow testing)**

| Hạng mục | Nội dung |
|----------|----------|
| Thời gian | 8 tuần |
| Ngân sách | 365 triệu VND (khoảng 14,500 USD) |
| Rủi ro | Rất thấp: AI chỉ quan sát, không ảnh hưởng quyết định thực |
| Sản phẩm bàn giao | Báo cáo chất lượng dữ liệu, bản demo MVP, 4 tuần shadow testing, báo cáo Go/No-Go |
| Lợi ích kỳ vọng (triển khai đầy đủ) | 26.64 tỷ VND/năm |
| Hòa vốn | Tháng thứ 11 sau triển khai |
| Điểm dừng | Nếu Giai đoạn 0 không đạt tiêu chí, dự án dừng; chi phí đã chi tối đa 365 triệu VND |
