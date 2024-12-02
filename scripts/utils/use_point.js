import { Point } from "nns-lite/src/utils/point.js"

// --- create point --- //
const point = new Point(1, [1.0, 2.0, 3.0]) 

// --- display point --- //
console.log(point.toString())

// --- dimensions --- //
console.log(point.dimCount() + " dimensions")

// --- access coordinates --- // 
console.log("2nd coordinate : " + point.at(1))

// --- serialize --- //
console.log("toJSON() : " + point.toJSON())

// -- deserialize --- //
console.log("fromJSON() : " + Point.fromJSON(point.toJSON()))
