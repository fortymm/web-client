import { describe, it, expect } from 'vitest'
import { noSearchResultsEmptyStatePage } from './NoSearchResultsEmptyState.page'

describe('NoSearchResultsEmptyState', () => {
  describe('rendering', () => {
    it('renders the search emoji', () => {
      noSearchResultsEmptyStatePage.render()
      expect(noSearchResultsEmptyStatePage.emoji).toBeInTheDocument()
    })

    it('renders the title with the search query', () => {
      noSearchResultsEmptyStatePage.render({ query: 'john' })
      expect(noSearchResultsEmptyStatePage.getTitle('john')).toBeInTheDocument()
      expect(noSearchResultsEmptyStatePage.getTitle('john')).toHaveTextContent(
        'No players found for "john"'
      )
    })

    it('renders the helpful description', () => {
      noSearchResultsEmptyStatePage.render()
      expect(noSearchResultsEmptyStatePage.description).toBeInTheDocument()
    })

    it('has centered text styling', () => {
      noSearchResultsEmptyStatePage.render()
      expect(noSearchResultsEmptyStatePage.container).toHaveClass('text-center')
    })

    it('has compact vertical padding', () => {
      noSearchResultsEmptyStatePage.render()
      expect(noSearchResultsEmptyStatePage.container).toHaveClass('py-5')
    })
  })
})
