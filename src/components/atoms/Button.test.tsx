import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders and fires onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Mergear</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Mergear' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        X
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'X' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
