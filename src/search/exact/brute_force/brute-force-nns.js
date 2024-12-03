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
     * Creates brute force indexer.
     * @param {Object} options 
     * @param {Function} options.measureFn - the measure function to use 
     */
    constructor(options) {
        super(options)

        // --- whether the tree supports FNS or not
        this.supportsFNS = true
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
    query(target, k, mode = Indexer.NNS) {
        if(mode == Indexer.NNS) {
            return operations.nearestK(this.points, target, k, this.measureFn)
        } 
        else if (mode == Indexer.FNS) {
            return operations.farthestK(this.points, target, k, this.measureFn)
        }
        else {
            throw new Error("Unknown mode.")
        }
    }
}