/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useStored } from '@/hooks/useStored'
import { DEFAULT_VIEW, isViewMode, type ViewMode } from './viewModes'

interface ViewModeContextValue {
  view: ViewMode
  setView: (v: ViewMode) => void
}

const ViewModeContext = createContext<ViewModeContextValue | null>(null)

/** Holds the selected main-screen rendering, persisted to localStorage. */
export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useStored('talos.view', DEFAULT_VIEW)
  const value = useMemo<ViewModeContextValue>(
    () => ({
      view: isViewMode(raw) ? raw : DEFAULT_VIEW,
      setView: setRaw,
    }),
    [raw, setRaw],
  )
  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>
}

export function useViewMode(): ViewModeContextValue {
  const ctx = useContext(ViewModeContext)
  if (!ctx) throw new Error('useViewMode must be used within a ViewModeProvider')
  return ctx
}
