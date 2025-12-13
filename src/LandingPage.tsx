import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { NewMatchButton } from './NewMatchButton'
import CTAPanel from '@common/CTAPanel'
import { usePrefetchRecentOpponents } from './usePrefetchRecentOpponents'
import { useMatches } from './useMatches'
import MatchList from './MatchList'
import InProgressMatchModal from './InProgressMatchModal'
import { deleteMatch } from '@lib/matchesDb'

function LandingPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  usePrefetchRecentOpponents()
  const { matches, isLoading } = useMatches()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hasMatches = matches.length > 0
  const inProgressMatch = matches.find((m) => m.status === 'in_progress')

  const handleNewMatchClick = () => {
    if (inProgressMatch) {
      setIsModalOpen(true)
    } else {
      navigate('/matches/new')
    }
  }

  const handleContinueMatch = () => {
    if (inProgressMatch) {
      navigate(`/matches/${inProgressMatch.id}/score`)
    }
    setIsModalOpen(false)
  }

  const handleEndMatch = async () => {
    if (inProgressMatch) {
      await deleteMatch(inProgressMatch.id)
      await queryClient.invalidateQueries({ queryKey: ['matches'] })
    }
    setIsModalOpen(false)
    navigate('/matches/new')
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  return (
    <>
      {hasMatches ? (
        <div className="max-w-md mx-auto pb-40">
          <MatchList matches={matches} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px-120px)] -mx-4 -mt-4 px-4 pb-8">
          <div className="-mt-16 card max-w-xs bg-base-200 p-6 text-center">
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
      )}

      <CTAPanel>
        {inProgressMatch ? (
          <div className="space-y-2">
            <Link
              to={`/matches/${inProgressMatch.id}/score`}
              className="btn btn-primary btn-block h-12"
            >
              Continue match
            </Link>
            <button
              onClick={handleNewMatchClick}
              className="btn btn-outline btn-block h-10"
            >
              <PlusIcon />
              New match
            </button>
          </div>
        ) : (
          <NewMatchButton onClick={handleNewMatchClick} />
        )}
      </CTAPanel>

      {inProgressMatch && (
        <InProgressMatchModal
          match={inProgressMatch}
          isOpen={isModalOpen}
          onContinue={handleContinueMatch}
          onEndMatch={handleEndMatch}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

function PlusIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

export default LandingPage
