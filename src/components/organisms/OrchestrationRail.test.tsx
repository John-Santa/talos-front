import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrchestrationRail } from './OrchestrationRail'
import type { Gate, MergeOrder, Overlap } from '@/domain/types'

const mergeOrder: MergeOrder = {
  base: 'develop',
  conflictRate: 0,
  threshold: 15,
  items: [{ n: 1, agent: 'hermes', jiraKey: 'TAL-15', ahead: 4, ready: true }],
}

const gate: Gate = { id: 'HG3', state: 'pending' }

describe('OrchestrationRail — conflictFiles indicator', () => {
  it('shows conflict file count badge when item.conflictFiles is non-empty', () => {
    const order: MergeOrder = {
      ...mergeOrder,
      items: [
        {
          n: 1,
          agent: 'hermes',
          jiraKey: 'TAL-15',
          ahead: 4,
          ready: false,
          conflictFiles: ['src/foo.ts', 'src/bar.ts'],
        },
      ],
    }
    const overlap: Overlap = { collisionRate: 0, pairs: { colliding: 0, total: 2 }, verdict: 'OK' }
    render(<OrchestrationRail mergeOrder={order} overlap={overlap} gate={gate} />)
    // Expect a conflict indicator showing the count (2 files)
    expect(screen.getByText(/2 conflict/i)).toBeInTheDocument()
  })

  it('does NOT show conflict indicator when conflictFiles is empty', () => {
    const order: MergeOrder = {
      ...mergeOrder,
      items: [{ n: 1, agent: 'hermes', jiraKey: 'TAL-15', ahead: 4, ready: true, conflictFiles: [] }],
    }
    const overlap: Overlap = { collisionRate: 0, pairs: { colliding: 0, total: 2 }, verdict: 'OK' }
    render(<OrchestrationRail mergeOrder={order} overlap={overlap} gate={gate} />)
    // The "conflict-files" data attribute is only rendered when conflictFiles.length > 0
    expect(document.querySelector('[data-conflict-files]')).toBeNull()
  })

  it('does NOT show conflict indicator when conflictFiles is absent', () => {
    const overlap: Overlap = { collisionRate: 0, pairs: { colliding: 0, total: 2 }, verdict: 'OK' }
    render(<OrchestrationRail mergeOrder={mergeOrder} overlap={overlap} gate={gate} />)
    expect(document.querySelector('[data-conflict-files]')).toBeNull()
  })
})

describe('OrchestrationRail — overlap verdict tone', () => {
  it('renders verdict OK with the ok pill text visible', () => {
    const overlap: Overlap = { collisionRate: 0, pairs: { colliding: 0, total: 2 }, verdict: 'OK' }
    render(<OrchestrationRail mergeOrder={mergeOrder} overlap={overlap} gate={gate} />)
    // The overlap panel shows the verdict text
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('renders verdict CONFLICT — the overlap pill contains CONFLICT text', () => {
    const overlap: Overlap = { collisionRate: 30, pairs: { colliding: 3, total: 10 }, verdict: 'CONFLICT' }
    render(<OrchestrationRail mergeOrder={mergeOrder} overlap={overlap} gate={gate} />)
    expect(screen.getByText('CONFLICT')).toBeInTheDocument()
    // The pill wrapping CONFLICT must have class "danger" (mapped from overlapTone)
    // "warn" class must NOT be present — that would be the old broken behavior
    const conflictPill = screen.getByText('CONFLICT').closest('.pill')
    expect(conflictPill).not.toBeNull()
    expect(conflictPill).toHaveClass('danger')
    expect(conflictPill).not.toHaveClass('warn')
  })

  it('renders verdict WARN with warn class', () => {
    const overlap: Overlap = { collisionRate: 10, pairs: { colliding: 1, total: 5 }, verdict: 'WARN' }
    render(<OrchestrationRail mergeOrder={mergeOrder} overlap={overlap} gate={gate} />)
    const warnPill = screen.getByText('WARN').closest('.pill')
    expect(warnPill).not.toBeNull()
    expect(warnPill).toHaveClass('warn')
  })
})
