import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import ScoreCard from './MatchScorePage/ScoreCard'
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

  // Current game score
  const [currentGame, setCurrentGame] = useState<GameScore>({ player: 0, opponent: 0 })

  // Completed games history
  const [completedGames, setCompletedGames] = useState<GameScore[]>([])

  // Load match from IndexedDB
  useEffect(() => {
    async function loadMatch() {
      if (!id) return
      const match = await getMatch(id)
      if (match) {
        setMatchLength(match.matchLength)
      }
      setIsLoading(false)
    }
    loadMatch()
  }, [id])

  // Calculate match state
  const gamesToWin = Math.ceil(matchLength / 2)
  const playerWins = completedGames.filter((g) => g.player > g.opponent).length
  const opponentWins = completedGames.filter((g) => g.opponent > g.player).length
  const currentGameNumber = completedGames.length + 1
  const isCurrentGameComplete = isGameComplete(currentGame)
  const isMatchComplete =
    (isCurrentGameComplete &&
      (playerWins + (currentGame.player > currentGame.opponent ? 1 : 0) >= gamesToWin ||
        opponentWins + (currentGame.opponent > currentGame.player ? 1 : 0) >= gamesToWin)) ||
    playerWins >= gamesToWin ||
    opponentWins >= gamesToWin

  function handleScoreChange(player: 'player' | 'opponent', delta: number) {
    setCurrentGame((prev) => ({
      ...prev,
      [player]: Math.max(0, prev[player] + delta),
    }))
  }

  function handleNextGame() {
    // Save current game and start new one
    setCompletedGames((prev) => [...prev, currentGame])
    setCurrentGame({ player: 0, opponent: 0 })
  }

  function handleEndMatch() {
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

      {/* Middle area - completed games history (if any) */}
      <div className="flex-1 flex flex-col justify-end max-w-screen-sm mx-auto w-full px-4">
        {completedGames.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {completedGames.map((game, index) => (
                <div
                  key={index}
                  className="badge badge-lg badge-ghost gap-1"
                >
                  <span className="text-xs text-base-content/50">G{index + 1}</span>
                  <span className={game.player > game.opponent ? 'text-success font-semibold' : ''}>
                    {game.player}
                  </span>
                  <span className="text-base-content/30">–</span>
                  <span className={game.opponent > game.player ? 'text-success font-semibold' : ''}>
                    {game.opponent}
                  </span>
                </div>
              ))}
            </div>
            {/* Match score summary */}
            <p className="text-center text-sm text-base-content/60 mt-2">
              Match: You {playerWins} – {opponentWins} Opponent
            </p>
          </div>
        )}
      </div>

      {/* Bottom: Score Card - the main interaction area */}
      <div className="sticky bottom-0 w-full max-w-screen-sm mx-auto safe-area-bottom">
        <ScoreCard
          gameNumber={currentGameNumber}
          playerName="You"
          opponentName="Opponent"
          playerScore={currentGame.player}
          opponentScore={currentGame.opponent}
          isGameComplete={isCurrentGameComplete}
          isMatchComplete={isMatchComplete}
          onPlayerScoreChange={(delta) => handleScoreChange('player', delta)}
          onOpponentScoreChange={(delta) => handleScoreChange('opponent', delta)}
          onNextGame={handleNextGame}
          onEndMatch={handleEndMatch}
        />
      </div>
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
