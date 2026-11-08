# Security Policy Alignment — AI-CRDS × Bank X
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

AI-CRDS tuân thủ chính sách bảo mật của Bank X. Tài liệu mô tả thiết kế bảo mật của AI-CRDS theo các yêu cầu bảo mật tiêu chuẩn của ngân hàng. Chính sách chi tiết của Bank X trong tài liệu là giả định theo chuẩn ngành ngân hàng, được điều chỉnh theo chính sách thực tế của Bank X khi triển khai.

---

## 1. Xác thực

| Yêu cầu | Thiết kế AI-CRDS |
|--------|-----------------|
| SSO | CO đăng nhập qua SSO của Bank X (AD/LDAP, SAML hoặc OAuth2). AI-CRDS không tạo credential riêng |
| MFA | Hỗ trợ MFA khi chính sách Bank X yêu cầu, bằng OTP qua SMS hoặc ứng dụng authenticator |
| Session timeout | Theo chính sách Bank X (30 phút). Tự động đăng xuất, cảnh báo trước 5 phút |
| Chính sách mật khẩu | Dùng SSO nên mật khẩu do SSO quản lý. Nếu có đăng nhập riêng thì theo chính sách Bank X |
| Audit đăng nhập | Ghi user_id, thời điểm đăng nhập, IP, thiết bị, kết quả thành công hoặc thất bại |

---

## 2. Phân quyền (RBAC)

| Vai trò | Quyền |
|--------|------|
| CO (Junior/Mid) | Xem hồ sơ được giao. Phê duyệt hoặc từ chối trong phạm vi thẩm quyền. Override AI. Không đổi ngưỡng. Không xem quyết định của CO khác ngoài hàng đợi của mình |
| Senior CO | Toàn bộ quyền của CO cộng hồ sơ được chuyển lên. Hạn mức thẩm quyền cao hơn. Gỡ cờ gian lận. Xem override của CO khác |
| Supervisor | Toàn bộ quyền Senior CO cộng phê duyệt override. Xem chỉ số hiệu suất của CO. Điều chỉnh batch size |
| Fraud Analyst | Xử lý hồ sơ State 3. Checklist EDD. Gỡ cờ gian lận. Báo cáo SIMO. Không phê duyệt tín dụng, chỉ gỡ cờ gian lận rồi chuyển lại cho CO |
| Risk Manager | Xem toàn bộ dashboard và guardrail. Đổi ngưỡng khẩn cấp (±0.05). Tạm dừng hoặc tiếp tục AI. Không ra quyết định tín dụng cá nhân |
| Compliance | Xem audit trail, chỉ số thiên lệch, xuất báo cáo SBV, xem trạng thái tuân thủ DPIA. Chỉ đọc |
| System Admin | Cấu hình hệ thống, quản lý người dùng. Không truy cập PII và quyết định (tách biệt nhiệm vụ) |
| Data Science | Triển khai mô hình, giám sát đặc trưng, phân tích drift. Chỉ truy cập dữ liệu tổng hợp hoặc ẩn danh, không truy cập PII thô ở production |

### Nguyên tắc triển khai RBAC

| Nguyên tắc | Triển khai |
|-----------|-----------|
| Least privilege | Mỗi vai trò chỉ có quyền tối thiểu cần thiết. CO không thấy cấu hình ngưỡng, Data Science không thấy PII của từng khách hàng |
| Tách biệt nhiệm vụ | System Admin không phải người ra quyết định. Data Science khác CO. Compliance chỉ đọc |
| Maker-checker | Đổi ngưỡng: Data Science đề xuất, Risk Manager phê duyệt (w06-01-threshold-framework.md). Override sang phê duyệt khi AI đề xuất từ chối: CO và Supervisor cùng ký (w09-03-override-governance.md) |
| Ủy quyền | Khi Senior CO vắng, Supervisor ủy quyền cho CO được chỉ định. Có ghi log và giới hạn thời gian |
| Audit trail | Mọi thay đổi quyền được ghi lại: ai đổi, đổi gì, khi nào, ai phê duyệt |

---

## 3. Bảo mật mạng

| Yêu cầu | Thiết kế AI-CRDS |
|--------|-----------------|
| Vị trí hosting | Cloud trong nước (Viettel hoặc FPT) cho compute và storage. Dữ liệu ở lại Việt Nam, không phát sinh thủ tục chuyển dữ liệu xuyên biên giới |
| Phân đoạn mạng | AI-CRDS nằm ở phân đoạn mạng riêng, tách khỏi CBS. API Gateway làm trung gian |
| Firewall | Whitelist endpoint CIC, endpoint eKYC và gateway thông báo. Chặn mọi kết nối ra khác |
| VPN | AI-CRDS chỉ truy cập được qua mạng nội bộ hoặc VPN, không mở ra internet công cộng |
| TLS | TLS 1.2 trở lên cho mọi kết nối, ưu tiên TLS 1.3 |
| API Gateway | API của AI-CRDS nằm sau API Gateway của Bank X: giới hạn tốc độ, xác thực, ghi log, kết thúc TLS |

---

## 4. Bảo mật dữ liệu

