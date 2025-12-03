import type { FC } from 'react'

interface SkeletonRowsProps {
  count?: number
}

const SkeletonRows: FC<SkeletonRowsProps> = ({ count = 6 }) => {
  return (
    <div
      className="flex flex-col"
      role="status"
      aria-label="Loading recent players"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          {/* Avatar skeleton */}
          <div className="skeleton w-10 h-10 rounded-full shrink-0" />

          {/* Text skeleton */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonRows
