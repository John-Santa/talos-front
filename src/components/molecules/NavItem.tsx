import { Link } from 'react-router-dom'
import { Icon, type IconKind } from '@/components/atoms'

export interface NavItemProps {
  icon: IconKind
  label: string
  count?: string | number
  active?: boolean
  /** When set, the item navigates; otherwise it renders inert (placeholder section). */
  to?: string
}

/** Sidebar navigation entry. */
export function NavItem({ icon, label, count, active, to }: NavItemProps) {
  const body = (
    <>
      <Icon k={icon} className="ic" />
      <span>{label}</span>
      {count != null ? <span className="ct">{count}</span> : null}
    </>
  )
  const className = `nav-item${active ? ' active' : ''}`
  if (to) {
    return (
      <Link to={to} className={className} aria-current={active ? 'page' : undefined}>
        {body}
      </Link>
    )
  }
  return (
    <div className={className} aria-disabled="true">
      {body}
    </div>
  )
}
