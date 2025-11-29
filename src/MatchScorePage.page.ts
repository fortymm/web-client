import { screen } from '@testing-library/react'

export const matchScorePagePage = {
  get heading() {
    return screen.getByRole('heading', { name: /Score Match/i })
  },

  get matchId() {
    return screen.getByText(/Match ID:/i)
  },
}
