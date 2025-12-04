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
    return screen.getByText(/choose a player/i)
  },

  get descriptionText() {
    return this.description.textContent
  },
}
