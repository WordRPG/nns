/** 
 * Common math operations.
 */
import { Point } from "./point.js"
import { Heap } from "./heap.js"

/** 
 * Gets the magnitude of a point/vector. 
 */
export function magnitude(vector) {
    const sumOfSquares = vector.value.reduce((a, b) => a + (b * b), 0)
    const magnitude_ = Math.sqrt(sumOfSquares)
    return magnitude_
}

/** 
 * Gets the normalized form of a vector.
 */
export function normalize(vector) {
    const magnitude_ = magnitude(vector)
    const normalized = vector.value.map((x) => x / magnitude_)
    return new Point(null, normalized)
}

/** 
 * Gets the dot product of two vectors. 
 */
export function dotProduct(A, B) {
    const dims = A.dimCount()
    let dotProduct_ = 0 
    for(let i = 0; i < dims; i++) {
        dotProduct_ += A.at(i) * B.at(i)
    }
    return dotProduct_
}

/** 
 * Gets the dot cosine similarity of two vectors. 
 */
export function cosineSimilarity(A, B) {
    const dotProduct_ = dotProduct(A, B)
    const denominator = magnitude(A) * magnitude(B)
    return dotProduct_ / denominator
}

/** 
 * Gets the centroid of a given set of points. 
 */
export function centroid(X) {
    const dimCount = X[0].dimCount()
    let centroid = new Array(dimCount).fill(0)
    for(let i = 0; i < X.length; i++) {
        for(let j = 0; j < dimCount; j++) {
            centroid[j] += X[i].at(j)
        } 
    }
    centroid = centroid.map(x => x / X.length) 
    return new Point(null, centroid)
}

/** 
 * Computes the distances of a point to other points.
 */
export function distances(point, points, measureFn) {
    let distances = []
    for(let i = 0; i < points.length; i++) {
        const otherPoint = points[i]
        const distance = measureFn(point, otherPoint)
        distances.push([i, distance])
    } 
    return distances
}

/** 
 * Gets nearest k neighbors of a target from a point set
 * using heap method.
 */
export function nearestK(points, target, k, measureFn) {
    const distances = []
    for(let i = 0; i < points.length; i++) {
        const distance = measureFn(points[i], target)
        const record = [i, distance]
        distances.push(record)
    }
    distances.sort((a, b) => a[1] - b[1])
    return distances.slice(0, k)
}

/** 
 * Gets farthest k neighbors of a target from a point set
 * using heap method.
 */
export function farthestK(points, target, k, measureFn) {
    const distances = []
    for(let i = 0; i < points.length; i++) {
        const distance = measureFn(points[i], target)
        const record = [i, distance]
        distances.push(record)
    }
    distances.sort((a, b) => a[1] - b[1])
    return distances.slice(0, k)
}


/** 
 * Gets nearest first neighbor of a target from a point set.
 */
export function nearestFirst(points, target, measureFn) {
    let minDistance = Infinity 
    let minIndex = 0 
    for(let i = 0; i < points.length; i++) {
        const otherPoint = points[i]
        const distance = measureFn(target, otherPoint) 
        if(distance < minDistance) {
            minDistance = distance
            minIndex = i
        }
    }
    return [minIndex, minDistance]
}

/** 
 * Gets farthest first neighbor of a target from a point set.
 */
export function farthestFirst(points, target, measureFn) {
    let maxDistance = -Infinity 
    let maxIndex = 0 
    for(let i = 0; i < points.length; i++) {
        const otherPoint = points[i]
        const distance = measureFn(target, otherPoint) 
        if(distance > maxDistance) {
            maxDistance = distance
            maxIndex = i
        }
    }
    return [maxIndex, maxDistance]
}


/** 
 * Gets the radius of a given set of points.
 */
export function radius(points, measureFn) {
    const centroid_ = centroid(points, measureFn) 
    const [_, radius] = farthestFirst(points, centroid_, measureFn) 
    return radius
}

/** 
 * Projects a point onto a line. 
 */
export function projectPointToLine(A, B, C) {
    const AB = B.value.map((b, i) => b - A.at(i));
    const AC = C.value.map((c, i) => c - A.at(i));
    const dotProductAC_AB = AC.reduce((sum, ac, i) => sum + ac * AB[i], 0);
    const dotProductAB_AB = AB.reduce((sum, ab) => sum + ab * ab, 0);
    const scalar = dotProductAC_AB / dotProductAB_AB;
    const projection = AB.map(ab => scalar * ab);
    const projectedPoint = A.value.map((a, i) => a + projection[i]);
    return new Point(null, projectedPoint);
}


/** 
 * Swap array elements.
 */
export function swapArray(array, i, j) {
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
}