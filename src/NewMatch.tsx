import NewMatchHero from './NewMatch/NewMatchHero'
import NewMatchSearch from './NewMatch/NewMatchSearch'
import NewMatchContent from './NewMatch/NewMatchContent'
import SectionHeader from './NewMatch/SectionHeader'
import MatchLengthControl from './NewMatch/MatchLengthControl'
import QuickMatchButton from './NewMatch/QuickMatchButton'
import StickyBottomPanel from './NewMatch/StickyBottomPanel'

function NewMatch() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] -mx-4 -mt-4">
      {/* Main Content Wrapper */}
      <div className="max-w-screen-sm mx-auto w-full flex flex-col flex-1">
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
