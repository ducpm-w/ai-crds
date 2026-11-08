# Adverse Action Templates — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Ba mẫu chuẩn cho thông báo adverse action (thông báo từ chối) của Bank X, tuân thủ Luật TCTD 2024, NĐ 356/2025 và Luật AI 134/2025, kèm thư viện lý do từ chối hoàn chỉnh. Tài liệu mở rộng từ w05-04-adverse-action-flow ở phần nội dung thông báo.

---

## 1. TEMPLATE A — Credit Score Based Rejection

Dùng khi: từ chối dựa trên chấm điểm tín dụng của AI (phần lớn các trường hợp từ chối).

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             THÔNG BÁO KẾT QUẢ XÉT DUYỆT
             THẺ TÍN DỤNG [TÊN SẢN PHẨM]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kính gửi: [Họ và tên]
Mã hồ sơ: [APP-YYYY-MM-XXXXX]
Ngày thông báo: [DD/MM/YYYY]

────────────────────────────────────────────────────────

KẾT QUẢ: CHƯA ĐÁP ỨNG ĐIỀU KIỆN PHÁT HÀNH THẺ

Sau khi xem xét hồ sơ của Quý khách, [Tên Bank X]
rất tiếc thông báo hồ sơ đề nghị phát hành thẻ tín dụng
[Tên sản phẩm] chưa đáp ứng đủ điều kiện tại thời điểm
này.

────────────────────────────────────────────────────────

LÝ DO CHÍNH:

1. [LÝ DO 1 — từ reason library]
2. [LÝ DO 2 — từ reason library]
3. [LÝ DO 3 — từ reason library]

────────────────────────────────────────────────────────

QUYỀN CỦA QUÝ KHÁCH:

- Yêu cầu xem xét lại bởi chuyên viên tín dụng
  (không sử dụng hệ thống AI)
- Kiểm tra thông tin tín dụng CIC miễn phí 1 lần/năm
  tại https://cic.gov.vn hoặc ứng dụng CIC Credit Connect
- Khiếu nại quyết định trong vòng 30 ngày
- Nộp hồ sơ mới sau 90 ngày kể từ ngày thông báo

────────────────────────────────────────────────────────

(i) Quyết định này được hỗ trợ bởi hệ thống trí tuệ
nhân tạo và được xác nhận bởi cán bộ tín dụng
của [Tên Bank X].

────────────────────────────────────────────────────────

LIÊN HỆ:
Hotline: [Số hotline]
Email: [Email khiếu nại]
Chi nhánh: Bất kỳ chi nhánh [Tên Bank X]

Thời gian xử lý khiếu nại: tối đa 15 ngày làm việc.

Mã thông báo: [AAN-YYYY-MM-XXXXX]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 2. TEMPLATE B — Fraud/Identity Rejection

Dùng khi: từ chối do fraud flag hoặc xác minh danh tính không đạt. Không tiết lộ chi tiết phát hiện gian lận để tránh giúp đối tượng gian lận hiểu cách hệ thống hoạt động.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             THÔNG BÁO KẾT QUẢ XÉT DUYỆT
             THẺ TÍN DỤNG [TÊN SẢN PHẨM]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kính gửi: [Họ và tên]
Mã hồ sơ: [APP-YYYY-MM-XXXXX]
Ngày thông báo: [DD/MM/YYYY]

────────────────────────────────────────────────────────

KẾT QUẢ: CHƯA ĐÁP ỨNG ĐIỀU KIỆN PHÁT HÀNH THẺ

Hồ sơ của Quý khách chưa đáp ứng yêu cầu xác minh
thông tin theo quy định của [Tên Bank X].

────────────────────────────────────────────────────────

LÝ DO:

Không thể hoàn tất xác minh thông tin cá nhân theo
yêu cầu quy định.

────────────────────────────────────────────────────────

QUYỀN CỦA QUÝ KHÁCH:

- Đến chi nhánh [Tên Bank X] gần nhất để được hỗ trợ
  xác minh thông tin trực tiếp
- Khiếu nại quyết định trong vòng 30 ngày

────────────────────────────────────────────────────────

LIÊN HỆ:
Hotline: [Số hotline]
Chi nhánh: Bất kỳ chi nhánh [Tên Bank X]

Mã thông báo: [AAN-YYYY-MM-XXXXX]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Khác biệt so với Template A:
- Không nêu "nghi ngờ gian lận" để tránh rủi ro pháp lý về danh dự.
- Không nêu chi tiết tín hiệu gian lận để không tạo thông tin hữu ích cho đối tượng gian lận.
- Không có nhãn AI vì từ chối do gian lận thuộc chính sách của Bank X, không riêng của AI (Bank X có thể chọn đưa nhãn vào).
- Không có quyền yêu cầu xem xét lại bởi con người vì từ chối do gian lận là quyết định cuối cùng; khách hàng có thể đến chi nhánh để xác minh danh tính trực tiếp.
- Lý do dùng cách diễn đạt chung "không thể hoàn tất xác minh", bao quát các trường hợp eKYC không đạt, giấy tờ giả và danh tính không khớp.
- Khách hàng hợp lệ được hướng dẫn đến chi nhánh để xác minh lại trực tiếp.

