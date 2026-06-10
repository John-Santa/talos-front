import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { RepositoryProvider } from '@/data/RepositoryProvider'
import { useOrchestration } from './useTalosData'
import type { TalosRepository } from '@/data/repository'
import type { OrchestrationSnapshot } from '@/domain/types'

// Minimal snapshot fixture
const snapshot: OrchestrationSnapshot = {
  worktrees: [],
  idleAgents: [],
  slots: { total: 7, used: 0 },
  mergeOrder: { base: 'develop', conflictRate: 0, threshold: 15, items: [] },
  overlap: { collisionRate: 0, pairs: { colliding: 0, total: 0 }, verdict: 'OK' },
  gate: { id: 'HG5', state: 'pending' },
}

function makeRepo(getOrchestration: () => Promise<OrchestrationSnapshot>): TalosRepository {
  return {
    getOrchestration,
    listAgents: () => Promise.resolve([]),
    getAgent: () => Promise.reject(new Error('not implemented')),
    getJudgment: () => Promise.reject(new Error('not implemented')),
    createWorktree: () => Promise.resolve(),
    teardownWorktree: () => Promise.resolve(),
    mergeWorktree: () => Promise.resolve(),
  }
}

function makeWrapper(repo: TalosRepository) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <RepositoryProvider repository={repo}>{children}</RepositoryProvider>
  }
}

describe('useOrchestration — polling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls repo.getOrchestration again after pollMs elapses', async () => {
    const getOrchestration = vi.fn().mockResolvedValue(snapshot)
    const repo = makeRepo(getOrchestration)
    const wrapper = makeWrapper(repo)

    renderHook(() => useOrchestration({ pollMs: 10000 }), { wrapper })

    // Initial load
    await act(() => Promise.resolve())
    expect(getOrchestration).toHaveBeenCalledTimes(1)

    // Advance timer by 10s → should trigger a refetch
    await act(async () => {
      vi.advanceTimersByTime(10000)
      await Promise.resolve()
    })

    expect(getOrchestration).toHaveBeenCalledTimes(2)
  })

  it('does NOT refetch when paused=true', async () => {
    const getOrchestration = vi.fn().mockResolvedValue(snapshot)
    const repo = makeRepo(getOrchestration)
    const wrapper = makeWrapper(repo)

    renderHook(() => useOrchestration({ pollMs: 10000, paused: true }), { wrapper })

    await act(() => Promise.resolve())
    expect(getOrchestration).toHaveBeenCalledTimes(1)

    await act(async () => {
      vi.advanceTimersByTime(10000)
      await Promise.resolve()
    })

    // Paused — no extra call
    expect(getOrchestration).toHaveBeenCalledTimes(1)
  })

  it('sets refreshing=true during a poll-refetch without resetting data to null', async () => {
    let resolveSecond!: (v: OrchestrationSnapshot) => void
    const secondPromise = new Promise<OrchestrationSnapshot>((res) => {
      resolveSecond = res
    })
    let call = 0
    const getOrchestration = vi.fn().mockImplementation(() => {
      call++
      if (call === 1) return Promise.resolve(snapshot)
      return secondPromise
    })

    const repo = makeRepo(getOrchestration)
    const wrapper = makeWrapper(repo)

    const { result } = renderHook(() => useOrchestration({ pollMs: 10000 }), { wrapper })

    // Initial load completes
    await act(() => Promise.resolve())
    expect(result.current.data).toBe(snapshot)
    expect(result.current.loading).toBe(false)
    expect(result.current.refreshing).toBe(false)

    // Advance timer — second fetch starts (pending)
    await act(async () => {
      vi.advanceTimersByTime(10000)
      await Promise.resolve()
    })

    // data should still be the old snapshot, refreshing should be true
    expect(result.current.data).toBe(snapshot)
    expect(result.current.loading).toBe(false)
    expect(result.current.refreshing).toBe(true)

    // Resolve the second fetch
    await act(async () => {
      resolveSecond(snapshot)
      await Promise.resolve()
    })

    expect(result.current.refreshing).toBe(false)
  })

  it('pauses when document.visibilityState is hidden', async () => {
    const getOrchestration = vi.fn().mockResolvedValue(snapshot)
    const repo = makeRepo(getOrchestration)
    const wrapper = makeWrapper(repo)

    renderHook(() => useOrchestration({ pollMs: 5000 }), { wrapper })

    await act(() => Promise.resolve())
    expect(getOrchestration).toHaveBeenCalledTimes(1)

    // Simulate tab becoming hidden
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    })
    document.dispatchEvent(new Event('visibilitychange'))

    await act(async () => {
      vi.advanceTimersByTime(5000)
      await Promise.resolve()
    })

    // Should NOT have refetched
    expect(getOrchestration).toHaveBeenCalledTimes(1)

    // Restore visible
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    })
    document.dispatchEvent(new Event('visibilitychange'))

    await act(async () => {
      vi.advanceTimersByTime(5000)
      await Promise.resolve()
    })

    // Now it should poll again
    expect(getOrchestration).toHaveBeenCalledTimes(2)
  })
})
