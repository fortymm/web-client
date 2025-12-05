import { type FC } from 'react'
import { type Participant } from './mockMatchDetails'

export interface ParticipantCardProps {
  participant: Participant
  isWinnerHighlighted: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const ParticipantCard: FC<ParticipantCardProps> = ({
  participant,
  isWinnerHighlighted,
}) => {
  const { name, avatarUrl, rating, ratingChange, isYou, isPlaceholder, isWinner } = participant

  const cardClasses = [
    'card',
    'bg-base-200',
    'p-4',
    'flex-1',
    'min-w-0',
    isWinnerHighlighted && isWinner ? 'ring-2 ring-success ring-offset-2 ring-offset-base-100' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClasses} data-testid="participant-card">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="avatar placeholder">
          <div
            className={`w-12 h-12 rounded-full ${
              isPlaceholder ? 'bg-base-300' : 'bg-primary text-primary-content'
            } flex items-center justify-center`}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${name}'s avatar`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold">
                {isPlaceholder ? '?' : getInitials(name)}
              </span>
            )}
          </div>
        </div>

        {/* Name and info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-semibold truncate ${
                isPlaceholder ? 'text-base-content/60 italic' : ''
              }`}
            >
              {name}
            </span>
            {isYou && (
              <span className="badge badge-sm badge-primary">(you)</span>
            )}
            {isWinnerHighlighted && isWinner && (
              <span className="badge badge-sm badge-success">Winner</span>
            )}
          </div>

          {/* Rating */}
          {rating !== null && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-base-content/70">
                Rating: {rating}
              </span>
              {ratingChange !== null && (
                <span
                  className={`text-sm font-medium ${
                    ratingChange > 0
                      ? 'text-success'
                      : ratingChange < 0
                      ? 'text-error'
                      : 'text-base-content/50'
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
    </div>
  )
}

export default ParticipantCard
