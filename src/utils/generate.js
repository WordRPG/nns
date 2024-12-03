/**
 * Generation library.
 */

import { Random } from "./random.js";
import { settings } from "nns-lite/settings.js"
import { Point } from "./point.js";

const defaultGenerator = new Random(settings.random.randomState) 

export function randomPoint(dims = 5, generator = defaultGenerator) {
    const point = []
    for(let i = 0; i < dims; i++) {
        point.push(
            generator.uniform(
                settings.random.coordMin, 
                settings.random.coordMax
            )
        )
    }
    return new Point(null, point)
}

export function randomPoints(count = 10, dims = 5, generator = defaultGenerator) {
    const points = []
    for(let i = 0; i < count; i++) {
        points.push(randomPoint(dims, generator))
        points[i].id = i
    }
    return points
}