import { describe, it, expect } from 'vitest'
import { participantCardPage } from './ParticipantCard.page'

describe('ParticipantCard', () => {
  it('displays participant name', () => {
    participantCardPage.render({
      participant: {
        id: 'player-001',
        name: 'Alex Johnson',
        avatarUrl: null,
        rating: 1800,
        ratingChange: null,
        isYou: false,
        isPlaceholder: false,
        isWinner: null,
      },
    })

    expect(participantCardPage.card).toBeInTheDocument()
  })

  it('shows (you) badge when isYou is true', () => {
    participantCardPage.render({
      participant: {
        id: 'player-001',
        name: 'Alex Johnson',
        avatarUrl: null,
        rating: 1800,
        ratingChange: null,
        isYou: true,
        isPlaceholder: false,
        isWinner: null,
      },
    })

    expect(participantCardPage.queryYouBadge()).toBeInTheDocument()
  })

  it('does not show (you) badge when isYou is false', () => {
    participantCardPage.render({
      participant: {
        id: 'player-001',
        name: 'Alex Johnson',
        avatarUrl: null,
        rating: 1800,
        ratingChange: null,
        isYou: false,
        isPlaceholder: false,
        isWinner: null,
      },
    })

    expect(participantCardPage.queryYouBadge()).not.toBeInTheDocument()
  })

  it('shows Winner badge when highlighted and is winner', () => {
    participantCardPage.render({
      participant: {
        id: 'player-001',
        name: 'Alex Johnson',
        avatarUrl: null,
        rating: 1800,
        ratingChange: 12,
        isYou: false,
        isPlaceholder: false,
        isWinner: true,
      },
      isWinnerHighlighted: true,
    })

    expect(participantCardPage.queryWinnerBadge()).toBeInTheDocument()
  })

  it('does not show Winner badge when not highlighted', () => {
    participantCardPage.render({
      participant: {
        id: 'player-001',
        name: 'Alex Johnson',
        avatarUrl: null,
        rating: 1800,
        ratingChange: 12,
        isYou: false,
        isPlaceholder: false,
        isWinner: true,
      },
      isWinnerHighlighted: false,
    })

    expect(participantCardPage.queryWinnerBadge()).not.toBeInTheDocument()
  })

  it('displays rating when provided', () => {
    participantCardPage.render({
      participant: {
        id: 'player-001',
        name: 'Alex Johnson',
        avatarUrl: null,
        rating: 1850,
        ratingChange: null,
        isYou: false,
        isPlaceholder: false,
        isWinner: null,
      },
    })

    expect(participantCardPage.queryRating()).toBeInTheDocument()
  })

  it('displays positive rating change with plus sign', () => {
    participantCardPage.render({
      participant: {
        id: 'player-001',
        name: 'Alex Johnson',
        avatarUrl: null,
        rating: 1862,
        ratingChange: 12,
        isYou: false,
        isPlaceholder: false,
        isWinner: true,
      },
    })

    expect(participantCardPage.queryRatingChange(12)).toBeInTheDocument()
  })

  it('displays negative rating change', () => {
    participantCardPage.render({
      participant: {
        id: 'player-001',
        name: 'David Park',
        avatarUrl: null,
        rating: 1895,
        ratingChange: -12,
        isYou: false,
        isPlaceholder: false,
        isWinner: false,
      },
    })

    expect(participantCardPage.queryRatingChange(-12)).toBeInTheDocument()
  })

  it('displays placeholder state correctly', () => {
    participantCardPage.render({
      participant: {
        id: 'player-tbd',
        name: 'Opponent to be assigned',
        avatarUrl: null,
        rating: null,
        ratingChange: null,
        isYou: false,
        isPlaceholder: true,
        isWinner: null,
      },
    })

    expect(participantCardPage.card).toBeInTheDocument()
    expect(participantCardPage.queryRating()).not.toBeInTheDocument()
  })
})
