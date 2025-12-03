import { render, screen } from '@testing-library/react'
import NewMatchSearch from './NewMatchSearch'

interface RenderOptions {
  disabled?: boolean
}

export const newMatchSearchPage = {
  render(options: RenderOptions = {}) {
    const { disabled = false } = options
    render(<NewMatchSearch disabled={disabled} />)
  },

  get container() {
    return screen.getByText('Search players…').closest('div')
  },

  get placeholder() {
    return screen.getByText('Search players…')
  },

  get offlineBadge() {
    return screen.getByText('Offline')
  },

  queryOfflineBadge() {
    return screen.queryByText('Offline')
  },
}
