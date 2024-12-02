import { BA2D } from "nns-lite/src/utils/loaders.js"

// --- specify file path --- // 
const filePath = "./temp/points.bin"

// --- load file --- //
const floatArray = BA2D.load(filePath, 3) 

// --- print contents --- //
console.log("Float Array :", floatArray)

