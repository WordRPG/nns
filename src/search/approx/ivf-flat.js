/**
 * Simple IVF Flat Implementaion
 */
import * as measures from "nns-lite/src/utils/measures.js"
import * as operations from "nns-lite/src/utils/operations.js"
import * as helpers from "nns-lite/src/utils/helpers.js"
import { KMeans } from "../../utils/kmeans.js"
import { Indexer } from "../indexer.js"
import { Heap } from "../../utils/heap.js"
import { Benchmarker } from "../../utils/benchmark.js"
import { Point } from "../../utils/point.js"

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
    query(target, k, probeCount = 10) {
        // --- find closest centroids
        this.clusterer.clusterCount = this.clusterer.centroids.length
        const clusterCount = this.clusterer.clusterCount

        const benchmark = new Benchmarker() 

        benchmark.start("closest-centroids")
        const closestCentroids = this.closestCentroids(target, clusterCount)
        benchmark.end("closest-centroids")

        // --- heap for closest points
        const heap = new Heap({
            comparator: (a, b) => b[1] - a[1],
            maxSize : k
        })

        // --- find closest points
        benchmark.start("closest-points")



        let probedCount = 0 
        while(probedCount < probeCount || heap.size() < k) {
            const probeClusterId = closestCentroids[probedCount][0]
            const clusterPointIds = this.clusterer.clusterAssignments[probeClusterId]
            console.log(clusterPointIds.length)
            const clusterPoints = clusterPointIds.map(id => this.points[id]) 

            if(clusterPointIds.length == 0) {
                continue
            }

            for(let clusterPoint of clusterPoints) {
                const distance = this.measureFn(clusterPoint, target)
                if(heap.size() < k || distance < heap.peek()[1]) {
                    heap.push([clusterPoint.id, distance])
                }
            }

            probedCount += 1
        }
        benchmark.end("closest-points")

        if(this.verbose) {
            console.log(benchmark.summary())
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

    /** 
     * Saves IVF Flat to JSON.
     */
    toJSON() {
        return {
            clusterer : {
                clusterAssignments : this.clusterer.clusterAssignments,
                centroids : this.clusterer.centroids 
            }
        }
    }   

    /** 
     * Loads IVF Flat from JSON.
     */
    static fromJSON(data) {
        const ivf = new IVFFlat()
        ivf.clusterer.clusterAssignments = data.clusterer.clusterAssignments 
        ivf.clusterer.centroids = data.clusterer.centroids.map(x => Point.fromJSON(x))
        return ivf
    }
}