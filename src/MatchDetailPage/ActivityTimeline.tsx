import { type FC } from 'react'
import { format, parseISO } from 'date-fns'
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

function getActivityIcon(type: ActivityItem['type']): string {
  switch (type) {
    case 'created':
      return '➕'
    case 'scheduled':
      return '📅'
    case 'table_assigned':
      return '🎯'
    case 'started':
      return '▶️'
    case 'completed':
      return '✅'
    case 'cancelled':
      return '❌'
    case 'note':
      return '📝'
    default:
      return '•'
  }
}

function formatActivityTime(isoString: string): string {
  const date = parseISO(isoString)
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
    <div className="card bg-base-200 p-4" data-testid="activity-timeline">
      <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wide mb-3">
        Activity
      </h3>
      <div className="space-y-3">
        {allItems.map((item, index) => (
          <div
            key={item.id}
            className="flex gap-3"
            data-testid="activity-item"
          >
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <span className="text-sm" role="img" aria-hidden="true">
                {getActivityIcon(item.type)}
              </span>
              {index < allItems.length - 1 && (
                <div className="w-px flex-1 bg-base-300 mt-1" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-3">
              <p className="text-sm">{item.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-base-content/50">
                  {formatActivityTime(item.timestamp)}
                </span>
                {item.actor && (
                  <>
                    <span className="text-xs text-base-content/30">•</span>
                    <span className="text-xs text-base-content/50">
                      {item.actor}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityTimeline
