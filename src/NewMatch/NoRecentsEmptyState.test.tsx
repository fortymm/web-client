import { describe, it, expect } from 'vitest'
import { noRecentsEmptyStatePage } from './NoRecentsEmptyState.page'

describe('NoRecentsEmptyState', () => {
  describe('rendering', () => {
    it('renders the ping pong emoji', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.emoji).toBeInTheDocument()
    })

    it('renders the title explaining future value', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.title).toBeInTheDocument()
      expect(noRecentsEmptyStatePage.title).toHaveTextContent(
        'Your recent opponents will appear here'
      )
    })

    it('renders the subtitle explaining the benefit', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.subtitle).toBeInTheDocument()
      expect(noRecentsEmptyStatePage.subtitle).toHaveTextContent(
        'After your first match, starting a rematch is just one tap.'
      )
    })

    it('has centered text styling', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.container).toHaveClass('text-center')
    })

    it('has compact vertical padding', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.container).toHaveClass('py-6')
    })
  })
})
