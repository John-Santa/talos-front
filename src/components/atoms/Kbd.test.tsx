import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Kbd } from './Kbd'
import { Hint } from './Hint'

describe('Kbd & Hint', () => {
  it('Kbd renders a <kbd>', () => {
    const { container } = render(<Kbd>k</Kbd>)
    expect(container.querySelector('kbd')?.textContent).toBe('k')
  })

  it('Hint renders leading keys and a bold label', () => {
    const { container, getByText } = render(<Hint keys={<Kbd>m</Kbd>}>merge</Hint>)
    expect(container.querySelector('.hint')).not.toBeNull()
    expect(container.querySelector('kbd')?.textContent).toBe('m')
    expect(getByText('merge').tagName).toBe('B')
  })
})
