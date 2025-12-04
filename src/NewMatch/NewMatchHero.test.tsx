import { describe, it, expect } from 'vitest'
import { newMatchHeroPage } from './NewMatchHero.page'

describe('NewMatchHero', () => {
  it('displays the page heading', () => {
    newMatchHeroPage.render()
    expect(newMatchHeroPage.heading).toBeInTheDocument()
    expect(newMatchHeroPage.heading).toHaveTextContent('New match')
  })

  it('displays the default description', () => {
    newMatchHeroPage.render()
    expect(newMatchHeroPage.descriptionText).toBe(
      'Choose a player, search, or start a Quick Match.'
    )
  })

  it('displays error-aware description when recents fail', () => {
    newMatchHeroPage.render({ hasRecentsError: true })
    expect(newMatchHeroPage.descriptionText).toBe(
      "Search or start a Quick Match – your recent players aren't available right now."
    )
  })

  it('has correct heading level for accessibility', () => {
    newMatchHeroPage.render()
    expect(newMatchHeroPage.heading.tagName).toBe('H1')
  })
})
