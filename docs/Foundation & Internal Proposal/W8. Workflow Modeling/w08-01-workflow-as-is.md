# As-Is Workflow — CC Origination tại Bank X
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Mô tả quy trình phát hành thẻ tín dụng (CC origination) hiện tại của Bank X trước khi có AI-CRDS. Tài liệu là baseline để so sánh với quy trình to-be tại `w08-02-workflow-to-be.md`.

Quy trình được mô tả theo mô hình phổ biến của ngân hàng thương mại Việt Nam với hồ sơ thẻ tín dụng cho khách hàng hưởng lương. Các thông số về thời gian, SLA và quy mô là giả định lập kế hoạch, sẽ được thay bằng số liệu thực của Bank X khi có.

---

## 1. LUỒNG END-TO-END — 9 BƯỚC

```
┌──────────────────────────────────────────────────────────────┐
│               AS-IS: CC ORIGINATION — BANK X                 │
│               (Trước AI, thủ công / bán thủ công)            │
│               Thời gian end-to-end ước tính: 1-7 ngày        │
└──────────────────────────────────────────────────────────────┘

 ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
 │ BƯỚC 1  │──▶│ BƯỚC 2  │──▶│ BƯỚC 3  │──▶│ BƯỚC 4  │
 │ Tiếp    │   │ eKYC    │   │ Data    │   │ CIC     │
 │ nhận    │   │ Verify  │   │ Entry & │   │ Query   │
 │ hồ sơ   │   │         │   │ Validate│   │         │
 └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
      │              │              │              │
      │         EX-A │         EX-B │         EX-C │
      │         eKYC │         Thiếu│         CIC  │
      │         fail │         hồ sơ│         down │
      │              │              │              │
      ▼              ▼              ▼              ▼
 ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
 │ BƯỚC 5  │──▶│ BƯỚC 6  │──▶│ BƯỚC 7  │──▶│ BƯỚC 8  │
 │ CO      │   │ Decision│   │ Approval│   │ Notify  │
 │ Review  │   │ & Sign  │   │ Process │   │ & Issue │
 └────┬────┘   └────┬────┘   └────┬────┘   └─────────┘
      │              │              │
      │         EX-D │         EX-E │
      │         CO   │         Hạn mức
      │         chưa chắc       > thẩm quyền
      │              │              │
      ▼              ▼              ▼
 ┌─────────┐
 │ BƯỚC 9  │
 │ Audit   │
 │ Log     │
 └─────────┘
```

---

## 2. CHI TIẾT TỪNG BƯỚC

### Bước 1 — Tiếp nhận hồ sơ

| Thuộc tính | Mô tả |
|-----------|-------|
| Kênh | Chi nhánh (walk-in), form online, mobile app, giới thiệu qua đội sales |
| Tác nhân | Nhân viên sales (chi nhánh) / khách hàng tự khai (online, app) |
| Giấy tờ thu thập | (1) CCCD/CMND bản gốc hoặc bản scan. (2) Giấy xác nhận thu nhập hoặc sao kê lương 3 tháng. (3) Hợp đồng lao động (nếu có). (4) Giấy tờ bổ sung theo quy định của Bank X: hộ khẩu, hóa đơn tiện ích. |
| Hành động hệ thống | Tạo application record trong CBS và cấp số thứ tự hồ sơ. |
| Thời gian | 10-20 phút (chi nhánh); 5-10 phút (online, khách tự khai). |
| Điểm yếu hiện tại | (1) Thiếu giấy tờ, khách phải quay lại bổ sung. (2) Định dạng không đồng nhất: trường free-text, chất lượng scan kém. (3) Nhập liệu trùng lặp: sales nhập lại từ form giấy vào CBS. (4) Không có kiểm tra tức thời, lỗi chỉ phát hiện ở các bước sau. |

### Bước 2 — Xác thực eKYC

