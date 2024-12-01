
import { test } from '@japa/runner'
import { Benchmarker } from '../../src/utils/benchmark.js'

import { Logger } from '../../src/utils/logger.js'

test.group('Logger', () => {
  test('log()', ({ assert }) => {
    const logger = new Logger()
    logger.logFn = (...args) => args.join("")
    assert.equal(logger.log("hello", "hi"), "hello hi\n")
  })

  test('verboseLog() - should print', ({ assert }) => {
    const logger = new Logger()
    logger.verbose = true
    logger.logFn = (...args) => args.join("")
    assert.equal(logger.verboseLog("hello"), "hello\n")
  })

  test('verboseLog() - should not print', ({ assert }) => {
    const logger = new Logger()
    logger.verbose = false
    logger.logFn = (...args) => args.join("")
    assert.equal(logger.verboseLog("hello"), undefined)
  })
})
