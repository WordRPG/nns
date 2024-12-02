import { FVecs } from "nns-lite/src/utils/loaders.js"

// --- specify filepath --- // 
const filePath = "./temp/points.fvecs"

// --- load points --- //
const array = FVecs.load(filePath)

// --- diplsy points --- //
console.log("Array :", array)
