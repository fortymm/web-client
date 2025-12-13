import { render } from '@testing-library/react'
import { vi } from 'vitest'
import ErrorState from './ErrorState'
import { sectionHeaderPage } from '../SectionHeader.page'
import { skeletonRowsPage } from '../SkeletonRows.page'
import { recentsErrorCardPage } from '../RecentsErrorCard.page'

interface RenderOptions {
  onRetry?: () => Promise<void> | void
  retryCount?: number
  onSelectPlayer?: (playerId: string) => void
}

export const errorStatePage = {
  render(options: RenderOptions = {}) {
    const onRetry = options.onRetry ?? vi.fn()
    const retryCount = options.retryCount ?? 0
    const onSelectPlayer = options.onSelectPlayer ?? vi.fn()

    render(
      <ErrorState
        state="error"
        onRetry={onRetry}
        retryCount={retryCount}
        onSelectPlayer={onSelectPlayer}
      />
    )

    return { onRetry, onSelectPlayer }
  },

  get header() {
    return sectionHeaderPage.recentOpponentsHeader
  },

  get loadingSpinner() {
    return sectionHeaderPage.loadingSpinner
  },

  errorCard: recentsErrorCardPage,

  get isShowingSkeleton() {
    return skeletonRowsPage.queryContainer() !== null
  },
}
