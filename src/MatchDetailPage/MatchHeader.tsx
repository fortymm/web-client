import { type FC } from 'react'
import { Link } from 'react-router-dom'
import MatchStatusPill from './MatchStatusPill'
import {
  type MatchStatus,
  type MatchDetails,
  type ContextEntity,
  getPrimaryActionLabel,
  getFormatDisplayText,
} from './mockMatchDetails'

export interface MatchHeaderProps {
  participants: MatchDetails['participants']
  status: MatchStatus
  format: MatchDetails['format']
  matchLength: MatchDetails['matchLength']
  context: ContextEntity[]
  matchId: string
}

function getTitle(
  participants: MatchDetails['participants']
): string {
  const [p1, p2] = participants

  // If either participant is a placeholder, show generic title
  if (p1.isPlaceholder || p2.isPlaceholder) {
    return 'Match details'
  }

  // Show "Player A vs Player B" when both are known
  return `${p1.name} vs ${p2.name}`
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
  const subtitle = getFormatDisplayText(format, matchLength)
  const actionLabel = getPrimaryActionLabel(status)
  const isActionDisabled = status === 'cancelled'

  return (
    <div className="space-y-4" data-testid="match-header">
      {/* Breadcrumbs */}
      {context.length > 0 && (
        <nav className="text-sm breadcrumbs" aria-label="Breadcrumb">
          <ul>
            {context.map((entity) => (
              <li key={entity.id}>
                <Link to={entity.url} className="link link-hover">
                  {entity.name}
                </Link>
              </li>
            ))}
            <li className="text-base-content/60">Match</li>
          </ul>
        </nav>
      )}

      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-base-content/60">{subtitle}</span>
            <MatchStatusPill status={status} />
          </div>
        </div>

        {/* Primary action button */}
        <Link
          to={isActionDisabled ? '#' : `/matches/${matchId}/score`}
          className={`btn btn-primary ${isActionDisabled ? 'btn-disabled' : ''}`}
          aria-disabled={isActionDisabled}
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  )
}

export default MatchHeader
