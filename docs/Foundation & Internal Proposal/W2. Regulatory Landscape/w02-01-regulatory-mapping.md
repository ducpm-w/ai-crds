# Regulatory Mapping — AI Credit Risk Decision Support
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Tổng Quan

Tài liệu này map toàn bộ văn bản pháp lý ảnh hưởng đến thiết kế, triển khai và vận hành AI-CRDS tại ngân hàng Việt Nam. Mỗi văn bản được đánh giá theo mức độ ảnh hưởng đến product:

- 🔴 **Cao — Blocking:** Không comply = không deploy được
- 🟡 **Trung bình — Shaping:** Ảnh hưởng đến thiết kế product nhưng không block
- 🟢 **Thấp — Enabling:** Tạo cơ hội hoặc framework thuận lợi

---

## ⚠️ CẬP NHẬT QUAN TRỌNG

**[v1.1] Luật Trí tuệ nhân tạo 134/2025/QH15 đã có hiệu lực từ 01/03/2026.** Đây là Luật AI đầu tiên của VN — phân loại AI theo rủi ro, bắt buộc trách nhiệm giải trình, human oversight, ghi nhãn AI. AI-CRDS scoring tín dụng gần chắc chắn nằm trong danh mục "rủi ro cao." Bổ sung tại Section 1.8.

**[v1.0] NĐ 13/2023/NĐ-CP đã HẾT HIỆU LỰC từ 01/01/2026.** Thay thế bởi Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 + Nghị định 356/2025/NĐ-CP. Roadmap ban đầu reference NĐ 13 — cần update toàn bộ các reference sang Luật 91/2025 + NĐ 356/2025.

---

## 1. Regulatory Mapping Table

### 1.1 Thông tư 13/2018/TT-NHNN — Hệ thống kiểm soát nội bộ

| Mục | Nội dung |
|-----|---------|
| **Tên** | Thông tư 13/2018/TT-NHNN (sửa đổi bởi TT 40/2018) |
| **Ban hành** | 18/05/2018, hiệu lực 01/01/2019 |
| **Cơ quan** | NHNN |
| **Nội dung chính** | Quy định hệ thống kiểm soát nội bộ của NHTM: mô hình 3 tuyến phòng thủ, giám sát quản lý cấp cao, kiểm soát nội bộ, quản lý rủi ro, đánh giá nội bộ mức đủ vốn (ICAAP), kiểm toán nội bộ |
| **Status** | **Đang có hiệu lực** — NHNN đang soạn thảo TT thay thế (dự thảo gửi lấy ý kiến 04/2025, hướng Basel III). Chưa ban hành chính thức. |
| **Ảnh hưởng đến AI-CRDS** | 🔴 **Cao** |
| **Chi tiết ảnh hưởng** | (1) AI scoring system là một phần của quy trình tín dụng → phải nằm trong hệ thống KSNB. (2) Audit trail bắt buộc cho mọi decision. (3) Mô hình 3 tuyến: AI-CRDS thuộc tuyến 1 (vận hành), bank Risk thuộc tuyến 2 (giám sát), Internal Audit thuộc tuyến 3. (4) "Rủi ro mô hình" được đề cập trong TT sửa đổi — AI model phải có governance. |
| **Yêu cầu với AI-CRDS** | Audit log đầy đủ (input, model version, output, human decision, timestamp). Override logging bắt buộc. Model documentation. Fit vào mô hình 3 tuyến của bank partner. |
| **Rủi ro nếu không comply** | Bank partner không thể deploy — KSNB là yêu cầu SBV kiểm tra định kỳ |
| **Action items** | (1) Thiết kế audit trail schema aligned với TT13 requirements. (2) Chuẩn bị model card format. (3) Theo dõi dự thảo TT thay thế — có thể có yêu cầu mới về quản lý rủi ro mô hình. |
| **Nguồn verify** | Toàn văn trên vanban.chinhphu.vn; VNBA lấy ý kiến dự thảo thay thế (05/2025); Tọa đàm NHNN 12/2025 tại thoibaonganhang.vn |

---

### 1.2 Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 + Nghị định 356/2025/NĐ-CP

