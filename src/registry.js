/**
 * Library Registry 
 */
import * as measures from "nns-lite/src/utils/measures.js"

export const registry = {
    measures : {
        "euclidean"              : (a, b) => measures.euclideanDistance(a, b),
        "cosine"                 : (a, b) => measures.cosineDistance(a, b),
        "manhattan"              : (a, b) => measures.manhattanDistance(a, b)

    }
}