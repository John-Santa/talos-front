import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderApp } from '@/test/render'
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
    renderApp(<AgentDetail detail={detail} />, { route: '/agents/hermes' })
    expect(screen.getByRole('heading', { name: 'Hermes' })).toBeInTheDocument()
    expect(screen.getByText('agent/hermes/TAL-15')).toBeInTheDocument()
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByText('verify-report adjunto')).toBeInTheDocument()
    expect(screen.getByText('Push 2e61d7e — CI verde')).toBeInTheDocument()
  })

  it('links back to the agents list from the breadcrumb', () => {
    renderApp(<AgentDetail detail={detail} />, { route: '/agents/hermes' })
    expect(screen.getByRole('link', { name: 'Agents' })).toHaveAttribute('href', '/agents')
  })
})
