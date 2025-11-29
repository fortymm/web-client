import { useState } from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      <button className="btn btn-primary" onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <Link to="/matches/new" className="btn btn-secondary">
        New Match
      </Link>
    </div>
  )
}

export default LandingPage
