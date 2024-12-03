/** 
 * Measures
 */
import { cosineSimilarity } from "./operations.js"

/**
 * Squared Euclidean Distance
 */
export function squaredEuclideanDistance(A, B) {
    let distance = 0 
    let dims = A.dimCount()
    for(let i = 0; i < dims; i++) {
        const AB = A.at(i) - B.at(i)
        const ABAB = AB * AB
        distance += ABAB
    }
    return distance
}

/** 
 * Euclidean Distance 
 */
export function euclideanDistance(A, B) {
    return Math.sqrt(squaredEuclideanDistance(A, B))
}

/** 
 * Cosine Distance 
 */
export function cosineDistance(A, B) {
    return 1 - cosineSimilarity(A, B)
}


/**
 * Manhattan Distance
 */
export function manhattanDistance(A, B) {
    let distance = 0 
    let dims = A.dimCount()
    for(let i = 0; i < dims; i++) {
        const AB = Math.abs(A.at(i) - B.at(i))
        distance += AB
    }
    return distance
}
