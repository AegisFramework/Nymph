/**
* ==============================
* Request
* ==============================
*/

import Router from "./Router"
import Collection from "./Collection"

interface json {
	[index: string]: any
}

export default class Request {

	private static getDataFrom (method: string, keys: string[] | null = null, allowEmpty: boolean = false, allowHTML: boolean = false) {
		return Router.requestData.then ((data: Collection) => {

			if (Router.requestMethod == method) {
				if (keys != null) {
			        let object: json = {};
					for (let value of keys) {

						if (data.hasKey (value)) {

							if (!allowEmpty && !(data.get (value) != "" && data.get (value) != null)) {
								return null;
							}

		                    if (!allowHTML) {
		                        object[value] = data.get (value).replace(/(<([^>]+)>)/ig,"");
		                    } else {
		                        object[value] = data.get (value);
		                    }
						} else {
							return null;
						}
					}
					return new Collection (object);
			    } else {
			        return data;
			    }
			} else {
				return null;
			}
		});
	}

	public static get (keys: string[] | null = null, allowEmpty: boolean = false, allowHTML: boolean = false) {
		return this.getDataFrom ("GET", keys, allowEmpty, allowHTML);
	}

	public static post (keys: string[] | null = null, allowEmpty: boolean = false, allowHTML: boolean = false) {
		return this.getDataFrom ("POST", keys, allowEmpty, allowHTML);
	}

	public static put (keys: string[] | null = null, allowEmpty: boolean = false, allowHTML: boolean = false) {
		return this.getDataFrom ("PUT", keys, allowEmpty, allowHTML);
	}

	public static delete (keys: string[] | null = null, allowEmpty: boolean = false, allowHTML: boolean = false) {
		return this.getDataFrom ("DELETE", keys, allowEmpty, allowHTML);
	}

}