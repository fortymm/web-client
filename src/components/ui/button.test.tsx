import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies variant and size data attributes', () => {
    render(
      <Button variant="primary" size="lg">
        Go
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Go' })
    expect(button).toHaveAttribute('data-variant', 'primary')
    expect(button).toHaveAttribute('data-size', 'lg')
  })

  it('fires onClick when activated', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Press</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Press' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
