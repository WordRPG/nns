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

    /** 
     * The log function to use.
     */
    logFn(string) {
        console.log(string)
    }

    /** 
     * Logs an item normally.
     */
    log(...args) {  
        let string = args.join(" ") 
        let indentedString = indent(string, this.indent)
        return this.logFn(indentedString)
    }   

    /** 
     * Logs an item in verbose mode.
     */
    verboseLog(...args) {
        if(this.verbose) {
            return this.log(...args)
        }
    }
}