/** 
 * Simple Ball Tree Implementation 
 */
import * as measures from "nns-lite/src/utils/measures.js"
import * as operations from "nns-lite/src/utils/operations.js"
import { Indexer } from "../../indexer.js"
import { Random } from "../../../utils/random.js"
import { Heap } from "../../../utils/heap.js"

export class KDTree extends Indexer
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
        const dims = this.points[0].dimCount()

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

            // --- get axis of median split 
            const axis = depth % dims 
            points.sort((a, b) => a.at(axis) - b.at(axis)) 
        
            // --- get split value 
            const medianIndex = Math.floor(points.length / 2) 
            const medianValue = points[medianIndex].at(axis)

            // --- split to left and right splits 
            const leftPoints = points.filter((point) => point.at(axis) < medianValue) 
            const rightPoints = points.filter((point) => point.at(axis) >= medianValue) 

            // --- build node 
            const node = new KDTInternalNode({
                tree : this, 
                median : medianValue,
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

            
            return new KDTLeafNode({
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

        // --- dimension count 
        const dims = this.points[0].dimCount()

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

            // --- search in subtrees 
            const axis = depth % dims 
            const median = node.median 
            const dimValue = target.at(axis)
            const axisDiff = dimValue - median 

            if(axisDiff < 0) {
                searchIn(node.left, depth + 1) 
                if(heap.size() < k || heap.peek()[1] > Math.abs(axisDiff)) {
                    searchIn(node.right, depth + 1)
                }
            }
            else {
                searchIn(node.right, depth + 1) 
                if(heap.size() < k || heap.peek()[1] > Math.abs(axisDiff)) {
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

export class KDTInternalNode {
    constructor({
        tree = null,
        median = null,
        left = null,
        right = null 
    }) {
        this.tree = tree
        this.median = median 
        this.left = left
        this.right = right 
    }
}

export class KDTLeafNode {
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