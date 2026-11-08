# Synthetic Data Plan — AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support) · **Khách hàng:** Bank X

---

## Mục đích

Bản MVP của AI-CRDS trình diễn trọn vẹn luồng: hồ sơ đầu vào, điểm AI kèm giải thích, khuyến nghị quyết định, nhật ký kiểm toán. MVP không sử dụng dữ liệu khách hàng thật (Luật BVDLCN 91/2025, NĐ 356/2025). Kế hoạch dữ liệu tổng hợp nhằm:
1. Cung cấp dữ liệu trình diễn thực tế cho MVP.
2. Cho phép mã pipeline viết trên dữ liệu tổng hợp tái sử dụng khi chuyển sang dữ liệu thật của Bank X.
3. Bảo đảm tuân thủ PDPD.

**Lưu ý về số liệu:** Các phân phối, tỷ lệ và tham số trong tài liệu là giả định mô phỏng thị trường Việt Nam và danh mục thẻ của Bank X; sẽ được hiệu chỉnh theo số liệu thực của Bank X khi có.

---

## 1. Lựa chọn phương án

### 1.1 Ba phương án

| Phương án | Mô tả | Ưu điểm | Nhược điểm | Phù hợp khi |
|----------|-------|---------|-----------|-------------|
| **A. Tổng hợp hoàn toàn** | Sinh từ đầu theo phân phối thống kê Việt Nam | Không chịu ràng buộc PDPD; tạo ngay; kiểm soát hoàn toàn cân bằng lớp và trường hợp biên | Có thể thiếu các tương quan thực tế; tương tác giữa biến kém thực hơn dữ liệu thật | Chưa truy cập dữ liệu Bank X; MVP trình diễn |
| **B. Dữ liệu thật đã ẩn danh** | Che thông tin nhận dạng từ dữ liệu thật, giữ nguyên mẫu và tương quan | Giữ tương quan thực tế; mô hình huấn luyện gần vận hành hơn | Cần truy cập dữ liệu thật; ẩn danh phải không thể đảo ngược; giả danh hóa vẫn được coi là dữ liệu cá nhân | Đã truy cập dữ liệu thật và được Compliance phê duyệt |
| **C. Kết hợp (Hybrid)** | Cấu trúc và phân phối từ dữ liệu thật, giá trị sinh tổng hợp | Cân bằng giữa tính thực tế và quyền riêng tư; tương quan gần thực tế hơn A | Cần ít nhất thống kê tổng hợp từ Bank X (trung bình, độ lệch chuẩn, hình dạng phân phối) | Có thống kê tổng hợp nhưng không có dữ liệu thô |

### 1.2 Quyết định

**Phương án A (tổng hợp hoàn toàn) cho MVP.**

Lý do:
- Mục tiêu MVP là trình diễn luồng đầu-cuối, không phải độ chính xác mô hình.
- Không cần phê duyệt của Compliance.
- Có thể bắt đầu ngay.
- Mã và pipeline viết cho dữ liệu tổng hợp tái sử dụng hoàn toàn khi chuyển sang dữ liệu thật (chỉ đổi nguồn dữ liệu).

**Chuyển sang phương án C (Hybrid)** khi có thống kê tổng hợp từ Bank X (thu nhập trung bình, tỷ lệ default, phân phối tuổi).

**Chuyển sang phương án B (ẩn danh dữ liệu thật)** khi DPIA được phê duyệt và Compliance ký xác nhận, phục vụ huấn luyện mô hình vận hành.

---

## 2. Lược đồ dữ liệu — phản chiếu cấu trúc Bank X

### 2.1 Nguyên tắc thiết kế

1. Tên trường khớp định dạng CBS/CIC của Bank X để khi đổi sang dữ liệu thật chỉ đổi nguồn, không đổi mã.
2. Kiểu dữ liệu khớp (string, float, int, date, categorical).
3. Khoảng giá trị thực tế với thị trường Việt Nam.
4. Quan hệ giữa các trường hợp lý (thu nhập, nợ, DTI; tuổi, thời gian làm việc).

