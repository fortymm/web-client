import { PlusIcon } from '@heroicons/react/24/solid'

type NewMatchButtonProps = {
  onClick?: () => void
}

export function NewMatchButton({ onClick }: NewMatchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-primary btn-block"
    >
      <PlusIcon className="h-5 w-5" />
      <span>New match</span>
    </button>
  )
}
