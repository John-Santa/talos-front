import type { DoDItem } from '@/domain/types'

/** A Definition-of-Done checklist row. */
export function DoDRow({ item }: { item: DoDItem }) {
  const ok = item.state === 'done'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          display: 'grid',
          placeItems: 'center',
          fontSize: 11,
          color: ok ? 'var(--ok)' : 'var(--tx-faint)',
          border: `1px solid ${ok ? 'color-mix(in oklch, var(--ok) 40%, transparent)' : 'var(--line-hard)'}`,
          background: ok ? 'var(--ok-bg)' : 'transparent',
        }}
      >
        {ok ? '✓' : '·'}
      </span>
      <span style={{ fontSize: 13.5, flex: 1, minWidth: 0, color: ok ? 'var(--tx)' : 'var(--tx-dim)' }}>
        {item.label}
      </span>
      <span className="mono faint" style={{ fontSize: 11.5 }}>
        {ok ? 'linked' : 'pending'}
      </span>
    </div>
  )
}
