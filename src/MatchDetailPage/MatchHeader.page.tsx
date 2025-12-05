import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MatchHeader, { type MatchHeaderProps } from './MatchHeader'
import { matchStatusPillPage } from './MatchStatusPill.page'
import { completedMatch } from './mockMatchDetails'

const defaultProps: MatchHeaderProps = {
  participants: completedMatch.participants,
  status: 'completed',
  format: 'singles',
  matchLength: 5,
  context: [],
  matchId: 'match-123',
}

export const matchHeaderPage = {
  render(options: Partial<MatchHeaderProps> = {}) {
    const props: MatchHeaderProps = {
      ...defaultProps,
      ...options,
    }
    render(
      <MemoryRouter>
        <MatchHeader {...props} />
      </MemoryRouter>
    )
    return props
  },

  get container() {
    return screen.getByTestId('match-header')
  },

  get title() {
    return screen.getByRole('heading', { level: 1 })
  },

  querySubtitle(text: string) {
    return screen.queryByText(text)
  },

  get primaryActionButton() {
    return screen.getByRole('link', { name: /Start scoring|Resume scoring|View scorecard/i })
  },

  // Delegate to status pill page object
  statusPill: matchStatusPillPage,
}
