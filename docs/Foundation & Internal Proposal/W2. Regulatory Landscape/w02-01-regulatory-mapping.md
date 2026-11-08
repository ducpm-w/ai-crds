# Regulatory Mapping — AI Credit Risk Decision Support
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) · **Khách hàng:** Bank X

---

## Tổng Quan

Tài liệu này tổng hợp các văn bản pháp lý ảnh hưởng đến thiết kế, triển khai và vận hành AI-CRDS tại Bank X. Mỗi văn bản được đánh giá theo mức độ ảnh hưởng đến sản phẩm:

- **Cao (Blocking):** Không tuân thủ thì không thể triển khai.
- **Trung bình (Shaping):** Ảnh hưởng đến thiết kế sản phẩm nhưng không chặn triển khai.
- **Thấp (Enabling):** Tạo cơ hội hoặc khung pháp lý thuận lợi.

Tài liệu dựa trên thông tin công khai và phục vụ mục đích thiết kế sản phẩm, không thay thế tư vấn pháp lý chính thức.

---

## Bối Cảnh Pháp Lý Hiện Hành

- **Luật Trí tuệ nhân tạo 134/2025/QH15** có hiệu lực từ 01/03/2026. Đây là Luật AI đầu tiên của Việt Nam, phân loại AI theo mức độ rủi ro, quy định trách nhiệm giải trình, giám sát của con người và ghi nhãn AI. Hệ thống chấm điểm tín dụng như AI-CRDS thuộc nhóm AI rủi ro cao (Mục 1.7).
- **Nghị định 13/2023/NĐ-CP** hết hiệu lực từ 01/01/2026 và được thay thế bởi Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP. Toàn bộ tài liệu dự án sử dụng khung pháp lý mới này.

---

## 1. Bảng Ánh Xạ Văn Bản Pháp Lý

### 1.1 Thông tư 13/2018/TT-NHNN — Hệ thống kiểm soát nội bộ

| Mục | Nội dung |
|-----|---------|
| Tên | Thông tư 13/2018/TT-NHNN (sửa đổi bởi TT 40/2018) |
| Ban hành | 18/05/2018, hiệu lực 01/01/2019 |
| Cơ quan | NHNN |
| Nội dung chính | Quy định hệ thống kiểm soát nội bộ của NHTM: mô hình 3 tuyến phòng thủ, giám sát quản lý cấp cao, kiểm soát nội bộ, quản lý rủi ro, đánh giá nội bộ mức đủ vốn (ICAAP), kiểm toán nội bộ |
| Tình trạng | Đang có hiệu lực. NHNN đang hoàn thiện thông tư thay thế theo hướng Basel III |
| Mức ảnh hưởng | Cao |
| Chi tiết ảnh hưởng | (1) Hệ thống chấm điểm là một phần của quy trình tín dụng nên phải nằm trong hệ thống KSNB. (2) Audit trail bắt buộc cho mọi quyết định. (3) Theo mô hình 3 tuyến, AI-CRDS thuộc tuyến 1 (vận hành), khối Quản lý rủi ro của Bank X thuộc tuyến 2 (giám sát), Kiểm toán nội bộ thuộc tuyến 3. (4) Rủi ro mô hình được đề cập trong thông tư sửa đổi, do đó mô hình AI phải có cơ chế quản trị. |
| Yêu cầu với AI-CRDS | Audit log đầy đủ (đầu vào, phiên bản mô hình, kết quả, quyết định của con người, thời điểm). Ghi nhận mọi trường hợp override. Tài liệu mô hình (model card). Phù hợp mô hình 3 tuyến của Bank X. |
| Rủi ro nếu không tuân thủ | Bank X không thể triển khai, vì KSNB là nội dung NHNN kiểm tra định kỳ |
| Biện pháp | Thiết kế audit trail theo yêu cầu TT 13; chuẩn hóa định dạng model card; cập nhật theo thông tư thay thế khi được ban hành |

---

### 1.2 Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP

