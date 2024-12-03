/** 
 * Simple Ball Tree Implementation 
 */
import * as measures from "nns-lite/src/utils/measures.js"
import * as operations from "nns-lite/src/utils/operations.js"
import { Indexer } from "../../indexer.js"
import { Random } from "../../../utils/random.js"
import { Heap } from "../../../utils/heap.js"

export class BallTree extends Indexer
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


            const [centroid, radius, left, right] = 
                self.splitterObj.split(points, depth)

            // --- register centroid 
            centroid.id = self.centroids.length 
            self.centroids.push(centroid)

            // --- create internal node 
            const node = new BTInternalNode({
                tree : self,
                centroid : centroid.id, 
                radius : radius, 
                left : buildFor([...left], depth + 1),
                right : buildFor([...right], depth + 1)
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

            if(points.length == 1) {
                return new BTLeafNodeSP({
                    tree : self,
                    point : points[0].id
                })
            }
            else {
                // --- register centroid 
                const centroid = operations.centroid(points)
                centroid.id = self.centroids.length 
                self.centroids.push(centroid)

                return new BTLeafNodeMP({
                    tree : self,
                    points : points.map(x => x.id),
                    centroid : centroid.id, 
                    radius : operations.radius(points, self.measureFn)
                })
            }
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
        let heap = []

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

            // --- check distance to left and right centroids 
            const leftNode = node.left
            const rightNode = node.right

            const leftDist   = 
                self.measureFn(target, leftNode.getCentroid())
            const rightDist  = 
                self.measureFn(target, rightNode.getCentroid())

            // --- visit subtrees
            if(leftDist < rightDist) {
                if(
                    heap.length < k || 
                    heap.at(-1)[1] > leftDist - leftNode.getRadius()
                ) {
                    searchIn(leftNode, depth + 1)
                }
                if(
                    heap.length < k || 
                    heap.at(-1)[1] > rightDist - rightNode.getRadius()
                ) {
                    searchIn(rightNode, depth + 1)
                }
            }
            else {
                if(
                    heap.length < k || 
                    heap.at(-1)[1] > rightDist - rightNode.getRadius()
                ) {
                    searchIn(rightNode, depth + 1)
                }
                if(
                    heap.length < k || 
                    heap.at(-1)[1] > leftDist - leftNode.getRadius()
                ) {
                    searchIn(leftNode, depth + 1)
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
                if(heap.length < k || distance < heap.at(-1)[1]) {
                    heap.push([point.id, distance])
                    heap.sort((a, b) => a[1] - b[1])
                    heap = heap.slice(0, k)
                }
            }
        }

        searchIn(this.root, 0) 

        // --- build response
        response.visits = visits
        response.results = heap

        // --- return results --- //
        return response
    }

}

// --- BALL TREE NODES --- //

export class BTNode 
{
    getRadius() {
        return this.radius 
    }

    getCentroid() {
        return this.tree.centroids[this.centroid]
    }
}

export class BTInternalNode extends BTNode
{
    constructor({
        tree     = null,
        centroid = null, 
        radius   = null,
        left     = null,
        right    = null 
    } = {}) {
        super()
        this.tree = tree
        this.centroid = centroid 
        this.radius = radius
        this.left = left 
        this.right = right
    }

    toJSON() {
        return {
            centroid : this.centroid, 
            radius : this.radius, 
            left : this.left, 
            right : this.right
        }
    }

    static fromJSON(data) { 
        const node = new BTInternalNode({
            tree : this,
            centroid : data.centroid, 
            radius : data.radius, 
            left : data.left, 
            right : data.right
        })
        return node
    }
}

export class BTLeafNodeMP extends BTNode
{
    constructor({
        tree     = null, 
        centroid = null,
        radius   = null, 
        points   = null 
    }) {
        super()
        this.tree = tree
        this.centroid = centroid 
        this.radius = radius
        this.points = points
    }

    getCentroid() {
        return this.tree.centroids[this.centroid]
    }

    getPoints() {
        return points.map(id => this.tree.points[id])
    }

    toJSON() {
        return {
            centroid : this.centroid, 
            radius : this.radius, 
            points : this.points
        }
    }

    static fromJSON(data) {
        const node = new BTLeafNodeMP({
            centroid : data.centroid, 
            radius : data.radius, 
            points : data.points
        })
        return node
    }
}

export class BTLeafNodeSP extends BTNode
{
    constructor({
        tree    = null,
        point   = null 
    }) {
        super()
        this.tree  = tree
        this.point = point
    }

    getCentroid() {
        return this.tree.points[this.point]
    }

    getPoints() {
        return [this.tree.points[this.point]]
    }

    getRadius() {
        return 0
    }

    toJSON() {
        return {
            point : this.point
        } 
    }

    static fromJSON(data) {
        const node = new BTLeafNodeSP({
            point : data.point
        })
        return node
    }
}
