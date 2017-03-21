var num = 0;

//ajout d'un listener de connexion
addEventListener("connect",
	function(e) {
		var port = e.ports[0];
		port.postMessage("Pret #" + num);
		num++;

		//On écoute sur le port
		port.addEventListener("message",
			function(e) {
				port.postMessage("Réponse à " + e.data);
			},
			false
		);

		port.start(); //Pour démarrer la réception des messages sur ce port
	},
	false
);