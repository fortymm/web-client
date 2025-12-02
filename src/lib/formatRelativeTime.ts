import { formatDistanceToNowStrict, differenceInDays, format } from 'date-fns'

/**
 * Formats a date string as relative time.
 *
 * @param dateString - ISO date string
 * @returns Formatted relative time string
 *
 * Examples:
 * - Less than 1 minute: "just now"
 * - 1-59 minutes: "5m ago"
 * - 1-23 hours: "2h ago"
 * - 1-6 days: "3d ago"
 * - 7+ days: "Mar 15"
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const daysDiff = differenceInDays(now, date)

  if (daysDiff >= 7) {
    return format(date, 'MMM d')
  }

  const distance = formatDistanceToNowStrict(date, { addSuffix: true })

  // Handle "just now" for less than 1 minute
  if (distance.includes('second')) {
    return 'just now'
  }

  // Convert "X minutes ago" to "Xm ago", "X hours ago" to "Xh ago", etc.
  return distance
    .replace(' minutes ago', 'm ago')
    .replace(' minute ago', 'm ago')
    .replace(' hours ago', 'h ago')
    .replace(' hour ago', 'h ago')
    .replace(' days ago', 'd ago')
    .replace(' day ago', 'd ago')
}
