import { useEffect, useMemo, useState } from 'react'
import { useRepository } from '@/data/RepositoryProvider'
import type { Agent, Figura } from '@/domain/agents'
import type {
  AgentDetailData,
  JudgmentReview,
  NewWorktreeInput,
  OrchestrationSnapshot,
} from '@/domain/types'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export interface AsyncResource<T> extends AsyncState<T> {
  refetch: () => void
}

/**
 * Minimal async-resource hook over the repository, with a `refetch` so callers
 * can refresh after a mutation.
 */
function useAsync<T>(run: () => Promise<T>, deps: unknown[]): AsyncResource<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })
  const [tick, setTick] = useState(0)

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
  }, [...deps, tick])

  return { ...state, refetch: () => setTick((t) => t + 1) }
}

export function useOrchestration(): AsyncResource<OrchestrationSnapshot> {
  const repo = useRepository()
  return useAsync(() => repo.getOrchestration(), [repo])
}

export function useAgentList(): AsyncResource<Agent[]> {
  const repo = useRepository()
  return useAsync(() => repo.listAgents(), [repo])
}

export function useAgentDetail(id: Figura): AsyncResource<AgentDetailData> {
  const repo = useRepository()
  return useAsync(() => repo.getAgent(id), [repo, id])
}

export function useJudgment(jiraKey: string): AsyncResource<JudgmentReview> {
  const repo = useRepository()
  return useAsync(() => repo.getJudgment(jiraKey), [repo, jiraKey])
}

export interface TalosMutations {
  createWorktree: (input: NewWorktreeInput) => Promise<void>
  teardownWorktree: (figura: Figura) => Promise<void>
  mergeWorktree: (figura: Figura, jiraKey: string) => Promise<void>
}

/** Write actions over the repository (create / teardown / merge worktree). */
export function useTalosMutations(): TalosMutations {
  const repo = useRepository()
  return useMemo(
    () => ({
      createWorktree: (input) => repo.createWorktree(input),
      teardownWorktree: (figura) => repo.teardownWorktree(figura),
      mergeWorktree: (figura, jiraKey) => repo.mergeWorktree(figura, jiraKey),
    }),
    [repo],
  )
}
