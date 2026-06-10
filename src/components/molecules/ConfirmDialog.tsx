import { useState, type ReactNode } from 'react'
import { Button } from '@/components/atoms'

export interface ConfirmDialogProps {
  title: string
  children: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  busy?: boolean
  /** When non-empty, renders a visible error message above the action buttons. */
  errorMessage?: string
  /**
   * When provided, the user must type this exact phrase before the confirm button
   * is enabled. Used for destructive or irreversible actions (e.g. merge). Renders
   * an input field with a hint showing the required phrase. Paridad TUI view.go:495.
   */
  confirmPhrase?: string
  onConfirm: () => void
  onCancel: () => void
}

/** Friendly confirmation modal — the safety net before a write action. */
export function ConfirmDialog({
  title,
  children,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger,
  busy,
  errorMessage,
  confirmPhrase,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState('')
  const phraseMatches = confirmPhrase === undefined || typed === confirmPhrase

  return (
    <div className="tw-modal" onClick={onCancel}>
      <div
        className="tw-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width: 'min(440px, 94vw)' }}
      >
        <div style={{ padding: '20px 22px' }}>
          <h2 style={{ font: '600 18px/1.3 var(--sans)', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            {title}
          </h2>
          <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--tx-dim)' }}>{children}</div>
        </div>
        {confirmPhrase ? (
          <div style={{ padding: '0 22px 16px' }}>
            <p style={{ fontSize: 12.5, color: 'var(--tx-dim)', margin: '0 0 6px' }}>
              Escribí <b style={{ color: 'var(--tx)', fontFamily: 'var(--mono)' }}>{confirmPhrase}</b> para
              confirmar
            </p>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={confirmPhrase}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '7px 10px',
                fontSize: 13,
                fontFamily: 'var(--mono)',
                background: 'var(--bg-alt, #1a1a1a)',
                color: 'var(--tx)',
                border: '1px solid var(--line)',
                borderRadius: 4,
                outline: 'none',
              }}
            />
          </div>
        ) : null}
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
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={busy || !phraseMatches}
          >
            {busy ? '…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
