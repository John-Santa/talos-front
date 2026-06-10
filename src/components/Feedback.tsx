import { Pill } from '@/components/atoms'

/** Centered loading indicator that fills its flex parent. */
export function Loading({ label = 'cargando…' }: { label?: string }) {
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', minHeight: 0 }}>
      <span className="faint mono" style={{ fontSize: 13 }}>
        {label}
      </span>
    </div>
  )
}

/** Centered error panel. */
export function ErrorState({ message }: { message?: string }) {
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 24, minHeight: 0 }}>
      <div className="panel panel-pad" style={{ textAlign: 'center', maxWidth: 420 }}>
        <Pill kind="danger">error</Pill>
        <p className="dim" style={{ fontSize: 13, marginTop: 12 }}>
          {message ?? 'No se pudo cargar.'}
        </p>
      </div>
    </div>
  )
}
