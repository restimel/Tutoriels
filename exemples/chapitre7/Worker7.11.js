//gestion des messages
function dialogue(event) {
	if (event.data === "Bonjour") {
		throw new Error("J'aime pas dire bonjour"); //génération d'une erreur
	}
}

//gestion des messages
addEventListener("message", dialogue);

//gestion des erreurs en interne
addEventListener("error", function(e) {
	postMessage("J'ai une erreur : " + e.message);
});
