import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar bg-base-100 shadow-sm">
      <Link to="/" className="btn btn-ghost text-xl">FortyMM</Link>
    </nav>
  )
}

export default Navbar
