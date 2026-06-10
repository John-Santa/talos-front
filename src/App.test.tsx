import { render, screen } from '@testing-library/react'
import App from './App'

describe('App (scaffold smoke test)', () => {
  it('mounts and renders the TALOS wordmark', () => {
    render(<App />)
    expect(screen.getByText('TALOS')).toBeInTheDocument()
  })

  it('renders inside the `.tw` design-system scope', () => {
    const { container } = render(<App />)
    expect(container.querySelector('.tw')).not.toBeNull()
  })
})
