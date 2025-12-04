import { type FC } from 'react'

interface GameScore {
  player: number
  opponent: number
}

interface GameProgressProps {
  completedGames: GameScore[]
  currentGame: number
  matchLength: number
  isMatchComplete: boolean
}

const GameProgress: FC<GameProgressProps> = ({
  completedGames,
  currentGame,
  matchLength: _matchLength,
  isMatchComplete,
}) => {
  if (completedGames.length === 0 && !isMatchComplete) {
    return null // Don't show anything for game 1
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-3" role="list" aria-label="Game history">
      {completedGames.map((game, index) => {
        const playerWon = game.player > game.opponent
        return (
          <span
            key={index}
            role="listitem"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              playerWon
                ? 'bg-success/15 text-success'
                : 'bg-error/15 text-error'
            }`}
          >
            <span className="text-base-content/50">G{index + 1}</span>
            <span className="font-bold tabular-nums">
              {game.player}–{game.opponent}
            </span>
          </span>
        )
      })}

      {!isMatchComplete && (
        <span
          role="listitem"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary ring-1 ring-primary/30"
        >
          <span className="text-primary/70">G{currentGame}</span>
          <span className="font-bold">Now</span>
        </span>
      )}
    </div>
  )
}

export default GameProgress
