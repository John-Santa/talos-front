/* eslint-disable react-refresh/only-export-components */
import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RepositoryProvider } from '@/data/RepositoryProvider'
import { createFixtureRepository } from '@/data/fixtureRepository'
import type { TalosRepository } from '@/data/repository'

export interface RenderAppOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Inject a repository; defaults to a fresh fixture repository. */
  repository?: TalosRepository
  /** Initial router entry. */
  route?: string
}

/** RTL render wrapped in the repository provider + an in-memory router. */
export function renderApp(ui: ReactElement, options: RenderAppOptions = {}) {
  const { repository, route = '/', ...rest } = options
  const repo = repository ?? createFixtureRepository()
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <RepositoryProvider repository={repo}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </RepositoryProvider>
    )
  }
  return render(ui, { wrapper: Wrapper, ...rest })
}

export * from '@testing-library/react'
