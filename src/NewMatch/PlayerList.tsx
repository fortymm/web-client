import { type FC } from 'react'
import PlayerRow from './PlayerRow'
import { type RecentOpponent } from '../hooks/useRecentOpponents'

export interface PlayerListPlayer {
  id: string
  username: string
  avatarUrl: string | null
  isEphemeral: boolean
  headToHead?: {
    wins: number
    losses: number
  }
  lastMatch?: {
    result: 'win' | 'loss'
    score: string
    playedAt: string
  }
}

export interface PlayerListProps {
  players: PlayerListPlayer[] | RecentOpponent[]
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
