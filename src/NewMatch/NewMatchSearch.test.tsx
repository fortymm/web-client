import { describe, it, expect } from 'vitest'
import { newMatchSearchPage } from './NewMatchSearch.page'

describe('NewMatchSearch', () => {
  it('displays the search placeholder', () => {
    newMatchSearchPage.render()
    expect(newMatchSearchPage.placeholder).toBeInTheDocument()
  })

  it('has the search container', () => {
    newMatchSearchPage.render()
    expect(newMatchSearchPage.container).toBeInTheDocument()
  })

  describe('disabled state', () => {
    it('shows offline badge when disabled', () => {
      newMatchSearchPage.render({ disabled: true })
      expect(newMatchSearchPage.offlineBadge).toBeInTheDocument()
    })

    it('does not show offline badge when enabled', () => {
      newMatchSearchPage.render({ disabled: false })
      expect(newMatchSearchPage.queryOfflineBadge()).not.toBeInTheDocument()
    })

    it('applies disabled styling when disabled', () => {
      newMatchSearchPage.render({ disabled: true })
      expect(newMatchSearchPage.container).toHaveClass('opacity-50', 'cursor-not-allowed')
    })
  })
})
