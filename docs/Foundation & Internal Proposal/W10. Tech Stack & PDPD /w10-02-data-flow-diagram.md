# Data Flow Diagram — AI-CRDS (PII Marked)
> **Dự án:** AI-CRDS (AI Credit Risk Decision Support)

---

## Mục đích

Tài liệu mô tả luồng dữ liệu kèm phân loại PII, phục vụ đánh giá tác động xử lý dữ liệu cá nhân (DPIA, Mẫu 10 NĐ 356/2025). Tài liệu là phụ lục của báo cáo DPIA của Bank X.

---

## 1. PII CLASSIFICATION

### 1.1 Data Categories (theo Luật BVDLCN 91/2025)

| Category | Code | Examples in AI-CRDS | Legal treatment |
|---------|------|-------------------|----------------|
| **DLCN cơ bản** (Basic PII) | `PII-B` | Họ tên, DOB, giới tính, địa chỉ, SĐT, email, CCCD | Consent required. Standard protection. |
| **DLCN nhạy cảm** (Sensitive PII) | `PII-S` | Thu nhập, nợ, CIC score, lịch sử tín dụng, thông tin tài chính, hành vi giao dịch NH | Consent riêng bắt buộc. DPIA bắt buộc. Bảo vệ mức cao hơn. |
| **Dữ liệu sinh trắc** (Biometric) | `BIO` | Ảnh khuôn mặt, vân tay, liveness data | AI-CRDS KHÔNG lưu. eKYC provider xử lý. AI-CRDS chỉ nhận kết quả (pass/fail + scores). |
| **Derived data** (Dữ liệu phái sinh) | `DRV` | AI risk score, fraud score, confidence, DTI calculated, segment | Có thể coi là DLCN nếu gắn liền cá nhân (áp dụng theo hướng thận trọng: xử lý như DLCN). |
| **Anonymized / Aggregated** | `ANON` | Model performance stats, approval rate aggregate, vintage analysis | KHÔNG phải DLCN nếu thực sự anonymous. |

### 1.2 PII per Data Field

| # | Field | Category | Source | Stored in AI-CRDS? | Retention |
|---|-------|---------|--------|-------------------|-----------|
| 1 | CCCD number | `PII-B` | Application / eKYC | Có (Tầng 1) | Per terminal state schedule |
| 2 | Full name | `PII-B` | Application / eKYC | Có (Tầng 1) | Per terminal state |
| 3 | Date of birth | `PII-B` | Application / CBS | Có | Per terminal state |
| 4 | Gender | `PII-B` | Application / CBS | Có (bias monitoring only) | Per terminal state |
| 5 | Address | `PII-B` | Application / CBS | Có (Tầng 1) | Per terminal state |
| 6 | Phone number | `PII-B` | Application | Có (Tầng 1) | Per terminal state |
| 7 | Email | `PII-B` | Application | Có (Tầng 1) | Per terminal state |
| 8 | Monthly income | `PII-S` | Application / CBS txn | Có | Pseudonymize when Tầng 1 deleted |
| 9 | Employer name | `PII-S` | Application | Có | Pseudonymize when Tầng 1 deleted |
| 10 | CIC Score | `PII-S` | CIC API | Có (Tầng 2 — audit trail) | 5-10 năm (SBV) |
| 11 | Outstanding debt | `PII-S` | CIC API | Có (Tầng 2) | 5-10 năm |
| 12 | DPD history | `PII-S` | CIC API | Có (Tầng 2) | 5-10 năm |
| 13 | Transaction history | `PII-S` | CBS | Chỉ lưu giá trị tổng hợp (avg balance, salary pattern) — raw transactions NOT stored | Aggregated values in Tầng 2 |
| 14 | Face image | `BIO` | eKYC | Không lưu trong AI-CRDS | Stored at eKYC provider per their policy |
| 15 | Fingerprint | `BIO` | eKYC | Không lưu | eKYC provider |
| 16 | eKYC confidence score | `DRV` | eKYC | Có (Tầng 2) | 5-10 năm |
| 17 | AI risk score | `DRV` | AI-CRDS model | Có (Tầng 2) | 5-10 năm |
| 18 | AI fraud score | `DRV` | AI-CRDS model | Có (Tầng 2) | 5-10 năm |
| 19 | AI explanation | `DRV` | AI-CRDS SHAP | Có (Tầng 2) | 5-10 năm |
| 20 | CO decision | `DRV` | CO action | Có (Tầng 2) | 5-10 năm |

