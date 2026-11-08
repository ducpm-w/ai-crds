# PDPD Compliance Checklist — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Tài liệu tổng hợp các yêu cầu theo Luật BVDLCN 91/2025, NĐ 356/2025 và Luật AI 134/2025 áp dụng cho AI-CRDS tại Bank X, cùng cách AI-CRDS đáp ứng từng yêu cầu. Tài liệu là cơ sở cho hồ sơ đánh giá tác động xử lý dữ liệu cá nhân (DPIA) và cho cổng tuân thủ trước khi dùng dữ liệu khách hàng thực.

**Mốc thời gian:** Hồ sơ DPIA được nộp cho Bộ Công an (A05) trong vòng 60 ngày kể từ khi bắt đầu xử lý dữ liệu thực. Bank X nộp hồ sơ trước khi bắt đầu shadow testing bằng dữ liệu thực. MVP dùng dữ liệu tổng hợp nên không thuộc phạm vi nộp hồ sơ.

---

## Nhóm 1: Cơ sở pháp lý xử lý DLCN

| # | Yêu cầu | Chi tiết | Cách AI-CRDS đáp ứng |
|---|--------|---------|---------------------|
| 1.1 | Consent nêu rõ mục đích chấm điểm tín dụng bằng AI | Consent nêu: (a) mục đích, (b) loại DLCN thu thập, (c) việc sử dụng AI, (d) quyền của khách hàng | Biểu mẫu consent riêng cho AI scoring, nội dung được Legal của Bank X rà soát |
| 1.2 | Consent tách biệt với điều khoản chung | NĐ 356 yêu cầu consent xử lý DLCN riêng, không gộp vào điều khoản và điều kiện chung | Luồng consent riêng với checkbox opt-in độc lập cho AI scoring |
| 1.3 | Lưu trữ consent | Lưu timestamp, phiên bản, kênh (ứng dụng, chi nhánh, online), nội dung | Bảng `consent_records`. Lưu trong suốt quan hệ với khách hàng và 3 năm sau đó |
| 1.4 | Cơ chế rút consent | Khách hàng có quyền rút consent bất kỳ lúc nào. Khi rút, AI-CRDS dừng chấm điểm và chuyển hồ sơ sang xử lý thủ công hoàn toàn (State 2) | Luồng rút consent gắn với cơ chế opt-out AI (w08-04-exception-flow.md, EX-6) |
| 1.5 | Consent riêng cho DLCN nhạy cảm | DLCN nhạy cảm (thu nhập, nợ, tín dụng) cần consent riêng | Consent phân lớp: lớp 1 cho DLCN cơ bản, lớp 2 cho DLCN nhạy cảm phục vụ AI scoring |

---

## Nhóm 2: DPIA

| # | Yêu cầu | Chi tiết | Cách AI-CRDS đáp ứng |
|---|--------|---------|---------------------|
| 2.1 | Biểu mẫu DPIA theo Mẫu 10 NĐ 356 | Hồ sơ theo mẫu chính thức | Hồ sơ DPIA của Bank X soạn theo Mẫu 10, dựa trên khung phân tích tác động dữ liệu của AI-CRDS |
| 2.2 | Xác định toàn bộ loại DLCN | 20 trường dữ liệu đã được phân loại (PII-B, PII-S, BIO, DRV, ANON) | w10-02-data-flow-diagram.md |
| 2.3 | Đánh giá rủi ro theo từng loại DLCN | Mỗi trường dữ liệu có rủi ro và mức độ tác động | Bảng rủi ro theo 20 trường trong hồ sơ DPIA |
| 2.4 | Kế hoạch nộp hồ sơ A05 | NĐ 356 Điều 19: nộp cho Bộ Công an (A05) trong 60 ngày kể từ khi bắt đầu xử lý. Bank X nộp trước khi shadow testing bằng dữ liệu thực | Trình tự: hoàn thiện hồ sơ, Legal rà soát, DPO rà soát, phê duyệt, nộp A05 |
| 2.5 | Biện pháp bảo vệ theo từng rủi ro | Mẫu 10 yêu cầu mỗi rủi ro có biện pháp giảm thiểu và đánh giá hiệu quả | Mỗi rủi ro trong hồ sơ DPIA kèm biện pháp và đánh giá hiệu quả |

---

## Nhóm 3: Quyền của chủ thể dữ liệu

