import type { JudgmentReview } from '@/domain/types'

/** Judgment Day for TAL-15 — judges in conflict, escalates to ZEUS (gate HG5, hard). */
export const fixtureJudgments: Record<string, JudgmentReview> = {
  'TAL-15': {
    jiraKey: 'TAL-15',
    gate: 'HG5',
    judges: [
      {
        id: 'jd-judge-a',
        verdict: 'APPROVED',
        note: 'Spec cumplida. Cobertura de tests sobre el loop de evidencia adecuada. Sin hallazgos bloqueantes.',
      },
      {
        id: 'jd-judge-b',
        verdict: 'CHANGES',
        note: 'verify-report falta como attachment (DoD §6). Linkeá lo vivo, adjuntá lo muerto — el helper debe fallar fuerte.',
      },
    ],
    fixAgent: 'idle',
    verdict: 'conflict',
    escalateTo: 'zeus',
  },
}
