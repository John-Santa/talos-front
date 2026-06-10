import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorktreeTable } from './WorktreeTable'
import { fixtureOrchestration } from '@/data/fixtures/orchestration'

describe('WorktreeTable', () => {
  const { worktrees, idleAgents, slots } = fixtureOrchestration

  it('renders both worktrees, the slot count and the idle bench', () => {
    render(<WorktreeTable worktrees={worktrees} idleAgents={idleAgents} slots={slots} />)
    expect(screen.getByText('TAL-15')).toBeInTheDocument()
    expect(screen.getByText('TAL-22')).toBeInTheDocument()
    expect(screen.getByText('2 / 7 slots')).toBeInTheDocument()
    expect(screen.getByText(/5 figuras sin worktree/)).toBeInTheDocument()
    expect(screen.getAllByText('active')).toHaveLength(2)
  })
})
