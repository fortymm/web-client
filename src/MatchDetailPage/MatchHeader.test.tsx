import { describe, it, expect } from 'vitest'
import { matchHeaderPage } from './MatchHeader.page'
import { pendingMatch, completedMatch } from './mockMatchDetails'

describe('MatchHeader', () => {
  it('displays title with both player names when known', () => {
    matchHeaderPage.render({
      participants: completedMatch.participants,
      status: 'completed',
    })
    expect(matchHeaderPage.title).toHaveTextContent(/Alex Johnson vs David Park/i)
  })

  it('displays Opponent TBD when opponent is placeholder', () => {
    matchHeaderPage.render({
      participants: pendingMatch.participants,
      status: 'pending',
    })
    expect(matchHeaderPage.title).toHaveTextContent(/Alex Johnson vs Opponent TBD/i)
  })

  it('displays format in subtitle', () => {
    matchHeaderPage.render({
      format: 'singles',
      matchLength: 5,
    })
    expect(matchHeaderPage.querySubtitle(/Best of 5/)).toBeInTheDocument()
    expect(matchHeaderPage.querySubtitle(/Singles/)).toBeInTheDocument()
  })

  it('displays doubles format in subtitle', () => {
    matchHeaderPage.render({
      format: 'doubles',
      matchLength: 3,
    })
    expect(matchHeaderPage.querySubtitle(/Best of 3/)).toBeInTheDocument()
    expect(matchHeaderPage.querySubtitle(/Doubles/)).toBeInTheDocument()
  })

  it('shows Start scoring button for pending match', () => {
    matchHeaderPage.render({ status: 'pending' })
    expect(matchHeaderPage.primaryActionButton).toHaveTextContent('Start scoring')
  })

  it('shows Resume scoring button for in_progress match', () => {
    matchHeaderPage.render({ status: 'in_progress' })
    expect(matchHeaderPage.primaryActionButton).toHaveTextContent('Resume scoring')
  })

  it('shows View scorecard button for completed match', () => {
    matchHeaderPage.render({ status: 'completed' })
    expect(matchHeaderPage.primaryActionButton).toHaveTextContent('View scorecard')
  })

  it('shows back link when context is provided', () => {
    matchHeaderPage.render({
      context: [
        {
          id: 'tournament-1',
          type: 'tournament',
          name: 'Winter Open',
          url: '/tournaments/tournament-1',
        },
      ],
    })
    expect(matchHeaderPage.container).toBeInTheDocument()
  })
})