| Thuộc tính | Mô tả |
|-----------|-------|
| Tác nhân | Hệ thống (tự động) hoặc nhân viên back-office |
| Quy trình | Chụp CCCD, OCR trích xuất dữ liệu, đối chiếu sinh trắc (face match), kiểm tra liveness |
| Nhà cung cấp | Nhà cung cấp eKYC đang tích hợp với Bank X (ví dụ VNPT, FPT.AI, VNG hoặc giải pháp in-house) |
| Tiêu chí đạt | Điểm face match vượt ngưỡng, liveness đạt, giấy tờ xác thực hợp lệ |
| Thông tư 45/2025 | Bắt buộc xác thực sinh trắc học khi phát hành thẻ tín dụng |
| Thời gian | 2-5 phút (tự động); 10-15 phút (xử lý thủ công tại chi nhánh) |
| Đầu ra | Đạt / Không đạt kèm confidence score |
| Ngoại lệ EX-A | eKYC không đạt: thử lại 1 lần. Nếu vẫn không đạt, khách đến chi nhánh xác thực thủ công; hồ sơ chuyển trạng thái tạm dừng. |
| Điểm yếu hiện tại | (1) Ảnh CCCD chất lượng kém làm OCR thất bại. (2) Độ chính xác face match thấp hơn với khách lớn tuổi. (3) CMND cũ 9 số chưa đổi sang CCCD có thể không được hỗ trợ. |

### Bước 3 — Nhập liệu và kiểm tra dữ liệu

| Thuộc tính | Mô tả |
|-----------|-------|
| Tác nhân | Nhân viên back-office / CO |
| Quy trình | Nhập và kiểm tra dữ liệu trong CBS: nhân khẩu học, thu nhập, nơi làm việc, địa chỉ. Đối chiếu giữa form đăng ký, CCCD và kết quả eKYC. |
| Hệ thống | Core Banking System (CBS) của Bank X |
| Kiểm tra | Thủ công: đủ trường bắt buộc, thu nhập > 0, tuổi từ 21, có thông tin nơi làm việc |
| Thời gian | 10-20 phút |
| Ngoại lệ EX-B | Hồ sơ thiếu giấy tờ: liên hệ khách yêu cầu bổ sung; hồ sơ tạm dừng (SLA ước tính 3-7 ngày). |
| Điểm yếu hiện tại | (1) Khoảng 70% thời gian xử lý hồ sơ tập trung ở bước này (benchmark vận hành ngân hàng của McKinsey). (2) Nhập tay gây lỗi chính tả và thiếu nhất quán. (3) Các trường free-text (địa chỉ, nơi làm việc) không được chuẩn hóa. (4) Không có xác minh thu nhập tự động; thu nhập khai báo chỉ được đối chiếu thủ công. |

### Bước 4 — Truy vấn CIC

| Thuộc tính | Mô tả |
|-----------|-------|
| Tác nhân | CO hoặc hệ thống (tự động) |
| Phương thức | (a) Host-to-Host API: tự động, thời gian thực; theo CIC 02/2026 khoảng 95% ngân hàng đã kết nối H2H. (b) Truy vấn qua web portal: thủ công, 1-5 phút. (c) Truy vấn batch cuối ngày: dữ liệu có độ trễ. |
| Dữ liệu trả về | CIC Score, lịch sử tín dụng, dư nợ, lịch sử DPD, số lần truy vấn, nhóm nợ |
| Thời gian | API: 5-30 giây; portal thủ công: 1-5 phút; batch: T+1 |
| Ngoại lệ EX-C | CIC timeout hoặc ngừng hoạt động: (a) thử lại thủ công qua portal; (b) nếu vẫn lỗi, hồ sơ tạm dừng chờ CIC phục hồi. |
| Điểm yếu hiện tại | (1) Truy vấn thủ công gây nghẽn khi khối lượng cao. (2) Batch làm dữ liệu cũ: khách có thể vay thêm giữa hai kỳ batch. (3) Kết quả CIC cần đọc và diễn giải thủ công. |

### Bước 5 — Thẩm định của Credit Officer

