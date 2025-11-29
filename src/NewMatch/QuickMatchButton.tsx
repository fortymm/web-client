import { type FC } from 'react'
import { BoltIcon } from '@heroicons/react/24/solid'
import { type MatchLength } from './MatchLengthControl'
import { useCreateMatch } from './useCreateMatch'

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
      className="btn btn-primary btn-block h-[56px] py-3 flex-col gap-0"
      onClick={handleClick}
      disabled={disabled || isCreating}
      aria-busy={isCreating}
    >
      <span className="flex items-center gap-1.5 text-base font-semibold h-6">
        {isCreating ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <BoltIcon className="h-5 w-5" />
        )}
        <span>Quick Match</span>
      </span>
      <span className="text-xs font-normal opacity-80">
        {isCreating ? 'Creating match...' : 'Start now · Choose player later'}
      </span>
    </button>
  )
}

export default QuickMatchButton
