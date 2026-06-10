import type { ActivityEntry, DoDItem } from '@/domain/types'

/** HERMES' Definition of Done — 2/3, with verify-report still pending. */
export const hermesDoD: DoDItem[] = [
  { label: 'PR linkeado a TAL-15', state: 'done', kind: 'pr' },
  { label: 'CI verde (pr-checks)', state: 'done', kind: 'ci' },
  { label: 'verify-report adjunto', state: 'pending', kind: 'verify' },
]

/** HERMES' recent activity timeline (most recent first). */
export const hermesActivity: ActivityEntry[] = [
  { at: 'hace 2 min', text: 'Push 2e61d7e — CI verde' },
  { at: 'hace 31 min', text: 'PR abierto → linkeado como remote issue link' },
  { at: 'hace 1 h', text: 'Declaró files: en el body · ATHENA cruzó solape' },
  { at: 'hace 1 h', text: 'transition To Do → In Progress · módulo tomado' },
  { at: 'hace 2 h', text: 'Worktree creado por ATHENA · agent/hermes/TAL-15' },
]
