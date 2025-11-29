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
})
