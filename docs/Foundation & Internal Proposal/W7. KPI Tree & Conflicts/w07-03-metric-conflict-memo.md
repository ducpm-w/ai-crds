# Metric Conflict Memo — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

## Mục đích

Ghi nhận các xung đột thực tế giữa KPI của Business, Risk và Compliance tại Bank X, đồng thời đề xuất khung xử lý cho từng xung đột. Tài liệu dùng làm cơ sở cho các buổi thống nhất giữa các bên liên quan.

Các con số trong tài liệu (approval rate, NPL, chi phí fraud) là giả định lập kế hoạch, sẽ được thay bằng dữ liệu thực của Bank X khi có.

---

## 1. Ba chiều xung đột

```
                    BUSINESS
                   (Head of Cards)
                   "Duyệt nhiều hơn,
                    nhanh hơn, tăng
                    danh mục"
                       /\
                      /  \
                     /    \
        XUNG ĐỘT    /      \ XUNG ĐỘT
           #1      /        \   #2
                  /          \
                 /            \
    RISK ──────────────────── COMPLIANCE
   (Risk Manager)            (Compliance Officer)
   "Giữ NPL thấp,           "Audit trail đầy đủ,
    bắt gian lận,             không thiên lệch, tôn
    kiểm soát dư nợ"          trọng quyền khách hàng"

                XUNG ĐỘT #3
```

---

## 2. Xung đột #1 — Business và Risk

### Mâu thuẫn

| Business muốn | Risk muốn | Lý do xung đột |
|---------------|-----------|------------------|
| Approval rate tăng | NPL rate giảm | Duyệt nhiều hơn nghĩa là duyệt thêm hồ sơ rủi ro hơn nên NPL tăng |
| Time-to-decision giảm | Xem xét kỹ lưỡng | Quyết định nhanh hơn có ít thời gian hơn để phát hiện tín hiệu rủi ro |
| Volume tăng | Kiểm soát dư nợ | Phát hành nhiều thẻ hơn làm tổng dư nợ và tổn thất tiềm tàng tăng |
| Ngưỡng thấp hơn (TH_high) | Ngưỡng cao hơn | Ngưỡng thấp nghĩa là tự động duyệt nhiều hơn, doanh thu tăng nhưng rủi ro cũng tăng |

### Tình huống thực tế tại Bank X

```
Head of Cards: "Mục tiêu Q4 là 2,500 thẻ tín dụng mới mỗi tháng. Approval
rate hiện tại 60% trên 3,000 hồ sơ cho ra 1,800 thẻ. Cần nâng approval
rate lên 70% hoặc nâng số hồ sơ lên 4,200."

Risk Manager: "NPL đã ở mức 3.5%. Nếu nâng approval rate lên 70% mà không
cải thiện mô hình thì NPL sẽ lên 4.0-4.5%. SBV sẽ chất vấn."
```

### Khung xử lý

| Nguyên tắc | Cách thực hiện |
|----------|---------------|
| North Star chi phối: RARPA phải cải thiện, không phải riêng approval rate hay NPL. | Tăng approval rate chỉ được chấp nhận khi RARPA không giảm. |
| Ngân sách sai số chi phối: trần NPL (≤ 3.5%) là ràng buộc cứng. Business tối ưu trong ràng buộc, không vượt. | Risk Committee đặt trần. Business tối ưu approval rate trong phạm vi trần đó. |
| AI là công cụ hỗ trợ: AI-CRDS cho phép tăng approval rate mà không tăng NPL nhờ chấm điểm chính xác hơn (ít false positive và ít false negative). | Bằng chứng: w06-02-cost-of-error-table cho thấy tỷ lệ chi phí FP/FN là 29.4x, tức quy trình hiện tại từ chối nhầm nhiều khách tốt. AI giảm từ chối nhầm nên approval tăng và NPL ổn định. |
| Dữ liệu giải quyết tranh luận: bất đồng được giải quyết bằng dữ liệu shadow testing và phân tích vintage, không bằng ý kiến cá nhân. | Chạy shadow 4 tuần, so sánh AI với quy trình thủ công, rồi quyết định. |

### Vùng vận hành thống nhất

