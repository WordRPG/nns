/**
 * Base Indexer Class 
 */
import * as measures from "nns-lite/src/utils/measures.js"

export class Indexer 
{
    static NNS = 0
    static FNS = 1

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
        throw new Error("Must implement .construct()")
    }
    

    /// --- TREE QUERIES --- // 
    query(target, k, mode = Indexer.NNS) {
        throw new Error("Must implement .query()")
    }
}