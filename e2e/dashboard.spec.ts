import { expect, test } from '@playwright/test'

test('dashboard route loads with the Dashboard nav item', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
})
