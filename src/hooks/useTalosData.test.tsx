import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { RepositoryProvider } from '@/data/RepositoryProvider'
import { createFixtureRepository } from '@/data/fixtureRepository'
import { useOrchestration, useJudgment } from './useTalosData'

function wrapper({ children }: { children: ReactNode }) {
  return (
    <RepositoryProvider repository={createFixtureRepository()}>{children}</RepositoryProvider>
  )
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