### 2.2 Lược đồ hồ sơ đăng ký

```python
# Mỗi bản ghi = 1 hồ sơ đăng ký thẻ tín dụng
APPLICATION_SCHEMA = {
    # === ĐỊNH DANH VÀ KYC (Nhóm 1) ===
    "application_id":       str,    # "APP-2026-000001"
    "apply_date":           date,   # "2026-01-15"
    "channel":              str,    # "online" | "branch" | "mobile_app"
    "cccd_number":          str,    # Dữ liệu tổng hợp, không dùng CCCD thật
    "full_name":            str,    # Tên tiếng Việt tổng hợp
    "date_of_birth":        date,   # "1990-05-20"
    "age":                  int,    # Phái sinh từ DOB
    "gender":               str,    # "M" | "F" (chỉ giám sát thiên lệch)
    "province":             str,    # "Hà Nội" | "TP.HCM" | "Đà Nẵng" | ...
    "district":             str,    # "Cầu Giấy" | "Quận 1" | ...
    "phone_verified":       bool,
    "ekyc_result":          str,    # "pass" | "fail"
    "ekyc_confidence":      float,  # 0.0 - 1.0
    "ekyc_face_match":      float,  # 0.0 - 1.0
    "ekyc_liveness":        bool,
    "doc_authentic":        bool,

    # === NĂNG LỰC TÀI CHÍNH (Nhóm 2) ===
    "monthly_income_declared": float,  # VND (triệu)
    "income_verified":      bool,      # True nếu phát hiện lương chuyển vào
    "monthly_income_verified": float,  # VND (triệu), null nếu chưa xác minh
    "income_source":        str,       # "salaried" | "self_employed" | "freelance"
    "employer_name":        str,       # Nhà tuyển dụng tổng hợp
    "employer_type":        str,       # "SOE" | "FDI" | "large_private" | "SME" | "startup"
    "employment_months":    int,       # Số tháng tại nơi làm việc hiện tại
    "existing_bank_customer": bool,

    # === DỮ LIỆU CIC (Nhóm 3) ===
    "has_cic_record":       bool,   # False nếu thin file
    "cic_score":            int,    # 300-850 (null nếu không có CIC)
    "cic_total_debt":       float,  # VND (triệu)
    "cic_num_active_loans": int,    # 0-10+
    "cic_max_dpd_12m":      int,    # 0, 30, 60, 90, 120+
    "cic_max_debt_group":   int,    # 1-5
    "cic_inquiries_6m":     int,    # 0-20+
    "cic_credit_history_months": int, # 0-240+

    # === HÀNH VI — chỉ khách hàng hiện hữu (Nhóm 4) ===
    "relationship_months":  int,    # 0 nếu khách mới
    "avg_balance_3m":       float,  # VND (triệu), null nếu khách mới
    "avg_txn_volume_3m":    float,  # VND (triệu), null nếu khách mới
    "salary_deposit_months": int,   # 0 nếu không phát hiện hoặc khách mới
    "num_bank_products":    int,    # 0 nếu khách mới

    # === PHÁI SINH ===
    "dti_declared":         float,  # cic_total_debt / monthly_income_declared
    "dti_verified":         float,  # cic_total_debt / monthly_income_verified (null nếu chưa xác minh)

    # === NHÃN (biến mục tiêu) ===
    "approved":             bool,   # Quyết định lịch sử
    "default_flag":         int,    # 0 = tốt, 1 = default (DPD 90+ trong 12 tháng)
    "dpd_max_12m":          int,    # DPD lớn nhất thực tế trong 12 tháng sau phê duyệt
}
```

### 2.3 Lược đồ nhật ký kiểm toán (cho trình diễn)

