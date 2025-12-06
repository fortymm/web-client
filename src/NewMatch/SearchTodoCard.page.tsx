import { render, screen } from '@testing-library/react'
import SearchTodoCard from './SearchTodoCard'

export const searchTodoCardPage = {
  render() {
    render(<SearchTodoCard />)
  },

  get status() {
    return screen.getByRole('status')
  },

  get title() {
    return screen.getByText('Search results coming soon')
  },

  get subtitle() {
    return screen.getByText(/working on displaying player search results/i)
  },
}
