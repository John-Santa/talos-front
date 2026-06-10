import type { CSSProperties, ReactNode } from 'react'

export interface PanelProps {
  title?: ReactNode
  /** Right-aligned slot in the panel header (meta, pill, count…). */
  meta?: ReactNode
  children: ReactNode
  className?: string
  style?: CSSProperties
  headStyle?: CSSProperties
}

/** A titled `.panel` card with the standard padded header. */
export function Panel({ title, meta, children, className, style, headStyle }: PanelProps) {
  const hasHead = title != null || meta != null
  return (
    <div className={`panel panel-pad${className ? ` ${className}` : ''}`} style={style}>
      {hasHead ? (
        <div className="panel-head" style={headStyle}>
          {title != null ? <span className="panel-title">{title}</span> : <span />}
          {meta}
        </div>
      ) : null}
      {children}
    </div>
  )
}
