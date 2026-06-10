import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('./httpRepository', () => ({
  createHttpRepository: vi.fn((base: string) => ({ __kind: 'http', base })),
}))
vi.mock('./fixtureRepository', () => ({
  createFixtureRepository: vi.fn(() => ({ __kind: 'fixture' })),
}))

import { createRepository } from './index'
import { createHttpRepository } from './httpRepository'
import { createFixtureRepository } from './fixtureRepository'

describe('createRepository', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it('defaults to the local HTTP gateway when no env is set', () => {
    vi.stubEnv('VITE_DATA_SOURCE', undefined as unknown as string)
    vi.stubEnv('VITE_TALOS_API_BASE', undefined as unknown as string)
    createRepository()
    expect(createHttpRepository).toHaveBeenCalledWith('http://localhost:8100')
    expect(createFixtureRepository).not.toHaveBeenCalled()
  })

  it('uses fixtures only when VITE_DATA_SOURCE=fixtures (explicit opt-out)', () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'fixtures')
    createRepository()
    expect(createFixtureRepository).toHaveBeenCalled()
    expect(createHttpRepository).not.toHaveBeenCalled()
  })

  it('honors an explicit VITE_TALOS_API_BASE', () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'http')
    vi.stubEnv('VITE_TALOS_API_BASE', 'http://gateway.local:9000')
    createRepository()
    expect(createHttpRepository).toHaveBeenCalledWith('http://gateway.local:9000')
  })
})
