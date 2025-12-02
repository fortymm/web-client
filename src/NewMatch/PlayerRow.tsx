import { type FC, type ReactNode } from 'react'
import PlayerAvatar from './PlayerAvatar'
import { formatRelativeTime } from '../lib/formatRelativeTime'

export interface PlayerRowProps {
  player: {
    id: string
    username: string
    avatarUrl: string | null
    isEphemeral: boolean
  }
  context: 'recents' | 'search'
  headToHead?: {
    wins: number
    losses: number
  }
  lastMatch?: {
    result: 'win' | 'loss'
    score: string
    playedAt: string
  }
  hasHistory: boolean
  onSelect: (playerId: string) => void
}

function formatSecondaryContent(
  hasHistory: boolean,
  headToHead?: { wins: number; losses: number },
  lastMatch?: { result: 'win' | 'loss'; score: string; playedAt: string }
): ReactNode {
  if (!hasHistory || !headToHead || !lastMatch) {
    return 'No matches yet'
  }

  const record = `${headToHead.wins}-${headToHead.losses}`
  const timeAgo = formatRelativeTime(lastMatch.playedAt)
  const isWin = lastMatch.result === 'win'

  return (
    <>
      Last:{' '}
      <span className={isWin ? 'text-success font-medium' : 'text-base-content/60'}>
        {isWin ? 'Won' : 'Lost'}
      </span>{' '}
      {lastMatch.score} · {timeAgo} · Record {record}
    </>
  )
}

const PlayerRow: FC<PlayerRowProps> = ({
  player,
  headToHead,
  lastMatch,
  hasHistory,
  onSelect,
}) => {
  const displayName =
    player.isEphemeral && player.username === 'Anonymous'
      ? 'Anonymous'
      : player.username

  const secondaryContent = formatSecondaryContent(hasHistory, headToHead, lastMatch)

  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-base-200 active:bg-base-300 focus-visible:outline-2 focus-visible:outline-primary transition-colors min-h-[56px]"
      onClick={() => onSelect(player.id)}
    >
      <PlayerAvatar player={player} />

      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{displayName}</div>
        <div className="text-sm text-base-content/60 truncate">
          {secondaryContent}
        </div>
      </div>
    </button>
  )
}

export default PlayerRow
