/** 
 * Simple Ball Tree Implementation 
 */
import * as measures from "nns-lite/src/utils/measures.js"
import * as operations from "nns-lite/src/utils/operations.js"
import { Indexer } from "../../indexer.js"
import { Random } from "../../../utils/random.js"
import { Heap } from "../../../utils/heap.js"

export class VPTree extends Indexer
{
    /** 
     * @param {Object} options 
     * @param {Function} options.measureFn - the measure function to use 
     * @param {number} options.threshold = 10 - threshold value for number of points in leaf nodes 
     * @param {string} options.splitter = "axis" - which splitter to use
     * @param {number} options.randomState = 1234567890 - random state to use 
     */
    constructor(options) {
        super(options)

        // --- threshold value 
        this.threshold = options.threshold ??  1
        
        // --- tree root 
        this.root = null

        // --- random state 
        this.randomState = options.randomState ?? 1234567890 

        // --- random generator 
        this.random = new Random(this.randomState)
    }

    // --- TREE CONSTRUCTION --- //
    
    create() {
        let buildInfo = {
            depths : {
                all : {},
                internal : {},
                leaves : {},
            }, 
            nodeCounts : {
                all : 0,
                internal : 0,
                leaves : 0
            }
        }

        const self = this;
        const threshold = this.threshold

        // --- build tree 
        function buildFor(points, depth = 0) {
            // --- construct leaf nodes
            if(points.length <= threshold) {
                return createLeafNode(points, depth)
            }
            // --- construct internal nodes
            else {
                return createInternalNode(points, depth)
            }
        }

        // --- create internal node 
        function createInternalNode(points, depth) {
            // --- track visit 
            buildInfo.nodeCounts.internal += 1
            buildInfo.nodeCounts.all += 1 

            if(!(depth in buildInfo.depths.internal)) {
                buildInfo.depths.internal[depth] = 0
            }   
            if(!(depth in buildInfo.depths.all)) {
                buildInfo.depths.all[depth] = 0
            }
            buildInfo.depths.internal[depth] += 1
            buildInfo.depths.all[depth] += 1

            // --- select vantage random point 
            const vp = points[0]

            // --- get distances to vantage point 
            const distances = []
            for(let i = 1; i < points.length; i++) {
                const distance = self.measureFn(points[i], vp)
                const record = [i, distance]
                distances.push(record)
            }
            distances.sort((a, b) => a[1] - b[1])
           
            const thresholdIndex = Math.floor(distances.length / 2) 
            const thresholdValue = distances[thresholdIndex][1]

            // --- split to left and right subtrees 
            const left_  = distances.filter(rec => rec[1] < thresholdValue) 
            const right_ = distances.filter(rec => rec[1] >= thresholdValue) 
            const leftPoints  = left_.map(rec => points[rec[0]])
            const rightPoints = right_.map(rec => points[rec[0]])

            // --- create internal node node 
            const node = new VPTInternalNode({
                tree : self, 
                threshold : thresholdValue,
                vpIndex : vp.id,
                left : buildFor(leftPoints, depth + 1), 
                right : buildFor(rightPoints, depth + 1)
            })

            return node
        }

        // --- create leaf node
        function createLeafNode(points, depth) {
            // --- track visit 
            buildInfo.nodeCounts.leaves += 1
            buildInfo.nodeCounts.all += 1 

            if(!(depth in buildInfo.depths.leaves)) {
                buildInfo.depths.leaves[depth] = 0
            }   
            if(!(depth in buildInfo.depths.all)) {
                buildInfo.depths.all[depth] = 0
            }

            buildInfo.depths.leaves[depth] += 1
            buildInfo.depths.all[depth] += 1

            return new VPTLeafNode({
                tree : self,
                points : points.map(x => x.id)
            })
        }

        this.root = buildFor([...this.points], 0)

        // --- publish build info
        this.buildInfo = buildInfo
    }

    // --- TREE QUERIES --- //

    query(target, k) {          
        const self = this                            
        const response = {}

        // --- set up visit tracker 
        let visits = {
            nodes : {
                internal : 0,
                leaves : 0,
                all : 0
            }, 
            comparisons : {
                points : 0, 
                centroids : 0
            }
        }

        // --- set up heap 
        let heap = new Heap({
            comparator : (a, b) => b[1] - a[1], 
            maxSize : k 
        })

        // --- start searching in tree --- //
        function searchIn(node, depth) {
            // --- handle leaf nodes --- //
            if(!node.left && !node.right) {
                handleLeafNodes(node, depth)
            }
            // --- handle internal nodes --- // 
            else {
                handleInternalNodes(node, depth)
            }
        }

        // --- handle internal nodes --- //
        function handleInternalNodes(node, depth) {
            // --- track visit 
            visits.nodes.internal += 1 
            visits.nodes.all += 1
            visits.comparisons.centroids += 2 

            // --- determine which subtree to visit 
            const vp = self.points[node.vpIndex]
            const distance = self.measureFn(target, vp) 
            const threshold = node.threshold 

            // --- process vantage point 
            if(heap.size() < k || distance < heap.peek()[1]) {
                heap.push([vp.id, distance])
            }

            // --- visit subtrees 
            if(distance < threshold) {
                if(
                    heap.size() < k ||
                    distance - heap.peek()[1] <= threshold 
                ) {
                    searchIn(node.left, depth + 1)
                }
                if(
                    heap.size() < k ||
                    distance + heap.peek()[1] >= threshold 
                ) {
                    searchIn(node.right, depth + 1)
                }
            } 
            else {
                if(
                    heap.size() < k ||
                    distance + heap.peek()[1] >= threshold 
                ) {
                    searchIn(node.right, depth + 1)
                }
                if(
                    heap.size() < k ||
                    distance - heap.peek()[1] <= threshold 
                ) {
                    searchIn(node.left, depth + 1)
                }
            }
            
        }
        
        // --- handle leaf nodes --- //
        function handleLeafNodes(node, depth) {
            // --- track visit 
            visits.nodes.leaves += 1
            visits.nodes.all += 1

            // --- loop through points and register distance 
            for(let point of node.getPoints()) {
                visits.comparisons.points += 2 
                const distance = self.measureFn(target, point)
                if(heap.size() < k || distance < heap.peek()[1]) {
                    heap.push([point.id, distance])
                }
            }
        }

        searchIn(this.root, 0) 

        // --- build response
        response.visits = visits
        response.results = heap.extract()
        response.results.reverse()

        // --- return results --- //
        return response
    }
}

export class VPTInternalNode {
    constructor({
        tree = null,
        vpIndex = null,
        threshold = null,
        left = null,
        right = null 
    }) {
        this.tree = tree
        this.vpIndex = vpIndex
        this.threshold = threshold 
        this.left = left
        this.right = right 
    }
}

export class VPTLeafNode {
    constructor({
        tree = null,
        points = null
    }) {
        this.tree = tree
        this.points = points         
    }

    getPoints() {
        return this.points.map(id => this.tree.points[id])
    }
}