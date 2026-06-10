import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppBar, Coachmark, HelpPanel } from '@/components/organisms'
import { useStored } from '@/hooks/useStored'
import { useKeyboard } from './useKeyboard'
import { useViewMode } from './ViewMode'
import type { ViewMode } from './viewModes'

const COACH_DISMISS_MS = 7000

/** App frame: fixed app-bar + routed content + coachmark + help modal. */
export function Layout() {
  const { view, setView } = useViewMode()
  const [seenCoach, setSeenCoach] = useStored('talos.coach', '0')
  const [help, setHelp] = useState(false)
  const navigate = useNavigate()

  const choose = (v: ViewMode) => {
    setView(v)
    setSeenCoach('1')
    navigate('/orchestration')
  }

  useKeyboard({
    '1': () => choose('faithful'),
    '2': () => choose('console'),
    '3': () => choose('flow'),
    '?': () => setHelp((h) => !h),
    Escape: () => setHelp(false),
  })

  useEffect(() => {
    if (seenCoach === '1') return
    const t = setTimeout(() => setSeenCoach('1'), COACH_DISMISS_MS)
    return () => clearTimeout(t)
  }, [seenCoach, setSeenCoach])

  return (
    <div className="tw" style={{ minHeight: '100vh' }}>
      <AppBar view={view} onPick={choose} onHelp={() => setHelp(true)} />
      <main
        style={{
          height: '100vh',
          paddingTop: 46,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </main>
      {seenCoach !== '1' && !help ? <Coachmark /> : null}
      {help ? <HelpPanel view={view} onPick={choose} onClose={() => setHelp(false)} /> : null}
    </div>
  )
}
