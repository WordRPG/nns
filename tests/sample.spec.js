import { test } from '@japa/runner'
import { spy } from "tinyspy"

test.group('Maths.add', () => {
  test('add two numbers', ({ assert }) => {
    assert.equal(1 + 1, 2)
  })

  test('mock fn', ({ assert }) => {
  	const fn = spy() 
  	fn(5, 3)
  	console.log(fn.calls)
	fn.reset()  	
  })
})
