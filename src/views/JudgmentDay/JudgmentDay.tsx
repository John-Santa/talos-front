import { Ag, Pill, Vr } from '@/components/atoms'
import { JudgeCard } from '@/components/molecules'
import type { JudgmentReview } from '@/domain/types'
import styles from './JudgmentDay.module.css'

/** Judgment Day: ARGOS, the blind judges, the fix-agent, and the verdict/escalation. */
export function JudgmentDay({ review }: { review: JudgmentReview }) {
  const conflict = review.verdict === 'conflict'
  return (
    <div className={styles.screen}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <span className="faint" style={{ fontSize: 14 }}>
          Judgment Day /
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>
          review {review.jiraKey}
        </span>
        <span style={{ flex: 1 }} />
        <Pill kind="danger" active>
          gate {review.gate} · hard
        </Pill>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          paddingBottom: 22,
          borderBottom: '1px solid var(--line)',
          flexWrap: 'wrap',
        }}
      >
        <Ag name="argos" size="xl" />
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <h1 style={{ font: '600 26px/1 var(--sans)', margin: 0 }}>ARGOS</h1>
            <span className="faint" style={{ whiteSpace: 'nowrap' }}>
              · el de los cien ojos
            </span>
          </div>
          <p className="dim" style={{ fontSize: 13.5, margin: '8px 0 0', maxWidth: 600, lineHeight: 1.5 }}>
            Revisión adversarial — <b style={{ color: 'var(--tx)' }}>juzga, no implementa</b>. Dos
            jueces ciegos + fix-agent, routing de modelo propio.
          </p>
        </div>
      </div>

      <div className={styles.judges}>
        {review.judges.map((j) => (
          <JudgeCard key={j.id} judge={j} />
        ))}
        <div className="panel panel-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                display: 'grid',
                placeItems: 'center',
                background: 'var(--surface-2)',
                border: '1px solid var(--line-hard)',
                fontSize: 13,
              }}
            >
              ⚒
            </span>
            <span className="mono" style={{ fontSize: 13.5 }}>
              jd-fix-agent
            </span>
          </div>
          <p className="dim" style={{ fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>
            Aplica solo los fixes confirmados por veredicto. Standby hasta resolver la contradicción.
          </p>
          <div className="faint mono" style={{ fontSize: 11, marginTop: 14 }}>
            {review.fixAgent}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div
        className="panel panel-pad"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap',
          borderColor: 'color-mix(in oklch, var(--warn) 28%, var(--line))',
          background: 'var(--surface)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="eyebrow">Veredicto</span>
          <span style={{ font: '600 26px/1 var(--sans)', color: conflict ? 'var(--warn)' : 'var(--ok)' }}>
            {conflict ? 'Jueces en conflicto' : 'Aprobado'}
          </span>
        </div>
        <Vr style={{ height: 48 }} />
        <p className="dim" style={{ fontSize: 13, lineHeight: 1.5, margin: 0, maxWidth: 460 }}>
          {conflict ? (
            <>
              A aprueba, B pide cambios. <b style={{ color: 'var(--tx)' }}>No hay resolución
              automática</b> — escala a ZEUS, la autoridad final.
            </>
          ) : (
            <>Sin objeciones bloqueantes.</>
          )}
        </p>
        <span style={{ flex: 1 }} />
        {review.escalateTo ? (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '10px 14px',
              borderRadius: 9,
              background: 'var(--surface-2)',
              border: '1px solid var(--line-hard)',
            }}
          >
            <Ag name={review.escalateTo} />
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="ag-name" style={{ fontSize: 13 }}>
                {review.escalateTo.toUpperCase()} decide
              </span>
              <span className="faint" style={{ fontSize: 11 }}>
                pre sdd-archive
              </span>
            </span>
          </span>
        ) : null}
      </div>
    </div>
  )
}
