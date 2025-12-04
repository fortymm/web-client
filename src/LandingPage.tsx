import { useNavigate } from 'react-router-dom'
import { NewMatchButton } from './NewMatchButton'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4">
      <NewMatchButton onClick={() => navigate('/matches/new')} />
    </div>
  )
}

export default LandingPage
