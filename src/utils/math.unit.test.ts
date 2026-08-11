import { expect, test } from 'vitest'
import { add } from './math'

test('adds numbers correctly in Node', () => {
  expect(add(2, 3)).toBe(5)
})
