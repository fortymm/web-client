import { describe, it, expect, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { AxiosError } from 'axios'
import { accountSettingsPage } from './AccountSettings.page'
import { useSessionPage } from './hooks/useSession.page'
import { useUpdateAccountPage } from './AccountSettings/useUpdateAccount.page'
import { extractValidationErrors } from './AccountSettings/useUpdateAccount'
import { server } from './test/mocks/server'

describe('AccountSettings', () => {
  beforeEach(() => {
    server.use(
      useSessionPage.requestHandler(() => {
        return HttpResponse.json(
          useSessionPage.createMockResponse({ username: 'CurrentUser' })
        )
      })
    )
  })

  it('renders the heading', async () => {
    accountSettingsPage.render()
    expect(accountSettingsPage.heading).toBeInTheDocument()
  })

  it('renders the username input after loading', async () => {
    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()
    expect(accountSettingsPage.usernameInput).toBeInTheDocument()
  })

  it('renders the save button after loading', async () => {
    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()
    expect(accountSettingsPage.saveButton).toBeInTheDocument()
  })

  it('populates username from session', async () => {
    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()

    await waitFor(() => {
      expect(accountSettingsPage.usernameInput).toHaveValue('CurrentUser')
    })
  })

  it('keeps save button enabled when form is not dirty', async () => {
    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()

    await waitFor(() => {
      expect(accountSettingsPage.usernameInput).toHaveValue('CurrentUser')
    })

    expect(accountSettingsPage.saveButton).not.toBeDisabled()
  })

  it('shows no changes toast when clicking save without changes', async () => {
    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()

    await waitFor(() => {
      expect(accountSettingsPage.usernameInput).toHaveValue('CurrentUser')
    })

    await accountSettingsPage.clickSave()

    await waitFor(() => {
      const flash = accountSettingsPage.getLatestFlash()
      expect(flash?.message).toBe('No changes to save.')
      expect(flash?.type).toBe('info')
    })
  })

  it('submits the form when save is clicked', async () => {
    let capturedPayload: unknown = null

    server.use(
      useUpdateAccountPage.requestHandler(async ({ request }) => {
        capturedPayload = await request.json()
        return HttpResponse.json({ username: 'NewUsername' })
      })
    )

    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()

    await waitFor(() => {
      expect(accountSettingsPage.usernameInput).toHaveValue('CurrentUser')
    })

    await accountSettingsPage.fillUsername('NewUsername')
    await accountSettingsPage.clickSave()

    await waitFor(() => {
      expect(capturedPayload).toEqual({ username: 'NewUsername' })
    })
  })

  it('shows success toast after saving', async () => {
    server.use(
      useUpdateAccountPage.requestHandler(() => {
        return HttpResponse.json({ username: 'NewUsername' })
      })
    )

    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()

    await waitFor(() => {
      expect(accountSettingsPage.usernameInput).toHaveValue('CurrentUser')
    })

    await accountSettingsPage.fillUsername('NewUsername')
    await accountSettingsPage.clickSave()

    await waitFor(() => {
      const flash = accountSettingsPage.getLatestFlash()
      expect(flash?.message).toBe('Your changes have been saved.')
      expect(flash?.type).toBe('success')
    })
  })

  it('shows error toast when save fails', async () => {
    server.use(
      useUpdateAccountPage.requestHandler(() => {
        return HttpResponse.error()
      })
    )

    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()

    await waitFor(() => {
      expect(accountSettingsPage.usernameInput).toHaveValue('CurrentUser')
    })

    await accountSettingsPage.fillUsername('NewUsername')
    await accountSettingsPage.clickSave()

    await waitFor(() => {
      const flash = accountSettingsPage.getLatestFlash()
      expect(flash?.message).toBe('Failed to save changes. Please try again.')
      expect(flash?.type).toBe('error')
    })
  })

  it('shows validation error when username is empty', async () => {
    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()

    await waitFor(() => {
      expect(accountSettingsPage.usernameInput).toHaveValue('CurrentUser')
    })

    await accountSettingsPage.fillUsername('')
    await accountSettingsPage.clickSave()

    await waitFor(() => {
      expect(accountSettingsPage.usernameError).toBeInTheDocument()
    })
  })

  it('shows skeleton loader while loading', () => {
    server.use(
      useSessionPage.requestHandler(() => {
        return new Promise(() => {})
      })
    )

    accountSettingsPage.render()

    expect(accountSettingsPage.skeleton).toBeInTheDocument()
  })

  it('shows save button while loading', () => {
    server.use(
      useSessionPage.requestHandler(() => {
        return new Promise(() => {})
      })
    )

    accountSettingsPage.render()

    expect(accountSettingsPage.saveButton).toBeInTheDocument()
  })

  it('shows no changes toast when clicking save while loading', async () => {
    server.use(
      useSessionPage.requestHandler(() => {
        return new Promise(() => {})
      })
    )

    accountSettingsPage.render()
    await accountSettingsPage.clickSave()

    await waitFor(() => {
      const flash = accountSettingsPage.getLatestFlash()
      expect(flash?.message).toBe('No changes to save.')
      expect(flash?.type).toBe('info')
    })
  })

  it('shows API validation error on username field', async () => {
    server.use(
      useUpdateAccountPage.requestHandler(() => {
        return HttpResponse.json(
          { errors: { username: ['Username is already taken'] } },
          { status: 422 }
        )
      })
    )

    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()

    await waitFor(() => {
      expect(accountSettingsPage.usernameInput).toHaveValue('CurrentUser')
    })

    await accountSettingsPage.fillUsername('TakenUsername')
    await accountSettingsPage.clickSave()

    await waitFor(() => {
      expect(
        accountSettingsPage.getUsernameErrorByText('Username is already taken')
      ).toBeInTheDocument()
    })
  })

  it('does not show generic error toast for 422 validation errors', async () => {
    server.use(
      useUpdateAccountPage.requestHandler(() => {
        return HttpResponse.json(
          { errors: { username: ['Username is already taken'] } },
          { status: 422 }
        )
      })
    )

    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()

    await waitFor(() => {
      expect(accountSettingsPage.usernameInput).toHaveValue('CurrentUser')
    })

    await accountSettingsPage.fillUsername('TakenUsername')
    await accountSettingsPage.clickSave()

    await waitFor(() => {
      expect(
        accountSettingsPage.getUsernameErrorByText('Username is already taken')
      ).toBeInTheDocument()
    })

    const flash = accountSettingsPage.getLatestFlash()
    expect(flash?.message).not.toBe('Failed to save changes. Please try again.')
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
        data: { errors: { username: ['Username is already taken'] } },
      }
    )

    const result = extractValidationErrors(error)
    expect(result).toEqual({ username: ['Username is already taken'] })
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
