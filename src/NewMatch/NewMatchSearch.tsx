import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

function NewMatchSearch() {
  return (
    <div className="sticky top-16 z-40 bg-base-100 px-4 py-2">
      <div className="input input-bordered flex items-center gap-2 w-full">
        <MagnifyingGlassIcon className="w-5 h-5 text-base-content/40" />
        <span className="text-base-content/40 flex-1">Search players…</span>
      </div>
    </div>
  )
}

export default NewMatchSearch
