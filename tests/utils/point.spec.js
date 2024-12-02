import { test } from '@japa/runner'

test.group('Maths.add', () => {
  test('add two numbers', ({ assert }) => {
    assert.equal(1 + 1, 2)
  })
})