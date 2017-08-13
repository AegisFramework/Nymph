"use strict";

/* global $_ready */
/* global $_ */

// Register the service worker
if ("serviceWorker" in navigator) {
	if (location.protocol.indexOf ("http") > -1) {
		navigator.serviceWorker.register("service-worker.js");
	}
}

$_ready(function () {
	$_(".nav .menu-icon").click(function () {
		$_(this).parent().find("ul").toggleClass("active");
		$_(this).toggleClass("fa-bars fa-times");
	});

	$_(".nav li").click(function () {
		if ($_(".menu-icon").isVisible ()) {
			$_(".menu-icon").toggleClass("fa-bars fa-times");
			$_(this).parent().parent().find("ul").toggleClass("active");
		}
	});
});