```
Approval Rate (%)
    │
75% ┤                    ╔═══════════════╗
    │                    ║               ║
70% ┤                    ║  VÙNG BUSINESS║
    │                    ║  HÀI LÒNG     ║
65% ┤             ╔══════╬═══════════════╬══════╗
    │             ║      ║   VÙNG VẬN    ║      ║
60% ┤  ─ ─ ─ ─ ─ ╫──────╫── HÀNH THỐNG ─╫──────╫ ─ ─ hiện tại
    │             ║      ║     NHẤT      ║      ║
55% ┤             ╚══════╬═══════════════╬══════╝
    │                    ║  VÙNG RISK    ║
50% ┤                    ║  HÀI LÒNG     ║
    │                    ╚═══════════════╝
    ├──────┼──────┼──────┼──────┼──────┼──────┤
   2.0%   2.5%   3.0%   3.5%   4.0%   4.5%   5.0%
                     NPL Rate (%)
                         │
                    TRẦN NPL ≤ 3.5%
```

Vùng vận hành thống nhất là approval rate 55-65% và NPL ≤ 3.5%, mức cả hai bên chấp nhận được. Mục tiêu của AI-CRDS là dịch chuyển về góc trên bên trái, tức approval cao hơn và NPL thấp hơn.

---

## 3. Xung đột #2 — Business và Compliance

### Mâu thuẫn

| Business muốn | Compliance muốn | Lý do xung đột |
|---------------|-----------------|------------------|
| Ít ma sát nhất | Đồng ý và công bố thông tin đầy đủ | Quy trình đồng ý thêm bước nên tỷ lệ khách bỏ giữa chừng tăng |
| Duyệt nhanh | DPIA và audit trail | Yêu cầu tuân thủ làm tăng thời gian xử lý |
| Dùng toàn bộ dữ liệu | Tối thiểu hóa dữ liệu (BVDLCN) | Nhiều dữ liệu cho mô hình tốt hơn, nhưng BVDLCN yêu cầu tối thiểu hóa |
| Từ chối chung chung | Adverse action cụ thể (NĐ 356) | Lý do cụ thể giúp khách cải thiện hồ sơ nhưng làm lộ tiêu chí của ngân hàng |

### Tình huống thực tế

```
Head of Cards: "Form đồng ý dài 3 trang thì tỷ lệ khách bỏ giữa chừng sẽ
tăng 15-20%. Đối thủ chỉ cần 1 cú click."

Compliance: "NĐ 356 bắt buộc đồng ý rõ ràng cho việc xử lý dữ liệu cá nhân
bằng AI. Không có lối tắt. Vi phạm sẽ bị phạt hành chính và A05 điều tra."
```

### Khung xử lý

| Nguyên tắc | Cách thực hiện |
|----------|---------------|
| Tuân thủ là không thể thương lượng. BVDLCN, Luật AI 134/2025 và yêu cầu của SBV là ràng buộc cứng, Business không được vượt. | Compliance đặt yêu cầu tối thiểu. Business tối ưu trải nghiệm trong yêu cầu đó. |
| Trải nghiệm có thể giảm ma sát trong khuôn khổ tuân thủ. Form đồng ý không nhất thiết dài 3 trang, có thể thiết kế thông minh, theo từng bước và tích hợp vào luồng. | Đồng ý theo tầng: Tầng 1 (cơ bản) khi bắt đầu hồ sơ, Tầng 2 (chi tiết) trước khi chấm điểm AI. Một trang, ngôn ngữ dễ hiểu, 1 lần bấm. |
| Tối thiểu hóa dữ liệu không có nghĩa là không dùng dữ liệu. BVDLCN yêu cầu tối thiểu hóa, không yêu cầu loại bỏ. Dùng những gì cần thiết cho mục đích đã nêu. | Ghi rõ mục đích cho từng trường dữ liệu (w02-03-pdpd-impact-bank-x), biện minh từng trường, loại bỏ trường thực sự không cần thiết. |
| Adverse action là dịch vụ khách hàng, không phải rủi ro lộ thông tin. Lý do cụ thể giúp ngân hàng về dài hạn (ít khiếu nại hơn, tuân thủ quy định). | Đào tạo CO: nêu lý do cụ thể không có nghĩa là tiết lộ công thức chấm điểm. Ví dụ "điểm CIC thấp" không tiết lộ ngưỡng. |

---

## 4. Xung đột #3 — Risk và Compliance

### Mâu thuẫn

| Risk muốn | Compliance muốn | Lý do xung đột |
|-----------|-----------------|------------------|
| Giữ toàn bộ dữ liệu vô thời hạn (audit, SBV) | Xóa PII theo lịch lưu trữ (BVDLCN) | SBV cần audit trail trong khi BVDLCN yêu cầu xóa PII |
| Dùng mọi đặc trưng để chấm điểm | Không thiên lệch, không phân biệt đối xử (Luật AI) | Một số đặc trưng (địa lý, loại hình công ty) dự báo rủi ro nhưng có thể đại diện cho thuộc tính được bảo vệ |
| Chấp nhận mô hình khó giải thích (mô hình phức tạp cho độ chính xác cao hơn) | Bắt buộc giải thích được (Luật AI, NĐ 356) | Mô hình GBM dạng hộp đen chính xác hơn logistic regression dễ giải thích, nhưng Luật AI yêu cầu có giải thích |

