import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <Link to="/" className="btn btn-ghost text-xl">FortyMM</Link>
    </nav>
  )
}

export default Navbar
