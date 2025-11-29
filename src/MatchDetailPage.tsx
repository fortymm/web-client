import { useParams } from 'react-router-dom'

function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()

  return <h1>Match {id}</h1>
}

export default MatchDetailPage
