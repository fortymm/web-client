import { describe, it, expect } from 'vitest'
import { sectionHeaderPage } from './SectionHeader.page'

describe('SectionHeader', () => {
  it('displays the recent opponents section header', () => {
    sectionHeaderPage.render()
    expect(sectionHeaderPage.recentOpponentsHeader).toBeInTheDocument()
  })

  it('has correct heading level for accessibility', () => {
    sectionHeaderPage.render()
    expect(sectionHeaderPage.recentOpponentsHeader.tagName).toBe('H2')
  })
})
