
import { test } from '@japa/runner'
import { Benchmarker } from '../../src/utils/benchmark.js'

import * as helpers from "nns-lite/src/utils/helpers.js"

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

  test("flatten()", ({ assert }) => {
	const subArrays = [[1, 2, 3], [4, 5, 6],  [7, 8, 9]]
	const flattened = helpers.flatten(subArrays)
	assert.deepEqual(flattened, [1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  test("encodeFloatArrayToBytes()", ({ assert }) => {	
  	const bytes = helpers.encodeFloatArrayToBytes([1.0, 2.0, 3.0])
  	const floatArray = helpers.decodeBytesToFloatArray(bytes)
  	assert.deepEqual(floatArray,  [1.0, 2.0, 3.0])
  })

  
  test("decodeBytesToFloatArray()", ({ assert }) => {	
   	const bytes = helpers.encodeFloatArrayToBytes([1.0, 2.0, 3.0])
   	const floatArray = helpers.decodeBytesToFloatArray(bytes)
   	assert.deepEqual(floatArray,  [1.0, 2.0, 3.0])
  })
 
  test("encodeIntArrayToBytes()", ({ assert }) => {	
  	const bytes = helpers.encodeIntArrayToBytes([1, 2, 3])
  	const floatArray = helpers.decodeBytesToIntArray(bytes)
  	assert.deepEqual(floatArray,  [1, 2, 3])
  })

  
  test("decodeBytesToIntArray()", ({ assert }) => {	
   	const bytes = helpers.encodeIntArrayToBytes([1.0, 2.0, 3.0])
   	const floatArray = helpers.decodeBytesToIntArray(bytes)
   	assert.deepEqual(floatArray,  [1, 2, 3])
  })

  test("encodeFloatArrayToBase64()", ({ assert }) => {	
   	const base64 = helpers.encodeFloatArrayToBase64([1.0, 2.0, 3.0])
   	assert.equal(base64, "AACAPwAAAEAAAEBA")
  })

  test("decodeBase64ToFloatArray()", ({ assert }) => {	
   	const floatArray = helpers.decodeBase64ToFloatArray("AACAPwAAAEAAAEBA")
   	assert.deepEqual(floatArray, [1.0, 2.0, 3.0])
  })

  test("encodeIntArrayToBase64()", ({ assert }) => {	
   	const base64 = helpers.encodeIntArrayToBase64([1, 2, 3])
   	assert.equal(base64, "AQAAAAIAAAADAAAA")
  })

  test("decodeBase64ToIntArray()", ({ assert }) => {	
   	const intArray = helpers.decodeBase64ToIntArray("AQAAAAIAAAADAAAA")
   	assert.deepEqual(intArray, [1, 2, 3])
  })
   
})
