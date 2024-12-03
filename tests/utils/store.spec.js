import { test } from '@japa/runner'
import { spy } from "tinyspy"

import fs from "fs"
import { 
    FileStorage, 
    BrowserLocalStorage,
    ObjectStorage
} from '../../src/utils/store.js'

test.group('FileStorage', () => {
    test("write", async ({ assert }) => {
        await FileStorage.write("./temp/file.txt", "Hello, World!")
        assert.equal(fs.readFileSync("./temp/file.txt"), "Hello, World!")
    })

    test("read", async ({ assert }) => {
        await FileStorage.write("./temp/file.txt", "Hello, World!")
        assert.equal(await FileStorage.read("./temp/file.txt"), "Hello, World!")
    })
})

test.group("BrowserLocalStorage", () => {
    function useMockLocalStorage() {
        return {
            setItem : spy(), 
            getItem : spy()
        }
    }

    test("write", async ({ assert }) => {
        const localStorage = useMockLocalStorage() 
        BrowserLocalStorage.driver = () => localStorage 
        BrowserLocalStorage.write("./temp/file.txt", "Hello, World!") 
        assert.equal(localStorage.setItem.calls[0][0], "object:./temp/file.txt")
        assert.equal(localStorage.setItem.calls[0][1], "Hello, World!")
    })

    test("read", async ({ assert }) => {
        const localStorage = useMockLocalStorage() 
        BrowserLocalStorage.driver = () => localStorage 
        BrowserLocalStorage.read("./temp/file.txt") 
        assert.equal(localStorage.getItem.calls[0][0], "object:./temp/file.txt")
    })
})

test.group("ObjectStorage", () => {
   
    function useMockStorage() {
        return {
            write : spy(),
            load : spy(() => "[\"foo\",\"bar\"]"),
        }
    }
    
    function useMockObject() {
        return {
            toJSON : spy(() => [ "foo", "bar" ]),
            fromJSON : spy()
        }
    }

    test("constructor()", ({ assert }) => {
        const store = new ObjectStorage({ storage: BrowserLocalStorage })
        assert.equal(store.storage, BrowserLocalStorage)
    })

    test("save()", async ({ assert }) => {
        const mockStorage = new useMockStorage() 
        const store = new ObjectStorage({ storage: mockStorage }) 
        await store.save(useMockObject(), "item") 
        assert.equal(mockStorage.write.calls[0][0], "item")
        assert.equal(mockStorage.write.calls[0][1], "[\"foo\",\"bar\"]")
    })

    test("load()", async ({ assert }) => {
        const mockObject = useMockObject()
        const mockStorage = new useMockStorage() 
        const store = new ObjectStorage({ storage: mockStorage }) 
        await store.load(mockObject, "item")
        assert.equal(mockStorage.load.calls[0][0], "item")
        assert.deepEqual(mockObject.fromJSON.calls[0][0], ["foo", "bar"])
    })
})
