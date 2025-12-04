import { type FC } from 'react'
import ScorePanel from './ScorePanel'

interface ScoreDisplayProps {
  playerScore: number
  opponentScore: number
  servingPlayer: 'player' | 'opponent'
  playerLabel?: string
  opponentLabel?: string
  onPlayerScore: () => void
  onOpponentScore: () => void
}

const ScoreDisplay: FC<ScoreDisplayProps> = ({
  playerScore,
  opponentScore,
  servingPlayer,
  playerLabel = 'You',
  opponentLabel = 'Opponent',
  onPlayerScore,
  onOpponentScore,
}) => {
  return (
    <div className="flex rounded-xl overflow-hidden border border-base-300">
      <ScorePanel
        label={playerLabel}
        score={playerScore}
        isServing={servingPlayer === 'player'}
        onTap={onPlayerScore}
      />
      <div className="w-px bg-base-300" />
      <ScorePanel
        label={opponentLabel}
        score={opponentScore}
        isServing={servingPlayer === 'opponent'}
        onTap={onOpponentScore}
      />
    </div>
  )
}

export default ScoreDisplay
