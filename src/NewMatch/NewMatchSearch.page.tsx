import { render, screen } from '@testing-library/react'
import NewMatchSearch from './NewMatchSearch'

export const newMatchSearchPage = {
  render() {
    render(<NewMatchSearch />)
  },

  get container() {
    return screen.getByText('Search players…').closest('div')
  },

  get placeholder() {
    return screen.getByText('Search players…')
  },
}
