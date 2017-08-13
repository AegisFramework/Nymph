import Aegis from "./lib/Aegis";
import Router from "./lib/class/Router"
import main from "./lib/templates/main"


Router.get ("/", () => {
	return new main ().toString ();
});

Router.listen ();