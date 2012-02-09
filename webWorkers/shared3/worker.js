var num = 0;

// ajout d'un listener de connexion
addEventListener("connect",function(e){

	var port = e.ports[0]; //sauvegarde du port
	port.postMessage("Pret #"+num);
	num++;

	// ajout d'un listener de message sur le port
	port.addEventListener("message",function(e){
		port.postMessage("Réponse à "+e.data);
	},false);

	port.start(); // Très important pour démarrer la réception des messages sur ce port

},false);

