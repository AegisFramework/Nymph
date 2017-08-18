/**
 * ==============================
 * HTTP
 * ==============================
 */

import Aegis from "./../Aegis"
import Template from "./Template"
import FileSystem from "./FileSystem"
import Router from "./Router"

const process = require ("process");
const os = require ("os");

export default class HTTP {

	public static type (type: string, charset = 'utf-8'){
        switch (type) {
            case "json":
                Router.responseType = `application/json;charset=${charset}`;
                break;

            case "html":
                Router.responseType = `text/html;charset=${charset}`;
                break;
        }
    }

	public static error(code: number, number: null | number = null, message: null | number = null, file: null | number = null, line: null | number = null){
			HTTP.type ("html");
            let error = new Template();
            error.setContent(FileSystem.read(`${__dirname}/../../error/error.html`));
			let description = "";

            if (Aegis.debugging) {
                description = `<p><b>OS:</b> `+ os.type () + `</p>`;
                description += `<p><b>Node Version:</b> `+process.versions.node+`</p>`;
			    description += `<p><b>Aegis Flavor:</b> `+Aegis.flavor+`</p>`;
			    description += `<p><b>Version:</b> `+Aegis.version+`</p>`;
			    if (number != null) {
			        description += `<p><b>Error Code:</b> ${number}</p>`;
    			    description += `<p><b>Message:</b> ${message}</p>`;
    			    description += `<p><b>File:</b> ${file}</p>`;
     			    description += `<p><b>Line:</b> ${line}</p>`;
			    }
            }

			Router.responseCode = code;
            switch (code) {
                case 400:
					Router.responseStatus = "Bad Request";
					error.set ("title", "Bad Request");
					error.set ("message", "The request is invalid.");
					break;
				case 401:
					Router.responseStatus = "Unauthorized";
					error.set ("title", "Unauthorized Access");
					error.set ("message", "Autentication is Required.");
					break;
				case 403:
					Router.responseStatus = "Forbidden";
					error.set ("title", "Forbidden");
					error.set ("message", "Forbidden access, clearance neeeded.");
					break;
				case 404:
					Router.responseStatus = "Not Found";
					error.set ("title", "Page Not Found");
					error.set ("message", "Sorry, the page you are trying to access does not exist.");
					break;

                case 409:
					Router.responseStatus = "Conflict";
					error.set ("title", "Conflict");
					error.set ("message", "A request or file conflict ocurred, please try again.");
					break;

				case 500:
					Router.responseStatus = "Internal Server Error";
					error.set ("title", "Server Error");
					error.set ("message", "Sorry, it seems there's been an error. Please try later.");
					break;
			}

			if (Aegis.debugging) {
			    description = "<div>" + description + "</div>";
			} else {
			    description = "";
			}
			error.set ("description", description);
			error.compile ();
			Router.response = error.toString ();
        }
}