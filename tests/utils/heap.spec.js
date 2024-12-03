import { test } from '@japa/runner'
import { spy } from "tinyspy"

import { Heap } from '../../src/utils/heap.js'

test.group('Heap [No. Max Size]', () => {
  test('works properly', ({ assert }) => {
    const heap = new Heap({ comparator: (a, b) => a - b, maxSize: Infinity }) 
    const items = [5, 4, 3, 2, 1, 6, 7, 8, 9]
    for(let item of items) {
        heap.push(item)
    }
    assert.deepEqual(
        heap.toArray().map(x => parseInt(x)), 
        [1, 2, 3, 4, 5, 6, 7, 8, 9]
    )
  })
})

test.group('Heap [With. Max Size]', () => {
    test('works properly', ({ assert }) => {
      const heap = new Heap({ comparator: (a, b) => b - a, maxSize: 5 }) 
      const items = [5, 4, 3, 2, 1, 6, 7, 8, 9]
      for(let item of items) {
          heap.push(item)
      }
      assert.deepEqual(
        heap.toArray().map(x => parseInt(x)), 
        [5, 4, 3, 2, 1]
      )
    })
})
