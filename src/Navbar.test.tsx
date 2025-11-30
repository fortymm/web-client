import { describe, it, expect } from 'vitest'
import { navbarPage } from './Navbar.page'

describe('Navbar', () => {
  it('renders the navigation element', () => {
    navbarPage.render()
    expect(navbarPage.navbar).toBeInTheDocument()
  })

  it('renders the brand link', () => {
    navbarPage.render()
    expect(navbarPage.brandLink).toBeInTheDocument()
  })

  it('displays the correct brand text', () => {
    navbarPage.render()
    expect(navbarPage.brandText).toBe('FortyMM')
  })

  it('links to the home page', () => {
    navbarPage.render()
    expect(navbarPage.brandHref).toBe('/')
  })

  it('renders the user menu button', () => {
    navbarPage.render()
    expect(navbarPage.userMenuButton).toBeInTheDocument()
  })

  it('has appearance link in user menu', () => {
    navbarPage.render()
    expect(navbarPage.appearanceLink).toBeInTheDocument()
  })

  it('appearance link points to settings page', () => {
    navbarPage.render()
    expect(navbarPage.appearanceLink).toHaveAttribute('href', '/settings/appearance')
  })
})
