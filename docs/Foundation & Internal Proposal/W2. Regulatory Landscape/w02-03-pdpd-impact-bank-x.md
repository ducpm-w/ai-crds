# PDPD Impact Assessment — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) · **Khách hàng:** Bank X

---

## Mục đích

Đánh giá tác động của pháp luật bảo vệ dữ liệu cá nhân đến thiết kế và vận hành AI-CRDS tại Bank X. Tài liệu là cơ sở cho các quyết định kiến trúc về dữ liệu, đồng ý, lưu trữ và quyền của chủ thể dữ liệu.

Khung pháp lý áp dụng là **Luật BVDLCN 91/2025/QH15** và **Nghị định 356/2025/NĐ-CP** (hiệu lực từ 01/01/2026), thay thế Nghị định 13/2023/NĐ-CP. Tài liệu không thay thế tư vấn pháp lý chính thức.

---

## 1. Danh Mục Dữ Liệu Cá Nhân Được Xử Lý

### 1.1 Phân loại dữ liệu theo NĐ 356/2025

AI-CRDS xử lý cả hai loại dữ liệu cá nhân: cơ bản và nhạy cảm.

#### Dữ liệu cá nhân cơ bản (Điều 3 NĐ 356)

| # | Trường dữ liệu | Mục đích trong AI-CRDS | Nguồn | Bắt buộc |
|---|---------------|----------------------|-------|----------|
| 1 | Họ tên | Định danh người nộp hồ sơ, đối chiếu CIC | Hồ sơ đăng ký | Có |
| 2 | Ngày sinh | Đặc trưng chấm điểm (rủi ro theo độ tuổi) | Hồ sơ đăng ký, eKYC | Có |
| 3 | Giới tính | Thuộc tính nhạy cảm về công bằng: chỉ dùng để giám sát thiên lệch, không dùng làm đặc trưng chấm điểm | Hồ sơ đăng ký | Chỉ cho giám sát thiên lệch |
| 4 | CCCD/CMND | Định danh, truy vấn CIC, xác minh eKYC | Hồ sơ đăng ký, eKYC | Có |
| 5 | Địa chỉ | Đặc trưng chấm điểm (rủi ro theo địa bàn) | Hồ sơ đăng ký | Có |
| 6 | Số điện thoại | Xác minh chính chủ (TT 45/2025), liên hệ | Hồ sơ đăng ký | Có |
| 7 | Email | Liên hệ, gửi thông báo từ chối | Hồ sơ đăng ký | Không |
| 8 | Nghề nghiệp, đơn vị công tác | Đặc trưng chấm điểm (ổn định việc làm) | Hồ sơ đăng ký | Có |
| 9 | Thông tin vợ/chồng | NĐ 356 bổ sung vào danh mục cơ bản; dùng cho tính tỷ lệ nợ trên thu nhập khi hồ sơ vay chung | Hồ sơ đăng ký | Tùy sản phẩm |

#### Dữ liệu cá nhân nhạy cảm (Điều 4 NĐ 356), yêu cầu bảo vệ cao nhất

| # | Trường dữ liệu | Mục đích trong AI-CRDS | Nguồn | Phân loại |
|---|---------------|----------------------|-------|-----------|
| 10 | Thu nhập, sao kê lương | Đặc trưng chấm điểm cốt lõi (khả năng trả nợ) | Bảng lương, sao kê | Dữ liệu tài chính |
| 11 | Lịch sử tín dụng CIC | Đặc trưng chấm điểm cốt lõi | API CIC | Dữ liệu tài chính |
| 12 | Điểm CIC | Đầu vào chấm điểm | API CIC | Dữ liệu tài chính |
| 13 | Dư nợ hiện tại | Tính tỷ lệ nợ trên thu nhập | API CIC, hệ thống nội bộ | Dữ liệu tài chính |
| 14 | Lịch sử giao dịch ngân hàng | Chấm điểm hành vi, xác minh thu nhập | Hệ thống nội bộ (khách hàng hiện hữu) | NĐ 356 quy định là nhạy cảm |
| 15 | Thông tin thẻ ngân hàng | Phát hiện gian lận (kiểm tra thẻ hiện có) | Hệ thống nội bộ | NĐ 356 quy định là nhạy cảm |
| 16 | Dữ liệu sinh trắc học | Xác minh eKYC (TT 45/2025 bắt buộc) | Nhà cung cấp eKYC | Sinh trắc học |
| 17 | Ảnh CCCD, khuôn mặt | Đối chiếu eKYC | Nhà cung cấp eKYC | Hình ảnh gắn với cá nhân |
| 18 | Dữ liệu vi phạm pháp luật | Kiểm tra danh sách đen gian lận | CIC, danh sách đen nội bộ | NĐ 356 mở rộng: mọi vi phạm pháp luật đều là nhạy cảm |

### 1.2 Sơ đồ luồng dữ liệu rút gọn

