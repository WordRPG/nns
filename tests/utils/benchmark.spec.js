import { test } from '@japa/runner'
import { Benchmarker } from '../../src/utils/benchmark.js'

test.group('Benchmark.constructor', () => {
  test('constructor()', ({ assert }) => {
    const benchmark = new Benchmarker({ name  : "test-benchmark" })
    assert.equal(benchmark.name, "test-benchmark")
  })

  test('start()', ({ assert }) => {
    const benchmark = new Benchmarker() 
    benchmark.start("section-a")
    assert.isNotNull(benchmark.benchmarks["section-a"]) 
    assert.isNumber(benchmark.benchmarks["section-a"].start) 

    benchmark.start("section-b")
    assert.lengthOf(Object.keys(benchmark), 2)
  })

  test("end()", ({ assert }) => {
    const benchmark = new Benchmarker() 
    benchmark.start("section-a") 
    benchmark.end("section-a")
    assert.isNumber(benchmark.benchmarks["section-a"].end)
    assert.isNumber(benchmark.benchmarks["section-a"].duration)
    assert.equal(
        benchmark.benchmarks["section-a"].duration,
        benchmark.benchmarks["section-a"].end - 
        benchmark.benchmarks["section-a"].start
    )
  })

  test("summary()", ({ assert }) => {
    const benchmark = new Benchmarker() 
    benchmark.start("section-a") 
    benchmark.end("section-a")
    benchmark.start("section-b") 
    benchmark.end("section-b")
    assert.isString(benchmark.summary())
  })
})
