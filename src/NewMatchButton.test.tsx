import { describe, it, expect, vi } from 'vitest'
import { newMatchButtonPage } from './NewMatchButton.page'

describe('NewMatchButton', () => {
  it('renders the button', () => {
    newMatchButtonPage.render()
    expect(newMatchButtonPage.button).toBeInTheDocument()
  })

  it('displays "New match" text', () => {
    newMatchButtonPage.render()
    expect(newMatchButtonPage.button).toHaveTextContent('New match')
  })

  it('displays subtitle text', () => {
    newMatchButtonPage.render()
    expect(newMatchButtonPage.button).toHaveTextContent(
      'Log a result or Quick Match'
    )
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    newMatchButtonPage.render({ onClick })

    await newMatchButtonPage.click()

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders without onClick handler', () => {
    newMatchButtonPage.render()
    expect(newMatchButtonPage.button).toBeInTheDocument()
  })
})
