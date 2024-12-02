import { test } from '@japa/runner'

import { Point } from "nns-lite/src/utils/point.js"

test.group('Point', () => {
  test('constructor()', ({ assert }) => {
    const point = new Point(1, [1, 2, 3])
    assert.equal(point.id, 1)
    assert.deepEqual(point.value, [1, 2, 3]) 
  })

  test('toString()', ({ assert }) => {
  	const point = new Point(1, [1, 2, 3])
  	assert.equal(point.toString(), "Point[1](1, 2, 3)")
  })

  test('at()', ({ assert }) => {
  	const point = new Point(1, [1, 2, 3])
  	assert.equal(point.at(0), 1)
	assert.equal(point.at(1), 2)
  	assert.equal(point.at(2), 3)	  	
  })

  test('dimCount()', ({ assert }) => {
	const point = new Point(1, [1, 2, 3])
	assert.equal(point.dimCount(), 3)
  })

  test('toJSON()', ({ assert }) => {
	const point = new Point(1, [1, 2, 3])
	assert.deepEqual(point.toJSON(), { 
		id: 1,
		value :"AACAPwAAAEAAAEBA"
	})
  })

  test('fromJSON()', ({ assert }) => {
  	const serialized = { 
  		id : 1, 
  		value : "AACAPwAAAEAAAEBA" 
  	}
  	const point = Point.fromJSON(serialized)
  	assert.equal(point.id, 1)
  	assert.deepEqual(point.value, [1, 2, 3])
  })
})
