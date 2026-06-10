import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useStored } from './useStored'

describe('useStored', () => {
  beforeEach(() => localStorage.clear())

  it('returns the default when nothing is stored', () => {
    const { result } = renderHook(() => useStored('talos.view', 'console'))
    expect(result.current[0]).toBe('console')
  })

  it('persists updates to localStorage', () => {
    const { result } = renderHook(() => useStored('talos.view', 'console'))
    act(() => result.current[1]('flow'))
    expect(result.current[0]).toBe('flow')
    expect(localStorage.getItem('talos.view')).toBe('flow')
  })

  it('reads an existing stored value over the default', () => {
    localStorage.setItem('talos.view', 'faithful')
    const { result } = renderHook(() => useStored('talos.view', 'console'))
    expect(result.current[0]).toBe('faithful')
  })
})
