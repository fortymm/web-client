import { describe, it, expect } from 'vitest'
import { matchLengthControlPage } from './MatchLengthControl.page'

describe('MatchLengthControl', () => {
  it('displays the match length control placeholder', () => {
    matchLengthControlPage.render()
    expect(matchLengthControlPage.control).toBeInTheDocument()
  })
})