```
Khách hàng nộp hồ sơ (online/app)
        │
        │  [DLCN cơ bản + nhạy cảm]
        ▼
┌───────────────────┐
│ Bank Application  │  ← Thu thập: họ tên, CCCD, thu nhập, đơn vị công tác
│ System            │     Đồng ý được lấy tại đây
└───────┬───────────┘
        │
        ├──────────────────┐──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  CIC API     │  │  eKYC        │  │  Bank        │
│  query       │  │  verification│  │  Internal DB │
│              │  │              │  │              │
│ Credit hist  │  │ Biometric    │  │ Transaction  │
│ CIC score    │  │ CCCD match   │  │ history      │
│ Existing debt│  │ Liveness     │  │ Existing     │
│              │  │              │  │ products     │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └────────┬────────┘────────┬────────┘
                ▼                 │
        ┌───────────────┐        │
        │  AI-CRDS      │◄───────┘
        │  Scoring +    │
        │  Fraud Engine │
        │               │
        │ Input: 15-25  │
        │ features      │
        │               │
        │ Output:       │
        │ - Risk score  │
        │ - Fraud flag  │
        │ - Confidence  │
        │ - Explanation │
        │ - Recommend   │
        └──────┬────────┘
               │
               ▼
        ┌───────────────┐
        │ Credit Officer │  ← Quyết định của con người
        │ Review UI     │     Override nếu cần
        └──────┬────────┘
               │
               ▼
        ┌───────────────┐
        │  Audit Log    │  ← Lưu trữ: đầu vào, kết quả, quyết định,
        │  (immutable)  │     lý do override, thời điểm, phiên bản mô hình
        └───────────────┘
```

### 1.3 Tổng hợp danh mục dữ liệu

| Loại | Số trường | Ví dụ | Yêu cầu bảo vệ |
|------|----------|-------|----------------|
| DLCN cơ bản | 9 | Họ tên, CCCD, địa chỉ, số điện thoại | Tiêu chuẩn |
| DLCN nhạy cảm | 9 | Thu nhập, CIC, sinh trắc, giao dịch ngân hàng | Cao nhất: DPO, thông báo chủ thể, biện pháp bảo mật tăng cường |
| Tổng | 18 | | |

---

## 2. Cơ Sở Pháp Lý Cho Xử Lý Dữ Liệu

### 2.1 Các cơ sở pháp lý theo Luật BVDLCN 2025

Luật 91/2025 yêu cầu mọi hoạt động xử lý DLCN phải có cơ sở pháp lý. Mức áp dụng với AI-CRDS:

| Cơ sở pháp lý | Mô tả | Áp dụng cho AI-CRDS |
|--------------|-------|---------------------|
| Đồng ý | Chủ thể dữ liệu đồng ý rõ ràng, tự nguyện | Cơ sở chính |
| Thực hiện hợp đồng | Cần xử lý để thực hiện hợp đồng với chủ thể | Áp dụng khi khách đã ký hợp đồng vay hoặc mở thẻ |
| Nghĩa vụ pháp luật | Xử lý theo yêu cầu của pháp luật | Áp dụng cho truy vấn CIC theo quy định của NHNN |
| Lợi ích công cộng | Xử lý vì lợi ích công cộng quan trọng | Không áp dụng |
| Lợi ích hợp pháp | Bên kiểm soát có lợi ích hợp pháp | Pháp luật Việt Nam chưa quy định rõ như GDPR nên AI-CRDS không dựa vào cơ sở này |

### 2.2 Cơ sở pháp lý theo loại dữ liệu

| # | Dữ liệu | Cơ sở pháp lý | Lý do | Nội dung nêu rõ trong đồng ý |
|---|---------|---------------|-------|------------------------------|
| 1 | Thông tin cá nhân cơ bản (tên, CCCD, SĐT) | Đồng ý và hợp đồng | Cần để mở thẻ tín dụng | Mục đích: xét duyệt thẻ tín dụng |
| 2 | Thu nhập, đơn vị công tác | Đồng ý | Luật không bắt buộc nhưng cần cho chấm điểm | Mục đích: đánh giá khả năng trả nợ |
| 3 | Lịch sử tín dụng CIC | Đồng ý và nghĩa vụ pháp luật | NHNN yêu cầu TCTD thẩm định nên truy vấn CIC hợp pháp; NĐ 356 yêu cầu đồng ý rõ ràng cho chấm điểm tín dụng | Mục đích: tra cứu lịch sử tín dụng tại CIC để chấm điểm |
| 4 | Giao dịch ngân hàng | Đồng ý | Dữ liệu nhạy cảm, cần đồng ý riêng | Mục đích: phân tích hành vi giao dịch để đánh giá rủi ro |
| 5 | Sinh trắc học | Đồng ý và nghĩa vụ pháp luật | TT 45/2025 bắt buộc đối chiếu sinh trắc học; vẫn cần đồng ý | Mục đích: xác minh danh tính theo quy định phát hành thẻ |
| 6 | Kết quả chấm điểm của AI | Dữ liệu phái sinh | Điểm AI, nhóm rủi ro, cờ gian lận gắn với cá nhân cụ thể nên được coi là DLCN và đưa vào DPIA | Nêu rõ trong đồng ý: dữ liệu được xử lý tự động (chấm điểm bằng AI) |

### 2.3 Yêu cầu đồng ý đặc thù cho lĩnh vực ngân hàng (NĐ 356)

Khi xử lý DLCN trong lĩnh vực tài chính, ngân hàng, văn bản đồng ý nêu rõ:

