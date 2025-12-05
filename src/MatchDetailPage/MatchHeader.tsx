import { type FC } from 'react'
import { Link } from 'react-router-dom'
import {
  type MatchStatus,
  type MatchDetails,
  type ContextEntity,
  getPrimaryActionLabel,
  getStatusDisplayText,
} from './mockMatchDetails'

export interface MatchHeaderProps {
  participants: MatchDetails['participants']
  status: MatchStatus
  format: MatchDetails['format']
  matchLength: MatchDetails['matchLength']
  context: ContextEntity[]
  matchId: string
}

function getTitle(participants: MatchDetails['participants']): string {
  const [p1, p2] = participants
  const name1 = p1.isPlaceholder ? 'Opponent TBD' : p1.name
  const name2 = p2.isPlaceholder ? 'Opponent TBD' : p2.name
  return `${name1} vs ${name2}`
}

function getSubtitle(
  matchLength: MatchDetails['matchLength'],
  format: MatchDetails['format']
): string {
  // Simplified subtitle - no context name to avoid duplication with breadcrumb/Related card
  return `Best of ${matchLength} · ${format === 'singles' ? 'Singles' : 'Doubles'}`
}

function getStatusClasses(status: MatchStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-warning text-warning-content'
    case 'scheduled':
      return 'bg-info text-info-content'
    case 'in_progress':
      return 'bg-primary text-primary-content'
    case 'completed':
      return 'bg-success text-success-content'
    case 'cancelled':
      return 'bg-error text-error-content'
    default:
      return 'bg-base-300 text-base-content'
  }
}

function canStartScoring(
  status: MatchStatus,
  participants: MatchDetails['participants']
): { canStart: boolean; reason: string | null } {
  if (status === 'completed') {
    return { canStart: true, reason: null }
  }
  if (status === 'cancelled') {
    return { canStart: false, reason: 'This match was cancelled' }
  }
  if (status === 'in_progress') {
    return { canStart: true, reason: null }
  }

  // For pending/scheduled, check if opponent is assigned
  const hasPlaceholder = participants.some((p) => p.isPlaceholder)
  if (hasPlaceholder) {
    return { canStart: false, reason: 'Assign an opponent to start scoring' }
  }

  return { canStart: true, reason: null }
}

const MatchHeader: FC<MatchHeaderProps> = ({
  participants,
  status,
  format,
  matchLength,
  context,
  matchId,
}) => {
  const title = getTitle(participants)
  const subtitle = getSubtitle(matchLength, format)
  const actionLabel = getPrimaryActionLabel(status)
  const { canStart, reason } = canStartScoring(status, participants)

  // Get back link from primary context
  const backContext = context[0]

  return (
    <div className="space-y-2" data-testid="match-header">
      {/* Back link - simplified to just "Back" */}
      {backContext && (
        <Link
          to={backContext.url}
          className="inline-flex items-center gap-1 text-sm text-base-content/60 hover:text-base-content transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </Link>
      )}

      {/* Title and subtitle */}
      <div>
        <h1 className="text-2xl font-bold leading-tight">{title}</h1>
        <p className="text-sm text-base-content/50 mt-0.5">{subtitle}</p>
      </div>

      {/* Chip row - more space above, less below */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="badge badge-outline text-xs">
          Best of {matchLength}
        </span>
        <span className="badge badge-outline text-xs">
          {format === 'singles' ? 'Singles' : 'Doubles'}
        </span>
        <span
          className={`badge text-xs ${getStatusClasses(status)}`}
          role="status"
          aria-label={`Match status: ${getStatusDisplayText(status)}`}
          data-testid="match-status-pill"
        >
          {getStatusDisplayText(status)}
        </span>
      </div>

      {/* Primary action - tighter connection to chips */}
      <div className="pt-1">
        <Link
          to={canStart ? `/matches/${matchId}/score` : '#'}
          className={`btn btn-primary rounded-xl ${!canStart ? 'btn-disabled opacity-60 border border-base-300' : ''}`}
          aria-disabled={!canStart}
          onClick={(e) => !canStart && e.preventDefault()}
        >
          {actionLabel}
        </Link>
        {reason && (
          <p className="text-xs text-base-content/50 mt-1">{reason}</p>
        )}
      </div>
    </div>
  )
}

export default MatchHeader
