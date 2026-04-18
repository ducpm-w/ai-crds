import { useState } from 'react';

const REASONS = [
  { v:'REL', l:'REL — Quan hệ khách hàng / Thông tin bổ sung' },
  { v:'INC', l:'INC — Thu nhập đã xác minh thêm' },
  { v:'EMP', l:'EMP — Công việc / Vị trí xác nhận bổ sung' },
  { v:'TMP', l:'TMP — Tình huống tạm thời đã được giải thích' },
  { v:'ERR', l:'ERR — Nghi ngờ lỗi mô hình AI' },
  { v:'POL', l:'POL — Chính sách đặc biệt / Ngoại lệ' },
  { v:'OTH', l:'OTH — Lý do khác' },
];

const css = {
  overlay:{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)',
    display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:24 },
  box:{ background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:12,
    padding:30, width:'100%', maxWidth:500, fontFamily:"'DM Sans',sans-serif" },
  title:{ fontSize:17, fontWeight:700, color:'#E8E8E8', marginBottom:5 },
  sub:{ fontSize:13, color:'#666', marginBottom:22, lineHeight:1.55 },
  label:{ display:'block', fontSize:11, fontWeight:700, color:'#555',
    textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 },
  sel:{ width:'100%', background:'#222', border:'1px solid #333', borderRadius:6,
    color:'#E8E8E8', fontSize:13, padding:'9px 11px', marginBottom:14, outline:'none' },
  ta:{ width:'100%', background:'#222', border:'1px solid #333', borderRadius:6,
    color:'#E8E8E8', fontSize:13, padding:'9px 11px', minHeight:80, resize:'vertical',
    outline:'none', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box', marginBottom:4 },
  chars:{ fontSize:11, color:'#444', textAlign:'right', marginBottom:14 },
  warn:{ background:'#2A1A1A', border:'1px solid #7F1D1D', borderRadius:6,
    padding:'9px 13px', marginBottom:18, display:'flex', gap:9, alignItems:'flex-start' },
  row:{ display:'flex', gap:8, justifyContent:'flex-end' },
};

export default function OverrideModal({ isOpen, onClose, onConfirm, aiRec, humanDecision }) {
  const [cat, setCat] = useState('');
  const [txt, setTxt] = useState('');
  if (!isOpen) return null;

  const needsSup = (humanDecision === 'APPROVE' && aiRec !== 'APPROVE') ||
                   (humanDecision === 'REJECT'  && aiRec === 'APPROVE');
  const valid = cat && txt.trim().length >= 20;

  function confirm() {
    if (!valid) return;
    onConfirm({ override_flag:true, override_reason_category:cat,
      override_reason_text:txt.trim(), override_supervisor_required:needsSup });
    setCat(''); setTxt('');
  }

  return (
    <div style={css.overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={css.box}>
        <div style={css.title}>⚠️ Ghi nhận lý do override</div>
        <div style={css.sub}>
          AI khuyến nghị <strong style={{color:'#F59E0B'}}>{aiRec}</strong> — bạn chọn{' '}
          <strong style={{color: humanDecision==='APPROVE'?'#22C55E':'#EF4444'}}>{humanDecision}</strong>.
          Vui lòng ghi nhận lý do theo quy định.
        </div>

        <label style={css.label}>Danh mục lý do *</label>
        <select style={css.sel} value={cat} onChange={e=>setCat(e.target.value)}>
          <option value="">-- Chọn danh mục --</option>
          {REASONS.map(r=><option key={r.v} value={r.v}>{r.l}</option>)}
        </select>

        <label style={css.label}>Lý do chi tiết * (≥20 ký tự)</label>
        <textarea style={css.ta} value={txt} onChange={e=>setTxt(e.target.value)}
          placeholder="Mô tả lý do cụ thể..." maxLength={500} />
        <div style={css.chars}>{txt.length}/500</div>

        {needsSup && (
          <div style={css.warn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" style={{flexShrink:0,marginTop:2}}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{fontSize:12, color:'#FCA5A5', lineHeight:1.5}}>
              <strong>Yêu cầu phê duyệt cấp trên.</strong> Hồ sơ sẽ được gắn cờ để cấp trên xem xét.
            </span>
          </div>
        )}

        <div style={css.row}>
          <button onClick={onClose} style={{background:'none', border:'1px solid #333', color:'#666',
            padding:'8px 18px', borderRadius:6, cursor:'pointer', fontSize:13, fontWeight:600}}>
            Huỷ
          </button>
          <button onClick={confirm} disabled={!valid} style={{
            background: valid?'#3B82F6':'#222', border:'none',
            color: valid?'#fff':'#555', padding:'8px 18px',
            borderRadius:6, cursor: valid?'pointer':'not-allowed', fontSize:13, fontWeight:700 }}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
