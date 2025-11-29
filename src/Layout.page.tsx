import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'

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
    return screen.getByRole('navigation')
  },

  get brandLink() {
    return screen.getByRole('link', { name: 'FortyMM' })
  },

  get main() {
    return screen.getByRole('main')
  },

  getOutletContent(text: string) {
    return screen.getByText(text)
  },
}