---

## 2. DATA FLOW DIAGRAM — End-to-End

### 2.1 Main Flow with PII Classification

```
┌──────────────┐
│   CUSTOMER   │
│   (Data      │
│    Subject)  │
└──────┬───────┘
       │
       │ PII-B: name, CCCD, DOB, address, phone, email
       │ PII-S: income, employer, employment tenure
       │ BIO: face image, liveness video (eKYC only)
       ▼
┌──────────────────┐
│ 1. APPLICATION   │
│    GATEWAY       │
│    (AI-CRDS)     │
│                  │
│ Receives:        │
│ ├── PII-B     │
│ ├── PII-S     │
│ └── BIO → eKYC  │
│     (NOT stored) │
└──────┬───────────┘
       │
       ├──────────────────────────────────────────────┐
       │                                              │
       ▼                                              ▼
┌──────────────────┐                    ┌──────────────────┐
│ 2a. CBS QUERY    │                    │ 2b. eKYC QUERY   │
│ (Read)           │                    │                  │
│                  │                    │ Send: BIO        │
│ Send: CCCD [PII-B]                   │ (face, CCCD img) │
│ Receive:         │                    │                  │
│ ├── PII-B (demo) │                    │ Receive:         │
│ ├── PII-S (acct) │                    │ ├── pass/fail    │
│ └── PII-S (txn   │                    │ ├── confidence   │
│     aggregated)  │                    │ ├── face_match   │
│                  │                    │ └── doc_authentic │
│ PII-S flows  │                    │ [All DRV, not BIO]│
│   from CBS to    │                    │                  │
│   AI-CRDS        │                    │ BIO stays at  │
└──────┬───────────┘                    │   eKYC provider  │
       │                                └──────┬───────────┘
       │                                       │
       ├──────────────────┐                    │
       │                  │                    │
       ▼                  ▼                    ▼
┌──────────────────┐ ┌──────────────────┐
│ 2c. CIC QUERY    │ │ 2d. BLACKLIST    │
│                  │ │     CHECK        │
│ Send: CCCD [PII-B]│ │                  │
│ Receive:         │ │ Send: CCCD [PII-B]│
│ ├── CIC score    │ │ Receive:         │
│ ├── debt [PII-S] │ │ ├── match/no [DRV]│
│ ├── DPD [PII-S]  │ │ └── blacklist ID │
│ └── inquiries    │ │                  │
│                  │ │ Internal + SIMO  │
└──────┬───────────┘ └──────┬───────────┘
       │                    │
       └────────┬───────────┘
                │
                ▼
┌──────────────────────┐
│ 3. FEATURE ENGINE    │
│    (AI-CRDS)         │
│                      │
│ Input: PII-B + PII-S │
│ Process:             │
│ ├── Calculate DTI    │
│ ├── Derive age       │
│ ├── Normalize income │
│ ├── Encode employer  │
│ └── Impute missing   │
│                      │
│ Output: Feature      │
│ vector [DRV]         │
│ (no raw PII needed   │
│  after this point    │
│  for scoring)        │
└──────┬───────────────┘
       │
       │ DRV only (feature values, not raw PII)
       ▼
┌──────────────────────┐
│ 4. SCORING +         │
│    ROUTING ENGINE    │
│    (AI-CRDS)         │
│                      │
│ Input: Feature [DRV] │
│ Process:             │
│ ├── Credit model     │
│ ├── Fraud model      │
│ ├── Bias monitor     │
│ └── Route to state   │
│                      │
│ Output: [DRV]        │
│ ├── risk_score       │
│ ├── fraud_score      │
│ ├── confidence       │
│ ├── recommendation   │
│ ├── explanation      │
│ └── state routing    │
└──────┬───────────────┘
       │
       │ DRV (scores, explanation)
       │ + PII-B + PII-S (for CO display)
       ▼
┌──────────────────────┐
│ 5. CO REVIEW UI      │
│    (AI-CRDS)         │
│                      │
│ Displays:            │
│ ├── PII-B (name,     │
│ │   DOB, address)    │
│ ├── PII-S (income,   │
│ │   CIC, debt)       │
│ ├── DRV (scores,     │
│ │   explanation)     │
│ └── AI label (Luật   │
│     AI 134/2025)     │
│                      │
│ CO action:           │
│ ├── Approve/Reject   │
│ ├── Override reason  │
│ └── CO notes         │
└──────┬───────────────┘
       │
       │ Decision data [DRV] + CO ID
       ▼
┌──────────────────────┐
│ 6. AUDIT TRAIL DB    │
│    (AI-CRDS)         │
│                      │
│ Stores (Tầng 2):     │
│ ├── Application ID   │
│ ├── Customer hash ID │
│ │   (pseudonymized   │
│ │    CCCD → hash)    │
│ ├── PII-S values     │
│ │   (income, CIC     │
│ │    score, debt —    │
│ │    at decision time)│
│ ├── DRV (all scores) │
│ ├── CO decision      │
│ ├── Override details  │
│ ├── Model version    │
│ └── Timestamp        │
│                      │
│ IMMUTABLE         │
│ Retention 5-10 yr │
│ PII pseudonymized │
│   when Tầng 1 deleted│
└──────┬───────────────┘
       │
       │ Trigger: decision made
       ▼
┌──────────────────────┐      ┌──────────────────────┐
│ 7a. NOTIFICATION     │      │ 7b. CARD OPERATIONS  │
│     SYSTEM           │      │                      │
│                      │      │ If approved:         │
│ Send to customer:    │      │ ├── CBS write        │
│ ├── PII-B (name)     │      │ │   (limit, status)  │
│ ├── Decision result  │      │ └── Card issuance    │
│ ├── Reasons (DRV     │      │     trigger          │
│ │   mapped to plain  │      │                      │
│ │   language)        │      │ If rejected:         │
│ ├── AI label         │      │ └── CBS write        │
│ └── Rights info      │      │     (status only)    │
│                      │      │                      │
│ Channels: SMS, Email,│      │ PII-B flows to   │
│ Push, Letter         │      │   CBS (existing      │
│                      │      │   system, not new)   │
└──────────────────────┘      └──────────────────────┘
```

