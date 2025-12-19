import { describe, it, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { AxiosError } from 'axios'
import { loginPage } from './Login.page'
import { useLoginPage } from './Login/useLogin.page'
import { useLoginWithEmailPage } from './Login/useLoginWithEmail.page'
import { extractValidationErrors } from './Login/useLogin'
import { server } from './test/mocks/server'

describe('Login', () => {
  it('renders the heading', () => {
    loginPage.render()
    expect(loginPage.heading).toBeInTheDocument()
  })

  it('renders the magic link email input', () => {
    loginPage.render()
    expect(loginPage.magicLinkEmailInput).toBeInTheDocument()
  })

  it('renders the login with email button', () => {
    loginPage.render()
    expect(loginPage.loginWithEmailButton).toBeInTheDocument()
  })

  it('renders the password email input', () => {
    loginPage.render()
    expect(loginPage.passwordEmailInput).toBeInTheDocument()
  })

  it('renders the password input', () => {
    loginPage.render()
    expect(loginPage.passwordInput).toBeInTheDocument()
  })

  it('renders the stay logged in button', () => {
    loginPage.render()
    expect(loginPage.stayLoggedInButton).toBeInTheDocument()
  })

  it('renders the login only this time button', () => {
    loginPage.render()
    expect(loginPage.loginOnlyThisTimeButton).toBeInTheDocument()
  })

  it('renders the sign up link', () => {
    loginPage.render()
    expect(loginPage.signUpLink).toBeInTheDocument()
    expect(loginPage.signUpLink).toHaveAttribute('href', '/register')
  })

  describe('magic link login', () => {
    it('submits the form with email', async () => {
      let capturedPayload: unknown = null

      server.use(
        useLoginWithEmailPage.requestHandler(async ({ request }) => {
          capturedPayload = await request.json()
          return HttpResponse.json({ email: 'test@example.com' })
        })
      )

      loginPage.render()
      await loginPage.fillMagicLinkEmail('test@example.com')
      await loginPage.clickLoginWithEmail()

      await waitFor(() => {
        expect(capturedPayload).toEqual({ email: 'test@example.com' })
      })
    })

    it('shows success flash after sending magic link', async () => {
      server.use(
        useLoginWithEmailPage.requestHandler(() => {
          return HttpResponse.json({ email: 'test@example.com' })
        })
      )

      loginPage.render()
      await loginPage.fillMagicLinkEmail('test@example.com')
      await loginPage.clickLoginWithEmail()

      await waitFor(() => {
        const flash = loginPage.getLatestFlash()
        expect(flash?.message).toBe(
          'A login link was sent to test@example.com. Please check your inbox.'
        )
        expect(flash?.type).toBe('success')
      })
    })

    it('shows error flash when magic link request fails', async () => {
      server.use(
        useLoginWithEmailPage.requestHandler(() => {
          return HttpResponse.error()
        })
      )

      loginPage.render()
      await loginPage.fillMagicLinkEmail('test@example.com')
      await loginPage.clickLoginWithEmail()

      await waitFor(() => {
        const flash = loginPage.getLatestFlash()
        expect(flash?.message).toBe('Failed to send login link. Please try again.')
        expect(flash?.type).toBe('error')
      })
    })

    it('shows validation error when magic link email is invalid', async () => {
      loginPage.render()
      await loginPage.fillMagicLinkEmail('invalid-email')
      await loginPage.clickLoginWithEmail()

      await waitFor(() => {
        expect(loginPage.emailError).toBeInTheDocument()
      })
    })
  })

  describe('password login', () => {
    it('submits the form with stay logged in', async () => {
      let capturedPayload: unknown = null

      server.use(
        useLoginPage.requestHandler(async ({ request }) => {
          capturedPayload = await request.json()
          return HttpResponse.json({ email: 'test@example.com' })
        })
      )

      loginPage.render()
      await loginPage.fillPasswordEmail('test@example.com')
      await loginPage.fillPassword('password123')
      await loginPage.clickStayLoggedIn()

      await waitFor(() => {
        expect(capturedPayload).toEqual({
          email: 'test@example.com',
          password: 'password123',
          remember_me: true,
        })
      })
    })

    it('submits the form with login only this time', async () => {
      let capturedPayload: unknown = null

      server.use(
        useLoginPage.requestHandler(async ({ request }) => {
          capturedPayload = await request.json()
          return HttpResponse.json({ email: 'test@example.com' })
        })
      )

      loginPage.render()
      await loginPage.fillPasswordEmail('test@example.com')
      await loginPage.fillPassword('password123')
      await loginPage.clickLoginOnlyThisTime()

      await waitFor(() => {
        expect(capturedPayload).toEqual({
          email: 'test@example.com',
          password: 'password123',
          remember_me: false,
        })
      })
    })

    it('shows success flash after login', async () => {
      server.use(
        useLoginPage.requestHandler(() => {
          return HttpResponse.json({ email: 'test@example.com' })
        })
      )

      loginPage.render()
      await loginPage.fillPasswordEmail('test@example.com')
      await loginPage.fillPassword('password123')
      await loginPage.clickStayLoggedIn()

      await waitFor(() => {
        const flash = loginPage.getLatestFlash()
        expect(flash?.message).toBe('You have been logged in successfully.')
        expect(flash?.type).toBe('success')
      })
    })

    it('shows error flash when request fails', async () => {
      server.use(
        useLoginPage.requestHandler(() => {
          return HttpResponse.error()
        })
      )

      loginPage.render()
      await loginPage.fillPasswordEmail('test@example.com')
      await loginPage.fillPassword('password123')
      await loginPage.clickStayLoggedIn()

      await waitFor(() => {
        const flash = loginPage.getLatestFlash()
        expect(flash?.message).toBe('Failed to log in. Please try again.')
        expect(flash?.type).toBe('error')
      })
    })

    it('shows validation error when email is invalid', async () => {
      loginPage.render()
      await loginPage.fillPasswordEmail('invalid-email')
      await loginPage.fillPassword('password123')
      await loginPage.clickStayLoggedIn()

      await waitFor(() => {
        expect(loginPage.emailError).toBeInTheDocument()
      })
    })

    it('shows validation error when password is empty', async () => {
      loginPage.render()
      await loginPage.fillPasswordEmail('test@example.com')
      await loginPage.clickStayLoggedIn()

      await waitFor(() => {
        expect(loginPage.passwordError).toBeInTheDocument()
      })
    })

    it('shows API validation error on email field', async () => {
      server.use(
        useLoginPage.requestHandler(() => {
          return HttpResponse.json(
            { errors: { email: ['Email not found'] } },
            { status: 422 }
          )
        })
      )

      loginPage.render()
      await loginPage.fillPasswordEmail('unknown@example.com')
      await loginPage.fillPassword('password123')
      await loginPage.clickStayLoggedIn()

      await waitFor(() => {
        expect(loginPage.getErrorByText('Email not found')).toBeInTheDocument()
      })
    })

    it('shows API validation error on password field', async () => {
      server.use(
        useLoginPage.requestHandler(() => {
          return HttpResponse.json(
            { errors: { password: ['Password is incorrect'] } },
            { status: 422 }
          )
        })
      )

      loginPage.render()
      await loginPage.fillPasswordEmail('test@example.com')
      await loginPage.fillPassword('wrongpassword')
      await loginPage.clickStayLoggedIn()

      await waitFor(() => {
        expect(
          loginPage.getErrorByText('Password is incorrect')
        ).toBeInTheDocument()
      })
    })

    it('does not show generic error flash for 422 validation errors', async () => {
      server.use(
        useLoginPage.requestHandler(() => {
          return HttpResponse.json(
            { errors: { email: ['Email not found'] } },
            { status: 422 }
          )
        })
      )

      loginPage.render()
      await loginPage.fillPasswordEmail('unknown@example.com')
      await loginPage.fillPassword('password123')
      await loginPage.clickStayLoggedIn()

      await waitFor(() => {
        expect(loginPage.getErrorByText('Email not found')).toBeInTheDocument()
      })

      const flash = loginPage.getLatestFlash()
      expect(flash?.message).not.toBe('Failed to log in. Please try again.')
    })
  })
})

describe('extractValidationErrors', () => {
  it('extracts errors from a 422 axios error', () => {
    const error = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: {},
        config: {} as never,
        data: { errors: { email: ['Email not found'] } },
      }
    )

    const result = extractValidationErrors(error)
    expect(result).toEqual({ email: ['Email not found'] })
  })

  it('returns null for non-422 errors', () => {
    const error = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as never,
        data: {},
      }
    )

    const result = extractValidationErrors(error)
    expect(result).toBeNull()
  })
})
