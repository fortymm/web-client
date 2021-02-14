import { render, screen } from '@testing-library/vue'
import UserMenu from '@/components/UserMenu.vue'
import userEvent from '@testing-library/user-event'

describe('/', () => {
  let signOutMock
  beforeEach(() => {
    signOutMock = jest.fn()
    const store = {
      state: { session: {} },
      mutations: { 'session/signOut': signOutMock },
    }
    render(UserMenu, { store, stubs: { NuxtLink: true } })
  })

  it('clears the session when the sign out button is clicked', () => {
    const signOutButton = screen.getByText('Sign Out')
    userEvent.click(signOutButton)
    expect(signOutMock).toHaveBeenCalled()
  })
})
