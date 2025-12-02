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
        rounded-2xl
        justify-between
        px-4
        shadow-md
      "
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-content/20">
          <span className="text-lg font-bold">+</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold">New match</span>
          <span className="text-xs text-primary-content/80">
            Log a result or start Quick Match
          </span>
        </div>
      </div>

      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
        <path
          d="M7 4l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
