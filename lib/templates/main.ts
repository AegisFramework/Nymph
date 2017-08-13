import Template from "./../class/Template";

export default class main extends Template {
	// Set Meta Tags Information.

	protected properties = {
		"_title": "Aegis Framework",
		"_version": "NYMPH"
	}
    // Set what page and template should be used to render this template.
    constructor () {
		super ();
        this.setPage("home.html");
    	this.setTemplate("main.html");
    }
}