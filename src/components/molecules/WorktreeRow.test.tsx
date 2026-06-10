import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { WorktreeRow } from './WorktreeRow'
import type { Worktree } from '@/domain/types'

const worktree: Worktree = {
  agent: 'iris',
  jiraKey: 'TAL-15',
  branch: 'agent/iris/TAL-15',
  head: 'abc1234',
  module: 'frontend',
  status: 'active',
  ahead: 3,
}

function renderRow(props?: Partial<Parameters<typeof WorktreeRow>[0]>) {
  return render(
    <MemoryRouter>
      <WorktreeRow worktree={worktree} {...props} />
    </MemoryRouter>,
  )
}

describe('WorktreeRow — navigation links', () => {
  it('renders a link to /judgment/:jiraKey for the jiraKey', () => {
    renderRow()
    const link = screen.getByRole('link', { name: /TAL-15/i })
    // Exact check: href must point to judgment
    expect(link).toHaveAttribute('href', '/judgment/TAL-15')
  })

  it('renders a link to /agents/:figura for the agent name', () => {
    renderRow()
    // The agent name (Iris) should be a link to /agents/iris
    const agentLink = screen.getByRole('link', { name: /iris/i })
    expect(agentLink).toHaveAttribute('href', '/agents/iris')
  })

  it('action buttons still call their handlers (link click does not intercept)', async () => {
    const onMerge = vi.fn()
    const onTeardown = vi.fn()
    renderRow({ onMerge, onTeardown })

    await userEvent.click(screen.getByRole('button', { name: 'Mergear' }))
    expect(onMerge).toHaveBeenCalledTimes(1)
    expect(onMerge).toHaveBeenCalledWith(worktree)

    await userEvent.click(screen.getByRole('button', { name: 'Teardown' }))
    expect(onTeardown).toHaveBeenCalledTimes(1)
    expect(onTeardown).toHaveBeenCalledWith(worktree)
  })
})
