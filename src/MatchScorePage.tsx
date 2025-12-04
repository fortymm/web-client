import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import MatchScoreForm from './MatchScorePage/MatchScoreForm'
import CTAPanel from './CTAPanel'
import { getMatch } from './lib/matchesDb'

interface GameScore {
  player: number
  opponent: number
}

function MatchScorePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Match config (loaded from IndexedDB)
  const [matchLength, setMatchLength] = useState<number>(5)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize games array based on match length
  const [games, setGames] = useState<GameScore[]>(() =>
    Array.from({ length: 5 }, () => ({ player: 0, opponent: 0 }))
  )

  // Load match from IndexedDB
  useEffect(() => {
    async function loadMatch() {
      if (!id) return
      const match = await getMatch(id)
      if (match) {
        setMatchLength(match.matchLength)
        // Initialize games array based on actual match length
        setGames(
          Array.from({ length: match.matchLength }, () => ({ player: 0, opponent: 0 }))
        )
      }
      setIsLoading(false)
    }
    loadMatch()
  }, [id])

  // Calculate match state
  const gamesToWin = Math.ceil(matchLength / 2)
  const playerWins = games.filter((g) => isGameComplete(g) && g.player > g.opponent).length
  const opponentWins = games.filter((g) => isGameComplete(g) && g.opponent > g.player).length
  const isMatchComplete = playerWins >= gamesToWin || opponentWins >= gamesToWin

  // Find current game number (first incomplete game)
  const currentGameNumber = games.findIndex((g) => !isGameComplete(g)) + 1 || matchLength

  function handleGameScoreChange(
    gameIndex: number,
    player: 'player' | 'opponent',
    delta: number
  ) {
    setGames((prev) => {
      const newGames = [...prev]
      const game = { ...newGames[gameIndex] }

      if (player === 'player') {
        game.player = Math.max(0, game.player + delta)
      } else {
        game.opponent = Math.max(0, game.opponent + delta)
      }

      newGames[gameIndex] = game
      return newGames
    })
  }

  function handleSaveMatch() {
    // TODO: Save match scores to IndexedDB and/or API
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <span className="loading loading-spinner loading-lg" aria-label="Loading match" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] -mx-4 -mt-4">
      {/* Screen reader only heading for accessibility */}
      <h1 className="sr-only">Score Match</h1>

      {/* Header */}
      <div className="border-b border-base-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="btn btn-ghost btn-sm gap-1"
            aria-label="Back to home"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
          <span className="text-sm font-medium text-base-content/70">
            {isMatchComplete ? 'Match Complete' : `Game ${currentGameNumber} of ${matchLength}`}
          </span>
          {/* Spacer for alignment */}
          <div className="w-16" />
        </div>
        {/* Match format subline */}
        <p className="text-center text-xs text-base-content/50 mt-1">
          Best of {matchLength} · Games to 11 · Win by 2
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-screen-sm mx-auto w-full px-4 py-4">
        <MatchScoreForm
          matchLength={matchLength}
          games={games}
          playerName="You"
          opponentName="Opponent"
          onGameScoreChange={handleGameScoreChange}
        />
      </div>

      {/* CTA Panel */}
      <CTAPanel>
        <button
          type="button"
          onClick={handleSaveMatch}
          className={
            isMatchComplete
              ? 'btn btn-primary btn-block h-12'
              : 'btn btn-ghost btn-block h-10 text-base-content/60'
          }
        >
          {isMatchComplete ? 'Save Match' : 'End match early…'}
        </button>
      </CTAPanel>
    </div>
  )
}

// Check if a game has a valid winner (11+ points and 2+ point lead)
function isGameComplete(game: GameScore): boolean {
  const { player, opponent } = game
  const maxScore = Math.max(player, opponent)
  const minScore = Math.min(player, opponent)

  // Need at least 11 points and 2 point lead
  if (maxScore >= 11 && maxScore - minScore >= 2) {
    return true
  }

  return false
}

export default MatchScorePage
