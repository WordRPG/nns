import { IVFFlat } from "nns-lite";
import { SearchPipeline } from "../pipeline.js";
import { settings } from "../../../settings.js";
import * as measures from "nns-lite/src/utils/measures.js"
import * as operations from "nns-lite/src/utils/measures.js"
import { registry } from "../../../src/registry.js";
import { KMeans } from "../../../src/utils/kmeans.js";

// --- create pipeline --- //
const pipeline = new SearchPipeline() 

// --- modify pipeline --- // 
pipeline.buildIndexer = () => {
    pipeline.benchmark.start("build-indexer")
    pipeline.indexer = new IVFFlat({
        clustererFn : () => {
            return new KMeans({
                clusterCount : 1000, 
                centroidStrategy : "random",
                verbose : true,
                randomState : 1234567890,
            })
        },
        measureFn : registry.measures["euclidean"]
    })
    pipeline.indexer.build(pipeline.points, 3)
    pipeline.benchmark.end("build-indexer")
}

pipeline.runQuery = () =>{
    pipeline.benchmark.start("run-query") 
    const target = pipeline.indexer.points[settings.search.target] 
    const k = settings.search.queryCount
    const mode = settings.search.mode
    pipeline.results = pipeline.indexer.query(target, k, mode, true)
    pipeline.benchmark.end("run-query")
}


// --- run pipeline --- //
pipeline.run()