import type { Agent, Figura } from '@/domain/agents'
import type {
  AgentDetailData,
  JudgmentReview,
  NewWorktreeInput,
  OrchestrationSnapshot,
} from '@/domain/types'

/**
 * The seam between the console and its data. A fixture implementation backs it
 * today; a `fetch`-based one hits the Go gateway. Reads + write actions (create
 * / teardown / merge worktree) share the interface so views never change.
 */
export interface TalosRepository {
  getOrchestration(): Promise<OrchestrationSnapshot>
  listAgents(): Promise<Agent[]>
  getAgent(id: Figura): Promise<AgentDetailData>
  getJudgment(jiraKey: string): Promise<JudgmentReview>

  createWorktree(input: NewWorktreeInput): Promise<void>
  teardownWorktree(figura: Figura): Promise<void>
  mergeWorktree(figura: Figura, jiraKey: string): Promise<void>
}
