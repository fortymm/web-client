import { type FC } from 'react'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { type ActivityItem } from './mockMatchDetails'

export interface ActivityTimelineProps {
  activity: ActivityItem[]
  notes: Array<{
    id: string
    text: string
    author: string
    timestamp: string
  }>
}

// Icon components for different activity types
const PlusIcon: FC<{ className?: string }> = ({ className = 'h-3 w-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const CalendarIcon: FC<{ className?: string }> = ({ className = 'h-3 w-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
)

const TableIcon: FC<{ className?: string }> = ({ className = 'h-3 w-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
  </svg>
)

const PlayIcon: FC<{ className?: string }> = ({ className = 'h-3 w-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
)

const CheckIcon: FC<{ className?: string }> = ({ className = 'h-3 w-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)

const XIcon: FC<{ className?: string }> = ({ className = 'h-3 w-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const NoteIcon: FC<{ className?: string }> = ({ className = 'h-3 w-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
)

interface IconConfig {
  Icon: FC<{ className?: string }>
  bgColor: string
  iconColor: string
}

function getActivityIconConfig(type: ActivityItem['type']): IconConfig {
  switch (type) {
    case 'created':
      return { Icon: PlusIcon, bgColor: 'bg-base-300', iconColor: 'text-base-content/60' }
    case 'scheduled':
      return { Icon: CalendarIcon, bgColor: 'bg-info/20', iconColor: 'text-info' }
    case 'table_assigned':
      return { Icon: TableIcon, bgColor: 'bg-base-300', iconColor: 'text-base-content/60' }
    case 'started':
      return { Icon: PlayIcon, bgColor: 'bg-primary/20', iconColor: 'text-primary' }
    case 'completed':
      return { Icon: CheckIcon, bgColor: 'bg-success/20', iconColor: 'text-success' }
    case 'cancelled':
      return { Icon: XIcon, bgColor: 'bg-error/20', iconColor: 'text-error' }
    case 'note':
      return { Icon: NoteIcon, bgColor: 'bg-warning/20', iconColor: 'text-warning' }
    default:
      return { Icon: PlusIcon, bgColor: 'bg-base-300', iconColor: 'text-base-content/60' }
  }
}

function formatActivityTime(isoString: string): string {
  const date = parseISO(isoString)
  const now = new Date()
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)

  // Within the last 7 days, always use relative time with "ago" suffix
  if (diffInDays < 7) {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  // Older than a week, show date
  return format(date, 'MMM d, h:mm a')
}

const ActivityTimeline: FC<ActivityTimelineProps> = ({ activity, notes }) => {
  // Combine activity and notes, sorted by timestamp descending (most recent first)
  const allItems = [
    ...activity.map((item) => ({ ...item, itemType: 'activity' as const })),
    ...notes.map((note) => ({
      id: note.id,
      timestamp: note.timestamp,
      type: 'note' as const,
      description: note.text,
      actor: note.author,
      itemType: 'note' as const,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  if (allItems.length === 0) {
    return null
  }

  return (
    <div className="card bg-base-200 rounded-2xl p-4" data-testid="activity-timeline">
      <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-3">
        Activity
      </h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-4 bottom-4 w-px bg-base-300" aria-hidden="true" />

        <div className="space-y-0">
          {allItems.map((item, index) => {
            const { Icon, bgColor, iconColor } = getActivityIconConfig(item.type)
            const isLast = index === allItems.length - 1

            return (
              <div
                key={item.id}
                className={`relative flex gap-3 ${isLast ? '' : 'pb-4'}`}
                data-testid="activity-item"
              >
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full ${bgColor} flex items-center justify-center`}
                  aria-hidden="true"
                >
                  <Icon className={`h-3 w-3 ${iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm leading-tight">{item.description}</p>
                  <p className="text-xs text-base-content/40 mt-0.5">
                    {formatActivityTime(item.timestamp)}
                    {item.actor && (
                      <span> · {item.actor}</span>
                    )}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ActivityTimeline
