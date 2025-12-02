import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routes } from './routes'
import FlashProvider from './FlashProvider'
import UpdateFlash from './UpdateFlash'

const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FlashProvider>
        <RouterProvider router={router} />
        <UpdateFlash />
      </FlashProvider>
    </QueryClientProvider>
  )
}

export default App
