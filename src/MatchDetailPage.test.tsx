import { describe, it, expect } from 'vitest'
import { matchDetailPagePage } from './MatchDetailPage.page'

describe('MatchDetailPage', () => {
  it('renders the heading with the match id', () => {
    matchDetailPagePage.render('123')

    expect(matchDetailPagePage.heading).toBeInTheDocument()
    expect(matchDetailPagePage.headingText).toBe('Match 123')
  })

  it('displays different match ids correctly', () => {
    matchDetailPagePage.render('456')

    expect(matchDetailPagePage.headingText).toBe('Match 456')
  })

  it('handles string ids', () => {
    matchDetailPagePage.render('abc-def')

    expect(matchDetailPagePage.headingText).toBe('Match abc-def')
  })
})
