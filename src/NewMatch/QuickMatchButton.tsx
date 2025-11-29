import { type FC, useState } from 'react'
import { type MatchLength } from './MatchLengthControl'

interface QuickMatchButtonProps {
  matchLength: MatchLength
  onMatchCreated: (matchId: string) => void
  disabled?: boolean
}

const QuickMatchButton: FC<QuickMatchButtonProps> = ({
  matchLength,
  onMatchCreated,
  disabled = false,
}) => {
  const [isCreating, setIsCreating] = useState(false)

  const handleClick = async () => {
    if (isCreating || disabled) return

    setIsCreating(true)

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opponentId: null,
          matchLength,
          status: 'in_progress',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create match')
      }

      const match = await response.json()
      onMatchCreated(match.id)
    } catch (error) {
      console.error('Failed to create match:', error)
      setIsCreating(false)
    }
  }

  return (
    <button
      type="button"
      className="btn btn-primary btn-block h-auto py-3 flex-col gap-0 min-h-[56px]"
      onClick={handleClick}
      disabled={disabled || isCreating}
      aria-busy={isCreating}
    >
      {isCreating ? (
        <>
          <span className="loading loading-spinner loading-sm" />
          <span className="text-xs font-normal opacity-80">
            Creating match...
          </span>
        </>
      ) : (
        <>
          <span className="flex items-center gap-1.5 text-base font-semibold">
            <span>⚡</span> Quick Match
          </span>
          <span className="text-xs font-normal opacity-80">
            Start now · Choose player later
          </span>
        </>
      )}
    </button>
  )
}

export default QuickMatchButton
