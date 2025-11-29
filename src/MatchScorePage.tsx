import { useParams } from 'react-router-dom'

function MatchScorePage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Score Match</h1>
      <p className="text-base-content/60">Match ID: {id}</p>
    </div>
  )
}

export default MatchScorePage
