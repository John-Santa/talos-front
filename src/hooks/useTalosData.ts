import { useEffect, useState } from 'react'
import { useRepository } from '@/data/RepositoryProvider'
import type { Agent, Figura } from '@/domain/agents'
import type { AgentDetailData, JudgmentReview, OrchestrationSnapshot } from '@/domain/types'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Minimal async-resource hook over the repository. When the HTTP adapter lands,
 * these hook names stay the same but can be re-implemented on TanStack Query.
 */
function useAsync<T>(run: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })

  useEffect(() => {
    let alive = true
    run().then(
      (data) => {
        if (alive) setState({ data, loading: false, error: null })
      },
      (err: unknown) => {
        if (alive) {
          setState({ data: null, loading: false, error: err instanceof Error ? err : new Error(String(err)) })
        }
      },
    )
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}

export function useOrchestration(): AsyncState<OrchestrationSnapshot> {
  const repo = useRepository()
  return useAsync(() => repo.getOrchestration(), [repo])
}

export function useAgentList(): AsyncState<Agent[]> {
  const repo = useRepository()
  return useAsync(() => repo.listAgents(), [repo])
}

export function useAgentDetail(id: Figura): AsyncState<AgentDetailData> {
  const repo = useRepository()
  return useAsync(() => repo.getAgent(id), [repo, id])
}

export function useJudgment(jiraKey: string): AsyncState<JudgmentReview> {
  const repo = useRepository()
  return useAsync(() => repo.getJudgment(jiraKey), [repo, jiraKey])
}
