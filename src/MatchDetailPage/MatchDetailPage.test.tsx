import { describe, it, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { matchDetailPagePage } from './MatchDetailPage.page'

describe('MatchDetailPage', () => {
  it('shows skeleton while loading', () => {
    matchDetailPagePage.render()
    expect(matchDetailPagePage.querySkeleton()).toBeInTheDocument()
  })

  it('shows content after loading', async () => {
    matchDetailPagePage.render()

    await waitFor(() => {
      expect(matchDetailPagePage.querySkeleton()).not.toBeInTheDocument()
    })

    expect(matchDetailPagePage.queryPage()).toBeInTheDocument()
  })

  it('shows error state when error param is set', async () => {
    matchDetailPagePage.render({ searchParams: 'error=true' })

    await waitFor(() => {
      expect(matchDetailPagePage.queryError()).toBeInTheDocument()
    })
  })

  it('loads completed variant by default', async () => {
    matchDetailPagePage.render()

    await waitFor(() => {
      expect(matchDetailPagePage.queryPage()).toBeInTheDocument()
    })
  })

  it('loads pending variant when specified', async () => {
    matchDetailPagePage.render({ searchParams: 'variant=pending' })

    await waitFor(() => {
      expect(matchDetailPagePage.queryPage()).toBeInTheDocument()
    })
  })

  it('loads in_progress variant when specified', async () => {
    matchDetailPagePage.render({ searchParams: 'variant=in_progress' })

    await waitFor(() => {
      expect(matchDetailPagePage.queryPage()).toBeInTheDocument()
    })
  })
})
