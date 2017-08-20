interface collection {
	[key: string] : any;
	[index: number] : any;
}

export default class Collection {
	private collection: collection;

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

	[Symbol.iterator] () {
		return this.collection[Symbol.iterator] ();
	}

	public first () {
		return this.collection [0];
	}

	public object (): collection {
		return this.collection;
	}

	public remove (index: string | number) {
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