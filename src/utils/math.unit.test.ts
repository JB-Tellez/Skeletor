import { expect, test } from 'vitest'

const add = (a: number, b: number) => a + b

test('adds numbers correctly in Node', () => {
  expect(add(2, 3)).toBe(5)
})
