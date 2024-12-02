/**
	Storage Utility 
	---
	Stores an object using object's toJSON() method
	to a file in a data store (modifiable via composition).

	Usage: 
		ObjectStorage.
 */ 
 
export class ObjectStorage 
{
	constructor({
		storage = FileStorage
	} = {}) {
		this.storage = FileStorage
	}

	async save(object, filename) {
		const saveData = JSON.stringify(object.toJSON())
		await this.storage.write(filename, saveData)
	}

	async load(objectType, fileName) {
		const content = await this.storage.load(fileName)
		return objectType.fromJSON(content)
	}
}


export class FileStorage
{
	static async write(filePath, data) {
		const fs = (await import("fs")).default
		fs.writeFileSync(filePath, data)
	}

	static async read(filePath) {
		const fs = (await import("fs")).default
		return fs.readFileSync(filePath)	
	}
}


export class BrowserLocalStorage
{
	static async write(fileName, data) {
		localStorage.setItem("object:" + filePath, data)
	}

	static async read(fileName) {
		localStorage.getItem("object:" + filePath)	
	}
}
