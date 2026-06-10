import { Ag, Button, Pill } from '@/components/atoms'
import { AGENTS } from '@/domain/agents'
import { statusTone } from '@/domain/selectors'
import type { Worktree } from '@/domain/types'
import type { CSSWithVars } from '@/lib/style'

export const WORKTREE_COLUMNS_BASE = '140px 1fr 68px 104px 80px'
const ACTIONS_COL = '132px'

export interface WorktreeRowProps {
  worktree: Worktree
  selected?: boolean
  onMerge?: (worktree: Worktree) => void
  onTeardown?: (worktree: Worktree) => void
}

/** A worktree table row: figura · branch · head · module · status · actions. */
export function WorktreeRow({ worktree, selected, onMerge, onTeardown }: WorktreeRowProps) {
  const agent = AGENTS[worktree.agent]
  const hasActions = Boolean(onMerge || onTeardown)
  const style: CSSWithVars = {
    gridTemplateColumns: hasActions ? `${WORKTREE_COLUMNS_BASE} ${ACTIONS_COL}` : WORKTREE_COLUMNS_BASE,
    gap: 16,
    '--c': `var(${agent.hueToken})`,
  }
  return (
    <div className={`row${selected ? ' sel' : ''}`} style={style}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Ag name={worktree.agent} />
        <span className="ag-name">{agent.name}</span>
      </span>
      <span className="mono" style={{ fontSize: 12.5, color: 'var(--tx-dim)', whiteSpace: 'nowrap' }}>
        agent/{worktree.agent}/<span style={{ color: 'var(--tx)' }}>{worktree.jiraKey}</span>
      </span>
      <span className="mono faint" style={{ fontSize: 12.5 }}>
        {worktree.head}
      </span>
      <span className="mono" style={{ fontSize: 12, color: 'var(--tx-dim)', whiteSpace: 'nowrap' }}>
        module:{worktree.module}
      </span>
      <Pill kind={statusTone(worktree.status)} active>
        {worktree.status}
      </Pill>
      {hasActions ? (
        <span style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          {onMerge ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onMerge(worktree)
              }}
            >
              Mergear
            </Button>
          ) : null}
          {onTeardown ? (
            <Button
              size="sm"
              variant="danger"
              onClick={(e) => {
                e.stopPropagation()
                onTeardown(worktree)
              }}
            >
              Teardown
            </Button>
          ) : null}
        </span>
      ) : null}
    </div>
  )
}
