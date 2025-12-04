import { describe, it, expect, vi } from 'vitest'
import { scorePanelPage } from './ScorePanel.page'

describe('ScorePanel', () => {
  it('displays the player label', () => {
    scorePanelPage.render({ label: 'You' })
    expect(scorePanelPage.label).toHaveTextContent('You')
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

  it('calls onTap when tapped', async () => {
    const onTap = vi.fn()
    scorePanelPage.render({ onTap })

    await scorePanelPage.tap()

    expect(onTap).toHaveBeenCalledOnce()
  })

  it('has accessible label for screen readers', () => {
    scorePanelPage.render({ label: 'Opponent' })
    expect(scorePanelPage.getButtonForPlayer('Opponent')).toBeInTheDocument()
  })
})
