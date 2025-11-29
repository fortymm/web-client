import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import LandingPage from './LandingPage'

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
]

const router = createBrowserRouter(routes)

function App() {
  return <RouterProvider router={router} />
}

export default App
