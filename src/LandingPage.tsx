import { useNavigate } from 'react-router-dom'
import { NewMatchButton } from './NewMatchButton'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="card bg-base-200 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-3xl">🏓</span>
          </div>
          <h2 className="text-xl font-semibold">No matches yet</h2>
          <p className="mt-2 text-base-content/70">
            Your match history will appear here.
          </p>
          <p className="mt-1 text-sm text-base-content/50">
            Tap <span className="font-medium">New match</span> below to get started.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4">
        <NewMatchButton onClick={() => navigate('/matches/new')} />
      </div>
    </>
  )
}

export default LandingPage
