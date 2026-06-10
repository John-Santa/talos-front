export interface DialProps {
  value: number
  threshold?: number
  size?: number
}

/** Radial conflict dial with a threshold tick and a center read-out. */
export function Dial({ value, threshold = 15, size = 188 }: DialProps) {
  const sw = 13
  const r = (size - sw) / 2 - 2
  const cx = size / 2
  const circumference = 2 * Math.PI * r
  const col =
    value < threshold * 0.7 ? 'var(--ok)' : value < threshold ? 'var(--warn)' : 'var(--danger)'
  const ang = (threshold / 100) * 360 - 90
  const t = (ang * Math.PI) / 180
  const x1 = cx + (r - sw / 2 - 3) * Math.cos(t)
  const y1 = cx + (r - sw / 2 - 3) * Math.sin(t)
  const x2 = cx + (r + sw / 2 + 3) * Math.cos(t)
  const y2 = cx + (r + sw / 2 + 3) * Math.sin(t)
  return (
    <div className="arc" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--raised)" strokeWidth={sw} />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${Math.max((circumference * value) / 100, 3)} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--tx-faint)" strokeWidth="2.5" />
      </svg>
      <div
        className="val"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
      >
        <span style={{ fontSize: 42, color: col, lineHeight: 1 }}>{value}%</span>
        <span
          className="faint"
          style={{
            fontFamily: 'var(--sans)',
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          conflict
        </span>
      </div>
    </div>
  )
}
