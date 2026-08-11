import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react';
import FunkyButton from './FunkyButton';

test('renders component and registers real click events', async () => {
  let clicked = false
  
  const screen = await render(
    <FunkyButton onClick={() => clicked = true}>Click Me</FunkyButton>
  )

  const button = screen.getByText('Click Me')
  await button.click()

  expect(clicked).toBe(true)
})