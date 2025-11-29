import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <nav className="navbar bg-base-100 shadow-sm">
        <a href="/" className="btn btn-ghost text-xl">FortyMM</a>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
