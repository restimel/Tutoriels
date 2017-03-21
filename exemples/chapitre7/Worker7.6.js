//réception d'un message
function reponse(event) {
	if (event.data === "Bonjour") {
		postMessage("Bonjour, je suis un worker");
	} else {
		postMessage("Maintenant je sais que tu es " + event.data.substr(26) + " !");
	}
};

//ajout d'un listener
addEventListener("message", reponse, false);