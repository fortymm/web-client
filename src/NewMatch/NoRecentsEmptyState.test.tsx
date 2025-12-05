import { describe, it, expect } from 'vitest'
import { noRecentsEmptyStatePage } from './NoRecentsEmptyState.page'

describe('NoRecentsEmptyState', () => {
  describe('rendering', () => {
    it('renders the ping pong emoji', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.emoji).toBeInTheDocument()
    })

    it('renders the title', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.title).toBeInTheDocument()
      expect(noRecentsEmptyStatePage.title).toHaveTextContent('No recent players yet')
    })

    it('renders the subtitle with guidance to use Quick Match', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.subtitle).toBeInTheDocument()
      expect(noRecentsEmptyStatePage.subtitle).toHaveTextContent(
        'Start a Quick Match to play your first game'
      )
    })

    it('has centered text styling', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.container).toHaveClass('text-center')
    })

    it('has appropriate vertical padding', () => {
      noRecentsEmptyStatePage.render()
      expect(noRecentsEmptyStatePage.container).toHaveClass('py-12')
    })
  })
})
