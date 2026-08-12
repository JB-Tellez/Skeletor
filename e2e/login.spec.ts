import { test, expect } from '@playwright/test'

test('should fill login form, click log in, and set isLoggedIn to true', async ({ page }) => {
  // Navigate to the app
  await page.goto('/')

  // Fill the name field
  await page.getByRole('textbox', { name: 'Name' }).fill('testname')

  // Fill the password field
  await page.getByRole('textbox', { name: 'Password' }).fill('testpassword')

  // Click the log in button
  await page.getByRole('button', { name: 'Log In' }).click()

  // Verify that isLoggedIn is true by checking the login status is displayed
  await expect(page.getByText('Logged In')).toBeVisible()

  await expect(page.getByTestId('login-form-id')).not.toBeVisible()
})
