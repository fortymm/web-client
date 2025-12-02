import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewMatchButton } from './NewMatchButton'

type RenderOptions = {
  onClick?: () => void
}

export const newMatchButtonPage = {
  render(options: RenderOptions = {}) {
    render(<NewMatchButton onClick={options.onClick} />)
  },

  get button() {
    return screen.getByRole('button', { name: /new match/i })
  },

  async click() {
    await userEvent.click(this.button)
  },
}
