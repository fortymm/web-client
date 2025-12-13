import { render } from '@testing-library/react'
import { vi } from 'vitest'
import LoadingState from './LoadingState'
import { sectionHeaderPage } from '../SectionHeader.page'
import { skeletonRowsPage } from '../SkeletonRows.page'

interface RenderOptions {
  onSelectPlayer?: (playerId: string) => void
}

export const loadingStatePage = {
  render(options: RenderOptions = {}) {
    const onSelectPlayer = options.onSelectPlayer ?? vi.fn()

    render(<LoadingState state="loading" onSelectPlayer={onSelectPlayer} />)

    return { onSelectPlayer }
  },

  get header() {
    return sectionHeaderPage.recentOpponentsHeader
  },

  get loadingSpinner() {
    return sectionHeaderPage.loadingSpinner
  },

  skeletonRows: skeletonRowsPage,

  get isShowingSkeleton() {
    return skeletonRowsPage.queryContainer() !== null
  },
}
