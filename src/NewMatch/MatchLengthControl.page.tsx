import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import MatchLengthControl, { type MatchLength } from './MatchLengthControl'

interface RenderOptions {
  value?: MatchLength
  onChange?: (value: MatchLength) => void
  disabled?: boolean
}

export const matchLengthControlPage = {
  render(options: RenderOptions = {}) {
    const {
      value = 5,
      onChange = vi.fn(),
      disabled = false,
    } = options
    render(
      <MatchLengthControl
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    )
    return { onChange }
  },

  get label() {
    return screen.getByText('Match length')
  },

  get group() {
    return screen.getByRole('group', { name: 'Match length selection' })
  },

  get allRadios() {
    return screen.getAllByRole('radio')
  },

  get allButtons() {
    return screen.getAllByText(/^Best of \d$/).map((span) => span.closest('label')!)
  },

  getRadio(length: MatchLength) {
    return screen.getByRole('radio', { name: `Best of ${length}` })
  },

  getButton(length: MatchLength) {
    return screen.getByText(`Best of ${length}`).closest('label')!
  },

  async selectLength(length: MatchLength) {
    await userEvent.click(this.getRadio(length))
  },
}
