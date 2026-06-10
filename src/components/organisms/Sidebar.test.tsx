import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

function renderSidebar() {
  return render(
    <MemoryRouter>
      <Sidebar worktreeCount={2} agentCount={7} />
    </MemoryRouter>,
  )
}

describe('Sidebar — nav cleanup', () => {
  it('does NOT render a "SDD Flow" nav item', () => {
    renderSidebar()
    expect(screen.queryByText('SDD Flow')).not.toBeInTheDocument()
  })

  it('does NOT render a "Gates" nav item', () => {
    renderSidebar()
    expect(screen.queryByText('Gates')).not.toBeInTheDocument()
  })

  it('Judgment Day nav link points to /judgment (not a hardcoded jiraKey)', () => {
    renderSidebar()
    const judgmentLink = screen.getByRole('link', { name: /judgment day/i })
    expect(judgmentLink).toHaveAttribute('href', '/judgment')
  })
})
