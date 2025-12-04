import { useNavigate } from 'react-router-dom'
import { NewMatchButton } from './NewMatchButton'
import StickyBottomPanel from './NewMatch/StickyBottomPanel'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px-120px)] -mx-4 -mt-4 px-4">
        <div className="card max-w-xs bg-base-200 p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <span className="text-2xl">🏓</span>
          </div>
          <h2 className="text-lg font-bold">No matches yet</h2>
          <p className="mt-2 text-sm text-base-content/70">
            Your match history will appear here.
          </p>
          <p className="mt-3 text-xs text-base-content/50">
            Tap <span className="font-medium">New match</span> to log your first result.
          </p>
        </div>
      </div>

      <StickyBottomPanel>
        <NewMatchButton onClick={() => navigate('/matches/new')} />
      </StickyBottomPanel>
    </>
  )
}

export default LandingPage
