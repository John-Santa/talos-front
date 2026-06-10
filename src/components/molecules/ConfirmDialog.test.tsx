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

  it('renders the error message when errorMessage is provided', () => {
    render(
      <ConfirmDialog
        title="¿Mergear?"
        onConfirm={() => {}}
        onCancel={() => {}}
        errorMessage="TALOS gateway POST /api/worktrees → 400"
      >
        cuerpo
      </ConfirmDialog>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('TALOS gateway POST /api/worktrees → 400')
  })

  it('does not render an error element when errorMessage is absent', () => {
    render(
      <ConfirmDialog title="¿Mergear?" onConfirm={() => {}} onCancel={() => {}}>
        cuerpo
      </ConfirmDialog>,
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
