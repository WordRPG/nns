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
    static load(filePath, dims, { batchSize = 200000, onLoadPoints = null }) {
		const contents = fs.readFileSync(filePath)
		let subArrays = []
		const subArraySize = dims * 4
		const batchSizeBytes = subArraySize * batchSize
		let count = 0
		for(let i = 0; i < contents.length; i += batchSizeBytes) {
			const subArrayBytes = contents.slice(i, i + batchSizeBytes) 
			const subArrayAll = helpers.decodeBytesToFloatArray(subArrayBytes)
			const subArrayChunks = helpers.subdivide(subArrayAll, batchSize)
			subArrays = subArrays.concat(subArrayChunks)
			if(onLoadPoints) onLoadPoints(subArrayChunks, count)
			count +=1
		}
		return subArrays
    }   

    /** 
     * Saves a 2D array into a BA2D file.
     */
    static save(filePath, array, dims, { batchSize = 250000, onSavePoints = null }) {
		let buffer = []
		if(fs.existsSync(filePath)) {
			fs.unlinkSync(filePath)
		}
		let count = 0
		for(let i = 0; i < array.length; i++) {
			const subArray = array[i]
			if(i > 0 && i % batchSize == 0) {
				const bufferFlat = helpers.flatten(buffer)
				const bytes = helpers.encodeFloatArrayToBytes(bufferFlat)
				fs.appendFileSync(filePath, bytes)
				buffer = []
				if(onSavePoints) onSavePoints(buffer, count)
			}
			buffer.push(subArray)
			count += 1
		}
		
		const bufferFlat = helpers.flatten(buffer)
		const bytes = helpers.encodeFloatArrayToBytes(bufferFlat)
		if(onSavePoints) onSavePoints(buffer, count)
						
		fs.appendFileSync(filePath, bytes)
    }
}