| Mục | Nội dung |
|-----|---------|
| **Tên** | Luật BVDLCN 91/2025/QH15 + NĐ 356/2025/NĐ-CP |
| **Ban hành** | Luật: 26/06/2025. NĐ: 31/12/2025 |
| **Hiệu lực** | **01/01/2026** (đã có hiệu lực) |
| **Thay thế** | NĐ 13/2023/NĐ-CP (hết hiệu lực 01/01/2026) |
| **Nội dung chính** | Framework bảo vệ dữ liệu cá nhân toàn diện. 11 quyền chủ thể dữ liệu. DPIA bắt buộc. DPO bắt buộc. Chuyển dữ liệu xuyên biên giới siết chặt. Thông báo vi phạm 72h. Xử phạt hành chính. |
| **Status** | **Đang có hiệu lực** — Enforcement chính thức |
| **Ảnh hưởng đến AI-CRDS** | 🔴 **Cao — Blocking** |
| **Chi tiết ảnh hưởng** | **(a) Dữ liệu nhạy cảm lĩnh vực ngân hàng:** NĐ 356 mở rộng — thông tin đăng nhập, mật khẩu tài khoản, thông tin thẻ, lịch sử giao dịch đều là dữ liệu nhạy cảm → yêu cầu bảo vệ cao nhất. **(b) AI/automated decision:** NĐ 356 Điều 9 quy định xử lý dữ liệu lớn chứa DLCN — phải tuân thủ ngay từ thời điểm bắt đầu xử lý. Bên kiểm soát phải thông báo cho chủ thể về xử lý tự động, giải thích nguyên tắc thuật toán, cho phép chủ thể chọn không tham gia. **(c) DPIA bắt buộc:** Mẫu số 10 — phải lập và lưu giữ từ thời điểm bắt đầu xử lý, nộp A05 trong 60 ngày. **(d) DPO:** Nhân sự BVDLCN phải có trình độ cao đẳng+, ≥2 năm kinh nghiệm pháp chế/CNTT/an ninh mạng/QTRR, đã được đào tạo chuyên sâu. **(e) Chuyển dữ liệu xuyên biên giới:** Hồ sơ đánh giá tác động (Mẫu 09), thông báo Bộ Công an (Mẫu 01a), văn bản thỏa thuận ràng buộc pháp lý với bên nhận. Cloud nước ngoài (AWS/GCP/Azure) → phải comply. **(f) Đồng ý:** Cấm "mặc định" đồng ý. Phải lưu trữ sự đồng ý. Rút lại đồng ý → phải xử lý theo thời hạn quy định. **(g) Trong lĩnh vực tài chính, ngân hàng:** Khi xin đồng ý phải nêu rõ mục đích xử lý bao gồm chấm điểm/xếp hạng tín dụng, thời gian lưu trữ, nguồn thu thập, các bên chia sẻ. **(h) Vi phạm:** Thông báo 72h cho A05 + chủ thể dữ liệu (nếu nhạy cảm). |
| **Yêu cầu với AI-CRDS** | (1) DPIA trước khi xử lý bất kỳ DLCN nào. (2) Consent management module — lấy đồng ý rõ ràng, lưu trữ, cho phép rút lại. (3) Explainability — phải giải thích thuật toán cho chủ thể. (4) Right to opt-out of automated decision. (5) Data residency architecture — nếu dùng cloud nước ngoài phải có hồ sơ chuyển DLXBG. (6) DPO assignment tại bank partner. (7) Breach notification workflow (72h). (8) Data retention policy rõ ràng. |
| **Rủi ro nếu không comply** | Xử phạt hành chính (mức chưa có NĐ xử phạt riêng, nhưng framework đã sẵn). A05 kiểm tra, thanh tra thường xuyên và đột xuất. Bank partner từ chối deploy. |
| **So với NĐ 13/2023 cũ** | Siết chặt hơn: (1) thời hạn phản hồi chủ thể rõ ràng hơn; (2) DPO có điều kiện năng lực cụ thể; (3) mở rộng DLCN nhạy cảm; (4) quy định AI/xử lý tự động; (5) blockchain/cloud riêng; (6) 10 mẫu biểu chuẩn hóa. |
| **Action items** | (1) Thiết kế consent flow cho credit application (nêu rõ mục đích chấm điểm tín dụng). (2) Lập DPIA template cho AI-CRDS. (3) Quyết định data residency architecture (VN cloud vs foreign + hồ sơ XLBG). (4) Thiết kế right-to-explanation flow. (5) Thiết kế opt-out mechanism cho automated scoring. |
| **Nguồn verify** | Luật 91/2025/QH15 toàn văn trên thuvienphapluat.vn. NĐ 356/2025 toàn văn trên luatvietnam.vn (01/2026). So sánh NĐ 356 vs NĐ 13 trên luatvietnam.vn (01/2026). Phân tích Frasers VN (01/2026). PLO (01/2026). |

---

### 1.3 Nghị định 94/2025/NĐ-CP — Sandbox Fintech

