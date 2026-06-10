import { AGENTS, ALL_AGENTS } from '@/domain/agents'
import type { Agent, Figura } from '@/domain/agents'
import type { AgentDetailData, JudgmentReview, OrchestrationSnapshot } from '@/domain/types'
import type { TalosRepository } from './repository'
import { fixtureOrchestration, fixtureWorktrees } from './fixtures/orchestration'
import { hermesActivity, hermesDoD } from './fixtures/agentDetails'
import { fixtureJudgments } from './fixtures/judgments'

/**
 * In-memory repository seeded from the design data. Resolves asynchronously so a
 * future HTTP adapter is a shape-identical swap.
 */
export function createFixtureRepository(): TalosRepository {
  return {
    getOrchestration(): Promise<OrchestrationSnapshot> {
      return Promise.resolve(fixtureOrchestration)
    },

    listAgents(): Promise<Agent[]> {
      return Promise.resolve([...ALL_AGENTS])
    },

    getAgent(id: Figura): Promise<AgentDetailData> {
      const worktree = fixtureWorktrees.find((w) => w.agent === id)
      const detail: AgentDetailData = {
        agent: AGENTS[id],
        ...(worktree ? { worktree } : {}),
        dod: id === 'hermes' ? hermesDoD : [],
        activity: id === 'hermes' ? hermesActivity : [],
      }
      return Promise.resolve(detail)
    },

    getJudgment(jiraKey: string): Promise<JudgmentReview> {
      const review = fixtureJudgments[jiraKey]
      if (!review) {
        return Promise.reject(new Error(`No judgment fixture for ${jiraKey}`))
      }
      return Promise.resolve(review)
    },
  }
}
