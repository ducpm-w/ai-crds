export default function DemoWatermark() {
  return (
    <div style={{
      position:'fixed', top:96, right:16, zIndex:9999,
      pointerEvents:'none', userSelect:'none',
      background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)',
      borderRadius:4, padding:'3px 9px',
      fontSize:10, fontWeight:700, color:'rgba(239,68,68,0.55)',
      fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.1em',
    }}>
      SYNTHETIC DATA — DEMO ONLY
    </div>
  );
}