---

## 3. TEMPLATE C — CO Override Rejection (AI Recommended Approve)

Dùng khi: CO override đề xuất duyệt của AI để từ chối. Lý do do CO đưa ra, không phải do AI.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             THÔNG BÁO KẾT QUẢ XÉT DUYỆT
             THẺ TÍN DỤNG [TÊN SẢN PHẨM]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kính gửi: [Họ và tên]
Mã hồ sơ: [APP-YYYY-MM-XXXXX]
Ngày thông báo: [DD/MM/YYYY]

────────────────────────────────────────────────────────

KẾT QUẢ: CHƯA ĐÁP ỨNG ĐIỀU KIỆN PHÁT HÀNH THẺ

Sau khi xem xét hồ sơ, [Tên Bank X] rất tiếc thông báo
hồ sơ chưa đáp ứng đủ điều kiện.

────────────────────────────────────────────────────────

LÝ DO CHÍNH:

1. [LÝ DO 1 — từ CO override reason, không phải AI]
2. [LÝ DO 2]
3. [LÝ DO 3 — nếu có]

────────────────────────────────────────────────────────

QUYỀN CỦA QUÝ KHÁCH:

- Yêu cầu xem xét lại bởi chuyên viên tín dụng khác
- Kiểm tra thông tin tín dụng CIC miễn phí 1 lần/năm
- Khiếu nại quyết định trong vòng 30 ngày
- Nộp hồ sơ mới sau 90 ngày

────────────────────────────────────────────────────────

(i) Quyết định này được hỗ trợ bởi hệ thống trí tuệ
nhân tạo và được xác nhận bởi cán bộ tín dụng
của [Tên Bank X].

────────────────────────────────────────────────────────

LIÊN HỆ:
Hotline: [Số hotline]
Email: [Email khiếu nại]

Mã thông báo: [AAN-YYYY-MM-XXXXX]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Khác biệt so với Template A:
- Lý do lấy từ lý do override của CO (đã chuyển sang ngôn ngữ dễ hiểu), không phải từ kết quả mô hình AI.
- Nhãn AI vẫn được giữ vì AI tham gia quy trình dù CO đã override.
- "Xem xét lại bởi chuyên viên khác" nghĩa là CO xem xét lại phải khác CO đã từ chối.

---

## 4. THƯ VIỆN LÝ DO TỪ CHỐI

### 4.1 Lý do về điểm tín dụng

| Mã | Lý do nội bộ | Nội dung gửi khách hàng |
|------|----------------|--------------------------------|
| R01 | `cic_score_low` | "Điểm tín dụng tại Trung tâm Thông tin Tín dụng Quốc gia (CIC) chưa đạt mức tối thiểu" |
| R02 | `dti_high` | "Tỷ lệ nghĩa vụ nợ hiện tại so với thu nhập vượt mức cho phép" |
| R03 | `dpd_30_recent` | "Có lịch sử thanh toán chậm trong 12 tháng gần nhất" |
| R04 | `dpd_90_history` | "Có lịch sử nợ quá hạn nghiêm trọng (trên 90 ngày)" |
| R05 | `npl_group_3plus` | "Có nợ xấu trong lịch sử tín dụng" |
| R06 | `inquiries_high` | "Số lượng yêu cầu vay vốn gần đây cao bất thường" |
| R07 | `debt_total_high` | "Tổng dư nợ hiện tại tại các tổ chức tín dụng vượt mức cho phép" |
| R08 | `credit_history_short` | "Chưa có đủ lịch sử tín dụng để đánh giá" |

### 4.2 Lý do về thu nhập và việc làm

| Mã | Lý do nội bộ | Nội dung gửi khách hàng |
|------|----------------|---------------|
| R09 | `income_insufficient` | "Thu nhập chưa đáp ứng yêu cầu tối thiểu cho hạn mức đề nghị" |
| R10 | `income_unverifiable` | "Không thể xác minh thu nhập theo yêu cầu" |
| R11 | `employment_short` | "Thời gian làm việc tại đơn vị hiện tại chưa đủ yêu cầu tối thiểu" |
| R12 | `employer_unverifiable` | "Không thể xác minh thông tin nơi làm việc" |

### 4.3 Lý do về danh tính và giấy tờ

| Mã | Lý do nội bộ | Nội dung gửi khách hàng |
|------|----------------|---------------|
| R13 | `ekyc_fail` | "Không thể xác minh danh tính theo yêu cầu" |
| R14 | `data_mismatch` | "Thông tin khai báo chưa khớp với hồ sơ xác minh" |
| R15 | `age_insufficient` | "Chưa đủ điều kiện về độ tuổi" |
| R16 | `address_unverifiable` | "Không thể xác minh địa chỉ thường trú" |

### 4.4 Lý do liên quan gian lận (diễn đạt chung, không tiết lộ chi tiết)

