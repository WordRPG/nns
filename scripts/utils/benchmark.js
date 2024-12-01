import { Benchmarker } from "../../src/utils/benchmark.js";

const benchmark = new Benchmarker({ name : "test-benchmark"}) 

// --- benchmark loop a
benchmark.start("loop-1000")
for(let i = 0; i < 1000; i++) {
    Math.random()
}
benchmark.end("loop-1000")

// --- benchmark loop b
benchmark.start("loop-10000")
for(let i = 0; i < 10000; i++) {
    Math.random()
}
benchmark.end("loop-10000")

// --- report summary
console.log(benchmark.summary())