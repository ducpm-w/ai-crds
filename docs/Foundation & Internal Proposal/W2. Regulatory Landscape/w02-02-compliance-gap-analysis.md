# Compliance Gap Analysis — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) · **Khách hàng:** Bank X

---

## Mục đích

Tài liệu so sánh hiện trạng quy trình tín dụng tại Bank X với các yêu cầu pháp lý khi triển khai AI-CRDS, từ đó xác định khoảng cách cần xử lý trước khi vận hành.

Hiện trạng được mô tả theo mức phổ biến của các ngân hàng thương mại Việt Nam và được dùng làm giả định lập kế hoạch cho Bank X; các nội dung này sẽ được đối chiếu với dữ liệu thực của Bank X khi có.

**Ký hiệu trạng thái hiện trạng:** Đã có (đã tuân thủ) · Một phần (cần nâng cấp) · Chưa có (cần xây dựng).

---

## 1. Audit Trail và Kiểm Soát Nội Bộ (TT 13/2018)

| # | Yêu cầu | Hiện trạng | Khoảng cách | Ưu tiên | Đơn vị phụ trách | Văn bản gốc |
|---|---------|-----------|-------------|---------|-----------------|-------------|
| 1.1 | Audit trail cho mọi quyết định tín dụng (đầu vào, kết quả, người quyết định, thời điểm, lý do) | Một phần. Có log thủ công hoặc bán tự động trên Core Banking, nhưng chưa đủ chi tiết cho AI (thiếu phiên bản mô hình, giá trị đặc trưng, điểm tin cậy) | Audit trail tự động tối thiểu 20 trường: đặc trưng đầu vào, snapshot dữ liệu CIC, phiên bản mô hình, phiên bản ngưỡng, khuyến nghị của AI, điểm tin cậy, quyết định của con người, lý do override, thời điểm, mã tenant, lý do từ chối | Cao | IT, Compliance | TT 13/2018 Điều 5 |
| 1.2 | Mô hình 3 tuyến phòng thủ bao gồm hệ thống AI | Một phần. Mô hình 3 tuyến đã áp dụng nhưng chưa bao gồm hệ thống AI | Ánh xạ AI-CRDS vào tuyến 1 (vận hành), Quản lý rủi ro vào tuyến 2 (giám sát AI), Kiểm toán nội bộ vào tuyến 3; bổ sung rủi ro mô hình AI vào khung KSNB | Trung bình | Risk, Compliance | TT 13/2018 Chương II |
| 1.3 | Quản lý rủi ro mô hình (MRM) | Chưa có khung MRM riêng cho mô hình AI/ML | Khung MRM gồm: danh mục mô hình, thẩm định độc lập, giám sát mô hình, quản trị vòng đời (phê duyệt, thay đổi, ngừng sử dụng) | Trung bình | Risk | TT 13/2018 và thông tư thay thế |
| 1.4 | Tái hiện quyết định tín dụng trong quá khứ | Chưa có. Quyết định thủ công không thể tái hiện chính xác | Cùng đầu vào, phiên bản mô hình và ngưỡng phải cho ra cùng kết quả; cần snapshot dữ liệu và quản lý phiên bản mô hình, ngưỡng | Cao | IT, Product | TT 13/2018; yêu cầu kiểm toán của NHNN |

---

## 2. Bảo Vệ Dữ Liệu Cá Nhân (Luật 91/2025 và NĐ 356/2025)

