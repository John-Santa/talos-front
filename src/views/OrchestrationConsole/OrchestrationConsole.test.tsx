import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from '@/test/render'
import { OrchestrationConsole } from './OrchestrationConsole'
import { fixtureOrchestration } from '@/data/fixtures/orchestration'

describe('OrchestrationConsole', () => {
  it('renders the sidebar nav, worktrees, rail and gate', () => {
    renderApp(<OrchestrationConsole snapshot={fixtureOrchestration} />, { route: '/orchestration' })
    expect(screen.getByRole('link', { name: /Orchestration/ })).toBeInTheDocument()
    expect(screen.getByText('ZEUS')).toBeInTheDocument()
    expect(screen.getByText('TAL-22')).toBeInTheDocument()
    expect(screen.getByText('Merge readiness')).toBeInTheDocument()
    expect(screen.getByText('Gate HG3')).toBeInTheDocument()
    expect(screen.getByText(/Merge final a main espera a ZEUS/)).toBeInTheDocument()
  })

  it('toggles the mobile nav drawer via the hamburger', () => {
    // The hamburger is display:none on desktop (shown via media query on narrow),
    // so jsdom keeps it out of the a11y tree — query with hidden + fireEvent.
    renderApp(<OrchestrationConsole snapshot={fixtureOrchestration} />, { route: '/orchestration' })
    const aside = document.querySelector('aside')
    expect(aside).toHaveAttribute('data-open', 'false')
    fireEvent.click(screen.getByTestId('nav-toggle'))
    expect(aside).toHaveAttribute('data-open', 'true')
  })

  it('surfaces friendly action buttons that fire the callbacks', async () => {
    const user = userEvent.setup()
    const actions = { onNew: vi.fn(), onMerge: vi.fn(), onTeardown: vi.fn() }
    renderApp(<OrchestrationConsole snapshot={fixtureOrchestration} actions={actions} />, {
      route: '/orchestration',
    })
    await user.click(screen.getByRole('button', { name: '+ Nuevo worktree' }))
    expect(actions.onNew).toHaveBeenCalledTimes(1)

    const teardownButtons = screen.getAllByRole('button', { name: 'Teardown' })
    await user.click(teardownButtons[0]!)
    expect(actions.onTeardown).toHaveBeenCalledTimes(1)
  })
})
