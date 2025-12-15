import { expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AccountSettings from './AccountSettings'
import { TestQueryProvider } from './test/utils'
import { FlashTestWrapper } from './test/FlashTestWrapper'
import { flashStateRef } from './test/flashStateRef'

export const accountSettingsPage = {
  render() {
    render(
      <MemoryRouter>
        <TestQueryProvider>
          <FlashTestWrapper>
            <AccountSettings />
          </FlashTestWrapper>
        </TestQueryProvider>
      </MemoryRouter>
    )
  },

  async waitForLoaded() {
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Username' })).toBeInTheDocument()
    })
  },

  get heading() {
    return screen.getByRole('heading', { name: 'Account settings' })
  },

  get usernameInput() {
    return screen.getByRole('textbox', { name: 'Username' })
  },

  async fillUsername(value: string) {
    const input = this.usernameInput
    await userEvent.clear(input)
    if (value) {
      await userEvent.type(input, value)
    }
  },

  get saveButton() {
    return screen.getByRole('button', { name: /save changes/i })
  },

  async clickSave() {
    await userEvent.click(this.saveButton)
  },

  // Flash state access
  getFlashState() {
    return flashStateRef.current
  },

  get flashes() {
    return flashStateRef.current?.flashes ?? []
  },

  getLatestFlash() {
    const flashes = this.flashes
    return flashes[flashes.length - 1] ?? null
  },

  get usernameError() {
    return screen.getByText('Username is required')
  },

  queryUsernameError() {
    return screen.queryByText('Username is required')
  },

  getUsernameErrorByText(text: string) {
    return screen.getByText(text)
  },

  queryUsernameErrorByText(text: string) {
    return screen.queryByText(text)
  },

  get skeleton() {
    return document.querySelector('.skeleton')
  },

  querySkeleton() {
    return document.querySelector('.skeleton')
  },
}
