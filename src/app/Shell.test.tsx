import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { RepositoryProvider } from '@/data/RepositoryProvider'
import { createFixtureRepository } from '@/data/fixtureRepository'
import { ViewModeProvider } from './ViewMode'
import { routeObjects } from './routes'

function renderShell(initialEntries: string[] = ['/orchestration']) {
  const router = createMemoryRouter(routeObjects, { initialEntries })
  return render(
    <RepositoryProvider repository={createFixtureRepository()}>
      <ViewModeProvider>
        <RouterProvider router={router} />
      </ViewModeProvider>
    </RepositoryProvider>,
  )
}

describe('shell', () => {
  beforeEach(() => localStorage.clear())

  it('renders the wordmark and defaults to the console view', () => {
    renderShell()
    expect(screen.getByText('TALOS')).toBeInTheDocument()
    expect(screen.getByTestId('orchestration')).toHaveAttribute('data-view', 'console')
  })

  it('switches the view with 1·2·3 and persists the choice', async () => {
    renderShell()
    await userEvent.keyboard('1')
    expect(screen.getByTestId('orchestration')).toHaveAttribute('data-view', 'faithful')
    expect(localStorage.getItem('talos.view')).toBe('faithful')
  })

  it('opens help with "?" and closes with Escape', async () => {
    renderShell()
    await userEvent.keyboard('?')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('routes to an agent detail', () => {
    renderShell(['/agents/hermes'])
    expect(screen.getByRole('heading', { name: 'HERMES' })).toBeInTheDocument()
  })
})
