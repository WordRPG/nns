/**
	Point Utility Class
	---
	Stores a point.
 */
 import * as helpers from "nns-lite/src/utils/helpers.js"

 export class Point 
 {	
 	constructor(id, value) {
 		this.id = id 
 		this.value = value 
 	}	

	/** 
	 * Represents a point as a string.
	 */
 	toString() {
 		return `Point[${this.id}](${this.value.join(", ")})`
 	}

	/** 
	 * Returns the dimensions of the point.
	 */
 	dimCount() {
 		return this.value.length
 	}

	/** 
	 * Returns the coordinate/component at a given index.
	 */
 	at(i) {
 		return this.value.at(i)
 	}	

	/** 
	 * Transforms the point into JSON format.
	 */
 	toJSON() {
 		const data = {
 			id : this.id, 
 			value : helpers.encodeFloatArrayToBase64(this.value)
 		}
 		return data
 	}

	/**
	 * Deconstructs the point from JSON format.
	 */
 	static fromJSON(data) {
 		data.value = helpers.decodeBase64ToFloatArray(data.value) 
		const point = new Point(data.id, data.value)
		return point
 	}
 }
