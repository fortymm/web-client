import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { loadingStatePage } from './LoadingState.page'

describe('LoadingState', () => {
  it('shows skeleton rows', () => {
    loadingStatePage.render()

    expect(loadingStatePage.isShowingSkeleton).toBe(true)
  })

  it('shows header with RECENT OPPONENTS title', () => {
    loadingStatePage.render()

    expect(loadingStatePage.header).toBeInTheDocument()
    expect(loadingStatePage.header).toHaveTextContent('RECENT OPPONENTS')
  })

  it('does not show loading spinner in header', () => {
    loadingStatePage.render()

    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
  })

  it('renders 6 skeleton rows', () => {
    loadingStatePage.render()

    expect(loadingStatePage.skeletonRows.queryContainer()).toBeInTheDocument()
  })
})