### 2.2 PII Flow Summary

| Flow | PII types | Direction | Cross-boundary? | PDPD concern |
|------|----------|----------|----------------|-------------|
| Customer → Application Gateway | PII-B, PII-S, BIO | Inbound | No (same bank) | Consent required at collection |
| Gateway → CBS | PII-B (query key) | AI-CRDS → CBS | No (internal) | Authorized access per CBS RBAC |
| CBS → Gateway | PII-B, PII-S | CBS → AI-CRDS | No (internal) | Data minimization: only needed fields |
| Gateway → eKYC | BIO (face, CCCD image) | AI-CRDS → External provider | Có (nhà cung cấp bên ngoài) | Vendor DPA required. BIO NOT stored in AI-CRDS. |
| eKYC → Gateway | DRV (scores only) | External → AI-CRDS | Có | Only derived results, not raw BIO |
| Gateway → CIC | PII-B (CCCD) | AI-CRDS → CIC (SBV) | Có (bên ngoài, thuộc hệ thống SBV) | Authorized under Luật TCTD. Per-query basis. |
| CIC → Gateway | PII-S (credit data) | CIC → AI-CRDS | Có | Authorized. Store in Tầng 2 for audit. |
| Scoring → Audit Trail | DRV + PII-S values | Internal | No | Pseudonymize PII. Immutable. Retention 5-10yr. |
| Notification → Customer | PII-B (name) + DRV (reasons) | Outbound | No | Encrypted in transit (TLS). SMS/email. |
| Gateway → CBS (write) | DRV (decision, limit) | AI-CRDS → CBS | No (internal) | Decision result, not PII. |