| Mục | Nội dung |
|-----|---------|
| **Tên** | Nghị định 94/2025/NĐ-CP |
| **Ban hành** | 29/04/2025 |
| **Hiệu lực** | **01/07/2025** (đã có hiệu lực) |
| **Nội dung chính** | Cơ chế thử nghiệm có kiểm soát (Regulatory Sandbox) trong lĩnh vực ngân hàng. 3 lĩnh vực: (1) Chấm điểm tín dụng (Credit Scoring), (2) Open API, (3) P2P Lending. Thời gian thử nghiệm tối đa 2 năm, có thể gia hạn. Giám sát bởi NHNN. |
| **Status** | **Đang có hiệu lực** |
| **Ảnh hưởng đến AI-CRDS** | 🟢 **Enabling — Cơ hội** |
| **Chi tiết ảnh hưởng** | **(a) Credit Scoring nằm trong scope sandbox** — AI-CRDS core use case (origination scoring) là 1 trong 3 lĩnh vực được phép thử nghiệm. Framework pháp lý rõ ràng. **(b) Đối tượng tham gia:** TCTD + Công ty Fintech thành lập tại VN. Lưu ý: P2P Lending yêu cầu 100% vốn VN, nhưng credit scoring và Open API không có hạn chế tương tự đối với TCTD. **(c) Quy trình:** Nộp hồ sơ chi tiết cho NHNN (kế hoạch thử nghiệm, quản lý rủi ro, nhân sự, pháp lý). NHNN cấp Giấy chứng nhận tham gia. Phải bắt đầu trong 90 ngày. **(d) Sau sandbox:** Kết quả là cơ sở để NHNN hoàn thiện framework pháp lý. Thành công → fast-track licensing. **(e) IT phải đặt tại VN**, đáp ứng tiêu chuẩn bảo mật, privacy, business continuity. |
| **Yêu cầu với AI-CRDS** | Không trực tiếp bắt buộc AI-CRDS tham gia sandbox (vì AI-CRDS là SaaS bán cho bank, bank có thể tham gia sandbox với AI-CRDS). Nhưng cần: (1) architecture đáp ứng yêu cầu sandbox (IT tại VN, reporting cho NHNN). (2) Hiểu quy trình để tư vấn bank partner tham gia. (3) Chuẩn bị tài liệu risk management, data protection phù hợp yêu cầu hồ sơ sandbox. |
| **Rủi ro** | Nếu bank partner muốn tham gia sandbox với AI-CRDS mà product chưa đáp ứng yêu cầu hồ sơ → mất cơ hội. Regulatory landscape có thể thay đổi sau khi sandbox kết thúc. |
| **Action items** | (1) Chuẩn bị "sandbox-ready" documentation package. (2) Theo dõi bank nào đăng ký tham gia sandbox credit scoring — potential customers. (3) Đảm bảo architecture có thể deploy trên infra VN. |
| **Nguồn verify** | NĐ 94/2025 toàn văn. VNBA tọa đàm 06/2025. Frasers VN legal update 06/2025. DFDL analysis 09/2025. Indochine Counsel 08/2025. |

---

### 1.4 Thông tư 41/2016/TT-NHNN — Tỷ lệ an toàn vốn (Basel II)

| Mục | Nội dung |
|-----|---------|
| **Tên** | Thông tư 41/2016/TT-NHNN (sửa đổi bởi TT 22/2023) |
| **Ban hành** | 30/12/2016 |
| **Hiệu lực** | Bắt buộc toàn hệ thống từ 01/01/2020 (gia hạn một số bank) |
| **Nội dung chính** | Quy định tỷ lệ an toàn vốn (CAR ≥ 8%) theo phương pháp tiêu chuẩn Basel II: Trụ cột I (vốn yêu cầu cho rủi ro tín dụng, rủi ro hoạt động, rủi ro thị trường), Trụ cột III (công bố thông tin). Hệ số rủi ro tín dụng chi tiết theo đối tượng khách hàng, sản phẩm. |
| **Status** | **Đang có hiệu lực** — 86% NHTM đã áp dụng. NHNN đang soạn dự thảo sửa đổi hướng Basel III (tọa đàm 07/2025). |
| **Ảnh hưởng đến AI-CRDS** | 🟡 **Trung bình — Shaping** |
| **Chi tiết ảnh hưởng** | **(a) Risk weight methodology:** AI scoring phải align với cách bank tính risk weight theo TT41. Nếu AI scoring output không map được sang risk weight categories → bank không dùng được. **(b) Data requirements:** TT41 yêu cầu hệ thống CNTT đầy đủ để quản lý dữ liệu, tính toán vốn → AI-CRDS data pipeline phải tương thích. **(c) Disclosure:** Bank phải công bố tỷ lệ an toàn vốn, chính sách quản lý rủi ro → AI model phải explainable đủ cho disclosure requirements. **(d) TT22/2023 sửa đổi:** Thay đổi hệ số rủi ro một số khoản phải đòi, ảnh hưởng đến cách AI output được sử dụng trong tính toán CAR. |
| **Yêu cầu với AI-CRDS** | (1) AI score output phải map được sang risk categories của bank (theo Basel II standard approach). (2) Không cần AI-CRDS tính CAR, nhưng output phải compatible với bank's CAR calculation. (3) Model documentation đủ cho bank disclosure requirements. |
| **Action items** | (1) Hiểu cách target banks tính risk weight → design AI output compatible. (2) Theo dõi dự thảo Basel III sửa đổi. |
| **Nguồn verify** | TT41 toàn văn trên thuvienphapluat.vn. BKTO 04/2022. NHNN/WB tọa đàm Basel II/III. TT22/2023 sửa đổi trên thuvienphapluat.vn. |

---

### 1.5 Luật Các tổ chức tín dụng 32/2024/QH15

