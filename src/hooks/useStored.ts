import { useEffect, useState } from 'react'

/**
 * A piece of UI state mirrored to localStorage. Tolerant of storage failures
 * (private mode, quota). Ported from the design shell's `useStored`.
 */
export function useStored(key: string, def: string): [string, (value: string) => void] {
  const [value, setValue] = useState<string>(() => {
    try {
      return localStorage.getItem(key) ?? def
    } catch {
      return def
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // ignore write failures
    }
  }, [key, value])

  return [value, setValue]
}
