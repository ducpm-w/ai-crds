# To-Be Workflow — CC Origination with AI-CRDS
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Mô tả quy trình phát hành thẻ tín dụng (CC origination) tại Bank X khi có AI-CRDS. Tài liệu tham chiếu các trạng thái quyết định S1-S5 (`w05-01-decision-architecture.md`), các ngưỡng (`w06-01-threshold-framework.md`) và hệ thống KPI (`w07-01-kpi-tree.md`), và là bản thiết kế nền tảng cho MVP.

Các số liệu về thời gian, tỷ lệ và khối lượng trong tài liệu là giả định lập kế hoạch, sẽ được thay bằng dữ liệu thực của Bank X khi có.

---

## 1. LUỒNG END-TO-END — 5 STAGE

```
┌──────────────────────────────────────────────────────────────┐
│            TO-BE: CC ORIGINATION WITH AI-CRDS                │
│            AI hỗ trợ, con người quyết định                   │
│            Thời gian end-to-end ước tính:                    │
│            1-8 giờ (State 1) đến 1-3 ngày                    │
└──────────────────────────────────────────────────────────────┘

  STAGE 1          STAGE 2           STAGE 3         STAGE 4        STAGE 5
┌──────────┐   ┌─────────────┐   ┌───────────┐   ┌──────────┐   ┌──────────┐
│ Data     │──▶│ Identity &  │──▶│ AI        │──▶│ Human    │──▶│ Post-    │
│ Collect  │   │ Fraud Gate  │   │ Scoring & │   │ Decision │   │ Decision │
│ & Valid. │   │ (song song) │   │ Routing   │   │          │   │          │
│          │   │             │   │           │   │          │   │          │
│ 1-5 giây │   │ 5-30 giây   │   │ 2-5 giây  │   │ 3-35 phút│   │ <1 phút  │
└──────────┘   └─────────────┘   └───────────┘   └──────────┘   └──────────┘
      │               │                │                │              │
  Tự điền từ      eKYC fail        Fraud flag      CO ký quyết    Thông báo từ chối
  app + eKYC      CIC down         AI định tuyến   định cuối      Audit trail
  OCR             Thiếu dữ liệu    S1/S2/S3/S4/S5  cùng           Phát hành thẻ
                  → State 5                        Cho phép       Thông báo khách
                                                   override
```

---

## 2. CHI TIẾT TỪNG STAGE

### Stage 1 — Thu thập và kiểm tra dữ liệu (1-5 giây)

| Thuộc tính | As-Is | To-Be | Cải thiện |
|-----------|-------|-------|-----------|
| Nhập liệu | Nhân viên nhập tay (10-20 phút) | Tự động nhận từ form online/app. Tại chi nhánh, nhân viên nhập và eKYC OCR hỗ trợ. | Giảm khoảng 80% thời gian |
| Kiểm tra dữ liệu | Back-office kiểm tra thủ công | Kiểm tra tự động theo thời gian thực: trường bắt buộc, định dạng, tuổi từ 21, thu nhập > 0, định dạng CCCD. | Phản hồi tức thì, không để lỗi lan xuống các bước sau |
| Kiểm tra trùng | Thủ công hoặc không có | Tự động: cùng CCCD và cùng sản phẩm trong 30 ngày thì gắn cờ. | Tránh xử lý trùng hồ sơ |
| Quyền từ chối của khách | Không có | Khách có thể chọn "Tôi muốn review thủ công": bỏ qua AI, chuyển State 2 (tuân thủ NĐ 356). | Tuân thủ quy định |
| Hệ thống | Nhập CBS thủ công | AI-CRDS application gateway ghi vào CBS | Liền mạch |

Đầu ra: bản ghi hồ sơ đã được kiểm tra, sẵn sàng cho Stage 2.

### Stage 2 — Cổng danh tính và gian lận (5-30 giây, chạy song song)

Thiết kế cốt lõi: toàn bộ kiểm tra chạy song song, không chạy tuần tự.