1. **Các mục đích xử lý**, bao gồm chấm điểm, xếp hạng tín dụng, đánh giá thông tin tín dụng.
2. **Thời gian lưu trữ** dữ liệu cá nhân.
3. **Nguồn thu thập** dữ liệu (CIC, nhà cung cấp eKYC, hệ thống nội bộ của Bank X).
4. **Các bên thu thập, chia sẻ** dữ liệu liên quan (nhà cung cấp AI-CRDS, CIC, nhà cung cấp eKYC).

Văn bản đồng ý của AI-CRDS bao gồm đầy đủ bốn nội dung trên. Đồng ý chung chung "đồng ý xử lý dữ liệu" không đáp ứng yêu cầu.

### 2.4 Nguyên tắc thiết kế đồng ý

- Văn bản đồng ý nêu rõ bốn nội dung theo NĐ 356.
- Tách đồng ý riêng cho: (a) thẩm định tín dụng, (b) chấm điểm tự động bằng AI, (c) chia sẻ với bên thứ ba (CIC, eKYC).
- Cơ sở pháp lý cho từng loại dữ liệu theo bảng 2.2.
- Kết quả chấm điểm của AI được coi là DLCN và nằm trong phạm vi DPIA.

---

## 3. Tối Thiểu Hóa Dữ Liệu

### 3.1 Nguyên tắc

Luật 91/2025 Điều 3: dữ liệu cá nhân thu thập phải phù hợp và giới hạn trong phạm vi, mục đích cần xử lý. AI-CRDS chỉ thu thập và xử lý các trường thực sự cần cho chấm điểm và phát hiện gian lận, không thu thập dự phòng.

### 3.2 Ma trận tối thiểu hóa dữ liệu

| # | Trường dữ liệu | Cần cho chấm điểm | Cần cho phát hiện gian lận | Cần cho tuân thủ | Quyết định |
|---|---------------|-------------------|----------------------------|------------------|-----------|
| 1 | Họ tên | Không (dùng đối chiếu CIC) | Có (kiểm tra danh tính) | Có (audit trail) | Thu thập |
| 2 | CCCD | Không trực tiếp | Có (gian lận danh tính) | Có (định danh) | Thu thập |
| 3 | Ngày sinh, tuổi | Có (rủi ro theo tuổi) | Có (mẫu gian lận theo tuổi) | Không | Thu thập; mô hình dùng nhóm tuổi thay cho ngày sinh chính xác |
| 4 | Giới tính | Không | Không | Có (giám sát thiên lệch) | Thu thập chỉ để giám sát thiên lệch, không đưa vào đặc trưng của mô hình |
| 5 | Địa chỉ | Có (rủi ro địa bàn) | Có (gian lận địa chỉ) | Có (thông báo từ chối) | Thu thập; mô hình dùng cấp quận/thành phố thay cho địa chỉ đầy đủ |
| 6 | Số điện thoại | Không | Có (gian lận SIM) | Có (xác minh theo TT 45) | Thu thập |
| 7 | Thu nhập | Có (đặc trưng cốt lõi) | Có (gian lận thu nhập) | Không | Thu thập |
| 8 | Đơn vị công tác, nghề nghiệp | Có (ổn định) | Có (đơn vị giả) | Không | Thu thập |
| 9 | Điểm và lịch sử CIC | Có (đặc trưng cốt lõi) | Có (gian lận danh tính) | Có (thẩm định theo NHNN) | Thu thập |
| 10 | Giao dịch ngân hàng | Có (hành vi) | Có (gian lận giao dịch) | Không | Chỉ thu thập với khách hàng hiện hữu và có đồng ý riêng; không bắt buộc với khách hàng mới |
| 11 | Sinh trắc học | Không | Có (kiểm tra người thật) | Có (TT 45) | AI-CRDS chỉ nhận kết quả đạt/không đạt và độ tin cậy, không lưu dữ liệu sinh trắc gốc |
| 12 | Ảnh CCCD | Không | Có (gian lận giấy tờ) | Có (eKYC) | AI-CRDS không lưu ảnh, chỉ nhận kết quả xác minh eKYC |
| 13 | Tôn giáo, dân tộc | Không | Không | Không | Không thu thập, không liên quan và làm tăng rủi ro thiên lệch |
| 14 | Tình trạng hôn nhân | Có thể (tỷ lệ nợ trên thu nhập) | Không | Không | Chỉ thu thập khi cần tính thu nhập hoặc nghĩa vụ chung |
| 15 | Mạng xã hội, hành vi trực tuyến | Không | Không | Không | Không thu thập: NĐ 356 coi là dữ liệu nhạy cảm, rủi ro cao, giá trị thấp cho chấm điểm tín dụng tại Việt Nam |

### 3.3 Nguyên tắc thiết kế

1. AI-CRDS không lưu dữ liệu sinh trắc học gốc, chỉ nhận kết quả eKYC (đạt, không đạt, độ tin cậy).
2. AI-CRDS không lưu ảnh CCCD, chỉ nhận các trường đã trích xuất từ eKYC.
3. Giới tính không phải đặc trưng chấm điểm, chỉ dùng cho giám sát thiên lệch.
4. Tôn giáo và dân tộc không được thu thập.
5. Giao dịch ngân hàng chỉ dùng với khách hàng hiện hữu và có đồng ý riêng.
6. Dữ liệu được lưu trữ có thời hạn (xem mục 4.4).

