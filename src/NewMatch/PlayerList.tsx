import { type FC } from 'react'
import PlayerRow from './PlayerRow'
import { type PlayerResult } from '../hooks/usePlayerResults'

export interface PlayerListProps {
  players: PlayerResult[]
  context: 'recents' | 'search'
  onSelectPlayer: (playerId: string) => void
}

const PlayerList: FC<PlayerListProps> = ({
  players,
  context,
  onSelectPlayer,
}) => {
  return (
    <ul role="list" data-testid="player-list" className="divide-y divide-base-200">
      {players.map((player) => (
        <li key={player.id}>
          <PlayerRow
            player={player}
            context={context}
            headToHead={player.headToHead}
            lastMatch={player.lastMatch}
            hasHistory={!!player.headToHead}
            onSelect={onSelectPlayer}
          />
        </li>
      ))}
    </ul>
  )
}

export default PlayerList
