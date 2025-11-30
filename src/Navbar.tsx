import { Link } from 'react-router-dom'
import UserMenu from './UserMenu/UserMenu'

function Navbar() {
  return (
    <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">FortyMM</Link>
      </div>
      <div className="flex-none">
        <UserMenu />
      </div>
    </nav>
  )
}

export default Navbar