| Thuộc tính | Mô tả |
|-----------|-------|
| Tác nhân | Credit Officer (CO) |
| Quy trình | (1) Xem xét hồ sơ đăng ký. (2) Xem báo cáo CIC chi tiết. (3) Kiểm tra giấy tờ thu nhập (sao kê lương, HĐLĐ). (4) Áp dụng quy tắc/scorecard hiện hành: DTI, lịch sử nợ xấu, tuổi, tình trạng việc làm. (5) Đối chiếu thu nhập, lối sống và nợ hiện có. (6) Đưa ra nhận định tín dụng dựa trên kinh nghiệm. |
| Công cụ | Màn hình CBS, báo cáo CIC (in hoặc xem trên màn hình), Excel/tính tay |
| Cơ sở quyết định | Kết hợp quy tắc chính sách tín dụng và nhận định kinh nghiệm của CO |
| Thời gian | 20-45 phút mỗi hồ sơ, tùy độ phức tạp |
| Ngoại lệ EX-D | CO chưa chắc chắn: hỏi đồng nghiệp hoặc cấp trên. Chưa có quy trình leo thang chính thức. |
| Điểm yếu hiện tại | (1) Thiếu nhất quán: mỗi CO áp dụng tiêu chí khác nhau, cùng một hồ sơ có thể cho kết quả khác nhau. (2) Nghẽn năng lực: CO là nguồn lực hữu hạn, hàng đợi dồn ứ vào cao điểm. (3) Thiếu khả năng giải thích: quyết định dựa nhiều vào kinh nghiệm nên khó giải thích cho khách. (4) Mệt mỏi: 15-20 hồ sơ mỗi ngày làm chất lượng thẩm định giảm vào buổi chiều. (5) Dấu vết kiểm toán yếu: ghi chú của CO rất ít và không có cấu trúc. |

### Bước 6 — Quyết định và ký duyệt

| Thuộc tính | Mô tả |
|-----------|-------|
| Tác nhân | CO (trong thẩm quyền) / cấp trên (vượt thẩm quyền) |
| Quy trình | CO ký quyết định: phê duyệt (kèm hạn mức) hoặc từ chối (ghi lý do, thường chung chung). |
| Thẩm quyền | Hạn mức thẩm quyền của CO giả định ≤ 100 triệu VND; vượt mức chuyển cấp trên hoặc hội đồng. |
| Cập nhật hệ thống | Cập nhật CBS: trạng thái hồ sơ, quyết định, hạn mức (nếu duyệt). |
| Thông báo từ chối | Thông báo cho khách thường là thông điệp chung "không đủ điều kiện", không nêu lý do cụ thể. |
| Thời gian | 5-10 phút (quyết định và cập nhật hệ thống) |
| Ngoại lệ EX-E | Hạn mức vượt thẩm quyền CO: chuyển cấp trên hoặc hội đồng; SLA hội đồng giả định bổ sung 1-3 ngày. |

### Bước 7 — Xử lý phê duyệt nội bộ

| Thuộc tính | Mô tả |
|-----------|-------|
| Tác nhân | Hệ thống / đội vận hành |
| Quy trình (hồ sơ được duyệt) | (1) Xác nhận quyết định đã ghi nhận trong CBS. (2) Kiểm tra hạn mức so với chính sách (quy tắc hệ thống). (3) Đưa vào hàng đợi sản xuất/phát hành thẻ. (4) Tạo bộ tài liệu chào mừng và điều khoản. |
| Quy trình (hồ sơ bị từ chối) | (1) Ghi nhận kết quả từ chối. (2) Tạo thông báo chung. |
| Thời gian | Trong ngày (nếu các bước thủ công đã hoàn tất) đến 1-2 ngày (do hàng đợi). |

### Bước 8 — Thông báo và phát hành

| Thuộc tính | Mô tả |
|-----------|-------|
| Tác nhân | Hệ thống và đội vận hành |
| Hồ sơ được duyệt | (1) SMS/thông báo trên app cho khách. (2) Sản xuất thẻ: thẻ vật lý 5-7 ngày, thẻ ảo tức thì. (3) Hướng dẫn kích hoạt. |
| Hồ sơ bị từ chối | (1) SMS/thư: "Hồ sơ không đủ điều kiện." (2) Thông báo từ chối không nêu lý do cụ thể. (3) Không có thông tin về quyền của khách đối với việc tra cứu CIC. |
| Thời gian | Thông báo: trong ngày đến T+1; thẻ vật lý: 5-7 ngày làm việc |
| Điểm yếu hiện tại | (1) Thông báo từ chối chung chung khiến khách gọi hotline, làm tăng chi phí vận hành. (2) Chưa có quy trình khiếu nại đối với quyết định tín dụng. |

