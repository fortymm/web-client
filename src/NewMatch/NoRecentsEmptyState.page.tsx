import { render, screen } from '@testing-library/react'
import NoRecentsEmptyState from './NoRecentsEmptyState'

export const noRecentsEmptyStatePage = {
  render() {
    render(<NoRecentsEmptyState />)
  },

  get container() {
    return screen.getByTestId('no-recents-empty-state')
  },

  get emoji() {
    return screen.getByText('🏓')
  },

  get title() {
    return screen.getByRole('heading', { level: 3, name: 'No recent players yet' })
  },

  get subtitle() {
    return screen.getByText('Start a Quick Match to play your first game')
  },
}
