/**
 * Base Indexer Class 
 */
import * as measures from "nns-lite/src/utils/measures.js"

export class Indexer 
{
    constructor(options) {
        this.measureFn = options.measureFn
        this.points = null 
    }

    /// --- TREE CONSTRUCTION --- /// 
    build(points) {
        this.points = points 
        this.create() 
    }

    create() {
        throw new Error("Must implement .create()")
    }

    /// --- TREE QUERIES --- // 
    query(target, k) {
        throw new Error("Must implement .query()")
    }
}