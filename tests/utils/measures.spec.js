import { test } from '@japa/runner'
import { spy } from "tinyspy"

import * as measures from "nns-lite/src/utils/measures.js"
import { Point } from '../../src/utils/point.js'

test.group('Measures', () => {
  test('squaredEuclideanDistance()', ({ assert }) => {
    const distance = measures.squaredEuclideanDistance(
      new Point(null, [1, 2, 3]),
      new Point(null, [9, 8, 7])
    )
    assert.equal(distance, 116)
  })

  test('euclideanDistance()', ({ assert }) => {
    const distance = measures.euclideanDistance(
      new Point(null, [1, 2, 3]),
      new Point(null, [9, 8, 7])
    )
    assert.equal(distance, Math.sqrt(116))
  })

  test('cosineDistance()', ({ assert }) => {
    const cosineDistance = measures.cosineDistance(
      new Point(null, [1, 2, 3]),
      new Point(null, [9, 8, 7])
    )
    assert.equal(cosineDistance, 0.11734101007866327)
  })

  test('manhattanDistance()', ({ assert }) => {
    const manhattanDistance = measures.manhattanDistance(
      new Point(null, [1, 2, 3]),
      new Point(null, [9, 8, 7])
    )
    assert.equal(manhattanDistance, 18)
  })

})
