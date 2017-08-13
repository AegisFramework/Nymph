/**
 * ==============================
 * Route
 * ==============================
 */

export default class Route {

	private route: string;

	private pattern: string[];

	private action: any;

	private parameters: any[];

	constructor (route: string, action: any) {
		this.route = route;
		this.action = action;
		this.pattern = route.split ("/");
		this.parameters = [];
	}

	public match (route: string): boolean {
		let route_pattern = route.split ("/");

		if (route_pattern.length != this.pattern.length) {
			return false;
		}

		let optionals: number = (route.match(/\?/g) || []).length;

		if (optionals > 0){
		    if (this.pattern.length < (route_pattern.length - optionals)){
		        return false;
		    }
		}

		for (let i in this.pattern){

			if (this.pattern[i].indexOf ("{") > -1  && this.pattern[i].indexOf ("}") > -1) {
			    let name = this.pattern[i].replace (/\{|\}|\?/g, "");
				this.parameters.push (name);
			} else {
			    if (this.pattern[i] != route_pattern[i]){
					this.parameters = [];
			        return false;
			    }
			}
		}

		return true;
	}

	public run (): any {
		return this.action.apply (null, this.parameters);
	}

}