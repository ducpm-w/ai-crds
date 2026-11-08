# Tech Stack Assessment — AI-CRDS × Bank X
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Tài liệu mô tả hệ thống công nghệ của Bank X mà AI-CRDS tích hợp vào, và kiến trúc kỹ thuật đề xuất cho AI-CRDS. Các thông số hệ thống của Bank X trong tài liệu là giả định thiết kế, được thay bằng thông số thực tế của Bank X khi triển khai.

---

## 1. Core Banking System (CBS)

| Thuộc tính | Giả định thiết kế |
|-----------|------------------|
| Vendor | Core banking thương mại phổ biến tại Việt Nam (Temenos T24 hoặc Oracle Flexcube) |
| API | REST API qua ESB / API Gateway của Bank X |
| ESB / API Gateway | Có. Dùng chung cho các hệ thống nội bộ |
| Tài liệu API | OpenAPI/Swagger, có môi trường sandbox |
| Data warehouse | Có. Cung cấp dữ liệu giao dịch tổng hợp dạng batch hằng ngày |
| Database | Oracle |
| Encoding | UTF-8 (bắt buộc để xử lý tiếng Việt có dấu) |
| Maintenance window | Ngoài giờ làm việc, cuối tuần |
| SLA | Uptime 99.5% trở lên |

### Phương án tích hợp CBS theo năng lực API

| Năng lực CBS | Phương án AI-CRDS | Ảnh hưởng tiến độ |
|-------------|------------------|------------------|
| REST API qua ESB | Tích hợp trực tiếp (phương án cơ sở) | Theo kế hoạch |
| Chỉ có SOAP | Xây SOAP adapter | Cộng 2 tuần |
| Chỉ truy cập database | Xây read-only adapter, kiểm soát hiệu năng | Cộng 4 tuần |
| Chỉ xuất batch | Chuyển sang kiến trúc batch, không chấm điểm real-time | Cộng 8 tuần |

Phương án cơ sở của tài liệu là REST API qua ESB.

---

## 2. Tích hợp CIC

| Thuộc tính | Giả định thiết kế |
|-----------|------------------|
| Phương thức | H2H API (kết nối trực tiếp giữa hệ thống ngân hàng và CIC) |
| Mức độ phổ biến | Khoảng 95% ngân hàng đã kết nối H2H (hội nghị CIC 02/2026) |
| Định dạng | XML |
| Thời gian phản hồi | 5-30 giây |
| Chi phí mỗi truy vấn | 5-20 nghìn VND |
| Môi trường test | CIC sandbox |
| Giới hạn truy vấn | Theo hạn mức đã đăng ký của Bank X |
| Lịch ngừng dịch vụ | Theo thông báo bảo trì của CIC |

---

## 3. Nhà cung cấp eKYC

| Thuộc tính | Giả định thiết kế |
|-----------|------------------|
| Vendor | Nhà cung cấp eKYC trong nước (VNPT, FPT.AI hoặc tương đương) |
| Loại API | REST API |
| Trường kết quả tối thiểu | pass/fail, confidence, face_match, liveness, doc_authentic |
| Liveness | Tùy cấu hình của nhà cung cấp (chủ động hoặc thụ động) |
| Kết nối CSDL quốc gia | Nhà cung cấp kết nối CSDL quốc gia về dân cư để đối chiếu CCCD |
| Tuân thủ TT 45/2025 | Nhà cung cấp đạt yêu cầu theo TT 45/2025 |
| Lưu trữ sinh trắc | Chỉ lưu tại nhà cung cấp eKYC. AI-CRDS chỉ nhận kết quả |
| Chi phí mỗi lượt xác thực | Theo hợp đồng của Bank X với nhà cung cấp |

---

## 4. Hạ tầng

| Thuộc tính | Giả định thiết kế |
|-----------|------------------|
| Hosting | Cloud trong nước (Viettel Cloud hoặc FPT Cloud) |
| GPU | Không cần. Mô hình triển khai là logistic regression và gradient boosting |
| Database | PostgreSQL |
| Container | Docker, Kubernetes khi Bank X hỗ trợ |
| CI/CD | GitLab CI hoặc Jenkins |
| Monitoring | Prometheus, Grafana, ELK |
| Môi trường | Dev, staging và production tách biệt |
| Network | Kết nối qua VPN. AI-CRDS nằm trong phân đoạn mạng riêng, API Gateway làm trung gian |
| Bảo mật | HSM hoặc KMS cho khóa production, WAF, IDS/IPS |

### Yêu cầu hạ tầng của AI-CRDS

