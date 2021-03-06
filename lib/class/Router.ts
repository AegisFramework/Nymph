/**
 * ==============================
 * Router
 * ==============================
 */

import Route from "./Route";
import FileSystem from "./FileSystem";
import HTTP from "./HTTP"
import Collection from "./Collection"

const path = require('path');

interface Routes {
	[index: string]: Route[]
}

interface json {
	[index: string]: any
}

export default class Router {

	public static domain: string;

	public static port: number = 3000;

	public static request: any;

	public static response: string | Promise<any> = "";

	public static requestData: Promise<any>;

	public static requestMethod: string;

	public static responseStatus: string = "OK";

	public static responseType: string = "text/html";

	public static responseCode: number = 200;

	private static routes: Routes = {
		"ANY": [],
		"GET": [],
		"POST": [],
		"PUT": [],
		"DELETE": [],
		"PATCH": [],
		"OPTIONS": []
	};

	public static get (route: string, action: any){
		this.registerRoute('GET', new Route(route, action));
	}

	public static post (route: string, action: any){
		this.registerRoute('POST', new Route(route, action));
	}

	public static put (route: string, action: any){
		this.registerRoute('PUT', new Route(route, action));
	}

	public static patch (route: string, action: any){
		this.registerRoute('PATCH', new Route(route, action));
	}

	public static delete (route: string, action: any){
		this.registerRoute('DELETE', new Route(route, action));
	}

	public static options (route: string, action: any){
		this.registerRoute('OPTIONS', new Route(route, action));
	}

	public static any (route: string, action: any){
		this.registerRoute('ANY', new Route(route, action));
	}

	private static registerRoute(method: string, route: Route) {
		this.routes[method].push (route);
	}

	private static findRoute (method: string, route: string): Route | null {
		for (let registered of this.routes[method].concat(this.routes["ANY"])) {
			if (registered.match (route)){
				return registered;
			}
		}
		return null;
	}

	public static mime (extension: string) {
		// Text
		if (extension === ".html") {
			return "text/html";
		} else if (extension === ".php") {
			return "text/html";
		} else if (extension === ".css") {
			return "text/css";
		} else if (extension === ".js") {
			return "text/javascript";
		}

		// Images
		if (extension === ".png") {
			return "image/png";
		} else if (extension === ".jpg") {
			return "image/jpg";
		} else if (extension === ".jpeg") {
			return "image/jpeg";
		} else if (extension === ".gif") {
			return "image/gif";
		} else if (extension === ".bmp") {
			return "image/bmp";
		} else if (extension === ".webp") {
			return "image/webp";
		} else if (extension === ".ico") {
			return "image/x-icon";
		} else if (extension === ".svg") {
			return "image/svg+xml";
		}

		// Videos
		if (extension === ".mov") {
			return "video/quicktime";
		} else if (extension === ".mp4") {
			return "video/mp4";
		}
		// Audio
		if (extension === ".mp3") {
			return "audio/mpeg3";
		} else if (extension === ".ogg") {
			return "audio/ogg";
		} else if (extension === ".flac") {
			return "audio/flac";
		}

		// Fonts
		if (extension === ".ttf") {
			return "font/truetype";
		} else if (extension === ".otf") {
			return "font/opentype";
		} else if (extension === ".woff") {
			return "application/font-woff";
		}

		// Archives
		if (extension === ".zip") {
			return "application/octet-stream";
		} else if (extension === ".rar") {
			return "application/octet-stream";
		} else if (extension === ".tar") {
			return "application/octet-stream";
		} else if (extension === ".gz") {
			return "application/octet-stream";
		}

		// Files
		if (extension === ".pdf") {
			return "application/pdf";
		}

		return "text/plain";
	}

	public static listen () {
		var http = require("http");
		var server = http.createServer(function(request: any, response: any) {
			Router.request = request;
			Router.requestMethod = request.method;


			if (request.method == 'POST' || request.method == 'PUT' || request.method == 'DELETE') {
				Router.requestData = new Promise ((resolve, reject) => {
					var requestData = '';

					request.on('data', function (data: any) {
						requestData += data;
					});

					request.on('end', function () {
						try {
							resolve (new Collection (JSON.parse(requestData)));
						} catch (e) {
							Router.responseCode = 500;
							HTTP.error (500, 0, e.message, e.fileName, e.lineNumber);
							reject (e);
						}
					});
				});
			}

			let found_route: Route | null = Router.findRoute(request.method, request.url);

			let responseContent = "";
			if (found_route !== null) {
				Router.responseType = "text/html";
				Router.responseCode = 200;
				Router.response = found_route.run ();

			} else {
				if (FileSystem.exists(__dirname + "/../.." + request.url)) {
					Router.response = FileSystem.read (__dirname + "/../.." + request.url);
					Router.responseCode = 200;
					Router.responseType = Router.mime (path.extname (request.url));
				} else {
					HTTP.error (404);
				}
			}

			if (typeof Router.response === "object") {
				// Check if the result was a promise
				if (typeof Router.response.then != "undefined") {
					Router.response.then ((res: string) => {
						response.writeHead(Router.responseCode, Router.responseStatus, {"Content-Type": Router.responseType});
						response.write (res);
						response.end ();
					}).catch (() => {
						Router.responseCode = 500;
						HTTP.error (500);
						response.writeHead(Router.responseCode, Router.responseStatus, {"Content-Type": Router.responseType});
						response.write (Router.response);
						response.end ();
					});
				} else {
					Router.responseCode = 500;
					HTTP.error (500);
					response.writeHead(Router.responseCode, Router.responseStatus, {"Content-Type": Router.responseType});
					response.write (Router.response);
					response.end ();
				}

			} else {
				response.writeHead(Router.responseCode, Router.responseStatus, {"Content-Type": Router.responseType});
				response.write (Router.response);
				response.end ();
			}

		});
		server.listen (Router.port);
	}

}