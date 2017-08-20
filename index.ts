/**
 * ==============================
 * Aegis Framework | MIT License
 * http://www.aegisframework.com/
 * ==============================
 */


 /**
 * Include all modules
 *
 * This includes needed modules such as templates
 */

import Aegis from "./lib/Aegis";
import Router from "./lib/class/Router"
import Request from "./lib/class/Request"
import main from "./lib/templates/main"
import DB from "./lib/class/DB"
import Config from "./lib/class/Config"


/**
 * Debugging logs are shown on errors by default, to disable them,
 * uncomment the following line.
 */

//Aegis.debugging = false;


// Connect to the Database
// DB.connect (Config.get ("DB_User"), Config.get ("DB_Password"), Config.get ("DB"));

/**
 * Register Routes
 *
 * Register all the custom routes for your site, the callback function
 * will be executed when the route is accessed.
 */

Router.get ("/", () => {
	return new main ().toString ();
});

/**
 * Make the router listen to requests.
 *
 * The router will now match any request to the previously registered
 * routes and run the callback function of the match.
 */

Router.listen ();