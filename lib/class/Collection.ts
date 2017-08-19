interface json {
	[key: string] : any;
}

export default class Collection {
	private collection: json;

	constructor (collection: Object | null = null) {
		if (collection === null) {
			this.collection = {};
		} else {
			if (typeof collection === "object") {
				this.collection = collection;
			} else if (typeof collection === "string") {
				this.collection = JSON.parse (collection);
			} else {
				throw new Error ();
			}
		}
	}

	public object () {
		return this.collection;
	}

	public remove (index: string) {
		delete this.collection[index];
	}

	public hasKey (key: string) {
		return this.collection.hasOwnProperty (key);
	}

	public keys () {
		return Object.keys(this.collection);
	}

	public get (key: string) {
		if (this.hasKey (key)) {
			return this.collection[key];
		} else {
			return null;
		}
	}

	public set (key: string, value: any) {
		this.collection[key] = value;
	}

}