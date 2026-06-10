import { useEffect, useMemo, useRef, useState } from 'react'
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
  /** True while a background poll-refetch is in flight (data stays populated). */
  refreshing: boolean
  error: Error | null
}

export interface AsyncResource<T> extends AsyncState<T> {
  refetch: () => void
}

/**
 * Minimal async-resource hook over the repository, with a `refetch` so callers
 * can refresh after a mutation.
 *
 * On the very first fetch `loading` is true and `data` is null.
 * On subsequent refetches (e.g. after a mutation or a poll tick) `refreshing`
 * is true while `data` keeps the previous value — no flash-of-empty.
 */
function useAsync<T>(run: () => Promise<T>, deps: unknown[]): AsyncResource<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    refreshing: false,
    error: null,
  })
  const [tick, setTick] = useState(0)
  // Track whether we've loaded at least once to distinguish initial load from refetch
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    let alive = true
    const isRefetch = hasLoadedRef.current

    if (isRefetch) {
      // Keep existing data visible; show a subtle refreshing indicator
      setState((prev) => ({ ...prev, refreshing: true }))
    }

    run().then(
      (data) => {
        if (alive) {
          hasLoadedRef.current = true
          setState({ data, loading: false, refreshing: false, error: null })
        }
      },
      (err: unknown) => {
        if (alive) {
          setState((prev) => ({
            ...prev,
            // On error during a background refresh, keep existing data
            data: isRefetch ? prev.data : null,
            loading: false,
            refreshing: false,
            error: err instanceof Error ? err : new Error(String(err)),
          }))
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

export interface UseOrchestrationOptions {
  /** Interval in ms to automatically refetch. Defaults to no polling when absent. */
  pollMs?: number
  /** When true the polling interval is cleared (e.g. dialog open or busy). */
  paused?: boolean
}

export function useOrchestration(options: UseOrchestrationOptions = {}): AsyncResource<OrchestrationSnapshot> {
  const { pollMs, paused = false } = options
  const repo = useRepository()
  const resource = useAsync(() => repo.getOrchestration(), [repo])

  useEffect(() => {
    if (!pollMs || paused) return

    // Also respect the browser visibility API
    let intervalId: ReturnType<typeof setInterval> | null = null

    const start = () => {
      if (intervalId !== null) return
      intervalId = setInterval(() => {
        resource.refetch()
      }, pollMs)
    }

    const stop = () => {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stop()
      } else {
        start()
      }
    }

    if (document.visibilityState !== 'hidden') {
      start()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollMs, paused])

  return resource
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
