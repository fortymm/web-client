import { type FC } from 'react'
import SectionHeader from './SectionHeader'
import SkeletonRows from './SkeletonRows'
import PlayerList from './PlayerList'
import RecentsErrorCard from './RecentsErrorCard'
import NoRecentsEmptyState from './NoRecentsEmptyState'
import { type RecentOpponent } from '../hooks/useRecentOpponents'

export interface RecentPlayersPanelProps {
  isInitialLoading: boolean
  isRefetching: boolean
  hasError: boolean
  players: RecentOpponent[] | null
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
        <SectionHeader title="RECENT PLAYERS" isLoading={false} />
        <SkeletonRows count={6} />
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <SectionHeader title="RECENT PLAYERS" isLoading={false} />
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
        <SectionHeader title="RECENT PLAYERS" isLoading={false} />
        <NoRecentsEmptyState />
      </>
    )
  }

  return (
    <>
      <SectionHeader title="RECENT PLAYERS" isLoading={isRefetching} />
      <PlayerList
        players={players}
        context="recents"
        onSelectPlayer={onSelectPlayer}
      />
    </>
  )
}

export default RecentPlayersPanel
