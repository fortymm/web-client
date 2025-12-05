import { describe, it, expect } from 'vitest'
import { matchDetailSkeletonPage } from './MatchDetailSkeleton.page'

describe('MatchDetailSkeleton', () => {
  it('renders skeleton container', () => {
    matchDetailSkeletonPage.render()
    expect(matchDetailSkeletonPage.container).toBeInTheDocument()
  })

  it('has animate-pulse class for loading effect', () => {
    matchDetailSkeletonPage.render()
    expect(matchDetailSkeletonPage.container).toHaveClass('animate-pulse')
  })
})