```python
AUDIT_SCHEMA = {
    "decision_id":          str,    # "DEC-2026-000001"
    "application_id":       str,    # Khóa ngoại tới hồ sơ
    "timestamp":            datetime,
    "model_version":        str,    # "v0.1.0-synthetic"
    "threshold_version":    str,    # "TH-2026-Q1-DEMO"
    "ai_risk_score":        float,  # 0.0 - 1.0
    "ai_fraud_flag":        bool,
    "ai_fraud_score":       float,  # 0.0 - 1.0
    "ai_confidence":        float,  # 0.0 - 1.0
    "ai_recommendation":    str,    # "APPROVE" | "REJECT" | "REVIEW" | "ESCALATE"
    "ai_explanation":       list,   # ["CIC score > 650", "DTI < 40%", ...]
    "human_decision":       str,    # "APPROVE" | "REJECT"
    "human_user_id":        str,    # "CO-DEMO-001"
    "override_flag":        bool,
    "override_reason":      str,    # null nếu không override
    "adverse_action_sent":  bool,   # True nếu bị từ chối
    "ai_label":             str,    # "Quyết định được hỗ trợ bởi AI" (Luật AI 134/2025)
}
```

---

## 3. Quy mô và phân phối dữ liệu

### 3.1 Các mức quy mô

| Mức | Số bản ghi | Mục đích | Thời gian sinh |
|-----|-----------|---------|---------------|
| **Tối thiểu** | 1.000 | Trình diễn nhanh, kiểm thử giao diện | Dưới 1 phút |
| **Khuyến nghị** | 10.000 | Huấn luyện logistic regression, ý nghĩa thống kê | Dưới 5 phút |
| **Lý tưởng** | 50.000 | Huấn luyện gradient boosting, phân tích theo phân khúc | Dưới 15 phút |

MVP sử dụng 10.000 bản ghi, đủ để huấn luyện logistic regression cơ sở và trình diễn đáng tin cậy.

### 3.2 Phân phối nhãn

| Nhãn | Tỷ lệ | Số lượng (10.000) | Cơ sở |
|------|------|-------------------|-------|
| **Tốt (default_flag=0)** | 94-96% | khoảng 9.500 | Tỷ lệ default thẻ Việt Nam ước tính 3-6%; lấy trung bình 5% |
| **Xấu (default_flag=1)** | 4-6% | khoảng 500 | Mất cân bằng lớp thực tế; mô hình phải xử lý |

### 3.3 Phân phối biến — thị trường Việt Nam

Dựa trên: thống kê GSO Việt Nam, dữ liệu World Bank, CIC Conference (02/2026), thực tiễn ngành.

#### Nhân khẩu học

| Biến | Phân phối | Tham số | Cơ sở |
|------|----------|---------|-------|
| **Age** | Chuẩn cắt cụt | mean=32, std=8, min=21, max=65 | Tuổi trung vị Việt Nam khoảng 31; thẻ phân khúc có lương lệch về 25-40; tối thiểu 21 (tuổi lao động và biên an toàn) |
| **Gender** | Bernoulli | P(M)=0,52, P(F)=0,48 | Tỷ lệ giới tính Việt Nam khoảng 1,04 nam:nữ; lực lượng lao động ngân hàng cân bằng |
| **Province** | Phân loại có trọng số | HCM 35%, Hà Nội 25%, Đà Nẵng 8%, đô thị khác 20%, nông thôn 12% | Thẻ tín dụng tập trung tại HCM và Hà Nội |
| **Channel** | Phân loại | online 50%, mobile_app 30%, branch 20% | Xu hướng ngân hàng số 2025-2026 |

#### Năng lực tài chính