| Mục | Nội dung |
|-----|---------|
| **Tên** | Luật Các TCTD số 32/2024/QH15 (sửa đổi bổ sung 06/2025) |
| **Ban hành** | 18/01/2024, sửa đổi 27/06/2025 |
| **Hiệu lực** | 01/07/2024, sửa đổi 15/10/2025 |
| **Nội dung chính** | Quy định toàn diện về thành lập, tổ chức, hoạt động TCTD. Điều kiện cấp tín dụng. Quy định mới về khoản vay nhỏ (đơn giản hóa thủ tục). Can thiệp sớm TCTD yếu kém. Xử lý nợ xấu. Là cơ sở pháp lý cho NĐ 94/2025 sandbox. |
| **Status** | **Đang có hiệu lực** |
| **Ảnh hưởng đến AI-CRDS** | 🔴 **Cao** |
| **Chi tiết ảnh hưởng** | **(a) Điều kiện cấp tín dụng:** Luật quy định TCTD phải có quy trình thẩm định, đánh giá rủi ro trước khi cấp tín dụng. AI-CRDS hỗ trợ quy trình này nhưng quyết định cuối cùng phải là của TCTD (human-in-the-loop). **(b) Khoản vay nhỏ:** Quy định mới cho phép cấp tín dụng khoản vay nhỏ chỉ cần một số thông tin cơ bản (mục đích sử dụng vốn, khả năng tài chính) → cơ hội cho AI auto-approve khoản nhỏ. **(c) Sandbox legal basis:** Điều 148 (Luật sửa đổi) là cơ sở pháp lý cho cơ chế sandbox trong NĐ 94/2025. **(d) KSNB & quản trị rủi ro:** Luật yêu cầu TCTD có hệ thống KSNB, quản trị rủi ro phù hợp → AI system phải fit vào framework này. **(e) Xử lý nợ xấu:** Quy định mới về thu giữ tài sản bảo đảm, xử lý nợ → EWS (Phase 2 expansion) phải align. |
| **Yêu cầu với AI-CRDS** | (1) AI-CRDS KHÔNG BAO GIỜ là decision maker — chỉ là decision support. Human-in-the-loop bắt buộc. (2) Output phải hỗ trợ quy trình thẩm định theo Luật (cung cấp evidence, explanation). (3) Thiết kế workflow phù hợp quy trình cấp tín dụng khoản nhỏ (simplified) vs khoản lớn (full review). |
| **Action items** | (1) Map AI-CRDS workflow vào quy trình cấp tín dụng theo Luật TCTD. (2) Thiết kế differentiated workflow cho khoản nhỏ vs khoản lớn. (3) Ghi rõ trong tất cả tài liệu: "AI-CRDS là decision support, không phải decision maker." |
| **Nguồn verify** | Luật 32/2024/QH15 toàn văn trên vanban.chinhphu.vn. Luật sửa đổi 27/06/2025 trên baochinhphu.vn. Phân tích điểm mới trên tapchinganhang.gov.vn (04/2024). |

---

### 1.6 Thông tư 45/2025/TT-NHNN — Phát hành và sử dụng thẻ

| Mục | Nội dung |
|-----|---------|
| **Tên** | Thông tư 45/2025/TT-NHNN |
| **Ban hành** | 2025 |
| **Hiệu lực** | **05/01/2026** (đã có hiệu lực) |
| **Nội dung chính** | Quy định phát hành, sử dụng thẻ ngân hàng. Bắt buộc đối chiếu sinh trắc học khi phát hành thẻ. Ngoại lệ: digital banks đăng ký qua app KHÔNG bắt buộc gặp mặt trực tiếp, nhưng phải đối chiếu sinh trắc học online + verify SĐT chính chủ. CC không được chuyển khoản vào ví điện tử. Báo cáo gian lận định kỳ qua hệ thống SIMO. |
| **Status** | **Đang có hiệu lực** |
| **Ảnh hưởng đến AI-CRDS** | 🟡 **Trung bình — Shaping** |
| **Chi tiết ảnh hưởng** | **(a) Sinh trắc học tại origination:** Trực tiếp ảnh hưởng đến fraud detection layer — eKYC/biometric check là bắt buộc trước khi phát hành CC. AI-CRDS cần integrate với kết quả eKYC/biometric. **(b) Digital bank ngoại lệ:** Digital banks (target customers) không cần gặp mặt nhưng phải sinh trắc online → AI-CRDS fraud layer cần xử lý kết quả biometric verification online. **(c) Báo cáo gian lận SIMO:** Bank phải báo cáo gian lận qua hệ thống SIMO → AI-CRDS fraud detection output phải compatible với SIMO reporting format. **(d) CC không chuyển khoản ví điện tử:** Ảnh hưởng đến fraud pattern detection (hạn chế một kênh fraud). |
| **Action items** | (1) Integrate eKYC/biometric result vào scoring pipeline. (2) Thiết kế fraud output compatible với SIMO reporting. (3) Update fraud pattern database cho quy định mới. |
| **Nguồn verify** | Đã verify trong market-context.md v1.0 (Week 1). VIR, Vietstock 12/2025. |

---

### 1.8 Luật Trí tuệ nhân tạo 134/2025/QH15 🆕

