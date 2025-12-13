import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import ScrollToTop from './ScrollToTop'
import { useSession } from './hooks/useSession'

function Layout() {
  // Fetch session data in background on page load
  useSession()

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
