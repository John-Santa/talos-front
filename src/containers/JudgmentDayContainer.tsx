import { useParams } from 'react-router-dom'
import { Eyebrow } from '@/components/atoms'

/** Placeholder for PR4 — PR9 fills in ARGOS, the judges and the ZEUS escalation. */
export function JudgmentDayContainer() {
  const { jiraKey } = useParams()
  return (
    <div style={{ flex: 1, padding: 24 }}>
      <Eyebrow>Judgment Day /</Eyebrow>
      <h1 style={{ font: '600 24px/1.1 var(--sans)', margin: '8px 0 0' }}>{jiraKey ?? '—'}</h1>
      <p className="faint" style={{ fontSize: 12, marginTop: 8 }}>
        vista en construcción
      </p>
    </div>
  )
}
