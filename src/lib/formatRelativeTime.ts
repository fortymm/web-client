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
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
