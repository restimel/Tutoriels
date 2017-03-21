importScripts('./baseURL.js');
var nomCache = "v1";

// installation du service worker
addEventListener("install", function(event) {
	event.waitUntil(
		caches.open(nomCache).then(function(cache) {
			// pré-chargement du cache
			return cache.addAll([
				baseURL + "baseURL.js",
				baseURL + "ex7.1.html",
				baseURL + "image1.svg"
			]);
		})
	);
});

// activation du service worker
addEventListener("activate", function(event) {
	event.waitUntil(
		caches.keys().then(function(listeCache) {
			return Promise.all(listeCache.map(function(nom) {
				if (nom !== nomCache) {
					// suppression des caches inutiles
					return caches.delete(nom);
				}
			}))
		})
		// force  l'écoute sur les pages actuellement ouverte
		.then(self.clients.claim())
	);
});

// interception des messages
addEventListener("fetch", function(event) {
	event.respondWith(
		caches.match(event.request).then(function(reponse) {
    		if (!reponse) {
				throw new Error("non trouvé");
    		}
    		return reponse;
    	}).catch(function() {
    		var requete;

    		if (event.request.url.endsWith("image2.svg")) {
    			// modification de la requête image2.svg
    			requete = fetch(event.request.url.replace(/image2/, "image1"));
    		} else {
    			// lance la requête sur le serveur
    			requete = fetch(event.request);
    		}

    		// ajoute la requete dans le cache
    		requete.then(function(reponse) {
    			// copie la reponse pour éviter de perdre les données
    			var copieReponse = reponse.clone();
    			//ajoute la réponse dans le cache si la réponse est correcte
				if (copieReponse.ok) {
					caches.open(nomCache).then(function(cache) {
						cache.put(event.request.url, copieReponse);
					});
				} else {
					throw new Error("erreur");
				}
    		}).catch(function() {
    			// création d'une réponse personnalisée
    			return new Response("fichier introuvable", {status: 404});
    		});

    		return requete;
    	})
	);
});