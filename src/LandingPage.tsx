import { useNavigate } from 'react-router-dom'
import { NewMatchButton } from './NewMatchButton'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4">
      <NewMatchButton onClick={() => navigate('/matches/new')} />
    </div>
  )
}

export default LandingPage
