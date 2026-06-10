import { useEffect, useRef } from 'react'

export type KeyBindings = Record<string, (e: KeyboardEvent) => void>

/**
 * Global keyboard bindings keyed by `event.key`. Ignores keystrokes while the
 * user is typing in an input/textarea. Bindings are read through a ref so the
 * listener is attached only once.
 */
export function useKeyboard(bindings: KeyBindings) {
  const ref = useRef(bindings)

  useEffect(() => {
    ref.current = bindings
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      const handler = ref.current[e.key]
      if (handler) handler(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
