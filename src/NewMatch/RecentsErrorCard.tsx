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
      : "Couldn't load players"

  return (
    <div className="flex flex-col items-center justify-center px-8 py-12 text-center">
      <ExclamationTriangleIcon className="w-12 h-12 text-warning mb-4" />
      <h3 className="text-lg font-semibold text-base-content mb-1">{message}</h3>
      <p className="text-sm text-base-content/60 mb-4">
        You can still start a Quick Match below
      </p>
      <button
        onClick={handleRetry}
        className={`btn btn-outline btn-sm ${isRetrying ? 'loading' : ''}`}
        disabled={isRetrying}
      >
        {isRetrying ? 'Retrying...' : 'Try again'}
      </button>
    </div>
  )
}

export default RecentsErrorCard
