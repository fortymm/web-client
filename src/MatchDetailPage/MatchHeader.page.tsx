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

  querySubtitle(text: string | RegExp) {
    // The subtitle is in a <p> element, use a more specific matcher
    const textMatcher = typeof text === 'string' ? text : text
    const elements = screen.queryAllByText(textMatcher)
    // Find the one that's a paragraph (subtitle) not a badge
    return elements.find((el) => el.tagName === 'P') ?? null
  },

  queryFormatBadge(format: 'Singles' | 'Doubles') {
    return screen.queryByText(format)
  },

  queryMatchLengthBadge(length: number) {
    return screen.queryByText(`Best of ${length}`)
  },

  get primaryActionButton() {
    return screen.getByRole('link', { name: /Start scoring|Resume scoring|View scorecard/i })
  },

  // Delegate to status pill page object
  statusPill: matchStatusPillPage,
}