---

## 4. Quyền Của Chủ Thể Dữ Liệu

### 4.1 Các quyền theo Luật 91/2025 và cách AI-CRDS đáp ứng

| # | Quyền | Mô tả | Ảnh hưởng đến AI-CRDS | Cách đáp ứng |
|---|-------|-------|----------------------|--------------|
| 1 | Quyền được biết | Biết dữ liệu được xử lý như thế nào | Thông báo minh bạch: dữ liệu nào được thu thập, AI xử lý ra sao, ai được truy cập | Văn bản đồng ý và thông báo quyền riêng tư |
| 2 | Quyền đồng ý | Xử lý phải có đồng ý rõ ràng, tự nguyện; cấm đồng ý mặc định | Đồng ý dạng chủ động (opt-in), không tích sẵn; im lặng không phải đồng ý | Giao diện đồng ý với ô chọn không tích sẵn |
| 3 | Quyền truy cập | Xem dữ liệu của mình | Khách hàng có thể yêu cầu xem dữ liệu AI-CRDS lưu về họ, điểm AI và lý do quyết định | Quy trình yêu cầu truy cập dữ liệu |
| 4 | Quyền rút lại đồng ý | Rút đồng ý bất cứ lúc nào; bên kiểm soát ngừng xử lý theo thời hạn quy định | Nếu khách rút đồng ý giữa chừng thì dừng xử lý; hồ sơ bị từ chối do thiếu dữ liệu | Luồng rút đồng ý và thông báo tác động |
| 5 | Quyền xóa dữ liệu | Yêu cầu xóa DLCN | Có xung đột với nghĩa vụ lưu audit trail của NHNN; luật cho phép giữ dữ liệu khi có nghĩa vụ pháp luật | Xóa dữ liệu gốc, giữ audit trail đã ẩn danh hóa (mục 4.4) |
| 6 | Quyền hạn chế xử lý | Hạn chế mục đích xử lý | Khách đồng ý chấm điểm nhưng không đồng ý tiếp thị thì phải tách được | Đồng ý chi tiết theo mục đích |
| 7 | Quyền phản đối xử lý tự động (NĐ 356 Điều 9) | Chọn không tham gia xử lý tự động | Khách có quyền từ chối chấm điểm bằng AI; hồ sơ được xử lý thủ công hoàn toàn | Cờ từ chối, chuyển thẩm định thủ công |
| 8 | Quyền yêu cầu con người xem xét | Với quyết định dựa hoàn toàn trên xử lý tự động | Thiết kế human-in-the-loop của AI-CRDS đáp ứng sẵn; cần thông báo rõ cho khách | Thông báo từ chối ghi: "Quý khách có quyền yêu cầu xem xét lại bởi nhân viên" |
| 9 | Quyền khiếu nại | Khiếu nại lên cơ quan chuyên trách (A05) | Quy trình xử lý khiếu nại nội bộ của Bank X trước khi lên A05 | Luồng khiếu nại và leo thang |
| 10 | Quyền yêu cầu bồi thường | Yêu cầu bồi thường thiệt hại | Quyết định từ chối sai có thể dẫn đến yêu cầu bồi thường; audit trail đầy đủ để chứng minh quyết định hợp lý | Audit trail và khả năng giải thích |

### 4.2 Mẫu thông báo từ chối cấp tín dụng

Khi AI-CRDS khuyến nghị từ chối và cán bộ tín dụng đồng ý:

```
THÔNG BÁO TỪ CHỐI CẤP TÍN DỤNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kính gửi: [Họ tên khách hàng]
Ngày: [DD/MM/YYYY]
Mã hồ sơ: [Application ID]

Bank X thông báo hồ sơ đề nghị mở thẻ tín dụng
của Quý khách không được chấp thuận.

LÝ DO CHÍNH:
1. [Lý do 1 — ví dụ: Tỷ lệ nợ trên thu nhập vượt ngưỡng cho phép]
2. [Lý do 2 — ví dụ: Thời gian công tác tại đơn vị hiện tại chưa đủ]
3. [Lý do 3 — ví dụ: Lịch sử thanh toán tại CIC có ghi nhận chậm trả]

QUYỀN CỦA QUÝ KHÁCH:
• Yêu cầu xem xét lại bởi nhân viên ngân hàng
• Yêu cầu xem thông tin tín dụng đã được sử dụng
• Yêu cầu giải thích chi tiết quy trình đánh giá
• Khiếu nại theo quy trình nội bộ của ngân hàng

LIÊN HỆ: [Hotline] | [Email]

Lưu ý: Quyết định này không ảnh hưởng đến điểm tín dụng CIC
của Quý khách và không ngăn cản Quý khách nộp hồ sơ trong
tương lai khi điều kiện thay đổi.
```

### 4.3 Các luồng nghiệp vụ hỗ trợ quyền chủ thể

- **Luồng từ chối chấm điểm bằng AI:** khách chọn không dùng AI, hồ sơ chuyển 100% thẩm định thủ công.
- **Luồng yêu cầu truy cập dữ liệu:** khách yêu cầu xem dữ liệu AI-CRDS lưu về họ.
- **Luồng rút đồng ý:** khách rút đồng ý giữa chừng, hệ thống dừng xử lý và thông báo tác động.
- **Chính sách xóa dữ liệu:** xóa dữ liệu gốc, giữ audit trail đã ẩn danh hóa (mục 4.4).
- **Mẫu thông báo từ chối:** theo mục 4.2.
- **Luồng xử lý khiếu nại:** giải quyết nội bộ, sau đó leo thang lên A05 khi cần.

