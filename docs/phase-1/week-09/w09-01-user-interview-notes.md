# User Interview Notes — Credit Officers
> **Tags:** `[Product]` `[UX]` `[Research]`
> **Dự án:** AI-CRDS
> **Tuần:** Week 9
> **Version:** v1.0
> **Ngày:** 09/04/2026

---

## Mục đích

Capture insights từ CO interviews để inform UX design, override governance, và trust calibration. Target: 3-5 interviews trước khi design.

**⚠️ STATUS: CHƯA INTERVIEW.** File này chứa interview guide + template. Khi interview xong → fill actual notes vào Section 3.

---

## 1. INTERVIEW GUIDE — 5 Câu hỏi Core

### Setup (5 phút)

```
"Cảm ơn anh/chị dành thời gian. Tôi đang nghiên cứu quy trình
xét duyệt CC để cải thiện công cụ hỗ trợ cho Credit Officers.
Không có câu trả lời đúng/sai. Tôi muốn hiểu workflow thật
của anh/chị. Được phép ghi chú không?"
```

### Q1 — Current Workflow (10 phút)

```
"Anh/chị mô tả 1 ngày làm việc bình thường không?
Từ lúc nhận hồ sơ đến lúc ký quyết định?"

Probes:
- Bao nhiêu hồ sơ review/ngày?
- Tools nào dùng? CBS, Excel, CIC portal?
- Bao lâu per hồ sơ?
- Bước nào mất thời gian nhất?
- Bước nào boring/lặp lại nhất?
```

**Observe:** Bao nhiêu bước thật (vs quy trình trên giấy)? Tool switching? Workarounds?

### Q2 — Decision Making (10 phút)

```
"Khi nhìn vào 1 hồ sơ, anh/chị quyết định approve/reject
dựa trên cái gì đầu tiên?
Top 3 factors quan trọng nhất là gì?"

Probes:
- CIC score quan trọng cỡ nào?
- Thu nhập hay DTI?
- Employer có quan trọng không?
- Có "red flags" tức thì nào không? (nhìn vào là reject ngay)
- Có "green flags" tức thì nào không?
```

**Observe:** Mental model của CO. Liệu CO có dùng informal rules không documented?

### Q3 — Pain Points (10 phút)

```
"Loại hồ sơ nào khó quyết định nhất?
Tại sao? Thường mất bao lâu cho những case đó?"

Probes:
- Ví dụ cụ thể case khó gần đây?
- Khi không chắc chắn, hỏi ai?
- Có quy trình escalate formal không?
- Case nào anh/chị vẫn nghĩ lại "giá mà mình quyết khác"?
```

**Observe:** Edge cases. Borderline cases. Cases where CO wished they had more information.

### Q4 — Trust in AI (5 phút)

```
"Nếu có 1 hệ thống AI đưa ra score từ 0-100 và lý do
tại sao score đó, anh/chị sẽ dùng nó như thế nào?
Điều gì khiến anh/chị tin/không tin?"

Probes:
- Muốn thấy gì trên màn hình?
- AI nói approve, anh/chị có approve theo không? Tại sao?
- AI nói reject, anh/chị có reject theo không?
- Nếu AI sai 1 lần, anh/chị có dùng tiếp không?
```

**Observe:** Resistance points. Trust conditions. Deal-breakers.

### Q5 — Override (5 phút)

```
"Có bao giờ anh/chị muốn override quyết định hệ thống không?
Ví dụ: hệ thống nói approve nhưng anh/chị muốn reject?"

Probes:
- Bao lâu 1 lần override?
- Lý do phổ biến nhất?
- Khi override, ai cần biết?
- Anh/chị có ngại override không? Tại sao?
```

**Observe:** Override frequency, reasons, perceived authority, fear of consequences.

### Closing (5 phút)

```
"Nếu anh/chị có thể thay đổi 1 thứ trong quy trình hiện tại,
đó sẽ là gì?"
"Cảm ơn rất nhiều. Tôi có thể quay lại hỏi thêm sau không?"
```

---

## 2. INTERVIEW LOGISTICS

