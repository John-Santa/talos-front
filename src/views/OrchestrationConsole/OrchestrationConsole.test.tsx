import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderApp } from '@/test/render'
import { OrchestrationConsole } from './OrchestrationConsole'
import { fixtureOrchestration } from '@/data/fixtures/orchestration'

describe('OrchestrationConsole', () => {
  it('renders the sidebar nav, worktrees, rail and gate', () => {
    renderApp(<OrchestrationConsole snapshot={fixtureOrchestration} />, { route: '/orchestration' })
    // sidebar
    expect(screen.getByRole('link', { name: /Orchestration/ })).toBeInTheDocument()
    expect(screen.getByText('ZEUS')).toBeInTheDocument()
    // table
    expect(screen.getByText('TAL-22')).toBeInTheDocument()
    // rail
    expect(screen.getByText('Merge readiness')).toBeInTheDocument()
    expect(screen.getByText('Gate HG3')).toBeInTheDocument()
    expect(screen.getByText(/Merge final a main espera a ZEUS/)).toBeInTheDocument()
  })
})
