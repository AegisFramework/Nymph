import Schema from "./Schema"
import Collection from "./Collection"
import Password from "./Password"
import Crypt from "./Crypt"
import Query from "./Query"
const DB = require('./DB');

interface collection {
	[key: string] : any;
	[index: number] : any;
}


interface json {
	[key: string] : any;
}

interface callback {
	(id: number | string, object: json, callbackArguments: any): any;
}

export default class Component {

	protected static componentName: string;
	protected static id: string;
	protected static schema: Schema;
	protected static block: any = [];
	protected static ignore: string[] | number[] = [];
	protected static invisible: string[] | number[] = [];
	protected static logical: string;
	protected static secure: any = [];
	protected static defaults: json = {};
	protected static hash: string[] = [];

	public static getSchema (): Schema {
		return this.schema;
	}

	public static fields (): string[] {
		return this.schema.fields ();
	}

	public static protected (id: string | number): boolean {
		return this.block.indexOf (id) > -1;
	}

	public static setDefaults (object: json): json {
		for (let key in this.defaults) {
			if (!object.hasOwnProperty (key)) {
				object[key] = this.defaults[key];
			} else if (object[key] == "" || object[key] == null) {
				object[key] = this.defaults[key];
			}
		}
		return object;
	}

	public static hasFields (fields: string[] | string) {
		if (typeof fields === "string") {
			return this.fields ().indexOf (fields) > -1;
		} else if (typeof fields === "object") {
			for (let field of fields) {
				if (!(this.fields ().indexOf (field) > -1)) {
					return false;
				}
			}
			return true;
		} else {
			throw new Error ("Component `hasField` expected an array or string variable, received variable of type: " + typeof fields);
		}
	}

	public static exists (keys: json): Promise <boolean> {
		return new Promise ((resolve: any, reject: any) => {
			if (keys.length > 0) {
				let query = new Query ();
				query.select (this.id).from (this.componentName);

				let first = true;
				for (let key in keys) {
					if (first) {
						query.where (key).equals (keys[key]);
						first = false;
					} else {
						query.and (key).equals (keys[key]);
					}
				}
				return query.commit ().then ((results: any) => {
					let found = results.first ();
					if (found !== null) {
						resolve (true);
					} else {
						reject (false);
					}
				});
			} else {
				reject (false);
			}
		});
	}

	public static encrypt (object: json): json {
		for (let key in object) {
			if (object[key] != "" && object[key] != null) {
				if (this.secure.indexOf (key) > 0) {
					object[key] = Crypt.encrypt (object[key]);
				} else if (this.hash.indexOf (key) > 0) {
					object[key] = Password.hash (object[key]);
				}
			} else {
				if (this.hash.indexOf (key)) {
					delete object[key];
				}
			}
		}
		return object;
	}

	public static decrypt (object: json): json {
		if (typeof object === "object") {
			for (let key in object) {
				if ((this.secure.indexOf (key) > 0) && (object[key] != "" && object[key] != null)) {
					object[key] = Crypt.decrypt (object[key]);
				}
			}
		}
		return object;
	}

	public static all (fields = null) {
		let query = new Query ();
		query.select (this.id).from (this.componentName);

		if (typeof this.logical === "string") {
			query.where (this.logical).equals (1);
		} else {
			if (typeof this.ignore === "object") {
				if (this.ignore.length > 0) {
					query.where (this.id).notEquals (this.ignore[0]);

					delete this.ignore[0];
				}
			}
		}

		if (typeof this.ignore === "object") {
			if (this.ignore.length > 0) {
				for (let ignored of this.ignore) {
					query.and (this.id).notEquals (ignored);
				}
			}
		}

		return query.commit ().then ((results: collection) => {
			let searchResults: any = [];
			for (let result of results.object ()) {
				searchResults.push (this.get(result[this.id], fields));
			}
			return Promise.all (searchResults);
		});
	}

