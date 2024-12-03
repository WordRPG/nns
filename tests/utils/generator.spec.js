import { test } from '@japa/runner'
import { spy } from "tinyspy"

import { Point } from '../../src/utils/point.js'
import * as generate from "nns-lite/src/utils/generate.js"

test.group('Generate', () => {
  test('randomPoint()', ({ assert }) => {
    assert.isTrue(generate.randomPoint(10) instanceof Point)
  })

  test('randomPoints()', ({ assert }) => {
    const points = generate.randomPoints(10, 5)
    assert.isArray(points)
    assert.doesNotThrow(() => {
      points.forEach((point, index) => {
        assert.isTrue(point instanceof Point)
        assert.equal(point.id, index)
      })
    })
  })
})
