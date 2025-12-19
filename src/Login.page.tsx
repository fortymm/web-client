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
    return screen.getByRole('heading', { name: 'Log in' })
  },

  // Magic link form
  get magicLinkEmailInput() {
    return screen.getByLabelText('Email', { selector: '#magic-link-email' })
  },

  async fillMagicLinkEmail(value: string) {
    const input = this.magicLinkEmailInput
    await userEvent.clear(input)
    if (value) {
      await userEvent.type(input, value)
    }
  },

  get loginWithEmailButton() {
    return screen.getByRole('button', { name: /log in with email/i })
  },

  async clickLoginWithEmail() {
    await userEvent.click(this.loginWithEmailButton)
  },

  // Password form
  get passwordEmailInput() {
    return screen.getByLabelText('Email', { selector: '#password-email' })
  },

  async fillPasswordEmail(value: string) {
    const input = this.passwordEmailInput
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

  get stayLoggedInButton() {
    return screen.getByRole('button', { name: /log in and stay logged in/i })
  },

  async clickStayLoggedIn() {
    await userEvent.click(this.stayLoggedInButton)
  },

  get loginOnlyThisTimeButton() {
    return screen.getByRole('button', { name: /log in only this time/i })
  },

  async clickLoginOnlyThisTime() {
    await userEvent.click(this.loginOnlyThisTimeButton)
  },

  get signUpLink() {
    return screen.getByRole('link', { name: 'Sign up' })
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
