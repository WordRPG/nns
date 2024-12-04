/**
 * Simple IVF Flat Implementaion
 */
import * as measures from "nns-lite/src/utils/measures.js"
import * as operations from "nns-lite/src/utils/operations.js"
import * as helpers from "nns-lite/src/utils/helpers.js"
import { KMeans } from "../../utils/kmeans.js"
import { Indexer } from "../indexer.js"
import { Heap } from "../../utils/heap.js"

export class IVFFlat 
{
    constructor({
        clustererFn = () => new KMeans({
            centroidCount : 100, 
            randomState : 1234567890
        }),
        measureFn = measures.euclideanDistance,
        verbose = true
    } = {}) {
        this.clustererFn = clustererFn
        this.clusterer = this.clustererFn()
        this.measureFn = measureFn
        this.clusterer.measureFn = this.measureFn
        this.verbose = verbose 
    }

    /**
     * Fit the IVF flat for n iterations.
     */
    build(points, iterCount = 10) {
        if(this.verbose) {
            console.log("--- Fitting IVF-Flat")
        }
        this.points = points 
        this.clusterer.setPoints(this.points)
        this.clusterer.fit(iterCount)
    }

    /**
     * Predict using k-means clusterer of this IVF-Flat object..
     */
    query(target, k, probeCount = 3) {
        // --- find closest centroids
        const clusterCount = this.clusterer.clusterCount
        const closestCentroids = this.closestCentroids(target, clusterCount)

        // --- heap for closest points
        const heap = new Heap({
            comparator: (a, b) => b[1] - a[1],
            maxSize : k
        })


        // --- find closest points
        let probedCount = 0 
        while(probedCount < probeCount || heap.size() < k) {
            const probeClusterId = closestCentroids[probedCount][0]
            const clusterPointIds = this.clusterer.clusterAssignments[probeClusterId]
            const clusterPoints = clusterPointIds.map(id => this.points[id]) 

            for(let clusterPoint of clusterPoints) {
                const distance = this.measureFn(clusterPoint, target)
                if(heap.size() < k || distance < heap.peek()[1]) {
                    heap.push([clusterPoint.id, distance])
                }
            }

            probedCount += 1
        }

        // --- return results 
        const results = heap.extract()
        results.reverse() 

        return results
    } 

    /** 
     * Get sorted centroids from targets.
     */
    closestCentroids(target) {
        return this.clusterer.predictAll(target)
    }

}