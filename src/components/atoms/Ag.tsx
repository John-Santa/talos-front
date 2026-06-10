import type { Figura } from '@/domain/agents'

export type AgSize = 'sm' | 'lg' | 'xl'

export interface AgProps {
  name: Figura
  size?: AgSize
}

/** Agent monogram badge — first letter rendered on the figura's identity hue. */
export function Ag({ name, size }: AgProps) {
  return <span className={`ag ag-${name}${size ? ` ${size}` : ''}`}>{name.charAt(0)}</span>
}
