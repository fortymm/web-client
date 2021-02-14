import { render, screen } from '@testing-library/vue'
import UserMenu from '@/components/UserMenu.vue'
import userEvent from '@testing-library/user-event'

let signOutMock
beforeEach(() => (signOutMock = jest.fn()))

it('clears the session when the sign out button is clicked', () => {
  const store = {
    state: { session: { current: {} } },
    mutations: { 'session/signOut': signOutMock },
  }
  render(UserMenu, { store, stubs: { NuxtLink: true } })

  const signOutButton = screen.getByText('Sign Out')
  userEvent.click(signOutButton)
  expect(signOutMock).toHaveBeenCalled()
})

describe('when there is no current session', () => {
  beforeEach(() => {
    const store = {
      state: { session: {} },
    }
    render(UserMenu, { store, stubs: { NuxtLink: true } })
  })

  it('shows the sign in link', () => {
    const signInLink = screen.getByText('Sign In')
    expect(signInLink).toBeInTheDocument()
  })

  it('shows the sign up link', () => {
    const signUpLink = screen.getByText('Sign Up')
    expect(signUpLink).toBeInTheDocument()
  })

  it('does not show the sign out link', () => {
    const signOutLink = screen.queryByText('Sign Out')
    expect(signOutLink).not.toBeInTheDocument()
  })
})

describe('when there is a current session', () => {
  beforeEach(() => {
    const store = {
      state: { session: { current: {} } },
      mutations: { 'session/signOut': signOutMock },
    }
    render(UserMenu, { store, stubs: { NuxtLink: true } })
  })

  it('does not show the sign in link', () => {
    const signInLink = screen.queryByText('Sign In')
    expect(signInLink).not.toBeInTheDocument()
  })

  it('does not show the sign up link', () => {
    const signUpLink = screen.queryByText('Sign Up')
    expect(signUpLink).not.toBeInTheDocument()
  })

  it('shows the sign out link', () => {
    const signOutLink = screen.queryByText('Sign Out')
    expect(signOutLink).toBeInTheDocument()
  })
})
