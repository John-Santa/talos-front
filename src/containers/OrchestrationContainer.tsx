import { useState } from 'react'
import { useViewMode } from '@/app/ViewMode'
import type { ViewMode } from '@/app/viewModes'
import { useOrchestration, useTalosMutations } from '@/hooks/useTalosData'
import { ErrorState, Loading } from '@/components/Feedback'
import { ConfirmDialog } from '@/components/molecules'
import { NewWorktreeDialog } from '@/components/organisms'
import {
  OrchestrationConsole,
  type OrchestrationActions,
} from '@/views/OrchestrationConsole/OrchestrationConsole'
import { OrchestrationFaithful } from '@/views/OrchestrationFaithful/OrchestrationFaithful'
import { OrchestrationFlow } from '@/views/OrchestrationFlow/OrchestrationFlow'
import type { OrchestrationSnapshot, Worktree } from '@/domain/types'

type Dialog =
  | { kind: 'new' }
  | { kind: 'merge'; worktree: Worktree }
  | { kind: 'teardown'; worktree: Worktree }
  | null

function renderView(view: ViewMode, snapshot: OrchestrationSnapshot, actions: OrchestrationActions) {
  switch (view) {
    case 'console':
      return <OrchestrationConsole snapshot={snapshot} actions={actions} />
    case 'faithful':
      return <OrchestrationFaithful snapshot={snapshot} />
    case 'flow':
      return <OrchestrationFlow snapshot={snapshot} />
  }
}

/** Fetches the snapshot, renders the selected view, and drives the write actions. */
export function OrchestrationContainer() {
  const { view } = useViewMode()
  const { data, loading, error, refetch } = useOrchestration()
  const mutations = useTalosMutations()
  const [dialog, setDialog] = useState<Dialog>(null)
  const [busy, setBusy] = useState(false)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const closeDialog = () => {
    setDialog(null)
    setMutationError(null)
  }

  const actions: OrchestrationActions = {
    onNew: () => setDialog({ kind: 'new' }),
    onMerge: (worktree) => setDialog({ kind: 'merge', worktree }),
    onTeardown: (worktree) => setDialog({ kind: 'teardown', worktree }),
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    setMutationError(null)
    try {
      await fn()
      setDialog(null)
      setMutationError(null)
      refetch()
    } catch (e) {
      setMutationError(e instanceof Error ? e.message : String(e))
      // Dialog stays open for retry — do NOT close
    } finally {
      setBusy(false)
    }
  }

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
        renderView(view, data, actions)
      )}

      {dialog?.kind === 'new' ? (
        <NewWorktreeDialog
          idleAgents={data?.idleAgents}
          busy={busy}
          errorMessage={mutationError ?? undefined}
          onCreate={(input) => run(() => mutations.createWorktree(input))}
          onCancel={closeDialog}
        />
      ) : null}

      {dialog?.kind === 'merge' ? (
        <ConfirmDialog
          title={`¿Mergear ${dialog.worktree.jiraKey}?`}
          confirmLabel="Mergear"
          busy={busy}
          errorMessage={mutationError ?? undefined}
          onConfirm={() => run(() => mutations.mergeWorktree(dialog.worktree.agent, dialog.worktree.jiraKey))}
          onCancel={closeDialog}
        >
          Vas a mergear <b style={{ color: 'var(--tx)' }}>{dialog.worktree.branch}</b> a{' '}
          <b style={{ color: 'var(--tx)' }}>develop</b>. Se chequean conflictos antes; si los hay, se
          aborta sin tocar nada.
        </ConfirmDialog>
      ) : null}

      {dialog?.kind === 'teardown' ? (
        <ConfirmDialog
          title={`¿Teardown de ${dialog.worktree.agent}?`}
          confirmLabel="Teardown"
          danger
          busy={busy}
          errorMessage={mutationError ?? undefined}
          onConfirm={() => run(() => mutations.teardownWorktree(dialog.worktree.agent))}
          onCancel={closeDialog}
        >
          Vas a eliminar el worktree <b style={{ color: 'var(--tx)' }}>{dialog.worktree.branch}</b>.
        </ConfirmDialog>
      ) : null}
    </div>
  )
}
