# API Availability Assessment — AI-CRDS × Bank X
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Tài liệu mô tả các API AI-CRDS cần từ hệ thống của Bank X và bên thứ ba, vai trò của từng API ở mỗi giai đoạn triển khai, và phương án dự phòng. Thông số kỹ thuật của từng API là giả định thiết kế, được thay bằng thông số thực tế của Bank X khi tích hợp.

---

## 1. Ma trận API

| # | API | Mục đích | Phương thức | Độ trễ | Xác thực | Định dạng | Cần cho MVP | Cần cho Production | Đơn vị phụ trách |
|---|-----|---------|------------|--------|---------|-----------|------------|-------------------|-----------------|
| 1 | CBS — Customer profile | Nhân khẩu học, dữ liệu KYC, sản phẩm hiện có | REST | Dưới 1 giây | OAuth2 hoặc API key | JSON | Không (dữ liệu tổng hợp) | Có | IT — quản trị CBS |
| 2 | CBS — Transaction history | Nhận diện lương, mẫu số dư, đặc trưng hành vi | Batch qua data warehouse | Theo lô hằng ngày | Tài khoản dịch vụ | CSV hoặc JSON | Không | Một phần (chỉ khách hàng hiện hữu) | IT — quản trị CBS |
| 3 | CBS — Write (decision) | Cập nhật trạng thái hồ sơ, đặt hạn mức thẻ, kích hoạt phát hành | REST | Dưới 1 giây | OAuth2 | JSON | Không | Có | IT — quản trị CBS |
| 4 | CIC — H2H query | Điểm tín dụng, dư nợ, DPD, số lần truy vấn | H2H | 5-30 giây | Chứng thư số | XML | Không (dữ liệu tổng hợp) | Có | IT và quan hệ CIC |
| 5 | eKYC — Verification | Danh tính, face match, liveness, tính xác thực giấy tờ | REST | 5-15 giây | API key | JSON | Không (mock) | Có | IT và nhà cung cấp eKYC |
| 6 | SIMO — Blacklist check | Danh sách đen gian lận liên ngân hàng | API | Dưới 5 giây | Theo quy định SIMO | JSON | Không | Có (TT 45) | Compliance và IT |
| 7 | SIMO — Fraud report | Báo cáo gian lận đã xác nhận | API | Không áp dụng | Theo quy định SIMO | JSON | Không | Có (TT 45) | Compliance và IT |
| 8 | SMS gateway | Thông báo cho khách hàng | REST | Dưới 5 giây | API key | JSON | Không | Có | IT |
| 9 | Push notification | Thông báo trên ứng dụng | FCM, APNs | Dưới 5 giây | Token dịch vụ | JSON | Không | Bổ trợ | IT và đội Mobile |
| 10 | Email gateway | Thông báo qua email | SMTP | Dưới 30 giây | Tài khoản dịch vụ | HTML | Không | Bổ trợ | IT |

---

## 2. Quan hệ phụ thuộc theo giai đoạn

```
MVP — Dữ liệu tổng hợp, không cần API bên ngoài
├── Audit Trail DB (xây nội bộ)
└── Các thành phần còn lại dùng mock

Shadow testing — Dữ liệu thật, cần API
├── CBS Customer profile
├── CIC H2H
├── eKYC
├── Audit Trail DB (đã xây)
└── Notification, SIMO (bổ trợ)

Production đầy đủ — Cần toàn bộ API
├── Toàn bộ API của giai đoạn shadow testing
├── CBS Write (decision)
├── SIMO (bắt buộc theo TT 45)
├── SMS, Push, Email (bắt buộc cho adverse action)
└── CBS Transaction history (bắt buộc cho đặc trưng hành vi)
```

### Đường găng tích hợp

```
Xác nhận phương thức CBS, CIC H2H, eKYC
    │
MVP (dữ liệu tổng hợp, API mock)
    │
Xây tích hợp
    ├── CBS adapter (4-8 tuần tùy năng lực API)
    ├── CIC H2H (2-4 tuần)
    ├── eKYC (2-3 tuần)
    └── Có thể xây song song
    │
Kiểm thử tích hợp
    │
Shadow testing (toàn bộ API hoạt động)
```

Phương án cơ sở của tài liệu là CBS có REST API. Nếu CBS không có API, adapter cần thêm 8-12 tuần và các mốc shadow testing, production dịch tương ứng.

---

## 3. Mẫu mô tả chi tiết API

Mẫu dưới đây áp dụng cho API CBS Customer profile. Các API còn lại mô tả theo cùng cấu trúc.

| Thuộc tính | Giá trị thiết kế |
|-----------|-----------------|
| Endpoint | `/api/v1/customer` |
| HTTP method | GET |
| Xác thực | OAuth2 |
| Định dạng request | Query params |
| Request mẫu | `GET /api/v1/customer?cccd=012345678901` |
| Định dạng response | JSON |
| Trường dữ liệu | Theo w03-03-feature-availability-matrix.md |
| Rate limit | Theo hạn mức của API Gateway |
| Mã lỗi | 400, 401, 404, 500 |
| SLA | Uptime 99.5% trở lên |
| Môi trường test | Sandbox với tài khoản test riêng |
| Tài liệu | OpenAPI/Swagger |

---

## 4. Đánh giá rủi ro API

| API | Rủi ro nếu không khả dụng | Phương án dự phòng | Xác suất |
|-----|--------------------------|-------------------|----------|
| CBS Customer profile | Không có dữ liệu đầu vào để chấm điểm | Lấy từ data warehouse (batch). Trường hợp xấu nhất: CO nhập dữ liệu thủ công | Thấp |
| CBS Transaction history | Không có đặc trưng hành vi (nhóm 4), mô hình chạy trên nhóm 1-3 | Chấp nhận được ở phiên bản 1, đặc trưng hành vi chỉ bổ trợ cho khách hàng hiện hữu | Trung bình |
| CIC H2H | Không lấy được lịch sử tín dụng | Truy vấn thủ công qua cổng CIC (chậm, không mở rộng được) | Thấp (khoảng 95% ngân hàng có H2H) |
| eKYC | Không xác minh được danh tính | Xác minh thủ công tại chi nhánh | Thấp (TT 45 yêu cầu eKYC) |
| SIMO | Không kiểm tra được danh sách đen | Dùng danh sách đen nội bộ trong giai đoạn MVP. Production bắt buộc có SIMO | Trung bình |
| Notification | Không thông báo được cho khách hàng | CO hoặc chi nhánh thông báo thủ công, chấp nhận trong ngắn hạn | Thấp |

---

## 5. Yêu cầu vận hành đối với từng API

| # | Hạng mục | Yêu cầu |
|---|---------|---------|
| 1 | Môi trường test | Có sandbox và tài khoản test cho CBS, CIC, eKYC |
| 2 | Mạng | Truy cập API qua VPN, quy tắc firewall cho phép các endpoint đã đăng ký |
| 3 | Maintenance window | Lịch ngừng dịch vụ của CBS và CIC được đưa vào thiết kế xử lý ngoại lệ (w08-04-exception-flow.md) |
| 4 | Rate limit | Hạn mức truy vấn mỗi ngày được tính vào kế hoạch năng lực |
| 5 | Tài liệu | Mỗi API có tài liệu OpenAPI hoặc tài liệu tương đương |

---

## Tài liệu liên quan

- w08-03-integration-point-map.md: thiết kế điểm tích hợp
- w10-01-tech-stack-bank-x.md: hạ tầng
- w08-04-exception-flow.md: xử lý khi API lỗi