| Mục | Nội dung |
|-----|---------|
| Tên | Luật BVDLCN 91/2025/QH15 và NĐ 356/2025/NĐ-CP |
| Ban hành | Luật: 26/06/2025. Nghị định: 31/12/2025 |
| Hiệu lực | 01/01/2026 |
| Thay thế | NĐ 13/2023/NĐ-CP |
| Nội dung chính | Khung bảo vệ dữ liệu cá nhân toàn diện: 11 quyền của chủ thể dữ liệu, DPIA bắt buộc, DPO bắt buộc, siết chặt chuyển dữ liệu xuyên biên giới, thông báo vi phạm trong 72 giờ, xử phạt hành chính |
| Tình trạng | Đang có hiệu lực |
| Mức ảnh hưởng | Cao (Blocking) |
| Chi tiết ảnh hưởng | **(a) Dữ liệu nhạy cảm lĩnh vực ngân hàng:** thông tin đăng nhập, mật khẩu tài khoản, thông tin thẻ, lịch sử giao dịch đều là dữ liệu nhạy cảm, yêu cầu mức bảo vệ cao nhất. **(b) Xử lý tự động:** NĐ 356 Điều 9 quy định về xử lý dữ liệu lớn chứa DLCN; bên kiểm soát phải thông báo cho chủ thể về xử lý tự động, giải thích nguyên tắc thuật toán và cho phép chủ thể từ chối. **(c) DPIA:** Mẫu số 10, phải lập và lưu giữ từ thời điểm bắt đầu xử lý, nộp A05 trong 60 ngày. **(d) DPO:** nhân sự BVDLCN có trình độ cao đẳng trở lên, tối thiểu 2 năm kinh nghiệm pháp chế, CNTT, an ninh mạng hoặc quản trị rủi ro, đã được đào tạo chuyên sâu. **(e) Chuyển dữ liệu xuyên biên giới:** hồ sơ đánh giá tác động (Mẫu 09), thông báo Bộ Công an (Mẫu 01a), thỏa thuận ràng buộc pháp lý với bên nhận; áp dụng khi dùng cloud nước ngoài. **(f) Đồng ý:** cấm đồng ý mặc định, phải lưu trữ sự đồng ý, xử lý rút đồng ý theo thời hạn quy định. **(g) Lĩnh vực tài chính, ngân hàng:** khi xin đồng ý phải nêu rõ mục đích xử lý gồm chấm điểm hoặc xếp hạng tín dụng, thời gian lưu trữ, nguồn thu thập và các bên chia sẻ. **(h) Vi phạm:** thông báo A05 trong 72 giờ và thông báo chủ thể dữ liệu nếu là dữ liệu nhạy cảm. |
| Yêu cầu với AI-CRDS | (1) DPIA trước khi xử lý dữ liệu cá nhân. (2) Module quản lý đồng ý: lấy đồng ý rõ ràng, lưu trữ, cho phép rút lại. (3) Giải thích thuật toán cho chủ thể dữ liệu. (4) Quyền từ chối quyết định tự động. (5) Kiến trúc lưu trữ dữ liệu trong nước, hoặc hồ sơ chuyển dữ liệu xuyên biên giới nếu dùng cloud nước ngoài. (6) DPO tại Bank X. (7) Quy trình thông báo vi phạm 72 giờ. (8) Chính sách lưu trữ dữ liệu. |
| Rủi ro nếu không tuân thủ | Xử phạt hành chính theo khung của Luật 91/2025; A05 kiểm tra định kỳ và đột xuất; Bank X không thể triển khai |
| So với NĐ 13/2023 | Siết chặt hơn ở các điểm: thời hạn phản hồi chủ thể rõ ràng hơn; DPO có điều kiện năng lực cụ thể; mở rộng dữ liệu nhạy cảm; quy định về xử lý tự động; quy định riêng cho blockchain và cloud; 10 mẫu biểu chuẩn hóa |
| Biện pháp | Thiết kế luồng đồng ý cho hồ sơ tín dụng (nêu rõ mục đích chấm điểm); lập mẫu DPIA cho AI-CRDS; kiến trúc dữ liệu đặt tại Việt Nam; luồng giải thích kết quả; cơ chế từ chối chấm điểm tự động |

---

