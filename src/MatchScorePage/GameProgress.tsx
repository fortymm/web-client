import { type FC } from 'react'

interface GameProgressProps {
  gamesWon: {
    player: number
    opponent: number
  }
  matchLength: number
  currentGame: number
}

const GameProgress: FC<GameProgressProps> = ({
  gamesWon,
  matchLength,
  currentGame,
}) => {
  const gamesToWin = Math.ceil(matchLength / 2)

  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {/* Player games */}
      <div className="flex items-center gap-1.5" aria-label={`You: ${gamesWon.player} games`}>
        {Array.from({ length: gamesToWin }).map((_, i) => (
          <span
            key={`player-${i}`}
            className={`w-3 h-3 rounded-full ${
              i < gamesWon.player ? 'bg-primary' : 'bg-base-300'
            }`}
          />
        ))}
      </div>

      {/* Current game indicator */}
      <span className="text-xs text-base-content/50 font-medium">
        Game {currentGame} of {matchLength}
      </span>

      {/* Opponent games */}
      <div className="flex items-center gap-1.5" aria-label={`Opponent: ${gamesWon.opponent} games`}>
        {Array.from({ length: gamesToWin }).map((_, i) => (
          <span
            key={`opponent-${i}`}
            className={`w-3 h-3 rounded-full ${
              i < gamesWon.opponent ? 'bg-error' : 'bg-base-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default GameProgress
