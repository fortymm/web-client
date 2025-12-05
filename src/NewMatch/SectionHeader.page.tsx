import { render, screen } from '@testing-library/react'
import SectionHeader from './SectionHeader'

export const sectionHeaderPage = {
  render(title: 'RECENT OPPONENTS' | 'SEARCH RESULTS' = 'RECENT OPPONENTS', isLoading?: boolean) {
    render(<SectionHeader title={title} isLoading={isLoading} />)
  },

  get recentOpponentsHeader() {
    return screen.getByRole('heading', { name: 'RECENT OPPONENTS', level: 2 })
  },

  get searchResultsHeader() {
    return screen.getByRole('heading', { name: 'SEARCH RESULTS', level: 2 })
  },

  get loadingSpinner() {
    return screen.getByLabelText('Loading')
  },
}