| # | Yêu cầu | Chi tiết | Cách AI-CRDS đáp ứng |
|---|--------|---------|---------------------|
| 3.1 | Quyền truy cập | Luật BVDLCN Điều 13: chủ thể có quyền truy cập DLCN của mình | Quy trình tiếp nhận yêu cầu xem dữ liệu, trả về dữ liệu Bank X đang lưu theo kênh khách hàng yêu cầu |
| 3.2 | Quyền được giải thích | NĐ 356 Điều 9 và Luật AI 134/2025: giải thích quyết định tự động | Thông báo từ chối có 3 mẫu, thư viện 19 lý do, nhãn AI và thông tin quyền (w09-04-adverse-action-template.md) |
| 3.3 | Quyền opt-out | Khách hàng chọn xử lý thủ công hoàn toàn | Luồng opt-out trước khi nộp hồ sơ và sau khi bị từ chối (w08-04-exception-flow.md EX-6, w05-04-adverse-action-flow.md) |
| 3.4 | Quyền xóa dữ liệu | Xóa khi khách hàng yêu cầu, trừ dữ liệu phải giữ theo nghĩa vụ pháp luật | Vòng đời dữ liệu 3 tầng: tầng 1 xóa theo trạng thái cuối, tầng 2 giữ 5-10 năm dưới dạng ẩn danh hóa, tầng 3 là số liệu tổng hợp ẩn danh. Quy trình xóa 7 bước |
| 3.5 | Quyền chỉnh sửa | Luật BVDLCN Điều 14. Dữ liệu CIC sai thì khách hàng khiếu nại trực tiếp CIC, dữ liệu do Bank X lưu sai thì Bank X sửa | Quy trình tiếp nhận và xử lý yêu cầu chỉnh sửa dữ liệu |
| 3.6 | Quyền chuyển dữ liệu | Luật BVDLCN Điều 16: nhận DLCN ở dạng đọc được | Chức năng xuất dữ liệu dạng JSON hoặc CSV |
| 3.7 | Quyền khiếu nại | Xử lý 5 loại khiếu nại, thông tin liên hệ có trong thông báo | w05-04-adverse-action-flow.md, w05-03-escalation-tree-v1.md |

---

## Nhóm 4: Lưu trữ dữ liệu trong nước

| # | Yêu cầu | Chi tiết | Cách AI-CRDS đáp ứng |
|---|--------|---------|---------------------|
| 4.1 | Quyết định nơi lưu trữ | Ba phương án được phân tích, chọn cloud trong nước (Viettel hoặc FPT Cloud) | AI-CRDS đặt trên cloud trong nước, không phát sinh thủ tục chuyển dữ liệu xuyên biên giới |
| 4.2 | Đánh giá chuyển dữ liệu xuyên biên giới | Chỉ áp dụng nếu dùng cloud nước ngoài (Mẫu 09 và thông báo A05) | Không áp dụng với phương án đã chọn |
| 4.3 | Nơi xử lý dữ liệu sinh trắc của eKYC | Dữ liệu sinh trắc xử lý trên máy chủ trong nước | Điều khoản lưu trữ trong nước được đưa vào hợp đồng xử lý dữ liệu (DPA) với nhà cung cấp eKYC |

---

## Nhóm 5: Bảo mật dữ liệu

| # | Yêu cầu | Chi tiết | Cách AI-CRDS đáp ứng |
|---|--------|---------|---------------------|
| 5.1 | Mã hóa khi lưu trữ | AES-256 cho cơ sở dữ liệu chứa PII | PostgreSQL với pgcrypto hoặc TDE |
| 5.2 | Mã hóa khi truyền | TLS 1.2 trở lên cho mọi cuộc gọi API | Áp dụng cho CBS, CIC, eKYC. mTLS giữa các service nội bộ |
| 5.3 | Kiểm soát truy cập (RBAC) | Phân quyền theo vai trò | Ma trận quyền theo w10-05-securty-policy-alignment.md, w09-03-override-governance.md |
| 5.4 | Thông báo vi phạm trong 72 giờ | NĐ 356 Điều 25: thông báo A05 và chủ thể dữ liệu | Quy trình phát hiện, đánh giá, thông báo, gắn với quy trình xử lý sự cố của Bank X |
| 5.5 | Che dữ liệu ở môi trường non-prod | Dev và staging không dùng PII thật | MVP dùng dữ liệu tổng hợp (w03-04-synthetic-data-plan.md). Staging dùng dữ liệu đã che. Dữ liệu thật chỉ ở production |
| 5.6 | Mã hóa sao lưu | Bản sao lưu được mã hóa, quản lý khóa tách khỏi dữ liệu | Sao lưu hằng ngày, mã hóa, kiểm tra phục hồi hằng quý |
| 5.7 | Quản lý khóa | HSM hoặc KMS cho khóa production | Khóa production trên HSM hoặc KMS, khóa dev tách riêng |