| # | Yêu cầu | Hiện trạng | Khoảng cách | Ưu tiên | Đơn vị phụ trách | Văn bản gốc |
|---|---------|-----------|-------------|---------|-----------------|-------------|
| 2.1 | DPIA cho hệ thống chấm điểm AI | Nghị định 356 có hiệu lực từ 01/01/2026, Bank X đang chuyển đổi từ NĐ 13 sang khung mới | DPIA theo Mẫu 10 NĐ 356 cho AI-CRDS, nộp A05 trong 60 ngày kể từ khi bắt đầu xử lý; DPIA riêng cho phần tích hợp với hệ thống của Bank X | Cao | Compliance, Product | Luật 91/2025 Điều 20; NĐ 356 Điều 19 |
| 2.2 | Quản lý đồng ý xử lý dữ liệu cho chấm điểm tín dụng | Một phần. Có biểu mẫu đồng ý cơ bản khi mở tài khoản hoặc vay, chưa đáp ứng yêu cầu nêu rõ mục đích chấm điểm, thời gian lưu trữ, nguồn thu thập, bên chia sẻ | Đồng ý chi tiết: (1) tách riêng đồng ý cho chấm điểm tín dụng và tiếp thị; (2) nêu rõ việc xử lý tự động bởi AI; (3) lưu trữ sự đồng ý; (4) cho phép rút lại và có quy trình xử lý khi rút. Cấm đồng ý mặc định | Cao | Compliance, Product | Luật 91/2025 Điều 9; NĐ 356 Điều 5, 6, 10 |
| 2.3 | Quyền được giải thích với quyết định tự động | Chưa có, do quy trình hiện tại hoàn toàn thủ công | Theo NĐ 356 Điều 9: (1) thông báo cho chủ thể về xử lý tự động; (2) giải thích nguyên tắc hoạt động của thuật toán; (3) cho phép từ chối. Cần module giải thích (mức độ quan trọng của đặc trưng, phản thực tế) và luồng từ chối | Cao | Product, Risk | NĐ 356 Điều 9 |
| 2.4 | Nhân sự bảo vệ dữ liệu cá nhân (DPO) | Nhân sự đầu mối được bố trí theo NĐ 13 cũ, chưa có điều kiện năng lực cụ thể | DPO đáp ứng điều kiện NĐ 356: cao đẳng trở lên, tối thiểu 2 năm kinh nghiệm pháp chế, CNTT hoặc quản trị rủi ro, đã đào tạo BVDLCN. NĐ 356 cho phép thuê ngoài dịch vụ BVDLCN; cá nhân cung cấp dịch vụ có tối thiểu 3 năm kinh nghiệm | Trung bình | HR, Compliance | NĐ 356 Điều 13, 14 |
| 2.5 | Lưu trữ dữ liệu trong nước hoặc có hồ sơ chuyển dữ liệu xuyên biên giới | Một phần. Core Banking đặt tại Việt Nam. Nếu AI-CRDS dùng cloud nước ngoài phải có hồ sơ đánh giá tác động (Mẫu 09) và thông báo Bộ Công an (Mẫu 01a) | Kiến trúc dữ liệu có ba phương án: (a) cloud trong nước (Viettel Cloud, FPT Cloud), không cần hồ sơ xuyên biên giới nhưng giới hạn dịch vụ; (b) cloud nước ngoài kèm hồ sơ, linh hoạt hơn nhưng chi phí tuân thủ cao; (c) kết hợp, xử lý lõi trong nước và phân tích không chứa dữ liệu cá nhân ở nước ngoài | Cao | CTO, Compliance | Luật 91/2025 Điều 27; NĐ 356 Điều 20, 21 |
| 2.6 | Thông báo vi phạm dữ liệu cá nhân trong 72 giờ | Quy trình ứng phó sự cố hiện có chưa theo quy định của NĐ 356 | Quy trình ứng phó sự cố (phát hiện, ngăn chặn, thông báo 72 giờ, khôi phục, phân tích nguyên nhân); thông báo A05 và chủ thể dữ liệu nếu là dữ liệu nhạy cảm; mẫu thông báo theo Mẫu 08; AI-CRDS có phát hiện vi phạm và luồng thông báo tích hợp | Trung bình | IT, Compliance | Luật 91/2025 Điều 23; NĐ 356 Điều 28 |

---

## 3. Giải Thích và Thông Báo Từ Chối (Luật TCTD 2024 và NĐ 356)

