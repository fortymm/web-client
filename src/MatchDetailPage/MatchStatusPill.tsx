import { type FC } from 'react'
import { type MatchStatus, getStatusDisplayText } from './mockMatchDetails'

export interface MatchStatusPillProps {
  status: MatchStatus
}

function getStatusClasses(status: MatchStatus): string {
  switch (status) {
    case 'pending':
      return 'badge-warning'
    case 'scheduled':
      return 'badge-info'
    case 'in_progress':
      return 'badge-primary'
    case 'completed':
      return 'badge-success'
    case 'cancelled':
      return 'badge-error'
    default:
      return 'badge-neutral'
  }
}

const MatchStatusPill: FC<MatchStatusPillProps> = ({ status }) => {
  const displayText = getStatusDisplayText(status)
  const statusClasses = getStatusClasses(status)

  return (
    <span
      className={`badge ${statusClasses}`}
      role="status"
      aria-label={`Match status: ${displayText}`}
      data-testid="match-status-pill"
    >
      {displayText}
    </span>
  )
}

export default MatchStatusPill
