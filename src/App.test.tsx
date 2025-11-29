import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the counter button', () => {
    render(<App />)
    expect(screen.getByRole('button')).toHaveTextContent('count is 0')
  })

  it('increments the count when clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(button).toHaveTextContent('count is 1')
  })
})