### Tình huống thực tế

```
Risk Manager: "Địa lý (tỉnh/thành) là biến dự báo mạnh. Khách nông thôn
có tỷ lệ vỡ nợ cao hơn khách đô thị 30%. Bỏ đặc trưng này thì mô hình
kém đi."

Compliance: "Luật AI 134/2025 Điều 4: không phân biệt đối xử. Nếu địa lý
là đại diện cho thu nhập hoặc dân tộc thì đó là phân biệt đối xử. Chênh
lệch approval rate giữa đô thị và nông thôn trên 8pp là dấu hiệu cần chú ý."
```

### Khung xử lý

| Nguyên tắc | Cách thực hiện |
|----------|---------------|
| Vòng đời dữ liệu theo tầng giải quyết xung đột về lưu trữ. | w02-03-pdpd-impact-bank-x: Tầng 1 (PII) xóa sớm. Tầng 2 (audit đã giả danh hóa) giữ lâu cho SBV. Cả hai bên đều được đáp ứng. |
| Dùng đặc trưng nhưng giám sát thiên lệch. Địa lý có thể được dùng nếu (a) có cơ sở là chênh lệch rủi ro thực tế, (b) thiên lệch được giám sát hàng tháng, (c) chênh lệch nằm trong phạm vi chấp nhận. | Đưa địa lý vào mô hình. Giám sát L3-C5 (chênh lệch địa lý ≤ 8pp). Nếu vượt, điều tra xem đó là chênh lệch rủi ro thực hay thiên lệch gián tiếp. |
| Dùng lớp giải thích thay vì hạn chế mô hình. Mô hình phức tạp được chấp nhận nếu có lớp giải thích (SHAP/LIME cho từng trường hợp). | Dùng GBM cho độ chính xác. Thêm lớp giải thích SHAP. Thông báo adverse action dùng 3 yếu tố SHAP hàng đầu. Risk có độ chính xác, Compliance có khả năng giải thích. |
| Tuân thủ trước, tối ưu sau. Khi Risk và Compliance thực sự xung đột thì Compliance quyết định. Mô hình kém hơn một chút tốt hơn vi phạm quy định. | Compliance có quyền phủ quyết với các đặc trưng gây thiên lệch không chấp nhận được. Risk có thể kháng nghị lên Risk Committee kèm bằng chứng dữ liệu. |

---

## 5. Xung đột #4 — Override rate quá cao và quá thấp

### Mâu thuẫn

| Override quá cao (> 40%) | Override quá thấp (< 5%) |
|-------------------------|----------------------|
| Khuyến nghị của AI bị bỏ qua nên AI không tạo giá trị, đầu tư bị lãng phí. | CO duyệt theo quán tính, không thực sự xem xét. Nguyên tắc human-in-the-loop bị vi phạm về tinh thần. |
| Nguyên nhân có thể: mô hình hiệu chỉnh kém, CO không tin AI | Nguyên nhân có thể: CO quá tin AI, CO quá tải, duyệt lô bị hiểu thành tự động duyệt |
| Risk muốn: override thấp hơn (CO tin AI) | Compliance muốn: không quá thấp (việc xem xét của con người phải thực chất) |

### Cách xử lý

| Nguyên tắc | Cách thực hiện |
|----------|---------------|
| Vùng mục tiêu 10-30% | Lành mạnh: CO đổi quyết định của AI trong 10-30% trường hợp, tức CO bổ sung giá trị riêng mà AI không có |
| Override > 40% kéo dài 2 tuần thì rà soát mô hình | Điều tra: mô hình sai (hiệu chỉnh lại) hay CO có thông tin mà AI không có (bổ sung đặc trưng mới) |
| Override < 5% kéo dài 1 tháng thì kiểm tra CO | Điều tra: CO có thực sự xem xét không. Kiểm tra `co_review_time_seconds`; nếu duyệt lô S1 dưới 30 giây mỗi hồ sơ thì là duyệt theo quán tính. Giảm kích thước lô, tổ chức lại đào tạo bắt buộc. |
| Hướng của override có ý nghĩa | Override sang duyệt (AI từ chối, CO duyệt): theo dõi NPL của nhóm này riêng. Override sang từ chối (AI duyệt, CO từ chối): theo dõi xem các hồ sơ bị từ chối có phải khách tốt hay không (phản thực tế, khó đo). |
| Dữ liệu quyết định | Sau 6 tháng, so sánh NPL của nhóm theo khuyến nghị AI với nhóm CO override. Nếu nhóm CO override tốt hơn thì mô hình cần các đặc trưng mà CO có. Nếu nhóm CO override kém hơn thì cần đào tạo CO. |