| Mã | Lý do nội bộ | Nội dung gửi khách hàng |
|------|----------------|---------------|
| R17 | `fraud_identity` | "Không thể hoàn tất xác minh thông tin cá nhân theo quy định" |
| R18 | `fraud_document` | "Không thể hoàn tất xác minh thông tin cá nhân theo quy định" |
| R19 | `fraud_velocity` | "Không thể hoàn tất xác minh thông tin cá nhân theo quy định" |

Lưu ý: R17, R18, R19 dùng cùng một nội dung thông báo, có chủ đích diễn đạt chung, để không phân biệt loại gian lận với khách hàng.

### 4.5 Quy tắc chọn lý do

1. Luôn hiển thị tối đa 3 lý do chính, sắp xếp theo mức độ ảnh hưởng của đặc trưng trong mô hình (ảnh hưởng cao nhất trước).
2. Không hiển thị điểm AI, ngưỡng, phiên bản mô hình và mã nội bộ.
3. Không hiển thị lý do làm lộ thuộc tính được bảo vệ, chẳng hạn "Bạn ở nông thôn" hoặc "Bạn quá trẻ".
4. Nếu chỉ có 1-2 lý do rõ ràng thì chỉ hiển thị 1-2 lý do, không thêm lý do yếu cho đủ số lượng.
5. Lý do liên quan gian lận luôn dùng nội dung chung của R17, không bao giờ nêu loại gian lận.

---

## 5. TEMPLATE SELECTION LOGIC

```
Quyết định = REJECTED
    │
    ├── Có fraud flag? (State 3 → REJECTED hoặc REJECTED_FRAUD)
    │   ├── Có → Template B (Fraud/Identity)
    │   └── Không ─┐
    │            │
    ├── CO override? (CO từ chối khi AI đề xuất duyệt hoặc review)
    │   ├── Có → Template C (CO Override)
    │   │         Lý do lấy từ nhóm lý do override của CO, chuyển sang ngôn ngữ dễ hiểu
    │   └── Không ─┐
    │            │
    └── Từ chối thông thường dựa trên AI
        └── Template A (Credit Score)
            Lý do lấy từ 3 yếu tố hàng đầu của mô hình AI, chuyển sang ngôn ngữ dễ hiểu
```

---

## 6. ĐỊNH DẠNG THEO KÊNH

| Kênh | Định dạng | Giới hạn ký tự | Điều chỉnh mẫu |
|------|----------|---------------|---------------|
| In-app | Mẫu đầy đủ hiển thị trong hộp thư thông báo của ứng dụng | Không giới hạn | Giữ nguyên mẫu đầy đủ |
| Email | Email HTML theo nhận diện thương hiệu của Bank X | Không giới hạn | Mẫu đầy đủ cùng logo và định dạng |
| SMS | Tin nhắn ngắn kèm liên kết | Khoảng 70 ký tự (tiếng Việt Unicode) | "Bank X: Hồ sơ thẻ tín dụng [mã] chưa đạt điều kiện. Chi tiết: [link] hoặc gọi [hotline]" |
| Thư tại chi nhánh | In khổ A4, giấy tiêu đề của Bank X, có chữ ký CO | 1 trang | Mẫu đầy đủ cùng chữ ký CO và con dấu của Bank X |

---------|--------|----------------|-------------------|
| **In-app** | Full template rendered in app notification inbox | No limit | Full template as-is |
| **Email** | HTML email with bank branding | No limit | Full template + bank logo + formatting |
| **SMS** | Short text + link | ~70 chars (Unicode Vietnamese) | "Bank X: Hồ sơ CC [mã] chưa đạt điều kiện. Chi tiết: [link] hoặc gọi [hotline]" |
| **Branch letter** | Printed A4, bank letterhead, CO signature | 1 page | Full template + CO signature + bank stamp |

---

## 7. NGUYÊN TẮC ÁP DỤNG

1. Ba mẫu thông báo được áp dụng cho mọi quyết định từ chối thẻ tín dụng của Bank X, phù hợp Luật TCTD 2024, NĐ 356/2025 và Luật AI 134/2025.
2. Mẫu B được viết chung chung có chủ đích: "không thể xác minh" bao quát mọi loại gian lận mà không tiết lộ tín hiệu nào đã kích hoạt, nhằm bảo vệ năng lực phát hiện gian lận của Bank X.
3. Mẫu C vẫn có nhãn AI vì AI là một phần của quy trình dù CO đã override; NĐ 356 và Luật AI 134/2025 yêu cầu công bố.
4. Quyền "xem xét lại bởi chuyên viên khác" trong Mẫu C đòi hỏi CO xem xét lại phải khác CO đã từ chối, nhằm tránh việc xác nhận máy móc quyết định override.
5. Tài liệu liên quan: w05-04-adverse-action-flow (thiết kế quy trình đầy đủ), w05-01-decision-architecture (trạng thái kết thúc và thời hạn lưu trữ), w02-03-pdpd-impact-bank-x (quyền dữ liệu của khách hàng).
