import { BruteForceNNS } from "nns-lite";
import { SearchPipeline } from "../pipeline.js";
import { settings } from "../../../settings.js";
import * as measures from "nns-lite/src/utils/measures.js"
import * as operations from "nns-lite/src/utils/measures.js"
import { registry } from "../../../src/registry.js";

// --- create pipeline --- //
const pipeline = new SearchPipeline() 

// --- modify pipeline --- // 
pipeline.buildIndexer = () => {
    pipeline.benchmark.start("build-indexer")
    pipeline.indexer = new BruteForceNNS({
        measureFn : registry.measures["euclidean"]
    })
    pipeline.indexer.build(pipeline.points)
    pipeline.benchmark.end("build-indexer")
}

pipeline.runQuery = () =>{
    pipeline.benchmark.start("run-query") 
    const target = pipeline.indexer.points[settings.search.target] 
    const k = settings.search.queryCount
    const mode = settings.search.mode
    pipeline.results = pipeline.indexer.query(target, k, true)
    pipeline.benchmark.end("run-query")
}

// --- run pipeline --- //
pipeline.run()