```
Hồ sơ đã kiểm tra
    │
    ├──[SONG SONG]──┬──────────────┬────────────────┬───────────────┐
    │               │              │                │               │
    ▼               ▼              ▼                ▼               ▼
 eKYC            CIC API       Blacklist        Device          Velocity
 verify          query         check            fingerprint     check
 (VNPT/FPT)     (H2H)         (nội bộ+SIMO)    (chỉ online)    (cùng CCCD
                                                                 30 ngày)
    │               │              │                │               │
    └───────────────┴──────────────┴────────────────┴───────────────┘
                              │
                    ┌─────────┤
                    │         │
               BẤT KỲ LỖI    TẤT CẢ ĐẠT
               hoặc CỜ           │
                    │            │
                    ▼            ▼
              Chuyển        → Stage 3
              S3 hoặc S5    (AI Scoring)
```

| Kiểm tra | Độ trễ | Xử lý khi lỗi | Bắt buộc cho MVP |
|----------|--------|---------------|------------------|
| eKYC | 5-15 giây | State 5 (thử lại / đến chi nhánh) | Có |
| CIC API | 5-30 giây | State 5 (thử lại / truy vấn thủ công) | Có |
| Blacklist nội bộ | < 1 giây | State 3 nếu trùng khớp | Có |
| SIMO | Vài giây | Bỏ qua và ghi nhận trong audit trail | Không (bổ sung ở giai đoạn sau) |
| Device fingerprint | < 1 giây | Bỏ qua (chỉ áp dụng kênh online) | Không (giai đoạn sau MVP) |
| Velocity check | < 1 giây | State 3 nếu kích hoạt | Có (logic đơn giản) |

Đầu ra: kết quả eKYC, dữ liệu CIC và tín hiệu gian lận, làm đầu vào cho Stage 3.

### Stage 3 — AI chấm điểm và định tuyến (2-5 giây)

```
Đầu vào từ Stage 2:
├── Nhân khẩu học khách hàng (CBS/hồ sơ)
├── Dữ liệu CIC (score, dư nợ, DPD, số lần truy vấn)
├── Kết quả eKYC (confidence, face match)
├── Tín hiệu gian lận (blacklist, velocity)
└── Dữ liệu hành vi (CBS, nếu là khách hiện hữu)
    │
    ▼
┌─────────────────────────────┐
│     FEATURE ENGINE          │
│ Tiền xử lý và tạo đặc trưng:│
│ - DTI = nợ / thu nhập       │
│ - Tuổi từ ngày sinh         │
│ - Cờ thu nhập đã xác minh   │
│ - Cờ thin file              │
└─────────────┬───────────────┘
              │
    ┌─────────┼──────────┐
    │         │          │
    ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│ CREDIT │ │ FRAUD  │ │ BIAS   │
│ SCORING│ │ SCORING│ │ MONITOR│
│ MODEL  │ │ MODEL  │ │        │
│        │ │        │ │ Giới   │
│ Đầu ra:│ │ Đầu ra:│ │ tính   │
│ score  │ │ fraud  │ │ Địa lý │
│ conf.  │ │ score  │ │ Tuổi   │
│ explain│ │ flag   │ │ → chỉ  │
│        │ │        │ │ ghi log│
└───┬────┘ └───┬────┘ └───┬────┘
    │          │          │
    └──────────┼──────────┘
               │
    ┌──────────┴──────────┐
    │   ROUTING ENGINE    │
    │                     │
    │ Áp dụng ngưỡng:     │
    │ TH_high = 0.75      │
    │ TH_low = 0.35       │
    │ TH_fraud = 0.40     │
    │ TH_confidence = 0.60│
    │ Dead zone ±0.02     │
    └──────────┬──────────┘
               │
    ┌────┬─────┼─────┬────┐
    ▼    ▼     ▼     ▼    ▼
   S1   S2    S3    S4   S5
```

