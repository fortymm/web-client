import { expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AccountSettings from './AccountSettings'
import { TestQueryProvider } from './test/utils'

export const accountSettingsPage = {
  render() {
    render(
      <MemoryRouter>
        <TestQueryProvider>
          <AccountSettings />
        </TestQueryProvider>
      </MemoryRouter>
    )
  },

  async waitForLoaded() {
    await waitFor(() => {
      expect(screen.getByRole('group', { name: 'Profile' })).toBeInTheDocument()
    })
  },

  get heading() {
    return screen.getByRole('heading', { name: 'Account settings' })
  },

  get profileFieldset() {
    return screen.getByRole('group', { name: 'Profile' })
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

  get successMessage() {
    return screen.getByText('Your changes have been saved.')
  },

  get errorMessage() {
    return screen.getByText('Failed to save changes. Please try again.')
  },

  querySuccessMessage() {
    return screen.queryByText('Your changes have been saved.')
  },

  queryErrorMessage() {
    return screen.queryByText('Failed to save changes. Please try again.')
  },

  get usernameError() {
    return screen.getByText('Username is required')
  },

  queryUsernameError() {
    return screen.queryByText('Username is required')
  },
}
