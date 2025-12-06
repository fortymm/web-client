import type { FC } from 'react'
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

const SearchTodoCard: FC = () => {
  return (
    <div className="mx-4 mt-2">
      <div
        role="status"
        className="flex items-center gap-3 rounded-md border border-info/30 bg-info/10 px-3 py-3"
      >
        <WrenchScrewdriverIcon className="w-5 h-5 shrink-0 text-info" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">Search results coming soon</p>
          <p className="text-xs text-base-content/60 leading-tight mt-1">
            We're working on displaying player search results here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SearchTodoCard
