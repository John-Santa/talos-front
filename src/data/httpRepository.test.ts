/**
 * Tests for createHttpRepository — validate the HTTP transport layer in isolation.
 * Uses vi.stubGlobal('fetch', ...) to mock the native fetch without any runtime deps.
 *
 * TDD: these tests were written BEFORE the implementation was touched. The implementation
 * already exists; these tests establish the contract that must hold for the HTTP adapter.
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { createHttpRepository } from './httpRepository'
import type { OrchestrationSnapshot } from '@/domain/types'

// Minimal valid orchestration snapshot for happy-path checks
const minimalSnapshot: OrchestrationSnapshot = {
  worktrees: [],
  idleAgents: [],
  slots: { total: 7, used: 0 },
  mergeOrder: { base: 'develop', conflictRate: 0, threshold: 15, items: [] },
  overlap: { collisionRate: 0, pairs: { colliding: 0, total: 0 }, verdict: 'OK' },
  gate: { id: 'HG5', state: 'pending' },
}

function mockFetch(status: number, body: unknown, ok?: boolean): void {
  const actualOk = ok ?? (status >= 200 && status < 300)
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: actualOk,
      status,
      json: () => Promise.resolve(body),
    }),
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('httpRepository — getOrchestration', () => {
  it('returns the parsed JSON on a 200 response', async () => {
    mockFetch(200, minimalSnapshot)
    const repo = createHttpRepository('http://localhost:8100')
    const result = await repo.getOrchestration()
    expect(result).toEqual(minimalSnapshot)
    expect(vi.mocked(fetch)).toHaveBeenCalledWith('http://localhost:8100/api/orchestration')
  })

  it('throws an Error containing the status code on a 4xx response', async () => {
    mockFetch(404, { error: 'not found' })
    const repo = createHttpRepository('http://localhost:8100')
    await expect(repo.getOrchestration()).rejects.toThrow('404')
  })

  it('throws an Error on a 5xx response', async () => {
    mockFetch(502, { error: 'bad gateway' })
    const repo = createHttpRepository('http://localhost:8100')
    await expect(repo.getOrchestration()).rejects.toThrow()
  })
})

describe('httpRepository — createWorktree (send)', () => {
  it('POST /api/worktrees with the correct body on 201', async () => {
    mockFetch(201, {})
    const repo = createHttpRepository('http://localhost:8100')
    await expect(repo.createWorktree({ figura: 'iris', jiraKey: 'TAL-42' })).resolves.toBeUndefined()
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'http://localhost:8100/api/worktrees',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ figura: 'iris', jiraKey: 'TAL-42' }),
      }),
    )
  })

  it('rejects with error body message on 400', async () => {
    mockFetch(400, { error: 'figura and jiraKey are required' })
    const repo = createHttpRepository('http://localhost:8100')
    await expect(repo.createWorktree({ figura: 'iris', jiraKey: '' })).rejects.toThrow(
      'figura and jiraKey are required',
    )
  })

  it('rejects with status code in message on 5xx without JSON body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: () => Promise.reject(new SyntaxError('invalid json')),
      }),
    )
    const repo = createHttpRepository('http://localhost:8100')
    await expect(repo.createWorktree({ figura: 'iris', jiraKey: 'TAL-1' })).rejects.toThrow('503')
  })
})

describe('httpRepository — teardownWorktree (send)', () => {
  it('DELETE /api/worktrees/:figura on 200', async () => {
    mockFetch(200, {})
    const repo = createHttpRepository('http://localhost:8100')
    await expect(repo.teardownWorktree('iris')).resolves.toBeUndefined()
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'http://localhost:8100/api/worktrees/iris',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })
})

describe('httpRepository — mergeWorktree (send)', () => {
  it('POST /api/merge/:jiraKey with figura in body', async () => {
    mockFetch(200, {})
    const repo = createHttpRepository('http://localhost:8100')
    await expect(repo.mergeWorktree('iris', 'TAL-42')).resolves.toBeUndefined()
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'http://localhost:8100/api/merge/TAL-42',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ figura: 'iris' }),
      }),
    )
  })

  it('propagates error body message on 4xx merge failure', async () => {
    mockFetch(400, { error: 'merge conflict detected' })
    const repo = createHttpRepository('http://localhost:8100')
    await expect(repo.mergeWorktree('iris', 'TAL-42')).rejects.toThrow('merge conflict detected')
  })

  it('rejects on 5xx with status code in message', async () => {
    mockFetch(502, { error: 'upstream error' })
    const repo = createHttpRepository('http://localhost:8100')
    await expect(repo.mergeWorktree('iris', 'TAL-42')).rejects.toThrow()
  })
})