---

## 6. Xung đột #5 — Ngưỡng gian lận và trải nghiệm khách hàng

### Mâu thuẫn

| Risk/Fraud muốn | Business/CX muốn |
|---------------------|------------------|
| Ngưỡng gian lận chặt (TH_fraud = 0.30) để bắt nhiều gian lận hơn | Ngưỡng gian lận lỏng (TH_fraud = 0.50) để ít khách tốt bị gắn cờ |
| Chấp nhận nhiều cảnh báo sai để bắt gần hết gian lận | Từ chối nhầm ít khách hợp lệ hơn, bảo vệ uy tín thương hiệu |
| Mỗi trường hợp bỏ sót gian lận gây tổn thất 50M VND và gánh nặng báo cáo SIMO | Mỗi cảnh báo gian lận sai làm mất 40M VND LTV, khách bực bội và ảnh hưởng truyền miệng |

### Cách xử lý

| Nguyên tắc | Cách thực hiện |
|----------|---------------|
| Tách điểm gian lận khỏi điểm tín dụng | Mô hình gian lận chạy độc lập. Khách có thể có điểm tín dụng tốt nhưng vẫn bị gắn cờ gian lận. Hai đánh giá độc lập, không gộp thành một ngưỡng. |
| Chi phí bỏ sót gian lận xấp xỉ chi phí cảnh báo gian lận sai (50M so với 40M, tỷ lệ 1.25x) | Chi phí gần ngang nhau nên ngưỡng cần cân bằng, không quá chặt cũng không quá lỏng. TH_fraud = 0.40 phản ánh sự cân bằng này. |
| Giám sát tỷ lệ cảnh báo gian lận sai | Target: tỷ lệ cảnh báo sai ≤ 80% số hồ sơ State 3 (nghĩa là ít nhất 20% hồ sơ bị gắn cờ là gian lận thật). Nếu cảnh báo sai > 85% thì ngưỡng quá nhạy, trải nghiệm khách hàng bị ảnh hưởng. |
| SLA xử lý nhanh cho cảnh báo gian lận sai | SLA State 3 là 4h. Khách hợp lệ được giải tỏa trong tối đa 4h để giảm thiệt hại trải nghiệm. Nếu SLA liên tục bị trễ thì vấn đề là năng lực, không phải ngưỡng. |
| Truyền thông với khách khi bị gắn cờ gian lận | Không thông báo "quý khách bị nghi ngờ gian lận". Thay vào đó: "Chúng tôi cần xác minh danh tính bổ sung cho hồ sơ của quý khách. Vui lòng thực hiện bước sau." Trình bày như một biện pháp bảo mật, không phải cáo buộc. |

---

## 7. Quy trình giải quyết xung đột

### 7.1 Ai quyết định khi các metric xung đột

| Loại xung đột | Bước đầu | Nếu chưa giải quyết | Thẩm quyền cuối cùng |
|-------------|----------|-------------|---------------|
| Business và Risk (approval rate và NPL) | Quản lý dự án làm trung gian bằng dữ liệu | Risk Committee xem xét bằng chứng | Risk Committee quyết định (Risk có quyền phủ quyết với trần NPL) |
| Business và Compliance (tốc độ và đồng ý) | Quản lý dự án và Compliance thảo luận các phương án trải nghiệm | Rà soát pháp lý | Compliance có quyền phủ quyết (yêu cầu quy định là không thể thương lượng) |
| Risk và Compliance (lưu trữ và xóa, đặc trưng và thiên lệch) | Risk và Compliance thảo luận phương án theo tầng | Risk Committee và Legal | Nếu là yêu cầu quy định thì Compliance quyết định. Nếu là thông lệ tốt nhất thì Risk Committee quyết định. |
| Bất kỳ metric nào với North Star (RARPA) | Kiểm tra thay đổi đề xuất có cải thiện RARPA không | Nếu RARPA trung lập hoặc tăng thì tiến hành. Nếu RARPA giảm thì phải biện minh ngoại lệ. | Risk Committee |

### 7.2 Lộ trình leo thang cho xung đột metric

