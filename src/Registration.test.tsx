import { describe, it, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { AxiosError } from 'axios'
import { registrationPage } from './Registration.page'
import { useCreateUserPage } from './Registration/useCreateUser.page'
import { extractValidationErrors } from './Registration/useCreateUser'
import { server } from './test/mocks/server'

describe('Registration', () => {
  it('renders the heading', () => {
    registrationPage.render()
    expect(registrationPage.heading).toBeInTheDocument()
  })

  it('renders the email input', () => {
    registrationPage.render()
    expect(registrationPage.emailInput).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    registrationPage.render()
    expect(registrationPage.submitButton).toBeInTheDocument()
  })

  it('renders the login link', () => {
    registrationPage.render()
    expect(registrationPage.loginLink).toBeInTheDocument()
    expect(registrationPage.loginLink).toHaveAttribute('href', '/login')
  })

  it('submits the form with email', async () => {
    let capturedPayload: unknown = null

    server.use(
      useCreateUserPage.requestHandler(async ({ request }) => {
        capturedPayload = await request.json()
        return HttpResponse.json({ email: 'test@example.com' })
      })
    )

    registrationPage.render()
    await registrationPage.fillEmail('test@example.com')
    await registrationPage.clickSubmit()

    await waitFor(() => {
      expect(capturedPayload).toEqual({ email: 'test@example.com' })
    })
  })

  it('shows success flash after registration', async () => {
    server.use(
      useCreateUserPage.requestHandler(() => {
        return HttpResponse.json({ email: 'test@example.com' })
      })
    )

    registrationPage.render()
    await registrationPage.fillEmail('test@example.com')
    await registrationPage.clickSubmit()

    await waitFor(() => {
      const flash = registrationPage.getLatestFlash()
      expect(flash?.message).toBe(
        'An email was sent to test@example.com, please access it to confirm your account.'
      )
      expect(flash?.type).toBe('success')
    })
  })

  it('shows error flash when request fails', async () => {
    server.use(
      useCreateUserPage.requestHandler(() => {
        return HttpResponse.error()
      })
    )

    registrationPage.render()
    await registrationPage.fillEmail('test@example.com')
    await registrationPage.clickSubmit()

    await waitFor(() => {
      const flash = registrationPage.getLatestFlash()
      expect(flash?.message).toBe('Failed to create account. Please try again.')
      expect(flash?.type).toBe('error')
    })
  })

  it('shows validation error when email is invalid', async () => {
    registrationPage.render()
    await registrationPage.fillEmail('invalid-email')
    await registrationPage.clickSubmit()

    await waitFor(() => {
      expect(registrationPage.emailError).toBeInTheDocument()
    })
  })

  it('shows API validation error on email field', async () => {
    server.use(
      useCreateUserPage.requestHandler(() => {
        return HttpResponse.json(
          { errors: { email: ['Email is already taken'] } },
          { status: 422 }
        )
      })
    )

    registrationPage.render()
    await registrationPage.fillEmail('taken@example.com')
    await registrationPage.clickSubmit()

    await waitFor(() => {
      expect(
        registrationPage.getEmailErrorByText('Email is already taken')
      ).toBeInTheDocument()
    })
  })

  it('does not show generic error flash for 422 validation errors', async () => {
    server.use(
      useCreateUserPage.requestHandler(() => {
        return HttpResponse.json(
          { errors: { email: ['Email is already taken'] } },
          { status: 422 }
        )
      })
    )

    registrationPage.render()
    await registrationPage.fillEmail('taken@example.com')
    await registrationPage.clickSubmit()

    await waitFor(() => {
      expect(
        registrationPage.getEmailErrorByText('Email is already taken')
      ).toBeInTheDocument()
    })

    const flash = registrationPage.getLatestFlash()
    expect(flash?.message).not.toBe('Failed to create account. Please try again.')
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
        data: { errors: { email: ['Email is already taken'] } },
      }
    )

    const result = extractValidationErrors(error)
    expect(result).toEqual({ email: ['Email is already taken'] })
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
