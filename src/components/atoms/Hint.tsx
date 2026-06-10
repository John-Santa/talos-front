import type { ReactNode } from 'react'

export interface HintProps {
  /** Leading key chips, typically `<Kbd>` elements. */
  keys?: ReactNode
  /** The hint label. */
  children: ReactNode
}

/** A `key(s) + label` hint, as used in the command strips. */
export function Hint({ keys, children }: HintProps) {
  return (
    <span className="hint">
      {keys}
      <b>{children}</b>
    </span>
  )
}
