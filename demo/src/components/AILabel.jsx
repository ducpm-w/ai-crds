export default function AILabel() {
  return (
    <div style={{
      background:'#1E3A5F', borderBottom:'1px solid #2563EB',
      padding:'7px 24px', display:'flex', alignItems:'center', gap:8,
      fontSize:12, color:'#93C5FD', fontFamily:"'DM Sans',sans-serif",
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>
        <strong style={{color:'#BFDBFE'}}>ⓘ Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo</strong>
        {' '}— Nhân viên tín dụng chịu trách nhiệm ký quyết định cuối cùng.{' '}
        <span style={{opacity:0.6}}>Luật AI 134/2025, Điều 22</span>
      </span>
    </div>
  );
}
