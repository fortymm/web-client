import { render, screen } from '@testing-library/react'
import VsBlock, { type VsBlockProps } from './VsBlock'

export const vsBlockPage = {
  render(options: Partial<VsBlockProps> = {}) {
    const props: VsBlockProps = {
      finalScore: options.finalScore ?? null,
      isCompleted: options.isCompleted ?? false,
    }
    render(<VsBlock {...props} />)
    return props
  },

  get container() {
    return screen.getByTestId('vs-block')
  },

  get vsLabel() {
    return screen.getByText('vs')
  },

  queryFinalScore() {
    return screen.queryByText(/Final:/i)
  },

  getFinalScore(score1: number, score2: number) {
    return screen.getByText(`Final: ${score1}–${score2}`)
  },
}
