import { type FC } from 'react'
import { BoltIcon } from '@heroicons/react/24/solid'

interface QuickMatchButtonProps {
  onClick: () => void
  disabled?: boolean
}

const QuickMatchButton: FC<QuickMatchButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const handleClick = () => {
    if (disabled) return

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }

    onClick()
  }

  return (
    <button
      type="button"
      className="btn btn-primary btn-block h-14 flex-col gap-0"
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="flex items-center gap-1.5 text-base font-semibold h-6">
        <BoltIcon className="h-5 w-5" />
        <span>Quick Match</span>
      </span>
      <span className="text-xs font-normal opacity-80">
        Start now · Add players and scores later
      </span>
    </button>
  )
}

export default QuickMatchButton
