import type { CSSProperties, ReactNode } from 'react'

/** Small uppercase section label. */
export function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="eyebrow" style={style}>
      {children}
    </div>
  )
}