| Mục | Nội dung |
|-----|---------|
| **Tên** | Luật Trí tuệ nhân tạo số 134/2025/QH15 |
| **Ban hành** | 10/12/2025 (Quốc hội khóa XV, kỳ họp thứ 10) |
| **Hiệu lực** | **01/03/2026** (đã có hiệu lực) |
| **Cơ quan** | Quốc hội |
| **Nội dung chính** | Luật AI đầu tiên của VN. Quy định về nghiên cứu, phát triển, cung cấp, triển khai và sử dụng hệ thống AI. Phân loại AI theo 3 mức độ rủi ro (cao / trung bình / thấp). Nguyên tắc core: AI phục vụ con người, không thay thế thẩm quyền và trách nhiệm con người (Điều 4). Bảo đảm công bằng, minh bạch, không phân biệt đối xử. Trách nhiệm giải trình. Danh mục AI rủi ro cao do Thủ tướng ban hành (đang soạn). |
| **Status** | **Đang có hiệu lực** — Nghị định hướng dẫn chi tiết đang được Bộ KH&CN soạn (target 02/2026). Các bộ ngành phải quy định chi tiết yêu cầu an toàn, quản lý rủi ro cho AI trong lĩnh vực quản lý → NHNN sẽ ra quy định riêng cho AI trong banking. |
| **Ảnh hưởng đến AI-CRDS** | 🔴 **Cao — Blocking** |
| **Chi tiết ảnh hưởng** | **(a) Phân loại rủi ro:** AI-CRDS scoring tín dụng ảnh hưởng trực tiếp đến khả năng tiếp cận tài chính của cá nhân → gần chắc chắn nằm trong danh mục "AI rủi ro cao" khi Thủ tướng ban hành Danh mục. Hệ thống AI rủi ro cao có nghĩa vụ nặng hơn: đánh giá tác động, ghi nhãn, giám sát, trách nhiệm bồi thường. **(b) Human oversight bắt buộc (Điều 4):** "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người. Bảo đảm duy trì sự kiểm soát và khả năng can thiệp của con người đối với mọi quyết định và hành vi của hệ thống trí tuệ nhân tạo." → Confirm lại human-in-the-loop không chỉ là SBV practice mà là YÊU CẦU LUẬT. **(c) Minh bạch + không phân biệt đối xử (Điều 4):** "Bảo đảm công bằng, minh bạch, không thiên lệch, không phân biệt đối xử" → Bias monitoring không còn là best practice, mà là yêu cầu pháp luật. **(d) Trách nhiệm giải trình:** "Thực hiện trách nhiệm giải trình về các quyết định và hệ quả của hệ thống trí tuệ nhân tạo" → Explainability là mandatory. **(e) Ghi nhãn AI:** Hệ thống AI phải được ghi nhãn → AI-CRDS output phải ghi rõ "quyết định này được hỗ trợ bởi hệ thống AI." **(f) Các bộ ngành quy định chi tiết:** NHNN sẽ ban hành TT riêng về AI trong banking (xem Section 2.3) → follow sát. |
| **Yêu cầu với AI-CRDS** | (1) Chuẩn bị hồ sơ kỹ thuật cho AI rủi ro cao khi Danh mục được ban hành. (2) Ghi nhãn AI trên mọi output (credit decision có AI involvement). (3) Explainability module không còn optional — mandatory theo Luật. (4) Bias monitoring mandatory — không chỉ best practice. (5) Human oversight phải ghi vào system design. (6) Trách nhiệm bồi thường: cần xác định rõ liability allocation giữa AI-CRDS vendor vs bank partner. |
| **Rủi ro nếu không comply** | Hình phạt chưa rõ chi tiết (chờ NĐ hướng dẫn). GDoc reference "phạt tới 2% doanh thu cho AI rủi ro cao" — cần verify khi NĐ chính thức ban hành. Ngoài phạt: bank partner từ chối deploy, SBV scrutiny, reputation damage. |
| **Action items** | (1) **Theo dõi sát Danh mục AI rủi ro cao** (Thủ tướng ban hành, target 02/2026 — có thể đã ban hành). (2) **Theo dõi NĐ hướng dẫn Luật AI** (Bộ KH&CN soạn). (3) **Theo dõi TT NHNN** về AI trong banking (xem Section 2.3). (4) Thiết kế "AI label" trên mọi output. (5) Update liability framework trong hợp đồng vendor-bank. (6) Bổ sung Luật AI 134/2025 vào tất cả documents Week 2 (compliance-gap-analysis, pdpd-impact, sbv-requirements). |
| **Nguồn verify** | Toàn văn trên thuvienphapluat.vn (134/2025/QH15). vanban.chinhphu.vn. luatvietnam.vn (12/2025). baochinhphu.vn Kế hoạch triển khai (03/2026). |

---

### 1.9 Nghị định 13/2023/NĐ-CP — Bảo vệ dữ liệu cá nhân (ĐÃ HẾT HIỆU LỰC)

| Mục | Nội dung |
|-----|---------|
| **Tên** | Nghị định 13/2023/NĐ-CP |
| **Ban hành** | 17/04/2023 |
| **Hiệu lực** | 01/07/2023 — **HẾT HIỆU LỰC 01/01/2026** |
| **Thay thế bởi** | Luật 91/2025/QH15 + NĐ 356/2025/NĐ-CP |
| **Lý do giữ trong bảng** | Roadmap ban đầu reference NĐ 13. Nhiều bank partner có thể vẫn reference NĐ 13 trong tài liệu nội bộ cũ. Cần biết để map transition. |
| **Status** | ❌ **Hết hiệu lực** |
| **Action items** | (1) Update tất cả documents reference "NĐ 13/2023" → "Luật 91/2025 + NĐ 356/2025". (2) Khi nói chuyện với bank partner, confirm họ đã chuyển sang framework mới chưa. |

---

## 2. Văn Bản Chưa Verify Đủ — Cần Research Thêm

### 2.1 Thông tư 17/2024/TT-NHNN — CIC Data Access

