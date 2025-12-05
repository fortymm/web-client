import { render, screen } from '@testing-library/react'
import MatchDetailSkeleton from './MatchDetailSkeleton'

export const matchDetailSkeletonPage = {
  render() {
    render(<MatchDetailSkeleton />)
  },

  get container() {
    return screen.getByTestId('match-detail-skeleton')
  },
}
