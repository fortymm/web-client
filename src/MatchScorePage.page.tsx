import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import MatchScorePage from './MatchScorePage'
import { gameScoreFormPage } from './MatchScorePage/GameScoreForm.page'

interface RenderOptions {
  matchId?: string
}

export const matchScorePagePage = {
  render(options: RenderOptions = {}) {
    const { matchId = 'test-match-123' } = options

    render(
      <MemoryRouter initialEntries={[`/matches/${matchId}/score`]}>
        <Routes>
          <Route path="/matches/:id/score" element={<MatchScorePage />} />
          <Route path="/matches/:id" element={<div data-testid="match-detail">Match Detail</div>} />
        </Routes>
      </MemoryRouter>
    )
  },

  get container() {
    return screen.getByRole('heading', { name: /enter score/i }).closest('div')
  },

  get matchDetailPage() {
    return screen.queryByTestId('match-detail')
  },

  // Delegate to GameScoreForm page object
  gameScoreForm: gameScoreFormPage,
}