| # | Yêu cầu | Hiện trạng | Khoảng cách | Ưu tiên | Đơn vị phụ trách | Văn bản gốc |
|---|---------|-----------|-------------|---------|-----------------|-------------|
| 3.1 | Thông báo lý do từ chối cấp tín dụng | Một phần. Có thông báo từ chối nhưng lý do chung chung | Mẫu thông báo có cấu trúc: (1) 3 đến 5 lý do chính dựa trên đặc trưng, không nêu chi tiết nội bộ mô hình; (2) gợi ý cải thiện nếu phù hợp; (3) quyền khiếu nại và yêu cầu con người xem xét lại; (4) lưu trong audit trail | Cao | Product, Compliance | Luật TCTD 2024; NĐ 356 Điều 9 |
| 3.2 | Tài liệu mô hình: model card, danh sách đặc trưng, chỉ số hiệu năng, giới hạn | Chưa có model card chuẩn cho mô hình chấm điểm hiện hành | Model card cho AI-CRDS gồm: mục đích và phạm vi sử dụng; mô tả dữ liệu huấn luyện; danh sách và mức độ quan trọng của đặc trưng; hiệu năng theo phân khúc; giới hạn và thiên lệch đã biết; lịch sử cập nhật | Trung bình | Risk, Product | TT 13/2018; thông tư thay thế (rủi ro mô hình) |
| 3.3 | Giám sát thiên lệch theo thuộc tính nhạy cảm (giới tính, địa bàn, nguồn thu nhập) | Chưa có giám sát thiên lệch có hệ thống | (1) Xác định thuộc tính nhạy cảm theo bối cảnh Việt Nam (giới tính, địa bàn, dân tộc); (2) chỉ số công bằng theo phân khúc; (3) kiểm toán thiên lệch định kỳ; (4) kế hoạch xử lý khi phát hiện thiên lệch. Luật AI 134/2025 coi đây là yêu cầu bắt buộc | Cao | Risk, Product | Luật AI 134/2025 Điều 4; Hiến pháp 2013 Điều 16 |

---

## 4. Giám Sát Của Con Người và Quản Trị Quyết Định (Luật TCTD 2024, Luật AI 134/2025)

| # | Yêu cầu | Hiện trạng | Khoảng cách | Ưu tiên | Đơn vị phụ trách | Văn bản gốc |
|---|---------|-----------|-------------|---------|-----------------|-------------|
| 4.1 | Con người ký quyết định tín dụng cuối cùng | Đã có. Cán bộ tín dụng ký mọi quyết định | Quy chế chính thức khi có AI: (1) AI chỉ khuyến nghị, không ra quyết định; (2) quy định ai ký, khi nào được override, ghi lý do override; (3) tự động phê duyệt hoặc từ chối vẫn có giám sát (rà soát theo lô, ngưỡng do Hội đồng rủi ro phê duyệt); (4) cây leo thang khi AI có độ tin cậy thấp | Cao | Risk, Compliance | Luật TCTD 2024 Điều 102, 103; TT 13/2018 |
| 4.2 | Quy trình khi cán bộ tín dụng không đồng ý với AI | Chưa có, do chưa áp dụng AI | (1) Chính sách override: ai được override, có cần phê duyệt thêm hay không; (2) bắt buộc ghi lý do override; (3) theo dõi tỷ lệ override, trên 60% thì hiệu chỉnh lại mô hình; (4) dữ liệu override quay lại huấn luyện mô hình | Cao | Risk, Product | Thiết kế nội bộ; TT 13/2018 |
| 4.3 | Phê duyệt ngưỡng tự động phê duyệt và từ chối | Có chính sách tín dụng nhưng chưa có khung ngưỡng cho AI | (1) Hội đồng rủi ro phê duyệt ngưỡng; (2) định kỳ rà soát hằng quý hoặc khi phát hiện lệch dữ liệu; (3) phân tích độ nhạy: ngưỡng thay đổi 10% tác động đến NPL và tỷ lệ phê duyệt; (4) ngưỡng chỉ được quyết định qua Hội đồng rủi ro | Cao | Hội đồng rủi ro | Thiết kế nội bộ; TT 13/2018 |
| 4.4 | Leo thang khi AI không chắc chắn hoặc gặp trường hợp ngoại lệ | Một phần. Có leo thang cán bộ, cấp cao, hội đồng nhưng chưa có kích hoạt từ AI | (1) Độ tin cậy dưới ngưỡng thì tự động leo thang; (2) tín hiệu bất thường hoặc gian lận thì leo thang nhanh; (3) trạng thái "cần thêm thông tin" khi thiếu dữ liệu; (4) SLA theo từng cấp leo thang | Trung bình | Risk, Product | Thiết kế nội bộ |

