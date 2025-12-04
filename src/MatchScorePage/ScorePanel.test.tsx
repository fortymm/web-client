import { describe, it, expect, vi } from 'vitest'
import { scorePanelPage } from './ScorePanel.page'

describe('ScorePanel', () => {
  it('displays the player name', () => {
    scorePanelPage.render({ playerName: 'Alice' })
    expect(scorePanelPage.getPlayerNameElement()).toHaveTextContent('Alice')
  })

  it('displays the score', () => {
    scorePanelPage.render({ score: 7 })
    expect(scorePanelPage.score).toHaveTextContent('7')
  })

  it('shows serving indicator when player is serving', () => {
    scorePanelPage.render({ isServing: true })
    expect(scorePanelPage.servingIndicator).toBeInTheDocument()
  })

  it('hides serving indicator when player is not serving', () => {
    scorePanelPage.render({ isServing: false })
    expect(scorePanelPage.servingIndicator).not.toBeInTheDocument()
  })

  it('shows tap to score hint when enabled', () => {
    scorePanelPage.render({ disabled: false })
    expect(scorePanelPage.tapToScoreHint).toBeInTheDocument()
  })

  it('hides tap to score hint when disabled', () => {
    scorePanelPage.render({ disabled: true })
    expect(scorePanelPage.tapToScoreHint).not.toBeInTheDocument()
  })

  it('calls onTap when tapped', async () => {
    const onTap = vi.fn()
    scorePanelPage.render({ onTap })

    await scorePanelPage.tap()

    expect(onTap).toHaveBeenCalledOnce()
  })

  it('has accessible label for screen readers', () => {
    scorePanelPage.render({ playerName: 'Bob' })
    expect(scorePanelPage.getButtonForPlayer('Bob')).toBeInTheDocument()
  })
})
