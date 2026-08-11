import { test, expect } from '@playwright/test'

test('should load application homepage successfully', async ({ page }) => {
  // Playwright starts the dev server itself; baseURL comes from playwright.config.ts
  await page.goto('/')

  await expect(page).toHaveTitle("skeletor")
})