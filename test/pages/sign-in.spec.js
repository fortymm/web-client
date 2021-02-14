import SignIn from '@/pages/sign-in'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

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

describe('/sign-in', () => {
  let $router

  beforeEach(() => ($router = { push: jest.fn() }))

  it('redirects to / when a user signs in', async () => {
    const store = { state: {}, mutations: { signIn: jest.fn() } }
    render(SignIn, { store, mocks: { $router } })
    signIn('email-address@gmail.com', 'my super secret password')
    await waitFor(() => expect($router.push).toHaveBeenCalledWith('/'))
    expect($router.push).toHaveBeenCalledWith('/')
  })

  it('updates the current session when a user signs in', async () => {
    const signInMock = jest.fn()
    const store = { state: {}, mutations: { signIn: signInMock } }
    render(SignIn, { store, mocks: { $router } })
    signIn('email-address@gmail.com', 'my super secret password')
    await waitFor(() => expect(signInMock).toHaveBeenCalled())
    expect(signInMock).toHaveBeenCalledWith(
      {},
      {
        attributes: {
          userId: 'a57e0288-2e93-4a50-aa70-b170a1273366',
        },
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
      }
    )
  })
})
