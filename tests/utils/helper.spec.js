
import { test } from '@japa/runner'
import { Benchmarker } from '../../src/utils/benchmark.js'

import * as helpers from "$/src/utils/helpers.js"

test.group('helpers', () => {
  test('repeat()', ({ assert }) => {
    const repeated = helpers.repeat("hello", 5) 
    assert.equal(repeated, "hellohellohellohellohello")
  })

  test("indent()", ({ assert }) => {
    const indented = helpers.indent("a\nb\nc", 3, "-")
    assert.equal(indented, "---a\n---b\n---c\n")
  })

  test("partition() - no remainder",  ({ assert }) => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const subArrays = helpers.partition(array, 3)
    assert.lengthOf(subArrays, 4)
    assert.deepEqual(subArrays, [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]])
  })


  test("partition() - with remainder",  ({ assert }) => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const subArrays = helpers.partition(array, 5)
    assert.lengthOf(subArrays, 3)
    assert.deepEqual(subArrays, [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12]])
  })

  test("subdivide() - invalid split count",  ({ assert }) => {
    assert.throws(() => {
        helpers.subdivide([1, 2, 3, 4, 5], [1, 2, 3])
    })
  })

  test("subdivide() - splits properly",  ({ assert }) => {
    const subArrays = helpers.subdivide([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 3)
    assert.deepEqual(subArrays, [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
  })
})
