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

            // --- whether the tree supports FNS or not
            this.supportsFNS = true
            
            // --- threshold value 
            this.threshold = options.threshold ??  1
            
            // --- tree root 
            this.root = null

            // --- centroids 
            this.centroids = []

            // --- splitters 
            this.splitters = {
                "axis" : () => new BTAxisSplitter(this, "max-spread"), 
                "projection" : () => new BTProjectionSplitter(this)
            }

            // --- which splitter to use 
            this.splitter = options.splitter ?? "axis"
            this.setSplitter(this.splitter)

            // --- random state 
            this.randomState = options.randomState ?? 1234567890 

            // --- random generator 
            this.random = new Random(this.randomState)
        }

        // --- UTILITY METHODS --- // 
        setSplitter(splitter) {
            this.splitterObj = this.splitters[splitter]()
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

    // --- BALL TREE SPLITTERS --- //
    export class SplitterObj {}

    export class BTAxisSplitter extends SplitterObj 
    {   
        /** 
         * @param {BallTree} tree 
         */
        constructor(tree, mode) {
            super(tree)
            this.tree = tree
            this.mode = mode
        }

        /**
         * @param {Point[]} points 
         * @param {number} depth 
         */
        split(points, depth) {
            // --- find axis of max spread --- //
            let dims = points[0].dimCount()
            let maxSpreadAxis;
            
            if(this.mode == "max-spread") {
                maxSpreadAxis = this.findAxisOfMaxSpread(points)
            } 
            else if (this.mode == "random") {
                maxSpreadAxis = this.tree.random.randInt(0, dims)
            }
            else {
                throw new Error("Unknown mode: " + this.mode)
            }

            // --- sort points on axis --- //
            points.sort((a, b) => a.at(maxSpreadAxis) - b.at(maxSpreadAxis))

            // --- split to two subarray --- //
            const middleIndex = Math.floor(points.length / 2)
            const left = points.slice(0, middleIndex) 
            const right = points.slice(middleIndex)

            // --- get centroid --- // 
            const centroid = operations.centroid(points) 

            // --- get radius --- // 
            const radius = operations.radius(points, this.tree.measureFn) 

            return  [centroid, radius, left, right]
        }

        /** 
         * @param {Point[]} points 
         */
        findAxisOfMaxSpread(points) {
            let maxSpreadAxis = -1
            let maxSpread = -Infinity
            const dims = points[0].dimCount()
            for(let i = 0; i < dims; i++) {
                let min = Infinity 
                let max = -Infinity
                for(let j = 0; j < points.length; j++) {
                    const axisValue = points[j].at(i) 
                    if(axisValue < min) {
                        min = axisValue
                    }
                    if(axisValue > max) {
                        max = axisValue
                    }
                }
                let range = max - min 
                if(range > maxSpread) {
                    maxSpreadAxis = i
                    maxSpread = range
                }
            }
            return maxSpreadAxis
        }
    }


    export class BTProjectionSplitter extends SplitterObj 
    {   
        /**
         * @param {BallTree} tree 
         */
        constructor(tree) {
            super(tree)
            this.tree = tree
        }

        /**
         * @param {Point[]} points 
         * @param {number} depth 
         */
        split(points, depth) {
            // --- find axis of max spread --- //
            const projectionLine = this.createProjectionLine(points)

            // --- project points to line --- // 
            const projectedPoints = this.projectPoints(points, projectionLine)
        
            // --- sort points based on projected points --- // 
            const pointIds = this.sortPoints(points, projectedPoints, projectionLine)

            // --- compute centroid of points --- // 
            const centroid = operations.centroid(points) 
            
            // --- compute radius of points --- //
            const radius = operations.radius(points, this.tree.measureFn) 

            // --- get left and right subarrays --- // 
            const middleIndex = Math.floor(points.length / 2)
            const left = 
                pointIds
                    .slice(0, middleIndex)
                    .map(index => points[pointIds[index]])
            const right = 
                pointIds
                    .slice(middleIndex)
                    .map(index => points[pointIds[index]])
            
            
            return [centroid, radius, left, right]
        }   

        /** 
         * @param {Point[]} points 
         */
        createProjectionLine(points) {
            const keyPoint = this.tree.random.choice(points)
            const [fpIndex, _fp] = 
                operations.farthestFirst(points, keyPoint, this.tree.measureFn)
            const firstPoint = points[fpIndex] 
            const [spIndex, _sp] = 
                operations.farthestFirst(points, firstPoint, this.tree.measureFn)
            const secondPoint = points[spIndex]
            return [firstPoint, secondPoint]
        }

        /**
         * @param {Point[]} points 
         * @param {Point[]} line
         */
        projectPoints(points, line) {
            const projectedPoints = [] 
            const firstPoint = line[0]
            const secondPoint = line[1]
            for(let i = 0; i < points.length; i++) {
                const otherPoint = points[i]
                const projectedPoint = 
                    operations.projectPointToLine(firstPoint, secondPoint, otherPoint)
                projectedPoints.push(projectedPoint)
            }
            return projectedPoints
        }

        /**
         * @param {Point[]} points 
         * @param {Point[]} line
         */
        sortPoints(points, projectedPoints, line) {
            const firstPoint = line[0]
            const distances = []
            for(let i = 0; i < points.length; i++) {
                const otherPoint = projectedPoints[i]
                const distance = this.tree.measureFn(firstPoint, otherPoint)
                const record = [i, distance]
                distances.push(record)
            }
            distances.sort((a, b) => a[1] - b[1])
            return distances.map(x => x[0])
        }

    }