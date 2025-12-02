import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFlash } from './useFlash'

function LandingPage() {
  const [count, setCount] = useState(0)
  const { showFlash } = useFlash()

  return (
    <div className="flex flex-col gap-4">
      <button className="btn btn-primary" onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <Link to="/matches/new" className="btn btn-secondary">
        New Match
      </Link>

      <div className="divider">Flash Test Controls</div>

      <div className="flex flex-wrap gap-2">
        <button
          className="btn btn-info"
          onClick={() => showFlash('This is an info message', { type: 'info' })}
        >
          Info Flash
        </button>
        <button
          className="btn btn-success"
          onClick={() => showFlash('Operation completed successfully!', { type: 'success' })}
        >
          Success Flash
        </button>
        <button
          className="btn btn-warning"
          onClick={() => showFlash('Warning: Check your input', { type: 'warning' })}
        >
          Warning Flash
        </button>
        <button
          className="btn btn-error"
          onClick={() => showFlash('Something went wrong!', { type: 'error' })}
        >
          Error Flash
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="btn btn-outline"
          onClick={() => showFlash('This will disappear in 3 seconds', { type: 'info', timeout: 3000 })}
        >
          Auto-dismiss (3s)
        </button>
        <button
          className="btn btn-outline"
          onClick={() => {
            showFlash('First message', { type: 'info' })
            showFlash('Second message', { type: 'success' })
            showFlash('Third message', { type: 'warning' })
          }}
        >
          Multiple Flashes
        </button>
        <button
          className="btn btn-outline btn-info"
          onClick={() =>
            showFlash('A new version is available.', {
              type: 'info',
              action: {
                label: 'Refresh',
                onClick: () => window.location.reload(),
              },
            })
          }
        >
          Update Available
        </button>
      </div>
    </div>
  )
}

export default LandingPage
