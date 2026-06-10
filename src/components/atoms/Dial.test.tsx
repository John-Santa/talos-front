import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Dial } from './Dial'

describe('Dial', () => {
  it('renders the value read-out and label', () => {
    const { getByText } = render(<Dial value={0} />)
    expect(getByText('0%')).toBeInTheDocument()
    expect(getByText('conflict')).toBeInTheDocument()
  })

  it('draws a track arc, a value arc and a threshold line', () => {
    const { container } = render(<Dial value={10} />)
    expect(container.querySelectorAll('circle')).toHaveLength(2)
    expect(container.querySelector('line')).not.toBeNull()
  })
})
