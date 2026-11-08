# Problem Statement — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) — Bank X

---

> Số liệu trong tài liệu là giả định lập kế hoạch dựa trên benchmark thị trường, sẽ được thay bằng dữ liệu thực của Bank X khi có.

## 1. Hiện trạng quy trình

### 1.1 Workflow

Bank X xử lý origination thẻ tín dụng qua 9 bước thủ công:

```
Tiếp nhận → eKYC → Nhập liệu → Tra CIC → CO review → Quyết định → Phê duyệt → Thông báo → Lưu hồ sơ
  10-20'     2-5'    10-20'      5-30'      20-45'       5-10'       tùy cấp      T+1       thủ công
```

Thời gian end-to-end là 1-7 ngày (điển hình 3-5 ngày). Quy trình phụ thuộc hoàn toàn vào CO: chưa có scoring tự động, chưa có lớp phát hiện gian lận và chưa có công cụ hỗ trợ quyết định.

### 1.2 Nhân sự và năng lực xử lý

| Nguồn lực | Hiện tại |
|-----------|----------|
| Credit Officer | 10-12 FTE |
| Năng lực mỗi CO | Khoảng 10-15 hồ sơ/ngày |
| Tổng năng lực | Khoảng 3,000 hồ sơ/tháng |
| Áp lực cao điểm | Tết, đợt khuyến mại: hàng đợi tăng 2-3 lần |

### 1.3 Chỉ số nền (baseline)

| Chỉ số | Giá trị ước tính | Nguồn |
|--------|------------------|-------|
| Tỷ lệ phê duyệt | Khoảng 60% | Trung bình ngành thẻ tín dụng Việt Nam |
| NPL thẻ tín dụng | Khoảng 3.5% | FiinRatings 2024, Statista 2023 |
| Tỷ lệ gian lận tại origination | Khoảng 0.8% | Visa Việt Nam Q2 2025 |
| Tỷ lệ từ chối nhầm | Khoảng 10% | Ước tính ngành, sẽ đối chiếu với dữ liệu thực của Bank X |
| Thời gian ra quyết định | 1-7 ngày | Mô tả quy trình |
| Tỷ lệ review thủ công | 100% | Theo thiết kế quy trình hiện tại |
| Số trường dữ liệu audit trail | Khoảng 5-8 | Quan sát thực tế ngành |

---

## 2. Chi phí của hiện trạng: 95.65 tỷ VND/năm

Phân tích chi tiết nằm trong tài liệu damage model (W4). Thiệt hại chia thành 4 tầng:

### Tầng 1: Tổn thất tín dụng (NPL), 26.46 tỷ VND/năm

Mỗi hồ sơ xấu được phê duyệt gây tổn thất kỳ vọng EL = PD × LGD × EAD = 3.5% × 70% × 50M = 1.225M VND/hồ sơ. Với 1,800 hồ sơ được duyệt mỗi tháng, khoảng 63 trường hợp vỡ nợ/tháng, tương đương 26.46 tỷ/năm.

### Tầng 2: Tổn thất gian lận, 14.4 tỷ VND/năm

Tỷ lệ gian lận tại origination khoảng 0.8%. Mỗi vụ gian lận mất toàn bộ hạn mức (khoảng 50M). Khoảng 24 vụ/tháng, tương đương 14.4 tỷ/năm. Hiện chỉ có kết quả eKYC đạt/không đạt, chưa có lớp chấm điểm gian lận bằng AI.

### Tầng 3: Chi phí cơ hội do từ chối nhầm, 51.84 tỷ VND/năm

Đây là tầng thiệt hại lớn nhất. Ước tính 10% hồ sơ bị từ chối là từ chối nhầm khách hàng tốt, do thiếu nhất quán giữa các CO hoặc tiêu chí quá thận trọng. Mỗi khách hàng tốt bị từ chối làm mất giá trị vòng đời khoảng 36M VND (lãi, phí và interchange trong 3 năm).

Khoảng 120 trường hợp từ chối nhầm/tháng × 36M = 51.84 tỷ/năm, chiếm 54% tổng thiệt hại.

Mức độ bất đối xứng của chi phí: từ chối nhầm một khách hàng tốt (36M) tốn gấp 29.4 lần phê duyệt nhầm một khách hàng xấu (1.225M).

### Tầng 4: Chi phí vận hành, 2.95 tỷ VND/năm

10-12 CO với chi phí toàn phần 18M/tháng, review thủ công 100% hồ sơ. Chi phí tăng tuyến tính theo volume.

### Tổng hợp

| Tầng | Chi phí/năm | Tỷ trọng |
|------|-------------|----------|
| T1: Tổn thất tín dụng | 26.46 tỷ | 28% |
| T2: Tổn thất gian lận | 14.4 tỷ | 15% |
| T3: Chi phí cơ hội | 51.84 tỷ | 54% |
| T4: Chi phí vận hành | 2.95 tỷ | 3% |
| **Tổng** | **95.65 tỷ** | **100%** |

Các tài liệu W11 dùng nhất quán tổng thiệt hại 95.65 tỷ/năm (làm tròn khoảng 96 tỷ/năm).

---

## 3. Xu hướng nếu không hành động

| Xu hướng | Tác động |
|----------|----------|
| Volume thẻ tăng | Thị trường thẻ Việt Nam tăng khoảng 12.5%/năm (SBV 2024). Thêm volume đòi hỏi thêm CO, chi phí tăng tuyến tính. |
| Cạnh tranh BNPL/fintech | BNPL tăng khoảng 36.5%/năm (PayNXT360 2025), duyệt trong vài phút. Thời gian 3-7 ngày của Bank X làm mất khách. |
| Luật AI 134/2025 | Hiệu lực 01/03/2026, yêu cầu minh bạch, giải trình và không phân biệt đối xử. |
| SBV siết tuân thủ | TT 45/2025 (SIMO) và dự thảo thông tư về AI trong ngân hàng. Audit trail hiện tại chưa đáp ứng yêu cầu thanh tra. |
| Biến động nhân sự CO | Credit specialist có thu nhập 10-20M/tháng trong thị trường cạnh tranh. Mất một CO cần 2-3 tháng đào tạo người thay thế. |

Giữ nguyên hiện trạng đồng nghĩa chấp nhận thiệt hại khoảng 96 tỷ/năm, cùng với chi phí, áp lực cạnh tranh và rủi ro tuân thủ tăng dần theo thời gian.