### 4.4 Giải quyết xung đột giữa nghĩa vụ lưu trữ của NHNN và quyền xóa dữ liệu

#### Bản chất xung đột

| Yêu cầu | Nguồn | Nội dung |
|---------|-------|---------|
| Giữ dữ liệu | TT 13/2018 (KSNB), Luật TCTD 2024, thực tiễn của NHNN | Mọi quyết định tín dụng phải truy vết được. NHNN có thể yêu cầu xuất trình hồ sơ bất kỳ lúc nào. Hồ sơ tín dụng thường được giữ 5 đến 10 năm. Audit trail không thể sửa đổi (immutable). |
| Xóa dữ liệu | Luật BVDLCN 91/2025 Điều 15 | Chủ thể dữ liệu có quyền yêu cầu xóa DLCN; bên kiểm soát xóa trong thời hạn quy định. |
| Ngoại lệ cho phép giữ | Luật BVDLCN 91/2025 Điều 15 | Được giữ DLCN nếu cần thiết để thực hiện nghĩa vụ theo quy định của pháp luật hoặc phục vụ lợi ích công cộng trong lĩnh vực y tế, ngân hàng, tài chính. |

#### Mô hình vòng đời dữ liệu ba tầng

Dữ liệu được tách thành 3 tầng với vòng đời khác nhau.

```
Tầng 1: DỮ LIỆU CÁ NHÂN GỐC (CCCD, SĐT, địa chỉ cụ thể, ảnh, sinh trắc)
    │
    │  Thời hạn lưu: ngắn nhất có thể
    │  Xóa khi: (a) khách yêu cầu xóa, hoặc
    │            (b) hết mục đích xử lý và hết thời hạn lưu
    │  Thời hạn áp dụng: 1 năm sau quyết định
    │  (hoặc hết thời hạn hợp đồng thẻ + 1 năm)
    │
    ▼
Tầng 2: BẢN GHI AUDIT ĐÃ GIẢ DANH HÓA
    │
    │  Thay CCCD bằng mã băm (hash ID)
    │  Thay tên bằng bút danh hoặc bỏ
    │  GIỮ: điểm AI, đặc trưng đã dùng, phiên bản mô hình,
    │        phiên bản ngưỡng, khuyến nghị, quyết định của con người,
    │        lý do override, thời điểm
    │  Thời hạn lưu: 5-10 năm (theo yêu cầu kiểm toán của NHNN)
    │  Cơ sở giữ: nghĩa vụ pháp luật (TT 13 và Luật TCTD),
    │    thuộc ngoại lệ Điều 15 Luật BVDLCN
    │
    ▼
Tầng 3: DỮ LIỆU THỐNG KÊ ĐÃ ẨN DANH
    │
    │  Dữ liệu tổng hợp: tỷ lệ phê duyệt, NPL theo vintage,
    │  chỉ số hiệu năng mô hình
    │  Không gắn với cá nhân nên không phải DLCN
    │  Thời hạn lưu: không giới hạn (phục vụ cải tiến mô hình)
    │
    ▼
    Không bị ảnh hưởng bởi yêu cầu xóa dữ liệu
```

#### Quy trình khi khách yêu cầu xóa dữ liệu

| Bước | Hành động | Dữ liệu liên quan | Cơ sở pháp lý |
|------|----------|-------------------|---------------|
| 1 | Nhận yêu cầu xóa từ khách | Không | Luật BVDLCN Điều 15 |
| 2 | Xác minh danh tính người yêu cầu | Không | NĐ 356 |
| 3 | Xóa Tầng 1: CCCD, tên, SĐT, địa chỉ, ảnh, sinh trắc | DLCN gốc | Tuân thủ Luật BVDLCN |
| 4 | Giữ Tầng 2: thay DLCN bằng mã băm, giữ bản ghi quyết định AI | Bản ghi audit | Ngoại lệ nghĩa vụ pháp luật (TT 13, Luật TCTD) |
| 5 | Giữ Tầng 3: không bị ảnh hưởng | Dữ liệu tổng hợp | Không phải DLCN |
| 6 | Thông báo khách: "DLCN đã được xóa. Hồ sơ quyết định tín dụng được lưu dưới dạng ẩn danh theo yêu cầu pháp luật ngân hàng." | Không | Minh bạch |
| 7 | Ghi nhận yêu cầu xóa vào audit trail | Bản ghi xóa | KSNB |

#### Khả năng tái hiện quyết định sau khi xóa Tầng 1

Sau khi xóa dữ liệu gốc, bản ghi audit (Tầng 2) vẫn giữ:

- Đặc trưng đầu vào (khoảng thu nhập, điểm CIC, tỷ lệ nợ: là giá trị, không phải DLCN gốc).
- Phiên bản mô hình và phiên bản ngưỡng.
- Khuyến nghị và giải thích của AI.
- Quyết định của con người và lý do override.

