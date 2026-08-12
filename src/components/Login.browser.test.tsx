import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react';
import Login from './Login';

test('renders login form', async () => {
  const screen = await render(
    <Login onLogin={() => {}} />
  )

  // Verify form elements are rendered
  const nameInput = screen.getByPlaceholder('Name')
  const passwordInput = screen.getByPlaceholder('Password')
  const loginButton = screen.getByRole('button', { name: 'Log In' })

  expect(nameInput).toBeTruthy()
  expect(passwordInput).toBeTruthy()
  expect(loginButton).toBeTruthy()
})

test('calls onLogin with name and password when logging in', async () => {
  let receivedName = ''
  let receivedPassword = ''
  
  const screen = await render(
    <Login onLogin={(name, password) => { receivedName = name; receivedPassword = password }} />
  )

  const nameInput = screen.getByPlaceholder('Name')
  const passwordInput = screen.getByPlaceholder('Password')
  const loginButton = screen.getByRole('button', { name: 'Log In' })

  // Fill the form
  await nameInput.fill('testname')
  await passwordInput.fill('testpassword')

  // Click log in
  await loginButton.click()

  // Verify onLogin was called with both name and password
  expect(receivedName).toBe('testname')
  expect(receivedPassword).toBe('testpassword')
})
