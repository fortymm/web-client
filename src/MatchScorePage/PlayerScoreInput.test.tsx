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

  it('increments score when clicking plus button', async () => {
    const { onChange } = playerScoreInputPage.render({ value: '5' })

    await playerScoreInputPage.clickIncrement()

    expect(onChange).toHaveBeenCalledWith('6')
  })

  it('decrements score when clicking minus button', async () => {
    const { onChange } = playerScoreInputPage.render({ value: '5' })

    await playerScoreInputPage.clickDecrement()

    expect(onChange).toHaveBeenCalledWith('4')
  })

  it('does not decrement below zero', async () => {
    playerScoreInputPage.render({ value: '0' })

    expect(playerScoreInputPage.decrementButton).toBeDisabled()
  })

  it('increments from empty to 1', async () => {
    const { onChange } = playerScoreInputPage.render({ value: '' })

    await playerScoreInputPage.clickIncrement()

    expect(onChange).toHaveBeenCalledWith('1')
  })

  it('displays error message when provided', () => {
    playerScoreInputPage.render({ error: 'Enter a score' })

    expect(playerScoreInputPage.errorMessage).toHaveTextContent('Enter a score')
  })

  it('applies error styling to input when error is present', () => {
    playerScoreInputPage.render({ error: 'Enter a score' })

    expect(playerScoreInputPage.input).toHaveClass('input-error')
  })

  it('disables input and buttons when disabled', () => {
    playerScoreInputPage.render({ disabled: true, value: '5' })

    expect(playerScoreInputPage.input).toBeDisabled()
    expect(playerScoreInputPage.incrementButton).toBeDisabled()
    expect(playerScoreInputPage.decrementButton).toBeDisabled()
  })

  it('has accessible labels for stepper buttons', () => {
    playerScoreInputPage.render({ playerName: 'Bob' })

    expect(
      playerScoreInputPage.getDecrementButtonFor('Bob')
    ).toBeInTheDocument()
    expect(
      playerScoreInputPage.getIncrementButtonFor('Bob')
    ).toBeInTheDocument()
  })

  it('sets aria-invalid when error is present', () => {
    playerScoreInputPage.render({ error: 'Invalid score' })

    expect(playerScoreInputPage.input).toHaveAttribute('aria-invalid', 'true')
  })
})
