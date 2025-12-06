import { render, screen } from '@testing-library/react'
import SearchLoadingPlaceholder from './SearchLoadingPlaceholder'

export const searchLoadingPlaceholderPage = {
  render() {
    render(<SearchLoadingPlaceholder />)
  },

  get container() {
    return screen.getByRole('status', { name: 'Searching for players' })
  },

  queryContainer() {
    return screen.queryByRole('status', { name: 'Searching for players' })
  },

  get spinner() {
    return this.container.querySelector('.loading-spinner')
  },
}
