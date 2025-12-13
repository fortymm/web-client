import type { FC } from 'react'
import SectionHeader from '../SectionHeader'
import SkeletonRows from '../SkeletonRows'

export interface LoadingStateData {
  state: 'loading'
}

export type LoadingStateProps = LoadingStateData & {
  onSelectPlayer: (playerId: string) => void
}

const LoadingState: FC<LoadingStateProps> = () => {
  return (
    <>
      <SectionHeader title="RECENT OPPONENTS" isLoading={false} />
      <SkeletonRows count={6} />
    </>
  )
}

export default LoadingState
