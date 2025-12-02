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
  loadingPlayerId: string | null
}

const PlayerList: FC<PlayerListProps> = ({
  players,
  context,
  onSelectPlayer,
  loadingPlayerId,
}) => {
  return (
    <ul role="list" className="divide-y divide-base-200">
      {players.map((player) => (
        <li key={player.id}>
          <PlayerRow
            player={player}
            context={context}
            headToHead={player.headToHead}
            lastMatch={player.lastMatch}
            hasHistory={!!player.headToHead}
            onSelect={onSelectPlayer}
            isLoading={loadingPlayerId === player.id}
          />
        </li>
      ))}
    </ul>
  )
}

export default PlayerList
