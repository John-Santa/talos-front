/**
 * PR1 placeholder shell. It only proves the design system is wired and the app
 * mounts under the `.tw` scope. The real interactive shell (app-bar, Fiel/Consola/
 * Flow switcher, help, router) arrives in PR4.
 */
export default function App() {
  return (
    <div className="tw" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <span className="wm" style={{ justifyContent: 'center' }}>
          <span className="mark">T</span>
          <span className="name">TALOS</span>
          <span className="tag">Hybrid</span>
        </span>
        <p className="dim" style={{ marginTop: 16, fontSize: 14 }}>
          Consola web · scaffold listo
        </p>
      </div>
    </div>
  )
}