| Mục | Nội dung |
|-----|---------|
| **Tên** | Thông tư 17/2024/TT-NHNN (chưa verify đầy đủ nội dung) |
| **Ảnh hưởng dự kiến** | Quy định về truy cập và sử dụng dữ liệu CIC. Ảnh hưởng trực tiếp đến data pipeline của AI-CRDS vì CIC data là core input cho credit scoring. |
| **Status verification** | ⚠️ **Chưa verify nội dung chi tiết** — Search không trả về toàn văn hoặc phân tích chi tiết. Có thể đây là TT về hoạt động thông tin tín dụng (thay thế TT cũ), hoặc TT về báo cáo thống kê. Cần đọc toàn văn để confirm. |
| **Action items** | (1) Tìm toàn văn TT 17/2024 trên thuvienphapluat.vn. (2) Confirm phạm vi: quy định CIC data access rules hay nội dung khác. (3) Map ảnh hưởng cụ thể đến AI-CRDS data pipeline. |

### 2.2 Quy định SBV về AI trong tài chính

| Mục | Nội dung |
|-----|---------|
| **Tên** | Không có văn bản riêng biệt chỉ quy định AI trong tài chính (tại thời điểm viết) |
| **Thực tế** | Trước 01/03/2026, VN chưa có văn bản pháp luật riêng biệt quy định về AI trong tài chính ngân hàng. Tuy nhiên, **từ 01/03/2026, Luật AI 134/2025 có hiệu lực** — yêu cầu các bộ ngành (bao gồm NHNN) ban hành quy định chi tiết cho AI trong lĩnh vực quản lý. Các yêu cầu liên quan đến AI hiện được rải trong nhiều văn bản: (1) Human oversight → Luật AI 134/2025 Điều 4 + Luật TCTD 2024. (2) Explainability → Luật AI 134/2025 + Luật BVDLCN 2025 + NĐ 356. (3) Không phân biệt đối xử → Luật AI 134/2025 Điều 4. (4) Sandbox → NĐ 94/2025. (5) KSNB → TT 13/2018 + dự thảo thay thế. |
| **Action items** | (1) Map yêu cầu AI từ Luật 134/2025 vào product design (đã làm tại 1.8). (2) Theo dõi: NHNN **sẽ** ban hành TT riêng về AI trong banking (xem 2.3). (3) Theo dõi Danh mục AI rủi ro cao (Thủ tướng). |

---

### 2.3 Dự thảo Thông tư NHNN về AI trong ngân hàng 🆕

| Mục | Nội dung |
|-----|---------|
| **Tên** | Dự thảo Thông tư NHNN về triển khai AI trong lĩnh vực ngân hàng |
| **Status** | ⚠️ **DỰ THẢO — chưa ban hành chính thức** |
| **Nguồn** | vietnamlawmagazine.vn (2025): SBV đang soạn thảo quy định siết chặt sử dụng AI trong banking. DataGuidance (2025): SBV mở tham vấn về triển khai AI trong ngân hàng. |
| **Nội dung dự kiến** | (1) Yêu cầu thông báo trước cho khách hàng khi AI được sử dụng trong quyết định tín dụng. (2) Quyền khiếu nại của khách hàng đối với quyết định của AI. (3) Bắt buộc human-in-the-loop. (4) Có thể yêu cầu đăng ký/thông báo hệ thống AI với NHNN. |
| **Cơ sở pháp lý** | Luật AI 134/2025 yêu cầu các bộ ngành ban hành quy định chi tiết về AI trong lĩnh vực quản lý → NHNN có trách nhiệm ban hành TT cho banking. Kế hoạch triển khai Luật AI (03/2026) ghi: "Năm 2026 và các năm tiếp theo, các bộ ngành quy định chi tiết yêu cầu về an toàn, quản lý rủi ro và điều kiện triển khai đối với AI trong ngành, lĩnh vực quản lý." |
| **Ảnh hưởng đến AI-CRDS** | 🟡 **Trung bình — Shaping** (chưa ban hành nên chưa blocking, nhưng cần chuẩn bị) |
| **Rủi ro** | Nếu TT ban hành với yêu cầu mới mà AI-CRDS chưa chuẩn bị → phải redesign. |
| **Action items** | (1) Theo dõi sát trang web NHNN + thitruongtaichinhtiente.vn cho dự thảo. (2) Thiết kế AI-CRDS proactively theo các yêu cầu dự kiến (thông báo khách, khiếu nại, human-in-the-loop) — nếu TT ra mà đã comply sẵn = competitive advantage. (3) Nếu có cơ hội góp ý dự thảo → tham gia (qua VNBA hoặc VietFintech). |
| **Nguồn** | vietnamlawmagazine.vn: "Central bank moves to tighten AI use in banking" (2025). DataGuidance: "Vietnam: SBV launches consultation on AI deployment" (2025). |

---

## 3. Bảng Tổng Hợp — Impact Matrix

