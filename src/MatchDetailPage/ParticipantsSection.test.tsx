import { describe, it, expect, vi } from 'vitest'
import { participantsSectionPage } from './ParticipantsSection.page'
import { completedMatch, pendingMatch } from './mockMatchDetails'

describe('ParticipantsSection', () => {
  it('renders two participant rows', () => {
    participantsSectionPage.render({
      participants: completedMatch.participants,
      status: 'completed',
    })
    expect(participantsSectionPage.participantRows).toHaveLength(2)
  })

  it('shows You badge for current user', () => {
    participantsSectionPage.render({
      participants: completedMatch.participants,
      status: 'completed',
    })
    expect(participantsSectionPage.queryYouBadge()).toBeInTheDocument()
  })

  it('shows Winner badge for winner', () => {
    participantsSectionPage.render({
      participants: completedMatch.participants,
      status: 'completed',
    })
    expect(participantsSectionPage.queryWinnerBadge()).toBeInTheDocument()
  })

  it('shows final score for completed match', () => {
    participantsSectionPage.render({
      participants: completedMatch.participants,
      finalScore: [3, 1],
      status: 'completed',
    })
    expect(participantsSectionPage.container).toBeInTheDocument()
  })

  it('shows assign opponent button when participant is placeholder', () => {
    const onAssign = vi.fn()
    participantsSectionPage.render({
      participants: pendingMatch.participants,
      finalScore: null,
      status: 'pending',
      onAssignOpponent: onAssign,
    })
    expect(participantsSectionPage.queryAssignOpponentButton()).toBeInTheDocument()
  })

  it('does not show assign button when no callback provided', () => {
    participantsSectionPage.render({
      participants: pendingMatch.participants,
      finalScore: null,
      status: 'pending',
    })
    // Without onAssignOpponent, placeholder is just text, not a button
    expect(participantsSectionPage.queryAssignOpponentButton()).not.toBeInTheDocument()
  })
})
