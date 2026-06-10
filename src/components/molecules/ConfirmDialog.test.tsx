import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders the title and fires confirm / cancel', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog title="¿Mergear?" confirmLabel="Mergear" onConfirm={onConfirm} onCancel={onCancel}>
        cuerpo del diálogo
      </ConfirmDialog>,
    )
    expect(screen.getByRole('dialog', { name: '¿Mergear?' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Mergear' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
