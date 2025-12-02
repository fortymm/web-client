import { describe, it, expect } from 'vitest'
import { userMenuPage } from './UserMenu.page'

describe('UserMenu', () => {
  it('renders the menu button', () => {
    userMenuPage.render()
    expect(userMenuPage.menuButton).toBeInTheDocument()
  })

  it('has accessible label on button', () => {
    userMenuPage.render()
    expect(userMenuPage.menuButton).toHaveAccessibleName('User menu')
  })

  it('contains appearance link', () => {
    userMenuPage.render()
    expect(userMenuPage.appearanceLink).toBeInTheDocument()
  })

  it('appearance link points to settings page', () => {
    userMenuPage.render()
    expect(userMenuPage.appearanceHref).toBe('/settings/appearance')
  })
})
