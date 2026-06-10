import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewWorktreeDialog } from './NewWorktreeDialog'

describe('NewWorktreeDialog', () => {
  it('requires a valid Jira key before creating', async () => {
    const onCreate = vi.fn()
    render(<NewWorktreeDialog idleAgents={['atlas', 'gaia']} onCreate={onCreate} onCancel={() => {}} />)

    const create = screen.getByRole('button', { name: 'Crear worktree' })
    expect(create).toBeDisabled()

    await userEvent.type(screen.getByLabelText('Jira key'), 'tal-23')
    expect(create).toBeEnabled()

    await userEvent.click(create)
    expect(onCreate).toHaveBeenCalledWith({ figura: 'atlas', jiraKey: 'TAL-23' })
  })
})
