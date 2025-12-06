import { render, screen } from '@testing-library/react'
import NoSearchResultsEmptyState from './NoSearchResultsEmptyState'

interface RenderOptions {
  query?: string
}

export const noSearchResultsEmptyStatePage = {
  render(options: RenderOptions = {}) {
    const { query = 'test' } = options
    render(<NoSearchResultsEmptyState query={query} />)
  },

  get container() {
    return screen.getByTestId('no-search-results-empty-state')
  },

  queryContainer() {
    return screen.queryByTestId('no-search-results-empty-state')
  },

  get emoji() {
    return screen.getByText('🔍')
  },

  getTitle(query: string) {
    return screen.getByRole('heading', {
      level: 3,
      name: `No players found for "${query}"`,
    })
  },

  get description() {
    return screen.getByText('Try a different search term or check the spelling.')
  },
}
