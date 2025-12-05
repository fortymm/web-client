import { describe, it, expect } from 'vitest'
import { vsBlockPage } from './VsBlock.page'

describe('VsBlock', () => {
  it('displays vs label', () => {
    vsBlockPage.render()
    expect(vsBlockPage.vsLabel).toBeInTheDocument()
  })

  it('does not show final score when match is not completed', () => {
    vsBlockPage.render({ isCompleted: false, finalScore: null })
    expect(vsBlockPage.queryFinalScore()).not.toBeInTheDocument()
  })

  it('shows final score when match is completed', () => {
    vsBlockPage.render({ isCompleted: true, finalScore: [3, 1] })
    expect(vsBlockPage.getFinalScore(3, 1)).toBeInTheDocument()
  })

  it('does not show score even if completed but score is null', () => {
    vsBlockPage.render({ isCompleted: true, finalScore: null })
    expect(vsBlockPage.queryFinalScore()).not.toBeInTheDocument()
  })
})
