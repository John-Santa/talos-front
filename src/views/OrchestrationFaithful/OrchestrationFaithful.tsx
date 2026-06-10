import { Ag, Hint, Kbd, KV, MiniGauge, Pill } from '@/components/atoms'
import { MergeRow, Panel } from '@/components/molecules'
import { AGENTS } from '@/domain/agents'
import { mergeTone, overlapTone } from '@/domain/selectors'
import type { OrchestrationSnapshot, Worktree } from '@/domain/types'
import type { CSSWithVars } from '@/lib/style'
import styles from './OrchestrationFaithful.module.css'

function WTRow({ worktree, selected }: { worktree: Worktree; selected?: boolean }) {
  const agent = AGENTS[worktree.agent]
  const rowStyle: CSSWithVars = {
    gridTemplateColumns: '18px 26px 1fr auto',
    '--c': `var(${agent.hueToken})`,
  }
  return (
    <div className={`row${selected ? ' sel' : ''}`} style={rowStyle}>
      <span
        className="mono"
        style={{ color: selected ? `var(${agent.hueToken})` : 'transparent', fontSize: 13 }}
      >
        ▸
      </span>
      <Ag name={worktree.agent} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="ag-name">
          {agent.name}{' '}
          <span className="mono dim" style={{ fontWeight: 400, fontSize: 12 }}>
            · {worktree.jiraKey}
          </span>
        </span>
        <span className="mono faint" style={{ fontSize: 11.5 }}>
          {worktree.branch}
        </span>
      </span>
      <Pill kind="ok" active>
        {worktree.status}
      </Pill>
    </div>
  )
}

const K_LABEL = {
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--tx-faint)',
} as const

/** V1 · Fiel — the current TUI ported to web: three panels + selected worktree. */
export function OrchestrationFaithful({ snapshot }: { snapshot: OrchestrationSnapshot }) {
  const selected = snapshot.worktrees[0]
  const { mergeOrder, overlap } = snapshot
  const tone = mergeTone(mergeOrder.conflictRate, mergeOrder.threshold)
  return (
    <div className={styles.screen}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span className="mono" style={{ fontSize: 17, fontWeight: 600, letterSpacing: '0.04em' }}>
            TALOS
          </span>
          <span className="mono" style={{ color: 'var(--tx-faint)' }}>
            — Hybrid
          </span>
        </div>
        <Pill kind="accent">⇥ layout · grid</Pill>
      </div>
      <hr className="hr" />

      <div className={styles.panels}>
        <Panel
          title="Worktrees"
          meta={
            <span className="mono faint" style={{ fontSize: 12 }}>
              {snapshot.worktrees.length} active
            </span>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {snapshot.worktrees.map((w, i) => (
              <WTRow key={w.branch} worktree={w} selected={i === 0} />
            ))}
          </div>
        </Panel>

        <Panel title="Merge Order">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <KV k="base">{mergeOrder.base}</KV>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={K_LABEL}>conflict rate</span>
                <span className="mono" style={{ fontSize: 12.5, color: `var(--${tone})` }}>
                  {mergeOrder.conflictRate}% <span className="faint">/ {mergeOrder.threshold}%</span>
                </span>
              </div>
              <MiniGauge value={mergeOrder.conflictRate} threshold={mergeOrder.threshold} tone={tone} />
            </div>
            <hr className="hr" />
            {mergeOrder.items.map((item) => (
              <MergeRow key={item.n} item={item} />
            ))}
          </div>
        </Panel>

        <Panel title="Overlap">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={K_LABEL}>verdict</span>
              <Pill kind={overlapTone(overlap.verdict)} active>
                {overlap.verdict}
              </Pill>
            </div>
            <KV k="collision rate">
              {overlap.collisionRate}%{' '}
              <span className="faint">
                · {overlap.pairs.colliding}/{overlap.pairs.total} pairs
              </span>
            </KV>
            <p className="dim" style={{ fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>
              Sin pares <span className="mono">module:*</span> compartidos en vuelo. Detección por JQL
              + blackboard.
            </p>
          </div>
        </Panel>
      </div>

      {selected ? (
        <Panel title="Selected Worktree" meta={<Ag name={selected.agent} />}>
          <div className={styles.selectedGrid}>
            <KV k="branch">{selected.branch}</KV>
            <KV k="head">{selected.head}</KV>
            <KV k="status" valueColor="var(--ok)">
              {selected.status}
            </KV>
            <KV k="figura">
              {selected.agent} <span className="faint">· {AGENTS[selected.agent].role}</span>
            </KV>
          </div>
        </Panel>
      ) : null}

      <div style={{ flex: 1 }} />
      <div className="hints" style={{ padding: '20px 2px', borderTop: '1px solid var(--line-soft)', marginTop: 22 }}>
        <Hint
          keys={
            <>
              <Kbd>k</Kbd>
              <Kbd>j</Kbd>
            </>
          }
        >
          move
        </Hint>
        <Hint keys={<Kbd>n</Kbd>}>new</Hint>
        <Hint keys={<Kbd>x</Kbd>}>teardown</Hint>
        <Hint keys={<Kbd>m</Kbd>}>merge</Hint>
        <Hint keys={<Kbd>⇥</Kbd>}>layout</Hint>
        <Hint keys={<Kbd>?</Kbd>}>help</Hint>
        <Hint keys={<Kbd>q</Kbd>}>quit</Hint>
      </div>
    </div>
  )
}
