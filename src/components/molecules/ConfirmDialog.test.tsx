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

describe('ConfirmDialog — type-to-confirm (confirmPhrase)', () => {
  it('confirm button is disabled when confirmPhrase is set and field is empty', () => {
    render(
      <ConfirmDialog
        title="¿Mergear TAL-15?"
        confirmLabel="Mergear"
        confirmPhrase="TAL-15"
        onConfirm={() => {}}
        onCancel={() => {}}
      >
        cuerpo
      </ConfirmDialog>,
    )
    expect(screen.getByRole('button', { name: 'Mergear' })).toBeDisabled()
  })

  it('confirm button is disabled when typed text does not match confirmPhrase', async () => {
    render(
      <ConfirmDialog
        title="¿Mergear TAL-15?"
        confirmLabel="Mergear"
        confirmPhrase="TAL-15"
        onConfirm={() => {}}
        onCancel={() => {}}
      >
        cuerpo
      </ConfirmDialog>,
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'TAL-16')
    expect(screen.getByRole('button', { name: 'Mergear' })).toBeDisabled()
  })

  it('confirm button becomes enabled when typed text exactly matches confirmPhrase', async () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        title="¿Mergear TAL-15?"
        confirmLabel="Mergear"
        confirmPhrase="TAL-15"
        onConfirm={onConfirm}
        onCancel={() => {}}
      >
        cuerpo
      </ConfirmDialog>,
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'TAL-15')
    const confirmBtn = screen.getByRole('button', { name: 'Mergear' })
    expect(confirmBtn).not.toBeDisabled()
    await userEvent.click(confirmBtn)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('renders the confirmPhrase hint text in the dialog', () => {
    render(
      <ConfirmDialog
        title="¿Mergear TAL-15?"
        confirmPhrase="TAL-15"
        onConfirm={() => {}}
        onCancel={() => {}}
      >
        cuerpo
      </ConfirmDialog>,
    )
    // The phrase to type must be visible to guide the user (appears in the <b> hint)
    expect(screen.getAllByText('TAL-15').length).toBeGreaterThan(0)
  })

  it('does not render a type-to-confirm input when confirmPhrase is absent', () => {
    render(
      <ConfirmDialog title="¿Teardown?" onConfirm={() => {}} onCancel={() => {}}>
        cuerpo
      </ConfirmDialog>,
    )
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('confirm button is enabled normally when no confirmPhrase is set', async () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog title="¿Teardown?" confirmLabel="Eliminar" onConfirm={onConfirm} onCancel={() => {}}>
        cuerpo
      </ConfirmDialog>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