| Thành phần | Tối thiểu (MVP) | Khuyến nghị (Production) |
|-----------|----------------|------------------------|
| Compute | 2 vCPU, 4GB RAM (scoring API) | 4 vCPU, 8GB RAM, dự phòng |
| Storage | 50GB (audit trail và model artifact) | 200GB (lưu trữ 3 năm) |
| Database | PostgreSQL 14+ | PostgreSQL 14+ có replication |
| GPU | Không cần | Không cần, trừ khi dùng deep learning |
| Network | Chiều ra tới CIC và eKYC. Chiều vào từ CBS | Tương tự, thêm load balancer |

---

## 5. Hệ thống thông báo

| Thuộc tính | Giả định thiết kế |
|-----------|------------------|
| SMS gateway | Qua nhà mạng trong nước (Viettel, VNPT hoặc FPT), API REST |
| SMS Unicode | Hỗ trợ tiếng Việt có dấu (giới hạn khoảng 70 ký tự mỗi SMS) |
| Push notification | Qua ứng dụng ngân hàng, dùng FCM và APNs |
| Email | Gateway SMTP nội bộ, hỗ trợ mẫu HTML |

---

## 6. SIMO (TT 45/2025)

| Thuộc tính | Giả định thiết kế |
|-----------|------------------|
| Trạng thái tích hợp | Bank X đã tích hợp SIMO |
| Phương thức | API thời gian thực hoặc tải batch qua NAPAS |
| Truy vấn | Theo từng hồ sơ |
| Báo cáo | Gửi báo cáo gian lận theo quy trình của SIMO |

---

## 7. Tech stack AI-CRDS

| Thành phần | Công nghệ | Lý do |
|-----------|----------|-------|
| Ngôn ngữ | Python 3.11+ | Hệ sinh thái ML (scikit-learn, XGBoost, SHAP), phổ biến trong ngành |
| ML framework | scikit-learn (MVP), XGBoost/LightGBM (phiên bản 2) | Logistic regression cho MVP, gradient boosting cho phiên bản 2 |
| Explainability | SHAP | Độc lập với loại mô hình, tạo đóng góp của top-N đặc trưng cho mỗi quyết định |
| API framework | FastAPI | Bất đồng bộ, hiệu năng cao, tự sinh tài liệu OpenAPI |
| Database | PostgreSQL 14+ | Audit trail (chỉ ghi thêm), dữ liệu hồ sơ, metadata mô hình |
| Feature store | Bảng PostgreSQL (MVP), Feast hoặc Tecton (sau này) | MVP chưa cần feature store riêng |
| Model serving | FastAPI endpoint (MVP), MLflow hoặc Seldon (sau này) | Đơn giản cho MVP, bổ sung công cụ MLOps khi lên production |
| Monitoring | Prometheus và Grafana (metrics), ELK (logs) | Bộ observability tiêu chuẩn, thống nhất với công cụ hiện có của Bank X |
| Frontend | React / Next.js (giao diện review của CO) | Hiện đại, responsive |
| Deployment | Docker container, Kubernetes khi Bank X hỗ trợ | Đóng gói container để dễ di chuyển |

### Nguyên tắc thống nhất với hệ thống Bank X

| # | Nguyên tắc | Lý do |
|---|-----------|-------|
| 1 | Dùng công nghệ phổ biến, dễ bảo trì bởi đội IT Bank X | Giảm chi phí vận hành dài hạn |
| 2 | Dựng riêng hạ tầng ML cho AI-CRDS, tách khỏi hệ thống lõi | Không ảnh hưởng CBS |
| 3 | Giao diện CO Review UI dùng React, tương thích chuẩn giao diện nội bộ | Trải nghiệm thống nhất cho CO |
| 4 | Quy trình DevOps theo CI/CD và container | Triển khai lặp lại được |
| 5 | Kiểm thử xâm nhập (pen test) trước khi chạy dữ liệu thực | Tuân thủ chính sách bảo mật của Bank X |

---

## 8. Phạm vi tích hợp theo mức độ ưu tiên

| # | Hạng mục | Mức ưu tiên |
|---|---------|-------------|
| 1 | CBS và API | Bắt buộc |
| 2 | CIC H2H | Bắt buộc |
| 3 | eKYC và tài liệu API | Cao |
| 4 | Hạ tầng: hosting, database, container | Cao |
| 5 | SIMO | Cao |
| 6 | Hệ thống thông báo | Trung bình |
| 7 | Chính sách bảo mật: VPN, firewall, pen test | Cao |
| 8 | Môi trường phát triển | Bắt buộc |
| 9 | Tương thích tech stack AI-CRDS | Cao |

---

## Tài liệu liên quan

- w10-04-api-availability-assessment.md: trạng thái từng API
- w08-03-integration-point-map.md: thiết kế điểm tích hợp
