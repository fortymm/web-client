import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import ScrollToTop from './ScrollToTop'

function Layout() {
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
