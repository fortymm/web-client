import { render, screen } from '@testing-library/react'
import MatchLengthControl from './MatchLengthControl'

export const matchLengthControlPage = {
  render() {
    render(<MatchLengthControl />)
  },

  get control() {
    return screen.getByText('Match length control placeholder')
  },
}