### 1.3 Nghị định 94/2025/NĐ-CP — Sandbox Fintech

| Mục | Nội dung |
|-----|---------|
| Tên | Nghị định 94/2025/NĐ-CP |
| Ban hành | 29/04/2025 |
| Hiệu lực | 01/07/2025 |
| Nội dung chính | Cơ chế thử nghiệm có kiểm soát trong lĩnh vực ngân hàng với 3 lĩnh vực: chấm điểm tín dụng, Open API, cho vay ngang hàng (P2P). Thời gian thử nghiệm tối đa 2 năm, có thể gia hạn, do NHNN giám sát |
| Tình trạng | Đang có hiệu lực |
| Mức ảnh hưởng | Thấp (Enabling, tạo cơ hội) |
| Chi tiết ảnh hưởng | **(a)** Chấm điểm tín dụng nằm trong phạm vi sandbox, trùng với use case cốt lõi của AI-CRDS (chấm điểm tại khâu origination). **(b) Đối tượng tham gia:** TCTD và công ty fintech thành lập tại Việt Nam; yêu cầu 100% vốn Việt Nam chỉ áp dụng cho P2P. **(c) Quy trình:** nộp hồ sơ cho NHNN (kế hoạch thử nghiệm, quản lý rủi ro, nhân sự, pháp lý); NHNN cấp Giấy chứng nhận tham gia; bắt đầu thử nghiệm trong 90 ngày. **(d) Sau sandbox:** kết quả là cơ sở để NHNN hoàn thiện khung pháp lý; thử nghiệm thành công được ưu tiên trong cấp phép. **(e)** Hệ thống CNTT phải đặt tại Việt Nam, đáp ứng tiêu chuẩn bảo mật, quyền riêng tư và duy trì hoạt động liên tục. |
| Yêu cầu với AI-CRDS | AI-CRDS được cung cấp cho Bank X dưới dạng giải pháp, Bank X có thể tham gia sandbox cùng AI-CRDS. Sản phẩm cần: (1) kiến trúc đáp ứng yêu cầu sandbox (CNTT tại Việt Nam, báo cáo cho NHNN); (2) bộ tài liệu quản lý rủi ro và bảo vệ dữ liệu phù hợp yêu cầu hồ sơ. |
| Biện pháp | Chuẩn bị bộ tài liệu sẵn sàng cho sandbox; bảo đảm kiến trúc triển khai được trên hạ tầng trong nước |

---

### 1.4 Thông tư 41/2016/TT-NHNN — Tỷ lệ an toàn vốn (Basel II)

| Mục | Nội dung |
|-----|---------|
| Tên | Thông tư 41/2016/TT-NHNN (sửa đổi bởi TT 22/2023) |
| Ban hành | 30/12/2016 |
| Hiệu lực | Bắt buộc toàn hệ thống từ 01/01/2020 |
| Nội dung chính | Quy định tỷ lệ an toàn vốn (CAR tối thiểu 8%) theo phương pháp tiêu chuẩn Basel II: Trụ cột I (vốn yêu cầu cho rủi ro tín dụng, hoạt động, thị trường), Trụ cột III (công bố thông tin). Hệ số rủi ro tín dụng theo đối tượng khách hàng và sản phẩm |
| Tình trạng | Đang có hiệu lực. NHNN đang soạn dự thảo sửa đổi theo hướng Basel III |
| Mức ảnh hưởng | Trung bình (Shaping) |
| Chi tiết ảnh hưởng | **(a) Hệ số rủi ro:** kết quả chấm điểm phải tương thích với cách Bank X tính hệ số rủi ro theo TT 41. **(b) Dữ liệu:** TT 41 yêu cầu hệ thống CNTT đủ năng lực quản lý dữ liệu và tính vốn, do đó luồng dữ liệu của AI-CRDS phải tương thích. **(c) Công bố thông tin:** mô hình phải giải thích được ở mức đủ cho yêu cầu công bố. **(d) TT 22/2023:** thay đổi hệ số rủi ro một số khoản phải đòi, ảnh hưởng đến cách sử dụng kết quả AI trong tính CAR. |
| Yêu cầu với AI-CRDS | (1) Điểm số ánh xạ được sang nhóm rủi ro của Bank X theo phương pháp tiêu chuẩn Basel II. (2) AI-CRDS không tính CAR nhưng kết quả đầu ra phải tương thích với quy trình tính CAR của Bank X. (3) Tài liệu mô hình đủ cho yêu cầu công bố thông tin. |
| Biện pháp | Thiết kế đầu ra tương thích với phương pháp tính hệ số rủi ro của Bank X; cập nhật theo dự thảo Basel III khi được ban hành |

