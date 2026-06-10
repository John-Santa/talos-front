import { useViewMode } from '@/app/ViewMode'
import type { ViewMode } from '@/app/viewModes'
import { useOrchestration } from '@/hooks/useTalosData'
import { ErrorState, Loading } from '@/components/Feedback'
import { OrchestrationConsole } from '@/views/OrchestrationConsole/OrchestrationConsole'
import { OrchestrationFaithful } from '@/views/OrchestrationFaithful/OrchestrationFaithful'
import { OrchestrationFlow } from '@/views/OrchestrationFlow/OrchestrationFlow'
import type { OrchestrationSnapshot } from '@/domain/types'

function renderView(view: ViewMode, snapshot: OrchestrationSnapshot) {
  switch (view) {
    case 'console':
      return <OrchestrationConsole snapshot={snapshot} />
    case 'faithful':
      return <OrchestrationFaithful snapshot={snapshot} />
    case 'flow':
      return <OrchestrationFlow snapshot={snapshot} />
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
