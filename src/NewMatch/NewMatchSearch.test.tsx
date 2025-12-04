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
})
