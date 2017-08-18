import Template from "./../class/Template";

/**
 * Class for the main template
 *
 * Any information requested by the template will be provided by this class
 * as well as it's behaviour.
 */

export default class main extends Template {

	// Set Meta Tags Information.
	protected _title: String = "Aegis Framework";
	protected _version: String = "NYMPH";

    // Set what page and template should be used to render this template.
    constructor () {
		super ();
        this.setPage("home.html");
    	this.setTemplate("main.html");
    }
}