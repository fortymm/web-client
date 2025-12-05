import { describe, it, expect } from 'vitest'
import { matchStatusPillPage } from './MatchStatusPill.page'

describe('MatchStatusPill', () => {
  it('displays pending status', () => {
    matchStatusPillPage.render({ status: 'pending' })
    expect(matchStatusPillPage.getByStatus('pending')).toBeInTheDocument()
  })

  it('displays scheduled status', () => {
    matchStatusPillPage.render({ status: 'scheduled' })
    expect(matchStatusPillPage.getByStatus('scheduled')).toBeInTheDocument()
  })

  it('displays in_progress status', () => {
    matchStatusPillPage.render({ status: 'in_progress' })
    expect(matchStatusPillPage.getByStatus('in_progress')).toBeInTheDocument()
  })

  it('displays completed status', () => {
    matchStatusPillPage.render({ status: 'completed' })
    expect(matchStatusPillPage.getByStatus('completed')).toBeInTheDocument()
  })

  it('displays cancelled status', () => {
    matchStatusPillPage.render({ status: 'cancelled' })
    expect(matchStatusPillPage.getByStatus('cancelled')).toBeInTheDocument()
  })

  it('has proper accessibility role', () => {
    matchStatusPillPage.render({ status: 'completed' })
    expect(matchStatusPillPage.pill).toHaveAttribute('role', 'status')
  })
})