```
Bước 1: Quản lý dự án xác định xung đột, ghi nhận dữ liệu
    │
Bước 2: Trao đổi 1-1 với từng bên liên quan (nắm rõ lập trường)
    │
Bước 3: Họp chung với bằng chứng dữ liệu
    │     Đạt thống nhất thì ghi nhận và triển khai
    │
Bước 4: Nếu chưa thống nhất, Risk Committee phân xử
    │     Committee quyết định kèm lập luận được ghi lại
    │
Bước 5: Bên không đồng ý có thể kháng nghị lên C-level kèm bằng chứng mới
        Quyết định của C-level là cuối cùng
```

### 7.3 Họp rà soát metric hàng quý

| Nội dung | Thời lượng | Người tham gia |
|------------|---------|-------------|
| Xu hướng North Star (RARPA) | 10 phút | Tất cả |
| Rà soát chỉ tiêu Business (L2-B1/B2/B3) | 10 phút | Head of Cards trình bày |
| Rà soát chỉ tiêu Risk (L2-R1/R2/R3) | 10 phút | Risk Manager trình bày |
| Rà soát chỉ tiêu Compliance (L3-C1 đến C8) | 10 phút | Compliance trình bày |
| Xung đột phát sinh và cách xử lý | 15 phút | Quản lý dự án điều phối |
| Đề xuất điều chỉnh ngưỡng (nếu có) | 10 phút | Data Science trình bày, Risk Committee quyết định |
| **Tổng** | **~65 phút** | |

---

## 8. Các tình huống xung đột điển hình và hướng phản hồi

### Tình huống 1: Đề xuất tăng approval rate lên 70%

```
Head of Cards: "Cần approval rate 70%."

Phản hồi của Quản lý dự án:
"Hiện approval rate là 60% và NPL là 3.5%. Nếu nâng approval rate lên
70% bằng cách hạ ngưỡng:
- NPL ước tính tăng lên 4.0-4.5% (vượt trần 3.5%).
- Risk Committee sẽ không phê duyệt.

AI-CRDS có thể nâng approval rate lên 65% đồng thời giảm NPL xuống 3.0%
nhờ giảm tỷ lệ từ chối nhầm. Kết quả: approval +5pp, NPL -0.5pp.

Đề xuất: chạy shadow testing 4 tuần để chứng minh AI giảm từ chối nhầm,
sau đó tăng approval rate dần dần."
```

### Tình huống 2: NPL tăng 0.3pp và đề xuất siết toàn bộ

```
Risk Manager: "NPL tăng từ 3.5% lên 3.8%. Cần tăng TH_high ngay."

Phản hồi của Quản lý dự án:
"Trước khi siết cần phân tích:
1. NPL tăng ở nhóm nào: hồ sơ AI duyệt hay hồ sơ CO override sang duyệt?
2. Nếu nhóm AI duyệt ổn định, nhóm CO override tăng thì vấn đề nằm ở
   quản trị override, không phải ngưỡng.
3. Nếu nhóm AI duyệt tăng thì kiểm tra mô hình có drift không (L3-M7 PSI)
   và có cú sốc bên ngoài không (suy thoái kinh tế).

Đề xuất: điều tra nguyên nhân gốc trong 1 tuần rồi hành động có mục tiêu,
thay vì siết đồng loạt (làm chi phí FP tăng đáng kể)."
```

### Tình huống 3: Đặc trưng địa lý gây thiên lệch

```
Compliance: "Approval rate TP.HCM là 68%, các tỉnh nông thôn là 52%. Chênh
lệch 16pp, vượt ngưỡng 8pp. Đề nghị loại bỏ đặc trưng địa lý."

Phản hồi của Quản lý dự án:
"Cần phân tích sâu hơn:
1. Chênh lệch địa lý phản ánh khác biệt rủi ro thực hay thiên lệch gián tiếp?
2. Khách nông thôn có điểm CIC thấp hơn không? Thu nhập thấp hơn không?
3. Nếu loại địa lý và thay bằng thu nhập và CIC (các yếu tố rủi ro thực),
   chênh lệch có giảm không?

Đề xuất: thử mô hình không có đặc trưng địa lý. Nếu Gini giảm dưới 1% thì
loại bỏ vĩnh viễn. Nếu giảm trên 1% thì giữ lại kèm giám sát thiên lệch và
rà soát hàng năm."
```

---

## 9. Tài liệu liên quan

w07-01-kpi-tree (phân cấp metric), w07-04-guardrail-definitions (ngưỡng chấp nhận), w06-01-threshold-framework (quản trị ngưỡng), w06-02-cost-of-error-table (cơ sở chi phí cho phân tích đánh đổi).
