import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { ctaPanelPage } from './CTAPanel.page'

describe('CTAPanel', () => {
  it('renders children content', () => {
    ctaPanelPage.render(
      <div>
        <button>Action Button</button>
        <p>Some text</p>
      </div>
    )

    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    expect(screen.getByText('Some text')).toBeInTheDocument()
  })

  it('applies fixed positioning classes', () => {
    ctaPanelPage.render(<div>Content</div>)

    const panel = ctaPanelPage.panel
    expect(panel).toHaveClass('fixed', 'bottom-0', 'inset-x-0', 'z-40')
  })

  it('applies background and border styling', () => {
    ctaPanelPage.render(<div>Content</div>)

    const panel = ctaPanelPage.panel
    expect(panel).toHaveClass('bg-base-100', 'border-t', 'border-base-200')
  })

  it('applies responsive padding and safe area insets', () => {
    ctaPanelPage.render(<div>Content</div>)

    const panel = ctaPanelPage.panel
    expect(panel).toHaveClass('pb-[env(safe-area-inset-bottom)]')
  })

  it('renders multiple children', () => {
    ctaPanelPage.render(
      <>
        <button>First Button</button>
        <button>Second Button</button>
        <button>Third Button</button>
      </>
    )

    expect(screen.getByRole('button', { name: 'First Button' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Second Button' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Third Button' })).toBeInTheDocument()
  })
})
