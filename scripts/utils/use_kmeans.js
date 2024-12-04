import { KMeans } from "../../src/utils/kmeans.js"; 
import * as generate from "nns-lite/src/utils/generate.js"
import * as measures from "nns-lite/src/utils/measures.js"
import { Point } from "../../src/utils/point.js";

const POINT_COUNT = 1000
const DIM_COUNT = 2

// --- initialize random points --- //
console.log("Initializing random points...")
const points = generate.randomPoints(POINT_COUNT, DIM_COUNT)
console.log("\tPoint Count : " + points.length)

// --- initialize k-means --- //
console.log("Initialize K-means...")
const indexer = new KMeans({
    clusterCount : 10,
    centroidStrategy : "kmeans++", 
    measureFn : measures.euclideanDistance
})
indexer.setPoints(points) 

// --- fit k-means --- //
indexer.fit(10)

console.log(indexer.predictAll(new Point(null, [3, 9])))