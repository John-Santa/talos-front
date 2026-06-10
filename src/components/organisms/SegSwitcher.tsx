import { VIEW_MODES, type ViewMode } from '@/app/viewModes'

export interface SegSwitcherProps {
  view: ViewMode
  onPick: (v: ViewMode) => void
}

/** Segmented control to pick the main-screen rendering (Fiel / Consola / Flow). */
export function SegSwitcher({ view, onPick }: SegSwitcherProps) {
  return (
    <div className="seg-group" role="tablist" aria-label="Vista principal">
      {VIEW_MODES.map((v) => (
        <button
          key={v.id}
          type="button"
          className={`seg${v.id === view ? ' on' : ''}`}
          onClick={() => onPick(v.id)}
          title={v.blurb}
          role="tab"
          aria-selected={v.id === view}
        >
          <span className="lab">{v.label}</span>
          <span className="sub">{v.key}</span>
        </button>
      ))}
    </div>
  )
}
