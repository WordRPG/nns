/**
 * Library Registry 
 */
import * as measures from "nns-lite/src/utils/measures.js"

export const registry = {
    measures : {
        "euclidean"              : (a, b) => measures.euclideanDistance(a, b),
        "cosine"                 : (a, b) => measures.cosineDistance(a, b),
        "manhattan"              : (a, b) => measures.manhattanDistance(a, b), 
        "inverted-euclidean"     : (a, b) =>  2147483647 * measures.euclideanDistance(a, b),
        "inverted-cosine"        : (a, b) =>  2147483647 * measures.cosineDistance(a, b),
        "inverted-manhattan"     : (a, b) =>  2147483647 * measures.manhattanDistance(a, b),
    }
}