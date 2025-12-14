import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import UserMenu from './UserMenu'

export const userMenuPage = {
  render() {
    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>
    )
  },

  get menuButton() {
    return screen.getByRole('button', { name: 'User menu' })
  },

  async openMenu() {
    await userEvent.click(userMenuPage.menuButton)
  },

  get accountLink() {
    return screen.getByRole('link', { name: /account/i })
  },

  get accountHref() {
    return userMenuPage.accountLink.getAttribute('href')
  },

  get appearanceLink() {
    return screen.getByRole('link', { name: /appearance/i })
  },

  get appearanceHref() {
    return userMenuPage.appearanceLink.getAttribute('href')
  },
}
