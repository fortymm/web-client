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

  const message =
    retryCount >= 3
      ? 'Still having trouble. Check your connection.'
      : "We couldn't load your recent players."

  return (
    <div className="mx-4 mt-3">
      <div role="alert" className="alert alert-warning">
        <ExclamationTriangleIcon className="w-5 h-5" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleRetry}
          className={`btn btn-ghost btn-sm ${isRetrying ? 'loading' : ''}`}
          disabled={isRetrying}
        >
          {isRetrying ? 'Retrying...' : 'Try again'}
        </button>
      </div>
    </div>
  )
}

export default RecentsErrorCard
