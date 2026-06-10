import type { CSSProperties } from 'react'

export interface WordmarkProps {
  /** Badge text after the name. Pass an empty string to hide it. */
  tag?: string
  className?: string
  style?: CSSProperties
}

/** The TALOS wordmark: gradient mark + name + optional tag. */
export function Wordmark({ tag = 'Hybrid', className, style }: WordmarkProps) {
  return (
    <span className={`wm${className ? ` ${className}` : ''}`} style={style}>
      <span className="mark">T</span>
      <span className="name">TALOS</span>
      {tag ? <span className="tag">{tag}</span> : null}
    </span>
  )
}
