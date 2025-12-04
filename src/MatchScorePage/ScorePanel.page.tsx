import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ScorePanel from './ScorePanel'

interface RenderOptions {
  label?: string
  score?: number
  isServing?: boolean
  isWinner?: boolean
  onTap?: () => void
}

export const scorePanelPage = {
  render(options: RenderOptions = {}) {
    const {
      label = 'You',
      score = 0,
      isServing = false,
      isWinner = false,
      onTap = vi.fn(),
    } = options

    render(
      <ScorePanel
        label={label}
        score={score}
        isServing={isServing}
        isWinner={isWinner}
        onTap={onTap}
      />
    )

    return { onTap }
  },

  get button() {
    return screen.getByRole('button')
  },

  getButtonForPlayer(label: string) {
    return screen.getByRole('button', { name: new RegExp(`Add point to ${label}`, 'i') })
  },

  get score() {
    return screen.getByText(/^\d+$/)
  },

  get label() {
    return screen.getByText(/you|opponent/i)
  },

  get servingIndicator() {
    return screen.queryByLabelText('Serving')
  },

  async tap() {
    await userEvent.click(this.button)
  },
}
