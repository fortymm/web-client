import { describe, it, expect } from 'vitest'
import { matchDetailPagePage } from './MatchDetailPage.page'

describe('MatchDetailPage (integration)', () => {
  it('shows skeleton while loading', () => {
    matchDetailPagePage.render('123')

    expect(matchDetailPagePage.querySkeleton()).toBeInTheDocument()
  })

  it('renders match detail page after loading', async () => {
    matchDetailPagePage.render('123')

    await matchDetailPagePage.waitForContent()

    expect(matchDetailPagePage.queryPage()).toBeInTheDocument()
    expect(matchDetailPagePage.heading).toBeInTheDocument()
  })

  it('displays title for completed match variant', async () => {
    matchDetailPagePage.render('123', 'variant=completed')

    await matchDetailPagePage.waitForContent()

    // The completed match shows "Player A vs Player B"
    expect(matchDetailPagePage.headingText).toContain('vs')
  })
})
