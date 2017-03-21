if (self.Worker) {
	// on crée un nouveau worker
	var w = new Worker("Worker7.14_2.js");
	w.addEventListener("message", function(event) {
		// transmission du message au parent (en le modifiant)
		postMessage('Worker2 a ce message pour toi : "' + event.data + '"');
	}, false);

	// gestion de la communication avec le parent 
	addEventListener("message", function(event) {
		/* transmition du message au worker (sans changement)*/
		w.postMessage(event.data);
	}, false);
} else {
	// le navigateur ne gère pas les workers dans un worker
	postMessage("Votre navigateur ne supporte pas les Workers dans les Workers ");
}