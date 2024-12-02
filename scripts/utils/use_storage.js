import { ObjectStorage } from "nns-lite/src/utils/store.js"
import { Point } from "nns-lite/src/utils/point.js"

const storage = new ObjectStorage()

const point = new Point(1, [1, 2, 3])

storage.save(point, "./temp/point.json")
