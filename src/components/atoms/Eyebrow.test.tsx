import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Eyebrow } from './Eyebrow'

describe('Eyebrow', () => {
  it('renders its label inside a .eyebrow', () => {
    const { container } = render(<Eyebrow>Premisa de diseño</Eyebrow>)
    expect(container.querySelector('.eyebrow')?.textContent).toBe('Premisa de diseño')
  })
})
