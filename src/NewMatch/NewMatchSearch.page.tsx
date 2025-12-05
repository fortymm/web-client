import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import NewMatchSearch from './NewMatchSearch'

interface RenderOptions {
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
}

export const newMatchSearchPage = {
  render(options: RenderOptions = {}) {
    const {
      value = '',
      onChange = vi.fn(),
      onClear = vi.fn(),
    } = options

    render(
      <NewMatchSearch
        value={value}
        onChange={onChange}
        onClear={onClear}
      />
    )

    return { onChange, onClear }
  },

  get container() {
    return this.input.closest('div')?.parentElement
  },

  get input() {
    return screen.getByRole('searchbox', { name: 'Search players' })
  },

  get placeholder() {
    return screen.getByPlaceholderText('Search players…')
  },

  queryClearButton() {
    return screen.queryByRole('button', { name: 'Clear search' })
  },

  get clearButton() {
    return screen.getByRole('button', { name: 'Clear search' })
  },

  async type(text: string) {
    const user = userEvent.setup()
    await user.type(this.input, text)
  },

  async clear() {
    const user = userEvent.setup()
    await user.click(this.clearButton)
  },
}