| # | Văn bản | Mức ảnh hưởng | Status | Ảnh hưởng chính đến AI-CRDS |
|---|---------|--------------|--------|----------------------------|
| 1 | TT 13/2018 (KSNB) | 🔴 Cao | Hiệu lực (đang sửa đổi) | Audit trail, mô hình 3 tuyến, model governance |
| 2 | Luật BVDLCN 91/2025 + NĐ 356/2025 | 🔴 Cao — Blocking | Hiệu lực từ 01/01/2026 | DPIA, consent, explainability, DPO, data residency, 72h breach notification |
| **3** | **Luật AI 134/2025 🆕** | **🔴 Cao — Blocking** | **Hiệu lực từ 01/03/2026** | **Phân loại rủi ro, human oversight bắt buộc (Luật), ghi nhãn AI, bias = vi phạm Luật, trách nhiệm giải trình + bồi thường** |
| 4 | NĐ 94/2025 (Sandbox) | 🟢 Enabling | Hiệu lực từ 01/07/2025 | Credit scoring trong scope sandbox, cơ hội pháp lý |
| 5 | TT 41/2016 (Basel II) | 🟡 Trung bình | Hiệu lực (đang sửa đổi) | AI output phải compatible với risk weight methodology |
| 6 | Luật TCTD 32/2024 | 🔴 Cao | Hiệu lực | Human-in-the-loop bắt buộc, quy trình cấp tín dụng |
| 7 | TT 45/2025 (Thẻ) | 🟡 Trung bình | Hiệu lực từ 05/01/2026 | Sinh trắc học at origination, SIMO reporting |
| 8 | NĐ 13/2023 (PDPD cũ) | ❌ Hết hiệu lực | Hết 01/01/2026 | Update references sang Luật 91/2025 + NĐ 356 |
| 9 | TT 17/2024 (CIC?) | ⚠️ Chưa verify | Cần research | CIC data access rules |
| **10** | **Dự thảo TT NHNN về AI 🆕** | **🟡 Trung bình — Shaping** | **Dự thảo** | **Thông báo khách, khiếu nại, human-in-the-loop — chưa ban hành nhưng cần chuẩn bị** |
| 11 | "QĐ SBV về AI" | ❌ Thay bằng #3 + #10 | N/A | Yêu cầu AI nay có Luật AI 134/2025 + dự thảo TT NHNN |

---

## 4. Compliance Gap Analysis — AI-CRDS

Dựa trên mapping ở trên, các gap chính cần address khi thiết kế AI-CRDS:

### 🔴 Gap 1: DPIA chưa có
Luật BVDLCN 2025 + NĐ 356 yêu cầu DPIA (Mẫu 10) trước khi xử lý DLCN. AI-CRDS xử lý DLCN nhạy cảm (tài chính, ngân hàng) → DPIA là bắt buộc. Chưa có DPIA template cho AI-CRDS.
**→ Cần thiết kế DPIA template. Target: Week 10 (DPIA Report).**

### 🔴 Gap 2: Consent management chưa thiết kế
NĐ 356 cấm "mặc định đồng ý", yêu cầu nêu rõ mục đích chấm điểm tín dụng. AI-CRDS cần consent flow rõ ràng. Chưa có consent flow design.
**→ Cần thiết kế consent flow. Target: Week 9 (Human-AI Interaction Design).**

### 🔴 Gap 3: Data residency architecture chưa quyết
Nếu AI-CRDS dùng cloud nước ngoài → phải có hồ sơ chuyển DLCN xuyên biên giới. Nếu dùng VN cloud → hạn chế hơn về dịch vụ. Chưa quyết architecture.
**→ Cần quyết data residency. Target: Week 10 (Tech Stack & DPIA).**

### 🟡 Gap 4: Explainability cho automated decision
NĐ 356 yêu cầu giải thích thuật toán + cho phép opt-out. AI-CRDS cần explainability module (feature importance, counterfactual). Đã có trong roadmap Week 9 nhưng scope cần mở rộng theo NĐ 356.
**→ Update Week 9 scope: thêm yêu cầu NĐ 356 về giải thích thuật toán.**

### 🟡 Gap 5: Sandbox readiness documentation
NĐ 94/2025 yêu cầu hồ sơ chi tiết để tham gia sandbox. AI-CRDS cần chuẩn bị documentation package sẵn sàng cho bank partner.
**→ Cần chuẩn bị sandbox documentation. Target: Week 29 (Pilot Proposal).**

### 🟡 Gap 6: Audit trail alignment với TT 13
TT 13/2018 yêu cầu KSNB toàn diện. Dự thảo thay thế có thể thêm yêu cầu quản lý rủi ro mô hình (model risk management). Audit trail design cần align.
**→ Target: Week 35 (Audit Trail Design). Cần theo dõi dự thảo TT thay thế.**

### 🔴 Gap 7: Luật AI 134/2025 compliance 🆕
Luật AI có hiệu lực 01/03/2026. AI-CRDS gần chắc chắn là "AI rủi ro cao." Chưa chuẩn bị: (1) Hồ sơ kỹ thuật cho AI rủi ro cao. (2) Ghi nhãn AI trên output. (3) Bias monitoring mandatory (Luật yêu cầu, không phải best practice). (4) Liability allocation giữa vendor-bank. (5) Theo dõi Danh mục AI rủi ro cao + NĐ hướng dẫn.
**→ Cần bổ sung vào tất cả documents Week 2 + roadmap. Đặc biệt: ghi nhãn AI ngay từ MVP (Week 12). Bias monitoring nâng priority từ MEDIUM lên HIGH.**

