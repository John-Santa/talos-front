import { useState } from 'react'
import { Hint, Kbd, Pill } from '@/components/atoms'
import { Sidebar } from '@/components/organisms/Sidebar'
import { WorktreeTable } from '@/components/organisms/WorktreeTable'
import { OrchestrationRail } from '@/components/organisms/OrchestrationRail'
import { ALL_AGENTS } from '@/domain/agents'
import type { OrchestrationSnapshot } from '@/domain/types'
import styles from './OrchestrationConsole.module.css'

/** V2 · Consola — the full app shell: sidebar · table · rail · command strip. */
export function OrchestrationConsole({ snapshot }: { snapshot: OrchestrationSnapshot }) {
  const [navOpen, setNavOpen] = useState(false)
  const closeNav = () => setNavOpen(false)
  return (
    <div className={styles.shell}>
      <Sidebar
        className={`${styles.sidebar}${navOpen ? ` ${styles.sidebarOpen}` : ''}`}
        worktreeCount={snapshot.worktrees.length}
        agentCount={ALL_AGENTS.length}
        gate={snapshot.gate.id}
        open={navOpen}
        onNavigate={closeNav}
      />
      {navOpen ? <div className={styles.scrim} onClick={closeNav} aria-hidden="true" /> : null}
      <div className={styles.main}>
        <div className={styles.topbar}>
          <button
            type="button"
            data-testid="nav-toggle"
            className={styles.hamburger}
            onClick={() => setNavOpen(true)}
            aria-label="Abrir navegación"
            aria-expanded={navOpen}
          >
            ☰
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
            Orchestration <span className="faint" style={{ fontWeight: 400 }}>/ Worktrees</span>
          </span>
          <span style={{ flex: 1 }} />
          <div className={styles.topTools}>
            <div className="cmdk">
              <span className="mono" style={{ color: 'var(--tx-dim)' }}>
                ⌘K
              </span>
              <span className="grow">run a command…</span>
              <Kbd>/</Kbd>
            </div>
            <Pill kind="accent">⇥ grid</Pill>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.tableWrap}>
            <WorktreeTable
              worktrees={snapshot.worktrees}
              idleAgents={snapshot.idleAgents}
              slots={snapshot.slots}
            />
          </div>
          <OrchestrationRail
            mergeOrder={snapshot.mergeOrder}
            overlap={snapshot.overlap}
            gate={snapshot.gate}
          />
        </div>

        <div className={`hints ${styles.strip}`}>
          <Hint
            keys={
              <>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
              </>
            }
          >
            move
          </Hint>
          <Hint keys={<Kbd>n</Kbd>}>new</Hint>
          <Hint keys={<Kbd>x</Kbd>}>teardown</Hint>
          <Hint keys={<Kbd>m</Kbd>}>merge</Hint>
          <Hint keys={<Kbd>?</Kbd>}>help</Hint>
          <span style={{ flex: 1 }} />
          <span className="hint mono" style={{ color: 'var(--tx-ghost)' }}>
            tablex.atlassian.net · TAL
          </span>
        </div>
      </div>
    </div>
  )
}
