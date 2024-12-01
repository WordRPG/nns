/** 
 * Logging Utility
 */
import { indent } from "./helpers.js"

export class Logger 
{
    constructor() {
        this.indent = 0
        this.verbose = false 
    }

    logFn(string) {
        console.log(string)
    }

    log(...args) {  
        let string = args.join(" ") 
        let indentedString = indent(string, this.indent)
        return this.logFn(indentedString)
    }

    verboseLog(...args) {
        if(this.verbose) {
            return this.log(...args)
        }
    }
}