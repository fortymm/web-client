import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'

export const navbarPage = {
  render() {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
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
}
