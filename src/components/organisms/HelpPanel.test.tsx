import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelpPanel } from './HelpPanel'

describe('HelpPanel', () => {
  it('renders the welcome copy and the three views', () => {
    render(<HelpPanel view="console" onPick={() => {}} onClose={() => {}} />)
    expect(screen.getByText('Bienvenido a la consola')).toBeInTheDocument()
    expect(screen.getByText('Fiel')).toBeInTheDocument()
    expect(screen.getByText('Consola')).toBeInTheDocument()
    expect(screen.getByText('Flow')).toBeInTheDocument()
  })

  it('picks a view and closes', async () => {
    const onPick = vi.fn()
    const onClose = vi.fn()
    render(<HelpPanel view="console" onPick={onPick} onClose={onClose} />)
    await userEvent.click(screen.getByText('Fiel'))
    expect(onPick).toHaveBeenCalledWith('faithful')
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
