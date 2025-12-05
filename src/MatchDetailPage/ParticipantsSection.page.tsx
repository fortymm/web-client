import { render, screen } from '@testing-library/react'
import ParticipantsSection, { type ParticipantsSectionProps } from './ParticipantsSection'
import { participantCardPage } from './ParticipantCard.page'
import { vsBlockPage } from './VsBlock.page'
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

  get participantCards() {
    return screen.getAllByTestId('participant-card')
  },

  // Delegate to child page objects
  participantCard: participantCardPage,
  vsBlock: vsBlockPage,
}