| Biến | Phân phối | Tham số | Cơ sở |
|------|----------|---------|-------|
| **Monthly income (declared)** | Log-chuẩn | trung vị=15 triệu VND, trung bình=20 triệu, std=12 triệu; khoảng 5-150 triệu | Lương trung bình Việt Nam 2025 khoảng 8-10 triệu; phân khúc thẻ có lương cao hơn; tự khai cao hơn thực tế 20-30% |
| **Income verified** | Bernoulli | P(verified)=0,40 | Ước tính 40% hồ sơ nhận lương qua Bank X |
| **Income verified amount** | 0,7-0,85 lần khai báo | Thực tế thấp hơn khai báo | Mức khai cao khoảng 15-30% |
| **Employer type** | Phân loại có trọng số | SOE 15%, FDI 25%, large_private 30%, SME 20%, startup 10% | Phân khúc thẻ có lương nghiêng về việc làm chính thức |
| **Employment months** | Mũ | mean=36, min=3, max=360 | Trung vị khoảng 2 năm tại nơi làm việc; đuôi dài cho nhân sự cấp cao |
| **Existing customer** | Bernoulli | P(existing)=0,55 | Ước tính khoảng 55% hồ sơ đã có tài khoản tại Bank X |

#### Dữ liệu CIC

| Biến | Phân phối | Tham số | Cơ sở |
|------|----------|---------|-------|
| **Has CIC record** | Bernoulli | P(has)=0,82 | Độ phủ CIC 71% dân số trưởng thành; phân khúc thẻ có lương cao hơn, khoảng 82% |
| **CIC Score** | Chuẩn cắt cụt | mean=620, std=100, min=300, max=850 | Điểm trung bình khoảng 620 với tập hồ sơ thẻ |
| **Total debt** | Log-chuẩn | trung vị=50 triệu, trung bình=120 triệu VND | Gồm thế chấp, vay cá nhân, thẻ hiện có; khoảng 0-2 tỷ |
| **Num active loans** | Poisson | lambda=1,5 | Trung bình 1-2 khoản đang hoạt động |
| **Max DPD 12M** | Phân loại có trọng số | 0: 75%, 30: 12%, 60: 6%, 90+: 7% | Phần lớn trả đúng hạn; 7% DPD 90+ khớp tỷ lệ default |
| **Inquiries 6M** | Poisson | lambda=2 | Trung bình 2 lần tra cứu/6 tháng |
| **Credit history months** | Mũ | mean=48, min=0, max=240 | Trung bình 4 năm lịch sử tín dụng |

#### Hành vi (chỉ khách hàng hiện hữu)

| Biến | Phân phối | Điều kiện | Tham số |
|------|----------|----------|---------|
| **Relationship months** | Mũ | existing=True | mean=30, min=1, max=180 |
| **Avg balance 3M** | Log-chuẩn | existing=True | trung vị=20 triệu, trung bình=45 triệu VND |
| **Salary deposit months** | Gần đều | existing=True và verified=True | 3-60 tháng |
| **Num bank products** | Poisson+1 | existing=True | lambda=1,2 (1-5 sản phẩm) |

### 3.4 Tương quan giữa các biến

Dữ liệu tổng hợp phải giữ các tương quan, không sinh độc lập:

| Tương quan | Chiều | Độ mạnh | Logic |
|-----------|------|--------|-------|
| Income và CIC Score | Dương | Trung bình | Thu nhập cao thì trả nợ tốt hơn, điểm CIC cao hơn |
| Income và Employer type | Có cấu trúc | Mạnh | FDI/SOE thu nhập cao hơn; SME/startup thấp hơn |
| Age và Employment months | Dương | Trung bình | Tuổi cao thì làm việc lâu hơn (giới hạn bởi công việc hiện tại) |
| Age và Credit history months | Dương | Mạnh | Tuổi cao thì lịch sử tín dụng dài hơn |
| CIC Score và Default | Âm | Rất mạnh | Điểm CIC thấp thì xác suất default cao |
| DPD history và Default | Dương | Rất mạnh | DPD quá khứ dự báo default tương lai |
| DTI và Default | Dương | Trung bình | DTI cao thì default cao |
| Inquiries và Default | Dương | Yếu đến trung bình | Tra cứu nhiều thì nhu cầu vay gấp, default cao hơn |
| Existing customer và Default | Âm | Yếu | Khách hiện hữu default thấp hơn đôi chút do quan hệ |

Cách thực hiện: sinh biến theo thứ tự phụ thuộc (xem Mục 4.3).

### 3.5 Các trường hợp biên cần có

