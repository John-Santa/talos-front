import { Wordmark } from '@/components/atoms'
import type { ViewMode } from '@/app/viewModes'
import { SegSwitcher } from './SegSwitcher'

export interface AppBarProps {
  view: ViewMode
  onPick: (v: ViewMode) => void
  onHelp: () => void
}

/** Fixed top bar: wordmark · view switcher · help. */
export function AppBar({ view, onPick, onHelp }: AppBarProps) {
  return (
    <header className="app-bar">
      <Wordmark tag="Hybrid" style={{ gap: 9 }} />
      <span style={{ flex: 1 }} />
      <SegSwitcher view={view} onPick={onPick} />
      <span style={{ flex: 1 }} />
      <button
        type="button"
        className="seg help"
        onClick={onHelp}
        title="¿Qué es esto?"
        aria-label="Ayuda"
      >
        <span className="lab">?</span>
      </button>
    </header>
  )
}
