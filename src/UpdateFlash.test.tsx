import { describe, it, expect, beforeEach } from 'vitest'
import { updateFlashPage } from './UpdateFlash.page'

describe('UpdateFlash', () => {
  beforeEach(() => {
    updateFlashPage.resetMocks()
  })

  it('does not render when no update is available', () => {
    updateFlashPage.setNeedRefresh(false)
    updateFlashPage.render()

    expect(updateFlashPage.alert).not.toBeInTheDocument()
  })

  it('renders update notification when an update is available', () => {
    updateFlashPage.setNeedRefresh(true)
    updateFlashPage.render()

    expect(updateFlashPage.alert).toBeInTheDocument()
    expect(updateFlashPage.alert).toHaveTextContent('A new version is available')
    expect(updateFlashPage.refreshButton).toBeInTheDocument()
    expect(updateFlashPage.dismissButton).toBeInTheDocument()
  })

  it('calls refresh when refresh button is clicked', async () => {
    updateFlashPage.setNeedRefresh(true)
    updateFlashPage.render()

    await updateFlashPage.clickRefresh()

    expect(updateFlashPage.getMockRefresh()).toHaveBeenCalled()
  })

  it('dismisses the flash when dismiss button is clicked', async () => {
    updateFlashPage.setNeedRefresh(true)
    updateFlashPage.render()

    expect(updateFlashPage.alert).toBeInTheDocument()

    await updateFlashPage.clickDismiss()

    expect(updateFlashPage.alert).not.toBeInTheDocument()
  })
})