MVP phải có các trường hợp biên để chứng minh AI-CRDS xử lý được:

| # | Trường hợp biên | Số bản ghi | Mục đích |
|---|----------------|-----------|---------|
| 1 | **Thin file** (không có CIC) | khoảng 1.800 (18%) | Trình diễn xử lý thin file và chuyển thẩm định thủ công |
| 2 | **DTI rất cao** (trên 60%) | khoảng 300 | Trình diễn tự động từ chối hoặc chuyển cấp trên |
| 3 | **NPL gần đây** (nhóm nợ 3-5 trong 12 tháng) | khoảng 200 | Trình diễn từ chối và thông báo adverse action |
| 4 | **eKYC không đạt** | khoảng 50 | Trình diễn cổng gian lận và tự động từ chối |
| 5 | **Rất trẻ** (21-23 tuổi) | khoảng 500 | Trình diễn yếu tố rủi ro theo tuổi |
| 6 | **Thu nhập rất cao nhưng CIC xấu** | khoảng 100 | Trình diễn kịch bản cán bộ override AI |
| 7 | **Thu nhập khai bằng 0** | khoảng 20 | Trình diễn kiểm tra dữ liệu và yêu cầu bổ sung |
| 8 | **CCCD trùng** (cùng người nộp nhiều hồ sơ) | khoảng 30 | Trình diễn phát hiện gian lận qua application velocity |
| 9 | **Hồ sơ hoàn hảo** (thu nhập cao, CIC cao, không nợ) | khoảng 200 | Trình diễn luồng tự động phê duyệt |
| 10 | **Cận ngưỡng** (điểm gần ngưỡng quyết định) | khoảng 500 | Trình diễn hàng đợi thẩm định thủ công |

---

## 4. Công cụ và triển khai

### 4.1 Lựa chọn công cụ

| Công cụ | Mô tả | Dùng cho | Cài đặt |
|---------|-------|---------|--------|
| **Python (core)** | Script sinh dữ liệu | Điều phối | Có sẵn |
| **Faker** | Tên, địa chỉ, số điện thoại giả | Thông tin cá nhân tiếng Việt | `pip install faker` |
| **NumPy** | Phân phối thống kê | Sinh biến | `pip install numpy` |
| **Pandas** | Xử lý dữ liệu, xuất file | Lược đồ, đầu ra CSV | `pip install pandas` |
| **SDV** (Synthetic Data Vault) | Tùy chọn: mô hình hóa tương quan nâng cao | Khi cần tương quan phức tạp | `pip install sdv` |

MVP dùng Python, Faker, NumPy và Pandas. SDV chỉ dùng khi mô hình hóa tương quan bằng mã thủ công chưa đủ thực tế.

### 4.2 Dữ liệu locale tiếng Việt

Faker dùng locale tiếng Việt để sinh tên và địa chỉ thực tế:

```python
from faker import Faker
fake = Faker('vi_VN')

fake.name()           # "Nguyễn Văn An"
fake.first_name()     # "An"
fake.last_name()      # "Nguyễn"

fake.city()           # "Hà Nội"
fake.address()        # "123 Phố Huế, Hai Bà Trưng, Hà Nội"

fake.phone_number()   # "0912345678"
```

### 4.3 Logic sinh dữ liệu theo thứ tự phụ thuộc

