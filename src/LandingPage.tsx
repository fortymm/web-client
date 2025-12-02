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
          onClick={() => showFlash('This is an info message', 'info')}
        >
          Info Flash
        </button>
        <button
          className="btn btn-success"
          onClick={() => showFlash('Operation completed successfully!', 'success')}
        >
          Success Flash
        </button>
        <button
          className="btn btn-warning"
          onClick={() => showFlash('Warning: Check your input', 'warning')}
        >
          Warning Flash
        </button>
        <button
          className="btn btn-error"
          onClick={() => showFlash('Something went wrong!', 'error')}
        >
          Error Flash
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="btn btn-outline"
          onClick={() => showFlash('This will disappear in 3 seconds', 'info', 3000)}
        >
          Auto-dismiss (3s)
        </button>
        <button
          className="btn btn-outline"
          onClick={() => {
            showFlash('First message', 'info')
            showFlash('Second message', 'success')
            showFlash('Third message', 'warning')
          }}
        >
          Multiple Flashes
        </button>
      </div>
    </div>
  )
}

export default LandingPage