	public static get (id: string | number, fields: string[] | string | null = null, callback: null | callback  = null, callbackArguments: any [] = []): any {
		if (fields === null || (!(fields.length > 0) || fields == "")) {
			fields = this.fields ();
		}

		let query = new Query ();
		query.select (fields).from (this.componentName).where (this.id).equals (id);

		return query.commit ().then ((results: Collection) => {
			if (fields === null || (!(fields.length > 0) || fields == "")) {
				fields = this.fields ();
			}

			let record = results.first ();

			if (record === null) {
				return null;
			} else {

				record = this.decrypt(record);
				record = this.type (record);
				let result: any;

				if (typeof fields === "string") {
					result = record[fields];
				} else if (typeof fields === "object") {
					for (let field of fields) {
						if (this.hash.indexOf(field) > 0) {
							delete record[field];
						}
					}
					result = record;
				}
				if (callback !== null) {
					result = callback.apply (null, [id, result, callbackArguments]);
				}

				return result;
			}
		});
	}

	public static create (object: json, callback: callback | null = null, callbackArguments: any = []) {
		let keys = Object.keys(object);
		if (keys.length > 0) {
			if (this.hasFields (keys)) {
				object = this.setDefaults (object);
				object = this.encrypt (object);
				let query = new Query ();
				query.insert ().into (this.componentName).values (object).commit ().then ((results: collection) => {
					if (callback !== null) {
						return callback.apply (null, [DB.last, results.object (), callbackArguments]);
					}
				});
			} else {
				throw new Error ("Tried to create an object in " + this.componentName + " with at least one non-existing field.<p><b>Existing Fields:</b> " + this.fields ().toString () + "</p><p><b>Received Fields:</b> " + keys.toString () + "</p>");
			}
		} else {
			throw new Error ("Empty array provided to create an object in " + this.componentName + " with");
		}
	}

	public static update (id: string | number, object: json, callback: callback | null = null, callbackArguments: any = []) {
		let keys = Object.keys(object);
		if (keys.length > 0) {
			if (!this.protected (id)) {
				if (this.exists (this.buildObject (this.id, id))) {
					if (this.hasFields (keys)) {
						object = this.encrypt (object);
						let query = new Query ();
						query.update (this.componentName).set (object).where (this.id).equals (id).commit ();
						if (callback !== null) {
							callback.apply (null, [id, object, callbackArguments]);
						}
					} else {
						throw new Error ("Tried to update an object in " + this.componentName + " with at least one non-existing field.<p><b>Existing Fields:</b> " + this.fields ().toString () + "</p><p><b>Received Fields:</b> "+ keys.toString () + "</p>");
					}
				} else {
					throw new Error ("Tried to update a non-existent element in " + this.componentName + "<p><b>Key:</b> " + this.id + "</p><p><b>Value:</b> " + id  + "</p>");
				}
			}
		} else {
			throw new Error ("Empty array provided to update an object in " +  this.componentName + " with");
		}
	}

	public static delete (id: string | number, callback: callback | null = null, callbackArguments: any = []) {
		if (!this.protected (id)) {
			if (this.exists (this.buildObject(this.id, id))) {
				let query = new Query ();
				query.delete ().from (this.componentName).where (this.id).equals (id).commit ();
				if (callback !== null) {
					callback.apply (null, [id, callbackArguments]);
				}
			} else {
				throw new Error ("Tried to delete a non-existent element in " + this.componentName + "<p><b>Key:</b> " + this.id + "</p><p><b>Value:</b> " + id + "</p>");
			}
		}
	}

	public static type (object: json): json {
		if (typeof object === "object") {
			for (let key in object) {
				if (!isNaN(parseFloat(object[key]))) {
					if (object[key].indexOf (".") > 0) {
						object[key] = parseFloat (object[key]);
					} else {
						object[key] = parseInt (object[key]);
					}
				} else if (object[key] === null) {
						object[key] = "";
				}
			}
		}
		return object;
	}

	public static activate (id: string | number) {
		this.update (id, this.buildObject (this.logical, 1));
	}

	public static deactivate (id: string | number) {
		this.update (id, this.buildObject (this.logical, 0));
	}

	private static buildObject (key: string, value: any): json {
		let object: json = {};
		object[key] = value;
		return object;
	}

	/*public static __callStatic(name, arguments) {
		if (method_exists (get_called_class (), name)) {
		} else if (this.schema.hasField (name)) {
			return self::get (arguments[0], name);
		} else {
			throw new Error ("Tried to call non-existent static method `name` in " + this.componentName);
		}
	}*/
}