```python
# PSEUDOCODE — thứ tự sinh quyết định tương quan

for i in range(N_RECORDS):
    # Bước 1: Nhân khẩu học (độc lập)
    age = generate_age()                    # chuẩn cắt cụt
    gender = generate_gender()              # bernoulli
    province = generate_province()          # phân loại có trọng số

    # Bước 2: Việc làm (phụ thuộc tuổi)
    employer_type = generate_employer_type()
    employment_months = generate_employment(age)  # giới hạn bởi tuổi
    income_declared = generate_income(employer_type, age)

    # Bước 3: Quan hệ ngân hàng (phụ thuộc một phần)
    existing_customer = generate_existing(province)  # đô thị cao hơn
    income_verified = existing_customer and random() < 0.7
    income_actual = income_declared * uniform(0.70, 0.85) if income_verified

    # Bước 4: Dữ liệu CIC (phụ thuộc tuổi, thu nhập)
    has_cic = generate_cic_flag(age)  # tuổi cao thì khả năng cao hơn
    if has_cic:
        cic_score = generate_cic_score(income_declared, age)
        cic_debt = generate_debt(income_declared)
        cic_dpd = generate_dpd(cic_score)  # điểm thấp thì DPD nhiều hơn
        # ... các biến CIC khác
    else:
        # thin file: mọi biến CIC = null

    # Bước 5: Hành vi (chỉ khách hàng hiện hữu)
    if existing_customer:
        avg_balance = generate_balance(income_actual or income_declared)
        # ... các biến hành vi khác

    # Bước 6: Biến phái sinh
    dti_declared = cic_debt / income_declared if income_declared > 0
    dti_verified = cic_debt / income_actual if income_verified

    # Bước 7: Nhãn mục tiêu (phụ thuộc các yếu tố rủi ro)
    default_probability = calculate_default_prob(
        cic_score, cic_dpd, dti, age, employment_months
    )
    default_flag = bernoulli(default_probability)

    # Bước 8: eKYC (phần lớn đạt, tỷ lệ không đạt nhỏ)
    ekyc_result = generate_ekyc(include_fraud_cases=(i in fraud_indices))
```

### 4.4 Mô hình xác suất default

Nhãn default tổng hợp phải thực tế, dựa trên các yếu tố rủi ro đã biết:

```python
def calculate_default_prob(cic_score, max_dpd_12m, dti, age, emp_months):
    """
    Mô hình logistic đơn giản để sinh xác suất default tổng hợp.
    Không phải mô hình chấm điểm thật; chỉ dùng để sinh nhãn thực tế.
    """
    base_logit = -3.0  # tỷ lệ default cơ sở khoảng 5%

    # Ảnh hưởng điểm CIC (biến dự báo mạnh nhất)
    if cic_score is not None:
        cic_effect = -0.008 * (cic_score - 600)  # điểm cao thì rủi ro thấp
    else:
        cic_effect = 0.5  # thin file thì rủi ro cơ sở cao hơn

    # Lịch sử DPD (mạnh thứ hai)
    dpd_effect = {0: 0, 30: 0.8, 60: 1.5, 90: 2.5}.get(max_dpd_12m, 3.0)

    # Ảnh hưởng DTI
    dti_effect = max(0, (dti - 0.4)) * 3.0 if dti else 0.3

    # Ảnh hưởng tuổi (dạng chữ U: trẻ và già rủi ro cao hơn)
    age_effect = 0.3 if age < 25 else (-0.2 if 30 <= age <= 45 else 0.1)

    # Ổn định việc làm
    emp_effect = -0.01 * min(emp_months, 60)  # càng lâu càng thấp, có giới hạn

    logit = base_logit + cic_effect + dpd_effect + dti_effect + age_effect + emp_effect
    probability = 1 / (1 + exp(-logit))

    return probability
```

---

## 5. Kiểm định dữ liệu tổng hợp

### 5.1 Kiểm tra tự động (phải đạt trước khi sử dụng)

