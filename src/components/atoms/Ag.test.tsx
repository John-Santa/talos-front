import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Ag } from './Ag'

describe('Ag', () => {
  it('renders the figura monogram with its identity-hue class', () => {
    const { container } = render(<Ag name="hermes" />)
    const el = container.querySelector('.ag')
    expect(el).not.toBeNull()
    expect(el).toHaveClass('ag-hermes')
    expect(el?.textContent).toBe('h') // CSS uppercases it visually
  })

  it('applies the size variant class', () => {
    const { container } = render(<Ag name="zeus" size="xl" />)
    expect(container.querySelector('.ag')).toHaveClass('xl')
  })
})
