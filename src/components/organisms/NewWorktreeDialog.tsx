import { useState, type CSSProperties } from 'react'
import { Button } from '@/components/atoms'
import { FIGURAS, type Figura } from '@/domain/agents'
import type { NewWorktreeInput } from '@/domain/types'

export interface NewWorktreeDialogProps {
  /** Figuras offered first (idle ones); falls back to the full roster. */
  idleAgents?: Figura[]
  busy?: boolean
  /** When non-empty, renders a visible error message above the action buttons. */
  errorMessage?: string
  onCreate: (input: NewWorktreeInput) => void
  onCancel: () => void
}

const field: CSSProperties = {
  width: '100%',
  height: 38,
  padding: '0 12px',
  background: 'var(--surface-2)',
  border: '1px solid var(--line-hard)',
  borderRadius: 8,
  color: 'var(--tx)',
  fontFamily: 'var(--sans)',
  fontSize: 14,
}
const label: CSSProperties = {
  display: 'block',
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--tx-faint)',
  marginBottom: 7,
}

/** Friendly form to spin up an agent worktree (replaces the `n` keyboard command). */
export function NewWorktreeDialog({ idleAgents, busy, errorMessage, onCreate, onCancel }: NewWorktreeDialogProps) {
  const options = idleAgents && idleAgents.length > 0 ? idleAgents : [...FIGURAS]
  const [figura, setFigura] = useState<Figura>(options[0] ?? 'iris')
  const [key, setKey] = useState('')
  const trimmed = key.trim().toUpperCase()
  const valid = /^TAL-\d+$/.test(trimmed)

  return (
    <div className="tw-modal" onClick={onCancel}>
      <div
        className="tw-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Nuevo worktree"
        style={{ width: 'min(460px, 94vw)' }}
      >
        <div style={{ padding: '20px 22px' }}>
          <h2 style={{ font: '600 18px/1.3 var(--sans)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Nuevo worktree
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--tx-dim)', margin: '0 0 18px' }}>
            Creá un worktree aislado para una figura. Rama:{' '}
            <span className="mono" style={{ color: 'var(--accent)' }}>
              agent/{figura}/{trimmed || 'TAL-…'}
            </span>
          </p>

          <div style={{ marginBottom: 14 }}>
            <label htmlFor="nw-figura" style={label}>
              Figura
            </label>
            <select
              id="nw-figura"
              style={field}
              value={figura}
              onChange={(e) => setFigura(e.target.value as Figura)}
            >
              {options.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nw-key" style={label}>
              Jira key
            </label>
            <input
              id="nw-key"
              style={field}
              value={key}
              placeholder="TAL-23"
              autoFocus
              onChange={(e) => setKey(e.target.value)}
            />
            {key && !valid ? (
              <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 6, display: 'block' }}>
                Formato esperado: TAL-&lt;número&gt;
              </span>
            ) : null}
          </div>
        </div>

        {errorMessage ? (
          <p
            role="alert"
            style={{ margin: '0 22px 0', fontSize: 13, color: 'var(--danger)', lineHeight: 1.4 }}
          >
            {errorMessage}
          </p>
        ) : null}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '14px 22px',
            borderTop: '1px solid var(--line)',
          }}
        >
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!valid || busy}
            onClick={() => onCreate({ figura, jiraKey: trimmed })}
          >
            {busy ? 'Creando…' : 'Crear worktree'}
          </Button>
        </div>
      </div>
    </div>
  )
}
