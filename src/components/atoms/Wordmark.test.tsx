import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Wordmark } from './Wordmark'

describe('Wordmark', () => {
  it('renders TALOS with the default Hybrid tag', () => {
    const { container, getByText } = render(<Wordmark />)
    expect(getByText('TALOS')).toBeInTheDocument()
    expect(getByText('Hybrid')).toBeInTheDocument()
    expect(container.querySelector('.mark')?.textContent).toBe('T')
  })

  it('hides the tag when given an empty string', () => {
    const { queryByText } = render(<Wordmark tag="" />)
    expect(queryByText('Hybrid')).toBeNull()
  })
})
