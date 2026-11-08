# Proposed Solution — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

> Số liệu trong tài liệu là giả định lập kế hoạch, sẽ được thay bằng dữ liệu thực của Bank X khi có.

## 1. AI-CRDS là gì

AI-CRDS là hệ thống hỗ trợ quyết định tín dụng, tích hợp AI scoring và phát hiện gian lận cho thẻ tín dụng khách hàng cá nhân hưởng lương tại Bank X.

Hệ thống không tự động phê duyệt. AI đưa ra khuyến nghị, Credit Officer xem xét và ký quyết định cuối cùng. Việc con người tham gia quyết định là bắt buộc theo Luật TCTD 2024 và Luật AI 134/2025.

| Thuộc tính | Nội dung |
|------------|----------|
| Phạm vi | Origination thẻ tín dụng, phân khúc khách hàng cá nhân hưởng lương |
| Chức năng | Credit scoring, phát hiện gian lận, giải thích quyết định, audit trail |
| Người quyết định | Credit Officer (trong mọi trường hợp) |
| Vai trò của AI | Hỗ trợ quyết định: chấm điểm, giải thích, khuyến nghị |
| Tuân thủ | Yêu cầu SBV, Luật AI 134/2025, Luật BVDLCN 91/2025 |

---

## 2. Cách hoạt động

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Hồ sơ    │───▶│ AI đánh  │───▶│ CO xem   │───▶│ Kết quả  │
│ nộp vào  │    │ giá <30s │    │ + quyết  │    │ + thông  │
│          │    │          │    │ định     │    │ báo      │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │
              ┌──────┴──────┐
              │ Đầu ra AI:  │
              │ • Điểm rủi ro│
              │ • Cờ gian lận│
              │ • 3 lý do    │
              │   chính      │
              │ • Khuyến nghị│
              │ • Độ tin cậy │
              └─────────────┘
```

Hồ sơ được phân vào 5 trạng thái quyết định thay vì một hàng đợi duy nhất:

| Trạng thái | Tỷ trọng volume | Thời gian CO | Mô tả |
|------------|-----------------|--------------|-------|
| Đề xuất duyệt tự động | 35-45% | 3-5 phút | Điểm cao, độ tin cậy cao: CO xác nhận theo lô |
| Review tiêu chuẩn | 25-35% | 20-35 phút | Điểm trung bình: CO review đầy đủ |
| Ưu tiên gian lận | 2-5% | 45 phút | Có tín hiệu gian lận: chuyển Senior CO/đội Fraud |
| Chuyển cấp | 5-10% | 45 phút | AI không chắc chắn: chuyển Senior CO |
| Cần bổ sung thông tin | 8-15% | 10 phút | Thiếu dữ liệu: yêu cầu khách hàng bổ sung |

Kết quả kỳ vọng: thời gian quyết định giảm từ 1-7 ngày xuống dưới 1 ngày, nhu cầu CO giảm từ 10 FTE xuống khoảng 4.3 FTE.

---

## 3. Lựa chọn xây dựng nội bộ

| Tiêu chí | Xây dựng nội bộ | Mua vendor (FICO/vendor trong nước) |
|----------|-----------------|--------------------------------------|
| Chi phí 3 năm | 8-14 tỷ | 14-27 tỷ |
| Quyền sở hữu IP | 100% Bank X | Vendor sở hữu |
| Dữ liệu | Tận dụng CBS, CIC, lịch sử giao dịch | Vendor khó truy cập dữ liệu nội bộ |
| Phù hợp quy định | Thiết kế riêng cho Việt Nam (Luật AI, BVDLCN, SBV) | Cần điều chỉnh cho Việt Nam |
| Khả năng giải thích | Minh bạch hoàn toàn | Nguy cơ hộp đen |
| Tùy biến | Toàn quyền kiểm soát | Phụ thuộc lộ trình vendor |
| Thời gian triển khai | 8-12 tháng | 4-8 tháng |

Đề xuất xây dựng nội bộ: chi phí thấp hơn, Bank X sở hữu IP và phù hợp quy định tốt hơn. Thời gian triển khai chậm hơn vendor khoảng 4 tháng là chấp nhận được vì Giai đoạn 0 chạy bóng, không ảnh hưởng vận hành.

---

## 4. Triển khai theo giai đoạn

```
Giai đoạn 0          Giai đoạn 1            Giai đoạn 2
CHẠY BÓNG            TRIỂN KHAI GIỚI HẠN    TRIỂN KHAI ĐẦY ĐỦ
8 tuần               16 tuần                Liên tục
365M VND             1.32 tỷ                2-4 tỷ/năm

AI chỉ quan sát      AI khuyến nghị,        AI vận hành toàn bộ
Không ảnh hưởng      CO review tất cả.      origination thẻ.
quyết định thực.     Một tập hồ sơ con.     Giám sát đầy đủ.

Rủi ro: rất thấp     Rủi ro: thấp           Rủi ro: được kiểm soát
───────────────── ── ─────────────────── ── ──────────────────
    CỔNG 0→1             CỔNG 1→2              CỔNG 2→MỞ RỘNG
    Kết quả shadow       Kết quả triển khai    Báo cáo tác động
    testing đạt?         giới hạn đạt?         90 ngày đạt?

    Không đạt → DỪNG     Không đạt → DỪNG      Tiếp tục + mở rộng
    Đã chi: 365M         Đã chi: 1.68 tỷ
```

Mỗi cổng có điểm dừng: ngân sách giai đoạn sau chỉ được giải ngân khi cổng trước đạt. Mức thiệt hại tối đa là ngân sách Giai đoạn 0 (365M).

---

## 5. Tuân thủ ngay từ thiết kế

| Yêu cầu | Cách AI-CRDS đáp ứng |
|---------|----------------------|
| Con người tham gia quyết định (Luật TCTD, Luật AI) | CO ký mọi quyết định, AI chỉ khuyến nghị. |
| Gắn nhãn AI (Luật AI 134/2025) | Dòng "Quyết định được hỗ trợ bởi AI" hiển thị trên mọi kết quả. |
| Giải thích quyết định (NĐ 356 Đ.9) | 3 lý do chính bằng ngôn ngữ dễ hiểu để khách hàng biết lý do bị từ chối. |
| Quyền yêu cầu người xem xét lại (NĐ 356) | Khách hàng có quyền yêu cầu CO khác review không dùng AI. |
| Quyền từ chối AI (NĐ 356) | Khách hàng có quyền chọn xử lý hoàn toàn thủ công. |
| Audit trail (TT 13 và SBV) | 24 trường, bất biến, sẵn sàng thanh tra SBV trong dưới 15 phút. |
| DPIA (NĐ 356 Đ.19) | Hồ sơ DPIA được hoàn thiện trước khi bắt đầu shadow testing. |
| Giám sát thiên lệch (Luật AI Đ.4) | Theo dõi chênh lệch tỷ lệ phê duyệt theo giới tính, địa lý, độ tuổi. |
| Lưu trữ dữ liệu trong nước | Sử dụng cloud trong nước, không chuyển dữ liệu ra nước ngoài. |

Các trích dẫn "NĐ 356/2025", "TT 13" là ký hiệu dùng trong bộ tài liệu này và được chuẩn hóa theo văn bản pháp quy chính thức khi lập hồ sơ tuân thủ ở Giai đoạn 0.