| Trường đầu ra | Kiểu | Sử dụng bởi |
|---------------|------|-------------|
| `risk_score` | float 0.0-1.0 | Định tuyến, hiển thị cho CO, audit trail |
| `confidence` | float 0.0-1.0 | Định tuyến (< 0.60 chuyển S4), hiển thị cho CO |
| `fraud_score` | float 0.0-1.0 | Định tuyến (> 0.40 chuyển S3), đội fraud |
| `recommendation` | enum | Hiển thị cho CO: APPROVE / REVIEW / ESCALATE |
| `explanation` | danh sách chuỗi | Hiển thị cho CO: 3-5 yếu tố chính. Thông báo từ chối: 3 yếu tố chính. |
| `segment` | enum | existing_customer / new_to_bank / thin_file |
| `ai_label` | boolean | Luật AI 134/2025: nhãn "hỗ trợ bởi AI" |
| `bias_log` | object | Giới tính, địa lý, tuổi: chỉ phục vụ giám sát |

### Stage 4 — Quyết định của con người (thời gian tùy trạng thái)

Cấu trúc thẩm quyền giữ nguyên như hiện tại. Khác biệt chính là CO có sẵn thông tin hỗ trợ từ AI.

| State | Hành động của CO | AI cung cấp | Thời gian | Tham chiếu |
|-------|-----------------|-------------|-----------|-----------|
| S1 (tự động định tuyến duyệt) | Xác nhận theo lô: xem tóm tắt, xác nhận hoặc override. | Risk score, confidence, 3 yếu tố tích cực chính, tóm tắt CIC. | 3-5 phút | `w05-01-decision-architecture.md` |
| S2 (thẩm định tiêu chuẩn) | Thẩm định đầy đủ từng hồ sơ: duyệt, từ chối hoặc leo thang. | Score, confidence, 3 yếu tố rủi ro và 3 yếu tố tích cực chính, CIC đầy đủ, khuyến nghị AI. | 20-35 phút | `w05-01-decision-architecture.md` |
| S3 (ưu tiên gian lận) | Thẩm định tăng cường (EDD): xác nhận hoặc loại trừ gian lận. | Fraud score, danh sách tín hiệu kích hoạt, checklist EDD, kết quả đối chiếu chéo. | 30-60 phút | `w05-01-decision-architecture.md` |
| S4 (leo thang) | CO cấp cao thẩm định toàn diện. | Score, confidence (thấp), cờ bất thường, tín hiệu mâu thuẫn. | 30-60 phút | `w05-01-decision-architecture.md` |
| S5 (cần bổ sung thông tin) | Hệ thống yêu cầu khách bổ sung giấy tờ; CO xử lý khi nhận đủ. | Danh sách dữ liệu thiếu, mẫu yêu cầu. | 10 phút CO, cộng thời gian chờ khách (tối đa 14 ngày) | `w05-01-decision-architecture.md` |

Nguyên tắc không đổi: CO ký quyết định cuối cùng, AI chỉ hỗ trợ ra quyết định. Con người luôn nằm trong vòng quyết định theo Luật TCTD 2024 và Luật AI 134/2025.

### Stage 5 — Sau quyết định (< 1 phút, tự động)

```
CO ký quyết định
    │
    ├── NẾU DUYỆT:
    │   ├── Tạo thông báo duyệt (app/SMS/email)
    │   │   Kèm nhãn: "Quyết định được hỗ trợ bởi AI" (Luật AI)
    │   ├── Kích hoạt hàng đợi phát hành thẻ
    │   ├── Ghi audit trail (24 trường, bất biến)
    │   ├── Bắt đầu giám sát sau phê duyệt
    │   └── Đưa kết quả vào pipeline huấn luyện mô hình (ground truth)
    │
    ├── NẾU TỪ CHỐI:
    │   ├── Tạo thông báo từ chối (`w05-04-adverse-action-flow.md`)
    │   │   Kèm 3 lý do chính (ngôn ngữ dễ hiểu), nhãn AI và thông tin quyền của khách
    │   ├── Gửi đa kênh: app, email, SMS
    │   ├── Ghi audit trail (24 trường)
    │   ├── Bắt đầu bộ đếm lưu trữ PII theo trạng thái cuối
    │   └── Mở kênh khiếu nại / yêu cầu review bởi con người
    │
    └── NẾU TỪ CHỐI DO GIAN LẬN:
        ├── Toàn bộ hành động của nhánh từ chối, cộng thêm:
        ├── Báo cáo SIMO (TT 45/2025)
        ├── Cập nhật blacklist nội bộ
        └── Chuyển cơ quan chức năng (nếu áp dụng)
```

