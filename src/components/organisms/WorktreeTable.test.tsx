import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { WorktreeTable } from './WorktreeTable'
import { fixtureOrchestration } from '@/data/fixtures/orchestration'
import type { ComponentProps } from 'react'

function renderTable(props: ComponentProps<typeof WorktreeTable>) {
  return render(
    <MemoryRouter>
      <WorktreeTable {...props} />
    </MemoryRouter>,
  )
}

describe('WorktreeTable', () => {
  const { worktrees, idleAgents, slots } = fixtureOrchestration

  it('renders both worktrees, the slot count and the idle bench', () => {
    renderTable({ worktrees, idleAgents, slots })
    expect(screen.getByText('TAL-15')).toBeInTheDocument()
    expect(screen.getByText('TAL-22')).toBeInTheDocument()
    expect(screen.getByText('2 / 7 slots')).toBeInTheDocument()
    expect(screen.getByText(/5 figuras sin worktree/)).toBeInTheDocument()
    expect(screen.getAllByText('active')).toHaveLength(2)
  })

  it('shows empty state message when worktrees is empty', () => {
    renderTable({ worktrees: [], idleAgents: [], slots: { used: 0, total: 7 } })
    expect(screen.getByText('No hay worktrees activos')).toBeInTheDocument()
  })

  it('empty state CTA calls onNew when clicked', async () => {
    const onNew = vi.fn()
    renderTable({ worktrees: [], idleAgents: [], slots: { used: 0, total: 7 }, onNew })
    // Both the header and the empty-state panel render a CTA; click the first one
    const ctaBtns = screen.getAllByRole('button', { name: /nuevo worktree/i })
    expect(ctaBtns.length).toBeGreaterThanOrEqual(1)
    await userEvent.click(ctaBtns[0]!)
    expect(onNew).toHaveBeenCalledTimes(1)
  })

  it('does not show empty state when worktrees is non-empty', () => {
    renderTable({ worktrees, idleAgents, slots })
    expect(screen.queryByText('No hay worktrees activos')).not.toBeInTheDocument()
  })
})
