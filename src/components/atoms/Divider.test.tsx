import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Hr, Vr } from './Divider'

describe('Divider', () => {
  it('Hr renders an <hr> with the .hr class', () => {
    const { container } = render(<Hr />)
    expect(container.querySelector('hr')).toHaveClass('hr')
  })

  it('Vr renders a .vr element', () => {
    const { container } = render(<Vr />)
    expect(container.querySelector('.vr')).not.toBeNull()
  })
})