---

## Nhóm 6: Yêu cầu riêng cho AI (Luật AI 134/2025, NĐ 356 Điều 9)

| # | Yêu cầu | Chi tiết | Cách AI-CRDS đáp ứng |
|---|--------|---------|---------------------|
| 6.1 | Công bố quyết định tự động | Consent, thông báo từ chối và nhãn AI "hỗ trợ bởi AI" | w09-04-adverse-action-template.md |
| 6.2 | Giải thích thuật toán bằng ngôn ngữ dễ hiểu | Thư viện 19 lý do, tối đa 3 lý do chính cho mỗi hồ sơ bị từ chối, dựa trên SHAP | w09-04-adverse-action-template.md |
| 6.3 | Opt-out chấm điểm tự động | Cơ chế trước khi nộp hồ sơ và sau khi bị từ chối | w08-04-exception-flow.md EX-6 |
| 6.4 | Quyền được con người xem xét | Một CO khác xem xét lại, không hiển thị kết quả AI. SLA không quá 8 ngày làm việc | w05-04-adverse-action-flow.md |
| 6.5 | Nhãn AI trên mọi đầu ra có AI tham gia | Nhãn AI cố định ở đầu màn hình và trong mọi thông báo | w09-02-ux-wireframes-v1.md, w09-04-adverse-action-template.md |
| 6.6 | Giám sát thiên lệch | Guardrail G-C4, G-C5, G-C6: giới hạn chênh lệch theo giới tính 5pp, khu vực 8pp, độ tuổi 10pp | w07-04-guardrail-definitions.md, w07-01-kpi-tree.md |
| 6.7 | Phân loại rủi ro AI (Luật AI Điều 9) | AI-CRDS được xếp vào nhóm rủi ro cao. Bank X áp dụng các yêu cầu của nhóm rủi ro cao ngay từ thiết kế | w02-04-sbv-requirements.md |

---

## Nhóm 7: DPO

| # | Yêu cầu | Chi tiết | Cách AI-CRDS đáp ứng |
|---|--------|---------|---------------------|
| 7.1 | Bank X chỉ định DPO | NĐ 356 Điều 28: bên kiểm soát DLCN chỉ định DPO | DPO của Bank X là đầu mối bảo vệ dữ liệu cho AI-CRDS |
| 7.2 | Trình độ DPO | Cao đẳng trở lên, kinh nghiệm từ 2 năm, được đào tạo về BVDLCN | DPO đáp ứng điều kiện theo NĐ 356 |
| 7.3 | Thông tin liên hệ DPO | Công bố nội bộ cho các truy vấn về bảo vệ dữ liệu | Công bố trong tài liệu vận hành của AI-CRDS |
| 7.4 | DPO tham gia DPIA | DPO rà soát DPIA trước khi nộp | DPO là bước bắt buộc trong quy trình rà soát DPIA |

---

## Tổng hợp theo nhóm

| Nhóm | Số yêu cầu |
|------|-----------|
| 1. Cơ sở pháp lý | 5 |
| 2. DPIA | 5 |
| 3. Quyền chủ thể dữ liệu | 7 |
| 4. Lưu trữ trong nước | 3 |
| 5. Bảo mật | 7 |
| 6. Yêu cầu riêng cho AI | 7 |
| 7. DPO | 4 |
| Tổng | 38 |

### Trình tự DPIA

1. Soạn hồ sơ DPIA từ tài liệu này và phân tích tác động dữ liệu của AI-CRDS.
2. MVP dùng dữ liệu tổng hợp, không thuộc phạm vi nộp DPIA.
3. Hoàn thiện hồ sơ theo Mẫu 10 và Legal rà soát.
4. DPO rà soát.
5. Phê duyệt hồ sơ cuối cùng.
6. Nộp A05 (Bộ Công an) trước khi bắt đầu xử lý dữ liệu thực.
7. Bắt đầu shadow testing bằng dữ liệu thực.

---

## Tài liệu liên quan

- w10-02-data-flow-diagram.md: luồng PII
- w02-04-sbv-requirements.md: yêu cầu SBV và Luật AI
- w09-04-adverse-action-template.md: thông báo từ chối
- w08-04-exception-flow.md: luồng ngoại lệ và opt-out
