import { render, screen } from '@testing-library/react'
import MatchStatusPill, { type MatchStatusPillProps } from './MatchStatusPill'
import { type MatchStatus } from './mockMatchDetails'

export const matchStatusPillPage = {
  render(options: Partial<MatchStatusPillProps> = {}) {
    const props: MatchStatusPillProps = {
      status: options.status ?? 'pending',
    }
    render(<MatchStatusPill {...props} />)
    return props
  },

  get pill() {
    return screen.getByTestId('match-status-pill')
  },

  getByStatus(status: MatchStatus) {
    const displayText = {
      pending: 'Pending',
      scheduled: 'Scheduled',
      in_progress: 'In progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }[status]
    return screen.getByText(displayText)
  },
}
