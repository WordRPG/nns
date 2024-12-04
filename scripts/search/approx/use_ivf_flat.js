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
                clusterCount : 100, 
                centroidStrategy : "random",
                verbose : true,
                randomState : 1234567890
            })
        },
        measureFn : registry.measures[settings.search.measure]
    })
    pipeline.indexer.build(pipeline.points)
    pipeline.benchmark.end("build-indexer")
}

// --- run pipeline --- //
pipeline.run()