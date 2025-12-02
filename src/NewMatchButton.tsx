type NewMatchButtonProps = {
  onClick?: () => void
}

export function NewMatchButton({ onClick }: NewMatchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        btn btn-primary btn-lg btn-block
        normal-case
        rounded-2xl
        justify-between
        gap-4
        bg-gradient-to-r from-secondary to-primary
        border-0
        shadow-md
        hover:shadow-lg
        transition
      "
    >
      {/* Left: icon + text */}
      <div className="flex items-center gap-3">
        <div className="avatar placeholder">
          <div className="w-10 rounded-full bg-primary-content/20">
            {/* Swap this for your paddle icon */}
            <span className="text-xl font-bold">+</span>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold">New match</span>
          <span className="text-xs opacity-80">
            Log a result or start a Quick Match
          </span>
        </div>
      </div>

      {/* Right: affordance */}
      <div className="flex items-center gap-2 text-xs opacity-80">
        <span className="hidden sm:inline">Open</span>
        <svg
          className="h-4 w-4 transform transition group-hover:translate-x-0.5"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M7 4l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  )
}
