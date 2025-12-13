import type { FC } from 'react'
import SectionHeader from '../SectionHeader'
import PlayerList from '../PlayerList'
import { type Opponent } from '../../hooks/useOpponents'

export interface SuccessStateData {
  state: 'success'
  players: Opponent[]
  isRefetching: boolean
}

export type SuccessStateProps = SuccessStateData & {
  onSelectPlayer: (playerId: string) => void
}

const SuccessState: FC<SuccessStateProps> = ({
  players,
  isRefetching,
  onSelectPlayer,
}) => {
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

export default SuccessState
