self.onmessage=function(e){
	var port=e.ports[0]; //on récupère le port qui a été transféré
	port.postMessage("Hello canal"); //on envoie un message dans le canal
}
