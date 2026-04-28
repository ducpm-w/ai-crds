# Executive Summary — AI-Native CRDS
> **Dự án:** AI-Native Credit Risk Decision Support
> **Trình:** C-Level — Bank X
> **Ngày:** 09/04/2026
> **Phân loại:** Internal — Confidential

---

## SITUATION

Bank X đang xử lý ~3,000 hồ sơ thẻ tín dụng mỗi tháng bằng quy trình thủ công. 10-12 Credit Officers review từng hồ sơ trong 20-45 phút, dựa trên kinh nghiệm cá nhân và CIC report. Quy trình mất 1-7 ngày từ nộp hồ sơ đến quyết định. Không có hệ thống scoring tự động, không có fraud detection layer, không có explainability cho khách hàng bị từ chối.

Với NPL CC ~3.5%, fraud rate ~0.8%, và tỷ lệ từ chối nhầm ước tính ~10%, **tổng thiệt hại ước tính ~95.65 tỷ VND/năm** — trong đó 54% đến từ việc từ chối nhầm khách hàng tốt (opportunity cost), không phải từ nợ xấu.

## COMPLICATION

Quy trình thủ công không thể scale khi volume thẻ tín dụng tăng. Tuyển thêm CO → chi phí tăng tuyến tính nhưng không cải thiện quality. Thị trường CC VN đang cạnh tranh mạnh — BNPL tăng trưởng 36%/năm, fintech cung cấp approval trong phút. Bank X vẫn mất 3-7 ngày.

Đồng thời, Luật AI 134/2025 (hiệu lực 01/03/2026) yêu cầu minh bạch và trách nhiệm giải trình cho quyết định có AI. Bank X cần sẵn sàng — không chỉ để cạnh tranh mà để comply.

## RESOLUTION

**AI-Native CRDS:** Hệ thống AI hỗ trợ quyết định tín dụng, tích hợp origination scoring + fraud detection cho CC retail salaried. AI đánh giá hồ sơ trong <30 giây, đưa ra score + giải thích + recommendation. Credit Officer xem xét và ký quyết định cuối cùng — **AI hỗ trợ, con người quyết định.**

Hệ thống comply yêu cầu SBV, Luật AI 134/2025, và Luật BVDLCN 91/2025. Build in-house → Bank X sở hữu 100% IP, chi phí 3 năm thấp hơn vendor 40-50%.

## THE ASK

**Phê duyệt Phase 0: Discovery & Shadow Testing**

| | |
|--|--|
| **Thời gian** | 8 tuần |
| **Budget** | 365 triệu VND (~$14,500) |
| **Rủi ro** | Gần bằng 0 — AI chỉ quan sát, không ảnh hưởng quyết định thật |
| **Deliverables** | Data quality assessment, MVP demo, shadow testing 4 tuần, Go/No-go report |
| **Expected return (full deploy)** | 26.64 tỷ VND/năm tiết kiệm |
| **Break-even** | Tháng 11 sau deployment |
| **Kill switch** | Nếu Phase 0 không đạt → dừng. Sunk cost = 365M only. |
