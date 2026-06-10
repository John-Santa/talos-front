import type { Agent, Figura } from '@/domain/agents'
import type { AgentDetailData, JudgmentReview, OrchestrationSnapshot } from '@/domain/types'
import type { TalosRepository } from './repository'

/**
 * Repository backed by the TALOS HTTP gateway (talos/platform/webapi). Wired now
 * so flipping VITE_DATA_SOURCE=http is the only change once the gateway is live.
 */
export function createHttpRepository(baseUrl: string): TalosRepository {
  const base = baseUrl.replace(/\/$/, '')

  async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${base}${path}`)
    if (!res.ok) throw new Error(`TALOS gateway ${path} → ${res.status}`)
    return (await res.json()) as T
  }

  return {
    getOrchestration: () => get<OrchestrationSnapshot>('/api/orchestration'),
    listAgents: () => get<Agent[]>('/api/agents'),
    getAgent: (id: Figura) => get<AgentDetailData>(`/api/agents/${id}`),
    getJudgment: (jiraKey: string) =>
      get<JudgmentReview>(`/api/judgment/${encodeURIComponent(jiraKey)}`),
  }
}
