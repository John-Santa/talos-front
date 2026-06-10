import type { Agent, Figura } from '@/domain/agents'
import type { AgentDetailData, JudgmentReview, OrchestrationSnapshot } from '@/domain/types'

/**
 * The seam between the console and its data. A fixture implementation backs it
 * today; a `fetch`-based one will hit the Go gateway later (same interface, so
 * views and containers never change).
 */
export interface TalosRepository {
  getOrchestration(): Promise<OrchestrationSnapshot>
  listAgents(): Promise<Agent[]>
  getAgent(id: Figura): Promise<AgentDetailData>
  getJudgment(jiraKey: string): Promise<JudgmentReview>
}
