import Layout from './Layout'
import LandingPage from './LandingPage'
import MatchDetailPage from './MatchDetailPage'
import NewMatch from './NewMatch'

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
    element: <NewMatch />,
  },
]
