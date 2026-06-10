/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { TalosRepository } from './repository'
import { createRepository } from './index'

const RepositoryContext = createContext<TalosRepository | null>(null)

export interface RepositoryProviderProps {
  /** Inject a repository (tests pass a fixture/fake); defaults to the env-selected one. */
  repository?: TalosRepository
  children: ReactNode
}

export function RepositoryProvider({ repository, children }: RepositoryProviderProps) {
  const repo = useMemo(() => repository ?? createRepository(), [repository])
  return <RepositoryContext.Provider value={repo}>{children}</RepositoryContext.Provider>
}

export function useRepository(): TalosRepository {
  const repo = useContext(RepositoryContext)
  if (!repo) throw new Error('useRepository must be used within a RepositoryProvider')
  return repo
}
