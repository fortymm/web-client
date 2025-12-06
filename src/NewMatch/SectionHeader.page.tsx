import { render, screen } from '@testing-library/react'
import SectionHeader from './SectionHeader'

export const sectionHeaderPage = {
  render(title: 'RECENT PLAYERS' | 'SEARCH RESULTS' = 'RECENT PLAYERS', isLoading?: boolean) {
    render(<SectionHeader title={title} isLoading={isLoading} />)
  },

  get recentPlayersHeader() {
    return screen.getByRole('heading', { name: 'RECENT PLAYERS', level: 2 })
  },

  get searchResultsHeader() {
    return screen.getByRole('heading', { name: 'SEARCH RESULTS', level: 2 })
  },

  get loadingSpinner() {
    return screen.getByLabelText('Loading')
  },
}
