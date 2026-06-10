import { useViewMode } from '@/app/ViewMode'
import { VIEW_MODES, type ViewMode } from '@/app/viewModes'
import { useOrchestration } from '@/hooks/useTalosData'
import { ErrorState, Loading } from '@/components/Feedback'
import { OrchestrationConsole } from '@/views/OrchestrationConsole/OrchestrationConsole'
import { OrchestrationFaithful } from '@/views/OrchestrationFaithful/OrchestrationFaithful'
import type { OrchestrationSnapshot } from '@/domain/types'

/** Placeholder for the views still being built (Fiel/Flow — PR6/PR7). */
function ViewPlaceholder({ view }: { view: ViewMode }) {
  const meta = VIEW_MODES.find((m) => m.id === view)
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 24, minHeight: 0 }}>
      <div className="panel panel-pad" style={{ textAlign: 'center', maxWidth: 440 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Orchestration
        </div>
        <h2 style={{ font: '600 20px/1.3 var(--sans)', margin: '0 0 8px' }}>{meta?.label}</h2>
        <p className="faint" style={{ fontSize: 12 }}>
          vista en construcción
        </p>
      </div>
    </div>
  )
}

function renderView(view: ViewMode, snapshot: OrchestrationSnapshot) {
  switch (view) {
    case 'console':
      return <OrchestrationConsole snapshot={snapshot} />
    case 'faithful':
      return <OrchestrationFaithful snapshot={snapshot} />
    default:
      return <ViewPlaceholder view={view} />
  }
}

/** Fetches the orchestration snapshot once and renders the selected rendering. */
export function OrchestrationContainer() {
  const { view } = useViewMode()
  const { data, loading, error } = useOrchestration()
  return (
    <div
      data-testid="orchestration"
      data-view={view}
      style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
    >
      {loading || !data ? (
        error ? (
          <ErrorState message={error.message} />
        ) : (
          <Loading />
        )
      ) : (
        renderView(view, data)
      )}
    </div>
  )
}
