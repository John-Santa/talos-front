import type { ReactNode } from 'react'

export type PillKind = 'ok' | 'warn' | 'danger' | 'accent'

export interface PillProps {
  kind?: PillKind
  active?: boolean
  children: ReactNode
}

/** Status pill. `active` adds a leading dot with a soft glow. */
export function Pill({ kind, active, children }: PillProps) {
  return (
    <span className={`pill${kind ? ` ${kind}` : ''}${active ? ' active' : ''}`}>
      {active ? <i className="dot" /> : null}
      {children}
    </span>
  )
}