---

### 1.5 Luật Các tổ chức tín dụng 32/2024/QH15

| Mục | Nội dung |
|-----|---------|
| Tên | Luật Các TCTD số 32/2024/QH15 (sửa đổi, bổ sung 06/2025) |
| Ban hành | 18/01/2024, sửa đổi 27/06/2025 |
| Hiệu lực | 01/07/2024, sửa đổi 15/10/2025 |
| Nội dung chính | Quy định về thành lập, tổ chức, hoạt động của TCTD; điều kiện cấp tín dụng; thủ tục đơn giản cho khoản vay nhỏ; can thiệp sớm TCTD yếu kém; xử lý nợ xấu. Là cơ sở pháp lý cho NĐ 94/2025 về sandbox |
| Tình trạng | Đang có hiệu lực |
| Mức ảnh hưởng | Cao |
| Chi tiết ảnh hưởng | **(a) Điều kiện cấp tín dụng:** TCTD phải có quy trình thẩm định và đánh giá rủi ro trước khi cấp tín dụng. AI-CRDS hỗ trợ quy trình này nhưng quyết định cuối cùng thuộc về TCTD. **(b) Khoản vay nhỏ:** cho phép cấp tín dụng khoản nhỏ với một số thông tin cơ bản (mục đích sử dụng vốn, khả năng tài chính), tạo cơ hội xử lý nhanh khoản nhỏ. **(c) Sandbox:** Điều 148 (Luật sửa đổi) là cơ sở pháp lý cho cơ chế sandbox. **(d) KSNB và quản trị rủi ro:** hệ thống AI phải nằm trong khung này. **(e) Xử lý nợ xấu:** quy định mới về thu giữ tài sản bảo đảm và xử lý nợ, liên quan đến phạm vi mở rộng cảnh báo sớm. |
| Yêu cầu với AI-CRDS | (1) AI-CRDS là công cụ hỗ trợ quyết định, không phải bên ra quyết định; con người luôn là người quyết định cuối cùng. (2) Đầu ra hỗ trợ quy trình thẩm định (cung cấp bằng chứng và giải thích). (3) Quy trình khác nhau cho khoản vay nhỏ (đơn giản) và khoản vay lớn (thẩm định đầy đủ). |
| Biện pháp | Ánh xạ quy trình AI-CRDS vào quy trình cấp tín dụng theo Luật TCTD; thiết kế luồng phân tầng theo quy mô khoản vay; ghi rõ trong mọi tài liệu rằng AI-CRDS là công cụ hỗ trợ quyết định |

---

### 1.6 Thông tư 45/2025/TT-NHNN — Phát hành và sử dụng thẻ

| Mục | Nội dung |
|-----|---------|
| Tên | Thông tư 45/2025/TT-NHNN |
| Ban hành | 2025 |
| Hiệu lực | 05/01/2026 |
| Nội dung chính | Quy định phát hành và sử dụng thẻ ngân hàng. Bắt buộc đối chiếu sinh trắc học khi phát hành thẻ. Ngân hàng số đăng ký qua ứng dụng không bắt buộc gặp mặt trực tiếp nhưng phải đối chiếu sinh trắc học trực tuyến và xác minh số điện thoại chính chủ. Thẻ tín dụng không được chuyển khoản vào ví điện tử. Báo cáo gian lận định kỳ qua hệ thống SIMO |
| Tình trạng | Đang có hiệu lực |
| Mức ảnh hưởng | Trung bình (Shaping) |
| Chi tiết ảnh hưởng | **(a) Sinh trắc học tại origination:** eKYC và đối chiếu sinh trắc học là bắt buộc trước khi phát hành thẻ, ảnh hưởng trực tiếp đến lớp phát hiện gian lận. **(b) Ngân hàng số:** lớp phát hiện gian lận xử lý kết quả xác minh sinh trắc học trực tuyến. **(c) Báo cáo SIMO:** kết quả phát hiện gian lận phải tương thích định dạng báo cáo SIMO. **(d)** Thẻ tín dụng không chuyển khoản vào ví điện tử, hạn chế một kênh gian lận. |
| Biện pháp | Tích hợp kết quả eKYC và sinh trắc học vào luồng chấm điểm; thiết kế đầu ra gian lận tương thích SIMO; cập nhật bộ mẫu gian lận theo quy định mới |