### Bước 9 — Ghi nhận audit log

| Thuộc tính | Mô tả |
|-----------|-------|
| Tác nhân | Hệ thống (tự động một phần) và CO (thủ công) |
| Nội dung ghi nhận | Thông thường gồm mã hồ sơ, mã khách hàng, quyết định của CO, ngày và hạn mức. Thường chưa có: lý do chi tiết, ảnh chụp dữ liệu CIC, thời gian thẩm định, thông tin override, giá trị đặc trưng tại thời điểm quyết định. |
| Định dạng | Bản ghi CBS và nhật ký thủ công (Excel) |
| Tính bất biến | Bản ghi CBS không thể sửa; nhật ký thủ công có thể chỉnh sửa. |
| Khả năng tái hiện | Hạn chế: không dựng lại được chính xác lý do CO ra quyết định, vì dữ liệu CIC thay đổi theo thời gian. |
| Thanh tra SBV | Khi SBV yêu cầu xuất toàn bộ vết của một quyết định, Bank X chỉ cung cấp được một phần. |
| Điểm yếu hiện tại | (1) Chưa sẵn sàng cho thanh tra SBV: thiếu trường dữ liệu, không tái hiện được. (2) Ghi nhận thủ công nên thiếu và không nhất quán. (3) Không có schema chuẩn nên khó tổng hợp, phân tích. |

---

## 3. TỔNG HỢP CÁC LỐI RẼ NGOẠI LỆ

| Mã | Ngoại lệ | Điều kiện kích hoạt | Cách xử lý hiện tại | SLA | Điểm yếu |
|----|---------|---------------------|---------------------|-----|---------|
| EX-A | eKYC không đạt | Face match fail, giấy tờ không đọc được, liveness fail | Thử lại 1 lần, sau đó xác thực thủ công tại chi nhánh | 1-3 ngày | Khách phải đến chi nhánh trực tiếp |
| EX-B | Hồ sơ thiếu | Thiếu chứng minh thu nhập, HĐLĐ, chứng minh địa chỉ | Liên hệ khách yêu cầu bổ sung | 3-7 ngày (phụ thuộc khách) | Tỷ lệ bỏ hồ sơ cao |
| EX-C | CIC timeout/ngừng hoạt động | CIC API lỗi, bảo trì hệ thống | Truy vấn thủ công qua portal hoặc chờ | Vài giờ đến 1 ngày | Toàn bộ hàng đợi bị chặn khi CIC ngừng |
| EX-D | CO chưa chắc chắn | Trường hợp biên, tín hiệu mâu thuẫn, câu hỏi về chính sách | Hỏi đồng nghiệp/cấp trên (không chính thức) | Chưa có SLA | Không có leo thang có cấu trúc nên chậm trễ |
| EX-E | Hạn mức vượt thẩm quyền CO | Hạn mức đề nghị vượt ngưỡng phê duyệt của CO | Chuyển cấp trên / hội đồng | 1-3 ngày | Phụ thuộc lịch họp hội đồng |

---

## 4. TIMELINE END-TO-END

### Trường hợp điển hình (không có ngoại lệ)

```
Ngày 1:   Bước 1 (tiếp nhận) + Bước 2 (eKYC) + Bước 3 (nhập liệu)
          ───────────────────────────────────────────────────────
          Tổng: 30-45 phút

Ngày 1-2: Bước 4 (truy vấn CIC)
          ─────────────────────
          API: 30 giây. Batch: T+1.

Ngày 1-3: Bước 5 (CO thẩm định) + Bước 6 (quyết định)
          ─────────────────────────────────────────
          Thời gian chờ: 0-2 ngày (tùy tải của CO)
          Thẩm định: 20-45 phút

Ngày 1-3: Bước 7 (xử lý phê duyệt)
          ─────────────────────────
          Trong ngày nếu không cần hội đồng.

Ngày 2-7: Bước 8 (thông báo + phát hành thẻ)
          ────────────────────────────────────
          Thông báo: trong ngày.
          Thẻ vật lý: 5-7 ngày làm việc.
```

