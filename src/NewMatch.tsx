import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import NewMatchHero from './NewMatch/NewMatchHero'
import NewMatchSearch from './NewMatch/NewMatchSearch'
import NewMatchContent from './NewMatch/NewMatchContent'
import SectionHeader from './NewMatch/SectionHeader'
import MatchLengthControl from './NewMatch/MatchLengthControl'
import QuickMatchButton from './NewMatch/QuickMatchButton'
import StickyBottomPanel from './NewMatch/StickyBottomPanel'

function NewMatch() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex flex-col h-screen bg-base-100">
      {/* App Bar */}
      <nav className="sticky top-0 z-50 bg-base-100 h-14 flex items-center px-2 shadow-sm">
        <button
          onClick={handleBack}
          className="btn btn-ghost btn-sm btn-square"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      </nav>

      {/* Main Content Wrapper */}
      <div className="max-w-screen-sm mx-auto w-full flex flex-col flex-1 min-h-0">
        <NewMatchHero />
        <NewMatchSearch />
        <NewMatchContent>
          <SectionHeader title="RECENT PLAYERS" />
          <div className="px-4 py-8 text-center text-base-content/60">
            Content area
          </div>
        </NewMatchContent>
      </div>

      <StickyBottomPanel>
        <MatchLengthControl />
        <QuickMatchButton />
      </StickyBottomPanel>
    </div>
  )
}

export default NewMatch