---

### 1.7 Luật Trí tuệ nhân tạo 134/2025/QH15

| Mục | Nội dung |
|-----|---------|
| Tên | Luật Trí tuệ nhân tạo số 134/2025/QH15 |
| Ban hành | 10/12/2025 (Quốc hội khóa XV, kỳ họp thứ 10) |
| Hiệu lực | 01/03/2026 |
| Cơ quan | Quốc hội |
| Nội dung chính | Quy định về nghiên cứu, phát triển, cung cấp, triển khai và sử dụng hệ thống AI. Phân loại AI theo 3 mức rủi ro (cao, trung bình, thấp). Nguyên tắc cốt lõi: AI phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người (Điều 4); bảo đảm công bằng, minh bạch, không phân biệt đối xử; trách nhiệm giải trình. Danh mục AI rủi ro cao do Thủ tướng ban hành |
| Tình trạng | Đang có hiệu lực. Các bộ, ngành quy định chi tiết yêu cầu an toàn và quản lý rủi ro cho AI trong lĩnh vực quản lý, trong đó NHNN sẽ ban hành quy định riêng cho AI trong ngân hàng (Mục 2.2) |
| Mức ảnh hưởng | Cao (Blocking) |
| Chi tiết ảnh hưởng | **(a) Phân loại rủi ro:** chấm điểm tín dụng ảnh hưởng trực tiếp đến khả năng tiếp cận tài chính của cá nhân nên thuộc nhóm AI rủi ro cao. Hệ thống AI rủi ro cao có nghĩa vụ nặng hơn: đánh giá tác động, ghi nhãn, giám sát, trách nhiệm bồi thường. **(b) Giám sát của con người (Điều 4):** AI phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người; con người duy trì kiểm soát và khả năng can thiệp đối với mọi quyết định của hệ thống. Do đó human-in-the-loop là yêu cầu của luật, không chỉ là thông lệ của NHNN. **(c) Công bằng và không phân biệt đối xử (Điều 4):** giám sát thiên lệch (bias) là yêu cầu pháp luật. **(d) Trách nhiệm giải trình:** khả năng giải thích kết quả là bắt buộc. **(e) Ghi nhãn AI:** đầu ra của AI-CRDS ghi rõ quyết định có sự hỗ trợ của hệ thống AI. **(f)** NHNN sẽ ban hành thông tư riêng về AI trong ngân hàng (Mục 2.2). |
| Yêu cầu với AI-CRDS | (1) Hồ sơ kỹ thuật cho AI rủi ro cao. (2) Ghi nhãn AI trên mọi đầu ra liên quan đến quyết định tín dụng. (3) Module giải thích kết quả là thành phần bắt buộc. (4) Giám sát thiên lệch là thành phần bắt buộc. (5) Giám sát của con người được ghi vào thiết kế hệ thống. (6) Phân định trách nhiệm bồi thường giữa nhà cung cấp AI-CRDS và Bank X trong hợp đồng. |
| Rủi ro nếu không tuân thủ | Chế tài xử phạt theo nghị định hướng dẫn (có thể lên tới 2% doanh thu đối với AI rủi ro cao theo định hướng của luật). Ngoài ra: Bank X không thể triển khai, chịu giám sát chặt của NHNN, tổn hại uy tín |
| Biện pháp | Chuẩn bị hồ sơ kỹ thuật theo Danh mục AI rủi ro cao; thiết kế nhãn AI trên mọi đầu ra; cập nhật phân định trách nhiệm trong hợp đồng; theo dõi nghị định hướng dẫn và thông tư NHNN |

