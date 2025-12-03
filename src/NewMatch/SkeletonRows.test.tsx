import { describe, it, expect } from 'vitest'
import { skeletonRowsPage } from './SkeletonRows.page'

describe('SkeletonRows', () => {
  it('renders default 6 rows', () => {
    skeletonRowsPage.render()
    expect(skeletonRowsPage.rowCount).toBe(6)
  })

  it('renders custom number of rows', () => {
    skeletonRowsPage.render({ count: 3 })
    expect(skeletonRowsPage.rowCount).toBe(3)
  })

  it('has aria-label for accessibility', () => {
    skeletonRowsPage.render()
    expect(skeletonRowsPage.container).toHaveAttribute(
      'aria-label',
      'Loading recent players'
    )
  })

  it('has role="status" for accessibility', () => {
    skeletonRowsPage.render()
    expect(skeletonRowsPage.container).toHaveAttribute('role', 'status')
  })

  describe('skeleton row structure', () => {
    it('has avatar skeleton with correct dimensions', () => {
      skeletonRowsPage.render()
      const avatarSkeleton = skeletonRowsPage.getAvatarSkeleton(0)
      expect(avatarSkeleton).toBeInTheDocument()
      expect(avatarSkeleton).toHaveClass('w-10', 'h-10', 'rounded-full')
    })

    it('has name line skeleton', () => {
      skeletonRowsPage.render()
      const nameSkeleton = skeletonRowsPage.getNameSkeleton(0)
      expect(nameSkeleton).toBeInTheDocument()
      expect(nameSkeleton).toHaveClass('skeleton', 'h-4', 'w-3/4')
    })

    it('has secondary line skeleton', () => {
      skeletonRowsPage.render()
      const secondaryLine = skeletonRowsPage.getSecondaryLineSkeleton(0)
      expect(secondaryLine).toBeInTheDocument()
      expect(secondaryLine).toHaveClass('skeleton', 'h-3', 'w-1/2')
    })

    it('has consistent padding matching PlayerRow', () => {
      skeletonRowsPage.render()
      const row = skeletonRowsPage.getRowByIndex(0)
      expect(row).toHaveClass('px-4', 'py-3')
    })
  })
})
