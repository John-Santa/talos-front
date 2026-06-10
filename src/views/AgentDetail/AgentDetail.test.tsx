import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AgentDetail } from './AgentDetail'
import { AGENTS } from '@/domain/agents'
import { hermesActivity, hermesDoD } from '@/data/fixtures/agentDetails'
import { aWorktree } from '@/test/builders'
import type { AgentDetailData } from '@/domain/types'

describe('AgentDetail', () => {
  const detail: AgentDetailData = {
    agent: AGENTS.hermes,
    worktree: aWorktree(),
    dod: hermesDoD,
    activity: hermesActivity,
  }

  it('renders the hero, worktree, DoD 2/3 and timeline', () => {
    render(<AgentDetail detail={detail} />)
    expect(screen.getByRole('heading', { name: 'Hermes' })).toBeInTheDocument()
    expect(screen.getByText('agent/hermes/TAL-15')).toBeInTheDocument()
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByText('verify-report adjunto')).toBeInTheDocument()
    expect(screen.getByText('Push 2e61d7e — CI verde')).toBeInTheDocument()
  })
})