---

## 5. Tích Hợp CIC và eKYC (TT 45/2025 và quy chế CIC)

| # | Yêu cầu | Hiện trạng | Khoảng cách | Ưu tiên | Đơn vị phụ trách | Văn bản gốc |
|---|---------|-----------|-------------|---------|-----------------|-------------|
| 5.1 | Truy vấn dữ liệu CIC tự động trong luồng AI | Một phần. Có quyền truy cập CIC nhưng mức độ tích hợp API chưa đồng đều | (1) Truy vấn CIC tự động qua API; (2) lưu snapshot dữ liệu CIC trong audit trail tại thời điểm quyết định; (3) cơ chế thử lại và dự phòng khi CIC quá thời gian; (4) việc sử dụng dữ liệu CIC tuân thủ nội dung đồng ý (nêu rõ nguồn thu thập) | Trung bình | IT, Product | Quy chế CIC; NĐ 356 |
| 5.2 | Đối chiếu sinh trắc học khi phát hành thẻ (eKYC) | Một phần. Có eKYC, mức độ triển khai chưa đồng đều | (1) Đưa kết quả eKYC và sinh trắc học (đạt hoặc không đạt, độ tin cậy) vào luồng chấm điểm; (2) lớp phát hiện gian lận sử dụng kết quả xác minh sinh trắc học; (3) eKYC không đạt thì chuyển thẩm định thủ công, không tự động từ chối | Trung bình | IT, Product | TT 45/2025 |

---

## 6. Sandbox và Báo Cáo (NĐ 94/2025, TT 45/2025)

| # | Yêu cầu | Hiện trạng | Khoảng cách | Ưu tiên | Đơn vị phụ trách | Văn bản gốc |
|---|---------|-----------|-------------|---------|-----------------|-------------|
| 6.1 | Hồ sơ đăng ký cơ chế thử nghiệm chấm điểm tín dụng | Bank X chưa tham gia sandbox | Nếu Bank X tham gia: hồ sơ gồm kế hoạch thử nghiệm, quản lý rủi ro, nhân sự, pháp lý; AI-CRDS chuẩn bị bộ tài liệu hỗ trợ; hệ thống CNTT đặt tại Việt Nam | Thấp (cơ hội) | Product, Compliance | NĐ 94/2025 Điều 8 đến 10 |
| 6.2 | Báo cáo định kỳ khi tham gia sandbox | Chưa có, do chưa tham gia sandbox | Báo cáo tiến độ cho NHNN theo chu kỳ quy định; module báo cáo gồm chỉ số hiệu năng, nhật ký sự cố, đánh giá rủi ro; bắt đầu trong 90 ngày kể từ khi nhận Giấy chứng nhận | Thấp | Product, Compliance | NĐ 94/2025 Điều 15, 16 |
| 6.3 | Báo cáo gian lận qua SIMO | Một phần. Có báo cáo gian lận, định dạng và tần suất chưa khớp hoàn toàn với TT 45/2025 | Đầu ra phát hiện gian lận của AI-CRDS tương thích định dạng SIMO; thiết kế ánh xạ từ cảnh báo gian lận sang báo cáo SIMO | Trung bình | IT, Compliance | TT 45/2025 |

---

## 7. Basel II/III (TT 41/2016)

