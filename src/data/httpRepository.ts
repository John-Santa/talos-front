import type { Agent, Figura } from '@/domain/agents'
import type {
  AgentDetailData,
  JudgmentReview,
  NewWorktreeInput,
  OrchestrationSnapshot,
} from '@/domain/types'
import type { TalosRepository } from './repository'

/**
 * Repository backed by the TALOS HTTP gateway (talos/platform/webapi). Flip
 * VITE_DATA_SOURCE=http to use it.
 */
export function createHttpRepository(baseUrl: string): TalosRepository {
  const base = baseUrl.replace(/\/$/, '')

  async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${base}${path}`)
    if (!res.ok) throw new Error(`TALOS gateway ${path} → ${res.status}`)
    return (await res.json()) as T
  }

  async function send(method: string, path: string, body?: unknown): Promise<void> {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    if (!res.ok) {
      let detail = `${res.status}`
      try {
        const data = (await res.json()) as { error?: string }
        if (data.error) detail = data.error
      } catch {
        // ignore non-JSON error bodies
      }
      throw new Error(`TALOS gateway ${method} ${path} → ${detail}`)
    }
  }

  return {
    getOrchestration: () => get<OrchestrationSnapshot>('/api/orchestration'),
    listAgents: () => get<Agent[]>('/api/agents'),
    getAgent: (id: Figura) => get<AgentDetailData>(`/api/agents/${id}`),
    getJudgment: (jiraKey: string) =>
      get<JudgmentReview>(`/api/judgment/${encodeURIComponent(jiraKey)}`),

    createWorktree: (input: NewWorktreeInput) => send('POST', '/api/worktrees', input),
    teardownWorktree: (figura: Figura) => send('DELETE', `/api/worktrees/${figura}`),
    mergeWorktree: (jiraKey: string) => send('POST', `/api/merge/${encodeURIComponent(jiraKey)}`),
  }
}
