import { test } from '@japa/runner'
import { spy } from "tinyspy"

import * as operations from "nns-lite/src/utils/operations.js"
import * as measures from "nns-lite/src/utils/measures.js"

import { Point } from '../../src/utils/point.js'

test.group('Operations', () => {
  test('magnitude()', ({ assert }) => {
    const magnitude = operations.magnitude(new Point(null, [1, 2, 3]))
    assert.equal(magnitude.toFixed(3), 3.742)
  })

  test('normalize()',  ({ assert }) => {
    const normalized = operations.normalize(new Point(null, [7, 8, 9])) 
    assert.deepEqual(
      normalized.value.map(x => parseFloat(x.toFixed(2))), 
      [0.5, 0.57, 0.65]
    )
  })

  test('dotProduct()',  ({ assert }) => {
    const dotProduct = operations.dotProduct(
      new Point(null, [1, 2, 3]), 
      new Point(null, [9, 8, 7])
    ) 
    assert.equal(dotProduct, 46)
  })

  test('cosineSimilarity()',  ({ assert }) => {
    const cosineSim = operations.cosineSimilarity(
      new Point(null, [1, 2, 3]), 
      new Point(null, [9, 8, 7])
    ) 
    assert.equal(cosineSim.toFixed(2), 0.88)
  })

  test('centroid', ({ assert }) => {
    const pointSet = [
      new Point(null, [1.5, 2.9, 3.2]),
      new Point(null, [3.5, 5.2, 6.8]),
      new Point(null, [7.8, 8.5, 9.4])
    ]
    const centroid = operations.centroid(pointSet, measures.euclideanDistance)
    assert.deepEqual(
      centroid.value.map(x => parseFloat(x.toFixed(2))), 
      [4.27, 5.53, 6.47]
    )
  })

  test('distances', ({ assert }) => {
    const pointSet = [
      new Point(null, [1.5, 2.9, 3.2]),
      new Point(null, [3.5, 5.2, 6.8]),
      new Point(null, [7.8, 8.5, 9.4]),
    ]
    const keyPoint = new Point(null, [1, 2, 3])

    const distances = operations.distances(
      keyPoint,
      pointSet, 
      measures.euclideanDistance
    )

    assert.deepEqual(
      distances.map(x => parseFloat(x[1].toFixed(2))), 
      [1.05, 5.56, 11.38]
    )
  })

  test("nearestK", ({ assert }) => {
    const pointSet = [
      new Point(null, [1.5, 2.9, 3.2]),
      new Point(null, [3.5, 5.2, 6.8]),
      new Point(null, [7.8, 8.5, 9.4]),
      new Point(null, [2.5, 3.9, 3.2]),
      new Point(null, [3.8, 5.2, 4.8]),
      new Point(null, [8.8, 8.5, 5.4]),
    ]
    const keyPoint = new Point(null, [1, 2, 3])

    const distances = operations.nearestK(
      pointSet, 
      keyPoint,
      2,
      measures.euclideanDistance
    )

    assert.deepEqual(distances.map(x => x[0]), [0, 3])
    assert.deepEqual(distances.map(x => parseFloat(x[1].toFixed(2))), [1.05, 2.43])
  })

  test("farthestK", ({ assert }) => {
    const pointSet = [
      new Point(null, [1.5, 2.9, 3.2]),
      new Point(null, [3.5, 5.2, 6.8]),
      new Point(null, [7.8, 8.5, 9.4]),
      new Point(null, [2.5, 3.9, 3.2]),
      new Point(null, [3.8, 5.2, 4.8]),
      new Point(null, [8.8, 8.5, 5.4]),
    ]
    const keyPoint = new Point(null, [1, 2, 3])

    const distances = operations.farthestK(
      pointSet, 
      keyPoint,
      2,
      measures.euclideanDistance
    )

    assert.deepEqual(distances.map(x => x[0]), [2, 5])
    assert.deepEqual(distances.map(x => parseFloat(x[1].toFixed(2))), [11.38, 10.43])
  })

  test("nearestFirst", ({ assert }) => {
    const pointSet = [
      new Point(null, [1.5, 2.9, 3.2]),
      new Point(null, [3.5, 5.2, 6.8]),
      new Point(null, [7.8, 8.5, 9.4]),
      new Point(null, [2.5, 3.9, 3.2]),
      new Point(null, [3.8, 5.2, 4.8]),
      new Point(null, [8.8, 8.5, 5.4]),
    ]
    const keyPoint = new Point(null, [1, 2, 3])

    const nearest = operations.nearestFirst(
      pointSet, 
      keyPoint,
      measures.euclideanDistance
    )

    assert.equal(nearest[0], 0)
    assert.equal(nearest[1], 1.0488088481701514)
  })

  test("farthestFirst", ({ assert }) => {
    const pointSet = [
      new Point(null, [1.5, 2.9, 3.2]),
      new Point(null, [3.5, 5.2, 6.8]),
      new Point(null, [7.8, 8.5, 9.4]),
      new Point(null, [2.5, 3.9, 3.2]),
      new Point(null, [3.8, 5.2, 4.8]),
      new Point(null, [8.8, 8.5, 5.4]),
    ]
    const keyPoint = new Point(null, [8, 8, 5])

    const farthest = operations.farthestFirst(
      pointSet, 
      keyPoint,
      measures.euclideanDistance
    )

    assert.equal(farthest[0], 0)
    assert.equal(farthest[1], 8.45576726264388)

  })

  test("radius", ({ assert }) => {
    const pointSet = [
      new Point(null, [1.5, 2.9, 3.2]),
      new Point(null, [3.5, 5.2, 6.8]),
      new Point(null, [7.8, 8.5, 9.4]),
      new Point(null, [2.5, 3.9, 3.2]),
      new Point(null, [3.8, 5.2, 4.8]),
      new Point(null, [8.8, 8.5, 5.4]),
    ]

    const radius = operations.radius(pointSet, measures.euclideanDistance)
    
    assert.equal(radius, 5.764860025283451)
  })

  test("projectPointToLine", ({ assert }) => {
    const A = new Point(null, [1.2, 3.9, 9.7])
    const B = new Point(null, [3.5, 4.1, 3.4])
    const C = new Point(null, [4.5, 3.0, 3.1])
    const projection = operations.projectPointToLine(A, B, C)
    assert.deepEqual(
      projection.value.map(x => parseFloat(x.toFixed(2))), 
      [3.70, 4.12, 2.84]
    )
  })
})