| Kịch bản | Thời gian end-to-end | Điểm nghẽn |
|---------|---------------------|-----------|
| Tốt nhất (online, CIC API, CO sẵn sàng) | 1-2 ngày | Hàng đợi thẩm định CO |
| Điển hình (chi nhánh, CIC API, hàng đợi vừa phải) | 3-5 ngày | Hàng đợi thẩm định CO và sản xuất thẻ |
| Xấu nhất (thiếu giấy tờ, CIC batch, cần hội đồng) | 7-14 ngày | Thu thập giấy tờ và lịch hội đồng |

---

## 5. TỔNG HỢP ĐIỂM YẾU THEO MỨC ƯU TIÊN

| Hạng | Điểm yếu | Tác động | Bước ảnh hưởng | AI-CRDS giải quyết |
|------|---------|---------|----------------|--------------------|
| 1 | CO thiếu nhất quán: cùng hồ sơ, kết quả khác nhau | Chi phí FP và FN (xem `w06-02-cost-of-error-table.md`) | Bước 5 | Có: AI scoring chuẩn hóa mức nền |
| 2 | Thiếu khả năng giải thích: lý do từ chối chung chung | Khiếu nại của khách, rủi ro không tuân thủ NĐ 356 | Bước 6, 8 | Có: AI nêu 3 yếu tố chính |
| 3 | Nghẽn tại CO: hàng đợi dồn ứ vào cao điểm | Thời gian ra quyết định 3-7 ngày, khách rời bỏ | Bước 5 | Có: batch review tại State 1 (3-5 phút) |
| 4 | Audit trail yếu: rủi ro khi SBV thanh tra | Rủi ro tuân thủ | Bước 9 | Có: audit trail tự động 24 trường |
| 5 | Nhập liệu thủ công: lỗi và thiếu nhất quán | Chất lượng dữ liệu ảnh hưởng độ chính xác chấm điểm | Bước 3 | Một phần: tự điền từ eKYC OCR |
| 6 | Chưa có fraud scoring: eKYC chỉ cho kết quả đạt/không đạt | Tổn thất gian lận 14,4 tỷ VND/năm | Bước 2 | Có: lớp phát hiện gian lận của AI |
| 7 | Truy vấn CIC thủ công: nghẽn, dữ liệu cũ | Chậm ra quyết định | Bước 4 | Có: tích hợp API thời gian thực |

---

## 6. CHỈ SỐ HIỆN TRẠNG (ƯỚC TÍNH)

Các chỉ số dưới đây là giả định lập kế hoạch dựa trên mức trung bình ngành, sẽ được thay bằng dữ liệu thực của Bank X khi có.

| Chỉ số | Hiện trạng (ước tính) | Nguồn | Mức tin cậy |
|--------|----------------------|-------|-------------|
| Số hồ sơ mỗi tháng | ~3.000 | Giả định A1 | Thấp |
| Tỷ lệ phê duyệt | ~60% | Trung bình ngành | Thấp |
| Thời gian ra quyết định (trung vị) | 2-4 ngày | Ước tính ngành | Thấp |
| Thời gian CO thẩm định mỗi hồ sơ | 20-45 phút | Ước tính ngành | Trung bình |
| Quy mô đội CO | 10-12 FTE | Tính toán (A1 chia năng lực xử lý) | Thấp |
| Tỷ lệ nợ xấu (CC) | 3,5% | FiinRatings và số liệu ngành | Trung bình |
| Tỷ lệ gian lận (origination) | 0,8% | Visa VN Q2 2025 | Trung bình |
| Tỷ lệ thẩm định thủ công | 100% | Theo định nghĩa (chưa có AI) | Cao |
| Tuân thủ SLA | Chưa có SLA chính thức | Hiện trạng | Không áp dụng |
| Số trường audit trail | ~5-8 trường | Ước tính ngành | Thấp |

Các giả định số liệu được ghi nhận tại `w04-04-assumptions-log.md`.

---

## 7. THAM CHIẾU

- `w05-02-decision-state-spec.md`: đặc tả trạng thái quyết định, gồm phiên bản as-is giản lược.
- `w04-01-damage-model-bank-x.md`: chi phí của các sai sót hiện tại.
- `w03-03-feature-availability-matrix.md`: nguồn dữ liệu theo từng bước.