---

## 2. Văn Bản Liên Quan Khác

### 2.1 Nghị định 13/2023/NĐ-CP — Bảo vệ dữ liệu cá nhân (đã hết hiệu lực)

| Mục | Nội dung |
|-----|---------|
| Tên | Nghị định 13/2023/NĐ-CP |
| Ban hành | 17/04/2023 |
| Hiệu lực | 01/07/2023, hết hiệu lực 01/01/2026 |
| Thay thế bởi | Luật 91/2025/QH15 và NĐ 356/2025/NĐ-CP |
| Lưu ý | Các tài liệu nội bộ cũ có thể còn viện dẫn NĐ 13. Mọi viện dẫn trong tài liệu dự án đã chuyển sang Luật 91/2025 và NĐ 356/2025 |

### 2.2 Quy định của NHNN về AI trong ngân hàng

| Mục | Nội dung |
|-----|---------|
| Tên | Thông tư NHNN về triển khai AI trong lĩnh vực ngân hàng (đang soạn thảo) |
| Cơ sở pháp lý | Luật AI 134/2025 yêu cầu các bộ, ngành ban hành quy định chi tiết về AI trong lĩnh vực quản lý. Kế hoạch triển khai Luật AI (03/2026) nêu: từ năm 2026, các bộ, ngành quy định chi tiết yêu cầu về an toàn, quản lý rủi ro và điều kiện triển khai đối với AI trong ngành, lĩnh vực quản lý |
| Nội dung dự kiến | (1) Thông báo trước cho khách hàng khi AI được dùng trong quyết định tín dụng. (2) Quyền khiếu nại của khách hàng đối với quyết định của AI. (3) Bắt buộc human-in-the-loop. (4) Có thể yêu cầu đăng ký hoặc thông báo hệ thống AI với NHNN |
| Mức ảnh hưởng | Trung bình (Shaping) |
| Cách tiếp cận | Thiết kế AI-CRDS theo các yêu cầu dự kiến ngay từ đầu (thông báo khách hàng, khiếu nại, human-in-the-loop) để đáp ứng sẵn khi thông tư được ban hành |

Trong thời gian chưa có thông tư riêng, các yêu cầu liên quan đến AI nằm trong các văn bản sau:

| Yêu cầu | Văn bản |
|---------|---------|
| Giám sát của con người | Luật AI 134/2025 Điều 4; Luật TCTD 2024 |
| Khả năng giải thích | Luật AI 134/2025; Luật BVDLCN 2025; NĐ 356/2025 |
| Không phân biệt đối xử | Luật AI 134/2025 Điều 4 |
| Sandbox | NĐ 94/2025 |
| Kiểm soát nội bộ | TT 13/2018 và thông tư thay thế |

---

## 3. Bảng Tổng Hợp Mức Ảnh Hưởng

| # | Văn bản | Mức ảnh hưởng | Tình trạng | Ảnh hưởng chính đến AI-CRDS |
|---|---------|--------------|-----------|----------------------------|
| 1 | TT 13/2018 (KSNB) | Cao | Hiệu lực, đang sửa đổi | Audit trail, mô hình 3 tuyến, quản trị mô hình |
| 2 | Luật BVDLCN 91/2025 và NĐ 356/2025 | Cao (Blocking) | Hiệu lực từ 01/01/2026 | DPIA, đồng ý, giải thích, DPO, lưu trữ dữ liệu, thông báo vi phạm 72 giờ |
| 3 | Luật AI 134/2025 | Cao (Blocking) | Hiệu lực từ 01/03/2026 | Phân loại rủi ro, giám sát của con người, ghi nhãn AI, giám sát thiên lệch, trách nhiệm giải trình và bồi thường |
| 4 | NĐ 94/2025 (Sandbox) | Thấp (Enabling) | Hiệu lực từ 01/07/2025 | Chấm điểm tín dụng thuộc phạm vi sandbox |
| 5 | TT 41/2016 (Basel II) | Trung bình | Hiệu lực, đang sửa đổi | Đầu ra tương thích phương pháp hệ số rủi ro |
| 6 | Luật TCTD 32/2024 | Cao | Hiệu lực | Human-in-the-loop, quy trình cấp tín dụng |
| 7 | TT 45/2025 (Thẻ) | Trung bình | Hiệu lực từ 05/01/2026 | Sinh trắc học tại origination, báo cáo SIMO |
| 8 | Thông tư NHNN về AI trong ngân hàng | Trung bình (Shaping) | Đang soạn thảo | Thông báo khách hàng, khiếu nại, human-in-the-loop |

