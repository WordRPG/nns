import { test } from '@japa/runner'
import { spy } from "tinyspy"

import { Random } from '../../src/utils/random.js'

const random = new Random(1234567890)

test.group('Random', () => {
  test('randint', ({ assert }) => {
    assert.isNumber(random.randInt(1, 100))
  })

  test('uniform', ({ assert }) => {
    assert.isNumber(random.randInt(1, 100))
  })
  
  test('normal', ({ assert }) => {
    assert.isNumber(random.randInt(1, 100))
  })

  test('choice', ({ assert }) => {
    assert.isNumber(random.choice([1, 2, 3]))
  })

  test('sample', ({ assert }) => {
    assert.isArray(random.sample([1, 2, 3], 2))
  })
})