Quyết định vẫn được tái hiện (cùng đặc trưng, cùng mô hình, cùng ngưỡng cho cùng kết quả) mà không cần dữ liệu gốc. Khi NHNN hỏi lý do phê duyệt một khoản vay, Bank X trả lời được từ Tầng 2 mà không cần biết tên hay số CCCD của khách.

#### Các điểm cần lưu ý khi áp dụng

1. Mô hình này dựa trên ngoại lệ "nghĩa vụ pháp luật" của Luật BVDLCN và thông lệ quốc tế (GDPR Điều 17(3)(b) có ngoại lệ tương tự). Bank X áp dụng thời hạn lưu Tầng 2 theo thời hạn dài nhất trong các quy định về lưu trữ hồ sơ tín dụng và chứng từ kế toán.
2. Dữ liệu giả danh hóa (mã băm) vẫn là DLCN nếu tồn tại bảng ánh xạ; việc giữ dữ liệu này dựa trên ngoại lệ nghĩa vụ pháp luật.
3. Dữ liệu ẩn danh hóa (Tầng 3) chỉ không phải DLCN khi không thể xác định lại danh tính, do đó quy trình ẩn danh hóa đạt độ mạnh tương ứng.
4. Luật AI 134/2025 yêu cầu trách nhiệm giải trình, củng cố cơ sở lưu Tầng 2.

#### Các hạng mục triển khai

- Quy trình giả danh hóa (thuật toán băm, quản lý khóa).
- Luồng xóa dữ liệu (xóa Tầng 1, giữ Tầng 2, Tầng 3 không ảnh hưởng).
- Nội dung thông báo cho khách khi xóa (nêu rõ giữ audit theo pháp luật).
- Kiểm thử: sau khi xóa Tầng 1, tái hiện quyết định từ Tầng 2.

---

## 5. Lưu Trữ Dữ Liệu Trong Nước

### 5.1 Yêu cầu pháp lý

| Yêu cầu | Nguồn | Chi tiết |
|---------|-------|---------|
| Chuyển DLCN xuyên biên giới | Luật 91/2025 Điều 27; NĐ 356 Điều 20, 21 | (1) Hồ sơ đánh giá tác động (Mẫu 09). (2) Thông báo Bộ Công an/A05 (Mẫu 01a). (3) Thỏa thuận ràng buộc pháp lý với bên nhận. (4) Bên nhận bảo vệ dữ liệu tương đương Việt Nam. |
| Hệ thống CNTT trong sandbox đặt tại Việt Nam | NĐ 94/2025 | Nếu Bank X tham gia sandbox chấm điểm tín dụng, hệ thống CNTT đặt tại Việt Nam |
| Chủ quyền dữ liệu | Thực tiễn của NHNN | NHNN truyền thống yêu cầu dữ liệu ngân hàng lưu tại Việt Nam. Chưa có quy định cấm cloud nước ngoài cho xử lý AI nhưng kỳ vọng này rõ ràng |

### 5.2 Các phương án kiến trúc

| Phương án | Mô tả | Ưu điểm | Nhược điểm | Mức tuân thủ |
|----------|-------|---------|-----------|--------------|
| A. Chỉ dùng cloud trong nước | Toàn bộ AI-CRDS triển khai trên Viettel Cloud, FPT Cloud hoặc CMC Cloud | Không cần hồ sơ xuyên biên giới; phù hợp kỳ vọng NHNN; sẵn sàng cho sandbox | Hạn chế dịch vụ (GPU, công cụ ML); chi phí có thể cao hơn | Cao nhất |
| B. Cloud nước ngoài và hồ sơ xuyên biên giới | Triển khai trên AWS/GCP/Azure tại Singapore kèm hồ sơ đầy đủ | Công cụ ML tốt nhất, mở rộng dễ | Chi phí tuân thủ cao (DPIA, hồ sơ xuyên biên giới); thời gian phê duyệt dài | Phụ thuộc phê duyệt |
| C. Kết hợp | Xử lý DLCN tại Việt Nam (chấm điểm, lưu trữ); phân tích không chứa DLCN tại cloud nước ngoài (huấn luyện trên dữ liệu ẩn danh) | Cân bằng tuân thủ và năng lực | Kiến trúc phức tạp hơn; phải bảo đảm DLCN không rời Việt Nam | Tốt nếu triển khai đúng |

### 5.3 Phương án lựa chọn

AI-CRDS áp dụng **Phương án C (kết hợp)**:

```
Cloud trong nước (Viettel/FPT/CMC):
├── Scoring engine (suy luận thời gian thực)
├── Lưu trữ DLCN (mã hóa khi lưu)
├── Audit trail (immutable)
├── Quản lý đồng ý
└── API gateway

Cloud nước ngoài (nếu cần):
├── Huấn luyện mô hình (chỉ trên dữ liệu ẩn danh hoặc dữ liệu tổng hợp)
├── Dashboard giám sát (chỉ số tổng hợp, không có DLCN)
└── Môi trường phát triển/staging (dữ liệu tổng hợp)
```

Điều kiện: DLCN không rời Việt Nam. Việc huấn luyện chỉ dùng dữ liệu đã ẩn danh hoặc dữ liệu tổng hợp. Nếu không cần cloud nước ngoài cho huấn luyện, hệ thống triển khai theo Phương án A.

