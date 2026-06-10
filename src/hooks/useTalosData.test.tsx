import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { RepositoryProvider } from '@/data/RepositoryProvider'
import { createFixtureRepository } from '@/data/fixtureRepository'
import type { TalosRepository } from '@/data/repository'
import { useOrchestration, useJudgment, useTalosMutations } from './useTalosData'

function wrapper({ children }: { children: ReactNode }) {
  return (
    <RepositoryProvider repository={createFixtureRepository()}>{children}</RepositoryProvider>
  )
}

function makeWrapper(repo: TalosRepository) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <RepositoryProvider repository={repo}>{children}</RepositoryProvider>
  }
}

describe('useTalosData', () => {
  it('loads the orchestration snapshot through the provider', async () => {
    const { result } = renderHook(() => useOrchestration(), { wrapper })
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data?.worktrees).toHaveLength(2)
    expect(result.current.error).toBeNull()
  })

  it('surfaces repository errors', async () => {
    const { result } = renderHook(() => useJudgment('TAL-999'), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.data).toBeNull()
  })
})

describe('useTalosMutations — delegation and error propagation', () => {
  it('createWorktree delegates to repo.createWorktree', async () => {
    const repo = createFixtureRepository()
    repo.createWorktree = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useTalosMutations(), { wrapper: makeWrapper(repo) })

    await act(async () => {
      await result.current.createWorktree({ figura: 'iris', jiraKey: 'TAL-99' })
    })

    expect(repo.createWorktree).toHaveBeenCalledWith({ figura: 'iris', jiraKey: 'TAL-99' })
  })

  it('createWorktree propagates rejection from repo', async () => {
    const repo = createFixtureRepository()
    repo.createWorktree = vi.fn().mockRejectedValue(new Error('400 bad figura'))
    const { result } = renderHook(() => useTalosMutations(), { wrapper: makeWrapper(repo) })

    await expect(
      act(async () => {
        await result.current.createWorktree({ figura: 'bogus' as never, jiraKey: 'TAL-1' })
      }),
    ).rejects.toThrow('400 bad figura')
  })

  it('teardownWorktree delegates to repo.teardownWorktree', async () => {
    const repo = createFixtureRepository()
    repo.teardownWorktree = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useTalosMutations(), { wrapper: makeWrapper(repo) })

    await act(async () => {
      await result.current.teardownWorktree('iris')
    })

    expect(repo.teardownWorktree).toHaveBeenCalledWith('iris')
  })

  it('mergeWorktree delegates with both figura and jiraKey', async () => {
    const repo = createFixtureRepository()
    repo.mergeWorktree = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useTalosMutations(), { wrapper: makeWrapper(repo) })

    await act(async () => {
      await result.current.mergeWorktree('iris', 'TAL-22')
    })

    expect(repo.mergeWorktree).toHaveBeenCalledWith('iris', 'TAL-22')
  })

  it('mergeWorktree propagates rejection from repo', async () => {
    const repo = createFixtureRepository()
    repo.mergeWorktree = vi.fn().mockRejectedValue(new Error('502 merge conflict'))
    const { result } = renderHook(() => useTalosMutations(), { wrapper: makeWrapper(repo) })

    await expect(
      act(async () => {
        await result.current.mergeWorktree('iris', 'TAL-22')
      }),
    ).rejects.toThrow('502 merge conflict')
  })
})
