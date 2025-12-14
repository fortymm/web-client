import { describe, it, expect, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { accountSettingsPage } from './AccountSettings.page'
import { useSessionPage } from './hooks/useSession.page'
import { useUpdateAccountPage } from './AccountSettings/useUpdateAccount.page'
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

  it('renders the profile fieldset after loading', async () => {
    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()
    expect(accountSettingsPage.profileFieldset).toBeInTheDocument()
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

  it('disables save button when form is not dirty', async () => {
    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()

    await waitFor(() => {
      expect(accountSettingsPage.usernameInput).toHaveValue('CurrentUser')
    })

    expect(accountSettingsPage.saveButton).toBeDisabled()
  })

  it('enables save button when username is changed', async () => {
    accountSettingsPage.render()
    await accountSettingsPage.waitForLoaded()

    await waitFor(() => {
      expect(accountSettingsPage.usernameInput).toHaveValue('CurrentUser')
    })

    await accountSettingsPage.fillUsername('NewUsername')

    expect(accountSettingsPage.saveButton).not.toBeDisabled()
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

  it('shows success message after saving', async () => {
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
      expect(accountSettingsPage.successMessage).toBeInTheDocument()
    })
  })

  it('shows error message when save fails', async () => {
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
      expect(accountSettingsPage.errorMessage).toBeInTheDocument()
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
})
