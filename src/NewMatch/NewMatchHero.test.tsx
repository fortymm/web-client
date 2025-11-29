import { describe, it, expect } from 'vitest'
import { newMatchHeroPage } from './NewMatchHero.page'

describe('NewMatchHero', () => {
  it('displays the page heading', () => {
    newMatchHeroPage.render()
    expect(newMatchHeroPage.heading).toBeInTheDocument()
    expect(newMatchHeroPage.heading).toHaveTextContent('New match')
  })

  it('displays the description', () => {
    newMatchHeroPage.render()
    expect(newMatchHeroPage.description).toBeInTheDocument()
  })

  it('has correct heading level for accessibility', () => {
    newMatchHeroPage.render()
    expect(newMatchHeroPage.heading.tagName).toBe('H1')
  })
})
