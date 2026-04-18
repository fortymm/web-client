import { expect, test } from '@playwright/test'

test('marketing landing renders the hero headline and primary CTA', async ({
  page,
}) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: /play more/i }),
  ).toBeVisible()

  await expect(
    page.getByRole('link', { name: /start a match in your browser/i }),
  ).toBeVisible()
})
