import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MatchList from './MatchList'
import { type StoredMatch } from './lib/matchesDb'

export function createTestMatch(overrides: Partial<StoredMatch> = {}): StoredMatch {
  return {
    id: 'test-match-123',
    playerId: 'player-1',
    opponentId: 'player-2',
    matchLength: 5,
    status: 'in_progress',
    games: [],
    winnerId: null,
    createdAt: new Date(),
    ...overrides,
  }
}

export const matchListPage = {
  render(matches: StoredMatch[]) {
    render(
      <MemoryRouter>
        <MatchList matches={matches} />
      </MemoryRouter>
    )
  },

  get inProgressSection() {
    return screen.queryByRole('heading', { name: /in progress/i })?.closest('section')
  },

  get recentMatchesSection() {
    return screen.queryByRole('heading', { name: /recent matches/i })?.closest('section')
  },

  get matchCards() {
    return screen.getAllByRole('link')
  },

  getMatchCard(matchId: string) {
    return screen.getByRole('link', { name: new RegExp(matchId, 'i') })
  },

  getMatchCardByScore(player1Score: number, player2Score: number) {
    const cards = screen.getAllByRole('link')
    return cards.find((card) => {
      const text = card.textContent
      return text?.includes(String(player1Score)) && text?.includes(String(player2Score))
    })
  },

  get inProgressBadges() {
    return screen.getAllByText(/in progress/i)
  },

  get wonBadges() {
    return screen.queryAllByText('Won')
  },

  get lostBadges() {
    return screen.queryAllByText('Lost')
  },

  getProgressBar(card: HTMLElement) {
    return within(card).queryByRole('progressbar')
  },
}
