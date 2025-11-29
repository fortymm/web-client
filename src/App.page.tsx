import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'

export const appPage = {
  render(initialRoute: string = '/') {
    const router = createMemoryRouter(routes, { initialEntries: [initialRoute] })
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
}