| # | Kiểm tra | Kỳ vọng | Xử lý khi không đạt |
|---|---------|---------|--------------------|
| 1 | **Default rate** | 4-6% | Điều chỉnh base_logit |
| 2 | **Age range** | 21-65, trung bình khoảng 32 | Sinh lại |
| 3 | **Income range** | 5-150 triệu VND, trung vị khoảng 15 triệu | Điều chỉnh phân phối |
| 4 | **CIC Score range** | 300-850, trung bình khoảng 620 | Điều chỉnh phân phối |
| 5 | **CIC coverage** | khoảng 82% has_cic=True | Điều chỉnh xác suất |
| 6 | **Existing customer rate** | khoảng 55% | Điều chỉnh xác suất |
| 7 | **DTI range** | 0-200%, trung vị khoảng 30% | Kiểm tra phân phối thu nhập và nợ |
| 8 | **Không null ở trường bắt buộc** | 0 null với ID, tên, DOB, CCCD | Sửa logic sinh |
| 9 | **Null đúng với thin file** | Trường CIC null khi has_cic=False | Sửa logic điều kiện |
| 10 | **Null đúng với khách mới** | Trường hành vi null khi existing=False | Sửa logic điều kiện |
| 11 | **Chiều tương quan** | CIC score và default: âm | Kiểm tra logic sinh |
| 12 | **Không có CCCD thật** | Mọi CCCD là dữ liệu tổng hợp | Thêm tiền tố "SYN" |
| 13 | **Có đủ trường hợp biên** | Cả 10 trường hợp ở Mục 3.5 | Kiểm tra số lượng |
| 14 | **application_id duy nhất** | 100% duy nhất | Sửa cách sinh ID |
| 15 | **Employment months ≤ (age-18)*12** | Nhất quán logic | Giới hạn thời gian làm việc |

### 5.2 Kiểm tra trực quan

| # | Kiểm tra | Phương pháp | Tiêu chí đạt |
|---|---------|-------------|-------------|
| 1 | **Phân phối thu nhập** | Histogram | Lệch phải, không có đỉnh tại số tròn |
| 2 | **Phân phối tuổi** | Histogram | Hình chuông tập trung quanh 32, không có giá trị dưới 21 hoặc trên 65 |
| 3 | **CIC Score và Default** | Scatter/box plot | Quan hệ âm rõ ràng |
| 4 | **DTI và Default** | Box plot | DTI cao hơn ở nhóm default |
| 5 | **Heatmap tương quan** | Heatmap | Thấy các tương quan kỳ vọng (Mục 3.4) |
| 6 | **Bản ghi mẫu** | In 20 bản ghi ngẫu nhiên | Rà soát tính thực tế bằng mắt |

### 5.3 Phác thảo script kiểm định

```python
def validate_synthetic_data(df):
    """Chạy mọi kiểm tra. Trả về đạt/không đạt theo từng kiểm tra."""
    results = {}

    # Kiểm tra 1: Default rate
    default_rate = df['default_flag'].mean()
    results['default_rate'] = {
        'value': f"{default_rate:.2%}",
        'pass': 0.03 <= default_rate <= 0.07,
        'expected': '4-6%'
    }

    # Kiểm tra 2: Age range
    results['age_range'] = {
        'value': f"{df['age'].min()}-{df['age'].max()}, mean={df['age'].mean():.1f}",
        'pass': df['age'].min() >= 21 and df['age'].max() <= 65,
        'expected': '21-65'
    }

    # ... (tổng cộng 15 kiểm tra)

    for check, result in results.items():
        status = "PASS" if result['pass'] else "FAIL"
        print(f"{status} | {check}: {result['value']} (expected: {result['expected']})")

    return all(r['pass'] for r in results.values())
```

---

## 6. Gắn nhãn và watermark

### 6.1 Bắt buộc trên mọi đầu ra

Mọi file dữ liệu tổng hợp có phần đầu:

```
# Header trong mọi file CSV/JSON
# SYNTHETIC DATA — NOT REAL CUSTOMERS
# Generated: 2026-03-27
# Purpose: AI-CRDS MVP Demo (Bank X)
# DO NOT use for production model training
# DO NOT share outside project team
```

### 6.2 Watermark CCCD

CCCD tổng hợp không được trùng định dạng thật; thêm tiền tố:

```python
# CCCD thật: 12 chữ số, bắt đầu bằng mã tỉnh
# Tổng hợp: tiền tố "SYN" + 9 chữ số
cccd = f"SYN{fake.random_number(digits=9, fix_len=True)}"
# Ví dụ: "SYN123456789"
```

### 6.3 Quy ước đặt tên file

