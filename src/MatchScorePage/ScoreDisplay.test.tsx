import { describe, it, expect, vi } from 'vitest'
import { scoreDisplayPage } from './ScoreDisplay.page'

describe('ScoreDisplay', () => {
  it('displays both player panels', () => {
    scoreDisplayPage.render()
    expect(scoreDisplayPage.playerPanel).toBeInTheDocument()
    expect(scoreDisplayPage.opponentPanel).toBeInTheDocument()
  })

  it('displays player score', () => {
    scoreDisplayPage.render({ playerScore: 7 })
    expect(scoreDisplayPage.getPlayerScore()).toBe('7')
  })

  it('displays opponent score', () => {
    scoreDisplayPage.render({ opponentScore: 5 })
    expect(scoreDisplayPage.getOpponentScore()).toBe('5')
  })

  it('calls onPlayerScore when player panel is tapped', async () => {
    const onPlayerScore = vi.fn()
    scoreDisplayPage.render({ onPlayerScore })

    await scoreDisplayPage.tapPlayer()

    expect(onPlayerScore).toHaveBeenCalledOnce()
  })

  it('calls onOpponentScore when opponent panel is tapped', async () => {
    const onOpponentScore = vi.fn()
    scoreDisplayPage.render({ onOpponentScore })

    await scoreDisplayPage.tapOpponent()

    expect(onOpponentScore).toHaveBeenCalledOnce()
  })
})
