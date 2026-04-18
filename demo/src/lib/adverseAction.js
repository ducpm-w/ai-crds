// Adverse Action Notice — NĐ 356/2025 + Luật AI 134/2025

const REASON_MAP = {
  dti:      'Tỷ lệ nghĩa vụ nợ hiện tại so với thu nhập vượt mức quy định',
  emp:      'Thời gian làm việc tại đơn vị hiện tại chưa đủ yêu cầu tối thiểu',
  cic:      'Lịch sử tín dụng chưa đáp ứng tiêu chuẩn phát hành thẻ',
  dpd:      'Có ghi nhận nợ quá hạn trong lịch sử tín dụng gần đây',
  inq:      'Số lượng yêu cầu vay vốn gần đây cao bất thường',
  income:   'Thu nhập hàng tháng chưa đáp ứng mức tối thiểu yêu cầu',
};

const CUSTOMER_RIGHTS = [
  'Yêu cầu cung cấp thông tin chi tiết từ CIC về hồ sơ tín dụng (miễn phí 1 lần/năm)',
  'Yêu cầu nhân viên tín dụng xem xét lại hồ sơ theo quy trình thủ công',
  'Khiếu nại quyết định trong vòng 30 ngày kể từ ngày nhận thông báo',
  'Nộp đơn lại sau khi cải thiện hồ sơ tín dụng (tối thiểu sau 6 tháng)',
];

export function generateAdverseAction(decision, application) {
  const isFraud = decision.state_routed === 'STATE_3';
  const reasons = isFraud
    ? ['Không thể hoàn tất xác minh thông tin cá nhân theo quy định']
    : (decision.ai_risk_factors ?? []).map(f => REASON_MAP[f.key]).filter(Boolean).slice(0, 3);

  return {
    applicant_name: application?.full_name ?? 'Khách hàng',
    decision_date:  new Date().toLocaleDateString('vi-VN'),
    reasons:        reasons.length ? reasons : ['Hồ sơ chưa đáp ứng tiêu chuẩn phát hành thẻ hiện tại'],
    is_fraud_case:  isFraud,
    customer_rights: isFraud ? [] : CUSTOMER_RIGHTS,
    ai_label:       'Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo',
    ai_law_ref:     'Luật AI 134/2025, Điều 22',
    hotline:        '1900-xxxx',
    email:          'thetin@bank-x.com.vn',
  };
}
