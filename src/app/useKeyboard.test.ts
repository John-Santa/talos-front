import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboard } from './useKeyboard'

function press(key: string, target: EventTarget = document.body) {
  const e = new KeyboardEvent('keydown', { key, bubbles: true })
  Object.defineProperty(e, 'target', { value: target })
  window.dispatchEvent(e)
}

describe('useKeyboard', () => {
  it('invokes the handler for a bound key', () => {
    const onTwo = vi.fn()
    renderHook(() => useKeyboard({ '2': onTwo }))
    press('2')
    expect(onTwo).toHaveBeenCalledTimes(1)
  })

  it('ignores keys while typing in an input', () => {
    const onTwo = vi.fn()
    renderHook(() => useKeyboard({ '2': onTwo }))
    const input = document.createElement('input')
    press('2', input)
    expect(onTwo).not.toHaveBeenCalled()
  })

  it('does nothing for an unbound key', () => {
    const onTwo = vi.fn()
    renderHook(() => useKeyboard({ '2': onTwo }))
    press('9')
    expect(onTwo).not.toHaveBeenCalled()
  })
})