---

## 5. Tracking — Tự hỏi cuối tuần

- [ ] Đã contact Compliance Officer chưa?
- [ ] Gap nào HIGH priority cần address ngay? (Gap 1: DPIA, Gap 2: Consent, Gap 3: Data residency, **Gap 7: Luật AI 134/2025**)
- [ ] PDPD: Bank X đã có consent management system chưa? Đã chuyển từ NĐ 13 sang Luật 91/2025 + NĐ 356 chưa?
- [ ] SBV: Bank X có đăng ký sandbox NĐ 94 cho credit scoring không?
- [ ] Dự thảo TT thay thế TT 13/2018 đã ban hành chính thức chưa? (Check mỗi tháng)
- [ ] TT 17/2024 đã verify toàn văn chưa?
- [ ] Bank partner đã có DPO đáp ứng điều kiện NĐ 356 chưa? (cao đẳng+, 2 năm kinh nghiệm, đã đào tạo BVDLCN)
- [ ] Data residency architecture đã quyết chưa? (VN cloud vs foreign + hồ sơ XLBG)
- [ ] 🆕 **Luật AI 134/2025:** Danh mục AI rủi ro cao đã ban hành chưa? (Thủ tướng, target 02/2026)
- [ ] 🆕 **Luật AI 134/2025:** NĐ hướng dẫn Luật AI đã ban hành chưa? (Bộ KH&CN soạn)
- [ ] 🆕 **Dự thảo TT NHNN về AI trong banking:** Có cập nhật mới không?

---

## 6. Ghi Chú & Limitations

1. **Tài liệu này dựa trên thông tin công khai** — không phải tư vấn pháp lý. Cần legal review trước khi triển khai.
2. **TT 17/2024 chưa verify** — cần research toàn văn để confirm nội dung và phạm vi.
3. **Dự thảo TT thay thế TT 13/2018** đang ở giai đoạn hoàn thiện (12/2025). Nội dung chưa chính thức → cần theo dõi.
4. **NHNN chưa có TT riêng về AI** — nhưng Luật AI 134/2025 yêu cầu các bộ ngành ban hành quy định chi tiết → NHNN sẽ ban hành. Follow sát (xem Section 2.3).
5. **Luật AI 134/2025: NĐ hướng dẫn + Danh mục AI rủi ro cao** đang được soạn (target 02/2026). Chi tiết nghĩa vụ cho AI rủi ro cao phụ thuộc vào 2 VB này.
6. **Chế tài xử phạt vi phạm BVDLCN** — Luật 91/2025 đã có khung, nhưng Nghị định xử phạt chi tiết chưa rõ (cần theo dõi). NĐ 13 cũ quy định phạt tới 5% doanh thu, Luật mới có thể giữ hoặc tăng.
7. **Regulatory mapping cần update ít nhất mỗi quý** — VN đang trong giai đoạn ban hành nhiều văn bản mới.

---

## 7. Nguồn Tham Khảo

| # | Nguồn | Nội dung | Thời điểm |
|---|-------|---------|-----------|
| 1 | vanban.chinhphu.vn | TT 13/2018, NĐ 13/2023, Luật TCTD 2024 toàn văn | Official |
| 2 | thuvienphapluat.vn | NĐ 356/2025, TT 41/2016, TT 22/2023 toàn văn | Official |
| 3 | luatvietnam.vn | So sánh NĐ 356 vs NĐ 13; Luật BVDLCN + VB hướng dẫn | 01/2026 |
| 4 | Frasers VN | Phân tích NĐ 356/2025 chi tiết (tiếng Anh) | 01/2026 |
| 5 | VNBA (vnba.org.vn) | Lấy ý kiến dự thảo thay thế TT13 (05/2025); Tọa đàm NĐ 94 (06/2025) | 2025 |
| 6 | thoibaonganhang.vn | Tọa đàm NHNN về dự thảo thay thế TT 13 | 12/2025 |
| 7 | DFDL | Phân tích NĐ 94/2025 sandbox (tiếng Anh) | 09/2025 |
| 8 | Indochine Counsel | NĐ 94/2025 legal analysis | 08/2025 |
| 9 | tapchinganhang.gov.vn | Phân tích Luật TCTD 2024 điểm mới | 04/2024 |
| 10 | baochinhphu.vn | Luật sửa đổi TCTD 27/06/2025 | 06/2025 |
| 11 | PLO (plo.vn) | Thay đổi BVDLCN từ 01/01/2026 | 01/2026 |
| 12 | BKTO (baokiemtoan.vn) | 86% NHTM áp dụng TT41 | 04/2022 |
| 13 | thuvienphapluat.vn | 🆕 Luật AI 134/2025/QH15 toàn văn | 12/2025 |
| 14 | luatvietnam.vn | 🆕 Luật AI 134/2025 download + phân tích | 01/2026 |
| 15 | baochinhphu.vn | 🆕 Kế hoạch triển khai Luật AI — NĐ hướng dẫn, Danh mục AI rủi ro cao | 03/2026 |
| 16 | vietnamlawmagazine.vn | 🆕 SBV tightens AI use in banking | 2025 |
| 17 | DataGuidance | 🆕 SBV launches consultation on AI deployment in banking | 2025 |