import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'
import { ThemeProvider } from './lib/ThemeProvider'

export const navbarPage = {
  render() {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </ThemeProvider>
    )
  },

  get navbar() {
    return screen.getByRole('navigation')
  },

  get brandLink() {
    return screen.getByRole('link', { name: 'FortyMM' })
  },

  get brandText() {
    return navbarPage.brandLink.textContent
  },

  get brandHref() {
    return navbarPage.brandLink.getAttribute('href')
  },

  async clickBrand() {
    await userEvent.click(navbarPage.brandLink)
  },

  get userMenuButton() {
    return screen.getByRole('button', { name: 'User menu' })
  },

  async openUserMenu() {
    await userEvent.click(navbarPage.userMenuButton)
  },

  get appearanceLink() {
    return screen.getByRole('link', { name: /appearance/i })
  },
}
