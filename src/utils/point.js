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

 	toString() {
 		return `Point[${this.id}](${this.value.join(", ")})`
 	}

 	dimCount() {
 		return this.value.length
 	}

 	at(i) {
 		return this.value.at(i)
 	}

 	serialize() {
 		const data = {
 			id : this.id, 
 			value : helpers.encodeFloatArrayToBase64(this.value)
 		}
 		return data
 	}

 	static deserialize(data) {
 		data.value = helpers.decodeBase64ToFloatArray(data.value) 
		const point = new Point(data.id, data.value)
		return point
 	}
 }
