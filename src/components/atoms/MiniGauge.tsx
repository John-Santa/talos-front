export type Tone = 'ok' | 'warn' | 'danger'

const TONE_COLOR: Record<Tone, string> = {
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  danger: 'var(--danger)',
}

export interface MiniGaugeProps {
  value: number
  threshold?: number
  tone?: Tone
}

/** Horizontal conflict gauge with a threshold tick. Bar never fully collapses. */
export function MiniGauge({ value, threshold = 15, tone = 'ok' }: MiniGaugeProps) {
  return (
    <div className="gauge">
      <i style={{ width: `${Math.max(value, 1.5)}%`, background: TONE_COLOR[tone] }} />
      <span className="thr" style={{ left: `${threshold}%` }} />
    </div>
  )
}
