import type { FC } from 'react'

const SearchLoadingPlaceholder: FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-center"
      role="status"
      aria-label="Searching for players"
    >
      <span className="loading loading-spinner loading-md text-base-content/40" />
    </div>
  )
}

export default SearchLoadingPlaceholder
