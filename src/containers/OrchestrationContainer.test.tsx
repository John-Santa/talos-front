import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RepositoryProvider } from '@/data/RepositoryProvider'
import { ViewModeProvider } from '@/app/ViewMode'
import { createFixtureRepository } from '@/data/fixtureRepository'
import { fixtureOrchestration } from '@/data/fixtures/orchestration'
import type { TalosRepository } from '@/data/repository'
import { OrchestrationContainer } from './OrchestrationContainer'

function renderContainer(repo: TalosRepository) {
  return render(
    <RepositoryProvider repository={repo}>
      <ViewModeProvider>
        <MemoryRouter>
          <OrchestrationContainer />
        </MemoryRouter>
      </ViewModeProvider>
    </RepositoryProvider>,
  )
}

/** Type the jiraKey into the type-to-confirm input inside the merge dialog. */
async function typeConfirmPhrase(dialog: HTMLElement, jiraKey: string) {
  const input = within(dialog).getByRole('textbox')
  await userEvent.type(input, jiraKey)
}

// The first fixture worktree's jiraKey (hermes/TAL-15)
const firstWorktreeJiraKey = fixtureOrchestration.worktrees[0]!.jiraKey

describe('OrchestrationContainer — mutation error path', () => {
  it('keeps dialog open and shows error message when mutation rejects', async () => {
    const repo = createFixtureRepository()
    repo.mergeWorktree = vi.fn().mockRejectedValue(new Error('gateway 502'))
    const refetchSpy = vi.spyOn(repo, 'getOrchestration')

    renderContainer(repo)

    // Wait for data to load — fixture has a "Mergear" button per worktree row
    const mergeBtns = await screen.findAllByRole('button', { name: 'Mergear' })
    expect(mergeBtns.length).toBeGreaterThanOrEqual(1)
    // Click the first row's merge button to open the dialog
    await userEvent.click(mergeBtns[0]!)

    // Dialog is now open — type jiraKey to enable confirm (type-to-confirm)
    const dialog = await screen.findByRole('dialog')
    await typeConfirmPhrase(dialog, firstWorktreeJiraKey)

    const confirmBtn = within(dialog).getByRole('button', { name: 'Mergear' })
    await userEvent.click(confirmBtn)

    // Dialog must stay open after failure
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Error message must be visible inside the dialog
    expect(within(screen.getByRole('dialog')).getByRole('alert')).toHaveTextContent('gateway 502')

    // refetch must NOT have been called additionally after the failed mutation
    // initial load = 1 call; mutation failure must not trigger refetch
    expect(refetchSpy).toHaveBeenCalledTimes(1)
  })

  it('calls mergeWorktree with both figura and jiraKey', async () => {
    const repo = createFixtureRepository()
    repo.mergeWorktree = vi.fn().mockResolvedValue(undefined)

    renderContainer(repo)

    const mergeBtns = await screen.findAllByRole('button', { name: 'Mergear' })
    await userEvent.click(mergeBtns[0]!)

    const dialog = await screen.findByRole('dialog')
    await typeConfirmPhrase(dialog, firstWorktreeJiraKey)

    const confirmBtn = within(dialog).getByRole('button', { name: 'Mergear' })
    await userEvent.click(confirmBtn)

    await waitFor(() => {
      expect(repo.mergeWorktree).toHaveBeenCalledWith(
        expect.any(String), // figura
        expect.any(String), // jiraKey
      )
    })
    // Must be called with 2 arguments, not just jiraKey
    const calls = (repo.mergeWorktree as ReturnType<typeof vi.fn>).mock.calls
    expect(calls[0]).toHaveLength(2)
  })

  it('merge dialog requires typing jiraKey before confirm button is enabled (type-to-confirm)', async () => {
    const repo = createFixtureRepository()
    repo.mergeWorktree = vi.fn().mockResolvedValue(undefined)

    renderContainer(repo)

    const mergeBtns = await screen.findAllByRole('button', { name: 'Mergear' })
    await userEvent.click(mergeBtns[0]!)

    const dialog = await screen.findByRole('dialog')

    // Without typing anything, confirm should be disabled
    const confirmBtn = within(dialog).getByRole('button', { name: 'Mergear' })
    expect(confirmBtn).toBeDisabled()

    // Typing the wrong key still disabled
    const input = within(dialog).getByRole('textbox')
    await userEvent.type(input, 'TAL-99')
    expect(confirmBtn).toBeDisabled()

    // Clear and type correct key — button should enable
    await userEvent.clear(input)
    await userEvent.type(input, firstWorktreeJiraKey)
    expect(confirmBtn).not.toBeDisabled()
  })

  it('clears error and closes dialog when mutation succeeds after a prior failure', async () => {
    const repo = createFixtureRepository()
    // First call rejects, second call resolves
    repo.mergeWorktree = vi
      .fn()
      .mockRejectedValueOnce(new Error('first failure'))
      .mockResolvedValueOnce(undefined)

    renderContainer(repo)

    const mergeBtns = await screen.findAllByRole('button', { name: 'Mergear' })
    expect(mergeBtns.length).toBeGreaterThanOrEqual(1)
    await userEvent.click(mergeBtns[0]!)

    // Type jiraKey to enable confirm
    const dialog = await screen.findByRole('dialog')
    await typeConfirmPhrase(dialog, firstWorktreeJiraKey)

    // First attempt — fails
    const confirmBtn = within(dialog).getByRole('button', { name: 'Mergear' })
    await userEvent.click(confirmBtn)

    await waitFor(() => {
      expect(within(screen.getByRole('dialog')).getByRole('alert')).toHaveTextContent('first failure')
    })

    // Second attempt — succeeds: button should still be enabled (typed phrase is still there)
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Mergear' }))

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    // No alert either
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
