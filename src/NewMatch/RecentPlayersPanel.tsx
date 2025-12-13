import { type FC } from 'react'
import LoadingState, {
  type LoadingStateData,
} from './RecentPlayersPanel/LoadingState'
import ErrorState, {
  type ErrorStateData,
} from './RecentPlayersPanel/ErrorState'
import EmptyState, {
  type EmptyStateData,
} from './RecentPlayersPanel/EmptyState'
import SuccessState, {
  type SuccessStateData,
} from './RecentPlayersPanel/SuccessState'

type RecentPlayersPanelData =
  | LoadingStateData
  | ErrorStateData
  | EmptyStateData
  | SuccessStateData

export type RecentPlayersPanelProps = RecentPlayersPanelData & {
  onSelectPlayer: (playerId: string) => void
}

const RecentPlayersPanel: FC<RecentPlayersPanelProps> = (props) => {
  if (props.state === 'loading') {
    return <LoadingState {...props} />
  }

  if (props.state === 'error') {
    return <ErrorState {...props} />
  }

  if (props.state === 'empty') {
    return <EmptyState {...props} />
  }

  return <SuccessState {...props} />
}

export default RecentPlayersPanel
