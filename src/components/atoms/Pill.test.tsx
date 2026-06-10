import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Pill } from './Pill'

describe('Pill', () => {
  it('renders kind + active classes and a dot when active', () => {
    const { container } = render(
      <Pill kind="ok" active>
        active
      </Pill>,
    )
    const el = container.querySelector('.pill')
    expect(el).toHaveClass('ok', 'active')
    expect(container.querySelector('.dot')).not.toBeNull()
    expect(el?.textContent).toContain('active')
  })

  it('omits the dot when not active', () => {
    const { container } = render(<Pill>idle slot</Pill>)
    expect(container.querySelector('.dot')).toBeNull()
  })
})
