import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import { TestQueryProvider, createTestQueryClient } from './test/utils'
import { type QueryClient } from '@tanstack/react-query'
import FlashProvider from './FlashProvider'

interface RenderOptions {
  queryClient?: QueryClient
}

export const appPage = {
  render(initialRoute: string = '/', options: RenderOptions = {}) {
    const { queryClient = createTestQueryClient() } = options
    const router = createMemoryRouter(routes, { initialEntries: [initialRoute] })
    render(
      <TestQueryProvider client={queryClient}>
        <FlashProvider>
          <RouterProvider router={router} />
        </FlashProvider>
      </TestQueryProvider>
    )
    return { queryClient }
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
