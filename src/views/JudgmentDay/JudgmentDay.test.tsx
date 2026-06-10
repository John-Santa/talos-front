import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JudgmentDay } from './JudgmentDay'
import { aJudgment } from '@/test/builders'

describe('JudgmentDay', () => {
  it('renders ARGOS, the two judges in conflict and the ZEUS escalation', () => {
    render(<JudgmentDay review={aJudgment()} />)
    expect(screen.getByRole('heading', { name: 'ARGOS' })).toBeInTheDocument()
    expect(screen.getByText('APPROVED')).toBeInTheDocument()
    expect(screen.getByText('CHANGES')).toBeInTheDocument()
    expect(screen.getByText('Jueces en conflicto')).toBeInTheDocument()
    expect(screen.getByText('ZEUS decide')).toBeInTheDocument()
  })
})
