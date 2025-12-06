import type { FC } from 'react'

const SearchLoadingPlaceholder: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span
        className="loading loading-spinner loading-md text-base-content/40"
        aria-label="Loading search results"
      />
    </div>
  )
}

export default SearchLoadingPlaceholder
