onmessage=function(event){ //réception d'un message
	if(event.data == "Bonjour"){ //lecture du message
		postMessage("Bonjour, je suis un worker"); //envoi d'un message
	}else{
		postMessage("Maintenant je sais que tu es "+event.data.substr(26)+" !"); //envoi d'un message
	}
};

