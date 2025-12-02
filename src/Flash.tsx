import { useFlash, type FlashType } from './useFlash'

const alertClasses: Record<FlashType, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
}

function Flash() {
  const { flashes, dismissFlash } = useFlash()

  if (flashes.length === 0) {
    return null
  }

  return (
    <div className="toast toast-top toast-center z-50">
      {flashes.map((flash) => (
        <div
          key={flash.id}
          role="alert"
          className={`alert ${alertClasses[flash.type]} shadow-lg`}
        >
          <span>{flash.message}</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => dismissFlash(flash.id)}
            aria-label="Dismiss"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export default Flash
