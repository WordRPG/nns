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
import { KDTree, VPTree, BallTree} from "nns-lite"
import { KMeans } from "./kmeans.js"

export class NKMeansNode 
{
    constructor() {
        this.clusterer = null 
        this.children  = []
        this.depth     = 0
    }
}

export class NKMeans 
{
    constructor({
        clusterCounts      = [10, 10, 10],
        iterCounts         = [10, 10, 10],
        centroidStrategies = ["random", "random", "random"],
        verbose            = true, 
        recluster          = true,
        measureFn          = measures.euclideanDistance
    }) {
        this.clusterCounts = clusterCounts
        this.iterCounts = iterCounts
        this.centroidStrategies = centroidStrategies
        this.verbose = verbose 
        this.measureFn = measureFn
        this.clusterAssignments = []
        this.centroids = []
        this.root = []
        this.recluster = recluster
    }

    setPoints(points) {
        this.points = points 
    }

    fit(iterCount = null) {
        const self = this
        const clusterCounts = this.clusterCounts
        const centroidStrategies = this.centroidStrategies 
        const iterCounts = this.iterCounts

   
        const buildFor = (points, parent, level) => {
            if(level == clusterCounts.length) {
                return null
            }

            const node = new NKMeansNode() 
            const clusterCount = clusterCounts[level]
            const iterCount = iterCounts[level]
            const centroidStrategy = centroidStrategies[level]
           
            const clusterer = new KMeans({
                clusterCount: clusterCount,
                iterCount: iterCount,
                centroidStrategy: centroidStrategy,
                verbose: true
            })

            const reindexedPoints = 
                points.map((point, index) => new Point(index, point.value)) 
            const pointMap = points.map(point => point.id)
            
            clusterer.setPoints(reindexedPoints)

            clusterer.fit(iterCount)

            let i = 0 
            let j = 0
            let recluster = []
            for(let cluster of clusterer.clusterAssignments) {
                const row = []
                for(let pointIndex of cluster) {
                    row.push(pointMap[pointIndex])
                    j += 1
                }
                recluster.push(row)
                i += 1
            }

            clusterer.clusterAssignments = recluster

            node.clusterer = clusterer

            for(let cluster of clusterer.clusterAssignments) {
                const points = cluster.map(id => self.points[id])
                const builtNode = 
                    buildFor(points, node, level + 1)
                if(builtNode == null) {
                    continue
                }
                node.children.push(builtNode)
            }
            
            return node
        }
       
        this.root = buildFor([...this.points], null, 0)

        // --- find leaf nodes and register clusters 
        const root = this.root 
        let total = 0
        function searchLeafNodes (node){
            if(node.children.length == 0) {
                const centroids = node.clusterer.centroids 
                const clusterAssignments = node.clusterer.clusterAssignments
                for(let centroid of centroids) {
                    self.centroids.push(centroid)
                }
                total += clusterAssignments.length
                self.clusterAssignments = 
                    [...self.clusterAssignments, ...clusterAssignments]
            }
            for(let child of node.children) {
                searchLeafNodes(child)
            }
        }
        searchLeafNodes(root)

        // --- apply reclustering 
        if(this.recluster) {
            console.log("--- Reclustering.")
            const finalClusters = new KMeans({ verbose: self.verbose })
            finalClusters.setPoints(self.points)
            finalClusters.centroids = self.centroids 
            finalClusters.clusterAssignments = self.clusterAssignments
            finalClusters.assignClusters() 
            finalClusters.adjustCentroids() 
            self.clusterAssignments = finalClusters.clusterAssignments
            self.centroids = finalClusters.centroids
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