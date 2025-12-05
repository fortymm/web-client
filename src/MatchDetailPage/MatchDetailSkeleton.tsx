import { type FC } from 'react'

const MatchDetailSkeleton: FC = () => {
  return (
    <div className="space-y-6 animate-pulse" data-testid="match-detail-skeleton">
      {/* Header skeleton */}
      <div className="space-y-3">
        {/* Back link */}
        <div className="h-4 bg-base-300 rounded w-28" />
        {/* Title */}
        <div className="h-7 bg-base-300 rounded w-64" />
        {/* Subtitle */}
        <div className="h-4 bg-base-300 rounded w-48" />
        {/* Chips */}
        <div className="flex gap-2 pt-1">
          <div className="h-5 bg-base-300 rounded-full w-20" />
          <div className="h-5 bg-base-300 rounded-full w-16" />
          <div className="h-5 bg-base-300 rounded-full w-20" />
        </div>
        {/* Button */}
        <div className="h-10 bg-base-300 rounded-xl w-32 mt-3" />
      </div>

      {/* Participants skeleton - unified card */}
      <div className="card bg-base-200 rounded-2xl p-4">
        <div className="h-3 bg-base-300 rounded w-16 mb-3" />
        <div className="space-y-3">
          {/* Player 1 */}
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-full bg-base-300" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-base-300 rounded w-28" />
              <div className="h-3 bg-base-300 rounded w-16" />
            </div>
            <div className="h-8 bg-base-300 rounded w-8" />
          </div>
          {/* Player 2 */}
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-full bg-base-300" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-base-300 rounded w-24" />
              <div className="h-3 bg-base-300 rounded w-16" />
            </div>
            <div className="h-8 bg-base-300 rounded w-8" />
          </div>
        </div>
      </div>

      {/* Two-column grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Metadata skeleton */}
        <div className="card bg-base-200 rounded-2xl p-4">
          <div className="h-3 bg-base-300 rounded w-24 mb-3" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-base-300 rounded" />
                  <div className="h-4 bg-base-300 rounded w-16" />
                </div>
                <div className="h-4 bg-base-300 rounded w-28" />
              </div>
            ))}
          </div>
        </div>

        {/* Context links skeleton */}
        <div className="card bg-base-200 rounded-2xl p-4">
          <div className="h-3 bg-base-300 rounded w-16 mb-3" />
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 bg-base-300 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-base-300 rounded w-32" />
                  <div className="h-3 bg-base-300 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity skeleton */}
      <div className="card bg-base-200 rounded-2xl p-4">
        <div className="h-3 bg-base-300 rounded w-16 mb-3" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-6 h-6 bg-base-300 rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-base-300 rounded w-48" />
                <div className="h-3 bg-base-300 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MatchDetailSkeleton
