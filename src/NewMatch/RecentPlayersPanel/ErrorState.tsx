import type { FC } from 'react'
import SectionHeader from '../SectionHeader'
import RecentsErrorCard from '../RecentsErrorCard'

export interface ErrorStateData {
  state: 'error'
  onRetry: () => Promise<void> | void
  retryCount: number
}

export type ErrorStateProps = ErrorStateData & {
  onSelectPlayer: (playerId: string) => void
}

const ErrorState: FC<ErrorStateProps> = ({ onRetry, retryCount }) => {
  return (
    <>
      <SectionHeader title="RECENT OPPONENTS" isLoading={false} />
      <RecentsErrorCard onRetry={onRetry} retryCount={retryCount} />
    </>
  )
}

export default ErrorState
