import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { KV } from './KV'

describe('KV', () => {
  it('renders the label and value', () => {
    const { container } = render(<KV k="branch">agent/hermes/TAL-15</KV>)
    expect(container.querySelector('.k')?.textContent).toBe('branch')
    expect(container.querySelector('.v')?.textContent).toBe('agent/hermes/TAL-15')
  })

  it('applies the value color override', () => {
    const { container } = render(
      <KV k="status" valueColor="var(--ok)">
        active
      </KV>,
    )
    const v = container.querySelector<HTMLElement>('.v')
    expect(v?.style.color).toBe('var(--ok)')
  })
})
