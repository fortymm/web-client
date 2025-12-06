import { describe, it, expect } from 'vitest'
import { searchLoadingPlaceholderPage } from './SearchLoadingPlaceholder.page'

describe('SearchLoadingPlaceholder', () => {
  it('renders a loading spinner', () => {
    searchLoadingPlaceholderPage.render()

    expect(searchLoadingPlaceholderPage.container).toBeInTheDocument()
    expect(searchLoadingPlaceholderPage.spinner).toBeInTheDocument()
  })

  it('has accessible status role', () => {
    searchLoadingPlaceholderPage.render()

    expect(searchLoadingPlaceholderPage.container).toHaveAttribute(
      'aria-label',
      'Searching for players'
    )
  })
})
