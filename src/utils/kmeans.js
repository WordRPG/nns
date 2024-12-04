/**
 * K-means Clustering Algorithm
 */
import * as generate from "nns-lite/src/utils/generate.js"
import * as operations from "nns-lite/src/utils/operations.js"
import * as measures from "nns-lite/src/utils/measures.js"
import * as helpers from "nns-lite/src/utils/helpers.js"
import { Point } from "./point.js"
import { Random } from "./random.js"
import Chance from "chance"

export class KMeans 
{
    constructor({
        clusterCount = 10,
        randomState  = 1234567890,
        centroidStrategy = "random",
        measureFn = measures.euclideanDistance,
        verbose = false 
    } = {}) {
        this.clusterCount = clusterCount 
        this.randomState = randomState
        this.centroids = []
        this.centroidStrategy = centroidStrategy
        this.hasInitializedCentroids = false
        this.iterFitted = 0
        this.random = new Random(this.randomState)
        this.measureFn = measureFn
        this.clusterAssignments = []
        this.verbose = verbose
    }

    /** 
     * Set points. 
     */
    setPoints(points) {
        this.points = points
    } 

    /** 
     * Initialize centroids.
     */
    initCentroids() {
        if(this.centroidStrategy == "random") {
            this.initRandomCentroids() 
        }   
        else if(this.centroidStrategy == "kmeans++") {
            this.initKMeansPPCentroids()
        }
        else {
            throw new Error(`Unknown centroid strategy [${this.centroidStrategy}]`)
        }
        this.hasInitializedCentroids = true
    }

    /** 
     * Initialize random centroids. 
     */
    initRandomCentroids() {
        const clusterCount = this.clusterCount
        const dimCount = this.points[0].dimCount()
        const centroids = generate.randomPoints(clusterCount, dimCount)
        this.centroids = centroids
    }

    /**
     * Initialize k-means++ centroids.
     */
    initKMeansPPCentroids() {
        const clusterCount = this.clusterCount 
        const dimCount = this.dimCount 
        const centroids = [] 

        // --- select a point as the first centroid
        const firstPointIndex = this.random.randInt(0, this.points.length - 1)
        const firstPoint = new Point(0, this.points[firstPointIndex].value)
        centroids.push(firstPoint)
        const visitOrder = this.points
        let visitIndex = 0
        operations.swapArray(visitOrder, firstPointIndex, visitIndex)

        // --- find other centroids 
        for(let i = 1; i < clusterCount; i++) {
            if(this.verbose) {
                console.log("---- Initializing centroid " + (i + 1) + " of " + clusterCount)
            }
            let maxDistance = -Infinity
            let maxIndex    = -1 
            for(let j = visitIndex; j < visitOrder.length; j++) {
                const activePoint = visitOrder[j]
                const [index, distance] = 
                    operations.nearestFirst(centroids, activePoint, this.measureFn) 
                if(distance > maxDistance) {
                    maxIndex = j 
                    maxDistance = distance
                }
            }
            const nextCentroid = new Point(visitIndex + 1, visitOrder[maxIndex].value)
            centroids.push(nextCentroid)
            operations.swapArray(visitOrder, visitIndex, maxIndex)
            visitIndex += 1
        }

        this.centroids = centroids
    }

    /** 
     * Fit one iteration. 
     */
    fitOne() {
        this.iterFitted += 1
        if(!this.hasInitializedCentroids) {
            this.initCentroids()
        }
        this.assignClusters()
        this.adjustCentroids()
    }   

    /**
     * Assign clusters.
     */
    assignClusters() {
        const pointCount = this.points.length 
        const centroids = this.centroids
        
        // --- initialize cluster assignments
        const clusterAssignments = []
        for(let i = 0; i < centroids.length; i++) {
            clusterAssignments.push([])
        }

        

        // --- assign clusters to centroids
        for(let i = 0; i < pointCount; i++) {
            if(this.verbose) {
                console.log("---- (Iter. Count : " + this.iterFitted + ") Assigning clusters " + (i + 1) + " of " + pointCount)
            }
            const point = this.points[i] 
            const closestCentroid = 
                operations.nearestFirst(centroids, point, this.measureFn)
            const closestCentroidIndex = closestCentroid[0]
            clusterAssignments[closestCentroidIndex].push(point.id)
        }

        this.clusterAssignments = clusterAssignments
    }

    /**
     * Recompute centroids based on cluster assignments.
     */
    adjustCentroids() {
        const centroids = this.centroids
        const clusterAssignments = this.clusterAssignments

        // --- recalculate centroids of each cluster 
        for(let i = 0; i < centroids.length; i++) {
            if(this.verbose) {
                console.log("---- (Iter. Count : " + this.iterFitted + ")---- Adjusting centroids " + (i + 1) + " of " + centroids.length)
            }
            const clusterPointIds = clusterAssignments[i]
            const clusterPoints = clusterPointIds.map(id => this.points[id])
            
            if(clusterPoints.length == 0) {
                continue
            }
            
            centroids[i] = operations.centroid(clusterPoints)
            centroids[i].id = i
        }
    }

    /** 
     * Fit n iterations.
     */
    fit(iterCount) {
        for(let i = 0; i < iterCount; i++) {
            if(this.verbose) {
                console.log("---- Fitting " + (i + 1) + " of " + iterCount)
            }
            this.fitOne() 
        }
    }

    /** 
     * Predict which cluster a point belongs to.
     */
    predict(target) {
        return operations.nearestFirst(
            this.centroids, 
            target, 
            this.measureFn
        )
    }

    /** 
     * Predict all clusters.
     */
    predictAll(target) {
        return operations.nearestK(
            this.centroids, 
            target, 
            this.clusterCount,
            this.measureFn
        )
    }
}