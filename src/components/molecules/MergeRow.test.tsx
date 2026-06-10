import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MergeRow } from './MergeRow'
import type { MergeItem } from '@/domain/types'

const item: MergeItem = {
  n: 1,
  agent: 'hermes',
  jiraKey: 'TAL-15',
  ahead: 4,
  ready: true,
}

function renderRow(mergeItem: MergeItem = item) {
  return render(
    <MemoryRouter>
      <MergeRow item={mergeItem} />
    </MemoryRouter>,
  )
}

describe('MergeRow — navigation link', () => {
  it('renders the jiraKey as a link to /judgment/:jiraKey', () => {
    renderRow()
    const link = screen.getByRole('link', { name: /TAL-15/i })
    expect(link).toHaveAttribute('href', '/judgment/TAL-15')
  })

  it('still shows the conflict files badge when conflictFiles is non-empty', () => {
    renderRow({ ...item, conflictFiles: ['src/foo.ts', 'src/bar.ts'] })
    expect(screen.getByText(/2 conflict/i)).toBeInTheDocument()
  })
})
