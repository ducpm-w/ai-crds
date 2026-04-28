export default function AILabel() {
  return (
    <div style={{
      background:'#1E3A5F', borderBottom:'1px solid #2563EB',
      padding:'7px 24px', display:'flex', alignItems:'center', gap:8,
      fontSize:12, color:'#93C5FD', fontFamily:"'DM Sans',sans-serif",
    }}>
      <span>
        <strong style={{color:'#BFDBFE'}}>ⓘ Quyết định được hỗ trợ bởi hệ thống trí tuệ nhân tạo</strong>
        {' '}— Nhân viên tín dụng chịu trách nhiệm ký quyết định cuối cùng.{' '}
        <span style={{opacity:0.6}}>Luật AI 134/2025, Điều 22</span>
      </span>
    </div>
  );
}