---

## 4. Khoảng Cách Tuân Thủ Chính Của AI-CRDS

| # | Hạng mục | Mức ưu tiên | Hướng xử lý |
|---|---------|-------------|-------------|
| 1 | DPIA theo Mẫu 10 | Cao | Lập mẫu DPIA riêng cho AI-CRDS (xem w10-03) |
| 2 | Quản lý đồng ý | Cao | Thiết kế luồng đồng ý nêu rõ mục đích chấm điểm tín dụng (xem w09-04) |
| 3 | Lưu trữ dữ liệu trong nước | Cao | Kiến trúc đặt trên hạ tầng cloud trong nước (xem w10-01) |
| 4 | Tuân thủ Luật AI 134/2025 | Cao | Hồ sơ kỹ thuật AI rủi ro cao, ghi nhãn AI ngay từ bản MVP, giám sát thiên lệch, phân định trách nhiệm trong hợp đồng |
| 5 | Giải thích cho quyết định tự động | Trung bình | Module giải thích (mức độ quan trọng của đặc trưng, phản thực tế) theo yêu cầu NĐ 356 |
| 6 | Tài liệu sẵn sàng cho sandbox | Trung bình | Bộ tài liệu quản lý rủi ro và bảo vệ dữ liệu |
| 7 | Audit trail theo TT 13 | Trung bình | Thiết kế audit trail phù hợp, có tính đến quản lý rủi ro mô hình (xem w12-02) |

---

## 5. Nguồn Tham Khảo

| # | Nguồn | Nội dung | Thời điểm |
|---|-------|---------|-----------|
| 1 | vanban.chinhphu.vn | TT 13/2018, NĐ 13/2023, Luật TCTD 2024 toàn văn | Cổng chính thức |
| 2 | thuvienphapluat.vn | NĐ 356/2025, TT 41/2016, TT 22/2023, Luật AI 134/2025 toàn văn | Cổng chính thức |
| 3 | luatvietnam.vn | So sánh NĐ 356 và NĐ 13; Luật AI 134/2025 | 01/2026 |
| 4 | Frasers VN | Phân tích NĐ 356/2025 (tiếng Anh) | 01/2026 |
| 5 | VNBA (vnba.org.vn) | Dự thảo thay thế TT 13 (05/2025); tọa đàm NĐ 94 (06/2025) | 2025 |
| 6 | thoibaonganhang.vn | Tọa đàm NHNN về dự thảo thay thế TT 13 | 12/2025 |
| 7 | DFDL | Phân tích NĐ 94/2025 (tiếng Anh) | 09/2025 |
| 8 | Indochine Counsel | Phân tích pháp lý NĐ 94/2025 | 08/2025 |
| 9 | tapchinganhang.gov.vn | Điểm mới của Luật TCTD 2024 | 04/2024 |
| 10 | baochinhphu.vn | Luật sửa đổi TCTD 27/06/2025; Kế hoạch triển khai Luật AI | 06/2025, 03/2026 |
| 11 | PLO (plo.vn) | Thay đổi về BVDLCN từ 01/01/2026 | 01/2026 |
| 12 | BKTO (baokiemtoan.vn) | Mức áp dụng TT 41 trong hệ thống NHTM | 04/2022 |
| 13 | vietnamlawmagazine.vn | SBV siết chặt việc sử dụng AI trong ngân hàng | 2025 |
| 14 | DataGuidance | SBV tham vấn về triển khai AI trong ngân hàng | 2025 |