| # | Yêu cầu | Hiện trạng | Khoảng cách | Ưu tiên | Đơn vị phụ trách | Văn bản gốc |
|---|---------|-----------|-------------|---------|-----------------|-------------|
| 7.1 | Điểm AI ánh xạ được sang nhóm hệ số rủi ro | Một phần. Mô hình chấm điểm hiện hành đã khớp phương pháp tiêu chuẩn TT 41; định dạng điểm AI có thể khác | Đầu ra AI-CRDS ánh xạ được sang nhóm rủi ro mà Bank X dùng để tính CAR. AI-CRDS không tính CAR nhưng đầu ra phải sử dụng được | Trung bình | Risk, Product | TT 41/2016; TT 22/2023 |
| 7.2 | Tài liệu mô hình đủ cho công bố thông tin Trụ cột III | Một phần. Có công bố theo TT 41, chưa bao gồm mô hình AI | Bổ sung vào công bố: mô tả mô hình AI, chỉ số hiệu năng, tác động đến đánh giá rủi ro. Model card (mục 3.2) phục vụ mục đích này | Trung bình | Risk | TT 41/2016 Trụ cột III |

---

## 8. Tổng Hợp Theo Mức Ưu Tiên

### Ưu tiên cao: xử lý trước khi triển khai

| # | Hạng mục | Đơn vị phụ trách |
|---|---------|------------------|
| 1.1 | Audit trail tự động tối thiểu 20 trường | IT, Compliance |
| 1.4 | Khả năng tái hiện quyết định | IT, Product |
| 2.1 | DPIA theo NĐ 356 | Compliance, Product |
| 2.2 | Quản lý đồng ý chi tiết | Compliance, Product |
| 2.3 | Quyền được giải thích với quyết định tự động | Product, Risk |
| 2.5 | Kiến trúc lưu trữ dữ liệu | CTO, Compliance |
| 3.1 | Mẫu thông báo lý do từ chối | Product, Compliance |
| 3.3 | Giám sát thiên lệch | Risk, Product |
| 4.1 | Quy chế giám sát của con người | Risk, Compliance |
| 4.2 | Chính sách override | Risk, Product |
| 4.3 | Phê duyệt ngưỡng bởi Hội đồng rủi ro | Hội đồng rủi ro |

### Ưu tiên trung bình: xử lý trước giai đoạn vận hành thí điểm

| # | Hạng mục | Đơn vị phụ trách |
|---|---------|------------------|
| 1.2 | Ánh xạ AI vào mô hình 3 tuyến | Risk, Compliance |
| 1.3 | Khung quản lý rủi ro mô hình | Risk |
| 2.4 | DPO theo NĐ 356 | HR, Compliance |
| 2.6 | Luồng thông báo vi phạm dữ liệu | IT, Compliance |
| 3.2 | Model card | Risk, Product |
| 4.4 | Cây leo thang từ AI | Risk, Product |
| 5.1 | Tích hợp API CIC tự động | IT, Product |
| 5.2 | Tích hợp sinh trắc học eKYC | IT, Product |
| 6.3 | Tương thích báo cáo SIMO | IT, Compliance |
| 7.1 | Ánh xạ đầu ra AI sang hệ số rủi ro | Risk, Product |
| 7.2 | Công bố thông tin Trụ cột III cho mô hình AI | Risk |

### Ưu tiên thấp: yếu tố hỗ trợ

| # | Hạng mục | Đơn vị phụ trách |
|---|---------|------------------|
| 6.1 | Bộ tài liệu sandbox | Product, Compliance |
| 6.2 | Module báo cáo sandbox | Product, Compliance |

---

## 9. Phạm Vi Áp Dụng

1. Hiện trạng là mô tả chung cho ngân hàng thương mại Việt Nam, được dùng làm giả định lập kế hoạch cho Bank X. Mức độ khoảng cách thực tế của Bank X sẽ được cập nhật khi có dữ liệu nội bộ.
2. Nghị định 356/2025 có hiệu lực từ 01/01/2026, các ngân hàng đang trong giai đoạn chuyển đổi nên khoảng cách thực tế có thể khác ước tính.
3. Việt Nam chưa có quy định riêng về nhóm đối tượng được bảo vệ chống phân biệt đối xử như ECOA của Hoa Kỳ; Hiến pháp 2013 và Luật AI 134/2025 là cơ sở pháp lý cho yêu cầu giám sát thiên lệch.
4. Tài liệu không thay thế tư vấn pháp lý.
5. Chi tiết từng văn bản pháp lý xem tại w02-01-regulatory-mapping.
