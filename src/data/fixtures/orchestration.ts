import type { OrchestrationSnapshot, Worktree } from '@/domain/types'

/** The two active worktrees from the design (hermes/TAL-15, iris/TAL-22). */
export const fixtureWorktrees: Worktree[] = [
  {
    agent: 'hermes',
    jiraKey: 'TAL-15',
    branch: 'agent/hermes/TAL-15',
    head: '2e61d7e',
    module: 'devops',
    status: 'active',
    ahead: 4,
  },
  {
    agent: 'iris',
    jiraKey: 'TAL-22',
    branch: 'agent/iris/TAL-22',
    head: 'ec3ff1a',
    module: 'frontend',
    status: 'active',
    ahead: 0,
  },
]

/** The orchestration snapshot — the shared dataset for Faithful / Console / Flow. */
export const fixtureOrchestration: OrchestrationSnapshot = {
  worktrees: fixtureWorktrees,
  mergeOrder: {
    base: 'develop',
    conflictRate: 0,
    threshold: 15,
    items: [{ n: 1, agent: 'hermes', jiraKey: 'TAL-15', ahead: 4, ready: true }],
  },
  overlap: {
    collisionRate: 0,
    pairs: { colliding: 0, total: 0 },
    verdict: 'OK',
  },
  gate: {
    id: 'HG3',
    state: 'pending',
    note: 'Merge final a main espera a ZEUS. DoD = PR + CI verde + verify-report.',
  },
  idleAgents: ['atlas', 'hephaestus', 'cronos', 'gaia', 'themis'],
  slots: { used: 2, total: 7 },
}
