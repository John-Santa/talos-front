import type { WorktreeStatus } from './types'

/** Tone for conflict/merge gauges. Structurally compatible with the atoms' `Tone`. */
export type Tone = 'ok' | 'warn' | 'danger'

/** Pill tone for a worktree status. Structurally compatible with the atoms' `PillKind`. */
export type StatusTone = 'ok' | 'warn' | 'accent'

/**
 * Color tone for a conflict rate against its threshold.
 * Mirrors the design rule (talos-screens-b.jsx, Dial): `< 0.7·threshold` is ok,
 * `< threshold` is warn, otherwise danger.
 */
export function mergeTone(rate: number, threshold: number): Tone {
  if (rate < threshold * 0.7) return 'ok'
  if (rate < threshold) return 'warn'
  return 'danger'
}

/** Gauge bar width percent — never collapses below 1.5% (talos-screens-a.jsx, MiniGauge). */
export function gaugeWidth(value: number): number {
  return Math.max(value, 1.5)
}

/** Pill tone for a worktree status (idle has no tone). */
export function statusTone(status: WorktreeStatus): StatusTone | undefined {
  switch (status) {
    case 'active':
      return 'ok'
    case 'merging':
      return 'accent'
    case 'in-review':
      return 'warn'
    case 'idle':
      return undefined
  }
}
