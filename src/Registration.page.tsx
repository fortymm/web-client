import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Registration from './Registration'
import { TestQueryProvider } from './test/utils'
import { FlashTestWrapper } from './test/FlashTestWrapper'
import { flashStateRef } from './test/flashStateRef'

export const registrationPage = {
  render() {
    render(
      <MemoryRouter>
        <TestQueryProvider>
          <FlashTestWrapper>
            <Registration />
          </FlashTestWrapper>
        </TestQueryProvider>
      </MemoryRouter>
    )
  },

  get heading() {
    return screen.getByRole('heading', { name: 'Register for an account' })
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

  get submitButton() {
    return screen.getByRole('button', { name: /create an account/i })
  },

  async clickSubmit() {
    await userEvent.click(this.submitButton)
  },

  get loginLink() {
    return screen.getByRole('link', { name: 'Log in' })
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

  getEmailErrorByText(text: string) {
    return screen.getByText(text)
  },

  queryEmailErrorByText(text: string) {
    return screen.queryByText(text)
  },
}