### 5.4 Nhà cung cấp cloud trong nước

Thông tin dưới đây là đánh giá sơ bộ dựa trên thông tin công khai, được cập nhật khi Bank X chốt nhà cung cấp.

| Nhà cung cấp | Khối lượng ML | GPU | Tuân thủ | Ghi chú |
|-------------|--------------|-----|---------|---------|
| Viettel Cloud | Cơ bản | Có (giới hạn) | Đạt chuẩn SOC | Lớn nhất Việt Nam, hợp tác với VMware |
| FPT Cloud | Cơ bản | Có (giới hạn) | Đạt | FPT có khối AI riêng |
| CMC Cloud | Cơ bản | Theo đánh giá chi tiết | Theo đánh giá chi tiết | Quy mô nhỏ hơn |
| VNG Cloud | Mới triển khai | Theo đánh giá chi tiết | Theo đánh giá chi tiết | Mới ra mắt, chưa có tham chiếu trong ngân hàng |

Chi tiết về GPU, framework ML, SLA và giá được trình bày trong w10-01-tech-stack-bank-x.

---

## 6. DPIA — Đánh Giá Tác Động Xử Lý Dữ Liệu Cá Nhân

### 6.1 Lý do DPIA là bắt buộc

NĐ 356 Điều 19: bên kiểm soát và xử lý DLCN lập và lưu giữ hồ sơ DPIA từ thời điểm bắt đầu xử lý. AI-CRDS thuộc diện bắt buộc vì:

| Điều kiện kích hoạt | Giải thích |
|--------------------|-----------|
| Xử lý DLCN nhạy cảm | Thu nhập, CIC, giao dịch ngân hàng, sinh trắc học đều nhạy cảm theo NĐ 356 |
| Xử lý tự động | NĐ 356 Điều 9: xử lý dữ liệu lớn, phân tích hành vi, dự đoán xu hướng, phân loại người dùng |
| Quyết định có ảnh hưởng đáng kể | Chấm điểm AI ảnh hưởng trực tiếp đến khả năng tiếp cận tín dụng |
| Xử lý quy mô lớn | Hàng nghìn hồ sơ mỗi ngày ở quy mô mục tiêu |

### 6.2 Trách nhiệm và thời hạn nộp DPIA

| Mục | Yêu cầu |
|-----|---------|
| Bên lập | Bên kiểm soát DLCN (Bank X). Nhà cung cấp AI-CRDS cung cấp thông tin hỗ trợ |
| Mẫu | Mẫu số 10 ban hành kèm NĐ 356/2025 |
| Nơi nộp | Cục An ninh mạng và phòng chống tội phạm sử dụng công nghệ cao (A05), Bộ Công an |
| Thời hạn | 60 ngày kể từ ngày bắt đầu xử lý DLCN |
| Cập nhật | Khi thay đổi nội dung xử lý (thêm loại dữ liệu, thay mô hình, thêm bên thứ ba) |

### 6.3 Dàn ý nội dung DPIA cho AI-CRDS

Theo Mẫu 10 NĐ 356, điều chỉnh cho AI-CRDS:

**Phần 1 — Thông tin chung**
- Tên tổ chức: Bank X
- Tên hệ thống, hoạt động xử lý: AI-CRDS (chấm điểm origination và phát hiện gian lận)
- Thông tin liên hệ DPO
- Mục đích xử lý: hỗ trợ quyết định cấp thẻ tín dụng

**Phần 2 — Mô tả hoạt động xử lý**
- Loại DLCN được xử lý (bảng mục 1)
- Nguồn thu thập (hồ sơ đăng ký, CIC, eKYC, hệ thống nội bộ)
- Phương thức xử lý (chấm điểm tự động và con người xem xét)
- Bên thứ ba tham gia (nhà cung cấp AI-CRDS, CIC, nhà cung cấp eKYC)
- Thời gian lưu trữ
- Phạm vi chuyển DLCN (trong nước, xuyên biên giới)

**Phần 3 — Đánh giá rủi ro**
- Rủi ro cho chủ thể: từ chối nhầm (mất cơ hội tín dụng), lộ lọt dữ liệu, thiên lệch hoặc phân biệt đối xử, thiếu minh bạch
- Xác suất và mức độ nghiêm trọng của từng rủi ro
- Biện pháp giảm thiểu cho từng rủi ro

**Phần 4 — Biện pháp bảo vệ**
- Biện pháp kỹ thuật: mã hóa khi lưu và khi truyền, kiểm soát truy cập, audit log, tối thiểu hóa dữ liệu, ẩn danh hóa
- Biện pháp tổ chức: DPO, đào tạo, ứng phó sự cố, quản lý đồng ý
- Biện pháp riêng cho xử lý tự động: human-in-the-loop, khả năng giải thích, quyền từ chối, quản trị override

**Phần 5 — Kết luận**
- Rủi ro còn lại sau khi áp dụng biện pháp giảm thiểu
- Kế hoạch rà soát và cập nhật DPIA

### 6.4 Ma trận đánh giá rủi ro DPIA

