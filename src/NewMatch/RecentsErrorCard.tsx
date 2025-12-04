import { useState, type FC } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export interface RecentsErrorCardProps {
  onRetry: () => Promise<void> | void
  retryCount: number
}

const RecentsErrorCard: FC<RecentsErrorCardProps> = ({ onRetry, retryCount }) => {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  const title =
    retryCount >= 3
      ? "Still couldn't load your recent players."
      : "We couldn't load your recent players."

  const subtitle =
    retryCount >= 3
      ? 'Check your connection or try again later.'
      : 'You can still search or start a Quick Match below.'

  return (
    <div className="mx-4 mt-2">
      <div
        role="alert"
        className="flex items-center gap-3 rounded-md border border-warning/30 bg-warning/10 px-3 py-1.5"
      >
        <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-warning" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">{title}</p>
          <p className="text-xs text-base-content/60 leading-tight mt-1">{subtitle}</p>
        </div>
        <button
          onClick={handleRetry}
          className={`btn btn-ghost btn-xs text-warning hover:bg-warning/20 ${isRetrying ? 'loading' : ''}`}
          disabled={isRetrying}
        >
          {isRetrying ? 'Retrying...' : 'Try again'}
        </button>
      </div>
    </div>
  )
}

export default RecentsErrorCard
