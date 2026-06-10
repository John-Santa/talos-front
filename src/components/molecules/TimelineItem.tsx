import type { ActivityEntry } from '@/domain/types'

/** One entry on the activity timeline (dot + connector + body + relative time). */
export function TimelineItem({ entry, last }: { entry: ActivityEntry; last?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 14, paddingBottom: last ? 0 : 18, position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: 'var(--accent)',
            flex: '0 0 auto',
            marginTop: 4,
          }}
        />
        {!last ? <span style={{ width: 1, flex: 1, background: 'var(--line)', marginTop: 4 }} /> : null}
      </div>
      <div style={{ paddingBottom: 2, flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5 }}>{entry.text}</div>
        <div className="mono faint" style={{ fontSize: 11, marginTop: 3 }}>
          {entry.at}
        </div>
      </div>
    </div>
  )
}
