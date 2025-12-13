import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, type Mock } from 'vitest'
import UpdateFlash from '@lib/UpdateFlash'
import { FlashTestWrapper } from '../test/FlashTestWrapper'

let mockNeedRefresh = false
let mockRefresh: Mock

vi.mock('../useServiceWorkerUpdate', () => ({
  useServiceWorkerUpdate: () => ({
    needRefresh: mockNeedRefresh,
    refresh: mockRefresh,
  }),
}))

export const updateFlashPage = {
  setNeedRefresh(value: boolean) {
    mockNeedRefresh = value
  },

  resetMocks() {
    mockNeedRefresh = false
    mockRefresh = vi.fn()
  },

  getMockRefresh() {
    return mockRefresh
  },

  render() {
    render(
      <FlashTestWrapper>
        <UpdateFlash />
      </FlashTestWrapper>
    )
  },

  get alert() {
    return screen.queryByRole('alert')
  },

  get refreshButton() {
    return screen.queryByRole('button', { name: 'Refresh' })
  },

  get dismissButton() {
    return screen.queryByRole('button', { name: 'Dismiss' })
  },

  async clickRefresh() {
    const button = this.refreshButton
    if (button) {
      await userEvent.click(button)
    }
  },

  async clickDismiss() {
    const button = this.dismissButton
    if (button) {
      await userEvent.click(button)
    }
  },
}

// Initialize mocks
updateFlashPage.resetMocks()
