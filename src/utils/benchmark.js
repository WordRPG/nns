/**
 * Benchmarking Utility
 */

export class Benchmarker 
{
    constructor({
        name = "unnamed"
    } = {}) {
        this.name = name
        this.benchmarks = {}
    }

    /** 
     * Gets the current system time.
     */
    getTime() {
        return performance.now() / 1000
    }

    /** 
     * Marks the start of a benchmark record.
     */
    start(name) {
        // --- create benchmark record 
        const record = {} 
        
        // --- assign start time 
        record.start = this.getTime() 

        // --- save record 
        this.benchmarks[name] = record 
    }

    /** 
     * Marks the end of a benchmark record.
     */
    end(name) {
        // --- retrieve benchmark record 
        const record = this.benchmarks[name] 

        // --- assign end time 
        record.end = this.getTime() 

        // --- compute duration 
        const duration = record.end - record.start 
        record.duration = duration 
    }

    /**
     * Marks the duration of a benchmark record.
     */
    duration(name) {
        return this.benchmarks[name].duration 
    }

    /** 
     * Returns a string containing the 
     * summary of the benchmarks. 
     */
    summary() {
        let output = "" 
        output += `BENCHMARK [${this.name}]\n` 
        for(let benchmarkName in this.benchmarks) {
            const duration = this.duration(benchmarkName)
            output += `\t${benchmarkName} -> ${duration}\n`
        } 
        return output
    }
}

