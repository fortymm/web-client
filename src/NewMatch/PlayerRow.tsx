import { type FC } from 'react'
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
  isLoading?: boolean
}

function formatSecondaryText(
  hasHistory: boolean,
  headToHead?: { wins: number; losses: number },
  lastMatch?: { result: 'win' | 'loss'; score: string; playedAt: string }
): string {
  if (!hasHistory) {
    return 'No matches yet'
  }

  if (!headToHead || !lastMatch) {
    return 'No matches yet'
  }

  const record = `${headToHead.wins}-${headToHead.losses}`
  const resultText = lastMatch.result === 'win' ? 'Won' : 'Lost'
  const timeAgo = formatRelativeTime(lastMatch.playedAt)

  return `${record} · Last: ${resultText} ${lastMatch.score} · ${timeAgo}`
}

const PlayerRow: FC<PlayerRowProps> = ({
  player,
  headToHead,
  lastMatch,
  hasHistory,
  onSelect,
  isLoading = false,
}) => {
  const displayName =
    player.isEphemeral && player.username === 'Anonymous'
      ? 'Anonymous'
      : player.username

  const secondaryText = formatSecondaryText(hasHistory, headToHead, lastMatch)

  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-base-200 active:bg-base-300 focus-visible:outline-2 focus-visible:outline-primary transition-colors min-h-[56px]"
      onClick={() => onSelect(player.id)}
      disabled={isLoading}
    >
      <PlayerAvatar player={player} />

      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{displayName}</div>
        <div className="text-sm text-base-content/60 truncate">
          {secondaryText}
        </div>
      </div>

      {isLoading && (
        <span className="loading loading-spinner loading-sm" />
      )}
    </button>
  )
}

export default PlayerRow
