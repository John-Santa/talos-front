/**
 * The ten TALOS "figuras" — the cast of agents. Each has a constant-L/C identity
 * hue exposed as a CSS custom property `--ag-<name>` in `talos-system.css`.
 * Roles/models mirror the design handoff (talos-screens-a.jsx `AGENTS`) and the
 * parent repo's ownership model.
 */
export const FIGURAS = [
  'athena',
  'atlas',
  'hephaestus',
  'cronos',
  'iris',
  'gaia',
  'themis',
  'hermes',
  'argos',
  'zeus',
] as const

export type Figura = (typeof FIGURAS)[number]

export type Model = 'Opus' | 'Sonnet' | 'jueces' | 'humano'

export interface Agent {
  readonly id: Figura
  /** Display name, capitalized (e.g. "Hermes"). */
  readonly name: string
  readonly role: string
  readonly model: Model
  /** The CSS hue token for this figura, e.g. `--ag-hermes`. */
  readonly hueToken: `--ag-${Figura}`
}

export const AGENTS: Record<Figura, Agent> = {
  athena: { id: 'athena', name: 'Athena', role: 'Orquestador · PM', model: 'Opus', hueToken: '--ag-athena' },
  atlas: { id: 'atlas', name: 'Atlas', role: 'Backend · ctx #1', model: 'Sonnet', hueToken: '--ag-atlas' },
  hephaestus: { id: 'hephaestus', name: 'Hephaestus', role: 'Backend · ctx #2 · forja', model: 'Sonnet', hueToken: '--ag-hephaestus' },
  cronos: { id: 'cronos', name: 'Cronos', role: 'Backend · ctx #3', model: 'Sonnet', hueToken: '--ag-cronos' },
  iris: { id: 'iris', name: 'Iris', role: 'Frontend', model: 'Sonnet', hueToken: '--ag-iris' },
  gaia: { id: 'gaia', name: 'Gaia', role: 'Datos', model: 'Sonnet', hueToken: '--ag-gaia' },
  themis: { id: 'themis', name: 'Themis', role: 'QA · testing', model: 'Sonnet', hueToken: '--ag-themis' },
  hermes: { id: 'hermes', name: 'Hermes', role: 'DevOps · entrega', model: 'Sonnet', hueToken: '--ag-hermes' },
  argos: { id: 'argos', name: 'Argos', role: 'Revisión adversarial', model: 'jueces', hueToken: '--ag-argos' },
  zeus: { id: 'zeus', name: 'Zeus', role: 'TL humano · gates', model: 'humano', hueToken: '--ag-zeus' },
}

/** All agents in canonical roster order. */
export const ALL_AGENTS: readonly Agent[] = FIGURAS.map((f) => AGENTS[f])

export function isFigura(value: string): value is Figura {
  return (FIGURAS as readonly string[]).includes(value)
}