---

## 3. TỔNG HỢP CẢI THIỆN — AS-IS VS TO-BE

| Chỉ số | As-Is | To-Be | Cải thiện | Nguồn |
|--------|-------|-------|-----------|-------|
| Thời gian ra quyết định (S1) | 20-45 phút thẩm định cộng hàng đợi | 3-5 phút xác nhận theo lô | Giảm khoảng 85% | `w05-01-decision-architecture.md` |
| Thời gian ra quyết định (trung vị tổng thể) | 2-4 ngày | 4-8 giờ | Giảm khoảng 80% | Tính toán |
| Năng lực CO cần có | ~10 FTE | ~4,3 FTE | Giảm khoảng 56% | `w05-01-decision-architecture.md` |
| Tính nhất quán | Phụ thuộc từng CO (biến thiên cao) | Mức nền AI cộng nhận định của CO | Được chuẩn hóa | Giá trị cốt lõi của AI-CRDS |
| Truy vấn CIC | Thủ công/batch (vài phút đến vài giờ) | API thời gian thực (5-30 giây) | Giảm khoảng 99% thời gian | Thiết kế tích hợp |
| Phát hiện gian lận | eKYC đạt/không đạt | AI chấm điểm đa tín hiệu | Tăng khoảng 30% khả năng phát hiện (giả định) | `w04-01-damage-model-bank-x.md` |
| Khả năng giải thích | "Không đủ điều kiện" | 3 yếu tố chính và quyền yêu cầu review bởi con người | Phù hợp NĐ 356 và Luật AI | `w05-04-adverse-action-flow.md` |
| Audit trail | ~5-8 trường, thủ công | 24 trường, tự động, bất biến | Sẵn sàng cho thanh tra SBV | `w02-04-sbv-requirements.md` |
| Thông báo từ chối | Thông báo chung chung | Lý do cụ thể, nhãn AI và thông tin quyền | Tuân thủ quy định | `w05-04-adverse-action-flow.md` |
| Giám sát thiên lệch | Không có | Giám sát giới tính, địa lý, tuổi | Phù hợp Luật AI 134/2025 | `w07-04-guardrail-definitions.md` |

---

## 4. SƠ ĐỒ LUỒNG DỮ LIỆU

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  KÊNH       │         │  AI-CRDS    │         │  BANK X     │
│  KHÁCH HÀNG │         │  SYSTEM     │         │  SYSTEMS    │
│             │         │             │         │             │
│ Form online ├────────▶│ Application ├────────▶│ CBS         │
│ Mobile app  │ gửi     │ Gateway     │ ghi     │ (hồ sơ      │
│ Chi nhánh   │         │             │         │  khách hàng)│
└─────────────┘         │      │      │         └──────┬──────┘
                        │      │      │                │ đọc
                        │      ▼      │                ▼
                        │ ┌──────────┐│         ┌─────────────┐
                        │ │Validation││         │ CIC API     │
                        │ │Engine    ││◀────────│ (H2H)       │
                        │ └────┬─────┘│ truy vấn└─────────────┘
                        │      │      │
                        │      ▼      │         ┌─────────────┐
                        │ ┌──────────┐│         │ eKYC        │
                        │ │ Feature  ││◀────────│ Provider    │
                        │ │ Engine   ││ xác thực│ (VNPT/FPT)  │
                        │ └────┬─────┘│         └─────────────┘
                        │      │      │
                        │      ▼      │         ┌─────────────┐
                        │ ┌──────────┐│         │ SIMO        │
                        │ │ Scoring  ││◀────────│ (TT 45)     │
                        │ │ + Routing││ kiểm tra└─────────────┘
                        │ └────┬─────┘│
                        │      │      │
                        │      ▼      │         ┌─────────────┐
                        │ ┌──────────┐│         │ Notification│
                        │ │ CO       ││         │ System      │
                        │ │ Review   ││────────▶│ (SMS/Email/ │
                        │ │ UI       ││ kích hoạt│ Push)      │
                        │ └────┬─────┘│         └─────────────┘
                        │      │      │
                        │      ▼      │         ┌─────────────┐
                        │ ┌──────────┐│         │ Card Ops    │
                        │ │ Audit    ││         │ (Phát hành) │
                        │ │ Trail DB ││────────▶│             │
                        │ └──────────┘│ kích hoạt└────────────┘
                        └─────────────┘
