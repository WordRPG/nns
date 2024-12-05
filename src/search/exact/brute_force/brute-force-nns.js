/** 
 * Brute Force NNS
 * ---
 * Brute force nearest neighbor search.
 */
import * as measures from "nns-lite/src/utils/measures.js"
import * as operations from "nns-lite/src/utils/operations.js"
import { Indexer } from "../../indexer.js"

export class BruteForceNNS extends Indexer
{
    /** 
     * @param {Object} options 
     * @param {Function} options.measureFn - the measure function to use 
     */
    constructor(options) {
        super(options)
    }

    // --- TREE CONSTRUCTION ---  // 
    
    /**
     * Creates the indexer. 
     */
    create() {
        return 
    }

    // --- TREE QUERIES --- // 

    /** 
     * Queries the tree.
     */
    query(target, k, farthest) {
        if(!farthest) {
            return operations.nearestK(this.points, target, k, this.measureFn)
        } else {
            return operations.farthestK(this.points, target, k, this.measureFn)
        }
    }
}