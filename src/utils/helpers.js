
/** 
 * Repeats a string n times. 
 */
export function repeat(string, n) {
    let repeated = "" 
    for(let i = 0; i < n; i++) {
        repeated += string
    }
    return repeated
}

/** 
 * Indents a string n times. 
 */
export function indent(string, n, indentStr = "\t") {
    let indented = ""
    const lines = string.split("\n") 
    for(let line of lines) {
        indented += repeat(indentStr, n) + line + "\n"
    }   
    return indented
}

/** 
 * Partitions an array into subarrays of size k.
 */
export function partition(array, partitionSize) {
    const subArrays = []
    let buffer = []
    for(let i = 0; i < array.length; i++) {
        if(i > 0 && i % partitionSize == 0) {
            subArrays.push(buffer)
            buffer = []
        }
        buffer.push(array[i])
    }
    if(buffer.length > 0) {
        subArrays.push(buffer)
    }
    return subArrays
}

/** 
 * Subdivide an array into k partitions of equal length. 
 */
export function subdivide(array, k) {
    if(array.length % k != 0) {
        throw new Error("Array length must be divisible by k.")
    }
    const partitionSize = array.length / k
    return partition(array, partitionSize)
}

/**
 * Flattens an 2D array.
 */
export function flatten(array) {
	let flattened = [] 
	for(let item of array) {
		flattened = flattened.concat(item)
	}
	return flattened
}


/**
 * Encode float array to byyes.
 */
 export function encodeFloatArrayToBytes(floatArray) {
	const f32a          = new Float32Array(floatArray)
	const bytes         = new Uint8Array(f32a.buffer)
	return bytes
 }

 
 /**
  * Decode byte array to float array.
  */
 export function decodeBytesToFloatArray(bytes) {
    const itemsF32     = new Float32Array(
 	    bytes.buffer, 
 	    bytes.byteOffset, 
 	    bytes.byteLength / Float32Array.BYTES_PER_ELEMENT
 	)
 	const items = Array.from(itemsF32)	
 	return items
 }


/**
  * Convert Integer to Bytes
  * Source: https://stackoverflow.com/a/37863115/24886258 
 */
 export function encodeIntegerToBytes(num) {
     var ascii='';
     for (let i=3;i>=0;i--) {
         ascii+=String.fromCharCode((num>>(8*i))&255);
     }
     return ascii;
 }


 /**
   * Convert Bytes to Integer
   * Source: https://stackoverflow.com/a/37863115/24886258 
  */
  export function decodeBytesToInteger(numString) {
  	 var result=0;
 	 for (let i=3;i>=0;i--) {
  	    result+=numString.charCodeAt(3-i)<<(8*i);
 	 }
  	 return result;    
  }
 
  
 
