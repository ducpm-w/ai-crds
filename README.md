Dự án AI-CRDS (Credit Risk Decision Support)

Mục tiêu cốt lõi: Xây dựng và triển khai hệ thống AI hỗ trợ ra quyết định tín dụng nội bộ, tập trung vào mảng chấm điểm khởi tạo (Origination Scoring) và phát hiện gian lận (Fraud Detection) cho thẻ tín dụng bán lẻ.

Chỉ số đo lường kỳ vọng: Giảm tỷ lệ phải thẩm định hồ sơ thủ công (manual review rate), rút ngắn thời gian ra quyết định (time-to-decision), đồng thời duy trì hoặc giảm tỷ lệ nợ xấu (NPL).

Quy mô và Lộ trình: Dự án triển khai trong vòng 60 tuần, được chia thành 4 giai đoạn chính:

Đánh giá và Đề xuất: Khảo sát hiện trạng dữ liệu, quy định pháp lý, xây dựng phiên bản thử nghiệm (MVP) và đề xuất phương án giải quyết.

Thiết kế và Kiến trúc MLOps: Xây dựng luồng công việc đa vai trò, thiết lập cơ chế kiểm thử mô hình (Champion-Challenger) và tích hợp hệ thống.

Triển khai và Đánh giá thực tế: Chạy thử nghiệm ngầm (Shadow testing), triển khai giới hạn đến mở rộng toàn bộ, và thu thập dữ liệu phản hồi (Feedback loop).

Mở rộng và Hoàn thiện vòng đời: Đánh giá khả năng mở rộng sang các phân khúc khác, thiết lập quy trình quản trị mô hình dài hạn (CI/CD for ML).

Đặc điểm kỹ thuật và Vận hành:

Bảo mật và Pháp lý: Tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu cá nhân và tiêu chuẩn an toàn của cơ quan quản lý nhà nước.

Quy tắc "Human-in-the-loop": Trí tuệ nhân tạo chỉ cung cấp điểm số và lý do đề xuất; con người (Chuyên viên tín dụng) luôn là người giữ quyền kiểm soát và ra quyết định cuối cùng.

Tích hợp sâu: Kết nối trực tiếp với hệ thống ngân hàng lõi (Core Banking), cơ sở dữ liệu tín dụng quốc gia và nền tảng định danh điện tử (eKYC).

Tự động tối ưu: Tích hợp hệ thống theo dõi độ lệch mô hình (Model Drift) để kịp thời tinh chỉnh theo biến động thực tế của thị trường.