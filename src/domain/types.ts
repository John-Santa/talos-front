import type { Agent, Figura } from './agents'

/** Lifecycle state of an agent's git worktree. */
export type WorktreeStatus = 'active' | 'merging' | 'in-review' | 'idle'

export interface Worktree {
  agent: Figura
  /** Jira key, e.g. `TAL-15`. */
  jiraKey: string
  /** Branch name, always `agent/<figura>/<JIRA-KEY>`. */
  branch: string
  /** Short commit sha, e.g. `2e61d7e`. */
  head: string
  /** Module label this worktree owns, e.g. `devops`. */
  module: string
  status: WorktreeStatus
  /** Commits ahead of `develop`. */
  ahead: number
}

export interface MergeItem {
  /** 1-based position in the merge order. */
  n: number
  agent: Figura
  jiraKey: string
  ahead: number
  ready: boolean
}

export interface MergeOrder {
  base: 'develop'
  /** Current conflict rate, percent. */
  conflictRate: number
  /** Re-segmentation threshold, percent (~15). */
  threshold: number
  items: MergeItem[]
}

export type OverlapVerdict = 'OK' | 'WARN' | 'CONFLICT'

export interface Overlap {
  /** Collision rate, percent. */
  collisionRate: number
  /** Colliding vs total `module:*` pairs in flight. */
  pairs: { colliding: number; total: number }
  verdict: OverlapVerdict
}

export type GateId = `HG${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}`
export type GateState = 'pending' | 'approved' | 'blocked'

export interface Gate {
  id: GateId
  state: GateState
  note?: string
}

export type DoDState = 'done' | 'pending'
export type DoDKind = 'pr' | 'ci' | 'verify'

export interface DoDItem {
  label: string
  state: DoDState
  kind: DoDKind
}

export interface ActivityEntry {
  /** Relative time label, e.g. `hace 2 min`. */
  at: string
  text: string
}

export type JudgeVerdict = 'APPROVED' | 'CHANGES'

export interface Judge {
  /** e.g. `jd-judge-a`. */
  id: string
  verdict: JudgeVerdict
  note: string
}

export type ReviewVerdict = 'agree' | 'conflict'

export interface JudgmentReview {
  jiraKey: string
  gate: GateId
  judges: Judge[]
  fixAgent: 'idle' | 'running'
  verdict: ReviewVerdict
  /** Set when judges conflict — the authority the decision escalates to. */
  escalateTo?: Figura
}

/** One snapshot of the orchestration screen — the shared dataset for Faithful/Console/Flow. */
export interface OrchestrationSnapshot {
  worktrees: Worktree[]
  mergeOrder: MergeOrder
  overlap: Overlap
  gate: Gate
  idleAgents: Figura[]
  slots: { used: number; total: number }
}

export interface AgentDetailData {
  agent: Agent
  worktree?: Worktree
  dod: DoDItem[]
  activity: ActivityEntry[]
}
