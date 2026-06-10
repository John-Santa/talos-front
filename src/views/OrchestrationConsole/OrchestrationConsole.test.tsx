import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
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
})
