import { BallTree } from "nns-lite";
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
    pipeline.indexer = new BallTree({
        measureFn : registry.measures[settings.search.measure]
    })
    pipeline.indexer.build(pipeline.points)
    pipeline.benchmark.end("build-indexer")
}

// --- run pipeline --- //
pipeline.run()