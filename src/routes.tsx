import Layout from './Layout'
import LandingPage from './LandingPage'
import MatchDetailPage from './MatchDetailPage'
import NewMatchPage from './pages/NewMatchPage'

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
  {
    path: '/match/new',
    element: <NewMatchPage />,
  },
]
