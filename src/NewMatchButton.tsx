import { PlusIcon } from '@heroicons/react/24/solid'

type NewMatchButtonProps = {
  onClick?: () => void
  disabled?: boolean
  disabledReason?: string
}

export function NewMatchButton({ onClick, disabled, disabledReason }: NewMatchButtonProps) {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="btn btn-primary btn-block"
      >
        <PlusIcon className="h-5 w-5" />
        <span>New match</span>
      </button>
      {disabled && disabledReason && (
        <p className="text-xs text-center text-base-content/60 mt-2">
          {disabledReason}
        </p>
      )}
    </div>
  )
}
