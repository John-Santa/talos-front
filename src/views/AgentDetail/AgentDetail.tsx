import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Ag, KV, Pill } from '@/components/atoms'
import { DoDRow, Panel, TimelineItem } from '@/components/molecules'
import type { AgentDetailData } from '@/domain/types'
import styles from './AgentDetail.module.css'

/** Agent detail: hero · current worktree · Definition of Done · activity timeline. */
export function AgentDetail({ detail }: { detail: AgentDetailData }) {
  const { agent, worktree, dod, activity } = detail
  const done = dod.filter((d) => d.state === 'done').length

  return (
    <div className={styles.screen}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
        <Link to="/agents" className="crumb-link" style={{ fontSize: 14 }}>
          Agents
        </Link>
        <span className="faint" style={{ fontSize: 14 }}>
          /
        </span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{agent.name.toUpperCase()}</span>
        <span style={{ flex: 1 }} />
        {worktree ? (
          <Pill kind="ok" active>
            {worktree.status}
          </Pill>
        ) : (
          <Pill>idle</Pill>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          paddingBottom: 24,
          borderBottom: '1px solid var(--line)',
          flexWrap: 'wrap',
        }}
      >
        <Ag name={agent.id} size="xl" />
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <h1 style={{ font: '600 26px/1 var(--sans)', margin: 0, letterSpacing: '-0.01em' }}>
              {agent.name}
            </h1>
            <span className="faint" style={{ whiteSpace: 'nowrap' }}>
              · {agent.role}
            </span>
          </div>
          <p className="dim" style={{ fontSize: 13.5, margin: '8px 0 0', maxWidth: 560, lineHeight: 1.5 }}>
            Identidad por label{' '}
            <span className="mono" style={{ color: `var(${agent.hueToken})` }}>
              agent:{agent.id}
            </span>
            , no por assignee.
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 28 }}>
          <KV k="model">{agent.model}</KV>
          {worktree ? <KV k="module">{worktree.module}</KV> : null}
        </div>
      </div>

      <div className={styles.cols}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {worktree ? (
            <Panel
              title="Worktree actual"
              meta={
                <span className="mono faint" style={{ fontSize: 12 }}>
                  isolation: worktree
                </span>
              }
            >
              <div className={styles.kvGrid}>
                <KV k="branch">{worktree.branch}</KV>
                <KV k="head">{worktree.head}</KV>
                <KV k="base">develop</KV>
                <KV k="ahead" valueColor="var(--ok)">
                  +{worktree.ahead}
                </KV>
              </div>
            </Panel>
          ) : (
            <Panel title="Worktree actual">
              <p className="faint" style={{ fontSize: 13, margin: 0 }}>
                Sin worktree activo.
              </p>
            </Panel>
          )}

          {dod.length > 0 ? (
            <Panel
              title="Definition of Done"
              meta={
                <Pill kind={done === dod.length ? 'ok' : 'warn'}>
                  {done} / {dod.length}
                </Pill>
              }
            >
              {dod.map((item, i) => (
                <Fragment key={item.kind}>
                  {i > 0 ? <hr className="hr" /> : null}
                  <DoDRow item={item} />
                </Fragment>
              ))}
            </Panel>
          ) : null}
        </div>

        <Panel
          title="Actividad"
          meta={
            <span className="mono faint" style={{ fontSize: 12 }}>
              change: jira-evidence-loop
            </span>
          }
        >
          {activity.length > 0 ? (
            <div style={{ marginTop: 4 }}>
              {activity.map((entry, i) => (
                <TimelineItem key={`${entry.at}-${i}`} entry={entry} last={i === activity.length - 1} />
              ))}
            </div>
          ) : (
            <p className="faint" style={{ fontSize: 13, margin: 0 }}>
              Sin actividad reciente.
            </p>
          )}
        </Panel>
      </div>
    </div>
  )
}
