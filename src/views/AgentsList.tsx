import { Link } from 'react-router-dom'
import { ALL_AGENTS } from '@/domain/agents'
import { Ag, Eyebrow } from '@/components/atoms'

/** Grid of every figura, linking to its detail. */
export function AgentsList() {
  return (
    <div style={{ flex: 1, padding: 24, overflow: 'auto' }}>
      <Eyebrow style={{ marginBottom: 16 }}>Agents · {ALL_AGENTS.length}</Eyebrow>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 12,
        }}
      >
        {ALL_AGENTS.map((a) => (
          <Link
            key={a.id}
            to={`/agents/${a.id}`}
            className="panel panel-pad"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Ag name={a.id} size="lg" />
            <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span className="ag-name">{a.name}</span>
              <span className="faint" style={{ fontSize: 11 }}>
                {a.role}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
