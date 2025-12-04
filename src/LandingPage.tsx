import { useNavigate } from 'react-router-dom'
import { NewMatchButton } from './NewMatchButton'
import StickyBottomPanel from './NewMatch/StickyBottomPanel'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-64px-120px)] -mx-4 -mt-4">
        <div className="max-w-screen-sm mx-auto w-full flex flex-col flex-1 justify-center px-4">
          <div className="card bg-base-200 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl">🏓</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold">No matches yet</h2>
                <p className="mt-1 text-sm text-base-content/70">
                  Your match history will appear here.
                </p>
                <p className="mt-2 text-xs text-base-content/50">
                  Tap <span className="font-medium">New match</span> to log your first result.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StickyBottomPanel>
        <NewMatchButton onClick={() => navigate('/matches/new')} />
      </StickyBottomPanel>
    </>
  )
}

export default LandingPage
