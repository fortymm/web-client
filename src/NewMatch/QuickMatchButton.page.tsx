import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import QuickMatchButton from './QuickMatchButton'

interface RenderOptions {
  onClick?: () => void
  disabled?: boolean
}

export const quickMatchButtonPage = {
  render(options: RenderOptions = {}) {
    const { onClick = vi.fn(), disabled = false } = options

    render(<QuickMatchButton onClick={onClick} disabled={disabled} />)

    return { onClick }
  },

  get button() {
    return screen.getByRole('button', { name: /Quick Match/i })
  },

  get mainText() {
    return screen.getByText(/Quick Match/i)
  },

  get boltIcon() {
    return screen.getByRole('button').querySelector('svg')
  },

  get subtitle() {
    return screen.getByText(/start now/i)
  },

  get subtitleText() {
    return this.subtitle.textContent
  },

  async click() {
    await userEvent.click(this.button)
  },
}
