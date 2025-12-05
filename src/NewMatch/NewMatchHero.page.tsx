import { render, screen } from '@testing-library/react'
import NewMatchHero from './NewMatchHero'

interface RenderOptions {
  hasRecentPlayers?: boolean
}

export const newMatchHeroPage = {
  render(options: RenderOptions = {}) {
    const { hasRecentPlayers = true } = options
    render(<NewMatchHero hasRecentPlayers={hasRecentPlayers} />)
  },

  get heading() {
    return screen.getByRole('heading', { name: 'New match', level: 1 })
  },

  get description() {
    return screen.getByText(/search for a player|choose a player/i)
  },

  get descriptionText() {
    return this.description.textContent
  },
}
