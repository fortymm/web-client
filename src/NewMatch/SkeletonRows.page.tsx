import { render, screen } from '@testing-library/react'
import SkeletonRows from './SkeletonRows'

interface RenderOptions {
  count?: number
}

export const skeletonRowsPage = {
  render(options: RenderOptions = {}) {
    render(<SkeletonRows count={options.count} />)
  },

  get container() {
    return screen.getByRole('status', { name: 'Loading recent players' })
  },

  queryContainer() {
    return screen.queryByRole('status', { name: 'Loading recent players' })
  },

  get rows() {
    const container = this.container
    return Array.from(container.querySelectorAll(':scope > div'))
  },

  get rowCount() {
    return this.rows.length
  },

  getRowByIndex(index: number) {
    return this.rows[index]
  },

  getAvatarSkeleton(rowIndex: number) {
    const row = this.getRowByIndex(rowIndex)
    return row?.querySelector('.skeleton.rounded-full')
  },

  getNameSkeleton(rowIndex: number) {
    const row = this.getRowByIndex(rowIndex)
    const textContainer = row?.querySelector('.flex-1')
    return textContainer?.querySelector('.h-4')
  },

  getSecondaryLineSkeleton(rowIndex: number) {
    const row = this.getRowByIndex(rowIndex)
    const textContainer = row?.querySelector('.flex-1')
    return textContainer?.querySelector('.h-3')
  },
}
