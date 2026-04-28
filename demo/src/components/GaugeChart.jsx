// Score display — large number only, no chart
export default function GaugeChart({ value = 0, size = 220 }) {
  const v     = Math.max(0, Math.min(1, value));
  const score = Math.round(v * 100);
  const color = v >= 0.75 ? '#22C55E' : v >= 0.35 ? '#F59E0B' : '#E8001D';
  const bg    = v >= 0.75 ? 'rgba(34,197,94,0.06)' : v >= 0.35 ? 'rgba(245,158,11,0.06)' : 'rgba(232,0,29,0.06)';
  const label = v >= 0.75 ? 'RỦI RO THẤP' : v >= 0.35 ? 'TRUNG BÌNH' : 'RỦI RO CAO';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: bg, border: `1px solid ${color}30`, borderRadius: 4,
      padding: '28px 16px', margin: '0 auto', userSelect: 'none',
    }}>
      {/* Score number */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: size * 0.45,
        fontWeight: 800,
        color,
        lineHeight: 1,
        letterSpacing: '-0.04em',
        filter: `drop-shadow(0 0 18px ${color}35)`,
      }}>
        {score}
      </div>
      {/* Out of 100 */}
      <div style={{
        fontFamily: "'Geist', sans-serif",
        fontSize: 13,
        color: '#8A8680',
        marginTop: 6,
        letterSpacing: '0.02em',
      }}>
        / 100
      </div>
      {/* Risk label */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        fontWeight: 700,
        color,
        letterSpacing: '0.12em',
        marginTop: 10,
        padding: '4px 10px',
        border: `1px solid ${color}40`,
        borderRadius: 2,
      }}>
        {label}
      </div>
    </div>
  );
}
