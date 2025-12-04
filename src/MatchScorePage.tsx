import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeftIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import ScoreDisplay from './MatchScorePage/ScoreDisplay'
import GameProgress from './MatchScorePage/GameProgress'
import CTAPanel from './CTAPanel'
import { getMatch } from './lib/matchesDb'

interface GameScore {
  player: number
  opponent: number
}

interface PointRecord {
  scorer: 'player' | 'opponent'
  playerScore: number
  opponentScore: number
  servingPlayer: 'player' | 'opponent'
}

function MatchScorePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Match config (loaded from IndexedDB)
  const [matchLength, setMatchLength] = useState<number>(5)
  const [isLoading, setIsLoading] = useState(true)

  // Scoring state
  const [currentGame, setCurrentGame] = useState<GameScore>({ player: 0, opponent: 0 })
  const [completedGames, setCompletedGames] = useState<GameScore[]>([])
  const [servingPlayer, setServingPlayer] = useState<'player' | 'opponent'>('player')
  const [pointHistory, setPointHistory] = useState<PointRecord[]>([])

  // Derived state
  const gamesWon = {
    player: completedGames.filter((g) => g.player > g.opponent).length,
    opponent: completedGames.filter((g) => g.opponent > g.player).length,
  }
  const currentGameNumber = completedGames.length + 1
  const gamesToWin = Math.ceil(matchLength / 2)
  const isMatchComplete = gamesWon.player >= gamesToWin || gamesWon.opponent >= gamesToWin
  const canUndo = pointHistory.length > 0

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

  // Calculate next server based on total points in current game
  function getNextServer(playerScore: number, opponentScore: number): 'player' | 'opponent' {
    const totalPoints = playerScore + opponentScore
    const isDeuce = playerScore >= 10 && opponentScore >= 10

    if (isDeuce) {
      // Alternate every point in deuce
      return totalPoints % 2 === 0 ? 'player' : 'opponent'
    }

    // Alternate every 2 points
    const serveBlock = Math.floor(totalPoints / 2)
    return serveBlock % 2 === 0 ? 'player' : 'opponent'
  }

  // Check if game is won
  function isGameWon(score: GameScore): 'player' | 'opponent' | null {
    const { player, opponent } = score
    const isDeuce = player >= 10 && opponent >= 10

    if (isDeuce) {
      if (player >= opponent + 2) return 'player'
      if (opponent >= player + 2) return 'opponent'
      return null
    }

    if (player >= 11) return 'player'
    if (opponent >= 11) return 'opponent'
    return null
  }

  function addPoint(scorer: 'player' | 'opponent') {
    if (isMatchComplete) return

    // Save current state for undo
    setPointHistory((prev) => [
      ...prev,
      {
        scorer,
        playerScore: currentGame.player,
        opponentScore: currentGame.opponent,
        servingPlayer,
      },
    ])

    // Update score
    const newScore = {
      player: currentGame.player + (scorer === 'player' ? 1 : 0),
      opponent: currentGame.opponent + (scorer === 'opponent' ? 1 : 0),
    }

    // Check if game is won
    const gameWinner = isGameWon(newScore)

    if (gameWinner) {
      // Game complete - add to completed games and reset
      setCompletedGames((prev) => [...prev, newScore])
      setCurrentGame({ player: 0, opponent: 0 })
      setServingPlayer(getNextServer(0, 0))
    } else {
      // Continue game
      setCurrentGame(newScore)
      setServingPlayer(getNextServer(newScore.player, newScore.opponent))
    }
  }

  function undoLastPoint() {
    if (pointHistory.length === 0) return

    const lastRecord = pointHistory[pointHistory.length - 1]

    // Check if we need to restore a completed game
    const wasGameJustCompleted =
      lastRecord.playerScore < currentGame.player ||
      lastRecord.opponentScore < currentGame.opponent ||
      (currentGame.player === 0 && currentGame.opponent === 0 && completedGames.length > 0)

    if (wasGameJustCompleted && currentGame.player === 0 && currentGame.opponent === 0) {
      // Restore the last completed game
      const restoredGame = completedGames[completedGames.length - 1]
      setCompletedGames((prev) => prev.slice(0, -1))
      setCurrentGame({
        player: restoredGame.player - (lastRecord.scorer === 'player' ? 1 : 0),
        opponent: restoredGame.opponent - (lastRecord.scorer === 'opponent' ? 1 : 0),
      })
    } else {
      // Normal undo within current game
      setCurrentGame({
        player: lastRecord.playerScore,
        opponent: lastRecord.opponentScore,
      })
    }

    setServingPlayer(lastRecord.servingPlayer)
    setPointHistory((prev) => prev.slice(0, -1))
  }

  function handleSaveMatch() {
    // TODO: Save match scores to IndexedDB and/or API
    navigate('/')
  }

  // Format previous score for undo button
  const undoLabel =
    pointHistory.length > 0
      ? `${pointHistory[pointHistory.length - 1].playerScore}-${pointHistory[pointHistory.length - 1].opponentScore}`
      : null

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
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-200">
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
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-screen-sm mx-auto w-full px-4 py-6">
        {/* Score Display */}
        <div className="flex-1 flex flex-col justify-center">
          <ScoreDisplay
            playerScore={currentGame.player}
            opponentScore={currentGame.opponent}
            servingPlayer={servingPlayer}
            onPlayerScore={() => addPoint('player')}
            onOpponentScore={() => addPoint('opponent')}
          />

          {/* Game Progress */}
          <GameProgress
            gamesWon={gamesWon}
            matchLength={matchLength}
            currentGame={currentGameNumber}
          />
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between py-3">
          <button
            type="button"
            onClick={undoLastPoint}
            disabled={!canUndo}
            className="btn btn-ghost btn-sm gap-1.5 disabled:opacity-40"
            aria-label="Undo last point"
          >
            <ArrowUturnLeftIcon className="h-4 w-4" />
            Undo
            {undoLabel && (
              <span className="text-base-content/50">({undoLabel})</span>
            )}
          </button>
        </div>
      </div>

      {/* CTA Panel */}
      <CTAPanel>
        <button
          type="button"
          onClick={handleSaveMatch}
          className="btn btn-primary btn-block h-12"
        >
          {isMatchComplete ? 'Save Match' : 'End & Save Match'}
        </button>
      </CTAPanel>
    </div>
  )
}

export default MatchScorePage
