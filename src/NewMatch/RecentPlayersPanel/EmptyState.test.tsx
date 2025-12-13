import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { emptyStatePage } from './EmptyState.page'

describe('EmptyState', () => {
  it('shows empty state', () => {
    emptyStatePage.render()

    expect(emptyStatePage.emptyState.title).toBeInTheDocument()
  })

  it('shows header with RECENT OPPONENTS title', () => {
    emptyStatePage.render()

    expect(emptyStatePage.header).toBeInTheDocument()
    expect(emptyStatePage.header).toHaveTextContent('RECENT OPPONENTS')
  })

  it('does not show loading spinner in header', () => {
    emptyStatePage.render()

    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
  })

  it('displays correct empty state message', () => {
    emptyStatePage.render()

    expect(emptyStatePage.emptyState.title).toHaveTextContent(
      'Your recent opponents will appear here'
    )
    expect(emptyStatePage.emptyState.cta).toBeInTheDocument()
  })

  it('does not show player list', () => {
    emptyStatePage.render()

    expect(screen.queryByTestId('player-list')).not.toBeInTheDocument()
  })

  it('does not show skeleton', () => {
    emptyStatePage.render()

    expect(emptyStatePage.isShowingSkeleton).toBe(false)
  })

  it('does not show error card', () => {
    emptyStatePage.render()

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
