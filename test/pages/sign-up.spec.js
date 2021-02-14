import { render, waitFor, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import SignUp from '@/pages/sign-up.vue'

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

const signUp = (username, emailAddress, password) => {
  userEvent.type(signUpForm.usernameInput, username)
  userEvent.type(signUpForm.emailAddressInput, emailAddress)
  userEvent.type(signUpForm.passwordInput, password)
  userEvent.click(signUpForm.submitButton)
}

describe('/sign-up', () => {
  let $router

  beforeEach(() => ($router = { push: jest.fn() }))

  it('redirects to / when a user signs up', async () => {
    const store = {
      state: {},
      mutations: { 'session/signIn': jest.fn() },
    }
    render(SignUp, { store, mocks: { $router } })
    signUp('username', 'email-address@gmail.com', 'my super secret password')
    await waitFor(() => expect($router.push).toHaveBeenCalledWith('/'))
    expect($router.push).toHaveBeenCalledWith('/')
  })

  it('updates the current session when a user signs up', async () => {
    const signInMock = jest.fn()
    const store = {
      state: {},
      mutations: { 'session/signIn': signInMock },
    }
    render(SignUp, { store, mocks: { $router } })
    signUp('username', 'email-address@gmail.com', 'my super secret password')
    await waitFor(() => expect(signInMock).toHaveBeenCalled())
    expect(signInMock).toHaveBeenCalledWith(
      {},
      {
        attributes: {
          username: 'username',
        },
        id: '6150f42e-1849-419d-9d0f-d85e81a7d28c',
        type: 'users',
      }
    )
  })
})
