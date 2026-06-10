import { MiniGauge, Pill } from '@/components/atoms'
import { MergeRow, Panel } from '@/components/molecules'
import { mergeTone, overlapTone } from '@/domain/selectors'
import type { Gate, GateState, MergeOrder, Overlap } from '@/domain/types'

const GATE_KIND: Record<GateState, 'ok' | 'warn' | 'danger'> = {
  approved: 'ok',
  pending: 'warn',
  blocked: 'danger',
}

const CARD_STYLE = { padding: '18px 20px' }
const HEAD_STYLE = { marginBottom: 14 }

export interface OrchestrationRailProps {
  mergeOrder: MergeOrder
  overlap: Overlap
  gate: Gate
}

/** Right rail: merge readiness · overlap · gate. */
export function OrchestrationRail({ mergeOrder, overlap, gate }: OrchestrationRailProps) {
  const tone = mergeTone(mergeOrder.conflictRate, mergeOrder.threshold)
  const ready = mergeOrder.items.some((i) => i.ready)
  return (
    <div
      style={{
        padding: '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        overflow: 'auto',
        background: 'var(--bg-2)',
        minHeight: 0,
      }}
    >
      <Panel
        title="Merge readiness"
        meta={<Pill kind={ready ? 'ok' : 'warn'}>{ready ? 'ready' : 'waiting'}</Pill>}
        style={CARD_STYLE}
        headStyle={HEAD_STYLE}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="faint" style={{ fontSize: 12 }}>
            conflict rate
          </span>
          <span className="mono" style={{ fontSize: 12.5, color: `var(--${tone})` }}>
            {mergeOrder.conflictRate}% <span className="faint">/ {mergeOrder.threshold}%</span>
          </span>
        </div>
        <MiniGauge value={mergeOrder.conflictRate} threshold={mergeOrder.threshold} tone={tone} />
        <hr className="hr" style={{ margin: '14px 0 4px' }} />
        {mergeOrder.items.map((item) => (
          <MergeRow key={item.n} item={item} />
        ))}
      </Panel>

      <Panel
        title="Overlap"
        meta={
          <Pill kind={overlapTone(overlap.verdict)} active>
            {overlap.verdict}
          </Pill>
        }
        style={CARD_STYLE}
        headStyle={HEAD_STYLE}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="faint" style={{ fontSize: 12 }}>
            collision rate
          </span>
          <span className="mono" style={{ fontSize: 13 }}>
            {overlap.collisionRate}% · {overlap.pairs.colliding}/{overlap.pairs.total} pairs
          </span>
        </div>
      </Panel>

      <Panel
        title={`Gate ${gate.id}`}
        meta={<Pill kind={GATE_KIND[gate.state]}>{gate.state}</Pill>}
        style={CARD_STYLE}
        headStyle={HEAD_STYLE}
      >
        {gate.note ? (
          <p className="dim" style={{ fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>
            {gate.note}
          </p>
        ) : null}
      </Panel>
    </div>
  )
}
