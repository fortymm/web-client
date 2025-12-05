import { type FC } from 'react'
import { type MatchDetails, type MatchStatus, type Participant } from './mockMatchDetails'

export interface ParticipantsSectionProps {
  participants: MatchDetails['participants']
  finalScore: MatchDetails['finalScore']
  status: MatchStatus
  onAssignOpponent?: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface ParticipantRowProps {
  participant: Participant
  isWinner: boolean
  showWinnerBadge: boolean
  onAssign?: () => void
}

const ParticipantRow: FC<ParticipantRowProps> = ({
  participant,
  isWinner,
  showWinnerBadge,
  onAssign,
}) => {
  const { name, avatarUrl, rating, ratingChange, isYou, isPlaceholder } = participant

  // Placeholder state - actionable slot or static placeholder
  if (isPlaceholder) {
    const placeholderContent = (
      <>
        {/* Placeholder avatar */}
        <div className="avatar placeholder">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg text-primary/60">?</span>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${onAssign ? 'text-primary' : 'text-base-content/50'}`}>
            {onAssign ? 'Assign opponent' : 'Opponent TBD'}
          </p>
          <p className="text-xs text-base-content/50">No opponent assigned yet</p>
        </div>

        {/* Chevron - only show when actionable */}
        {onAssign && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-base-content/30 group-hover:text-base-content/50 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </>
    )

    if (onAssign) {
      return (
        <button
          type="button"
          onClick={onAssign}
          className="flex items-center gap-3 w-full p-3 -m-3 rounded-xl hover:bg-base-300/50 transition-colors text-left group"
          data-testid="assign-opponent-button"
        >
          {placeholderContent}
        </button>
      )
    }

    return (
      <div
        className="flex items-center gap-3"
        data-testid="participant-row"
      >
        {placeholderContent}
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-3 ${isWinner && showWinnerBadge ? 'relative' : ''}`}
      data-testid="participant-row"
    >
      {/* Avatar */}
      <div className="avatar placeholder">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center ${
            isWinner && showWinnerBadge
              ? 'bg-success text-success-content ring-2 ring-success ring-offset-2 ring-offset-base-200'
              : 'bg-primary text-primary-content'
          }`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name}'s avatar`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold">{getInitials(name)}</span>
          )}
        </div>
      </div>

      {/* Name and info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate">{name}</span>
          {isYou && (
            <span className="badge badge-xs badge-primary">(you)</span>
          )}
          {isWinner && showWinnerBadge && (
            <span className="badge badge-xs badge-success">Winner</span>
          )}
        </div>

        {/* Rating */}
        {rating !== null && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-base-content/50">{rating.toLocaleString()} rating</span>
            {ratingChange !== null && (
              <span
                className={`text-xs font-medium ${
                  ratingChange > 0
                    ? 'text-success'
                    : ratingChange < 0
                    ? 'text-error'
                    : 'text-base-content/40'
                }`}
              >
                {ratingChange > 0 ? '+' : ''}
                {ratingChange}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const ParticipantsSection: FC<ParticipantsSectionProps> = ({
  participants,
  finalScore,
  status,
  onAssignOpponent,
}) => {
  const isCompleted = status === 'completed'
  const [participant1, participant2] = participants

  return (
    <section aria-label="Match participants" data-testid="participants-section">
      {/* Section header */}
      <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-3">
        Players
      </h2>

      {/* Unified card */}
      <div className="card bg-base-200 rounded-2xl">
        <div className="p-4">
          {/* Player 1 */}
          <ParticipantRow
            participant={participant1}
            isWinner={participant1.isWinner === true}
            showWinnerBadge={isCompleted}
            onAssign={participant1.isPlaceholder ? onAssignOpponent : undefined}
          />

          {/* VS divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-base-300" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-base-content/40 uppercase">vs</span>
              {isCompleted && finalScore && (
                <span className="badge badge-sm badge-neutral">
                  {finalScore[0]}–{finalScore[1]}
                </span>
              )}
            </div>
            <div className="flex-1 h-px bg-base-300" />
          </div>

          {/* Player 2 */}
          <ParticipantRow
            participant={participant2}
            isWinner={participant2.isWinner === true}
            showWinnerBadge={isCompleted}
            onAssign={participant2.isPlaceholder ? onAssignOpponent : undefined}
          />
        </div>
      </div>
    </section>
  )
}

export default ParticipantsSection
