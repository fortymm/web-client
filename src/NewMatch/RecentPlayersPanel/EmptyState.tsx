import type { FC } from 'react'
import SectionHeader from '../SectionHeader'
import NoRecentsEmptyState from '../NoRecentsEmptyState'

export interface EmptyStateData {
  state: 'empty'
}

export type EmptyStateProps = EmptyStateData & {
  onSelectPlayer: (playerId: string) => void
}

const EmptyState: FC<EmptyStateProps> = () => {
  return (
    <>
      <SectionHeader title="RECENT OPPONENTS" isLoading={false} />
      <div className="mx-4 rounded-lg border border-base-300 bg-base-200/30">
        <NoRecentsEmptyState />
      </div>
    </>
  )
}

export default EmptyState
