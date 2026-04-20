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
  overlay:{ position:'fixed', inset:0, background:'rgba(250, 250, 247, 0.8)', backdropFilter:'blur(4px)',
    display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:24 },
  box:{ background:'#fff', border:'1px solid var(--line)', borderRadius:12, boxShadow:'0 10px 40px rgba(0,0,0,0.05)',
    padding:32, width:'100%', maxWidth:520, fontFamily:"var(--f-sans)", position:'relative' },
  title:{ fontSize:19, fontWeight:700, color:'var(--ink)', marginBottom:8, fontFamily:"var(--f-serif)" },
  sub:{ fontSize:14, color:'var(--mute)', marginBottom:24, lineHeight:1.55 },
  label:{ display:'block', fontSize:11, fontWeight:600, color:'var(--mute)',
    textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 },
  sel:{ width:'100%', background:'var(--canvas)', border:'1px solid var(--line)', borderRadius:6,
    color:'var(--ink)', fontSize:14, padding:'12px 14px', marginBottom:18, outline:'none', cursor:'pointer' },
  ta:{ width:'100%', background:'var(--canvas)', border:'1px solid var(--line)', borderRadius:6,
    color:'var(--ink)', fontSize:14, padding:'12px 14px', minHeight:100, resize:'vertical',
    outline:'none', fontFamily:"var(--f-sans)", boxSizing:'border-box', marginBottom:8 },
  chars:{ fontSize:11, color:'var(--mute-2)', textAlign:'right', marginBottom:18 },
  warn:{ background:'rgba(232,0,29,0.05)', border:'1px solid rgba(232,0,29,0.2)', borderRadius:8,
    padding:'12px 16px', marginBottom:24, display:'flex', gap:12, alignItems:'flex-start' },
  row:{ display:'flex', gap:10, justifyContent:'flex-end', marginTop: 10 },
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
          AI khuyến nghị <strong style={{color:'#D97706'}}>{aiRec}</strong> — bạn chọn{' '}
          <strong style={{color: humanDecision==='APPROVE'?'#059669':'#E8001D'}}>{humanDecision}</strong>.
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8001D" strokeWidth="2" style={{flexShrink:0,marginTop:1}}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{fontSize:13, color:'#991B1B', lineHeight:1.5}}>
              <strong style={{color:'#E8001D'}}>Yêu cầu phê duyệt cấp trên.</strong> Hồ sơ sẽ được gắn cờ để cấp trên xem xét.
            </span>
          </div>
        )}

        <div style={css.row}>
          <button onClick={onClose} className="btn-ghost">
            Huỷ
          </button>
          <button onClick={confirm} disabled={!valid} className="btn-primary" style={{ cursor: valid?'pointer':'not-allowed', background: valid?'var(--ink)':'var(--mute)', borderColor: valid?'var(--ink)':'var(--mute)' }}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
