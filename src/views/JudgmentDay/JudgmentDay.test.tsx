import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderApp } from '@/test/render'
import { JudgmentDay } from './JudgmentDay'
import { aJudgment } from '@/test/builders'

describe('JudgmentDay', () => {
  it('renders ARGOS, the two judges in conflict and the ZEUS escalation', () => {
    renderApp(<JudgmentDay review={aJudgment()} />, { route: '/judgment/TAL-15' })
    expect(screen.getByRole('heading', { name: 'ARGOS' })).toBeInTheDocument()
    expect(screen.getByText('APPROVED')).toBeInTheDocument()
    expect(screen.getByText('CHANGES')).toBeInTheDocument()
    expect(screen.getByText('Jueces en conflicto')).toBeInTheDocument()
    expect(screen.getByText('ZEUS decide')).toBeInTheDocument()
  })

  it('links back from the breadcrumb', () => {
    renderApp(<JudgmentDay review={aJudgment()} />, { route: '/judgment/TAL-15' })
    expect(screen.getByRole('link', { name: 'Judgment Day' })).toHaveAttribute(
      'href',
      '/orchestration',
    )
  })
})
