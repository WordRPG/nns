/**
	Point Utility Class
	---
	Stores a point.
 */

 export class Point 
 {	
 	constructor(id, value) {
 		this.id = id 
 		this.value = value 
 	}

 	dimCount() {
 		return this.value.length
 	}

 	at(i) {
 		return this.value.at(i)
 	}

 	toJSON() {
 		return [this.id, this.value]
 	}

 	fromJSON(data) {
		const point = new Point(
			data.id,
			data.value
		)
		return point
 	}	

 	serialize() {
 		return JSON.stringify(this.toJSON())
 	}

 	static deserialize(json) {
 		return this.fromPoint(JSON.stringify())
 	}
 }
