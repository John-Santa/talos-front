import { useParams } from 'react-router-dom'
import { isFigura } from '@/domain/agents'
import { Eyebrow } from '@/components/atoms'

/** Placeholder for PR4 — PR8 fills in the hero, worktree, DoD and timeline. */
export function AgentDetailContainer() {
  const { figura } = useParams()
  const name = figura && isFigura(figura) ? figura.toUpperCase() : 'desconocido'
  return (
    <div style={{ flex: 1, padding: 24 }}>
      <Eyebrow>Agents /</Eyebrow>
      <h1 style={{ font: '600 24px/1.1 var(--sans)', margin: '8px 0 0' }}>{name}</h1>
      <p className="faint" style={{ fontSize: 12, marginTop: 8 }}>
        vista en construcción
      </p>
    </div>
  )
}
