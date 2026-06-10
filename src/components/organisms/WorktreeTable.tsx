import { Ag, Eyebrow } from '@/components/atoms'
import { WorktreeRow } from '@/components/molecules'
import type { Figura } from '@/domain/agents'
import type { Worktree } from '@/domain/types'

const COLUMNS = '150px 1fr 78px 118px 92px'
const HEADERS = ['agent', 'branch', 'head', 'module', 'status']

export interface WorktreeTableProps {
  worktrees: Worktree[]
  idleAgents: Figura[]
  slots: { used: number; total: number }
  selectedIndex?: number
}

/** Active-worktrees table with a header row and an idle bench. */
export function WorktreeTable({ worktrees, idleAgents, slots, selectedIndex = 0 }: WorktreeTableProps) {
  return (
    <div style={{ padding: '26px 28px', minWidth: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}
      >
        <Eyebrow>Active worktrees · base develop</Eyebrow>
        <span className="faint mono" style={{ fontSize: 12 }}>
          {slots.used} / {slots.total} slots
        </span>
      </div>
      <div
        className="row"
        style={{ gridTemplateColumns: COLUMNS, gap: 16, padding: '0 16px 10px', background: 'none' }}
      >
        {HEADERS.map((h) => (
          <span key={h} className="eyebrow" style={{ fontSize: 10 }}>
            {h}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {worktrees.map((w, i) => (
          <WorktreeRow key={w.branch} worktree={w} selected={i === selectedIndex} />
        ))}
      </div>
      {idleAgents.length > 0 ? (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            border: '1px dashed var(--line-hard)',
            borderRadius: 'var(--r-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span className="faint mono" style={{ fontSize: 12 }}>
            + idle
          </span>
          <span style={{ display: 'flex', gap: 6 }}>
            {idleAgents.map((n) => (
              <Ag key={n} name={n} size="sm" />
            ))}
          </span>
          <span className="faint" style={{ fontSize: 12.5 }}>
            {idleAgents.length} figuras sin worktree — <span className="mono">n</span> para crear
          </span>
        </div>
      ) : null}
    </div>
  )
}
