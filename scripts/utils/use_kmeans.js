import { KMeans } from "../../src/utils/kmeans.js"; 
import * as generate from "nns-lite/src/utils/generate.js"
import * as measures from "nns-lite/src/utils/measures.js"
import { Point } from "../../src/utils/point.js";
import { registry } from "../../src/registry.js";

const POINT_COUNT = 10000
const DIM_COUNT = 50

// --- initialize random points --- //
console.log("Initializing random points...")
const points = generate.randomPoints(POINT_COUNT, DIM_COUNT)
console.log("\tPoint Count : " + points.length)

// --- initialize k-means --- //
console.log("Initialize K-means...")
const indexer = new KMeans({
    clusterCount : 10,
    centroidStrategy : "random", 
    measureFn : registry.measures["inverted-euclidean"],
    verbose : true
})
indexer.setPoints(points) 

// --- fit k-means --- //
indexer.fit(10)

// --- predict --- /
console.log(indexer.predictAll(generate.randomPoint(DIM_COUNT)))
console.log(indexer.clusterAssignments)