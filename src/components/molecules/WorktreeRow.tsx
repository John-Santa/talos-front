import { Ag, Pill } from '@/components/atoms'
import { AGENTS } from '@/domain/agents'
import { statusTone } from '@/domain/selectors'
import type { Worktree } from '@/domain/types'
import type { CSSWithVars } from '@/lib/style'

const COLUMNS = '150px 1fr 78px 118px 92px'

export interface WorktreeRowProps {
  worktree: Worktree
  selected?: boolean
}

/** A worktree table row: figura · branch · head · module · status. */
export function WorktreeRow({ worktree, selected }: WorktreeRowProps) {
  const agent = AGENTS[worktree.agent]
  const style: CSSWithVars = {
    gridTemplateColumns: COLUMNS,
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
    </div>
  )
}
