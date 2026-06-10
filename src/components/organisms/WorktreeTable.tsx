import { Ag, Button, Eyebrow } from '@/components/atoms'
import { WorktreeRow, WORKTREE_COLUMNS_BASE } from '@/components/molecules'
import type { Figura } from '@/domain/agents'
import type { Worktree } from '@/domain/types'

const HEADERS = ['agent', 'branch', 'head', 'module', 'status']
const ACTIONS_COL = '132px'

export interface WorktreeTableProps {
  worktrees: Worktree[]
  idleAgents: Figura[]
  slots: { used: number; total: number }
  selectedIndex?: number
  onNew?: () => void
  onMerge?: (worktree: Worktree) => void
  onTeardown?: (worktree: Worktree) => void
}

/** Active-worktrees table with a header row, per-row actions and an idle bench. */
export function WorktreeTable({
  worktrees,
  idleAgents,
  slots,
  selectedIndex = 0,
  onNew,
  onMerge,
  onTeardown,
}: WorktreeTableProps) {
  const hasActions = Boolean(onMerge || onTeardown)
  const headerCols = hasActions ? `${WORKTREE_COLUMNS_BASE} ${ACTIONS_COL}` : WORKTREE_COLUMNS_BASE

  return (
    <div style={{ padding: '26px 28px', minWidth: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <Eyebrow>Active worktrees · base develop</Eyebrow>
        <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="faint mono" style={{ fontSize: 12 }}>
            {slots.used} / {slots.total} slots
          </span>
          {onNew ? (
            <Button variant="primary" size="sm" onClick={onNew}>
              + Nuevo worktree
            </Button>
          ) : null}
        </span>
      </div>

      <div
        className="row"
        style={{ gridTemplateColumns: headerCols, gap: 16, padding: '0 16px 10px', background: 'none' }}
      >
        {HEADERS.map((h) => (
          <span key={h} className="eyebrow" style={{ fontSize: 10 }}>
            {h}
          </span>
        ))}
        {hasActions ? <span /> : null}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {worktrees.map((w, i) => (
          <WorktreeRow
            key={w.branch}
            worktree={w}
            selected={i === selectedIndex}
            onMerge={onMerge}
            onTeardown={onTeardown}
          />
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
            {idleAgents.length} figuras sin worktree
          </span>
        </div>
      ) : null}
    </div>
  )
}
