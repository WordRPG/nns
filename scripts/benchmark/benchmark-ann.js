import { SearchBenchmark } from "../../src/search/benchmark.js"; 
import { IVFFlat } from "../../src/search/approx/ivf-flat.js";
import * as generate from "nns-lite/src/utils/generate.js"
import { KMeans } from "../../src/utils/kmeans.js";
import * as measures from "nns-lite/src/utils/measures.js"
import { ObjectStorage } from "../../src/utils/store.js";
import { BA2D } from "nns-lite/src/utils/loaders.js"
import { Point } from "../../src/utils/point.js";

// --- store
const store = new ObjectStorage() 

// --- generate points 
console.log("Generating points.") 
// const points = generate.randomPoints(400000, 50)
const points = 
    BA2D
        .load("./data/datasets/word-embeddings/glove-wiki-gigaword-50/vectors.bin", 50)
        .map((point, index) => new Point(index, point))


// --- build indexer 
import fs from "fs"
let indexer = null 

if(!fs.existsSync("./temp/ivf.json")) {
    console.log("Building indexer.")
    indexer = new IVFFlat({
        clustererFn : () => new KMeans({
            clusterCount : 1000, 
            randomState : 1234567890,
            verbose : true
        }),
        measureFn : measures.euclideanDistance
    })
    indexer.build(points, 5)
} else {
    indexer = await store.load(IVFFlat, "./temp/ivf.json")
    indexer.points = points 
    indexer.clusterer.setPoints(points) 
}

console.log("Saving indexer...")
await store.save(indexer, "./temp/ivf.json")

console.log("Search benchmark...")

const benchmark = new SearchBenchmark({
    indexer      : indexer,
    points       : points, 
    target       : points[50], 
    k            : 10,
    measureFn    : measures.euclideanDistance,
    skips        : 1,
    probeCount   : 10
}) 

benchmark.run()
console.log(benchmark.summary())

