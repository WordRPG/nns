/**
 * Library Registry 
 */
import * as measures from "nns-lite/src/utils/measures.js"

export const registry = {
    measures : {
        "euclidean"            : () => measures.euclideanDistance,
        "cosine"               : () => measures.cosineDistance,
        "manhattan"            : () => measures.manhattanDistance, 
        "invert-euclidean"     : (a, b) => -1 * measures.euclidean(a, b),
        "invert-cosine"        : (a, b) => -1 * measures.cosine(a, b),
        "invert-manhattan"     : (a, b) => -1 * measures.manhattan(a, b),
    }
}