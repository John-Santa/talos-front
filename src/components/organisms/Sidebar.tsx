import { useLocation } from 'react-router-dom'
import { Ag, Eyebrow, Wordmark } from '@/components/atoms'
import { NavItem } from '@/components/molecules'

export interface SidebarProps {
  worktreeCount: number
  agentCount: number
  className?: string
  /** Drawer open state (mobile) — reflected as data-open for styling/tests. */
  open?: boolean
  /** Fired when a nav link is followed (closes the mobile drawer). */
  onNavigate?: () => void
}

/** The Console left navigation + ZEUS authority footer. */
export function Sidebar({
  worktreeCount,
  agentCount,
  className,
  open,
  onNavigate,
}: SidebarProps) {
  const { pathname } = useLocation()
  const active = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  return (
    <aside
      className={className}
      data-open={open ? 'true' : 'false'}
      style={{
        borderRight: '1px solid var(--line)',
        background: 'var(--bg-2)',
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 16px',
        minHeight: 0,
      }}
    >
      <Wordmark tag="Hybrid" style={{ padding: '0 8px 22px' }} />
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <NavItem
          icon="orchestration"
          label="Orchestration"
          count={worktreeCount}
          to="/orchestration"
          active={active('/orchestration')}
          onClick={onNavigate}
        />
        <NavItem
          icon="agents"
          label="Agents"
          count={agentCount}
          to="/agents"
          active={active('/agents')}
          onClick={onNavigate}
        />
        <NavItem
          icon="judgment"
          label="Judgment Day"
          to="/judgment"
          active={active('/judgment')}
          onClick={onNavigate}
        />
      </nav>
      <div style={{ flex: 1 }} />
      <Eyebrow style={{ padding: '0 8px 10px' }}>Authority</Eyebrow>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '10px 8px',
          borderRadius: 8,
          background: 'var(--surface)',
        }}
      >
        <Ag name="zeus" />
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="ag-name" style={{ fontSize: 13 }}>
            ZEUS
          </span>
          <span className="faint" style={{ fontSize: 11 }}>
            TL · aprueba gates
          </span>
        </span>
      </div>
    </aside>
  )
}
