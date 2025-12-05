import { type FC, useState, useCallback, useRef } from 'react'
import type { GameScore, MatchScoreEntryProps, MatchSummary } from './types'
import {
  validateGameScore,
  computeMatchSummary,
  canSaveMatch,
  initializeScores,
} from './validation'
import GameRow from './GameRow'

const MatchScoreEntry: FC<MatchScoreEntryProps> = ({
  config,
  initialScores,
  onSave,
  onCancel,
  allowIncompleteSave = false,
}) => {
  const [scores, setScores] = useState<GameScore[]>(() =>
    initialScores && initialScores.length > 0
      ? initialScores
      : initializeScores(config.bestOf)
  )
  const [isSaving, setIsSaving] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  const gameRowsRef = useRef<HTMLDivElement>(null)

  const handleGameChange = useCallback((updatedGame: GameScore) => {
    setScores((prev) =>
      prev.map((game) =>
        game.gameIndex === updatedGame.gameIndex ? updatedGame : game
      )
    )
  }, [])

  const matchSummary: MatchSummary = computeMatchSummary(scores, config)
  const saveStatus = canSaveMatch(scores, config, allowIncompleteSave)

  const handleSave = async () => {
    if (!saveStatus.canSave) {
      setShowErrors(true)

      // Scroll to first invalid game
      if (gameRowsRef.current) {
        const firstInvalidGame = scores.findIndex((game) => {
          if (game.youScore === null || game.opponentScore === null) {
            return false
          }
          const result = validateGameScore(game, config)
          return !result.isValid
        })

        if (firstInvalidGame >= 0) {
          const gameRows = gameRowsRef.current.querySelectorAll('[data-game-row]')
          gameRows[firstInvalidGame]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }
      return
    }

    setIsSaving(true)
    try {
      await onSave(scores)
    } finally {
      setIsSaving(false)
    }
  }

  const getMatchSummaryText = (): string => {
    const youName = config.playerYou.name
    const opponentName = config.playerOpponent.name
    const score = `${youName} ${matchSummary.youWins}–${matchSummary.opponentWins} ${opponentName}`

    if (matchSummary.isComplete) {
      return `Match complete – ${score}`
    }
    return `Match score: ${score}`
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Enter scores</h1>
        <p className="text-base-content/70 mt-1">
          {config.playerYou.name} vs {config.playerOpponent.name}
        </p>
        <p className="text-sm text-base-content/50 mt-0.5">
          Best of {config.bestOf} · To {config.pointsToWin} · Win by{' '}
          {config.winBy}
        </p>
      </div>

      {/* Match Summary Pill */}
      <div
        className={`badge badge-lg py-3 px-4 self-center ${
          matchSummary.isComplete ? 'badge-success' : 'badge-neutral'
        }`}
        role="status"
        aria-live="polite"
      >
        {getMatchSummaryText()}
      </div>

      {/* Global Error */}
      {showErrors && saveStatus.reason && (
        <div className="alert alert-error" role="alert">
          <span>{saveStatus.reason}</span>
        </div>
      )}

      {/* Game Rows */}
      <div ref={gameRowsRef} className="flex flex-col gap-3">
        {scores.map((game, index) => {
          const validation = validateGameScore(game, config)
          return (
            <div key={game.gameIndex} data-game-row>
              <GameRow
                gameNumber={index + 1}
                game={game}
                config={config}
                validation={validation}
                onChange={handleGameChange}
                disabled={isSaving}
              />
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 bg-base-100 pt-4 pb-2 border-t border-base-200 mt-2">
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving…
            </>
          ) : (
            'Save match'
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            className="btn btn-ghost btn-block mt-2"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}

        <p className="text-center text-xs text-base-content/50 mt-2">
          To {config.pointsToWin} · Win by {config.winBy}
        </p>
      </div>
    </div>
  )
}

export default MatchScoreEntry
