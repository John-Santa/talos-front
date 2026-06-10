import type { CSSProperties } from 'react'

/** Horizontal hairline divider. */
export function Hr({ style }: { style?: CSSProperties }) {
  return <hr className="hr" style={style} />
}

/** Vertical hairline divider (stretches to its flex parent). */
export function Vr({ style }: { style?: CSSProperties }) {
  return <span className="vr" style={style} />
}