| # | Rủi ro | Xác suất | Mức nghiêm trọng | Mức rủi ro | Biện pháp giảm thiểu |
|---|--------|---------|------------------|-----------|---------------------|
| 1 | AI từ chối nhầm, khách mất cơ hội tín dụng | Trung bình | Cao | Cao | Human-in-the-loop, thông báo từ chối, quyền khiếu nại, hiệu chỉnh ngưỡng |
| 2 | AI phê duyệt nhầm, phát sinh NPL và tổn thất | Trung bình | Cao | Cao | Quản trị ngưỡng, giám sát mô hình, phát hiện lệch dữ liệu, quyền override |
| 3 | Lộ lọt dữ liệu nhạy cảm | Thấp | Rất cao | Cao | Mã hóa, kiểm soát truy cập, thông báo vi phạm 72 giờ, kế hoạch ứng phó sự cố |
| 4 | Thiên lệch, phân biệt đối xử (giới tính, địa bàn) | Trung bình | Cao | Cao | Giám sát thiên lệch, thuộc tính nhạy cảm không là đặc trưng, chỉ số công bằng, kiểm toán định kỳ |
| 5 | Mô hình thiếu minh bạch, khách không hiểu lý do bị từ chối | Cao | Trung bình | Trung bình | Module giải thích, thông báo từ chối nêu 3 lý do chính, phân tích phản thực tế |
| 6 | Đồng ý không đầy đủ, vi phạm NĐ 356 | Trung bình | Cao | Cao | Đồng ý chi tiết, lưu trữ đồng ý, luồng rút đồng ý |
| 7 | Lưu dữ liệu quá lâu, vi phạm nguyên tắc tối thiểu hóa | Trung bình | Trung bình | Trung bình | Chính sách lưu trữ, xóa tự động, ẩn danh hóa sau thời hạn lưu |
| 8 | Bên thứ ba (CIC, eKYC) để lộ DLCN | Thấp | Cao | Trung bình | Đánh giá nhà cung cấp, thỏa thuận xử lý dữ liệu, giám sát |
| 9 | Lệch mô hình dẫn đến quyết định sai hệ thống | Trung bình | Cao | Cao | Giám sát lệch dữ liệu, champion-challenger, cảnh báo tự động, kế hoạch khôi phục |

### 6.5 Tài liệu kèm theo DPIA

- Mẫu DPIA riêng cho AI-CRDS theo Mẫu 10 NĐ 356 (xem w10-03-pdpd-checklist).
- Đánh giá rủi ro chi tiết cho từng rủi ro trong bảng 6.4.
- Thời hạn lưu trữ theo từng loại dữ liệu (mục 4.4).
- Mẫu thỏa thuận xử lý dữ liệu (DPA) giữa Bank X và nhà cung cấp AI-CRDS.
- Mẫu DPA cho bên thứ ba (CIC, nhà cung cấp eKYC).

---

## 7. Tổng Hợp Tác Động Đến Kiến Trúc

| Quyết định kiến trúc | Căn cứ | Thời điểm |
|---------------------|--------|----------|
| Module quản lý đồng ý | NĐ 356: đồng ý chi tiết cho ngân hàng | Trước thí điểm |
| Module giải thích kết quả | NĐ 356 Điều 9: giải thích thuật toán | Trước thí điểm |
| Luồng từ chối xử lý tự động | NĐ 356 Điều 9: quyền không tham gia xử lý tự động | Trước thí điểm |
| API truy cập và chuyển dữ liệu | Luật 91/2025: quyền truy cập | Trước thí điểm |
| Luồng rút đồng ý | NĐ 356: quyền rút đồng ý | Trước thí điểm |
| Audit trail (immutable, tối thiểu 20 trường) | TT 13/2018 và Luật BVDLCN | Trước thí điểm |
| Lưu trữ dữ liệu trong nước (cloud trong nước hoặc kết hợp) | NĐ 356 Điều 20, 21 và kỳ vọng của NHNN | Ngay từ thiết kế kiến trúc |
| Mã hóa khi lưu và khi truyền | Biện pháp bảo mật của NĐ 356 | Ngay từ ngày đầu |
| Quy trình ẩn danh hóa | Tối thiểu hóa dữ liệu và huấn luyện mô hình | Khi huấn luyện trên dữ liệu thực |
| Luồng thông báo vi phạm | NĐ 356 Điều 28: thông báo trong 72 giờ | Trước thí điểm |
| Bộ tạo thông báo từ chối | Luật TCTD và quyền được giải thích theo NĐ 356 | Trước thí điểm |
| Dashboard giám sát thiên lệch | Luật AI 134/2025 Điều 4 | Trước thí điểm |

---

## 8. Phạm Vi Áp Dụng

1. Tài liệu không thay thế tư vấn pháp lý; cơ sở pháp lý theo loại dữ liệu, thời hạn lưu trữ, mô hình ba tầng và hồ sơ DPIA nộp A05 được rà soát với tư vấn pháp lý của Bank X trước khi triển khai.
2. Nghị định 356/2025 có hiệu lực từ 01/01/2026; thực tiễn áp dụng và hướng dẫn bổ sung của A05 được cập nhật vào tài liệu khi ban hành.
3. Luật 91/2025 có khung xử phạt; mức xử phạt chi tiết theo nghị định xử phạt riêng được cập nhật khi ban hành.
4. Chi tiết các văn bản pháp lý xem w02-01-regulatory-mapping; khoảng cách tuân thủ xem w02-02-compliance-gap-analysis.
