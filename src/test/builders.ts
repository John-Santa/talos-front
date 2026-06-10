import type { JudgmentReview, Worktree } from '@/domain/types'

export function aWorktree(overrides: Partial<Worktree> = {}): Worktree {
  return {
    agent: 'hermes',
    jiraKey: 'TAL-15',
    branch: 'agent/hermes/TAL-15',
    head: '2e61d7e',
    module: 'devops',
    status: 'active',
    ahead: 4,
    ...overrides,
  }
}

export function aJudgment(overrides: Partial<JudgmentReview> = {}): JudgmentReview {
  return {
    jiraKey: 'TAL-15',
    gate: 'HG5',
    judges: [
      { id: 'jd-judge-a', verdict: 'APPROVED', note: 'Spec cumplida.' },
      { id: 'jd-judge-b', verdict: 'CHANGES', note: 'Falta verify-report.' },
    ],
    fixAgent: 'idle',
    verdict: 'conflict',
    escalateTo: 'zeus',
    ...overrides,
  }
}
