import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'
import { TestQueryProvider } from './test/utils'
import { FlashTestWrapper } from './test/FlashTestWrapper'
import { flashStateRef } from './test/flashStateRef'

export const loginPage = {
  render() {
    render(
      <MemoryRouter>
        <TestQueryProvider>
          <FlashTestWrapper>
            <Login />
          </FlashTestWrapper>
        </TestQueryProvider>
      </MemoryRouter>
    )
  },

  get heading() {
    return screen.getByRole('heading', { name: 'Log in to your account' })
  },

  get emailInput() {
    return screen.getByRole('textbox', { name: 'Email' })
  },

  async fillEmail(value: string) {
    const input = this.emailInput
    await userEvent.clear(input)
    if (value) {
      await userEvent.type(input, value)
    }
  },

  get passwordInput() {
    return screen.getByLabelText('Password')
  },

  async fillPassword(value: string) {
    const input = this.passwordInput
    await userEvent.clear(input)
    if (value) {
      await userEvent.type(input, value)
    }
  },

  get submitButton() {
    return screen.getByRole('button', { name: /log in/i })
  },

  async clickSubmit() {
    await userEvent.click(this.submitButton)
  },

  get registerLink() {
    return screen.getByRole('link', { name: 'Register' })
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

  get emailError() {
    return screen.getByText('Email must be valid')
  },

  queryEmailError() {
    return screen.queryByText('Email must be valid')
  },

  get passwordError() {
    return screen.getByText('Password is required')
  },

  queryPasswordError() {
    return screen.queryByText('Password is required')
  },

  getErrorByText(text: string) {
    return screen.getByText(text)
  },

  queryErrorByText(text: string) {
    return screen.queryByText(text)
  },
}
