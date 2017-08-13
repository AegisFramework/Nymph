"use strict";


// Name of your cache, no spaces or special characters.
var name = "";

// The version of the cache, changing this will force everything to be cached
// again.
var version = "";

var files = [
	"index.html",

	// Style Sheets
	"style/font-awesome.min.css",
	"style/kayros.css",
	//"style/main.css",

	// Scripts
	"js/animatelo.min.js",
	"js/artemis.js",
	//"js/main.js",

	// Fonts
	"fonts/fontawesome-webfont.eot",
	"fonts/fontawesome-webfont.svg",
	"fonts/fontawesome-webfont.ttf",
	"fonts/fontawesome-webfont.woff",
	"fonts/fontawesome-webfont.woff2",
	"fonts/FontAwesome.otf",

	// Images
	"img/favicon.ico",
	"img/icons/icon_48x48.png",
	"img/icons/icon_60x60.png",
	"img/icons/icon_70x70.png",
	"img/icons/icon_76x76.png",
	"img/icons/icon_96x96.png",
	"img/icons/icon_128x128.png",
	"img/icons/icon_150x150.png",
	"img/icons/icon_152x152.png",
	"img/icons/icon_167x167.png",
	"img/icons/icon_180x180.png",
	"img/icons/icon_192x192.png",
	"img/icons/icon_310x310.png",
	"img/icons/icon_512x512.png"
];

self.addEventListener("install", function (event) {
	event.waitUntil(
		caches.open(`${name}-v${version}`).then(function (cache) {
			return cache.addAll(files);
		})
	);
});

self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.map(function (key) {
				if (key !== `${name}-v${version}`) {
					return caches.delete(key);
				}
			}));
		})
	);

	return self.clients.claim();
});

self.addEventListener("fetch", function (event) {
	if (event.request.method !== "GET") {
		return;
	}

	event.respondWith(
		caches.match(event.request).then(function (cached) {
			var networked = fetch(event.request)
							.then(fetchedFromNetwork, unableToResolve)
							.catch(unableToResolve);
			return cached || networked;

			function fetchedFromNetwork (response) {
				var cacheCopy = response.clone();

				caches.open(`${name}-v${version}`).then(function add (cache) {
					cache.put(event.request, cacheCopy);
				});

				return response;
			}

			function unableToResolve () {
				return new Response("<h1>Service Unavailable</h1>", {
					status: 503,
					statusText: "Service Unavailable",
					headers: new Headers({
						"Content-Type": "text/html"
					})
				});
			}
		})
	);
});