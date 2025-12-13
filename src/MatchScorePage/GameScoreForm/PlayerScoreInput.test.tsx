import { describe, it, expect } from 'vitest'
import { playerScoreInputPage } from './PlayerScoreInput.page'

describe('PlayerScoreInput', () => {
  it('renders player name as label', () => {
    playerScoreInputPage.render({ playerName: 'Alice' })

    expect(playerScoreInputPage.getInputFor('Alice')).toBeInTheDocument()
  })

  it('displays the current value', () => {
    playerScoreInputPage.render({ value: '11' })

    expect(playerScoreInputPage.input).toHaveValue('11')
  })

  it('shows placeholder 0 when empty', () => {
    playerScoreInputPage.render({ value: '' })

    expect(playerScoreInputPage.input).toHaveAttribute('placeholder', '0')
  })

  it('calls onChange when typing a score', async () => {
    const { onChange } = playerScoreInputPage.render({ value: '' })

    await playerScoreInputPage.typeScore('5')

    expect(onChange).toHaveBeenCalledWith('5')
  })

  it('filters out non-numeric characters', async () => {
    const { onChange } = playerScoreInputPage.render({ value: '' })

    await playerScoreInputPage.typeScore('1a2b3')

    expect(onChange).toHaveBeenLastCalledWith('3')
  })

  it('displays error message when provided', () => {
    playerScoreInputPage.render({ error: 'Enter a score' })

    expect(playerScoreInputPage.errorMessage).toHaveTextContent('Enter a score')
  })

  it('applies error styling to input when error is present', () => {
    playerScoreInputPage.render({ error: 'Enter a score' })

    expect(playerScoreInputPage.input).toHaveClass('input-error')
  })

  it('disables input when disabled', () => {
    playerScoreInputPage.render({ disabled: true, value: '5' })

    expect(playerScoreInputPage.input).toBeDisabled()
  })

  it('sets aria-invalid when error is present', () => {
    playerScoreInputPage.render({ error: 'Invalid score' })

    expect(playerScoreInputPage.input).toHaveAttribute('aria-invalid', 'true')
  })

  it('uses numeric input mode for mobile keyboards', () => {
    playerScoreInputPage.render()

    expect(playerScoreInputPage.input).toHaveAttribute('inputMode', 'numeric')
  })
})
