import { Link } from 'react-router-dom'
import { Ag } from '@/components/atoms'
import { AGENTS } from '@/domain/agents'
import type { MergeItem } from '@/domain/types'

/** A row in the merge order: position · figura · jira · ✓ +ahead. */
export function MergeRow({ item }: { item: MergeItem }) {
  const hasConflicts = (item.conflictFiles?.length ?? 0) > 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0' }}>
      <span className="mono tnum" style={{ color: 'var(--tx-faint)', fontSize: 13, width: 16 }}>
        {item.n}
      </span>
      <Ag name={item.agent} size="sm" />
      <span className="ag-name" style={{ fontSize: 13.5 }}>
        {AGENTS[item.agent].name}
      </span>
      <Link
        to={`/judgment/${item.jiraKey}`}
        className="mono dim"
        style={{ fontSize: 12.5, color: 'inherit', textDecoration: 'none' }}
      >
        {item.jiraKey}
      </Link>
      <span style={{ flex: 1 }} />
      {hasConflicts && (
        <span
          data-conflict-files
          title={item.conflictFiles!.join('\n')}
          style={{
            fontSize: 11,
            color: 'var(--warn)',
            background: 'color-mix(in oklch, var(--warn) 12%, transparent)',
            border: '1px solid color-mix(in oklch, var(--warn) 30%, transparent)',
            borderRadius: 4,
            padding: '2px 6px',
          }}
        >
          {item.conflictFiles!.length} conflict{item.conflictFiles!.length !== 1 ? 's' : ''}
        </span>
      )}
      <span className="mono" style={{ fontSize: 12, color: 'var(--ok)' }}>
        {item.ready ? '✓' : '·'} +{item.ahead}
      </span>
    </div>
  )
}
