import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrchestrationFlow } from './OrchestrationFlow'
import { fixtureOrchestration } from '@/data/fixtures/orchestration'

describe('OrchestrationFlow', () => {
  it('renders the dial, the rail toward develop and the bench', () => {
    render(<OrchestrationFlow snapshot={fixtureOrchestration} />)
    expect(screen.getByText('Salud de merge')).toBeInTheDocument()
    expect(screen.getByText(/Orden de merge/)).toBeInTheDocument()
    expect(screen.getByText('✓ +4')).toBeInTheDocument() // hermes ready node
    expect(screen.getByText(/ARGOS standby/)).toBeInTheDocument()
  })
})
