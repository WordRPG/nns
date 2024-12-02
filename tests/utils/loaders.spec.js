import { test } from '@japa/runner'

import { BA2D, FVecs } from "nns-lite/src/utils/loaders.js"

test.group('BA2D', () => {
	test("must save and load points", ({ assert }) => {
		const points = [[1, 2, 3], [4, 5, 6], [7, 8, 9]] 
		BA2D.save("./temp/points.bin", points, 3)
		const loadedPoints = BA2D.load("./temp/points.bin", 3) 
		assert.deepEqual(loadedPoints, points)
 	})
})

