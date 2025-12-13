import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { successStatePage } from './SuccessState.page'

describe('SuccessState', () => {
  it('shows header with RECENT OPPONENTS title', () => {
    successStatePage.render()

    expect(successStatePage.header).toBeInTheDocument()
    expect(successStatePage.header).toHaveTextContent('RECENT OPPONENTS')
  })

  it('does not show skeleton rows', () => {
    successStatePage.render()

    expect(successStatePage.isShowingSkeleton).toBe(false)
  })

  it('shows player list', () => {
    successStatePage.render()

    expect(successStatePage.list).toBeInTheDocument()
  })

  it('displays all players', () => {
    successStatePage.render()

    expect(successStatePage.playerRows).toHaveLength(2)
  })

  it('shows loading spinner in header when refetching', () => {
    successStatePage.render({ isRefetching: true })

    expect(successStatePage.loadingSpinner).toBeInTheDocument()
  })

  it('does not show loading spinner when not refetching', () => {
    successStatePage.render({ isRefetching: false })

    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
  })

  it('still shows player list when refetching', () => {
    successStatePage.render({ isRefetching: true })

    expect(successStatePage.list).toBeInTheDocument()
  })

  it('calls onSelectPlayer when clicking a player', async () => {
    const onSelectPlayer = vi.fn()
    successStatePage.render({ onSelectPlayer })

    await successStatePage.clickPlayerByIndex(0)

    expect(onSelectPlayer).toHaveBeenCalledWith('player-1')
  })

  it('passes correct playerId when clicking different players', async () => {
    const onSelectPlayer = vi.fn()
    successStatePage.render({ onSelectPlayer })

    await successStatePage.clickPlayerByIndex(1)

    expect(onSelectPlayer).toHaveBeenCalledWith('player-2')
  })
})
