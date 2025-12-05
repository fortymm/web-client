import { render, screen } from '@testing-library/react'
import ParticipantCard, { type ParticipantCardProps } from './ParticipantCard'
import { type Participant } from './mockMatchDetails'

const defaultParticipant: Participant = {
  id: 'player-001',
  name: 'Test Player',
  avatarUrl: null,
  rating: 1800,
  ratingChange: null,
  isYou: false,
  isPlaceholder: false,
  isWinner: null,
}

export const participantCardPage = {
  render(options: Partial<ParticipantCardProps> = {}) {
    const props: ParticipantCardProps = {
      participant: options.participant ?? defaultParticipant,
      isWinnerHighlighted: options.isWinnerHighlighted ?? false,
    }
    render(<ParticipantCard {...props} />)
    return props
  },

  get card() {
    return screen.getByTestId('participant-card')
  },

  get name() {
    return screen.getByText(/Test Player|Alex Johnson|Marcus Chen|Sarah Williams|David Park|Emma Rodriguez|Opponent to be assigned/i)
  },

  queryYouBadge() {
    return screen.queryByText('(you)')
  },

  queryWinnerBadge() {
    return screen.queryByText('Winner')
  },

  queryRating() {
    return screen.queryByText(/Rating:/i)
  },

  queryRatingChange(value: number) {
    const sign = value > 0 ? '+' : ''
    return screen.queryByText(`${sign}${value}`)
  },
}
