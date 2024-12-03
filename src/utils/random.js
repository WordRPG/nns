/** 
 * Adapter for Random Number Generation
 * --- 
 * Uses Chance.js by default, can be tweaked to other libraries.
 */
import Chance from "chance"

export class Random
{
    constructor(seed) {
        this.seed = seed 
        this.generator = new Chance(this.seed)
    }

    randInt(min, max) {
        return this.generator.integer({ min, max })
    }

    uniform(min, max) {
        return this.generator.floating({ min, max }) 
    }   

    normal(mean, dev) {
        return this.generator.normal({ mean, dev })
    }
    
    choice(array) {
        return this.generator.pickone(array)
    }

    sample(array, k) {
        return this.generator.pickset(array, k)
    } 

    shuffle(array) {
        return this.generator.shuffle(array)
    }
}

