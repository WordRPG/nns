import { BA2D } from "nns-lite/src/utils/loaders.js" 

// --- create array --- // 
const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]] 
console.log("Array :", array)

// --- save array to file --- // 
BA2D.save("./temp/points.bin", array, 3) 

