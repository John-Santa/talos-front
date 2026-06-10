import { describe, it, expect } from 'vitest'
import { createFixtureRepository } from './fixtureRepository'

describe('fixtureRepository', () => {
  const repo = createFixtureRepository()

  it('resolves the orchestration snapshot seeded from the design', async () => {
    const snap = await repo.getOrchestration()
    expect(snap.worktrees.map((w) => w.agent)).toEqual(['hermes', 'iris'])
    expect(snap.mergeOrder.conflictRate).toBe(0)
    expect(snap.mergeOrder.threshold).toBe(15)
    expect(snap.mergeOrder.items).toHaveLength(1)
    expect(snap.gate).toEqual(expect.objectContaining({ id: 'HG3', state: 'pending' }))
    expect(snap.idleAgents).toHaveLength(5)
    expect(snap.slots).toEqual({ used: 2, total: 7 })
  })

  it('lists all 10 agents', async () => {
    expect(await repo.listAgents()).toHaveLength(10)
  })

  it('returns the hermes detail with DoD 2/3 and 5 activity entries', async () => {
    const detail = await repo.getAgent('hermes')
    expect(detail.agent.id).toBe('hermes')
    expect(detail.worktree?.branch).toBe('agent/hermes/TAL-15')
    expect(detail.dod).toHaveLength(3)
    expect(detail.dod.filter((d) => d.state === 'done')).toHaveLength(2)
    expect(detail.dod.find((d) => d.kind === 'verify')?.state).toBe('pending')
    expect(detail.activity).toHaveLength(5)
  })

  it('returns a minimal detail for an idle figura', async () => {
    const detail = await repo.getAgent('atlas')
    expect(detail.agent.id).toBe('atlas')
    expect(detail.worktree).toBeUndefined()
    expect(detail.dod).toHaveLength(0)
  })

  it('returns the TAL-15 judgment in conflict, escalating to ZEUS', async () => {
    const review = await repo.getJudgment('TAL-15')
    expect(review.gate).toBe('HG5')
    expect(review.judges).toHaveLength(2)
    expect(review.verdict).toBe('conflict')
    expect(review.escalateTo).toBe('zeus')
  })

  it('rejects an unknown judgment key', async () => {
    await expect(repo.getJudgment('TAL-999')).rejects.toThrow()
  })

  it('createWorktree adds a worktree and removes the figura from the bench', async () => {
    const r = createFixtureRepository()
    await r.createWorktree({ figura: 'atlas', jiraKey: 'TAL-99' })
    const snap = await r.getOrchestration()
    expect(snap.worktrees.some((w) => w.agent === 'atlas' && w.jiraKey === 'TAL-99')).toBe(true)
    expect(snap.idleAgents).not.toContain('atlas')
    expect(snap.slots.used).toBe(snap.worktrees.length)
  })

  it('teardownWorktree removes it and frees the figura', async () => {
    const r = createFixtureRepository()
    await r.teardownWorktree('hermes')
    const snap = await r.getOrchestration()
    expect(snap.worktrees.some((w) => w.agent === 'hermes')).toBe(false)
    expect(snap.idleAgents).toContain('hermes')
  })

  it('mergeWorktree removes the matched worktree (figura + jiraKey)', async () => {
    const r = createFixtureRepository()
    await r.mergeWorktree('hermes', 'TAL-15')
    const snap = await r.getOrchestration()
    expect(snap.worktrees.some((w) => w.agent === 'hermes' && w.jiraKey === 'TAL-15')).toBe(false)
    // A different figura with the same jiraKey would NOT be removed (no fixture for this,
    // but we assert the positive case is clean).
    expect(snap.idleAgents).toContain('hermes')
  })
})
