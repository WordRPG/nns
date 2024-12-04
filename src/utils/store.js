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
		this.storage = storage
	}

	/** 
	 * Saves an object to the given filename.
	 */
	async save(object, filename) {
		const saveData = JSON.stringify(object.toJSON())
		await this.storage.write(filename, saveData)
	}

	/**
	 * Loads an object from the given filename.
	 */
	async load(objectType, fileName) {
		const content = await this.storage.read(fileName)
		return objectType.fromJSON(JSON.parse(content))
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
	static driver = () => localStorage

	static async write(filePath, data) {
		BrowserLocalStorage.driver().setItem("object:" + filePath, data)
	}

	static async read(filePath) {
		BrowserLocalStorage.driver().getItem("object:" + filePath)	
	}
}
