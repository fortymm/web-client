import Layout from './Layout'
import LandingPage from './LandingPage'
import MatchDetailPage from './MatchDetailPage'
import NewMatch from './NewMatch'
import MatchScorePage from './MatchScorePage'

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
        path: 'matches/new',
        element: <NewMatch />,
      },
      {
        path: 'matches/:id',
        element: <MatchDetailPage />,
      },
      {
        path: 'matches/:id/score',
        element: <MatchScorePage />,
      },
    ],
  },
]
