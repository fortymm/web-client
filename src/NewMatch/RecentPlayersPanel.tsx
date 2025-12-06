import { type FC } from 'react'
import SectionHeader from './SectionHeader'
import SkeletonRows from './SkeletonRows'
import PlayerList from './PlayerList'
import RecentsErrorCard from './RecentsErrorCard'
import NoRecentsEmptyState from './NoRecentsEmptyState'
import { type PlayerResult } from '../hooks/usePlayerResults'

export interface RecentPlayersPanelProps {
  isInitialLoading: boolean
  isRefetching: boolean
  hasError: boolean
  players: PlayerResult[] | null
  onSelectPlayer: (playerId: string) => void
  onRetry: () => Promise<void> | void
  retryCount: number
}

const RecentPlayersPanel: FC<RecentPlayersPanelProps> = ({
  isInitialLoading,
  isRefetching,
  hasError,
  players,
  onSelectPlayer,
  onRetry,
  retryCount,
}) => {
  if (isInitialLoading) {
    return (
      <>
        <SectionHeader title="RECENT OPPONENTS" isLoading={false} />
        <SkeletonRows count={6} />
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <SectionHeader title="RECENT OPPONENTS" isLoading={false} />
        <RecentsErrorCard onRetry={onRetry} retryCount={retryCount} />
      </>
    )
  }

  if (players === null) {
    return null
  }

  if (players.length === 0) {
    return (
      <>
        <SectionHeader title="RECENT OPPONENTS" isLoading={false} />
        <div className="mx-4 rounded-lg border border-base-300 bg-base-200/30">
          <NoRecentsEmptyState />
        </div>
      </>
    )
  }

  return (
    <>
      <SectionHeader title="RECENT OPPONENTS" isLoading={isRefetching} />
      <PlayerList
        players={players}
        context="recents"
        onSelectPlayer={onSelectPlayer}
      />
    </>
  )
}

export default RecentPlayersPanel
