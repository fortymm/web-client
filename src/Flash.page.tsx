import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Flash from './Flash'
import { FlashTestWrapper } from './test/FlashTestWrapper'
import { flashStateRef } from './test/flashStateRef'
import type { ShowFlashOptions } from './useFlash'

export const flashPage = {
  render() {
    render(
      <FlashTestWrapper>
        <Flash />
      </FlashTestWrapper>
    )
  },

  getFlashState() {
    return flashStateRef.current
  },

  showFlash(message: string, options?: ShowFlashOptions) {
    return flashStateRef.current?.showFlash(message, options)
  },

  get alerts() {
    return screen.queryAllByRole('alert')
  },

  getAlertByText(text: string) {
    return screen.getByRole('alert', { name: new RegExp(text) })
  },

  queryAlertByText(text: string) {
    return screen.queryByRole('alert', { name: new RegExp(text) })
  },

  get dismissButtons() {
    return screen.queryAllByRole('button', { name: 'Dismiss' })
  },

  getDismissButtonForAlert(index: number) {
    return this.dismissButtons[index]
  },

  async dismissAlert(index: number) {
    const button = this.getDismissButtonForAlert(index)
    if (button) {
      await userEvent.click(button)
    }
  },
}
