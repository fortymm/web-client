import { render } from '@testing-library/react'
import { vi } from 'vitest'
import EmptyState from './EmptyState'
import { sectionHeaderPage } from '../SectionHeader.page'
import { skeletonRowsPage } from '../SkeletonRows.page'
import { noRecentsEmptyStatePage } from '../NoRecentsEmptyState.page'

interface RenderOptions {
  onSelectPlayer?: (playerId: string) => void
}

export const emptyStatePage = {
  render(options: RenderOptions = {}) {
    const onSelectPlayer = options.onSelectPlayer ?? vi.fn()

    render(<EmptyState state="empty" onSelectPlayer={onSelectPlayer} />)

    return { onSelectPlayer }
  },

  get header() {
    return sectionHeaderPage.recentOpponentsHeader
  },

  get loadingSpinner() {
    return sectionHeaderPage.loadingSpinner
  },

  emptyState: noRecentsEmptyStatePage,

  get isShowingSkeleton() {
    return skeletonRowsPage.queryContainer() !== null
  },
}
