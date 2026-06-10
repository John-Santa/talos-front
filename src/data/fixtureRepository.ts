import { AGENTS, ALL_AGENTS, type Agent, type Figura } from '@/domain/agents'
import type { AgentDetailData, JudgmentReview, NewWorktreeInput, OrchestrationSnapshot } from '@/domain/types'
import type { TalosRepository } from './repository'
import { fixtureOrchestration } from './fixtures/orchestration'
import { hermesActivity, hermesDoD } from './fixtures/agentDetails'
import { fixtureJudgments } from './fixtures/judgments'

const MODULE_BY_FIGURA: Partial<Record<Figura, string>> = {
  iris: 'frontend',
  hermes: 'devops',
  atlas: 'backend-ctx1',
  hephaestus: 'backend-ctx2',
  cronos: 'backend-ctx3',
  gaia: 'data',
  themis: 'qa',
}

/**
 * In-memory repository seeded from the design data. Write actions mutate the
 * in-memory snapshot so the GUI buttons work end-to-end in dev (fixtures mode)
 * without touching any real repo.
 */
export function createFixtureRepository(): TalosRepository {
  const snapshot: OrchestrationSnapshot = structuredClone(fixtureOrchestration)
  const recount = () => {
    snapshot.slots.used = snapshot.worktrees.length
  }

  return {
    getOrchestration(): Promise<OrchestrationSnapshot> {
      return Promise.resolve(structuredClone(snapshot))
    },

    listAgents(): Promise<Agent[]> {
      return Promise.resolve([...ALL_AGENTS])
    },

    getAgent(id: Figura): Promise<AgentDetailData> {
      const worktree = snapshot.worktrees.find((w) => w.agent === id)
      const detail: AgentDetailData = {
        agent: AGENTS[id],
        worktree,
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

    createWorktree({ figura, jiraKey }: NewWorktreeInput): Promise<void> {
      if (!snapshot.worktrees.some((w) => w.agent === figura)) {
        snapshot.worktrees.push({
          agent: figura,
          jiraKey,
          branch: `agent/${figura}/${jiraKey}`,
          head: '0000000',
          module: MODULE_BY_FIGURA[figura] ?? figura,
          status: 'active',
          ahead: 0,
        })
        snapshot.idleAgents = snapshot.idleAgents.filter((a) => a !== figura)
        recount()
      }
      return Promise.resolve()
    },

    teardownWorktree(figura: Figura): Promise<void> {
      snapshot.worktrees = snapshot.worktrees.filter((w) => w.agent !== figura)
      snapshot.mergeOrder.items = snapshot.mergeOrder.items.filter((i) => i.agent !== figura)
      if (!snapshot.idleAgents.includes(figura)) {
        snapshot.idleAgents.push(figura)
      }
      recount()
      return Promise.resolve()
    },

    mergeWorktree(jiraKey: string): Promise<void> {
      const merged = snapshot.worktrees.find((w) => w.jiraKey === jiraKey)
      snapshot.worktrees = snapshot.worktrees.filter((w) => w.jiraKey !== jiraKey)
      snapshot.mergeOrder.items = snapshot.mergeOrder.items.filter((i) => i.jiraKey !== jiraKey)
      if (merged && !snapshot.idleAgents.includes(merged.agent)) {
        snapshot.idleAgents.push(merged.agent)
      }
      recount()
      return Promise.resolve()
    },
  }
}
