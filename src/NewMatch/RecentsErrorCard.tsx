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
      : 'You can still search for players or start a Quick Match.'

  return (
    <div className="mx-4 mt-2">
      <div role="alert" className="alert alert-warning py-2 px-3">
        <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">{title}</p>
          <p className="text-xs opacity-80 leading-tight">{subtitle}</p>
        </div>
        <button
          onClick={handleRetry}
          className={`btn btn-outline btn-warning btn-xs ${isRetrying ? 'loading' : ''}`}
          disabled={isRetrying}
        >
          {isRetrying ? 'Retrying...' : 'Try again'}
        </button>
      </div>
    </div>
  )
}

export default RecentsErrorCard
