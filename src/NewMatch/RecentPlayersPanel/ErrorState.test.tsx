import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { errorStatePage } from './ErrorState.page'

describe('ErrorState', () => {
  it('shows error card', () => {
    errorStatePage.render()

    expect(errorStatePage.errorCard.alert).toBeInTheDocument()
  })

  it('shows header with RECENT OPPONENTS title', () => {
    errorStatePage.render()

    expect(errorStatePage.header).toBeInTheDocument()
    expect(errorStatePage.header).toHaveTextContent('RECENT OPPONENTS')
  })

  it('does not show loading spinner in header', () => {
    errorStatePage.render()

    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
  })

  it('does not show player list', () => {
    errorStatePage.render()

    expect(screen.queryByTestId('player-list')).not.toBeInTheDocument()
  })

  it('does not show skeleton', () => {
    errorStatePage.render()

    expect(errorStatePage.isShowingSkeleton).toBe(false)
  })

  it('passes retry count to error card', () => {
    errorStatePage.render({ retryCount: 3 })

    expect(errorStatePage.errorCard.alert).toBeInTheDocument()
  })
})
