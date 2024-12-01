
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