/**
 * Searching Utility 
 */

import { settings } from "../../settings.js";
import * as generate from "nns-lite/src/utils/generate.js"
import { Benchmarker } from "../../src/utils/benchmark.js";
import * as measures from "nns-lite/src/utils/measures.js"
import * as operations from "nns-lite/src/utils/measures.js"
import { registry } from "../../src/registry.js";

export class SearchPipeline 
{
    constructor() {
        this.benchmark = new Benchmarker({ name: "search-pipeline" })
        this.points  = null 
        this.indexer = null
    }

    generatePoints() {
        this.benchmark.start("generate-points")
        const points = generate.randomPoints(
            settings.search.pointCount,
            settings.search.dimCount
        )
        this.points = points
        this.benchmark.end("generate-points")
    }
    

    buildIndexer() {
        this.benchmark.start("build-indexer") 
        this.benchmark.end("build-indexer")
    }

    runQuery() {
        this.benchmark.start("run-query") 
        const target = this.indexer.points[settings.search.target] 
        const k = settings.search.queryCount
        const mode = settings.search.mode
        this.results = this.indexer.query(target, k, mode)
        this.benchmark.end("run-query")
    }

    displayBuildInfo() {
        console.log(JSON.stringify(this.indexer.buildInfo, null, 4))
    }

    displayResults() {
        console.log(JSON.stringify(this.results, null, 4))
    }

    displayBenchmarks() {
        console.log(this.benchmark.summary())
    }

    run() {
        console.log("--- Generating points.")
        this.generatePoints()
        console.log("--- Building indexer.")
        this.buildIndexer() 
        console.log("--- Running query.")
        this.runQuery()
        console.log("--- Display build info.")
        this.displayBuildInfo()
        console.log("--- Display results.")
        this.displayResults()
        console.log("--- Display benchmarks.")
        this.displayBenchmarks()
    }
}