### 2.3 Cross-Boundary Data Transfers

| Transfer | From | To | PII involved | Legal basis | Safeguard |
|---------|------|-----|-------------|------------|----------|
| eKYC verification | AI-CRDS | eKYC provider (VNPT/FPT) | BIO (face, CCCD) | Consent + DPA with vendor | BIO NOT stored in AI-CRDS. Vendor DPA. TT 45 compliance. |
| CIC query | AI-CRDS | CIC (SBV) | PII-B (CCCD) | Luật TCTD: mandatory CIC check | Authorized access. Per-query. |
| CIC response | CIC | AI-CRDS | PII-S (credit data) | Luật TCTD | Store in audit trail (Tầng 2). Pseudonymize per retention. |

**Cloud và chuyển dữ liệu xuyên biên giới:** Nếu AI-CRDS đặt trên cloud nước ngoài, toàn bộ việc xử lý dữ liệu là chuyển dữ liệu xuyên biên giới và cần Mẫu 09 NĐ 356 cùng thông báo A05. Bank X chọn cloud trong nước (Viettel hoặc FPT Cloud) để không phát sinh thủ tục này.

---

## 3. DATA LIFECYCLE PER STAGE

```
DATA LIFECYCLE IN AI-CRDS

Collection     Processing      Storage         Deletion
(Stage 1)      (Stage 2-4)     (Stage 5-6)     (Per retention)
    │               │               │               │
    ▼               ▼               ▼               ▼
┌────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│Raw PII │    │Feature   │    │Tầng 1:   │    │Tầng 1:   │
│collected│───▶│engineering│───▶│Raw PII   │───▶│DELETED   │
│(PII-B, │    │(derive,  │    │(app data)│    │(per      │
│PII-S)  │    │normalize)│    │          │    │terminal  │
│        │    │          │    │Tầng 2:   │    │state)    │
│BIO →   │    │DRV:      │    │Pseudo-   │    │          │
│eKYC    │    │scores,   │    │nymized   │    │Tầng 2:   │
│only    │    │features  │    │audit     │    │KEPT 5-10y│
│        │    │          │    │(hash ID, │    │          │
│        │    │          │    │values,   │    │Tầng 3:   │
│        │    │          │    │scores)   │    │PERMANENT │
│        │    │          │    │          │    │(anon     │
│        │    │          │    │Tầng 3:   │    │stats)    │
│        │    │          │    │Anonymized│    │          │
│        │    │          │    │aggregate │    │          │
└────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## 4. Nguyên tắc thiết kế bảo vệ dữ liệu

1. Dữ liệu sinh trắc không bao giờ đi vào kho lưu trữ của AI-CRDS. Nhà cung cấp eKYC xử lý dữ liệu sinh trắc và chỉ trả về kết quả phái sinh (điểm số), đây là nguyên tắc giảm thiểu dữ liệu ngay từ thiết kế.
2. Feature Engine là ranh giới quyền riêng tư chính. Sau bước này, mô hình chỉ nhận giá trị đặc trưng phái sinh. Audit trail lưu giá trị PII-S tại thời điểm quyết định để phục vụ tái hiện quyết định.

## Tài liệu liên quan

- w10-03-pdpd-checklist.md: yêu cầu tuân thủ BVDLCN
- w10-01-tech-stack-bank-x.md: hạ tầng
- w08-03-integration-point-map.md: thiết kế điểm tích hợp
