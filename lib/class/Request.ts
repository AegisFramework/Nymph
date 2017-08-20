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
		if (Router.requestMethod == method) {
			if (keys != null) {
		        let object: json = {};
				for (let value of keys) {

					if (Router.requestData.hasKey (value)) {

						if (!allowEmpty && (Router.requestData.get (value) != "" && Router.requestData.get (value) != null)) {
							return null;
						}

	                    if (!allowHTML) {
	                        object[value] = Router.requestData.get (value).replace(/(<([^>]+)>)/ig,"");
	                    } else {
	                        object[value] = Router.requestData.get (value);
	                    }
					} else {
						return null;
					}
				}
				return new Collection (object);
		    } else {
		        return Router.requestData;
		    }
		} else {
			return null;
		}
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