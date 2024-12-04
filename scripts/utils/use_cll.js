import { clearLastLine } from "../../src/utils/helpers.js";

for(let i = 0; i < 1000000000; i++) {
    Math.random() 
    console.log("Hello, There! " + i)
    clearLastLine()
}