import { Kbd, Wordmark } from '@/components/atoms'
import { VIEW_MODES, type ViewMode } from '@/app/viewModes'

export interface HelpPanelProps {
  view: ViewMode
  onPick: (v: ViewMode) => void
  onClose: () => void
}

/** Plain-language welcome modal that also lets the user pick a view. */
export function HelpPanel({ view, onPick, onClose }: HelpPanelProps) {
  return (
    <div className="tw-modal" onClick={onClose}>
      <div
        className="tw-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Bienvenida"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 22px',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <Wordmark tag="Hybrid" />
          <button
            type="button"
            onClick={onClose}
            title="Cerrar (Esc)"
            aria-label="Cerrar"
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--tx-faint)',
              fontSize: 22,
              lineHeight: 1,
              cursor: 'pointer',
              width: 30,
              height: 30,
              borderRadius: 8,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 22 }}>
          <h2 style={{ font: '600 19px/1.3 var(--sans)', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
            Bienvenido a la consola
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--tx-dim)', margin: '0 0 20px' }}>
            TALOS coordina un equipo de agentes que programan en paralelo, cada uno aislado en su
            worktree. Esta consola te muestra, de un vistazo, <b style={{ color: 'var(--tx)' }}>qué hace
            cada figura</b> y si es <b style={{ color: 'var(--tx)' }}>seguro mergear</b> a develop.
          </p>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Elegí cómo verlo
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {VIEW_MODES.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`help-row${v.id === view ? ' on' : ''}`}
                onClick={() => onPick(v.id)}
              >
                <span className="num">{v.key}</span>
                <span>
                  <span style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 3 }}>
                    {v.label}
                  </span>
                  <span style={{ fontSize: 12.5, color: 'var(--tx-dim)', lineHeight: 1.45 }}>
                    {v.blurb}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span className="hint">
            <Kbd>1</Kbd>
            <Kbd>2</Kbd>
            <Kbd>3</Kbd>
            <b style={{ marginLeft: 2 }}>cambiar vista</b>
          </span>
          <span className="hint">
            <Kbd>?</Kbd>
            <b>esta ayuda</b>
          </span>
        </div>
      </div>
    </div>
  )
}
