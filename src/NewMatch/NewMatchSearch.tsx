import { useRef, type FC } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface NewMatchSearchProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

const NewMatchSearch: FC<NewMatchSearchProps> = ({ value, onChange, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    onClear()
    inputRef.current?.focus()
  }

  return (
    <div className="sticky top-14 z-40 bg-base-100 px-4 py-2">
      <div className="input input-bordered flex items-center gap-2 w-full h-12">
        <MagnifyingGlassIcon className="w-5 h-5 text-base-content/40 shrink-0" />
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Search players…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="grow bg-transparent outline-none text-base"
          aria-label="Search players"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-ghost btn-xs btn-circle shrink-0"
            aria-label="Clear search"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default NewMatchSearch
