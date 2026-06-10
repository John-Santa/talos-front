export type IconKind = 'orchestration' | 'agents' | 'sdd' | 'judgment' | 'gates' | 'worktree'

const PATHS: Record<IconKind, string> = {
  orchestration: 'M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z',
  agents: 'M8 2v4M8 10v4M3.5 8h9M5 5l6 6M11 5l-6 6',
  sdd: 'M3 2h7l3 3v9H3zM9 2v4h4',
  judgment: 'M1 8s2.6-4.5 7-4.5S15 8 15 8s-2.6 4.5-7 4.5S1 8 1 8z',
  gates: 'M8 1l5 2v4c0 3.5-2.4 5.7-5 7-2.6-1.3-5-3.5-5-7V3z',
  worktree: 'M4 2v8M4 13a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM4 4h6a2 2 0 012 2v0',
}

export interface IconProps {
  k: IconKind
  className?: string
}

/** Geometric glyph set drawn inline (filled for orchestration/sdd, stroked otherwise). */
export function Icon({ k, className }: IconProps) {
  const filled = k === 'orchestration' || k === 'sdd'
  return (
    <svg
      className={`glyph${className ? ` ${className}` : ''}`}
      viewBox="0 0 16 16"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {k === 'judgment' ? <circle cx="8" cy="8" r="2" fill="currentColor" stroke="none" /> : null}
      {k === 'agents' ? <circle cx="8" cy="8" r="1.6" fill="currentColor" stroke="none" /> : null}
      <path d={PATHS[k]} />
    </svg>
  )
}
