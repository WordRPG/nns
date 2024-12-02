/** 
 * Loaders for different files in the project. 
 */
import fs from "fs"
import * as helpers from "nns-lite/src/utils/helpers.js"

export class BA2D 
{
    /**
     * Loads a BA2D file into an array.
     */
    static load(filePath, dims) {
		const bytes = fs.readFileSync(filePath)	
		const floatArray = helpers.decodeBytesToFloatArray(bytes) 
		const vectorCount = floatArray.length / dims 
		const vectors = helpers.subdivide(floatArray, vectorCount)
		return vectors	
    }   

    /** 
     * Saves a 2D array into a BA2D file.
     */
    static save(filePath, array, dims) {
		const flattened = helpers.flatten(array)
		const byteArray = helpers.encodeFloatArrayToBytes(flattened)
		fs.writeFileSync(filePath, byteArray)
    }
}

export class FVecs
{
    /**
     * Loads a .fvecs file into a 2D array.
     */
    static load(filePath) {
        
    }   

    /** 
     * Saves array .fvecs file.
     */
    static save(filePath, array) {

    }
}
