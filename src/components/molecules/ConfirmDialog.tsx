import type { ReactNode } from 'react'
import { Button } from '@/components/atoms'

export interface ConfirmDialogProps {
  title: string
  children: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  busy?: boolean
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
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
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
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={busy}>
            {busy ? '…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
