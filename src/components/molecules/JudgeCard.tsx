import { Icon, Pill } from '@/components/atoms'
import type { Judge } from '@/domain/types'

/** A blind judge's verdict card. */
export function JudgeCard({ judge }: { judge: Judge }) {
  const ok = judge.verdict === 'APPROVED'
  const col = ok ? 'var(--ok)' : 'var(--warn)'
  return (
    <div
      className="panel panel-pad"
      style={{ flex: 1, borderColor: `color-mix(in oklch, ${col} 24%, var(--line))` }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              display: 'grid',
              placeItems: 'center',
              background: 'var(--surface-2)',
              border: '1px solid var(--line-hard)',
            }}
          >
            <Icon k="judgment" />
          </span>
          <span className="mono" style={{ fontSize: 13.5 }}>
            {judge.id}
          </span>
        </span>
        <Pill kind={ok ? 'ok' : 'warn'} active>
          {judge.verdict}
        </Pill>
      </div>
      <p className="dim" style={{ fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>
        {judge.note}
      </p>
      <div className="faint mono" style={{ fontSize: 11, marginTop: 14 }}>
        blind · contexto fresco ≠ implementor
      </div>
    </div>
  )
}
