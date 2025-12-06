import { render, screen } from '@testing-library/react'
import SearchLoadingPlaceholder from './SearchLoadingPlaceholder'

export const searchLoadingPlaceholderPage = {
  render() {
    render(<SearchLoadingPlaceholder />)
  },

  get spinner() {
    return screen.getByLabelText('Loading search results')
  },

  querySpinner() {
    return screen.queryByLabelText('Loading search results')
  },
}
