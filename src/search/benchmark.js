import * as measures from "nns-lite/src/utils/measures.js"
import * as operations from "nns-lite/src/utils/operations.js"
import { BruteForceNNS } from "./exact/brute_force/brute-force-nns.js"
import { Benchmarker } from "../utils/benchmark.js"

export class SearchBenchmark {
    constructor({
        indexer = null,
        points = null,  
        target = null,
        k = null, 
        measureFn = null,
        skips = null,
        probeCount = null
    }) {
        this.indexer = indexer
        this.points = points 
        this.target = target 
        this.k = k
        this.measureFn = measureFn
        this.skips = skips
        this.probeCount = probeCount
    }

    run(verbose = false) {
        const benchmark = new Benchmarker()
        
        // --- query exact 
        const exact = new BruteForceNNS({ measureFn : this.measureFn }) 
        exact.build(this.points)
        benchmark.start("exact")
        const expected = exact.query(this.target, this.maxTolerance)
        benchmark.end("exact")

        // --- query indexer 
        const indexer = this.indexer 
        benchmark.start("approx")
        const observed = indexer.query(this.target, this.k, this.probeCount)
        benchmark.end("approx")

        // --- compute results 
        const recalls = {}
        const invRecalls = {}

        let i = 0
        while(i < expected.length) {
            const recall = 
                this.computeRecall(expected.slice(0, i), observed, i)
            const invRecall = 
                this.computeInvRecall(expected.slice(0, i), observed, i)

            if(this.verbose) {
                console.log(`Recall [${i}] - ${recall}`)
                console.log(`\t${expected.map(x => x[0])}`) 
                console.log(`\t${observed.map(x => x[0])}`)
            }
            recalls[i] = recall
            invRecalls[i] = invRecall

            if(recall === 1.0 && invRecall === 1.0) {
                break 
            }

            i += this.skips
        }

        this.recalls = recalls   
        this.invRecalls = invRecalls  
        
        this.times = benchmark.benchmarks
    }

    computeRecall(expected, observed, i) {
        const expectedIds = new Set([...expected.map(x => x[0])])
        const observedIds = observed.map(x => x[0])
        let correct = 0 
        for(let observedId of observedIds) {
            if(expectedIds.has(observedId)) {
                correct += 1
            }
        }
        return correct / observed.length 
    }

    computeInvRecall(expected, observed, i) {
        const expectedIds = new Set([...expected.map(x => x[0])])
        const observedIds = observed.map(x => x[0])
        let correct = observed.length
        for(let observedId of observedIds) {
            if(!expectedIds.has(observedId)) {
                correct -= 1
            }
        }
        return correct / observed.length 
    }

    summary() {
        let output = "" 
        output += "BENCHMARK\n"
        output += "---------------------------------------\n"
        
        for(let key in this.recalls) {
            output += `\tRecall [${key}] - ${this.recalls[key]} | `
            output += `Inv. Recall [${key}] - ${this.invRecalls[key]}\n`
        }
        output += "Exact : " + this.times["exact"].duration + "\n"
        output += "Approx. : " + this.times["approx"].duration + "\n"

        return output
    }
}