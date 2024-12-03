/** 
 * Custom/Modified Heap Implementation 
 * Original Source: https://maideveloper.com/blog/data-structure-heap
 */

export class Heap
{
    constructor ({
        comparator = (a, b) => a - b, 
        maxSize    = Infinity 
    } = {}) {
        this.heap = [] 
        this.comparator = comparator
        this.maxSize = maxSize
    }
    
    // --- UTILITY METHODS --- // 

    peek() {
        return this.size() > 0 ? this.heap[0] : undefined
    }

    size() {
        return this.heap.length 
    }

    isEmpty() {
        return this.size() === 0 
    }

    isFull() {
        return this.size() === this.maxSize
    }

    hasItems() {
        return this.size() > 0
    }

    getLeftIndex(index) {
        return 2 * index + 1 
    }

    getRightIndex(index) {
        return 2 * index + 2 
    }

    getParentIndex(index) {
        return Math.floor((index - 1) / 2)
    }

    swap(a, b) {
        [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]]
    }

    extract() {
        let array = [] 
        while(this.hasItems()) {
            array.push(this.pop())
        }
        return array 
    }

    toArray() {
        let copy = new Heap({
            comparator : this.comparator, 
            maxSize : this.maxSize
        })
        copy.heap = [...this.heap] 
        const array = copy.extract() 
        return array
    }

    // --- ITEM INSERTION --- // 

    push(data) {
        if(data === undefined || data === null) {
            return false 
        }
       
        this.heap.push(data)
        this.bubbleUp(this.heap.length - 1)

        if(this.size() > this.maxSize) {
            this.pop()
        }

        return true
    }

    bubbleUp(index) {
        while (index > 0) {
            let curr = this.heap[index];
            let parentIndex = this.getParentIndex(index);
            let parent = this.heap[parentIndex];
            
            let compare = this.comparator(parent, curr);
            if (compare < 0 || compare === 0) {
              break;
            }
            
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    } 

    // --- ITEM DELETION --- // 
    pop() {
        if (this.size() === 0) {
          return undefined;
        }
        
        if (this.size() === 1) {
            return this.heap.shift();
        }
        
        const value = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return value;
    }

    bubbleDown(currIndex) {
        let left = this.getLeftIndex(currIndex);
        let right = this.getRightIndex(currIndex);
        let parentIndex = currIndex;
        
        if (left < this.size() && this.comparator(this.heap[left], this.heap[parentIndex]) < 0) {
            parentIndex = left;
        }
        
        if (right < this.size() && this.comparator(this.heap[right], this.heap[parentIndex]) < 0) {
            parentIndex = right;
        }
        
        if (parentIndex !== currIndex) {
            this.swap(parentIndex, currIndex);
            this.bubbleDown(parentIndex);
        }
    }       
}