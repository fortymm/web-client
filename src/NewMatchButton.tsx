import { PlusIcon } from '@heroicons/react/24/solid'

type NewMatchButtonProps = {
  onClick?: () => void
}

export function NewMatchButton({ onClick }: NewMatchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-primary btn-block h-14 flex-col gap-0"
    >
      <span className="flex items-center gap-1.5 text-base font-semibold h-6">
        <PlusIcon className="h-5 w-5" />
        <span>New match</span>
      </span>
      <span className="text-xs font-normal opacity-80">
        Log a result or start a Quick Match
      </span>
    </button>
  )
}