| Item | Plan |
|------|------|
| **Target** | 3-5 Credit Officers. Mix: 1-2 Junior CO, 1-2 Senior CO, 1 Fraud Analyst (nếu có). |
| **Duration** | 30-45 phút per interview. Informal OK. |
| **Location** | CO workspace hoặc meeting room tại bank. Coffee OK. |
| **Recording** | Notes only (no audio/video — CO có thể uncomfortable). Take verbatim quotes khi possible. |
| **Consent** | Verbal: "Tôi ghi chú để thiết kế tool tốt hơn. Tên anh/chị sẽ ẩn danh." |
| **Incentive** | None needed — inhouse advantage. Có thể buy coffee. |

### Scheduling

| # | Role | Target Date | Status |
|---|------|-----------|--------|
| 1 | Junior/Mid CO | Week 9 | ❌ Chưa schedule |
| 2 | Junior/Mid CO | Week 9 | ❌ Chưa schedule |
| 3 | Senior CO | Week 9 | ❌ Chưa schedule |
| 4 | Senior CO / Supervisor | Week 9 | ❌ Chưa schedule |
| 5 | Fraud Analyst (nếu có) | Week 9 | ❌ Chưa schedule |

---

## 3. INTERVIEW NOTES — Template per Interview

### Interview #1

| Attribute | Value |
|-----------|-------|
| **Role** | ❓ Credit Officer / Senior CO / Fraud Analyst |
| **Experience** | ❓ X năm |
| **Date** | ❓ DD/MM/YYYY |
| **Duration** | ❓ min |

**Q1 — Workflow:**
- ❓ Pending interview

**Q2 — Decision factors (top 3):**
1. ❓
2. ❓
3. ❓

**Q3 — Pain points:**
1. ❓
2. ❓

**Q4 — Trust/resistance signals:**
- ❓

**Q5 — Override behavior:**
- ❓

**Key quotes (verbatim):**
- ❓ "..."

**What surprised me:**
- ❓

**What confirmed assumptions:**
- ❓

**What contradicted assumptions:**
- ❓

**Design implications:**
- ❓

---

*(Copy template trên cho Interview #2, #3, #4, #5)*

---

## 4. SYNTHESIS — After All Interviews

### 4.1 Common Patterns (across interviews)

| Pattern | Evidence (how many COs mentioned) | Design implication |
|---------|----------------------------------|-------------------|
| ❓ | ❓/5 | ❓ |

### 4.2 Top Decision Factors (consensus)

| Rank | Factor | Mentioned by | Align with feature-availability-matrix.md? |
|------|--------|-------------|-------------------------------------------|
| 1 | ❓ | ❓/5 | ❓ |
| 2 | ❓ | ❓/5 | ❓ |
| 3 | ❓ | ❓/5 | ❓ |

### 4.3 Trust Conditions (what CO needs to trust AI)

| Condition | Mentioned by | Implementation |
|----------|-------------|---------------|
| ❓ | ❓/5 | ❓ |

### 4.4 Override Patterns

| Override type | Frequency (CO estimate) | Reason | Design response |
|-------------|----------------------|--------|----------------|
| ❓ | ❓ | ❓ | ❓ |

---

## Tracking

- [ ] ⚠️ **Đã interview ≥ 3 CO chưa?** Nếu chưa → schedule NGAY tuần này. Informal 30 phút là đủ.
- [ ] Key insights captured?
- [ ] Synthesis done (Section 4)?
- [ ] Design implications fed into ux-wireframes-notes.md?
- [ ] Override insights fed into override-governance.md?
- [ ] Trust insights fed into trust-calibration-guide.md?

---

## Ghi Chú

1. **Interviews TRƯỚC design.** Không design UX rồi mới hỏi CO — hỏi trước, design sau.
2. **Verbatim quotes rất valuable** — dùng trong proposal Week 11 ("Credit Officers nói...").
3. **Nếu không kịp interview Week 9** → ít nhất 1-2 informal conversations. Ghi notes. Better than nothing.
4. **Cross-reference:** workflow-as-is.md (validate as-is flow), ux-wireframes-notes.md (design based on interviews), trust-calibration-guide.md (trust conditions from Q4).