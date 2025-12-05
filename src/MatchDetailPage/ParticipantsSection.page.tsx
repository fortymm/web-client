import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ParticipantsSection, { type ParticipantsSectionProps } from './ParticipantsSection'
import { completedMatch } from './mockMatchDetails'

const defaultProps: ParticipantsSectionProps = {
  participants: completedMatch.participants,
  finalScore: completedMatch.finalScore,
  status: 'completed',
}

export const participantsSectionPage = {
  render(options: Partial<ParticipantsSectionProps> = {}) {
    const props: ParticipantsSectionProps = {
      ...defaultProps,
      ...options,
    }
    render(<ParticipantsSection {...props} />)
    return props
  },

  get container() {
    return screen.getByTestId('participants-section')
  },

  get participantRows() {
    return screen.getAllByTestId('participant-row')
  },

  queryYouBadge() {
    return screen.queryByText('(you)')
  },

  queryWinnerBadge() {
    return screen.queryByText('Winner')
  },

  queryAssignOpponentButton() {
    return screen.queryByTestId('assign-opponent-button')
  },

  async clickAssignOpponent() {
    const button = screen.getByTestId('assign-opponent-button')
    await userEvent.click(button)
  },
}
