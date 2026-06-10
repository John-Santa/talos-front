import type { ReactNode } from 'react'

/** A keyboard key hint. */
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd>{children}</kbd>
}
