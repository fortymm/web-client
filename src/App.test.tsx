import { describe, it, expect } from 'vitest'
import { appPage } from './App.page'

describe('App', () => {
  it('renders the counter button', () => {
    appPage.render()
    expect(appPage.currentCount).toBe(0)
  })

  it('increments the count when clicked', async () => {
    appPage.render()

    await appPage.clickIncreaseCount()
    expect(appPage.currentCount).toBe(1)

    await appPage.clickIncreaseCount()
    expect(appPage.currentCount).toBe(2)

    await appPage.clickIncreaseCount()
    expect(appPage.currentCount).toBe(3)
  })
})
