import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { OrchestrationFaithful } from './OrchestrationFaithful'
import { fixtureOrchestration } from '@/data/fixtures/orchestration'
import type { OrchestrationSnapshot } from '@/domain/types'

describe('OrchestrationFaithful', () => {
  it('renders the three panels and the selected worktree', () => {
    render(
      <MemoryRouter>
        <OrchestrationFaithful snapshot={fixtureOrchestration} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Worktrees')).toBeInTheDocument()
    expect(screen.getByText('Merge Order')).toBeInTheDocument()
    expect(screen.getByText('Overlap')).toBeInTheDocument()
    expect(screen.getByText('Selected Worktree')).toBeInTheDocument()
    // head only appears in the selected-worktree panel
    expect(screen.getByText('2e61d7e')).toBeInTheDocument()
  })

  it('renders verdict CONFLICT with danger pill (overlapTone)', () => {
    const snapshot: OrchestrationSnapshot = {
      ...fixtureOrchestration,
      overlap: { collisionRate: 25, pairs: { colliding: 2, total: 8 }, verdict: 'CONFLICT' },
    }
    render(
      <MemoryRouter>
        <OrchestrationFaithful snapshot={snapshot} />
      </MemoryRouter>,
    )
    const conflictPill = screen.getByText('CONFLICT').closest('.pill')
    expect(conflictPill).not.toBeNull()
    expect(conflictPill).toHaveClass('danger')
    expect(conflictPill).not.toHaveClass('ok')
  })
})
