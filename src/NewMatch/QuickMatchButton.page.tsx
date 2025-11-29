import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuickMatchButton from './QuickMatchButton'

export const quickMatchButtonPage = {
  render() {
    render(<QuickMatchButton />)
  },

  get button() {
    return screen.getByRole('button', { name: 'Quick Match' })
  },

  async click() {
    await userEvent.click(quickMatchButtonPage.button)
  },
}
