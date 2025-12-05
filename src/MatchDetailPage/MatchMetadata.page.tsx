import { render, screen } from '@testing-library/react'
import MatchMetadata, { type MatchMetadataProps } from './MatchMetadata'

const defaultProps: MatchMetadataProps = {
  format: 'singles',
  matchLength: 5,
  location: null,
  timestamps: {
    created: '2025-12-05T10:00:00Z',
    scheduled: null,
    started: null,
    completed: null,
  },
}

export const matchMetadataPage = {
  render(options: Partial<MatchMetadataProps> = {}) {
    const props: MatchMetadataProps = {
      ...defaultProps,
      ...options,
    }
    render(<MatchMetadata {...props} />)
    return props
  },

  get container() {
    return screen.getByTestId('match-metadata')
  },

  get heading() {
    return screen.getByText('Match Details')
  },

  queryFormat() {
    return screen.queryByText(/Best of \d+ • (Singles|Doubles) match/i)
  },

  queryLocation(name: string) {
    return screen.queryByText(name)
  },

  queryTableNumber(num: number) {
    return screen.queryByText(`Table ${num}`)
  },

  queryNotAssigned() {
    return screen.queryByText('Not assigned')
  },

  queryNotScheduled() {
    return screen.queryByText('Not scheduled')
  },
}
