import { BruteForceNNS } from "nns-lite"
import { BA2D } from "../../src/utils/loaders.js"
import fs, { read } from "fs"
import readlinkSync from 'readline-sync';
import { Point } from "../../src/utils/point.js";
import * as measures from "nns-lite/src/utils/measures.js"
import { Random } from "../../src/utils/random.js";

const random = new Random(Math.random() * 10000)

// --- specify embedding folder --- // 
const embeddingFolder = "./data/datasets/word-embeddings/glove-wiki-gigaword-50"

// --- load vocabulary and embeddings --- // 
let vocabulary = 
    fs.readFileSync(embeddingFolder + "/vocabulary.txt").toString().split("\n")

// --- create word index --- //
let wordIndex = {}
for(let i = 0; i < vocabulary.length; i++) {
    wordIndex[vocabulary[i]] = i
}

// --- load vectors --- //
let vectors = 
    BA2D
        .load(embeddingFolder + "/vectors.bin", 50)
        .map((p, i) => new Point(i, p))  



while(true) {
// --- picnic --- // 
    let wordId = random.randInt(0, vocabulary.length - 1)
    let vector = vectors[wordId]
    let word = vocabulary[wordId]

    // --- create indexer --- //
    const indexer = new BruteForceNNS({ measureFn : measures.cosineDistance  })
    indexer.build(vectors) 

    // --- get top 1000 words --- // 
    const top1000 = indexer.query(vector, vocabulary.length - 1)

    // --- get random word --- //
    const wordA = random.choice(top1000.slice(0, 1000)) 
    const wordB = random.choice(top1000.slice(vocabulary.length - 1000))

    let shuffled = random.shuffle([wordA, wordB])

    console.log("Key Word: " + word) 
    console.log("========================")
    console.log("[1] " + vocabulary[shuffled[0][0]]) 
    console.log("[2] " + vocabulary[shuffled[1][0]]) 

    
    const answer = readlinkSync.question("Which is closest? ")
    console.log("Correct : "  + vocabulary[wordA[0]])

    console.log("----------------------------------------")
}
