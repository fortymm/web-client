import { describe, it, expect } from 'vitest'
import { searchLoadingPlaceholderPage } from './SearchLoadingPlaceholder.page'

describe('SearchLoadingPlaceholder', () => {
  it('renders a loading spinner', () => {
    searchLoadingPlaceholderPage.render()
    expect(searchLoadingPlaceholderPage.spinner).toBeInTheDocument()
  })

  it('has accessible label for screen readers', () => {
    searchLoadingPlaceholderPage.render()
    expect(searchLoadingPlaceholderPage.spinner).toHaveAccessibleName(
      'Loading search results'
    )
  })
})
