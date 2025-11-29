import Layout from './Layout'
import LandingPage from './LandingPage'
import MatchDetailPage from './MatchDetailPage'

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'matches/:id',
        element: <MatchDetailPage />,
      },
    ],
  },
]
