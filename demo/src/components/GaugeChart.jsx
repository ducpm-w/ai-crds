// SVG semicircle gauge  — 0=high risk (red) … 1=low risk (green)
export default function GaugeChart({ value = 0, size = 200 }) {
  const cx = size / 2, cy = size * 0.54, r = size * 0.36, sw = size * 0.07;
  const v  = Math.max(0.001, Math.min(0.999, value));
  const a  = v * Math.PI;
  const ix = cx - r * Math.cos(a), iy = cy - r * Math.sin(a);
  const sx = cx - r, ex = cx + r;
  const color = v >= 0.75 ? '#22C55E' : v >= 0.35 ? '#F59E0B' : '#E8001D';
  const label = v >= 0.75 ? 'RỦI RO THẤP' : v >= 0.35 ? 'RỦI RO TRBÌNH' : 'RỦI RO CAO';
  const la = v > 0.5 ? 1 : 0;

  // Zone arcs helper
  const arc = (v1, v2) => {
    const x1 = cx - r * Math.cos(v1*Math.PI), y1 = cy - r * Math.sin(v1*Math.PI);
    const x2 = cx - r * Math.cos(v2*Math.PI), y2 = cy - r * Math.sin(v2*Math.PI);
    const la2 = (v2 - v1) > 0.5 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${la2} 0 ${x2} ${y2}`;
  };

  return (
    <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size*0.65}`} style={{display:'block',margin:'0 auto'}}>
      {/* Zone backgrounds */}
      <path d={arc(0, 0.35)}  fill="none" stroke="rgba(232,0,29,0.14)"  strokeWidth={sw} />
      <path d={arc(0.35,0.75)} fill="none" stroke="rgba(245,158,11,0.14)" strokeWidth={sw} />
      <path d={arc(0.75,1)}   fill="none" stroke="rgba(34,197,94,0.14)"  strokeWidth={sw} />
      {/* Track */}
      <path d={`M ${sx} ${cy} A ${r} ${r} 0 0 0 ${ex} ${cy}`}
        fill="none" stroke="#E4E2DC" strokeWidth={sw} strokeLinecap="round" />
      {/* Value fill */}
      <path d={`M ${sx} ${cy} A ${r} ${r} 0 ${la} 0 ${ix} ${iy}`}
        fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        style={{filter:`drop-shadow(0 0 5px ${color}50)`}} />
      {/* Dot */}
      <circle cx={ix} cy={iy} r={sw*0.62} fill={color} />
      {/* Score */}
      <text x={cx} y={cy - r*0.12} textAnchor="middle" fill={color}
        fontSize={size*0.17} fontWeight="700" fontFamily="'JetBrains Mono',monospace">
        {Math.round(v*100)}
      </text>
      <text x={cx} y={cy + r*0.1} textAnchor="middle" fill="#8A8680"
        fontSize={size*0.058} fontFamily="'Geist',sans-serif">/ 100</text>
      <text x={cx} y={cy + r*0.27} textAnchor="middle" fill={color}
        fontSize={size*0.062} fontWeight="700" fontFamily="'Geist',sans-serif">
        {label}
      </text>
      {/* Scale */}
      <text x={sx-2} y={cy+size*0.07} textAnchor="middle" fill="#8A8680" fontSize={size*0.052} fontFamily="'JetBrains Mono',monospace">0</text>
      <text x={ex+2} y={cy+size*0.07} textAnchor="middle" fill="#8A8680" fontSize={size*0.052} fontFamily="'JetBrains Mono',monospace">100</text>
    </svg>
  );
}
