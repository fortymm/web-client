import { render, screen, waitFor } from '@testing-library/vue'
import SignInForm from '@/components/SignInForm.vue'
import userEvent from '@testing-library/user-event'
import { server, rest } from '~/mocks/server'

const signInForm = {
  get emailAddressInput() {
    return screen.getByLabelText('Email Address')
  },
  get passwordInput() {
    return screen.getByLabelText('Password')
  },
  get submitButton() {
    return screen.getByRole('button', { name: 'Sign In' })
  },
}

const signIn = (emailAddress, password) => {
  userEvent.type(signInForm.emailAddressInput, emailAddress)
  userEvent.type(signInForm.passwordInput, password)
  userEvent.click(signInForm.submitButton)
}

describe('SignInForm', () => {
  let emitted

  beforeEach(() => {
    const wrapper = render(SignInForm)
    emitted = wrapper.emitted
  })
  it('shows an email input', () => {
    expect(signInForm.emailAddressInput).toBeInTheDocument()
  })
  it('shows a password input', () => {
    expect(signInForm.passwordInput).toBeInTheDocument()
  })
  it('shows a submit button', () => {
    expect(signInForm.submitButton).toBeInTheDocument()
  })
  it('does not emit a session created event', () => {
    expect(emitted()).toEqual({})
  })
  it('does not show any error messages', () => {
    const errors = screen.queryByRole('alert')
    expect(errors).not.toBeInTheDocument()
  })

  describe('while the sign in request is pending', () => {
    beforeEach(() => signIn('email@address.com', 'some super secret password'))
    it('disables the email input', () => {
      expect(signInForm.emailAddressInput).toBeDisabled()
    })
    it('disables the password input', () => {
      expect(signInForm.passwordInput).toBeDisabled()
    })
    it('disables the submit button', () => {
      expect(signInForm.submitButton).toBeDisabled()
    })

    it('does not emit a session created event', () => {
      expect(emitted()).toEqual({})
    })
    it('does not show any error messages', () => {
      const errors = screen.queryByRole('alert')
      expect(errors).not.toBeInTheDocument()
    })
  })

  describe('when the sign in request returns invalid json', () => {
    beforeEach(async () => {
      server.use(
        rest.post('https://www.fortymm.com/api/v1/sessions', (_req, res, ctx) =>
          res(ctx.text('asdf'))
        )
      )
      signIn('email-address@gmail.com', 'my super secret password')

      await waitFor(() => expect(signInForm.submitButton).toBeDisabled())
      await waitFor(() => expect(signInForm.submitButton).toBeEnabled())
    })

    it('enables the email input', () => {
      expect(signInForm.emailAddressInput).toBeEnabled()
    })

    it('enables the password input', () => {
      expect(signInForm.passwordInput).toBeEnabled()
    })

    it('enables the submit button', () => {
      expect(signInForm.submitButton).toBeEnabled()
    })

    it('does not emit a session created event', () => {
      expect(emitted()).toEqual({})
    })

    it('shows a sign in failed error message', () => {
      const error = screen.getByRole('alert')
      expect(error).toHaveTextContent(
        'There was a problem signing in. Please try again.'
      )
    })
  })

  describe('when the sign in request fails', () => {
    beforeEach(async () => {
      server.use(
        rest.post('https://www.fortymm.com/api/v1/sessions', (_req, res, ctx) =>
          res(ctx.status(500))
        )
      )
      signIn('email-address@gmail.com', 'my super secret password')

      await waitFor(() => expect(signInForm.submitButton).toBeDisabled())
      await waitFor(() => expect(signInForm.submitButton).toBeEnabled())
    })

    it('enables the email input', () => {
      expect(signInForm.emailAddressInput).toBeEnabled()
    })

    it('enables the password input', () => {
      expect(signInForm.passwordInput).toBeEnabled()
    })

    it('enables the submit button', () => {
      expect(signInForm.submitButton).toBeEnabled()
    })

    it('does not emit a session created event', () => {
      expect(emitted()).toEqual({})
    })

    it('shows a sign in failed error message', () => {
      const error = screen.getByRole('alert')
      expect(error).toHaveTextContent(
        'There was a problem signing in. Please try again.'
      )
    })
  })

  describe('when the sign in request is invalid', () => {
    beforeEach(async () => {
      server.use(
        rest.post('https://www.fortymm.com/api/v1/sessions', (_req, res, ctx) =>
          res(ctx.status(422))
        )
      )
      signIn('email-address@gmail.com', 'my super secret password')

      await waitFor(() => expect(signInForm.submitButton).toBeDisabled())
      await waitFor(() => expect(signInForm.submitButton).toBeEnabled())
    })

    it('enables the email input', () => {
      expect(signInForm.emailAddressInput).toBeEnabled()
    })

    it('enables the password input', () => {
      expect(signInForm.passwordInput).toBeEnabled()
    })

    it('enables the submit button', () => {
      expect(signInForm.submitButton).toBeEnabled()
    })

    it('does not emit a session created event', () => {
      expect(emitted()).toEqual({})
    })

    it('shows an invalid email address or password error message', () => {
      const error = screen.getByRole('alert')
      expect(error).toHaveTextContent('Invalid email address or password.')
    })
  })

  describe('when there is a network failure signing in', () => {
    beforeEach(async () => {
      server.use(
        rest.post(
          'https://www.fortymm.com/api/v1/sessions',
          (_req, res, _ctx) => res.networkError('oops')
        )
      )
      signIn('email-address@gmail.com', 'my super secret password')

      await waitFor(() => expect(signInForm.submitButton).toBeDisabled())
      await waitFor(() => expect(signInForm.submitButton).toBeEnabled())
    })

    it('enables the email input', () => {
      expect(signInForm.emailAddressInput).toBeEnabled()
    })

    it('enables the password input', () => {
      expect(signInForm.passwordInput).toBeEnabled()
    })

    it('enables the submit button', () => {
      expect(signInForm.submitButton).toBeEnabled()
    })

    it('does not emit a session created event', () => {
      expect(emitted()).toEqual({})
    })

    it('shows a sign in failed error message', () => {
      const error = screen.getByRole('alert')
      expect(error).toHaveTextContent(
        'There was a problem signing in. Please try again.'
      )
    })
  })

  describe('when signing in is successful', () => {
    beforeEach(async () => {
      signIn('email-address@gmail.com', 'my super secret password')

      await waitFor(() => expect(signInForm.submitButton).toBeDisabled())
      await waitFor(() => expect(signInForm.submitButton).toBeEnabled())
    })
    it('emits a session created event', () => {
      expect(emitted()).toEqual({
        'session-created': [
          [
            {
              attributes: { userId: 'a57e0288-2e93-4a50-aa70-b170a1273366' },
              relationships: {
                user: {
                  data: {
                    attributes: {
                      username: 'some-username',
                    },
                    id: 'a57e0288-2e93-4a50-aa70-b170a1273366',
                    type: 'users',
                  },
                },
              },
              type: 'session',
            },
          ],
        ],
      })
    })

    it('does not show any error feedback', () => {
      const errors = screen.queryByRole('alert')
      expect(errors).not.toBeInTheDocument()
    })
  })
})