```

---

## 5. PHÂN BỔ TRẠNG THÁI VÀ KHỐI LƯỢNG

Tham chiếu: `w05-01-decision-architecture.md`, `w06-03-approval-rate-curve.md` (TH_high = 0.75). Khối lượng 3.000 hồ sơ mỗi tháng là giả định lập kế hoạch.

| State | % khối lượng | Hồ sơ/tháng | Thời gian CO/hồ sơ | Giờ CO/tháng | Chỉ số chính |
|-------|-------------|------------|--------------------|--------------|--------------|
| S1 Auto-route | 35-45% | ~1.200 | 4 phút (theo lô) | 80 giờ | Tỷ lệ xác nhận theo lô |
| S2 Standard | 25-35% | ~900 | 25 phút (đầy đủ) | 375 giờ | Tỷ lệ override |
| S3 Fraud | 2-5% | ~100 | 45 phút (EDD) | 75 giờ | Tỷ lệ phát hiện gian lận |
| S4 Escalate | 5-10% | ~225 | 45 phút (CO cấp cao) | 169 giờ | Tỷ lệ leo thang |
| S5 Need-info | 8-15% | ~375 | 10 phút (xử lý) | 63 giờ | Tỷ lệ chuyển đổi |
| Tổng | 100% | 3.000 | ~15 phút trung bình | 762 giờ (4,3 FTE) | RARPA |

---

## 6. LỘ TRÌNH TRIỂN KHAI

| Giai đoạn | Phạm vi | Trạng thái vận hành |
|-----------|---------|---------------------|
| MVP | Dữ liệu tổng hợp. Chỉ S1/S2. Giao diện cơ bản. Logistic regression. | Demo luồng end-to-end |
| Shadow | Dữ liệu thực. Đủ 5 trạng thái. AI chạy song song, không ảnh hưởng quyết định. | So sánh AI với quy trình thủ công |
| Limited | AI khuyến nghị, CO thẩm định toàn bộ. Chỉ áp dụng cho nhóm hồ sơ rủi ro thấp. | Vận hành trên một nhóm hồ sơ |
| Full | Toàn bộ hồ sơ, đủ các trạng thái, giám sát đầy đủ. | Vận hành chính thức |

---

## 7. GIẢ ĐỊNH THIẾT KẾ

1. Luồng to-be dựa trên việc Bank X có CIC H2H API. Nếu chỉ truy vấn qua portal thủ công, Stage 2 sẽ chuyển sang truy vấn CIC bất đồng bộ kết hợp State 5.
2. Xử lý song song ở Stage 2 là yếu tố quyết định hiệu năng. Nếu chạy tuần tự, độ trễ tăng 3-5 lần.

---

## 8. THAM CHIẾU

- `w05-01-decision-architecture.md`: chi tiết 5 trạng thái quyết định.
- `w06-01-threshold-framework.md`: logic định tuyến theo ngưỡng.
- `w03-03-feature-availability-matrix.md`: đặc trưng đầu vào.
- `w05-04-adverse-action-flow.md`: luồng thông báo từ chối ở Stage 5.
