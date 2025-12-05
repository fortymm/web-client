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

    it('renders the CTA pointing to Quick Match button', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.cta).toBeInTheDocument()
    })

    it('has centered text styling', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.container).toHaveClass('text-center')
    })

    it('aligns content to top of container', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.container).not.toHaveClass('justify-center')
    })

    it('has compact vertical padding', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.container).toHaveClass('py-5')
    })
  })
})
