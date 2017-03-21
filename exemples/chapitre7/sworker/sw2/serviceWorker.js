// activation du service worker
addEventListener("activate", function(event) {
	event.waitUntil(self.clients.claim());
});

addEventListener("message", function(event) {
	event.source.postMessage("réponse à " + event.data);
	self.clients.matchAll().then(function(liste) {
	    liste.map(function(client) {
	        client.postMessage("Appel à tout le monde nous avons un nouveau!");
	    });
	});
});
