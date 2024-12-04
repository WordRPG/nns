import readline from "readline"

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
 * Encode float array to bytes.
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
 * Encode int array to bytes.
 */
export function encodeIntArrayToBytes(floatArray) {
	const i32a          = new Int32Array(floatArray)
	const bytes         = new Uint8Array(i32a.buffer)
	return bytes
}

 
/**
  * Decode byte array to int array.
  */
export function decodeBytesToIntArray(bytes) {
    const itemsI32     = new Int32Array(
 	    bytes.buffer, 
 	    bytes.byteOffset, 
 	    bytes.byteLength / Float32Array.BYTES_PER_ELEMENT
 	)
 	const items = Array.from(itemsI32)	
 	return items
}


/**
  * Encode float array to base64.
  */
export function encodeFloatArrayToBase64(floatArray) {
      // --- create an ArrayBuffer and a DataView to write float values
      const buffer = new ArrayBuffer(floatArray.length * 4); // 4 bytes per float (Float32)
      const dataView = new DataView(buffer);
      
      // --- write the float array into the ArrayBuffer as Float32
      for (let i = 0; i < floatArray.length; i++) {
        dataView.setFloat32(i * 4, floatArray[i], true); // true for little-endian
      }
      
      // --- convert the ArrayBuffer to a byte array
      const byteArray = new Uint8Array(buffer);
      
      // --- convert the byte array to a base64 string
      let binaryString = '';
      for (let i = 0; i < byteArray.length; i++) {
        binaryString += String.fromCharCode(byteArray[i]);
      }
      
      // --- return the base64 encoded string
	  return btoa(binaryString);
 }	

/**
 * Decode float array to base64.
 */
export function decodeBase64ToFloatArray(base64) {
	 // --- decode base64 string to binary data (a string of bytes)
     const binaryString = atob(base64);
		  
	 // --- create a typed array from the binary string
	 const byteArray = new Uint8Array(binaryString.length);
	  
	 // --- copy binary string data to byteArray
	 for (let i = 0; i < binaryString.length; i++) {
	   byteArray[i] = binaryString.charCodeAt(i);
	 }
	  
	 // --c create a DataView to interpret the byte array as a float array
	 const floatArray = [];
	 const dataView = new DataView(byteArray.buffer);
		  
	 // --- read 4-byte floats (Float32) from the DataView
	 for (let i = 0; i < byteArray.length; i += 4) {
	    floatArray.push(dataView.getFloat32(i, true)); // true for little-endian
     }
	  
     return floatArray; 
}


/**
  * Encode int array to base64.
  */
export function encodeIntArrayToBase64(intArray) {
      // --- create an ArrayBuffer and a DataView to write float values
      const buffer = new ArrayBuffer(intArray.length * 4); // 4 bytes per float (Float32)
      const dataView = new DataView(buffer);
      
      // --- write the float array into the ArrayBuffer as Float32
      for (let i = 0; i < intArray.length; i++) {
        dataView.setInt32(i * 4, intArray[i], true); // true for little-endian
      }
      
      // --- convert the ArrayBuffer to a byte array
      const byteArray = new Uint8Array(buffer);
      
      // --- convert the byte array to a base64 string
      let binaryString = '';
      for (let i = 0; i < byteArray.length; i++) {
        binaryString += String.fromCharCode(byteArray[i]);
      }
      
      // --- return the base64 encoded string
	  return btoa(binaryString);
 }	

/**
 * Decode base64 to float array.
 */
export function decodeBase64ToIntArray(base64) {
	 // --- decode base64 string to binary data (a string of bytes)
     const binaryString = atob(base64);
		  
	 // --- create a typed array from the binary string
	 const byteArray = new Uint8Array(binaryString.length);
	  
	 // --- copy binary string data to byteArray
	 for (let i = 0; i < binaryString.length; i++) {
	   byteArray[i] = binaryString.charCodeAt(i);
	 }
	  
	 // --c create a DataView to interpret the byte array as a float array
	 const floatArray = [];
	 const dataView = new DataView(byteArray.buffer);
		  
	 // --- read 4-byte floats (Float32) from the DataView
	 for (let i = 0; i < byteArray.length; i += 4) {
	    floatArray.push(dataView.getInt32(i, true)); // true for little-endian
     }
	  
     return floatArray; 
}

/**
 * Clear last line.
 */
const ESC = '\x1b' // ASCII escape character
const CSI = ESC + '[' // control sequence introducer
export function clearLastLine() {
  process.stdout.write(CSI + 'A') // moves cursor up one line
  process.stdout.write(CSI + 'K') // clears from cursor to line end
}