| Yêu cầu | Thiết kế AI-CRDS |
|--------|-----------------|
| Mã hóa khi lưu | AES-256 cho mọi database chứa PII. PostgreSQL dùng pgcrypto hoặc TDE |
| Mã hóa khi truyền | TLS 1.2 trở lên. Giữa các service nội bộ dùng mTLS |
| Quản lý khóa | Khóa production trên HSM hoặc KMS của cloud. Khóa dev tách khỏi production. Xoay khóa hằng năm hoặc theo chính sách Bank X |
| Che dữ liệu ở non-prod | MVP dùng dữ liệu tổng hợp. Staging dùng dữ liệu thật đã che (CCCD thành hash, tên thành bí danh). Production dùng dữ liệu thật |
| Sao lưu | Audit trail sao lưu hằng ngày, mã hóa, giữ theo vòng đời dữ liệu (5-10 năm), kiểm tra phục hồi hằng quý |
| Hủy dữ liệu | Khi xóa PII tầng 1: xóa mật mã (hủy khóa mã hóa) hoặc ghi đè theo DoD 5220.22-M |
| PII trong log | Log ứng dụng không chứa PII. Dùng application_id và customer_hash_id. Không ghi CCCD, tên, thu nhập vào log ứng dụng |

---

## 5. Audit và giám sát

| Yêu cầu | Thiết kế AI-CRDS |
|--------|-----------------|
| Tích hợp SIEM | Log bảo mật của AI-CRDS chuyển vào SIEM của Bank X theo định dạng syslog, CEF hoặc JSON |
| Phát hiện xâm nhập | AI-CRDS nằm sau IDS/IPS của Bank X. Cấp ứng dụng: giới hạn tốc độ, phát hiện bất thường ở mẫu đăng nhập |
| Log bảo mật | (a) Log truy cập: ai truy cập gì, khi nào. (b) Log xác thực: đăng nhập, đăng xuất, thất bại. (c) Log phân quyền: thay đổi quyền. (d) Log truy cập dữ liệu: theo dõi truy cập PII |
| Ứng phó sự cố | Theo quy trình ứng phó sự cố của Bank X. Bổ sung: nếu hệ thống AI bị xâm phạm thì tạm dừng AI, chuyển sang xử lý thủ công, thông báo Risk Manager và IT Security |
| Kiểm thử xâm nhập | Thực hiện trước khi chạy dữ liệu thật, sau đó hằng năm |
| Quét lỗ hổng | Quét phụ thuộc (OWASP), quét container, quét mã nguồn (SAST) hằng tháng |

---

## 6. Bảo mật theo yêu cầu tuân thủ

| Yêu cầu | Nguồn | Triển khai AI-CRDS |
|--------|-------|-------------------|
| Audit trail bất biến | TT 13/2018, SBV | Database chỉ ghi thêm, không UPDATE hoặc DELETE bản ghi audit. Hash chain để phát hiện can thiệp (giai đoạn sau) |
| 24 trường audit cho mỗi quyết định | w02-04-sbv-requirements.md | Bảng PostgreSQL với từ 24 trường bắt buộc, ràng buộc NOT NULL, ghi một lần |
| Sẵn sàng cho thanh tra SBV | Luật TCTD | Xuất toàn bộ dấu vết của một quyết định trong 15 phút. Có sẵn truy vấn báo cáo SBV |
| Thông báo vi phạm trong 72 giờ | NĐ 356/2025 | Quy trình: phát hiện, đánh giá, thông báo A05 và khách hàng bị ảnh hưởng trong 72 giờ. Có mẫu thông báo soạn sẵn |
| Biện pháp bảo mật cho DPIA | NĐ 356 Mẫu 10 | Tài liệu này là nguồn cho phần bảo mật của DPIA |

---

## 7. Biện pháp theo hạng mục

| # | Hạng mục | Mức độ quan trọng | Biện pháp |
|---|---------|------------------|----------|
| 1 | Tích hợp SSO | Cao | Xây SSO adapter theo loại SSO của Bank X |
| 2 | MFA | Trung bình | Bật MFA khi chính sách Bank X yêu cầu |
| 3 | Kiến trúc mạng | Cao | Phân đoạn mạng riêng, firewall whitelist, truy cập qua VPN |
| 4 | Hạ tầng quản lý khóa | Trung bình | Dùng HSM hoặc KMS cho khóa production |
| 5 | Tích hợp SIEM | Trung bình | Chuyển log bảo mật theo định dạng SIEM yêu cầu |
| 6 | Kiểm thử xâm nhập | Trung bình | Thực hiện trước khi chạy dữ liệu thật |
| 7 | Quy trình thông báo vi phạm | Cao | Quy trình riêng cho AI-CRDS, gắn với quy trình sự cố của Bank X |
| 8 | Phương pháp hủy dữ liệu | Trung bình | Xóa mật mã hoặc ghi đè cho PII tầng 1 |

---

## Tài liệu liên quan

- w10-03-pdpd-checklist.md: nhóm 5 Bảo mật
- w10-01-tech-stack-bank-x.md: hạ tầng
- w10-02-data-flow-diagram.md: luồng PII cần bảo vệ
- w07-04-guardrail-definitions.md: guardrail hệ thống
