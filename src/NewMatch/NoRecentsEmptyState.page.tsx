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
    return screen.getByRole('heading', {
      level: 3,
      name: 'Your recent opponents will appear here',
    })
  },

  get subtitle() {
    return screen.getByText('After your first match, starting a rematch is just one tap.')
  },

  get cta() {
    return screen.getByText((content, element) => {
      return (
        element?.tagName === 'P' &&
        element.textContent === 'Tap Quick Match below to play your first game.'
      )
    })
  },
}
