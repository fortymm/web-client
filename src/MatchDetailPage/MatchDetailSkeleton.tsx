import { type FC } from 'react'

const MatchDetailSkeleton: FC = () => {
  return (
    <div className="space-y-6 animate-pulse" data-testid="match-detail-skeleton">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-base-300 rounded w-48" />
        <div className="flex items-center gap-2">
          <div className="h-5 bg-base-300 rounded w-32" />
          <div className="h-5 bg-base-300 rounded w-16" />
        </div>
      </div>

      {/* Participants skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        {/* Player 1 */}
        <div className="card bg-base-200 p-4 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-base-300" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-base-300 rounded w-32" />
              <div className="h-4 bg-base-300 rounded w-20" />
            </div>
          </div>
        </div>

        {/* VS */}
        <div className="flex items-center justify-center py-4 sm:py-0 sm:px-4">
          <div className="h-8 bg-base-300 rounded w-8" />
        </div>

        {/* Player 2 */}
        <div className="card bg-base-200 p-4 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-base-300" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-base-300 rounded w-32" />
              <div className="h-4 bg-base-300 rounded w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Metadata skeleton */}
      <div className="card bg-base-200 p-4 space-y-3">
        <div className="h-4 bg-base-300 rounded w-24" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-base-300 rounded w-20" />
            <div className="h-4 bg-base-300 rounded w-32" />
          </div>
        ))}
      </div>

      {/* Activity skeleton */}
      <div className="card bg-base-200 p-4 space-y-3">
        <div className="h-4 bg-base-300 rounded w-16" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-5 h-5 bg-base-300 rounded" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-base-300 rounded w-48" />
              <div className="h-3 bg-base-300 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MatchDetailSkeleton
