import { Ag } from '@/components/atoms'
import { AGENTS } from '@/domain/agents'
import type { MergeItem } from '@/domain/types'

/** A row in the merge order: position · figura · jira · ✓ +ahead. */
export function MergeRow({ item }: { item: MergeItem }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0' }}>
      <span className="mono tnum" style={{ color: 'var(--tx-faint)', fontSize: 13, width: 16 }}>
        {item.n}
      </span>
      <Ag name={item.agent} size="sm" />
      <span className="ag-name" style={{ fontSize: 13.5 }}>
        {AGENTS[item.agent].name}
      </span>
      <span className="mono dim" style={{ fontSize: 12.5 }}>
        {item.jiraKey}
      </span>
      <span style={{ flex: 1 }} />
      <span className="mono" style={{ fontSize: 12, color: 'var(--ok)' }}>
        {item.ready ? '✓' : '·'} +{item.ahead}
      </span>
    </div>
  )
}
