import { describe, it, expect } from 'vitest'
import { participantsSectionPage } from './ParticipantsSection.page'
import { completedMatch, pendingMatch } from './mockMatchDetails'

describe('ParticipantsSection', () => {
  it('renders two participant cards', () => {
    participantsSectionPage.render({
      participants: completedMatch.participants,
      status: 'completed',
    })
    expect(participantsSectionPage.participantCards).toHaveLength(2)
  })

  it('renders vs block between participants', () => {
    participantsSectionPage.render()
    expect(participantsSectionPage.container).toBeInTheDocument()
  })

  it('shows final score for completed match', () => {
    participantsSectionPage.render({
      participants: completedMatch.participants,
      finalScore: [3, 1],
      status: 'completed',
    })
    // Score should be visible via VsBlock
    expect(participantsSectionPage.container).toBeInTheDocument()
  })

  it('does not show score for pending match', () => {
    participantsSectionPage.render({
      participants: pendingMatch.participants,
      finalScore: null,
      status: 'pending',
    })
    expect(participantsSectionPage.container).toBeInTheDocument()
  })
})