```
ai-crds-synthetic-10k-v1.0-20260327.csv     # Bộ dữ liệu chính
ai-crds-synthetic-10k-v1.0-20260327.json    # Định dạng JSON
ai-crds-synthetic-audit-v1.0-20260327.csv   # Nhật ký kiểm toán trình diễn
ai-crds-synthetic-VALIDATION-20260327.html  # Báo cáo kiểm định
```

---

## 7. Các giai đoạn triển khai

| Giai đoạn | Sản phẩm | Phụ trách |
|----------|---------|----------|
| **1. Lập kế hoạch** | Kế hoạch dữ liệu tổng hợp (tài liệu này) | Product |
| **2. Script v1** | Script sinh 1.000 bản ghi và kiểm định | Product, Dev |
| **3. Script v2** | Script sinh 10.000 bản ghi, tinh chỉnh tương quan | Dev |
| **4. Kiểm định lược đồ** | Bộ dữ liệu đã kiểm định, lược đồ khớp hệ thống của Bank X | Product, IT |
| **5. MVP** | Bộ dữ liệu tổng hợp dùng trong bản trình diễn MVP (xem `w12-03-synthetic-dataset`) | Product, Dev |
| **6. Hybrid** | Bộ dữ liệu kết hợp phân phối thực khi có thống kê của Bank X | Dev, Data |
| **7. Dữ liệu ẩn danh** | Chuyển sang dữ liệu thật đã ẩn danh khi DPIA được phê duyệt | Dev, Compliance |

---

## 8. Kế hoạch chuyển sang dữ liệu thật

### 8.1 Mức tái sử dụng mã

| Thành phần | Tái sử dụng | Thay đổi cần thiết |
|-----------|------------|-------------------|
| Pipeline feature engineering | 100% | Chỉ đổi nguồn dữ liệu (CSV sang API/DB) |
| Mã huấn luyện mô hình | 100% | Đổi đầu vào, giữ mã |
| Các kiểm tra kiểm định | 90% | Điều chỉnh khoảng kỳ vọng theo phân phối thực |
| Lược đồ nhật ký kiểm toán | 100% | model_version đổi từ "v0.1-synthetic" sang "v1.0" |
| Giao diện trình diễn | 100% | Đổi cấu hình nguồn dữ liệu |
| Logic ngưỡng | Hiệu chỉnh lại | Ngưỡng hiệu chỉnh lại trên dữ liệu thật |

### 8.2 Điều kiện truy cập dữ liệu thật

| # | Điều kiện | Phụ trách |
|---|----------|----------|
| 1 | DPIA được phê duyệt | Compliance |
| 2 | Cơ chế đồng ý của khách hàng vận hành | Product, Compliance |
| 3 | Thỏa thuận truy cập dữ liệu giữa Bank X và nhà cung cấp | Legal |
| 4 | Pipeline ẩn danh hóa | Dev |
| 5 | DPO được chỉ định tại Bank X | Bank X |
| 6 | Môi trường an toàn cho dữ liệu | IT |

---

## Phạm vi và nguyên tắc

1. Dữ liệu tổng hợp không bao giờ dùng để huấn luyện mô hình vận hành; chỉ dùng cho trình diễn, kiểm thử và phát triển.
2. Mô hình xác suất default ở Mục 4.4 là bản đơn giản, không phải scorecard thật; chỉ dùng để sinh nhãn thực tế.
3. Các tương quan giữa biến là ước tính từ thực tiễn ngành; tương quan thực tế có thể khác.
4. Tên và địa chỉ tiếng Việt từ Faker có thể chưa tự nhiên hoàn toàn; chấp nhận được cho trình diễn.
5. Phân phối thu nhập dựa trên số liệu GSO và ước tính cho phân khúc thẻ có lương; phân phối thực của Bank X sẽ được cập nhật khi có.
6. Tham chiếu: `w03-03-feature-availability-matrix` (ưu tiên biến cho MVP), `w03-02-data-quality-scorecard` (chuẩn chất lượng), `w02-03-pdpd-impact-bank-x` (tuân thủ PDPD khi chuyển sang dữ liệu thật).
