import { Ag, Dial, Hint, Kbd, Pill } from '@/components/atoms'
import { RailNode } from '@/components/molecules'
import type { OrchestrationSnapshot } from '@/domain/types'
import styles from './OrchestrationFlow.module.css'

interface RailItem {
  agent: OrchestrationSnapshot['worktrees'][number]['agent']
  jiraKey: string
  ready: boolean
  ahead: number
}

function toRailItems(snapshot: OrchestrationSnapshot): RailItem[] {
  return snapshot.worktrees.map((w) => {
    const merge = snapshot.mergeOrder.items.find((m) => m.jiraKey === w.jiraKey && m.ready)
    return { agent: w.agent, jiraKey: w.jiraKey, ready: Boolean(merge), ahead: merge?.ahead ?? w.ahead }
  })
}

/** V3 · Flow — agent-centric merge train heading to develop. */
export function OrchestrationFlow({ snapshot }: { snapshot: OrchestrationSnapshot }) {
  const { mergeOrder, overlap, gate } = snapshot
  const items = toRailItems(snapshot)
  const readyCount = items.filter((i) => i.ready).length
  const leftFor = (i: number) => (items.length <= 1 ? 30 : 22 + (i * 46) / (items.length - 1))

  return (
    <div className={styles.screen}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="mono" style={{ fontSize: 17, fontWeight: 600, letterSpacing: '0.04em' }}>
            TALOS
          </span>
          <span className="faint" style={{ whiteSpace: 'nowrap' }}>
            Merge train
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Pill kind="ok" active>
            {snapshot.worktrees.length} worktrees
          </Pill>
          <Pill kind="accent">⇥ flow</Pill>
        </div>
      </div>

      <div className={styles.body}>
        {/* left — dial + overlap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            className="panel panel-pad"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              padding: '24px 20px',
            }}
          >
            <span className="eyebrow" style={{ alignSelf: 'flex-start' }}>
              Salud de merge
            </span>
            <Dial value={mergeOrder.conflictRate} threshold={mergeOrder.threshold} />
            <span className="faint" style={{ fontSize: 12 }}>
              umbral de re-segmentación{' '}
              <span className="mono" style={{ color: 'var(--tx-dim)' }}>
                {mergeOrder.threshold}%
              </span>
            </span>
          </div>
          <div
            className="panel panel-pad"
            style={{
              padding: 20,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span className="eyebrow">Overlap · colisión</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span className="mono" style={{ fontSize: 38, color: 'var(--ok)' }}>
                {overlap.pairs.colliding}/{overlap.pairs.total}
              </span>
              <span className="dim" style={{ fontSize: 13 }}>
                pares
              </span>
            </div>
            <p className="faint" style={{ fontSize: 12, lineHeight: 1.5, margin: 0 }}>
              Ningún <span className="mono">module:*</span> compartido en vuelo — verdict{' '}
              <span style={{ color: 'var(--ok)' }}>{overlap.verdict}</span>.
            </p>
          </div>
        </div>

        {/* right — the rail */}
        <div
          className="panel"
          style={{ position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <div className="panel-head" style={{ padding: '20px 24px 0', marginBottom: 0 }}>
            <span className="panel-title">
              Orden de merge →{' '}
              <span className="mono" style={{ color: 'var(--accent)' }}>
                {mergeOrder.base}
              </span>
            </span>
            <span className="faint mono" style={{ fontSize: 12 }}>
              ordered · {readyCount} ready
            </span>
          </div>

          <div className={styles.rail}>
            <div
              style={{
                position: 'absolute',
                right: 28,
                top: '50%',
                transform: 'translateY(-50%)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 150,
                  background:
                    'linear-gradient(var(--accent), color-mix(in oklch, var(--accent) 30%, transparent))',
                  borderRadius: 4,
                  margin: '0 auto 12px',
                }}
              />
              <div className="mono" style={{ fontSize: 13, color: 'var(--accent)' }}>
                {mergeOrder.base}
              </div>
              <div className="faint" style={{ fontSize: 11, marginTop: 2 }}>
                base
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                left: '8%',
                right: '14%',
                top: '50%',
                height: 2,
                background:
                  'repeating-linear-gradient(90deg, var(--line-hard) 0 8px, transparent 8px 16px)',
              }}
            />
            {items.map((item, i) => (
              <RailNode
                key={item.jiraKey}
                agent={item.agent}
                jiraKey={item.jiraKey}
                ahead={item.ahead}
                ready={item.ready}
                left={leftFor(i)}
                dim={!item.ready}
              />
            ))}
          </div>

          <div
            style={{
              borderTop: '1px solid var(--line)',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <span className="eyebrow">Bench · idle</span>
            <span style={{ display: 'flex', gap: 8 }}>
              {snapshot.idleAgents.map((nm) => (
                <Ag key={nm} name={nm} />
              ))}
            </span>
            <span className="faint" style={{ fontSize: 12 }}>
              {snapshot.idleAgents.length} figuras sin tarea activa
            </span>
            <span style={{ flex: 1 }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <Ag name="argos" size="sm" />
              <span className="faint" style={{ fontSize: 12 }}>
                ARGOS standby · Judgment Day desde Fase 3
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="hints" style={{ paddingTop: 18, marginTop: 18, borderTop: '1px solid var(--line-soft)' }}>
        <Hint keys={<Kbd>m</Kbd>}>merge next</Hint>
        <Hint keys={<Kbd>n</Kbd>}>new worktree</Hint>
        <Hint keys={<Kbd>x</Kbd>}>teardown</Hint>
        <Hint keys={<Kbd>↵</Kbd>}>inspect</Hint>
        <span style={{ flex: 1 }} />
        <span className="hint mono" style={{ color: 'var(--tx-ghost)' }}>
          {gate.id} {gate.state} · ZEUS
        </span>
      </div>
    </div>
  )
}
