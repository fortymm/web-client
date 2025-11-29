import { describe, it, expect } from 'vitest'
import { quickMatchButtonPage } from './QuickMatchButton.page'

describe('QuickMatchButton', () => {
  it('displays the quick match button', () => {
    quickMatchButtonPage.render()
    expect(quickMatchButtonPage.button).toBeInTheDocument()
  })

  it('has correct styling', () => {
    quickMatchButtonPage.render()
    expect(quickMatchButtonPage.button).toHaveClass('btn', 'btn-primary')
  })

  it('has correct text', () => {
    quickMatchButtonPage.render()
    expect(quickMatchButtonPage.button).toHaveTextContent('Quick Match')
  })
})
