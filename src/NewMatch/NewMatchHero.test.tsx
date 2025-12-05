import { describe, it, expect } from 'vitest'
import { newMatchHeroPage } from './NewMatchHero.page'

describe('NewMatchHero', () => {
  it('displays the page heading', () => {
    newMatchHeroPage.render()
    expect(newMatchHeroPage.heading).toBeInTheDocument()
    expect(newMatchHeroPage.heading).toHaveTextContent('New match')
  })

  it('has correct heading level for accessibility', () => {
    newMatchHeroPage.render()
    expect(newMatchHeroPage.heading.tagName).toBe('H1')
  })

  describe('when user has recent players', () => {
    it('displays description with "Choose a player" option', () => {
      newMatchHeroPage.render({ hasRecentPlayers: true })
      expect(newMatchHeroPage.descriptionText).toBe(
        'Choose a player, search, or start a Quick Match.'
      )
    })
  })

  describe('when user has no recent players', () => {
    it('displays description without "Choose a player" option', () => {
      newMatchHeroPage.render({ hasRecentPlayers: false })
      expect(newMatchHeroPage.descriptionText).toBe(
        'Search for a player or start a Quick Match.'
      )
    })
  })
})
