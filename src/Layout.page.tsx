import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import { navbarPage } from './Navbar.page'

export { navbarPage } from './Navbar.page'

export const layoutPage = {
  render(outletContent: React.ReactNode = null) {
    const routes = [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: outletContent,
          },
        ],
      },
    ]
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    render(<RouterProvider router={router} />)
  },

  get navbar() {
    return navbarPage.navbar
  },

  get brandLink() {
    return navbarPage.brandLink
  },

  get main() {
    return screen.getByRole('main')
  },

  getOutletContent(text: string) {
    return screen.getByText(text)
  },
}
