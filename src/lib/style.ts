import type { CSSProperties } from 'react'

/** CSSProperties that also allows CSS custom properties (e.g. `--c`). */
export type CSSWithVars = CSSProperties & Record<`--${string}`, string | number>
