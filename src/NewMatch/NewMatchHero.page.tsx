import { render, screen } from '@testing-library/react'
import NewMatchHero from './NewMatchHero'

export const newMatchHeroPage = {
  render() {
    render(<NewMatchHero />)
  },

  get heading() {
    return screen.getByRole('heading', { name: 'New match', level: 1 })
  },

  get description() {
    return screen.getByText(
      'Choose a player to log a result, or use Quick Match to start now.'
    )
  },
}
