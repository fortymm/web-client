import { describe, it, expect, vi } from 'vitest'
import { newMatchSearchPage } from './NewMatchSearch.page'

describe('NewMatchSearch', () => {
  it('displays the search input', () => {
    newMatchSearchPage.render()
    expect(newMatchSearchPage.input).toBeInTheDocument()
  })

  it('displays the placeholder text', () => {
    newMatchSearchPage.render()
    expect(newMatchSearchPage.placeholder).toBeInTheDocument()
  })

  it('displays the current value', () => {
    newMatchSearchPage.render({ value: 'test query' })
    expect(newMatchSearchPage.input).toHaveValue('test query')
  })

  it('calls onChange when typing', async () => {
    const onChange = vi.fn()
    newMatchSearchPage.render({ onChange })

    await newMatchSearchPage.type('a')
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('does not show clear button when value is empty', () => {
    newMatchSearchPage.render({ value: '' })
    expect(newMatchSearchPage.queryClearButton()).not.toBeInTheDocument()
  })

  it('shows clear button when value is non-empty', () => {
    newMatchSearchPage.render({ value: 'test' })
    expect(newMatchSearchPage.queryClearButton()).toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', async () => {
    const onClear = vi.fn()
    newMatchSearchPage.render({ value: 'test', onClear })

    await newMatchSearchPage.clear()
    expect(onClear).toHaveBeenCalled()
  })

  it('focuses input after clear button is clicked', async () => {
    const onClear = vi.fn()
    newMatchSearchPage.render({ value: 'test', onClear })

    await newMatchSearchPage.clear()
    expect(newMatchSearchPage.input).toHaveFocus()
  })

  it('has correct input attributes for mobile optimization', () => {
    newMatchSearchPage.render()
    const input = newMatchSearchPage.input

    expect(input).toHaveAttribute('type', 'search')
    expect(input).toHaveAttribute('inputMode', 'search')
    expect(input).toHaveAttribute('enterKeyHint', 'search')
    expect(input).toHaveAttribute('autoComplete', 'off')
    expect(input).toHaveAttribute('autoCorrect', 'off')
    expect(input).toHaveAttribute('autoCapitalize', 'off')
    expect(input).toHaveAttribute('spellCheck', 'false')
  })
})
