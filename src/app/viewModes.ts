/** The three user-selectable renderings of the main orchestration screen. */
export const VIEW_MODES = [
  {
    id: 'faithful',
    label: 'Fiel',
    key: '1',
    blurb: 'Lo más parecido a tu terminal. Familiar, directo, sin sorpresas.',
  },
  {
    id: 'console',
    label: 'Consola',
    key: '2',
    blurb: 'Una app completa: navegación lateral, buscador de comandos y atajos.',
  },
  {
    id: 'flow',
    label: 'Flow',
    key: '3',
    blurb: 'Una vista visual: el "tren de merge" avanzando hacia develop.',
  },
] as const

export type ViewMode = (typeof VIEW_MODES)[number]['id']

export const DEFAULT_VIEW: ViewMode = 'console'

export function isViewMode(value: string): value is ViewMode {
  return VIEW_MODES.some((m) => m.id === value)
}
