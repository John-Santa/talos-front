import { Ag, Pill } from '@/components/atoms'
import { AGENTS, type Figura } from '@/domain/agents'

export interface RailNodeProps {
  agent: Figura
  jiraKey: string
  ahead: number
  ready: boolean
  /** Horizontal position on the rail, percent. */
  left: number
  dim?: boolean
}

/** A worktree as a node sitting on the merge rail. */
export function RailNode({ agent, jiraKey, ahead, ready, left, dim }: RailNodeProps) {
  const hue = `var(${AGENTS[agent].hueToken})`
  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        opacity: dim ? 0.62 : 1,
      }}
    >
      <div style={{ position: 'relative', display: 'inline-grid', placeItems: 'center' }}>
        <span
          style={{
            position: 'absolute',
            inset: -7,
            borderRadius: 16,
            border: `1px solid color-mix(in oklch, ${hue} 40%, transparent)`,
            boxShadow: ready ? `0 0 22px color-mix(in oklch, ${hue} 30%, transparent)` : 'none',
          }}
        />
        <Ag name={agent} size="lg" />
      </div>
      <div className="ag-name" style={{ fontSize: 13, marginTop: 12 }}>
        {AGENTS[agent].name}
      </div>
      <div className="mono faint" style={{ fontSize: 11, marginTop: 2 }}>
        {jiraKey}
      </div>
      <div style={{ marginTop: 8 }}>
        <Pill kind={ready ? 'ok' : 'warn'} active={!ready}>
          {ready ? `✓ +${ahead}` : 'building'}
        </Pill>
      </div>
    </div>
  )
}
