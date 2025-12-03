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
        justify-between
        px-4
        shadow-md
      "
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold">+</span>
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold">New match</span>
          <span className="text-xs text-primary-content/70">
            Log a result or Quick Match
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
