type NewMatchButtonProps = {
  onClick?: () => void
}

export function NewMatchButton({ onClick }: NewMatchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        btn btn-primary btn-lg w-full
        normal-case
        justify-start
        gap-3
        px-4
        shadow-md
      "
    >
      <span className="text-lg font-bold">+</span>
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold">New match</span>
        <span className="text-xs text-primary-content/70">
          Log a result or Quick Match
        </span>
      </div>
    </button>
  )
}
