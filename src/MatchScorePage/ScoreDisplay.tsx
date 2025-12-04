import { type FC } from 'react'
import ScorePanel from './ScorePanel'

interface ScoreDisplayProps {
  playerScore: number
  opponentScore: number
  servingPlayer: 'player' | 'opponent'
  playerName?: string
  opponentName?: string
  onPlayerScore: () => void
  onOpponentScore: () => void
  disabled?: boolean
}

const ScoreDisplay: FC<ScoreDisplayProps> = ({
  playerScore,
  opponentScore,
  servingPlayer,
  playerName = 'You',
  opponentName = 'Opponent',
  onPlayerScore,
  onOpponentScore,
  disabled = false,
}) => {
  return (
    <div className="flex rounded-xl overflow-hidden border border-base-300 shadow-sm">
      <ScorePanel
        playerName={playerName}
        score={playerScore}
        isServing={servingPlayer === 'player'}
        onTap={onPlayerScore}
        disabled={disabled}
      />
      <div className="w-px bg-base-300" />
      <ScorePanel
        playerName={opponentName}
        score={opponentScore}
        isServing={servingPlayer === 'opponent'}
        onTap={onOpponentScore}
        disabled={disabled}
      />
    </div>
  )
}

export default ScoreDisplay
