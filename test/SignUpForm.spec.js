import { screen, render, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import SignUpForm from '@/components/SignUpForm.vue'
import { server, rest } from '~/mocks/server'

const signUpForm = {
  get usernameInput() {
    return screen.getByLabelText('Username')
  },
  get emailAddressInput() {
    return screen.getByLabelText('Email Address')
  },
  get passwordInput() {
    return screen.getByLabelText('Password')
  },
  get submitButton() {
    return screen.getByRole('button', { name: 'Sign Up' })
  },
}

const signIn = (username, emailAddress, password) => {
  userEvent.type(signUpForm.usernameInput, username)
  userEvent.type(signUpForm.emailAddressInput, emailAddress)
  userEvent.type(signUpForm.passwordInput, password)
  userEvent.click(signUpForm.submitButton)
}

describe('SignUpForm', () => {
  let emitted

  beforeEach(() => {
    const wrapper = render(SignUpForm)
    emitted = wrapper.emitted
  })

  it('shows a username input', () => {
    expect(signUpForm.usernameInput).toBeInTheDocument()
  })
  it('shows an email input', () => {
    expect(signUpForm.emailAddressInput).toBeInTheDocument()
  })
  it('shows a password input', () => {
    expect(signUpForm.passwordInput).toBeInTheDocument()
  })

  it('shows a submit button', () => {
    expect(signUpForm.submitButton).toBeInTheDocument()
  })

  it('does not emit a user created event', () => {
    expect(emitted()).toEqual({})
  })

  it('does not show any error feedback', () => {
    expect(screen.queryAllByRole('alert')).toEqual([])
  })

  describe('while the sign up request is pending', () => {
    beforeEach(() =>
      signIn('username', 'email-address@gmail.com', 'my super secret password')
    )

    it('disables the username input', () => {
      expect(signUpForm.usernameInput).toBeDisabled()
    })

    it('disables the email address input', () => {
      expect(signUpForm.emailAddressInput).toBeDisabled()
    })

    it('disables the password input', () => {
      expect(signUpForm.passwordInput).toBeDisabled()
    })

    it('disables the submit button', () => {
      expect(signUpForm.submitButton).toBeDisabled()
    })

    it('does not emit a user created event', () => {
      expect(emitted()).toEqual({})
    })

    it('does not show any error feedback', () => {
      expect(screen.queryAllByRole('alert')).toEqual([])
    })
  })

  describe('when the email address has already been taken', () => {
    beforeEach(async () => {
      server.use(
        rest.post('https://www.fortymm.com/api/v1/users', (_req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({
              errors: [
                {
                  id: 'dd38c3b6-f164-40ff-9b8c-c79922de0bab',
                  status: '422',
                  code: 'emailAddressTaken',
                  source: 'user/attributes/emailAddress',
                  title:
                    'There is already an account with the email address email-address@gmail.com',
                },
              ],
            })
          )
        })
      )
      signIn('username', 'email-address@gmail.com', 'my super secret password')

      await waitFor(() => expect(signUpForm.submitButton).toBeDisabled())
      await waitFor(() => expect(signUpForm.submitButton).toBeEnabled())
    })
    it('enables the username input', () => {
      expect(signUpForm.usernameInput).toBeEnabled()
    })

    it('enables the email address input', () => {
      expect(signUpForm.emailAddressInput).toBeEnabled()
    })

    it('enables the password input', () => {
      expect(signUpForm.passwordInput).toBeEnabled()
    })

    it('enables the submit button', () => {
      expect(signUpForm.submitButton).toBeEnabled()
    })

    it('does not emit a user created event', () => {
      expect(emitted()).toEqual({})
    })

    it('shows an email taken error message', () => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'There is already an account with this email address'
      )
    })
  })

  describe('when the sign up request returns invalid json', () => {
    beforeEach(async () => {
      server.use(
        rest.post('https://www.fortymm.com/api/v1/users', (_req, res, ctx) =>
          res(ctx.text('asdf'))
        )
      )
      signIn('username', 'email-address@gmail.com', 'my super secret password')

      await waitFor(() => expect(signUpForm.submitButton).toBeDisabled())
      await waitFor(() => expect(signUpForm.submitButton).toBeEnabled())
    })
    it('enables the username input', () => {
      expect(signUpForm.usernameInput).toBeEnabled()
    })

    it('enables the email address input', () => {
      expect(signUpForm.emailAddressInput).toBeEnabled()
    })

    it('enables the password input', () => {
      expect(signUpForm.passwordInput).toBeEnabled()
    })
    it('enables the submit button', () => {
      expect(signUpForm.submitButton).toBeEnabled()
    })

    it('shows a sign up failed error message', () => {
      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toHaveTextContent(
        'There was a problem signing up. Please try again.'
      )
    })

    it('does not emit a user created event', () => {
      expect(emitted()).toEqual({})
    })
  })

  describe('when the sign up request fails', () => {
    beforeEach(async () => {
      server.use(
        rest.post('https://www.fortymm.com/api/v1/users', (_req, res, ctx) => {
          return res(ctx.status(500), ctx.json({}))
        })
      )
      signIn('username', 'email-address@gmail.com', 'my super secret password')

      await waitFor(() => expect(signUpForm.submitButton).toBeDisabled())
      await waitFor(() => expect(signUpForm.submitButton).toBeEnabled())
    })
    it('enables the username input', () => {
      expect(signUpForm.usernameInput).toBeEnabled()
    })

    it('enables the email address input', () => {
      expect(signUpForm.emailAddressInput).toBeEnabled()
    })

    it('enables the password input', () => {
      expect(signUpForm.passwordInput).toBeEnabled()
    })
    it('enables the submit button', () => {
      expect(signUpForm.submitButton).toBeEnabled()
    })

    it('shows a sign up failed error message', () => {
      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toHaveTextContent(
        'There was a problem signing up. Please try again.'
      )
    })

    it('does not emit a user created event', () => {
      expect(emitted()).toEqual({})
    })
  })

  describe('when there is a network failure signing up', () => {
    beforeEach(async () => {
      server.use(
        rest.post('https://www.fortymm.com/api/v1/users', (_req, res, _ctx) =>
          res.networkError('OOPS')
        )
      )
      signIn('username', 'email-address@gmail.com', 'my super secret password')

      await waitFor(() => expect(signUpForm.submitButton).toBeDisabled())
      await waitFor(() => expect(signUpForm.submitButton).toBeEnabled())
    })

    it('enables the username input', () => {
      expect(signUpForm.usernameInput).toBeEnabled()
    })

    it('enables the email address input', () => {
      expect(signUpForm.emailAddressInput).toBeEnabled()
    })

    it('enables the password input', () => {
      expect(signUpForm.passwordInput).toBeEnabled()
    })

    it('enables the submit button', () => {
      expect(signUpForm.submitButton).toBeEnabled()
    })

    it('shows a sign up failed error message', () => {
      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toHaveTextContent(
        'There was a problem signing up. Please try again.'
      )
    })
  })

  describe('when signing up is successful', () => {
    beforeEach(async () => {
      signIn('username', 'email-address@gmail.com', 'my super secret password')
      await waitFor(() => expect(emitted()).not.toEqual({}))
    })

    it('emits a user created event', () => {
      expect(emitted()).toEqual({
        'user-created': [
          [
            {
              attributes: { username: 'username' },
              id: '6150f42e-1849-419d-9d0f-d85e81a7d28c',
              type: 'users',
            },
          ],
        ],
      })
    })

    it('does not show any error feedback', () => {
      expect(screen.queryAllByRole('alert')).toEqual([])
    })
  })
})
