import { useViewMode } from '@/app/ViewMode'
import { VIEW_MODES } from '@/app/viewModes'

/**
 * Placeholder for PR4 — picks the rendering from the view switcher. PR5/6/7
 * replace the body with the real Console / Faithful / Flow views fed by the
 * orchestration snapshot.
 */
export function OrchestrationContainer() {
  const { view } = useViewMode()
  const meta = VIEW_MODES.find((m) => m.id === view)
  return (
    <div
      data-testid="orchestration"
      data-view={view}
      style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 24 }}
    >
      <div className="panel panel-pad" style={{ textAlign: 'center', maxWidth: 440 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Orchestration
        </div>
        <h2 style={{ font: '600 20px/1.3 var(--sans)', margin: '0 0 8px' }}>{meta?.label}</h2>
        <p className="dim" style={{ fontSize: 13, margin: 0 }}>
          {meta?.blurb}
        </p>
        <p className="faint" style={{ fontSize: 12, marginTop: 12 }}>
          vista en construcción
        </p>
      </div>
    </div>
  )
}
