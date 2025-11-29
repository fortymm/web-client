import { type FC } from 'react'
import { type MatchLength } from './MatchLengthControl'
import { useCreateMatch } from '../hooks/useCreateMatch'

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
  const createMatch = useCreateMatch()
  const isCreating = createMatch.isPending

  const handleClick = () => {
    if (isCreating || disabled) return

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }

    createMatch.mutate(
      {
        opponentId: null,
        matchLength,
        status: 'in_progress',
      },
      {
        onSuccess: (data) => {
          onMatchCreated(data.id)
        },
        onError: (error) => {
          console.error('Failed to create match:', error)
        },
      }
    )
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
