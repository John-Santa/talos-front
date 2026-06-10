import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppBar } from './AppBar'

describe('AppBar + SegSwitcher', () => {
  it('marks the active view and reports picks', async () => {
    const onPick = vi.fn()
    render(<AppBar view="console" onPick={onPick} onHelp={() => {}} />)
    expect(screen.getByRole('tab', { name: /Consola/ })).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(screen.getByRole('tab', { name: /Flow/ }))
    expect(onPick).toHaveBeenCalledWith('flow')
  })

  it('fires the help handler', async () => {
    const onHelp = vi.fn()
    render(<AppBar view="console" onPick={() => {}} onHelp={onHelp} />)
    await userEvent.click(screen.getByRole('button', { name: 'Ayuda' }))
    expect(onHelp).toHaveBeenCalledTimes(1)
  })
})
