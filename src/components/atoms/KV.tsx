import type { CSSProperties, ReactNode } from 'react'

export interface KVProps {
  k: ReactNode
  children: ReactNode
  /** Optional override for the value color (e.g. `var(--ok)`). */
  valueColor?: string
}

/** A stacked key/value pair — uppercase label over a mono value. */
export function KV({ k, children, valueColor }: KVProps) {
  const valueStyle: CSSProperties | undefined = valueColor ? { color: valueColor } : undefined
  return (
    <div className="kv">
      <span className="k">{k}</span>
      <span className="v" style={valueStyle}>
        {children}
      </span>
    </div>
  )
}
